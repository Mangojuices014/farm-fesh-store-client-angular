import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CartItem } from '../model/CartItem';
import {RouterLink} from "@angular/router";
import {CartService} from "../services/product/cart.service";
import {Product} from "../model/Product";
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
export class CartComponent implements OnInit{

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
    private cartService:CartService
  ) {}

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
        }else {
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

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    }
  }


  closeCart(): void {
    this.closeEvent.emit(); // Gửi sự kiện lên component cha
  }

  deleteCart(cartId:string): void {
    this.cartService.removeCart(cartId).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.showToast('Thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
        }else {
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

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
