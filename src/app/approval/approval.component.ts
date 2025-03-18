import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../model/Product";

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {
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

  onPlaceOrder(): void {
    if (!this.product) return

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

}
