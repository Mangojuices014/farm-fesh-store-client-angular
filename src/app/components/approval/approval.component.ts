import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../model/Product';
import {Observable} from 'rxjs';
import {ProductService} from "../../services/product/product.service";
import {ApiResponse} from "../../model/ApiResponse";
import {CurrencyPipe} from "@angular/common";
import {Order, Shipment} from "../../model/Order";
import {OrderService} from "../../services/product/order.service";
import {FormsModule} from "@angular/forms";
import {ToastComponent} from "../../page/toast/toast.component";

@Component({
  selector: 'app-approval',
  standalone: true,
  templateUrl: './approval.component.html',
  imports: [
    CurrencyPipe,
    FormsModule,
    ToastComponent
  ],
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
  product!: Product;
  order: Order = {
    id: '',
    totalPrice: 1,
    orderInfo: '',
    shipment: {
      address: '',
      phone: '',
      email: '',
      customerName: ''
    },
    details: {
      productId: '',
      quantity: 1
    }
  };
  quantity: number = 1;
  loading = false;
  toastHeading = '';
  toastDescription = '';
  toastVisible = false;
  cartItems: { product: Product; quantity: number }[] = [];
  orderCreated = false; // Mặc định chưa tạo đơn hàng


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private zone: NgZone, // Inject NgZone
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const productId = params['productId'];
      const quantity = params['quantity'] ? +params['quantity'] : 1;

      if (productId) {
        this.getProduct(productId).subscribe({
          next: (response) => {
            if (response && response.data) {
              this.product = response.data;
              this.cartItems = [{product: this.product, quantity}];

              // Cập nhật thông tin đơn hàng
              this.order.details.productId = productId;
              this.order.details.quantity = quantity;
            }
          },
          error: (error) => console.error(error.message)
        });
      }
    });
  }

  getProduct(productId: string): Observable<ApiResponse<Product>> {
    return this.productService.getProduct(productId);
  }

  createOrder() {
    if (!this.validateOrder()) {
      this.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    this.loading = true; // Bắt đầu loading
    this.orderService.createOrder(this.order).subscribe({
      next: (res) => {
        console.log("API Response:", res);
        this.order = res.data;
        this.orderCreated = true; // Đơn hàng đã được tạo
        sessionStorage.setItem('paymentAllowed', 'true');
        this.router.navigate(['/payment-confirmation'], {
          queryParams: {orderId: this.order.id} // hoặc cách truyền dữ liệu khác
        });
      },
      error: (err) => {
        console.error("Lỗi khi tạo đơn hàng:", err);
        this.showToast("Thất bại", err.error.message || "Lỗi không xác định.");
        this.loading = false; // Kết thúc loading
      },
      complete: () => {
        this.loading = false; // Kết thúc loading
      }
    });
  }

  validateOrder(): boolean {
    return this.order.shipment.address.trim() !== '' &&
      this.order.shipment.phone.trim() !== '' &&
      this.order.shipment.email.trim() !== '' &&
      this.order.shipment.customerName.trim() !== '';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/\/d\/(.*?)\//);
    return match ? match[1] : '';
  }

  showToast(heading: string, description: string): void {
    this.toastHeading = heading;
    this.toastDescription = description;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 5000);
  }


}
