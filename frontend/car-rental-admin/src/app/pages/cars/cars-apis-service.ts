import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { FilterCarsDto } from './dtos/filter-cars.dto';
import { CarI } from './interfaces/car.interface';
import { CreateCarDto } from './dtos/create-car.dto';

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

  createCar(createCarDto: CreateCarDto) {
    return this.apis.post<CarI>('cars', createCarDto);
  }

  updateCar(carID: string, updateCarDto: CreateCarDto) {
    return this.apis.patch<CarI>(`cars/${carID}`, updateCarDto);
  }

  removeCar(carID: string) {
    return this.apis.delete<CarI>(`cars/${carID}`);
  }
}
