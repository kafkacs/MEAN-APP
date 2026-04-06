import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CarI } from '../interfaces/car.interface';
import { CarsApisService } from '../cars-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TransmissionType } from '../enums/transmission-type.enum';

@Component({
  selector: 'app-car-details',
  imports: [],
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

  goToRent() {
    if (!this.carID()) return;
    this.router.navigate([`/rent/${this.carID()}`]);
  }

  goToContact() {
    this.router.navigate([`contact`]);
  }
}
