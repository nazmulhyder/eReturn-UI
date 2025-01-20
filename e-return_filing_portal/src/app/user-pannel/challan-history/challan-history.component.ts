import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';

@Component({
  selector: 'app-challan-history',
  templateUrl: './challan-history.component.html',
  styleUrls: ['./challan-history.component.css']
})
export class ChallanHistoryComponent implements OnInit {
  userTin : any;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  challanList = [];
  tableLen = 0;
  paymentRequestJson:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private commaSeparatorService : CommaSeparatorService
  ) { 
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.paymentSuccessCheck();
  }


  paymentSuccessCheck() {
    this.paymentRequestJson =
    {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    this.apiService.get(this.serviceUrl + 'api/payment/get_client_payment')
      .subscribe(result => {
        if (JSON.stringify(result) != '{}') {
          if (result.success) {
            this.challanList = result["replyMessage"]["paymentDataList"];
            this.tableLen = this.challanList.length;
          }
        }
      },
        error => {
      //    console.log(error['error'].errorMessage);
        });
  }

  commaSeparator(amount : any)
  {
     return this.commaSeparatorService.currencySeparatorBD(amount);
  }

}
