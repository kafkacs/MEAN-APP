import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component, inject, model, ModelSignal } from '@angular/core';
import { BookingI } from '../interfaces/booking.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  imports: [DatePipe, NgClass, UpperCasePipe],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  private readonly router = inject(Router);

  booking: ModelSignal<BookingI> = model.required<BookingI>();

  goToDetails() {
    this.router.navigate([`booking/${this.booking()._id}`]);
  }
}
