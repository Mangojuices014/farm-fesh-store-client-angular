import {Component, inject, OnInit} from '@angular/core';
import {SidebarComponent} from "../page/sidebar/sidebar.component";
import {HeaderComponent} from "../page/header/header.component";
import {BASE_URL} from "../services/user/user.service";
import {Account} from "../model/Account";
import {ProductService} from "../services/product/product.service";
import {Product} from "../model/Product";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
  ]
})
export class ProductComponent implements OnInit {
  productService = inject(ProductService);

  products: Product[] = [];
  loading = false;
  modalVisible = false;
  toastHeading = "";
  toastDescription = "";
  toastVisible = false;

  product: Product = {
    id:'',
    sku: '',
    name: '',
    description: '',
    price: 0,
    quantityProduct: 0,
    image: '',
    active: false,
    material: '',
    sizeWeight: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0
  };

  tempProduct: Product = { ...this.product };

  ngOnInit() {
    if (this.tempProduct) {
      this.product = { ...this.tempProduct };
    } else {
      console.warn("tempProduct chưa được khởi tạo");
    }
    this.loading = true;
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.products = res.data;
          console.log("Danh sách sản phẩm:", this.products);
          this.loading = false;
        } else {
          console.warn("Dữ liệu trả về không hợp lệ:", res);
          this.generateToast("Thất bại", "Dữ liệu trả về không hợp lệ");
          this.loading = false;
        }
      },
      error: (err) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        this.generateToast("Thất bại", "Không tìm thấy sản phẩm");
        this.loading = false;
      }
    });
  }

  getImageUrl(driveUrl: string): string {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : "assets/default-image.png";
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
