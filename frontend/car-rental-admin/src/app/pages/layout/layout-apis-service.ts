import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { UserI } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class LayoutApisService {
  private readonly apis = inject(Apis);

  findLoggedInUser(token: string) {
    return this.apis.get<UserI>('users/logged-in-user', token);
  }
}
