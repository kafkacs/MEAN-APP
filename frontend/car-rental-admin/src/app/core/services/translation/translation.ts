import { DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class Translation {
  public language = signal('');

  private translateService = inject(TranslateService);
  private storageService = inject(StorageService);
  private document = inject(DOCUMENT);

  constructor() {
    this.initLanguage();
  }

  initLanguage() {
    this.translateService.addLangs(['en', 'ar']);

    const storedLang = this.storageService.language;
    const browserLang =
      (navigator.language || window.navigator.language).includes('ar')
        ? 'ar'
        : 'en';
    const lang = storedLang === 'ar' || storedLang === 'en' ? storedLang : browserLang;

    this.translateService.use(lang);
    this.setLanguage(lang);
    this.language.set(lang);
  }

  changeLanguage() {
    const nextLang = this.language() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
    // TranslateService updates currentLang async; keep UI reactive immediately.
    this.language.set(nextLang);
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
    this.storageService.language = lang;
    this.document.getElementsByTagName('html')[0].setAttribute('lang', lang);

    if (lang !== 'ar') {
      this.document
        .getElementsByTagName('html')[0]
        .setAttribute('direction', 'ltr');
      this.document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
    } else {
      this.document
        .getElementsByTagName('html')[0]
        .setAttribute('direction', 'rtl');
      this.document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    }
  }
}
