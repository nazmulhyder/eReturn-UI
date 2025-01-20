import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(
    private activeRoutes: ActivatedRoute,
    private router: Router,
    private spinner: NgxUiLoaderService,
    ) 
    { }

  userTIN : any;

  ngOnInit(): void {
    this.spinner.start();
    this.userTIN = this.activeRoutes.snapshot.paramMap.get("tin")
    this.spinner.stop();
  }

  backToHome()
  {
    // this.router.navigate(["/user-panel/assessment"]);
    this.router.navigate(["/user-panel/home"]);
  }

  backToTaxAndPayment()
  {
    this.router.navigate(["/user-panel/tax-and-payment"]);
  }

}
