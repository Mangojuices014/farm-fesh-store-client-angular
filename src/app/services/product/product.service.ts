import {inject, Injectable} from '@angular/core';
import {apiUrl} from "../../utils/api.config";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Account} from "../../model/Account";
import {Product} from "../../model/Product";

export const BASE_URL = apiUrl.BASE_URL + '/products';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  getAllProduct(): Observable<{ message: string; data: Product[] }> {
    return this.http.get<{ message: string; data: Product[] }>(
      BASE_URL + "/get-all-product",
      this.noauth
    );
  }


}
