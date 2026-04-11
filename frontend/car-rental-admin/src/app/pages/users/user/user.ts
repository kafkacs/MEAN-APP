import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, model, ModelSignal } from '@angular/core';
import { UserI } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [DatePipe, NgClass],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {
  private readonly router = inject(Router);

  user: ModelSignal<UserI> = model.required<UserI>();

  onEdit(id: string) {
    this.router.navigate([`update-user/${id}`]);
  }

  onDelete(id: string) {
    console.log('Delete user:', id);
  }
}
