import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { SignUpDto } from './dtos/signup.dto';
import { UserI } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApisService {
  private readonly apis = inject(Apis);

  signup(signUpDto: SignUpDto) {
    return this.apis.post<{ token: string }>('users/register', signUpDto);
  }

  login(email: string, password: string) {
    return this.apis.post<{ token: string }>('users/login', {
      email,
      password,
    });
  }

  findLoggedInUser(token: string) {
    return this.apis.get<UserI>('users/logged-in-user', token);
  }
}
