import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DecodedTokenI } from '../../../shared/interfaces/decoded-token.interface';
import { UserI } from '../../../shared/interfaces/user.interface';
import { BROWSER_STORAGE } from '../../provoders/local-storage-token.provider';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public storage = inject(BROWSER_STORAGE);
  constructor(@Inject(PLATFORM_ID) private readonly platformID: Object) {}

  public set accessToken(accessToken: string | null) {
    this.storage.setItem('accessToken', accessToken!);
  }

  public get accessToken(): string | null {
    return this.storage.getItem('accessToken');
  }

  public get decodedToken(): DecodedTokenI {
    return JSON.parse(atob(this.accessToken?.split('.')[1]!));
  }

  public set refreshToken(refreshToken: string | null) {
    this.storage.setItem('refreshToken', refreshToken!);
  }

  public get refreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  public set language(language: string | null) {
    this.storage.setItem('language', language!);
  }

  public get language(): string | null {
    return this.storage.getItem('language');
  }

  public set loggedInUser(loggedInUser: UserI | null) {
    if (isPlatformBrowser(this.platformID))
      sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser!));
  }

  public get loggedInUser(): UserI | null {
    if (isPlatformBrowser(this.platformID))
      return JSON.parse(sessionStorage.getItem('loggedInUser')!);
    return null;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
