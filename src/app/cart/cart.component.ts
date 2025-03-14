import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../model/CartItem';
import {RouterLink} from "@angular/router";
import {CartService} from "../services/product/cart.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>(); // Tạo sự kiện đóng giỏ hàng

  cartItems: CartItem[] = [];

  constructor(
    private cartService:CartService
  ) {}

  getAllCart(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    }
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  closeCart(): void {
    this.closeEvent.emit(); // Gửi sự kiện lên component cha
  }

  checkout(): void {
    console.log("Proceeding to checkout with items:", this.cartItems);
    alert("Proceeding to checkout!");
  }
}
