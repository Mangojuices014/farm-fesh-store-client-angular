import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Kiểm tra nếu người dùng đã thực hiện đăng ký hoặc thanh toán
    const otpAllowed = sessionStorage.getItem('optRegister');
    const paymentAllowed = sessionStorage.getItem('paymentAllowed');

    // Nếu không có quyền, chuyển hướng về trang login
    if (!otpAllowed && !paymentAllowed) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
