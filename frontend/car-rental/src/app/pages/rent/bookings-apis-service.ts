import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { BookingCreateDto } from './dtos/booking-create.dto';

@Injectable({
  providedIn: 'root',
})
export class BookingsApisService {
  private readonly apis = inject(Apis);

  createBooking(dto: BookingCreateDto) {
    return this.apis.post('bookings', dto);
  }
}
