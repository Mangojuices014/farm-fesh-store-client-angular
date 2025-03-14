import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Cart} from "../../model/Cart";


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly BASE_URL = 'http://localhost:8182/api/v1/carts';

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

  getAllCarts(): Observable<any> {
    return this.http
      .get(`${this.BASE_URL}/get-all-cart`, { headers: this.getHeaders() })
      .pipe(catchError((error) => throwError(() => new Error(error))));
  }

  addToCart(cart: Cart): Observable<any> {
    return this.http
      .post(`${this.BASE_URL}/create-cart`, cart, { headers: this.getHeaders() })
      .pipe(catchError((error) => throwError(() => new Error(error))));
  }

  updateQuantity(cartId: string): Observable<any> {
    return this.http
      .put(`${this.BASE_URL}/select-cart/${cartId}`, {}, { headers: this.getHeaders() })
      .pipe(catchError((error) => throwError(() => new Error(error))));
  }

  removeCart(cartId: string): Observable<any> {
    return this.http
      .delete(`${this.BASE_URL}/delete-cart/${cartId}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => throwError(() => new Error(error))));
  }

  removeAllCart(): Observable<any> {
    return this.http
      .delete(`${this.BASE_URL}/delete-all-cart`, { headers: this.getHeaders() })
      .pipe(catchError((error) => throwError(() => new Error(error))));
  }
}
