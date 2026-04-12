import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { BookingI } from './interfaces/booking.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookingsApisService } from './bookings-apis-service';
import { FilterBookingsDto } from './dtos/filter-bookings.dto';
import { finalize } from 'rxjs/internal/operators/finalize';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { Booking } from './booking/booking';
import { FormsModule } from '@angular/forms';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Component({
  selector: 'app-bookings',
  imports: [Booking, FormsModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings implements OnInit, OnDestroy {
  private bookingsApisService = inject(BookingsApisService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  bookings = signal<BookingI[]>([]);

  private scrollListenerFn!: () => void;
  private throttleTimer: NodeJS.Timeout | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;

  readonly limit = signal<number>(20);
  readonly lastFetchedCount = signal<number>(-1);
  readonly isFetching = signal<boolean>(false);

  readonly statusOptions: (BookingStatus | 'all')[] = [
    'all',
    'pending',
    'confirmed',
    'completed',
    'cancelled',
  ];
  readonly activeStatus = signal<BookingStatus | 'all'>('all');
  readonly startDateFilter = signal<string>('');

  ngOnInit(): void {
    this.findAllBookings({ skip: 0, limit: this.limit() }, false);
    this.setupScrollListener();
  }

  onStatusChange(status: BookingStatus | 'all'): void {
    if (this.activeStatus() === status) return;
    this.activeStatus.set(status);
    this.resetAndFetch();
  }

  onStartDateChange(value: string): void {
    this.startDateFilter.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.resetAndFetch();
    }, 400);
  }

  clearFilters(): void {
    this.activeStatus.set('all');
    this.startDateFilter.set('');
    this.resetAndFetch();
  }

  get hasActiveFilters(): boolean {
    return this.activeStatus() !== 'all' || !!this.startDateFilter();
  }

  private resetAndFetch(): void {
    this.lastFetchedCount.set(-1);
    this.findAllBookings({ skip: 0, limit: this.limit() }, false);
  }

  private buildFilters(): Partial<FilterBookingsDto> {
    const filters: Partial<FilterBookingsDto> = {};
    if (this.activeStatus() !== 'all') filters.status = this.activeStatus() as BookingStatus;
    if (this.startDateFilter()) filters.startDate = this.startDateFilter();
    return filters;
  }

  findAllBookings(filterBookingsDto: FilterBookingsDto, isOnScroll: boolean) {
    if (this.isFetching()) return;

    this.isFetching.set(true);

    this.bookingsApisService
      .findAllBookings({
        limit: this.limit(),
        skip: isOnScroll ? filterBookingsDto.skip! : 0,
        ...this.buildFilters(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isFetching.set(false);
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          const incoming = response.data;
          this.lastFetchedCount.set(incoming.length);

          if (isOnScroll) {
            this.bookings.update((prev) => [...prev, ...incoming]);
          } else {
            this.bookings.set(incoming);
          }
        },
        error: (err: DelegatedUIErrorI) => {
          if (!isOnScroll) this.bookings.set([]);
          console.error(err.title, err.description);
        },
      });
  }

  private setupScrollListener(): void {
    this.scrollListenerFn = this.renderer.listen('window', 'scroll', () => {
      if (this.throttleTimer) return;
      this.throttleTimer = setTimeout(() => {
        this.checkScrollPosition();
        this.throttleTimer = null;
      }, 200);
    });
  }

  private checkScrollPosition(): void {
    if (this.isFetching()) return;
    if (this.lastFetchedCount() === 0) return;
    if (this.lastFetchedCount() < this.limit()) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollableHeight - 200) {
      this.findAllBookings({ skip: this.bookings().length, limit: this.limit() }, true);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListenerFn) this.scrollListenerFn();
    if (this.throttleTimer) clearTimeout(this.throttleTimer);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}
