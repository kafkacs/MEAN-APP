import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { BookingI } from './interfaces/booking.interface';
import { FilterBookingsDto } from './dtos/filter-bookings.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Injectable({
  providedIn: 'root',
})
export class BookingsApisService {
  private readonly apis = inject(Apis);

  findAllBookings(filterBookingsDto?: FilterBookingsDto) {
    return this.apis.get<BookingI[]>('bookings', filterBookingsDto);
  }

  findAllForUser(userID: string, filterBookingsDto?: FilterBookingsDto) {
    return this.apis.get<BookingI[]>(`bookings/user/${userID}`, filterBookingsDto);
  }

  findOneBooking(bookingID: string) {
    return this.apis.get<BookingI>(`bookings/${bookingID}`);
  }

  updateBooking(bookingID: string, updateBookingDto: UpdateBookingDto) {
    return this.apis.patch<BookingI>(`bookings/${bookingID}`, updateBookingDto);
  }
}
