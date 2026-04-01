import { Component, inject, model, ModelSignal } from '@angular/core';
import { CarI } from '../interfaces/car.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car',
  imports: [],
  templateUrl: './car.html',
  styleUrl: './car.scss',
})
export class Car {
  private readonly router = inject(Router);

  car: ModelSignal<CarI> = model.required<CarI>();

  goToDetails() {
    this.router.navigate([`car-details/${this.car()._id}`]);
  }
}
