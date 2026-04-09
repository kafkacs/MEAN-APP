import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  initLoginState(loginResponse: { token: string }) {
    const data = loginResponse.token;
    const role = JSON.parse(atob(data?.split('.')[1]!)).role;

    if (role !== 2) {
      console.error('Unauthorized access attempt by user with role:', role);
      return;
    }

    this.storageService.accessToken = data;
    this.router.navigate(['']);
  }
}
