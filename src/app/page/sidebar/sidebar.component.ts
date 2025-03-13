import { Component, inject, signal, HostListener, type OnInit } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  adminOnly?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(-10px)" }),
        animate("200ms ease-out", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
      transition(":leave", [animate("200ms ease-in", style({ opacity: 0, transform: "translateX(-10px)" }))]),
    ]),
    trigger("expandCollapse", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate("200ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: "*", opacity: 1 }),
        animate("200ms ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  router = inject(Router);
  isAdmin = signal<boolean>(false);
  isMobile = signal<boolean>(false);
  expandedMenus = signal<string[]>([]);

  menuItems: MenuItem[] = [
    { icon: "fa-solid fa-house", label: "Trang chủ", route: "/home" },
    { icon: "fa-solid fa-utensils", label: "Thực đơn", route: "/products" },
    { icon: "fa-solid fa-cart-shopping", label: "Giỏ hàng", route: "/cart" +
        "" },
    { icon: "fa-solid fa-receipt", label: "Đơn hàng", route: "/otp" },
    {
      icon: "fa-solid fa-user-shield",
      label: "Quản trị",
      route: "/admin",
      adminOnly: true,
      children: [
        { icon: "fa-solid fa-list", label: "Sản phẩm", route: "/admin/products" },
        { icon: "fa-solid fa-users", label: "Người dùng", route: "/admin/users" },
        { icon: "fa-solid fa-chart-line", label: "Thống kê", route: "/admin/stats" },
      ],
    },
    { icon: "fa-solid fa-gear", label: "Cài đặt", route: "/settings" },
    { icon: "fa-solid fa-user", label: "Hồ sơ", route: "/profile" },
  ];

  constructor() {
    this.checkAdminRole();
    this.checkScreenSize();
  }

  ngOnInit(): void {
    const currentPath = this.router.url;
    this.menuItems.forEach((item) => {
      if (item.children && item.children.some((child) => currentPath.includes(child.route))) {
        this.toggleSubmenu(item.route);
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  checkAdminRole(): void {
    const role = localStorage.getItem("role");
    this.isAdmin.set(role === "admin");
  }

  toggleSubmenu(route: string): void {
    const expanded = this.expandedMenus();
    if (expanded.includes(route)) {
      this.expandedMenus.set(expanded.filter((item) => item !== route));
    } else {
      this.expandedMenus.set([...expanded, route]);
    }
  }

  isSubmenuExpanded(route: string): boolean {
    return this.expandedMenus().includes(route);
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + "/");
  }

  onLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      this.router.navigateByUrl("/login");
    }
  }
}
