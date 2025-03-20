import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {OrderService} from "../services/product/order.service";
import {CommonModule} from '@angular/common';
import {filter} from 'rxjs/operators';
import {Order} from "../model/response/OrderResponse";
import {ApiResponse} from "../model/ApiResponse";
import {PaymentService} from "../services/product/payment.service";

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss']
})
export class PaymentConfirmationComponent implements OnInit {
  order: Order = {
    id: '',
    businessKey: '',
    totalPrice: 1,
    orderInfo: '',
    send_status: false,
    shipmentId: '',
    status: '',
    totalItem: 0,
    userId: 0,
    completeDate: '',
    orderDetails: [
      {
        productId: '',
        quantity: 1,
        price: 0,
        totalPrice: 0
      }
    ]
  };

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private paymentService:PaymentService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter(params => !!params['orderId'])
    ).subscribe(params => {
      this.loadOrder(params['orderId']);
    });
  }

  loadOrder(orderId: string): void {
    this.loading = true;
    this.orderService.getOder(orderId).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res && res.data) {
          this.order = res.data;
        } else {
          console.warn("Dữ liệu đơn hàng không hợp lệ:", res);
          this.order = {} as Order;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
        this.loading = false;
      }
    });
  }

  submitOrder(order: Order) {
    if (!order.businessKey) {
      return;
    }
    this.paymentService.submitOrder(order.businessKey).subscribe({
      next: (res: any) => {
        console.log("Payment URL:", res);

        // Kiểm tra xem res có thuộc tính vnp_Returnurl không
        if (res.vnp_Returnurl) {
          window.location.href = res.vnp_Returnurl; // Chuyển hướng đến trang thanh toán
        }
      },
      error: (err: any) => {
        console.log(err.error.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
