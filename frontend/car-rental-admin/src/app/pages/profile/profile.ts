import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { StorageService } from '../../core/services/storage/storage';
import { AuthApisService } from '../auth/auth-apis-service';
import { UserI } from '../../shared/interfaces/user.interface';
import { DatePipe } from '@angular/common';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { ChangePasswordDialog } from '../auth/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly storageService = inject(StorageService);
  private readonly authApisService = inject(AuthApisService);
  private readonly dialogService = inject(DialogService);

  private readonly destroyRef = inject(DestroyRef);

  user = signal<UserI | null>(null);
  isLoading = signal(true);
  isLoadingBookings = signal(true);

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authApisService
      .findLoggedInUser(this.storageService.accessToken!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (loggedInResponse) => {
          const { data } = loggedInResponse;
          this.storageService.loggedInUser = data;
          this.user.set(data);
          this.isLoading.set(false);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
          this.isLoading.set(false);
        },
      });
  }

  openChangePasswordDialog() {
    this.dialogService.openDialog(ChangePasswordDialog);
  }
}
