import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import {CartItem} from "../../model/CartItem";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([])
  cartItems$ = this.cartItems.asObservable()

  constructor() {}

  getCartItems(): CartItem[] {
    return this.cartItems.value
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value
    const existingItem = currentItems.find((i) => i.id === item.id)

    if (existingItem) {
      existingItem.quantity += item.quantity
      this.cartItems.next([...currentItems])
    } else {
      this.cartItems.next([...currentItems, item])
    }
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentItems = this.cartItems.value
    const updatedItems = currentItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity }
      }
      return item
    })
    this.cartItems.next(updatedItems)
  }

  removeFromCart(itemId: number): void {
    const currentItems = this.cartItems.value
    const updatedItems = currentItems.filter((item) => item.id !== itemId)
    this.cartItems.next(updatedItems)
  }

  clearCart(): void {
    this.cartItems.next([])
  }

  getTotal(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}

