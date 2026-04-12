import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component, model, ModelSignal } from '@angular/core';
import { BookingI } from '../interfaces/booking.interface';

@Component({
  selector: 'app-booking',
  imports: [DatePipe, NgClass, UpperCasePipe],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  booking: ModelSignal<BookingI> = model.required<BookingI>();
}
