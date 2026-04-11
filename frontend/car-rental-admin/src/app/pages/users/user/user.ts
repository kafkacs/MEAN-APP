import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, model, ModelSignal } from '@angular/core';
import { UserI } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { RemoveUserDialog } from '../remove-user-dialog/remove-user-dialog';

@Component({
  selector: 'app-user',
  imports: [DatePipe, NgClass],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  user: ModelSignal<UserI> = model.required<UserI>();

  onEdit(id: string) {
    this.router.navigate([`update-user/${id}`]);
  }
  onDetails() {
    this.router.navigate([`users/${this.user()._id}`]);
  }

  onDelete() {
    this.dialogService.openDialog(RemoveUserDialog, { user: this.user() });
  }
}
