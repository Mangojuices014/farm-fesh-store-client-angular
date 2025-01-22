import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {apiUrl} from "../../utils/api.config";
import {Observable, throwError} from "rxjs";
import {Account} from "../../model/Account";

export const BASE_URL = apiUrl.BASE_URL + '/users';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  getMyProfile(): Observable<{ data: Account }> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage");
      return throwError(() => new Error("Token is missing"));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ data: Account }>(BASE_URL + "/profile", { headers });
  }

  updateMyProfile(account: Account) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage");
      return throwError(() => new Error("Token is missing"));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Gửi this.account vào body của yêu cầu PUT
    return this.http.put<{ data: Account }>(BASE_URL + "/update", account, { headers });
  }


}
