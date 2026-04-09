import { Injectable, signal } from '@angular/core';
import { FilterContactsDto } from './dtos/filter-contacts.dto';
import { ContactI } from './interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  filterContacts = signal<FilterContactsDto | null>(null);

  updateContact = signal<ContactI | null>(null);

  createContact = signal<ContactI | null>(null);

  removeContact = signal<ContactI | null>(null);
}
