import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartItem} from '../../model/CartItem';
import {RouterLink} from "@angular/router";
import {CartService} from "../../services/product/cart.service";
import {Product} from "../../model/Product";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  imports: [
    RouterLink,
    CurrencyPipe
  ],
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItem: CartItem[] = []

  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>(); // Tạo sự kiện đóng giỏ hàng
  @Output() updateCart = new EventEmitter<void>();


  loading = false;
  cartItems: CartItem[] = [];
  toastHeading = '';
  toastDescription = '';
  toastVisible = false;


  constructor(
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.getAllCart()
  }

  getAllCart(): void {
    this.loading = true;
    this.cartService.getAllCarts().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.cartItems = res.data
          console.log("Cart:", this.cartItems);
          this.showToast('Thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
        } else {
          this.showToast("Thất bại", "Dữ liệu không hợp lệ")
          this.loading = false
        }
      },
      error: () => {
        this.showToast('Lỗi', 'Không thể xóa sản phẩm.');
      },
      complete: () => (this.loading = false),
    });
  }

  updateSelect(cartId: string) {
    this.cartService.updateSelect(cartId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          let item = this.cartItems.find(item => item.id === cartId);
          if (item) item.selected = item.selected === 1 ? 0 : 1; // Chuyển đổi trạng thái chọn
          this.showToast('Thành công', res.data.message);
        }
      }
    });
  }


  updateQualityPlus(cartId: string) {
    this.cartService.updateQuantityPlus(cartId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          let item = this.cartItems.find(item => item.id === cartId);
          if (item) item.quantity += 1; // Chỉ cập nhật số lượng của item đó
          this.showToast('Thành công', res.data.message);
        }
      }
    });
  }

  updateQualityMinus(cartId: string) {
    this.cartService.updateQuantityMinus(cartId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          let item = this.cartItems.find(item => item.id === cartId);
          if (item) item.quantity -= 1; // Chỉ cập nhật số lượng
          this.showToast('Thành công', res.data.message);
        }
      }
    });
  }



  deleteCart(cartId: string): void {
    this.cartService.removeCart(cartId).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.showToast('Thành công', res.data.message);
          this.getAllCart(); // GỌI LẠI HÀM LOAD GIỎ HÀNG NGAY
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.showToast('Lỗi', err.message);
      },
      complete: () => (this.loading = false),
    });
  }


  getTotalPrice(): number {
    return this.cartItems
      .filter(item => item.selected === 1) // Chỉ lấy sản phẩm có selected = 1
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }


  closeCart(): void {
    this.closeEvent.emit(); // Gửi sự kiện lên component cha
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
