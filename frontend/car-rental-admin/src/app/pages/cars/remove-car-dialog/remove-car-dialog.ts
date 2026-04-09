import { Component, DestroyRef, inject, model, ModelSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarI } from '../interfaces/car.interface';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { CarsApisService } from '../cars-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { CarsService } from '../cars-service';

@Component({
  selector: 'app-remove-car-dialog',
  imports: [TranslateModule],
  templateUrl: './remove-car-dialog.html',
  styleUrl: './remove-car-dialog.scss',
})
export class RemoveCarDialog {
  private readonly dialogService = inject(DialogService);
  private readonly carsApisService = inject(CarsApisService);
  private readonly carsService = inject(CarsService);

  private readonly destroyRef = inject(DestroyRef);

  car: ModelSignal<CarI> = model.required<CarI>();

  removeCar() {
    this.carsApisService
      .removeCar(this.car()._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deleteResponse) => {
          const { data } = deleteResponse;
          this.carsService.removeCar.set(data);
          console.log('Car removed successfully:', data);
          this.dialogService.closeDialog();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Error removing car:', err);
        },
      });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
