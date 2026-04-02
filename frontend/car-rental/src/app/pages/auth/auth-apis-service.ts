import { inject, Injectable } from '@angular/core';
import { Apis } from '../../core/services/apis/apis';
import { SignUpDto } from './dtos/signup.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApisService {
  private readonly apis = inject(Apis);

  signup(signUpDto: SignUpDto) {
    return this.apis.post('users', signUpDto);
  }

  login(email: string, password: string) {
    return this.apis.post('users/login', { email, password });
  }
}
