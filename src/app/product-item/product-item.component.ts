import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {Product} from "../model/Product";
import {ToastComponent} from "../toast/toast.component";
import {OrderService} from "../services/product/order.service";

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    FormsModule,ToastComponent
  ],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'] // ✅ Sửa styleUrl thành styleUrls
})
export class ProductItemComponent {
  modalVisible = false;
  loading = false;
  toastHeading = ""; toastDescription = ""; toastVisible = false;
  @Input() product: Product | null = null; // Nhận dữ liệu sản phẩm từ component cha
  @Output() closeModal = new EventEmitter<void>(); // Sự kiện đóng modal
  @Output() placeOrder = new EventEmitter<{ product: Product, quantity: number }>(); // Sự kiện đặt hàng

  quantity: number = 1; // Số lượng mặc định

  constructor(private orderService: OrderService) {} // 🔹 Inject OrderService


  // Đóng modal
  onCloseModal(): void {
    this.closeModal.emit();
  }

  // Xử lý đặt hàng
  onPlaceOrder(): void {
    if (!this.product) return;

    if (this.quantity <= 0 || this.quantity > (this.product.quantityProduct || 0)) {
      this.generateToast("Thất bại", "Số lượng không hợp lệ hoặc không đủ hàng.");
      return;
    }

    const orderData = {
      order_details: [
        {
          quantityOrder: this.quantity,
          product_id: this.product.id
        }
      ]
    };

    console.log("🛒 Dữ liệu gửi lên API:", JSON.stringify(orderData)); // Debug

    this.loading = true;
    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        console.log("✅ Phản hồi từ API:", res);
        this.generateToast("Thành công", "Đơn hàng đã được tạo.");
        this.placeOrder.emit({ product: this.product!, quantity: this.quantity });
        this.onCloseModal();
      },
      error: (err) => {
        console.error("❌ Lỗi API:", err);
        this.generateToast("Thất bại", "Bạn vẫn chưa đăng nhập hoặc dữ liệu sai.");
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  // Lấy ID hình ảnh từ URL Google Drive
  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/\/d\/(.*?)\//);
    return match ? match[1] : '';
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
