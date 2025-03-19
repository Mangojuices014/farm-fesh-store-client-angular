import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {apiUrl} from "../../utils/api.config";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Order} from "../../model/Order";
import {ApiResponse} from "../../model/ApiResponse";
import {Product} from "../../model/Product";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly BASE_URL = 'http://localhost:8182/api/v1/orders';
  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  private orderData = new BehaviorSubject<any>(null);
  orderData$ = this.orderData.asObservable(); // Dữ liệu có thể subscribe

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Token is missing');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  setOrderData(data: any) {
    this.orderData.next(data);
  }

  createOrder(order: Order): Observable<{ data: Order }> {
    return this.http
      .post<{ data: Order }>(`${this.BASE_URL}/create-order/cart`, order, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => throwError(() => new Error(error.message))));
  }

  getOder(orderId: string): Observable<ApiResponse<Order>> { // Thay đổi kiểu trả về
    return this.http.get<ApiResponse<Order>>(`${this.BASE_URL}/get-order/${orderId}`)
      .pipe(catchError(error => throwError(() => new Error(error))));
  }

}
