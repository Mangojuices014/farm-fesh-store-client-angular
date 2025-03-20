import {Component, inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HeaderComponent} from "../../page/header/header.component";
import {SidebarComponent} from "../../page/sidebar/sidebar.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {BASE_URL, UserService} from "../../services/user/user.service";
import {Account} from "../../model/Account";
import {FormsModule} from "@angular/forms";
import {ToastComponent} from "../../page/toast/toast.component";
import {CommonModule} from "@angular/common";
import {NzModalComponent} from "ng-zorro-antd/modal";

const DEFAULT_PROFILE = "../../assets/images.png";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    RouterLinkActive,
    RouterLink,
    FormsModule,
    NzModalComponent,
    ToastComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @ViewChild('profilePic') profilePicElement!: ElementRef;

  profilePicture = DEFAULT_PROFILE;
  base_url = BASE_URL;
  accountService = inject(UserService);
  modalVisible = false;
  toastHeading = "";
  toastDescription = "";
  toastVisible = false;
  isLoading = true;
  isSaving = false;
  activeTab = 'personal'; // 'personal' or 'address'

  account: Account = {
    email: '',
    username: '',
    firstName: '',
    lastName: ''
  };

  tempAccount: Account = { ...this.account };

  // Address fields (mock data since they're not in the Account model)
  address = {
    city: '',
    state: '',
    country: '',
    zipcode: ''
  };

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.accountService.getMyProfile().subscribe({
      next: res => {
        this.account = res.data;
        this.tempAccount = { ...this.account };
        this.isLoading = false;
      },
      error: err => {
        console.log("Error:", err);
        const error = err.error;
        console.log("Error details:", error);
        this.isLoading = false;
        this.generateToast("Lỗi", "Không thể tải thông tin người dùng");
      }
    });
  }

  onUpdate() {
    this.isSaving = true;
    this.accountService.updateMyProfile(this.tempAccount).subscribe({
      next: res => {
        this.account = res.data;
        this.tempAccount = { ...this.account };
        this.generateToast("Thành công", "Cập nhật thông tin thành công");
        this.isSaving = false;
      },
      error: err => {
        console.log("Error:", err);
        this.generateToast("Thất bại", "Cập nhật thông tin thất bại");
        this.isSaving = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openFileSelector(): void {
    // Simulate clicking the hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profilePicture = e.target.result;
          // Here you would typically upload the image to your server
          this.generateToast("Thành công", "Ảnh đại diện đã được cập nhật");
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
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
