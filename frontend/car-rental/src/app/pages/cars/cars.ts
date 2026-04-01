import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Car } from './car/car';
import { CarI } from './interfaces/car.interface';
import { CarsApisService } from './cars-apis-service';
import { FilterCarsDto } from './dtos/filter-cars.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';

@Component({
  selector: 'app-cars',
  imports: [Car],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars implements OnInit {
  private readonly carsApisService = inject(CarsApisService);
  private readonly cd = inject(ChangeDetectorRef);

  // private readonly renderer = inject(Renderer2);

  private destroyRef = inject(DestroyRef);

  cars = signal<CarI[]>([]);

  scrollListenerFn!: () => void;
  throttleTimer!: NodeJS.Timeout | null;

  skip = signal<number>(0);
  limit = signal<number>(15);
  lastFetchedCount = signal<number>(-1);
  isFetching = signal<boolean>(false);

  ngOnInit(): void {
    this.findAllCars({ text: '' });
  }

  findAllCars(_filterCarsDto: FilterCarsDto) {
    this.carsApisService
      .findAllCars()
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
          console.log(productsFindResponse.data);
        },
        error: (err: DelegatedUIErrorI) => {
          this.cars.set([]);
          console.log(err.description, err.title);
        },
      });
  }

  // setupScrollListener() {
  //   this.scrollListenerFn = this.renderer.listen('window', 'scroll', () => {
  //     if (this.throttleTimer) return;

  //     this.throttleTimer = setTimeout(() => {
  //       this.checkScrollPosition();
  //       this.throttleTimer = null;
  //     }, 200);
  //   });
  // }

  // checkScrollPosition() {
  //   if (this.isFetching() || this.lastFetchedCount() === 0) return;
  //   if (this.lastFetchedCount() < this.limit()) return;

  //   const scrollableHeight =
  //     document.documentElement.scrollHeight - window.innerHeight;
  //   const scrollPosition = window.scrollY;
  //   const threshold = 200;

  //   if (scrollPosition >= scrollableHeight - threshold) {
  //     this.findAllProducts(
  //       {
  //         ...this.productsService.filterProducts(),
  //         skip: this.products().length,
  //         limit: this.limit(),
  //       },
  //       true,
  //     );
  //   }
  // }
}
