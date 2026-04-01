import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Translation } from '../../../core/services/translation/translation';
import { StorageService } from '../../../core/services/storage/storage';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly storageService = inject(StorageService);
  private readonly translation = inject(Translation);

  isMenuOpen = signal<boolean>(false);
  translatedLang = signal<string>(
    this.storageService.language === 'en' ? 'العربية' : 'English',
  );

  toggleMenu() {
    this.isMenuOpen.update(() => !this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.update(() => false);
  }

  translate() {
    this.translation.changeLanguage();
    this.storageService.language === 'en'
      ? this.translatedLang.update(() => 'العربية')
      : this.translatedLang.update(() => 'English');
  }
}
