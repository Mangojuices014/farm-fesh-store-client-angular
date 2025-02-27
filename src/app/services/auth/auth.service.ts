import {inject, Injectable} from '@angular/core';
import {apiUrl} from "../../utils/api.config";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";


export const BASE_URL = apiUrl.BASE_URL + '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  http = inject(HttpClient);
  noauth = { headers: { "noauth": "noauth" } };

  constructor() { }

  createAccount(account: any) {
    return this.http.post(BASE_URL + "/register", account, this.noauth);
  }

  loginAccount(account: any) {
    return this.http.post(BASE_URL + "/login", account, this.noauth);
  }

}
