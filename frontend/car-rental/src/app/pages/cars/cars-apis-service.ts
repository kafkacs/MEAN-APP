import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { FilterCarsDto } from './dtos/filter-cars.dto';
import { CarI } from './interfaces/car.interface';

@Injectable({
  providedIn: 'root',
})
export class CarsApisService {
  private readonly apis = inject(Apis);

  findAllCars(filterCarsDto?: FilterCarsDto) {
    return this.apis.get<CarI[]>('cars', filterCarsDto);
  }

  findOneCar(carID: string) {
    return this.apis.get<CarI>(`cars/${carID}`);
  }
}
