import { Component, inject, signal, computed } from '@angular/core';
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

  private refresh$ = new Subject<void>();

  contacts = signal<APIContact[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedContact = signal<APIContact | null>(null);
  respondText = signal('');
  submitting = signal(false);
  search = signal<string>('');

  filteredContacts = computed(() => {
    const search = this.search().toLowerCase().trim();

    if (!search) return this.contacts();

    return this.contacts().filter(c =>
      (c.contactTypeName ?? '').toLowerCase().includes(search) ||
      (c.fullName ?? '').toLowerCase().includes(search) ||
      (c.email ?? '').toLowerCase().includes(search)
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

  deleteContact(id: string) {
    this.service.deleteContact(id).subscribe(() => {
      this.contacts.update(list => list.filter(c => c.oid !== id));
      if (this.selectedContact()?.oid === id) this.selectedContact.set(null);
    });
  }

  onFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    if (this.selectedContact()) {
      this.selectedContact.set(null);
    }
  }

  deleteAttachment(id: string) {

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
