import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmed',
  imports: [],
  templateUrl: './confirmed.html',
  styleUrl: './confirmed.scss',
})
export class Confirmed {
  private router = inject(Router);

  goHome() {
    this.router.navigate(['/landing']);
  }
}
