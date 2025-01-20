import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  year: number;
  sonaliBankePaymentPortalUrl: any;
  eLedgerPortalUrl: any;

  employmentTypeTooltip: any = `<span class="btn-block well-sm" style="margin-left: 20px">Never trust not sanitized HTML!!!</span>`;

  constructor(private router: Router,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private apiUrl: ApiUrl,) { }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      this.sonaliBankePaymentPortalUrl = res['sonaliBankePaymentPortalUrl'].url;
      this.eLedgerPortalUrl = res['eLedgerPortalUrl'].url;
    });
    localStorage.removeItem('token');
    this.year = new Date().getFullYear();
    this.spinner.stop();
  }

  goToEtin() {
    window.location.href = 'https://secure.incometax.gov.bd/TINHome';
  }

  goToEledger() {
    // window.location.href = this.eLedgerPortalUrl;
    this.router.navigate(["/eLedger"]);
  }

  gotoETDS() {
    window.location.href = 'https://etds.gov.bd/login';
  }

  goToEReturn() {
    this.router.navigate(["/auth/sign-in"]);
  }

  onClickETaxPayment() {
    // window.location.href = this.sonaliBankePaymentPortalUrl;
    this.router.navigate(["/e-tax-payment"]);
  }

}
