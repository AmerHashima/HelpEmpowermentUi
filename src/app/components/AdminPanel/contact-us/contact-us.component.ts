import { Component, inject, signal, computed } from '@angular/core';
import { confirmDelete } from '../../../shared/utils/confirm-delete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactUsService } from '../../../Services/contact-us.service';
import { APIContact, RespondContactUsDto, UpdateStatusRequest } from '../../../models/contact-us';
import { RequestBody } from '../../../models/rquest';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, startWith, catchError, of, Subject, map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-admin-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class AdminContactUsComponent {
  attachmentUrl = signal<string | null>(null);
  // attachmentUrls = signal<string[]>([]);
  toasting=inject(ToastingMessagesService);
  hasAttachment = signal(false);
  private service = inject(ContactUsService);
  private reviewChannel = new BroadcastChannel('reviews');
  private refresh$ = new Subject<void>();

  contacts = signal<APIContact[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedContact = signal<APIContact | null>(null);
  respondText = signal('');
  submitting = signal(false);
  search = signal<string>('');
  activeContactType = signal('all');

  contactTypeTabs = computed(() => {
    const types = new Map<string, { key: string; label: string; count: number; unread: number }>();

    for (const contact of this.contacts()) {
      const label = contact.contactTypeName?.trim() || 'Other';
      const key = label.toLowerCase();
      const current = types.get(key) ?? { key, label, count: 0, unread: 0 };
      current.count += 1;
      current.unread += contact.isRead ? 0 : 1;
      types.set(key, current);
    }

    return [...types.values()].sort((a, b) => a.label.localeCompare(b.label));
  });

  allUnreadCount = computed(() => this.contacts().filter(contact => !contact.isRead).length);

  filteredContacts = computed(() => {
    const search = this.search().toLowerCase().trim();
    const activeType = this.activeContactType();

    const contactsByType = activeType === 'all'
      ? this.contacts()
      : this.contacts().filter(contact =>
          (contact.contactTypeName?.trim() || 'Other').toLowerCase() === activeType
        );

    if (!search) return contactsByType;

    return contactsByType.filter(c =>
      (c.contactTypeName ?? '').toLowerCase().includes(search) ||
      (c.fullName ?? '').toLowerCase().includes(search) ||
      (c.email ?? '').toLowerCase().includes(search) ||
      (c.subject ?? '').toLowerCase().includes(search) ||
      (c.ticketNumber ?? '').toLowerCase().includes(search)
    );
  });

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading.set(true);
    this.error.set(null);
    const body: RequestBody = {
      filters: [],
      sort: [{ sortBy: 'createdAt', sortDirection: 'desc' }],
      pagination: { getAll: true, pageNumber: 0, pageSize: 0 },
      columns: []
    };
    this.service.search(body).subscribe({
      next: data => { this.contacts.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load messages.'); this.loading.set(false); }
    });
  }





  // selectContact(contact: APIContact) {
  //     this.selectedContact.set(contact);
  //     this.respondText.set('');
  //     if (!contact.isRead) {
  //         this.service.markAsRead(contact.oid, { isRead: true }).subscribe(() => {
  //             this.contacts.update(list =>
  //                 list.map(c => c.oid === contact.oid ? { ...c, isRead: true } : c)
  //             );
  //         });
  //     }
  // }

  selectContact(contact: APIContact) {

    this.selectedContact.set(contact);

    this.respondText.set('');

    // RESET
    this.attachmentUrl.set(null);

    this.hasAttachment.set(false);

    // ONLY THESE TYPES SUPPORT ATTACHMENTS
    const hasFileSupport = [
      'Job Seeker',
      'Post Vacancy'
    ].includes(contact.contactTypeName ?? '');

    // CHECK FILE ONLY FOR SUPPORTED TYPES
    if (hasFileSupport) {

      this.service.getAttachment(contact.oid).subscribe({

        next: () => {

          this.hasAttachment.set(true);

          this.attachmentUrl.set(
            this.service.getAttachmentUrl(contact.oid)
          );
        },

        error: () => {

          this.hasAttachment.set(false);

          this.attachmentUrl.set(null);
        }
      });
    }

    // MARK AS READ
    if (!contact.isRead) {

      this.service.markAsRead(
        contact.oid,
        { isRead: true }
      ).subscribe(() => {

        this.contacts.update(list =>
          list.map(c =>
            c.oid === contact.oid
              ? { ...c, isRead: true }
              : c
          )
        );
      });
    }
  }

  sendResponse() {
    const contact = this.selectedContact();
    const text = this.respondText().trim();
    if (!contact || !text) return;

    this.submitting.set(true);
    const body: RespondContactUsDto = { response: text };
    this.service.respond(contact.oid, body).subscribe({
      next: updated => {
        this.selectedContact.set(updated);
        this.contacts.update(list =>
          list.map(c => c.oid === updated.oid ? updated : c)
        );
        this.respondText.set('');
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  updateStatus(id: string, statusLookupId: string) {
    const body: UpdateStatusRequest = { statusLookupId };
    this.service.updateStatus(id, body).subscribe(() => this.loadContacts());
  }

  async deleteContact(id: string,type:string) {
    if (!(await confirmDelete('Are you sure you want to delete this contact?'))) return;
    this.service.deleteContact(id).subscribe(() => {
      this.contacts.update(list => list.filter(c => c.oid !== id));
      if (this.selectedContact()?.oid === id) this.selectedContact.set(null);
      if (

        (type ?? '').toLowerCase() === 'certification review'

      ) {

        this.reviewChannel.postMessage({

          type: 'REVIEW_DELETED',

          reviewId: id

        });

      }
    });
  }

  onFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    if (this.selectedContact()) {
      this.selectedContact.set(null);
    }
  }

  selectContactType(type: string): void {
    if (this.activeContactType() === type) return;

    this.activeContactType.set(type);
    this.selectedContact.set(null);
    this.attachmentUrl.set(null);
    this.hasAttachment.set(false);
    this.respondText.set('');
  }

  exportToExcel(): void {
    const contacts = this.filteredContacts();
    if (!contacts.length) return;

    const rows = contacts.map(contact => ({
      'Ticket Number': contact.ticketNumber ?? '',
      'Contact Type': contact.contactTypeName ?? '',
      'Name': contact.fullName ?? '',
      'Arabic Name': contact.fullNameAr ?? '',
      'Email': contact.email ?? '',
      'Phone': contact.phone || contact.mobile || '',
      'Subject': contact.subject ?? '',
      'Arabic Subject': contact.subjectAr ?? '',
      'Message': contact.message ?? '',
      'Arabic Message': contact.messageAr ?? '',
      'Priority': contact.priorityName ?? '',
      'Status': contact.statusName || 'Open',
      'Read': contact.isRead ? 'Yes' : 'No',
      'Created At': this.formatExportDate(contact.createdAt),
      'Read At': this.formatExportDate(contact.readAt),
      'Response': contact.response ?? '',
      'Responded At': this.formatExportDate(contact.respondedAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 18 }, { wch: 20 }, { wch: 24 }, { wch: 24 },
      { wch: 28 }, { wch: 18 }, { wch: 32 }, { wch: 32 },
      { wch: 55 }, { wch: 55 }, { wch: 14 }, { wch: 14 },
      { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 45 }, { wch: 22 }
    ];
    if (worksheet['!ref']) {
      worksheet['!autofilter'] = { ref: worksheet['!ref'] };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');

    const activeType = this.activeContactType() === 'all'
      ? 'All'
      : this.activeContactType().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Messages_${activeType || 'Filtered'}_${date}.xlsx`);
    this.toasting.showToast('Messages exported successfully', 'success');
  }

  private formatExportDate(value: string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-GB');
  }

  async deleteAttachment(id: string) {
    if (!(await confirmDelete('Are you sure you want to delete this attachment?'))) return;

    this.service.deleteAttachment(id).subscribe({

      next: () => {

        this.hasAttachment.set(false);

        this.attachmentUrl.set(null);

        this.toasting.showToast(

          'Attachment deleted successfully',

          'success'

        );

      }

    });

  }
}
