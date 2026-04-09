import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../../core/services/storage/storage';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly storageService = inject(StorageService);

  user = signal(this.storageService.loggedInUser);

  isLoggedIn = computed(() => !!this.user());

  year = signal(new Date().getFullYear());
}
