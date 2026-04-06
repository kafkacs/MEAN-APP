import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'; // ← added toSignal
import { finalize } from 'rxjs';
import { CarsApisService } from '../cars/cars-apis-service';
import { CarI } from '../cars/interfaces/car.interface';
import { StorageService } from '../../core/services/storage/storage';
import { DateInput } from '../../shared/components/date-input/date-input';
import { TextInput } from '../../shared/components/text-input/text-input';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { BookingsApisService } from './bookings-apis-service';
import { removeEmptyValues } from '../../shared/utils/remove-empty-vlaues.util';

@Component({
  selector: 'app-rent',
  imports: [ReactiveFormsModule, RouterLink, DateInput, TextInput],
  templateUrl: './rent.html',
  styleUrl: './rent.scss',
})
export class Rent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly carsApisService = inject(CarsApisService);
  private readonly storageService = inject(StorageService);
  private readonly bookingsApisService = inject(BookingsApisService);
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  carID = signal<string>('');
  car = signal<CarI | null>(null);
  isLoadingCar = signal(false);
  isSubmitting = signal(false);

  submitted = false;
  showConfirmDialog = signal(false);
  createdBookingId = signal<string | null>(null);

  user = signal(this.storageService.loggedInUser);
  isLoggedIn = computed(() => !!this.user());

  rentForm = this.fb.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    nameOfBooker: ['', [Validators.required, Validators.minLength(2)]],
    emailOfBooker: ['', [Validators.required, Validators.email]],
    contactNumberOfBooker: ['', [Validators.required, Validators.minLength(7)]],
    notes: [''],
    carID: [''],
    userID: [''],
    status: ['pending'],
  });

  formValues = toSignal(this.rentForm.valueChanges, {
    initialValue: this.rentForm.value,
  });

  daysCount = computed(() => {
    const { startDate: start, endDate: end } = this.formValues();
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return 0;
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  });

  estimatedTotal = computed(() => {
    const car = this.car();
    if (!car) return 0;
    const pricePerDay = Number(car.pricePerDay) || 0;
    return pricePerDay * this.daysCount();
  });

  ngOnInit(): void {
    this.getIDFromRoute();
    this.checkLoggedInUser();
  }

  getIDFromRoute() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paramMap) => {
        const carID = paramMap.get('carID');
        if (!carID) return;
        this.carID.set(carID);
        this.findOneCar(carID);
      });
  }

  findOneCar(carID: string) {
    this.isLoadingCar.set(true);
    this.carsApisService
      .findOneCar(carID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(finalize(() => this.isLoadingCar.set(false)))
      .subscribe({
        next: (carFindResponse) => {
          this.car.set(carFindResponse.data);
        },
        error: (err) => {
          console.error('Error fetching car details:', err);
        },
      });
  }

  checkLoggedInUser() {
    if (this.isLoggedIn()) {
      this.rentForm.controls.nameOfBooker.setValue(this.user()?.fullName ?? '');
      this.rentForm.controls.emailOfBooker.setValue(this.user()?.email ?? '');
      this.rentForm.controls.contactNumberOfBooker.setValue(
        this.user()?.phone ?? '',
      );
      this.rentForm.controls.userID.setValue(this.user()?._id ?? '');
    }
  }

  openConfirm(): void {
    this.submitted = true;
    if (this.rentForm.invalid) return;
    if (this.car()?.available === false) return;
    this.showConfirmDialog.set(true);
  }

  closeConfirm(): void {
    this.showConfirmDialog.set(false);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  confirmBooking(): void {
    this.submitted = true;
    if (this.rentForm.invalid) return;
    if (!this.carID()) return;

    this.rentForm.controls.carID.setValue(this.carID());

    const payload = {
      ...removeEmptyValues(this.rentForm.value),
      startDate: this.formatDate(this.rentForm.controls.startDate.value!),
      endDate: this.formatDate(this.rentForm.controls.endDate.value!),
    };

    this.isSubmitting.set(true);

    this.bookingsApisService
      .createBooking(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (productsFindResponse) => {
          console.log(productsFindResponse.frontFacingMessage);
          this.router.navigate(['/confirmed']);
        },
        error: (err: DelegatedUIErrorI) => {
          this.showConfirmDialog.set(false);
          this.submitted = false;
          this.rentForm.reset({ status: 'pending' });
          this.checkLoggedInUser();
          this.isSubmitting.set(false);
          console.error(err.description, err.title);
        },
      });
  }

  showControlError(
    controlName:
      | 'startDate'
      | 'endDate'
      | 'nameOfBooker'
      | 'emailOfBooker'
      | 'contactNumberOfBooker',
    error: string,
  ): boolean {
    const c = this.rentForm.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }

  showFormError(error: string): boolean {
    return this.submitted && this.rentForm.hasError(error);
  }
}
