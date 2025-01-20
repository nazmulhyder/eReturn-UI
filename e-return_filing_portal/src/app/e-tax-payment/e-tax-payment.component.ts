import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-e-tax-payment',
  templateUrl: './e-tax-payment.component.html',
  styleUrls: ['./e-tax-payment.component.css']
})
export class ETaxPaymentComponent implements OnInit {

  constructor(private router:Router, private spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.spinner.start();
    this.spinner.stop();
  }

  onBacktoMainPage() {
    this.router.navigate(["/landing-page"]);
  }

}
