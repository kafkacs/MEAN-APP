import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CarI } from '../interfaces/car.interface';
import { CarsApisService } from '../cars-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TransmissionType } from '../enums/transmission-type.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-car-details',
  imports: [DatePipe],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails implements OnInit {
  private readonly carsApisService = inject(CarsApisService);
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  carID = signal<string>('');
  car = signal<CarI | null>(null);

  transmissionTypeOptions = TransmissionType;

  isCurrentlyBooked = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      this.car()?.books?.some((b) => {
        const start = new Date(b.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(b.endDate);
        end.setHours(0, 0, 0, 0);
        return today >= start && today <= end;
      }) ?? false
    );
  });

  ngOnInit(): void {
    this.getProductFromRoute();
  }

  getProductFromRoute() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paramMap) => {
        const carID = paramMap.get('carID');
        if (!carID) {
          console.error('No product ID provided in route');
        } else {
          this.carID.set(carID);
          this.findOneCar(carID);
        }
      });
  }

  findOneCar(carID: string) {
    this.carsApisService
      .findOneCar(carID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (carFindResponse) => {
          this.car.set(carFindResponse.data);
        },
        error: (err) => {
          console.error('Error fetching car details:', err);
        },
      });
  }

  isActivePeriod(book: { startDate: string; endDate: string }): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(book.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(book.endDate);
    end.setHours(0, 0, 0, 0);
    return today >= start && today <= end;
  }

  goToRent() {
    if (!this.carID()) return;
    this.router.navigate([`/rent/${this.carID()}`]);
  }

  goToContact() {
    this.router.navigate([`contact`]);
  }
}
