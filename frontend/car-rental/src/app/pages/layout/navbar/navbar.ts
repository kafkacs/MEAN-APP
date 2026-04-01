import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.update(() => !this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.update(() => false);
  }
}
