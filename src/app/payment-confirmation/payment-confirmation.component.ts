import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../services/product/order.service";
import {Order} from "../model/Order";
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.scss'
})
export class PaymentConfirmationComponent implements OnInit {
  order!: Order;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      if (orderId) {
        this.loadOrder(orderId);
      }
    });
  }

  loadOrder(orderId: string): void {
    this.loading = true;
    this.orderService.getOder(orderId).subscribe({ // Giả sử bạn có hàm getOrder
      next: (res) => {
        this.order = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
        this.loading = false;
      }
    });
  }
}
