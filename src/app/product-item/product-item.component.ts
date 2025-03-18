import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { Product } from "../model/Product"
import { ToastComponent } from "../toast/toast.component"
import  { OrderService } from "../services/product/order.service"
import { CommonModule } from "@angular/common"
import {RouterLink} from "@angular/router";

@Component({
  selector: "app-product-item",
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, RouterLink],
  templateUrl: "./product-item.component.html",
  styleUrls: ["./product-item.component.scss"],
})
export class ProductItemComponent {
  modalVisible = false
  loading = false
  toastHeading = ""
  toastDescription = ""
  toastVisible = false
  specialInstructions = ""
  activeTab = "details" // 'details' or 'nutrition'

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
  @Output() closeModal = new EventEmitter<void>()
  @Output() placeOrder = new EventEmitter<{ product: Product; quantity: number }>()

  quantity = 1

  constructor(private orderService: OrderService) {}

  onCloseModal(): void {
    this.closeModal.emit()
  }


  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/\/d\/(.*?)\//)
    return match ? match[1] : ""
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < (this.product.quantityProduct || 10)) {
      this.quantity++
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  generateToast(heading: string, description: string) {
    this.toastHeading = heading
    this.toastDescription = description
    this.toastVisible = true
    setTimeout(() => {
      this.toastVisible = false
    }, 5000)
  }
}

