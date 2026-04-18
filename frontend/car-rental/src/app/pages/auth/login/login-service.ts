import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage/storage';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly storageService = inject(StorageService);

  initLoginState(loginResponse: { token: string }) {
    const data = loginResponse.token;

    const role = JSON.parse(atob(data?.split('.')[1]!)).role;

    if (role !== 1) {
      console.error(
        'Unauthorized access attempt by user with role:',
        role,
        'this is users portal only.',
      );
      return;
    }

    this.storageService.accessToken = data;
  }
}
