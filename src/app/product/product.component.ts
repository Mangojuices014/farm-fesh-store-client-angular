import { Component, type OnInit } from "@angular/core"
import { SidebarComponent } from "../page/sidebar/sidebar.component"
import { HeaderComponent } from "../page/header/header.component"
import  { ProductService } from "../services/product/product.service"
import  { Product } from "../model/Product"
import { ProductItemComponent } from "../product-item/product-item.component"
import { ToastComponent } from "../toast/toast.component"
import { FormsModule } from "@angular/forms"
import { NzSelectModule } from "ng-zorro-antd/select"
import type { Cart } from "../model/Cart"
import { CartComponent } from "../cart/cart.component"
import { CommonModule } from "@angular/common"
import { NzSkeletonModule } from "ng-zorro-antd/skeleton"

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    ProductItemComponent,
    ToastComponent,
    FormsModule,
    NzSelectModule,
    NzSkeletonModule,
    CartComponent,
  ],
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  products: Product[] = []
  cart: Cart = { productId: "", quantity: 0 }
  loading = false
  modalVisible = false
  modalType = ""
  selectedProduct: Product | null = null
  toastHeading = ""
  toastDescription = ""
  toastVisible = false
  isCartVisible = false // Ban đầu ẩn giỏ hàng
  cartItemCount = 0

  toggleCart() {
    this.isCartVisible = !this.isCartVisible
    console.log("Giỏ hàng hiển thị: ", this.isCartVisible)
  }

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.loading = true
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.products = res.data
          this.loading = false
          console.log(res.data)
        } else {
          console.warn("Dữ liệu trả về không hợp lệ:", res)
          this.loading = false
        }
      },
      error: (err) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err)
        this.loading = false
      },
    })
  }

  openOrderModal(product: Product): void {
    this.selectedProduct = product
    this.modalType = "order"
    this.modalVisible = true
  }

  openCartModal(product: Product): void {
    this.selectedProduct = product
    this.modalType = "cart"
    this.modalVisible = true
    this.cartItemCount++
    this.generateToast("Thành công", `Đã thêm ${product.name} vào giỏ hàng`)
  }

  closeOrderModal(): void {
    this.modalVisible = false
    this.selectedProduct = null
  }

  closeCartModal(): void {
    this.modalVisible = false
    this.selectedProduct = null
  }

  onPlaceOrder(order: { product: Product; quantity: number }): void {
    this.generateToast("Thành công", `Đặt hàng thành công: ${order.product.name} - Số lượng: ${order.quantity}`)
    this.closeOrderModal()
  }

  onPlaceCart(order: { product: Product; quantity: number }): void {
    this.generateToast(
      "Thành công",
      `Thêm vào giỏ hàng thành công: ${order.product.name} - Số lượng: ${order.quantity}`,
    )
    this.closeOrderModal()
    this.cartItemCount++
  }

  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]+)/);
    return match ? match[1] : "";
  }

  generateToast(heading: string, description: string) {
    this.toastHeading = heading
    this.toastDescription = description
    this.toastVisible = true
    setTimeout(() => {
      this.toastVisible = false
    }, 5000)
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN").format(price)
  }
}

