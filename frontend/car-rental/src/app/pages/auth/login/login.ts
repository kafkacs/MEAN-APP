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
import { AuthApisService } from '../auth-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { LoginService } from './login-service';
import { StorageService } from '../../../core/services/storage/storage';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    PasswordInput,
    TextInput,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApisService = inject(AuthApisService);
  private readonly loginService = inject(LoginService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  submitted = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.authApisService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (loginResponse) => {
          const { data } = loginResponse;
          this.loginService.initLoginState(data);
          this.findLoggedInUser();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
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
          console.log(this.storageService.loggedInUser);

          this.router.navigate(['/landing']);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
        },
      });
  }

  showError(controlName: 'email' | 'password', error: string): boolean {
    const c = this.loginForm.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }
}
