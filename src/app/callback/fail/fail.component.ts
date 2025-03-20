import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-fail',
  standalone: true,
  imports: [],
  templateUrl: './fail.component.html',
  styleUrl: './fail.component.scss'
})
export class FailComponent implements OnInit{
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Optionally extract error details from query parameters
    this.route.queryParams.subscribe((params) => {
      console.log(
        "Payment Error Details from Payment Gateway, Error Details : " +
        JSON.stringify(params)
      );
    });
  }

  tryAgain() {
    this.router.navigate(["/products"]); // Or navigate back to the checkout page
  }

  goToHome() {
    this.router.navigate(["/products"]);
  }
}
