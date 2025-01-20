import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';

@Component({
  selector: 'app-payment-ui',
  templateUrl: './payment-ui.component.html',
  styleUrls: ['./payment-ui.component.css']
})
export class PaymentUiComponent implements OnInit {

  PaymentForm: FormGroup;
  userTin: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private eReturnSpinner: NgxUiLoaderService,
    private httpClient: HttpClient,
    private datepipe: DatePipe,
    private commaseparator: CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.PaymentForm = new FormGroup({
      paymentType: new FormControl('Tax with Return', Validators.required),
      taxpayerOrigin: new FormControl('eFilling', Validators.required),
      paymentMethod: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      chalanNo: new FormControl('', Validators.required),
      accountCode: new FormControl('', Validators.required)
    });

    this.userTin = localStorage.getItem('tin');
    this.PaymentForm.get('amount').setValue(localStorage.getItem('amount'));
  }

  onPaymentMethod(event: any) {
    let max = 9999999999999;
    let accCode = Math.floor(Math.random() * max) + 1;

    let tt = 999999999;
    let chalanNo = Math.floor(Math.random() * tt) + 1;
    if (event.target.value === 'Bkash') {
      this.PaymentForm.get('chalanNo').setValue('B-' + chalanNo);
    }
    else if (event.target.value === 'Nagad') {
      this.PaymentForm.get('chalanNo').setValue('N-' + chalanNo);
    }
    else if (event.target.value === 'Rocket') {
      this.PaymentForm.get('chalanNo').setValue('R-' + chalanNo);
    }
    else if (event.target.value === 'Upay') {
      this.PaymentForm.get('chalanNo').setValue('U-' + chalanNo);
    }
    else {
      this.PaymentForm.get('chalanNo').setValue('S-' + chalanNo);
    }
    this.PaymentForm.get('accountCode').setValue(accCode);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57))
    if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onAmountChange(event:any){
    // console.log('value', event.target.value);
    this.PaymentForm.patchValue({
      amount: this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value,0)),
    })
    // this.PaymentForm.get('amount').setValue(this.commaseparator.currencySeparatorBD(this.PaymentForm.get('amount').value));
  }

  submitData() {

    let date = new Date();
    let yyy = moment(date, 'DD-MM-YYYY');
    let day = this.datepipe.transform(yyy, 'dd-MM-yyyy');
    let time = date.toLocaleTimeString();

    let Idd = 9999999999999999;
    let transactionIdd = Math.floor(Math.random() * Idd) + 1;

    let paymentRequestData = {
      "accountCode": this.PaymentForm.value.accountCode,
      "amount": this.PaymentForm.value.amount ? parseInt(this.commaseparator.removeComma(this.PaymentForm.value.amount,0)) : 0,
      "assessmentYear": "2021-2022",
      "chalanCopyURL": "https: //nbr.sblesheba.com/IncomeTax/Home/Voucher/" + this.PaymentForm.value.accountCode,
      "chalanNo": this.PaymentForm.value.chalanNo,
      "dateTime": day + " " + time,
      "paymentInfo": this.PaymentForm.value.paymentMethod,
      "paymentMethod": this.PaymentForm.value.paymentMethod,
      "paymentType": this.PaymentForm.value.paymentType,
      "taxpayerOrigin": this.PaymentForm.value.taxpayerOrigin,
      "tin": this.userTin,
      "transactionId": transactionIdd
    }

   // console.log('PaymentRequestData', paymentRequestData);

    this.eReturnSpinner.start();
    this.apiService.post(this.serviceUrl + 'api/payment/payment_data', paymentRequestData)
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.router.navigateByUrl("payment-success/" + this.userTin);
        }
        this.eReturnSpinner.stop();
      },
        error => {
          this.eReturnSpinner.stop();
         // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 1000,
          });
        });
  }

}
