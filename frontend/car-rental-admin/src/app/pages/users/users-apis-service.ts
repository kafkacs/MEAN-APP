import { inject, Injectable } from '@angular/core';
import { FilterUsersDto } from './dtos/filter-users.dto';
import { UserI } from '../../shared/interfaces/user.interface';
import { Apis } from '../../core/services/apis/apis';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable({
  providedIn: 'root',
})
export class UsersApisService {
  private readonly apis = inject(Apis);

  findAllUsers(filterUsersDto?: FilterUsersDto) {
    return this.apis.get<UserI[]>('users', filterUsersDto);
  }

  createUser(createUserDto: CreateUserDto) {
    return this.apis.post<UserI>('users', createUserDto);
  }

  updateUser(userID: string, updateUserDto: UpdateUserDto) {
    return this.apis.patch<UserI>(`users/${userID}`, updateUserDto);
  }

  removeUser(userID: string) {
    return this.apis.delete<UserI>(`users/${userID}`);
  }
}
