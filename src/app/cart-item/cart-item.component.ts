import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../model/Product";
import {CartService} from "../services/product/cart.service";
import {Cart} from "../model/Cart";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastComponent} from "../toast/toast.component";

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastComponent,
    FormsModule,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() product: Product = {
    id: '',
    sku: '',
    name: '',
    description: '',
    price: 0,
    quantityProduct: 1,
    image: '',
    origin: '',
    harvestDate: '',
    shelfLife: 0,
    weight: 0,
  };
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateCart = new EventEmitter<void>();
  @Output() placeOrder = new EventEmitter<{ product: Product, quantity: number }>(); // Sự kiện đặt hàng

  //Kiểm tra người dùng đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  quantity = 1;
  loading = false;
  toastHeading = '';
  toastDescription = '';
  toastVisible = false;

  constructor(private cartService: CartService) {}

  onCloseModal(): void {
    this.closeModal.emit();
  }

  //   // Xử lý thêm vào giỏ hàng
  onPlaceCart(): void {
    if (!this.product) return;

    if (!this.isLoggedIn()) {
      this.showToast("Thất bại", "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    if (this.quantity <= 0 || this.quantity > (this.product.quantityProduct || 0)) {
      this.showToast("Thất bại", "Số lượng không hợp lệ hoặc không đủ hàng.");
      return;
    }

    const cartItem: Cart = {
      productId: this.product.id,
      quantity: this.quantity
    };

    this.loading = true; // Bắt đầu loading
    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.showToast("Thành công", "Sản phẩm đã được thêm vào giỏ hàng.");
        this.placeOrder.emit({ product: this.product!, quantity: this.quantity });
        this.onCloseModal(); // Đóng modal sau khi đặt hàng thành công
      },
      error: (err : any) => {
        this.showToast("Thất bại", err?.error?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        this.loading = false; // Kết thúc loading
      },
      complete: () => {
        this.loading = false; // Kết thúc loading
      }
    });
  }

  removeFromCart(cartId: string): void {
    this.loading = true;
    this.cartService.removeCart(cartId).subscribe({
      next: () => {
        this.showToast('Thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
        this.updateCart.emit();
      },
      error: () => {
        this.showToast('Lỗi', 'Không thể xóa sản phẩm.');
      },
      complete: () => (this.loading = false),
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < (this.product.quantityProduct || 10)) {
      this.quantity++;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]+)/);
    return match ? match[1] : "";
  }
  showToast(heading: string, description: string): void {
    this.toastHeading = heading;
    this.toastDescription = description;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 5000);
  }

}

