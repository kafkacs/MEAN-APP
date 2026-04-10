import { Component, inject, model, ModelSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactI } from '../interfaces/contact.interface';
import { DialogService } from '../../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-contact-details',
  imports: [TranslateModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
})
export class ContactDetails {
  private readonly dialogService = inject(DialogService);

  contact: ModelSignal<ContactI> = model.required<ContactI>();

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
