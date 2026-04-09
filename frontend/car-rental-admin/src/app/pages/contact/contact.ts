import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ContactI } from './interfaces/contact.interface';
import { ContactApisService } from './contact-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [SlicePipe, DatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly contactApisService = inject(ContactApisService);

  private destroyRef = inject(DestroyRef);

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
        next: () => {
          contact.status = value as any;
        },
      });
  }

  deleteContact(_id: string) {
    // if (!confirm('Delete this contact?')) return;
    // this.contactsService.delete(id).subscribe(() => {
    //   this.fetchContacts();
    // });
  }

  editContact(contact: ContactI) {
    console.log('Edit:', contact);
  }
}
