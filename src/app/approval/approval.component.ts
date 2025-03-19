import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../model/Product';
import { Observable } from 'rxjs';
import {ProductService} from "../services/product/product.service";
import {ApiResponse} from "../model/ApiResponse";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-approval',
  standalone: true,
  templateUrl: './approval.component.html',
  imports: [
    CurrencyPipe
  ],
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
  product!: Product;  // Chỉ là 1 sản phẩm, không phải mảng
  quantity: number = 1;
  cartItems: { product: Product; quantity: number }[] = []; // Thêm giỏ hàng

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const productId = params['productId'];
      this.quantity = params['quantity'] ? +params['quantity'] : 1;

      if (productId) {
        this.getProduct(productId).subscribe({
          next: (response) => {
            if (response && response.data) {
              this.product = response.data;
              // Thêm vào giỏ hàng
              this.cartItems = [{ product: this.product, quantity: this.quantity }];
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
}

