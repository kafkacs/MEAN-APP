import { Component, DestroyRef, inject, model, ModelSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BookingI } from '../interfaces/booking.interface';
import { BookingsApisService } from '../bookings-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remove-booking-dialog',
  imports: [TranslateModule],
  templateUrl: './remove-booking-dialog.html',
  styleUrl: './remove-booking-dialog.scss',
})
export class RemoveBookingDialog {
  private readonly dialogService = inject(DialogService);
  private readonly bookingsApisService = inject(BookingsApisService);
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  booking: ModelSignal<BookingI> = model.required<BookingI>();

  removeBooking() {
    this.bookingsApisService
      .deleteBooking(this.booking()._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deleteResponse) => {
          const { data } = deleteResponse;
          console.log('Booking removed successfully:', data);
          this.dialogService.closeDialog();
          this.router.navigate([`/bookings`]);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Error removing car:', err);
        },
      });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
