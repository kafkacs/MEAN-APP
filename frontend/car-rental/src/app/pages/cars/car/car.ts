import { Component, computed, inject, model, ModelSignal } from '@angular/core';
import { CarI } from '../interfaces/car.interface';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-car',
  imports: [TranslateModule, DatePipe],
  templateUrl: './car.html',
  styleUrl: './car.scss',
})
export class Car {
  private readonly router = inject(Router);

  car: ModelSignal<CarI> = model.required<CarI>();

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

  isActivePeriod(book: { startDate: string; endDate: string }): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(book.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(book.endDate);
    end.setHours(0, 0, 0, 0);

    return today >= start && today <= end;
  }

  goToDetails() {
    this.router.navigate([`car-details/${this.car()._id}`]);
  }

  goToRent() {
    this.router.navigate([`rent/${this.car()._id}`]);
  }
}
