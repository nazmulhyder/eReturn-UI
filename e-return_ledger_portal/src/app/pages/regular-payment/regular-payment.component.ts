import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommonUtilService } from '../../custom-services/utils/common.utils';

@Component({
  selector: 'app-regular-payment',
  templateUrl: './regular-payment.component.html',
  styleUrls: ['./regular-payment.component.scss']
})
export class RegularPaymentComponent implements OnInit {

  winOrTinNo: any;
  bankgetData: any;

  allRegularPayments = [];
  paymentRequestJson: any;
  totalRegularPayment: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  constructor(apiService: ApiService,
    apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    public commonUtilService: CommonUtilService) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
    });
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
    this.totalRegularPayment = 0;

    this.paymentList();
  }

  paymentList() {

    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/payment/get_client_payment')
      .subscribe(result => {
        // debugger;
        if (JSON.stringify(result) != '{}') {
          // console.log('payment status result', result);
          let paymentData = result["replyMessage"]["paymentDataList"];
          // console.log('paymentData', paymentData);
          if (result.success) {
            // this.isPayNowBtnDisabled=true;

            let PayAmount = 0; let dateOfPayment: any;
            paymentData.forEach(element => {
              PayAmount = PayAmount + element.amount;
              dateOfPayment = moment(element.dateTime, 'DD-MM-YYYY');
              let oRegularPayment = {
                "dateOfPayment": this.datepipe.transform(dateOfPayment, 'dd-MM-yyyy'),
                "paymentRef": element.transactionId,
                "amount": element.amount
              }
              this.allRegularPayments.push(oRegularPayment);
            });
            this.totalRegularPayment = PayAmount;
          }
          this.spinner.stop();
        }
      },
        error => {
          this.spinner.stop();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

}
