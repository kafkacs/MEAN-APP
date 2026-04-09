import { Component, inject, model, ModelSignal } from '@angular/core';
import { CarI } from '../interfaces/car.interface';
import { Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { RemoveCarDialog } from '../remove-car-dialog/remove-car-dialog';

@Component({
  selector: 'app-car',
  imports: [],
  templateUrl: './car.html',
  styleUrl: './car.scss',
})
export class Car {
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  car: ModelSignal<CarI> = model.required<CarI>();

  goToDetails() {
    this.router.navigate([`car-details/${this.car()._id}`]);
  }

  goToRent() {
    this.router.navigate([`rent/${this.car()._id}`]);
  }

  onDelete() {
    this.dialogService.openDialog(RemoveCarDialog, {
      car: this.car(),
    });
  }

  onEdit() {
    this.router.navigate([`edit-car/${this.car()._id}`]);
  }
}
