import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DateInput } from '../../../shared/components/date-input/date-input';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { RadioInput } from '../../../shared/components/radio-input/radio-input';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { removeEmptyValues } from '../../../shared/utils/remove-empty-vlaues.util';
import { UsersApisService } from '../users-apis-service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-user',
  imports: [TranslateModule, ReactiveFormsModule, TextInput, DateInput, PasswordInput, RadioInput],
  templateUrl: './update-user.html',
  styleUrl: './update-user.scss',
})
export class UpdateUser implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private location = inject(Location);
  private usersApisService = inject(UsersApisService);
  private route = inject(ActivatedRoute);

  private readonly destroyRef = inject(DestroyRef);

  submitted = false;
  userID = signal<string>('');

  updateUserForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    birthDate: ['', Validators.required],
    phone: [''],
    gender: ['', Validators.required],
  });

  genderOptions = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
  ];

  ngOnInit(): void {
    this.getUserIDFromRoute();
  }

  getUserIDFromRoute() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const userID = paramMap.get('userID');
      if (!userID) {
        console.error('No Car ID provided in route');
      } else {
        this.userID.set(userID);
        this.findOneUser(userID);
      }
    });
  }

  findOneUser(userID: string) {
    this.usersApisService
      .findOneUser(userID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const user = res.data;

          this.updateUserForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            birthDate: this.formatDate(user.birthDate),
            gender: user.gender + '',
          });
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
        },
      });
  }

  formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  onSubmit() {
    if (this.updateUserForm.invalid) return;
    this.submitted = true;

    const data = removeEmptyValues(this.updateUserForm.value);

    this.usersApisService
      .updateUser(this.userID(), data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.location.back();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error(err.description, err.title);
        },
      });
  }

  showControlError(controlName: 'fullName' | 'email' | 'phone', error: string): boolean {
    const c = this.updateUserForm.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }

  goBack() {
    this.location.back();
  }
}
