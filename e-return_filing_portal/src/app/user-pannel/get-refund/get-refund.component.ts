import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';

@Component({
  selector: 'app-get-refund',
  templateUrl: './get-refund.component.html',
  styleUrls: ['./get-refund.component.css']
})
export class GetRefundComponent implements OnInit {

  refundForm: FormGroup;
  userTin: any;
  refundAmt:any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private eReturnSpinner: NgxUiLoaderService,
    private commaseparator: CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }


  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.refundForm = new FormGroup({
      bankName: new FormControl('0', Validators.required),
      accountName: new FormControl('', Validators.required),
      accountNo: new FormControl('', Validators.required),
      // refundAmt: new FormControl('',Validators.required),
    });

    this.userTin = localStorage.getItem('tin');
    this.refundAmt=localStorage.getItem('RefundableAmount');
    this.refundForm.patchValue({
      refundAmt:this.refundAmt,
    })
  }

  submitData(){
    this.toastr.success('Data Submitted Successfully', '', {
      timeOut: 1000,
    });
    this.router.navigate(["/user-panel/tax-and-payment"]);
  }

  onBackPage(){
    this.router.navigate(["/user-panel/tax-and-payment"]);
  }

}
