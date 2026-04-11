import { Injectable, signal } from '@angular/core';
import { UserI } from '../../shared/interfaces/user.interface';
import { FilterUsersDto } from './dtos/filter-users.dto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  filterUsers = signal<FilterUsersDto | null>(null);

  updateUser = signal<UserI | null>(null);

  createUser = signal<UserI | null>(null);

  removeUser = signal<UserI | null>(null);
}
