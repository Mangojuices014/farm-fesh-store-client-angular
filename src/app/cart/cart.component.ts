import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../model/CartItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>(); // Tạo sự kiện đóng giỏ hàng

  cartItems: CartItem[] = [];

  constructor() {
    this.cartItems = [
      { id: 1, name: "Grilled Beef with potatoes", price: 29.95, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Fresh Mushroom with vegetables", price: 24.5, quantity: 2, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Italian Pizza with extra cheese", price: 19.95, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
    ];
  }

  get total(): number {
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
