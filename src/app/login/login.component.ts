import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {FormsModule, NgForm} from "@angular/forms";
import {ToastComponent} from "../toast/toast.component";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  accountService = inject(AuthService);
  router = inject(Router);
  private jwtHelper = new JwtHelperService();
  toastHeading = ""; toastDescription = ""; toastVisible = false;

  onLogin(form: NgForm) {
    if (form.valid) {
      this.accountService.loginAccount(form.value).subscribe({
        next: res => {
          const response = res as any;
          if (response?.data?.access_token) {
            localStorage.setItem("token", response.data.access_token);
            const decodedToken = this.jwtHelper.decodeToken(
              response.data.access_token
            )
            const roles = decodedToken?.realm_access?.roles || [];
            console.log("Vai trò của người dùng:", roles);

            if (roles.includes("ADMIN")) {
              localStorage.setItem("role", "admin");
              this.router.navigate(["/user"]);
            } else {
              localStorage.setItem("role", "user");
              this.router.navigate(["/home"]);
            }
            this.router.navigate(["/profile"]); // Chuyển hướng khi đăng nhập thành công
            form.reset();
          } else {
            this.generateToast("Thất bại", "Không tìm thấy token trong phản hồi.");
          }
        },
        error: err => {
          const errorMessage = err?.error?.message
          this.generateToast("Thất bại", errorMessage);
        }
      })
    }
  }

  generateToast(heading: string, description: string) {
    this.toastHeading = heading;
    this.toastDescription = description;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);

  }
}
