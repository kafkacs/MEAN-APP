import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { FilterContactsDto } from './dtos/filter-contacts.dto';
import { ContactI } from './interfaces/contact.interface';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Injectable({
  providedIn: 'root',
})
export class ContactApisService {
  private readonly apis = inject(Apis);

  findAllContacts(filterContactsDto?: FilterContactsDto) {
    return this.apis.get<ContactI[]>('messages', filterContactsDto);
  }

  updateContact(contactID: string, updateContactDto: UpdateContactDto) {
    return this.apis.patch<ContactI>(`messages/${contactID}`, updateContactDto);
  }

  removeContact(contactID: string) {
    return this.apis.delete<ContactI>(`messages/${contactID}`);
  }
}
