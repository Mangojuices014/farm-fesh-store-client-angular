import {inject, Injectable} from '@angular/core';
import {apiUrl} from "../../utils/api.config";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, throwError} from "rxjs";
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

  verifyOtp(otp: string) {
    const email = localStorage.getItem("otpEmail");

    if (!email) {
      return throwError(() => new Error("Không tìm thấy Email của bạn"));
    }

    return this.http.post(BASE_URL + "/verify-otp", { email, otp }).pipe(
      catchError(error => {
        console.error("Lỗi xác thực OTP:", error);
        return throwError(() => new Error("Xác thực OTP thất bại, vui lòng thử lại!"));
      })
    );
  }

}
