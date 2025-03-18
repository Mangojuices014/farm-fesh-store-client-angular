import { Component, Input, OnInit } from '@angular/core';
import { Product } from "../model/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../services/product/order.service";

@Component({
  selector: 'app-approval',
  standalone: true,
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit{
  cartItems: {
    product: Product;
    quantity: number;
    specialInstructions: string
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN").format(price);
  }

  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/\/d\/(.*?)\//)
    return match ? match[1] : ""
  }
}

