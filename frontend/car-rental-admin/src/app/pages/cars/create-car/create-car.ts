import { Component, DestroyRef, inject } from '@angular/core';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NumberInput } from '../../../shared/components/number-input/number-input';
import { RadioInput } from '../../../shared/components/radio-input/radio-input';
import { FileUpload } from '../../../shared/components/file-upload/file-upload';
import { CarsApisService } from '../cars-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';

@Component({
  selector: 'app-create-car',
  imports: [TextInput, NumberInput, RadioInput, ReactiveFormsModule, FileUpload],
  templateUrl: './create-car.html',
  styleUrl: './create-car.scss',
})
export class CreateCar {
  private fb = inject(NonNullableFormBuilder);
  private location = inject(Location);
  private carsApisService = inject(CarsApisService);

  private readonly destroyRef = inject(DestroyRef);

  selectedFile: File | null = null;

  createCarForm = this.fb.group({
    carName: ['', Validators.required],
    model: [null, Validators.required],
    carType: ['', Validators.required],
    seatsNumber: [null, Validators.required],
    transmissionType: ['', Validators.required],
    pricePerDay: [null, Validators.required],
    available: ['', Validators.required],
  });

  transmissionOptions = [
    { label: 'Automatic', value: '1' },
    { label: 'Manual', value: '2' },
  ];

  carTypeOptions = [
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Coupe', value: 'Coupe' },
    { label: 'Convertible', value: 'Convertible' },
    { label: 'Pickup Truck', value: 'Pickup Truck' },
    { label: 'Van', value: 'Van' },
    { label: 'Luxury', value: 'Luxury' },
  ];

  seatsNumbersOptions = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];

  availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false },
  ];

  onSubmit() {
    if (this.createCarForm.invalid) return;
    if (!this.selectedFile) {
      alert('Please upload an image of the car.');
      return;
    }

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    formData.append('carName', this.createCarForm.controls.carName.value!);
    formData.append('model', this.createCarForm.controls.model.value!);
    formData.append('carType', this.createCarForm.controls.carType.value!);
    formData.append('seatsNumber', this.createCarForm.controls.seatsNumber.value!);
    formData.append('transmissionType', this.createCarForm.controls.transmissionType.value!);
    formData.append('pricePerDay', this.createCarForm.controls.pricePerDay.value!);
    formData.append('available', this.createCarForm.controls.available.value!);

    this.carsApisService
      .createCar(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (productsFindResponse) => {
          console.log(productsFindResponse.frontFacingMessage);
          this.location.back();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
        },
      });
  }

  onFileDrop(files: FileList) {
    this.selectedFile = files[0];
  }

  goBack() {
    this.location.back();
  }
}
