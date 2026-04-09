import { Injectable, signal } from '@angular/core';
import { CarI } from './interfaces/car.interface';
import { FilterCarsDto } from './dtos/filter-cars.dto';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  filterCars = signal<FilterCarsDto | null>(null);

  updateCar = signal<CarI | null>(null);

  createCar = signal<CarI | null>(null);

  removeCar = signal<CarI | null>(null);
}
