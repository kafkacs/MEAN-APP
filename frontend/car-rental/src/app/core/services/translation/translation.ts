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
  private storage = inject(StorageService);
  private document = inject(DOCUMENT);
  constructor() {
    this.initLanguage();
  }

  initLanguage() {
    this.translateService.addLangs(['en', 'ar']);

    const lang = (
      this.storageService.language ??
      (navigator.language || window.navigator.language)
    ).includes('ar')
      ? 'ar'
      : 'en';

    this.translateService.use(lang);
    this.setLanguage(lang);
    this.language.set(lang);
  }

  changeLanguage() {
    const isEnglish = this.translateService.getCurrentLang() === 'en';

    if (isEnglish) this.setLanguage('ar');
    else this.setLanguage('en');

    this.language.set(this.translateService.getCurrentLang());
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
    this.storage.language = lang;
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
