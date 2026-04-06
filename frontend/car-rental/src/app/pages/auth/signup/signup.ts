import { Component, DestroyRef, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { DateInput } from '../../../shared/components/date-input/date-input';
import { AuthApisService } from '../auth-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { removeEmptyValues } from '../../../shared/utils/remove-empty-vlaues.util';
import { LoginService } from '../login/login-service';
import { StorageService } from '../../../core/services/storage/storage';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    PasswordInput,
    TextInput,
    DateInput,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApisService = inject(AuthApisService);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly storageService = inject(StorageService);

  private readonly destroyRef = inject(DestroyRef);

  submitted = false;

  signupForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    this.authApisService
      .signup(removeEmptyValues(this.signupForm.getRawValue()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (signupResponse) => {
          const { data } = signupResponse;
          this.loginService.initLoginState(data);
          this.findLoggedInUser();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Signup error:', err);
        },
      });
  }

  findLoggedInUser() {
    this.authApisService
      .findLoggedInUser(this.storageService.accessToken!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (loggedInResponse) => {
          const { data } = loggedInResponse;
          this.storageService.loggedInUser = data;

          this.router.navigate(['/landing']);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
        },
      });
  }

  showControlError(
    controlName: 'fullName' | 'email' | 'phone' | 'password',
    error: string,
  ): boolean {
    const c = this.signupForm.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }
}
