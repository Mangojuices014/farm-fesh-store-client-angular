import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { Product } from "../model/Product"
import { ToastComponent } from "../toast/toast.component"
import  { OrderService } from "../services/product/order.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-product-item",
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
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

  @Input() product: Product | null = null
  @Output() closeModal = new EventEmitter<void>()
  @Output() placeOrder = new EventEmitter<{ product: Product; quantity: number }>()

  quantity = 1

  constructor(private orderService: OrderService) {}

  onCloseModal(): void {
    this.closeModal.emit()
  }

  onPlaceOrder(): void {
    if (!this.product) return

    if (this.quantity <= 0 || this.quantity > (this.product.quantityProduct || 0)) {
      this.generateToast("Thất bại", "Số lượng không hợp lệ hoặc không đủ hàng.")
      return
    }

    const orderData = {
      order_details: [
        {
          quantityOrder: this.quantity,
          product_id: this.product.id,
        },
      ],
    }

    console.log("🛒 Dữ liệu gửi lên API:", JSON.stringify(orderData))

    this.loading = true
    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        console.log("✅ Phản hồi từ API:", res)
        this.generateToast("Thành công", "Đơn hàng đã được tạo thành công.")
        this.placeOrder.emit({ product: this.product!, quantity: this.quantity })
        this.onCloseModal()
      },
      error: (err) => {
        console.error("❌ Lỗi API:", err)
        this.generateToast("Thất bại", "Bạn vẫn chưa đăng nhập hoặc dữ liệu sai.")
        this.loading = false
      },
      complete: () => {
        this.loading = false
      },
    })
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

