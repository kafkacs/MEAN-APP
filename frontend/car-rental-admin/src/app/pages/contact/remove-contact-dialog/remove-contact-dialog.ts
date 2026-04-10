import { Component, DestroyRef, inject, model, ModelSignal } from '@angular/core';
import { ContactI } from '../interfaces/contact.interface';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { ContactApisService } from '../contact-apis-service';
import { ContactService } from '../contact-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';

@Component({
  selector: 'app-remove-contact-dialog',
  imports: [TranslateModule],
  templateUrl: './remove-contact-dialog.html',
  styleUrl: './remove-contact-dialog.scss',
})
export class RemoveContactDialog {
  private readonly dialogService = inject(DialogService);
  private readonly contactApisService = inject(ContactApisService);
  private readonly contactService = inject(ContactService);

  private readonly destroyRef = inject(DestroyRef);

  contact: ModelSignal<ContactI> = model.required<ContactI>();

  removeMessage() {
    this.contactApisService
      .removeContact(this.contact()._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deleteResponse) => {
          const { data } = deleteResponse;
          this.contactService.removeContact.set(data);
          this.dialogService.closeDialog();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Error removing contact:', err);
        },
      });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
