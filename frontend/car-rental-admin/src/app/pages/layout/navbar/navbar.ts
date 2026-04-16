import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  DestroyRef,
  HostListener,
  ElementRef,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Translation } from '../../../core/services/translation/translation';
import { StorageService } from '../../../core/services/storage/storage';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DelegatedUIErrorI } from '../../../shared/interfaces/delegated-ui-error.interface';
import { LayoutApisService } from '../layout-apis-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private readonly storageService = inject(StorageService);
  private readonly translation = inject(Translation);
  private readonly layoutApisService = inject(LayoutApisService);
  private readonly router = inject(Router);
  private readonly elRef = inject(ElementRef);

  private readonly destroyRef = inject(DestroyRef);

  isMenuOpen = signal<boolean>(false);
  isDropdownOpen = signal<boolean>(false);

  user = signal(this.storageService.loggedInUser);

  isLoggedIn = computed(() => !!this.user());

  translatedLang = signal<string>(this.storageService.language === 'en' ? 'العربية' : 'English');

  ngOnInit(): void {
    this.findLoggedInUser();
  }

  findLoggedInUser() {
    this.layoutApisService
      .findLoggedInUser(this.storageService.accessToken!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (loggedInResponse) => {
          const { data } = loggedInResponse;
          this.storageService.loggedInUser = data;
          this.user.set(data);
        },
        error: (err: DelegatedUIErrorI) => {
          console.error('Login error:', err);
        },
      });
  }

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

  goToProfile() {
    this.router.navigate(['/profile']);
    this.closeMenu();
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
    this.router.navigate(['auth/login']);
  }

  translate() {
    this.translation.changeLanguage();
    this.storageService.language === 'en'
      ? this.translatedLang.set('العربية')
      : this.translatedLang.set('English');
  }
}
