import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {apiUrl} from "../../utils/api.config";
import {BehaviorSubject, throwError} from "rxjs";

export const BASE_URL = apiUrl.BASE_URL + '/orders';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  private orderData = new BehaviorSubject<any>(null);
  orderData$ = this.orderData.asObservable(); // Dữ liệu có thể subscribe

  setOrderData(data: any) {
    this.orderData.next(data);
  }

  getOrderData() {
    return this.orderData.getValue();
  }

  clearOrderData() {
    this.orderData.next(null);
  }

  createOrder(product: any) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(BASE_URL + "/create-order/cart", product, { headers });
  }

}
