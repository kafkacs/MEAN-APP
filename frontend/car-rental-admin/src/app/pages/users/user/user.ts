import { DatePipe, NgClass } from '@angular/common';
import { Component, model, ModelSignal } from '@angular/core';
import { UserI } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user',
  imports: [DatePipe, NgClass],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {
  user: ModelSignal<UserI> = model.required<UserI>();

  onEdit(id: string) {
    console.log('Edit user:', id);
  }

  onDelete(id: string) {
    console.log('Delete user:', id);
  }
}
