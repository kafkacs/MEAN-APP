import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { BookingI } from './interfaces/booking.interface';
import { FilterBookingsDto } from './dtos/filter-bookings.dto';

@Injectable({
  providedIn: 'root',
})
export class BookingsApisService {
  private readonly apis = inject(Apis);

  findAllCars(filterBookingsDto?: FilterBookingsDto) {
    return this.apis.get<BookingI[]>('bookings', filterBookingsDto);
  }

  findAllForUser(userID: string, filterBookingsDto?: FilterBookingsDto) {
    return this.apis.get<BookingI[]>(
      `bookings/user/${userID}`,
      filterBookingsDto,
    );
  }
}
