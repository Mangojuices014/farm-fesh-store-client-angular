import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from "../page/header/header.component";
import {SidebarComponent} from "../page/sidebar/sidebar.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {BASE_URL, UserService} from "../services/user/user.service";
import {Account} from "../model/Account";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "../modal/modal.component";
import {ToastComponent} from "../toast/toast.component";

const DEFAULT_PROFILE = "../../assets/images.png";
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterLinkActive, RouterLink, FormsModule, ModalComponent, ToastComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  profilePicture = DEFAULT_PROFILE;
  base_url = BASE_URL;
  accountService = inject(UserService);
  modalVisible = false;
  toastHeading = ""; toastDescription = ""; toastVisible = false;
  account: Account = { email: '', username: '', firstName: '', lastName: '' }; // Dữ liệu ban đầu
  tempAccount: Account = { ...this.account }; // Biến tạm lưu giá trị nhập vào

  ngOnInit(): void {
    this.accountService.getMyProfile().subscribe({
      next: res => {
        this.account = res.data;
        console.log("Infor API:", this.account);
      },
      error: err => {
        console.log("Error:", err);
        const error = err.error;
        console.log("Error details:", error);
      }
    });
  }

  onUpdate() {
    this.account = { ...this.tempAccount }; // Gán giá trị tạm vào account sau khi submit
    this.accountService.updateMyProfile(this.account).subscribe({
      next: res => {
        this.account = res.data;  // Cập nhật lại thông tin tài khoản
        this.generateToast("Thành công", "Cập nhật thành công");
        this.modalVisible = true;
      },
      error: err => {
        console.log("Error:", err);
        this.generateToast("Thất bại", "Cập nhật thất bại");
      }
    });
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

