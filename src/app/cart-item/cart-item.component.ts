// import {Component, EventEmitter, Input, Output} from '@angular/core';
// import {Product} from "../model/Product";
// import {OrderService} from "../services/product/order.service";
// import {CartService} from "../services/product/cart.service";
// import {Cart} from "../model/Cart";
// import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {ToastComponent} from "../toast/toast.component";
//
// @Component({
//   selector: 'app-cart-item',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     ToastComponent,
//     FormsModule,
//   ],
//   templateUrl: './cart-item.component.html',
//   styleUrl: './cart-item.component.scss'
// })
// export class CartItemComponent {
//   modalVisible = false;
//   loading = false;
//   toastHeading = "";
//   toastDescription = "";
//   toastVisible = false;
//
//   @Input() product: Product | null = null; // Nhận dữ liệu sản phẩm từ component cha
//   @Output() closeModal = new EventEmitter<void>(); // Sự kiện đóng modal
//   @Output() placeOrder = new EventEmitter<{ product: Product, quantity: number }>(); // Sự kiện đặt hàng
//
//   quantity: number = 1; // Số lượng mặc định
//
//   constructor(private cartService: CartService) {}
//
//   // Đóng modal
//   onCloseModal(): void {
//     this.closeModal.emit();
//   }
//
//   // Kiểm tra người dùng đã đăng nhập chưa
//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }
//
//   // Xử lý thêm vào giỏ hàng
//   onPlaceCart(): void {
//     if (!this.product) return;
//
//     if (!this.isLoggedIn()) {
//       this.generateToast("Thất bại", "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
//       return;
//     }
//
//     if (this.quantity <= 0 || this.quantity > (this.product.quantityProduct || 0)) {
//       this.generateToast("Thất bại", "Số lượng không hợp lệ hoặc không đủ hàng.");
//       return;
//     }
//
//     const cartItem: Cart = {
//       productId: this.product.id,
//       quantity: this.quantity
//     };
//
//     this.loading = true; // Bắt đầu loading
//     this.cartService.addCart(cartItem).subscribe({
//       next: () => {
//         this.generateToast("Thành công", "Sản phẩm đã được thêm vào giỏ hàng.");
//         this.placeOrder.emit({ product: this.product!, quantity: this.quantity });
//         this.onCloseModal(); // Đóng modal sau khi đặt hàng thành công
//       },
//       error: (err) => {
//         this.generateToast("Thất bại", err?.error?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
//         this.loading = false; // Kết thúc loading
//       },
//       complete: () => {
//         this.loading = false; // Kết thúc loading
//       }
//     });
//   }
//
//   // Lấy ID hình ảnh từ URL Google Drive
//   getImageId(imageUrl: string | null | undefined): string {
//     if (!imageUrl) return ""; // Kiểm tra imageUrl trước khi xử lý
//     const match = imageUrl.match(/\/d\/(.*?)\//);
//     return match ? match[1] : "";
//   }
//
//   generateToast(heading: string, description: string) {
//     this.toastHeading = heading;
//     this.toastDescription = description;
//     this.toastVisible = true;
//     setTimeout(() => {
//       this.toastVisible = false;
//     }, 5000);
//   }
// }
//
