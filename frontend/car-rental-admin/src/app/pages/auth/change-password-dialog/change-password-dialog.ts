import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { AuthApisService } from '../auth-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { removeEmptyValues } from '../../../shared/utils/remove-empty-vlaues.util';

@Component({
  selector: 'app-change-password-dialog',
  imports: [TranslateModule, ReactiveFormsModule, PasswordInput],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss',
})
export class ChangePasswordDialog {
  private readonly dialogService = inject(DialogService);
  private readonly authApisService = inject(AuthApisService);
  private fb = inject(FormBuilder);

  private readonly destroyRef = inject(DestroyRef);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  form = this.fb.group(
    {
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  passwordMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const newForm = removeEmptyValues(this.form.value);

    this.authApisService
      .changePassword(newForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Password updated successfully');
          this.form.reset();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
          this.error.set(err.error.message + '' || 'An error occurred');
          this.loading.set(false);
        },
      });
  }
  closeDialog() {
    this.dialogService.closeDialog();
  }
}
