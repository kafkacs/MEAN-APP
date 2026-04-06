import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { Car } from './car/car';
import { CarI } from './interfaces/car.interface';
import { CarsApisService } from './cars-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { FilterCarsDto } from './dtos/filter-cars.dto';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage/storage';

@Component({
  selector: 'app-cars',
  imports: [Car],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars implements OnInit {
  private readonly carsApisService = inject(CarsApisService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);
  private readonly storageService = inject(StorageService);

  private destroyRef = inject(DestroyRef);

  user = signal(this.storageService.loggedInUser);

  isLoggedIn = computed(() => !!this.user());

  cars = signal<CarI[]>([]);

  scrollListenerFn!: () => void;
  throttleTimer!: NodeJS.Timeout | null;

  skip = signal<number>(0);
  limit = signal<number>(20);
  lastFetchedCount = signal<number>(-1);
  isFetching = signal<boolean>(false);

  ngOnInit(): void {
    this.findAllCars({ skip: 0, limit: this.limit() }, false);
  }

  goToLogin() {
    this.router.navigate([`/auth/login`]);
  }

  findAllCars(filterCarsDto: FilterCarsDto, isOnScroll: boolean) {
    this.carsApisService
      .findAllCars({
        limit: this.limit(),
        skip: isOnScroll ? filterCarsDto.skip : 0,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isFetching.update(() => false);
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (productsFindResponse) => {
          this.cars.set(productsFindResponse.data);
        },
        error: (err: DelegatedUIErrorI) => {
          this.cars.set([]);
          console.log(err.description, err.title);
        },
      });
  }

  setupScrollListener() {
    this.scrollListenerFn = this.renderer.listen('window', 'scroll', () => {
      if (this.throttleTimer) return;

      this.throttleTimer = setTimeout(() => {
        this.checkScrollPosition();
        this.throttleTimer = null;
      }, 200);
    });
  }

  checkScrollPosition() {
    if (this.isFetching() || this.lastFetchedCount() === 0) return;
    if (this.lastFetchedCount() < this.limit()) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const threshold = 200;

    if (scrollPosition >= scrollableHeight - threshold) {
      this.findAllCars(
        {
          skip: this.cars().length,
          limit: this.limit(),
        },
        true,
      );
    }
  }
}
