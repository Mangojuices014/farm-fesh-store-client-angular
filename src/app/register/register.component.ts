import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ToastComponent} from "../toast/toast.component";
import { FormsModule, NgForm } from '@angular/forms';
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ToastComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  accountService = inject(AuthService);
  toastHeading = ""; toastDescription = ""; toastVisible = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.accountService.createAccount(form.value).subscribe({
        next: res => {
          this.generateToast("Thành công", "Đăng ký thành công");
          form.reset();
        },
        error: err => {
          const errorMessage = err?.error?.message
          this.generateToast("Thất bại", errorMessage);
        }
      });
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
