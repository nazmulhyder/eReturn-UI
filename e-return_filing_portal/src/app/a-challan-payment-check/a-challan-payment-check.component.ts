import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-a-challan-payment-check',
  templateUrl: './a-challan-payment-check.component.html',
  styleUrls: ['./a-challan-payment-check.component.css']
})
export class AChallanPaymentCheckComponent implements OnInit {
  isSuccess: boolean = false;
  transactionId: any;
  challanNo: any;
  clientName: any;
  paidAmount: any;
  paymentId: any;
  userTIN: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  constructor(
    private activeRoutes: ActivatedRoute,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private authService: AuthService,
    private spinner: NgxUiLoaderService,
  ) {
    this.activeRoutes.queryParams.subscribe(params => {
      // console.log('params', params);
      this.transactionId = params['transaction_id'];
      this.challanNo = params['challan_no'];
      this.clientName = params['clientname'];
      this.paidAmount = params['paidamount'];
      this.paymentId = params['paymentid'];
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.spinner.start();
    this.userTIN = localStorage.getItem("tin");
    this.paymentCheck();
    this.spinner.stop();
  }

  paymentCheck() {
    // debugger;
    if (!this.authService.loggedIn() || this.challanNo == undefined) {
      this.toastr.error("Unauthorized user. Please, log in & make payment first.", '', {
        timeOut: 4000,
      });
    } else {
      let requestJson = {
        "assessmentYear": "2021-2022",
        "challanNo": this.challanNo,
        "clientName": this.clientName,
        "paidAmount": this.paidAmount,
        // "paymentId": this.paymentId,
        "paymentId": this.paymentId,
        "tin": this.userTIN,
        "transactionId": this.transactionId
      }
     // console.log('requestJson', requestJson);
      this.apiService.post(this.serviceUrl + 'api/payment/redirected_user_achallan', requestJson)
        .subscribe(result => {
       //   console.log('api response', result);
          if (JSON.stringify(result.replyMessage) != '{}') {
            this.isSuccess = true;
          }
        },
          error => {
      //      console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }

  }
  backToHome() {
    // this.router.navigate(["/user-panel/assessment"]);
    this.router.navigate(["/user-panel/home"]);
  }

  backToTaxAndPayment() {
    this.router.navigate(["/user-panel/tax-and-payment"]);
  }

}
