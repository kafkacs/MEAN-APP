import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../core/services/storage/storage';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, TranslateModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  private readonly storageService = inject(StorageService);

  user = signal(this.storageService.loggedInUser);

  isLoggedIn = computed(() => !!this.user());
}
