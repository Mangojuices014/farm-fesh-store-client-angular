import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {ApiResponse} from "../../model/ApiResponse";
import {Order} from "../../model/Order";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly BASE_URL = 'http://localhost:8182/api/v1/vnpay';

  constructor(private http: HttpClient) {}

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

  submitOrder(businessKey: string): Observable<ApiResponse<Order>> { // Thay đổi kiểu trả về
    return this.http.get<ApiResponse<Order>>(`${this.BASE_URL}/submitOrder/${businessKey}`,{
      headers: this.getHeaders(),
    })
      .pipe(catchError(error => throwError(() => new Error(error))));
  }

}
