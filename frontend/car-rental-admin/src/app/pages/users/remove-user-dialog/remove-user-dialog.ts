import { Component, DestroyRef, inject, model, ModelSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { UserI } from '../../../shared/interfaces/user.interface';
import { UsersApisService } from '../users-apis-service';
import { UsersService } from '../users-service';

@Component({
  selector: 'app-remove-user-dialog',
  imports: [TranslateModule],
  templateUrl: './remove-user-dialog.html',
  styleUrl: './remove-user-dialog.scss',
})
export class RemoveUserDialog {
  private readonly dialogService = inject(DialogService);
  private readonly usersApisService = inject(UsersApisService);
  private readonly usersService = inject(UsersService);

  private readonly destroyRef = inject(DestroyRef);

  user: ModelSignal<UserI> = model.required<UserI>();

  removeUser() {
    this.usersApisService
      .removeUser(this.user()._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deleteResponse) => {
          const { data } = deleteResponse;
          this.usersService.removeUser.set(data);
          this.dialogService.closeDialog();
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Error removing user:', err);
        },
      });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
