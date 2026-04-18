import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { StorageService } from '../../core/services/storage/storage';
import { AuthApisService } from '../auth/auth-apis-service';
import { UserI } from '../../shared/interfaces/user.interface';
import { BookingI } from '../bookings/interfaces/booking.interface';
import { BookingsApisService } from '../bookings/bookings-apis-service';
import { DatePipe, NgClass } from '@angular/common';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { ChangePasswordDialog } from '../auth/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-profile',
  imports: [NgClass, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly storageService = inject(StorageService);
  private readonly authApisService = inject(AuthApisService);
  private readonly bookingsApisService = inject(BookingsApisService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  user = signal<UserI | null>(null);
  isLoading = signal(true);
  bookings = signal<BookingI[]>([]);
  isLoadingBookings = signal(true);

  constructor() {
    effect(() => {
      const token = this.storageService.accessToken;

      if (!token) {
        this.isLoading.set(false);
        return;
      }

      this.fetchUser(token);
    });
  }

  fetchUser(token: string) {
    this.authApisService
      .findLoggedInUser(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const { data } = res;
          this.storageService.loggedInUser = data;
          this.user.set(data);
          this.isLoading.set(false);

          this.fetchBookings(data._id!);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('User fetch error:', err);
          this.isLoading.set(false);
        },
      });
  }

  private fetchBookings(userId: string) {
    this.bookingsApisService
      .findAllForUser(userId, { skip: 0, limit: 30 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.bookings.set(res.data);
          this.isLoadingBookings.set(false);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Bookings error:', err);
          this.isLoadingBookings.set(false);
        },
      });
  }

  openChangePasswordDialog() {
    this.dialogService.openDialog(ChangePasswordDialog);
  }
}
