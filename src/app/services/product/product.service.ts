import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Product} from "../../model/Product";
import {catchError} from "rxjs/operators";
import {ApiResponse} from "../../model/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly BASE_URL = 'http://localhost:8182/api/v1/products';

  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  getAllProduct(): Observable<{ message: string; data: Product[] }> {
    return this.http
      .get<{ message: string; data: Product[] }>(`${this.BASE_URL}/get-all-product`, this.noauth)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error));
        })
      );
  }

  getProduct(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.BASE_URL}/get-product/${productId}`)
      .pipe(catchError(error => throwError(() => new Error(error))));
  }
}
