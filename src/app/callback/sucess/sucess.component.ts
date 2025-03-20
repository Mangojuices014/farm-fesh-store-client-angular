import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sucess',
  standalone: true,
  imports: [],
  templateUrl: './sucess.component.html',
  styleUrl: './sucess.component.scss'
})
export class SucessComponent implements OnInit{
  constructor(private router: Router) {}

  ngOnInit(): void {
    sessionStorage.removeItem('paymentAllowed');
  }
  goToOrders() {
    this.router.navigate(["/products"]);
  }

  goToHome() {
    this.router.navigate(["/products"]);
  }
}
