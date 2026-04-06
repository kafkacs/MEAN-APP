import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage/storage';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly storageService = inject(StorageService);

  initLoginState(loginResponse: { token: string }) {
    const data = loginResponse.token;

    this.storageService.accessToken = data;
  }
}
