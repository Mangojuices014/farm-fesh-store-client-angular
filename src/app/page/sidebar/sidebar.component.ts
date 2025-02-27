import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  router = inject(Router);
  isAdmin = signal<boolean>(false);

  constructor() {
    this.checkAdminRole();
  }

  checkAdminRole(): void {
    const role = localStorage.getItem("role");
    this.isAdmin.set(role === "admin");
  }

  onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Xóa luôn role khi logout
    this.router.navigateByUrl("/login");
  }
}
