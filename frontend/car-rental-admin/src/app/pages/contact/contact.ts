import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ContactI } from './interfaces/contact.interface';
import { ContactApisService } from './contact-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { DatePipe, SlicePipe } from '@angular/common';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { RemoveContactDialog } from './remove-contact-dialog/remove-contact-dialog';
import { ContactService } from './contact-service';
import { ContactDetails } from './contact-details/contact-details';

@Component({
  selector: 'app-contact',
  imports: [SlicePipe, DatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly contactApisService = inject(ContactApisService);
  private readonly contactService = inject(ContactService);
  private readonly dialogService = inject(DialogService);

  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.removeContactListener();
    });
  }

  contacts = signal<ContactI[]>([]);
  total = signal(0);

  page = signal(1);
  limit = 10;

  ngOnInit() {
    this.findAllContacts();
  }

  findAllContacts() {
    const skip = (this.page() - 1) * this.limit;

    this.contactApisService
      .findAllContacts({
        limit: this.limit,
        skip: skip,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.contacts.set(res.data);
        },
        error: (err: DelegatedUIErrorI) => {
          this.contacts.set([]);
          console.log(err.description, err.title);
        },
      });
  }

  changePage(newPage: number) {
    this.page.set(newPage);
    this.findAllContacts();
  }

  changeStatus(contact: ContactI, event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.contactApisService
      .updateContact(contact._id, { status: value })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          contact.status = value as any;
          console.log('Status updated successfully', res);
        },
      });
  }

  removeContactListener() {
    if (!!this.contactService.removeContact()) {
      this.contacts().splice(
        this.contacts().findIndex(
          (contact) => contact._id === this.contactService.removeContact()!._id,
        ),
        1,
      );
      this.contactService.removeContact.set(null);
    }
  }

  deleteContact(contact: ContactI) {
    this.dialogService.openDialog(RemoveContactDialog, { contact: contact });
  }

  editContact(contact: ContactI) {
    this.dialogService.openDialog(ContactDetails, { contact: contact });
  }
}
