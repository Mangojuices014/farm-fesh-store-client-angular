import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../page/sidebar/sidebar.component";
import {HeaderComponent} from "../page/header/header.component";
import {ProductService} from "../services/product/product.service";
import {Product} from "../model/Product";
import {ProductItemComponent} from "../product-item/product-item.component";
import {ToastComponent} from "../toast/toast.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, ProductItemComponent, ToastComponent],
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
  ]
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  modalVisible = false;
  selectedProduct: Product | null = null;
  toastHeading = ""; toastDescription = ""; toastVisible = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.products = res.data;
          this.loading = false;
        } else {
          console.warn('Dữ liệu trả về không hợp lệ:', res);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        this.loading = false;
      }
    });
  }

  openOrderModal(product: Product): void {
    this.selectedProduct = product;
    this.modalVisible = true;
  }

  closeOrderModal(): void {
    this.modalVisible = false;
    this.selectedProduct = null;
  }

  onPlaceOrder(order: { product: Product, quantity: number }): void {
    this.generateToast("Thành công",`Đặt hàng thành công: ${order.product.name} - Số lượng: ${order.quantity}`);
    this.closeOrderModal();
  }

  getImageId(imageUrl: string): string {
    const match = imageUrl.match(/\/d\/(.*?)\//);
    return match ? match[1] : "";
  }
  generateToast(heading: string, description: string) {
    this.toastHeading = heading;
    this.toastDescription = description;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);
  }
}
