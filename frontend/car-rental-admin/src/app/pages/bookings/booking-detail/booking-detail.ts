import { DatePipe, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingI } from '../interfaces/booking.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookingsApisService } from '../bookings-apis-service';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';

@Component({
  selector: 'app-booking-detail',
  imports: [DatePipe, SlicePipe],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.scss',
})
export class BookingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private bookingsApisService = inject(BookingsApisService);

  private readonly statusOrder = ['pending', 'confirmed', 'completed'];

  booking = signal<BookingI | null>(null);
  bookingID = signal<string>('');
  loading = signal(true);
  statusUpdating = signal(false);
  statusSuccess = signal(false);
  statusError = signal(false);

  timelineSteps = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
  ];

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  ngOnInit() {
    this.getBookingIDFromRoute();
  }

  getBookingIDFromRoute() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const bookingID = paramMap.get('bookingID');
      if (!bookingID) {
        console.error('No Booking ID provided in route');
      } else {
        this.bookingID.set(bookingID);
        this.findOneBooking(bookingID);
      }
    });
  }

  findOneBooking(bookingID: string) {
    this.loading.set(true);
    this.bookingsApisService
      .findOneBooking(bookingID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.booking.set(res.data);
          this.loading.set(false);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
          this.loading.set(false);
        },
      });
  }

  onStatusChange(event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    const current = this.booking();
    if (!current || newStatus === current.status) return;

    this.statusUpdating.set(true);
    this.statusSuccess.set(false);
    this.statusError.set(false);

    //  this.bookingsApisService
    //   .updateBooking(current._id, { status: newStatus })
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: () => {
    //       this.booking.update((b) =>
    //         b ? { ...b, status: newStatus as BookingI['status'] } : b
    //       );
    //       this.statusUpdating.set(false);
    //       this.statusSuccess.set(true);
    //       setTimeout(() => this.statusSuccess.set(false), 3000);
    //     },
    //     error: (err: DelegatedUIErrorI) => {
    //       console.error(err.description, err.title);
    //       this.statusUpdating.set(false);
    //       this.statusError.set(true);
    //       setTimeout(() => this.statusError.set(false), 4000);
    //     },
    //   });
  }

  isStepDone(stepValue: string): boolean {
    const current = this.booking()?.status;
    if (!current) return false;
    const currentIdx = this.statusOrder.indexOf(current);
    const stepIdx = this.statusOrder.indexOf(stepValue);
    return currentIdx >= stepIdx;
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  downloadImage() {
    const url = this.booking()?.imageUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booking-license';
    a.click();
  }
}
