import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from '../storage/storage';
import { DecodedTokenI } from '../../../shared/interfaces/decoded-token.interface';
import { UserI } from '../../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class Session {
  private readonly loggedInUser: Subject<UserI | null> = new Subject();
  private readonly storageService = inject(StorageService);

  constructor() {}

  addLoggedInUser(user: UserI) {
    this.loggedInUser.next(user);
  }

  getLoggedInUser$() {
    return this.loggedInUser.asObservable();
  }

  getDecodedToken(): DecodedTokenI {
    return JSON.parse(atob(this.storageService.accessToken?.split('.')[1]!));
  }
}
