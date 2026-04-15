import { Component, DestroyRef, inject } from '@angular/core';
import { Location } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { DateInput } from '../../../shared/components/date-input/date-input';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { TranslateModule } from '@ngx-translate/core';
import { RadioInput } from '../../../shared/components/radio-input/radio-input';
import { UsersApisService } from '../users-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { removeEmptyValues } from '../../../shared/utils/remove-empty-vlaues.util';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  imports: [TranslateModule, ReactiveFormsModule, TextInput, DateInput, PasswordInput, RadioInput],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss',
})
export class CreateUser {
  private fb = inject(NonNullableFormBuilder);
  private location = inject(Location);
  private usersApisService = inject(UsersApisService);

  private readonly destroyRef = inject(DestroyRef);

  submitted = false;
  fullNameControl = new FormControl('');

  createUserForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    birthDate: ['', Validators.required],
    phone: [''],
    gender: ['', Validators.required],
    password: ['', Validators.required],
  });

  genderOptions = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
  ];

  onSubmit() {
    if (this.createUserForm.invalid) return;
    this.submitted = true;

    const data = removeEmptyValues(this.createUserForm.value);

    this.usersApisService
      .createUser(data)
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

  showControlError(
    controlName: 'fullName' | 'email' | 'phone' | 'password',
    error: string,
  ): boolean {
    const c = this.createUserForm.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }

  goBack() {
    this.location.back();
  }
}
