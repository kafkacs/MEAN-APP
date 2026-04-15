import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { Car } from './car/car';
import { CarI } from './interfaces/car.interface';
import { CarsApisService } from './cars-apis-service';
import { FilterCarsDto } from './dtos/filter-cars.dto';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage/storage';

export type CarStatus = 'true' | 'false';

@Component({
  selector: 'app-cars',
  imports: [Car],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars implements OnInit, OnDestroy {
  private readonly carsApisService = inject(CarsApisService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);
  private readonly storageService = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);

  user = signal(this.storageService.loggedInUser);
  isLoggedIn = computed(() => !!this.user());

  cars = signal<CarI[]>([]);

  private scrollListenerFn!: () => void;
  private throttleTimer: NodeJS.Timeout | null = null;

  readonly limit = signal<number>(20);
  readonly lastFetchedCount = signal<number>(-1);
  readonly isFetching = signal<boolean>(false);

  readonly statusOptions: (CarStatus | 'all')[] = ['all', 'true', 'false'];
  readonly activeStatus = signal<CarStatus | 'all'>('all');

  get hasActiveFilters(): boolean {
    return this.activeStatus() !== 'all';
  }

  ngOnInit(): void {
    this.findAllCars({ skip: 0, limit: this.limit() }, false);
    this.setupScrollListener();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onStatusChange(status: CarStatus | 'all'): void {
    if (this.activeStatus() === status) return;
    this.activeStatus.set(status);
    this.resetAndFetch();
  }

  clearFilters(): void {
    this.activeStatus.set('all');
    this.resetAndFetch();
  }

  private resetAndFetch(): void {
    this.lastFetchedCount.set(-1);
    this.findAllCars({ skip: 0, limit: this.limit() }, false);
  }

  private buildFilters(): Partial<FilterCarsDto> {
    const filters: Partial<FilterCarsDto> = {};
    if (this.activeStatus() !== 'all')
      filters.available = (this.activeStatus() as CarStatus) === 'true';
    return filters;
  }

  findAllCars(filterCarsDto: FilterCarsDto, isOnScroll: boolean): void {
    if (this.isFetching()) return;

    this.isFetching.set(true);

    this.carsApisService
      .findAllCars({
        limit: this.limit(),
        skip: isOnScroll ? filterCarsDto.skip : 0,
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
            this.cars.update((prev) => [...prev, ...incoming]);
          } else {
            this.cars.set(incoming);
          }
        },
        error: (err: DelegatedUIErrorI) => {
          if (!isOnScroll) this.cars.set([]);
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

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollableHeight - 200) {
      this.findAllCars({ skip: this.cars().length, limit: this.limit() }, true);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListenerFn) this.scrollListenerFn();
    if (this.throttleTimer) clearTimeout(this.throttleTimer);
  }
}
