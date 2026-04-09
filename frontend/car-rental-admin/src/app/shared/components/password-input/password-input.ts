import { Component, input, model, ModelSignal, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  imports: [ReactiveFormsModule],
  templateUrl: './password-input.html',
  styleUrl: './password-input.scss',
})
export class PasswordInput {
  showPassword = signal(false);
  passwordIcon = signal('/svgs/closed-lock.svg');
  passwordType = signal<'password' | 'text'>('password');

  control: ModelSignal<FormControl<string | null>> =
    model.required<FormControl<string | null>>();

  placeholder = input<string>('');
  inputId = input<string | undefined>(undefined);
  autocomplete = input<string | undefined>(undefined);

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
    this.passwordIcon.update(() =>
      this.showPassword() ? '/svgs/opened-lock.svg' : '/svgs/closed-lock.svg',
    );
    this.passwordType.update(() => (this.showPassword() ? 'text' : 'password'));
  }
}
