import {
  Component,
  inject,
  signal,
  computed,
  ElementRef,
  HostListener,
} from '@angular/core';
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
  private readonly elRef = inject(ElementRef);

  isMenuOpen = signal<boolean>(false);
  isDropdownOpen = signal<boolean>(false);

  user = signal(this.storageService.loggedInUser);
  isLoggedIn = computed(() => !!this.user());

  translatedLang = signal<string>(
    this.storageService.language === 'en' ? 'العربية' : 'English',
  );

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!this.elRef.nativeElement.contains(target)) {
      this.isDropdownOpen.set(false);
      this.isMenuOpen.set(false);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  logout() {
    this.storageService.loggedInUser = null;
    this.storageService.accessToken = null;
    this.storageService.refreshToken = null;

    this.user.set(null);
    this.isDropdownOpen.set(false);
  }

  translate() {
    this.translation.changeLanguage();
    this.storageService.language === 'en'
      ? this.translatedLang.set('العربية')
      : this.translatedLang.set('English');
  }
}
