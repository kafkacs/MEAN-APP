import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersApisService } from '../users-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, Location } from '@angular/common';
import { UserI } from '../../../shared/interfaces/user.interface';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { BookingsApisService } from '../../bookings/bookings-apis-service';
import { BookingI } from '../../bookings/interfaces/booking.interface';

@Component({
  selector: 'app-user-details',
  imports: [DatePipe],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private usersApisService = inject(UsersApisService);
  private bookingsApisService = inject(BookingsApisService);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);

  user = signal<UserI | null>(null);
  userID = signal<string>('');

  bookings = signal<BookingI[]>([]);

  ngOnInit() {
    this.getUserIDFromRoute();
  }

  getUserIDFromRoute() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const userID = paramMap.get('userID');
      if (!userID) {
        console.error('No Car ID provided in route');
      } else {
        this.userID.set(userID);
        this.findOneUser(userID);
      }
    });
  }

  findOneUser(userID: string) {
    this.usersApisService
      .findOneUser(userID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.user.set(res.data);
          this.findAllBookingsForUser(userID);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
        },
      });
  }

  findAllBookingsForUser(userID: string) {
    this.bookingsApisService
      .findAllForUser(userID, { skip: 0, limit: 20 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.bookings.set(res.data);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
        },
      });
  }

  onStatusChange() {
    this.usersApisService
      .removeUser(this.user()?._id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deleteResponse) => {
          const { data } = deleteResponse;
          this.user.set(data);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Error removing user:', err);
        },
      });
  }

  goBack() {
    this.location.back();
  }
}
