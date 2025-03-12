import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {apiUrl} from "../../utils/api.config";
import {throwError} from "rxjs";

export const BASE_URL = apiUrl.BASE_URL + '/orders';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  createOrder(product: any) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(BASE_URL + "/create-order/cart", product, { headers });
  }

}
