import { Component, inject, model, ModelSignal } from '@angular/core';
import { CarI } from '../interfaces/car.interface';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-car',
  imports: [TranslateModule],
  templateUrl: './car.html',
  styleUrl: './car.scss',
})
export class Car {
  private readonly router = inject(Router);

  car: ModelSignal<CarI> = model.required<CarI>();

  goToDetails() {
    this.router.navigate([`car-details/${this.car()._id}`]);
  }

  goToRent() {
    this.router.navigate([`rent/${this.car()._id}`]);
  }
}
