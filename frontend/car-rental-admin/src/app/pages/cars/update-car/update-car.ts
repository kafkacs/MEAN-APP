import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NumberInput } from '../../../shared/components/number-input/number-input';
import { RadioInput } from '../../../shared/components/radio-input/radio-input';
import { FileUpload } from '../../../shared/components/file-upload/file-upload';
import { CarsApisService } from '../cars-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';

@Component({
  selector: 'app-update-car',
  imports: [TextInput, NumberInput, RadioInput, ReactiveFormsModule, FileUpload],
  templateUrl: './update-car.html',
  styleUrl: './update-car.scss',
})
export class UpdateCar implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private location = inject(Location);
  private carsApisService = inject(CarsApisService);
  private route = inject(ActivatedRoute);

  private destroyRef = inject(DestroyRef);

  carID = signal<string>('');
  selectedFile: File | null = null;

  updateCarForm = this.fb.group({
    carName: ['', Validators.required],
    model: ['', Validators.required],
    carType: ['', Validators.required],
    seatsNumber: ['', Validators.required],
    transmissionType: ['', Validators.required],
    pricePerDay: ['', Validators.required],
    available: [true, Validators.required],
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

  ngOnInit() {
    this.getCarFromRoute();
  }

  getCarFromRoute() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const carID = paramMap.get('carID');
      if (!carID) {
        console.error('No Car ID provided in route');
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
        next: (res) => {
          const car = res.data;

          this.updateCarForm.patchValue({
            carName: car.carName,
            model: car.model,
            carType: car.carType,
            seatsNumber: car.seatsNumber + '',
            transmissionType: car.transmissionType + '',
            pricePerDay: car.pricePerDay,
            available: car.available,
          });
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
        },
      });
  }

  onSubmit() {
    if (this.updateCarForm.invalid) return;

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    formData.append('carName', this.updateCarForm.controls.carName.value!);
    formData.append('model', this.updateCarForm.controls.model.value!);
    formData.append('carType', this.updateCarForm.controls.carType.value!);
    formData.append('seatsNumber', this.updateCarForm.controls.seatsNumber.value!);
    formData.append('transmissionType', this.updateCarForm.controls.transmissionType.value!);
    formData.append('pricePerDay', this.updateCarForm.controls.pricePerDay.value!);
    formData.append('available', this.updateCarForm.controls.available.value + '');

    this.carsApisService
      .updateCar(this.carID(), formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res.frontFacingMessage);
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
