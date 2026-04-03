import { Component, DestroyRef, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TextInput } from '../../shared/components/text-input/text-input';
import { ContactApisService } from './contact-apis-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { removeEmptyValues } from '../../shared/utils/remove-empty-vlaues.util';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, TextInput],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contactApisService = inject(ContactApisService);

  private readonly destroyRef = inject(DestroyRef);

  submitted = false;
  sent = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.contactApisService
      .createMessage(removeEmptyValues(this.form.getRawValue()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sent = true;
          this.form.reset();
          this.submitted = false;
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Create message error:', err);
        },
      });
  }

  showError(controlName: 'name' | 'email' | 'message', error: string): boolean {
    const c = this.form.controls[controlName];
    return (this.submitted || c.touched || c.dirty) && c.hasError(error);
  }
}
