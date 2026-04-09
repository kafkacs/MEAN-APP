import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { Car } from './car/car';
import { CarsApisService } from './cars-apis-service';
import { FilterCarsDto } from './dtos/filter-cars.dto';
import { CarI } from './interfaces/car.interface';
import { Router } from '@angular/router';
import { CarsService } from './cars-service';

@Component({
  selector: 'app-cars',
  imports: [Car],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars implements OnInit {
  private readonly carsApisService = inject(CarsApisService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly carsService = inject(CarsService);

  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.filterCarsFormListener();
      this.removeCarListener();
    });
  }

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

  onCreateCar() {
    this.router.navigate([`create-car`]);
  }

  removeCarListener() {
    if (!!this.carsService.removeCar()) {
      this.cars().splice(
        this.cars().findIndex((car) => car._id === this.carsService.removeCar()!._id),
        1,
      );
      this.carsService.removeCar.set(null);
    }
  }

  filterCarsFormListener() {
    if (!!this.carsService.filterCars()) {
      this.findAllCars(this.carsService.filterCars()!, false);
    }
  }

  findAllCars(filterCarsDto: FilterCarsDto, isOnScroll: boolean) {
    this.carsApisService
      .findAllCars({
        limit: this.limit(),
        skip: isOnScroll ? filterCarsDto.skip : 0,
      })
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

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
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
