import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TextInput } from '../../shared/components/text-input/text-input';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, TextInput],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = inject(NonNullableFormBuilder);

  submitted = false;
  sent = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.sent = true;
    this.form.reset();
    this.submitted = false;
  }

  showError(
    controlName: 'name' | 'email' | 'subject' | 'message',
    error: string,
  ): boolean {
    const c = this.form.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }
}
