import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { StorageService } from '../../core/services/storage/storage';
import { AuthApisService } from '../auth/auth-apis-service';
import { UserI } from '../../shared/interfaces/user.interface';
import { BookingI } from '../bookings/interfaces/booking.interface';
import { BookingsApisService } from '../bookings/bookings-apis-service';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [NgClass, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly storageService = inject(StorageService);
  private readonly authApisService = inject(AuthApisService);
  private readonly bookingsApisService = inject(BookingsApisService);

  private readonly destroyRef = inject(DestroyRef);

  user = signal<UserI | null>(null);
  isLoading = signal(true);
  bookings = signal<BookingI[]>([]);
  isLoadingBookings = signal(true);

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authApisService
      .findLoggedInUser(this.storageService.accessToken!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (loggedInResponse) => {
          const { data } = loggedInResponse;
          this.storageService.loggedInUser = data;
          this.user.set(data);
          this.isLoading.set(false);
          this.findAllUserBookings();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
          this.isLoading.set(false);
        },
      });
  }

  findAllUserBookings() {
    this.bookingsApisService
      .findAllForUser(this.user()!._id!, { skip: 0, limit: 30 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const { data } = response;
          this.bookings.set(data);
          this.isLoadingBookings.set(false);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Error fetching user bookings:', err);
          this.isLoadingBookings.set(false);
        },
      });
  }
}
