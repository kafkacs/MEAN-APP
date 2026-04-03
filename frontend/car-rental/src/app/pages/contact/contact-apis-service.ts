import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { CreateMessageDto } from './dtos/create-message.dto';

@Injectable({
  providedIn: 'root',
})
export class ContactApisService {
  private readonly apis = inject(Apis);

  createMessage(createMessageDto: CreateMessageDto) {
    return this.apis.post('messages', createMessageDto);
  }
}
