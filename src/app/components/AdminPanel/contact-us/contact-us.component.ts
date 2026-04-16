import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactUsService } from '../../../Services/contact-us.service';
import { APIContact, RespondContactUsDto, UpdateStatusRequest } from '../../../models/contact-us';
import { RequestBody } from '../../../models/rquest';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, startWith, catchError, of, Subject, map } from 'rxjs';

@Component({
    selector: 'app-admin-contact-us',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact-us.component.html',
    styleUrl: './contact-us.component.scss'
})
export class AdminContactUsComponent {
    private service = inject(ContactUsService);

    private refresh$ = new Subject<void>();

    contacts = signal<APIContact[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);
    selectedContact = signal<APIContact | null>(null);
    respondText = signal('');
    submitting = signal(false);

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

    selectContact(contact: APIContact) {
        this.selectedContact.set(contact);
        this.respondText.set('');
        if (!contact.isRead) {
            this.service.markAsRead(contact.oid, { isRead: true }).subscribe(() => {
                this.contacts.update(list =>
                    list.map(c => c.oid === contact.oid ? { ...c, isRead: true } : c)
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
}
