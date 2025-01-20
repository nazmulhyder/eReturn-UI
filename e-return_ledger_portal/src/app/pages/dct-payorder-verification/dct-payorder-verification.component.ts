import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dct-payorder-verification',
  templateUrl: './dct-payorder-verification.component.html',
  styleUrls: ['./dct-payorder-verification.component.scss']
})
export class DctPayorderVerificationComponent implements OnInit {

  payOrderListForm: FormGroup;

  payOrderGetData: any;

  payOrderVerify = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.payOrderListForm = fb.group({
    });
  }

  ngOnInit(): void {
    this.getPayOrderData();
  }

  getPayOrderData() {
    this.payOrderGetData = [
      {
        "assessmentYear": '2021-2022',
        "poNo": '1130224377',
        "challanDate": '10-06-2021',
        "amount": '1000000',
      },
      {
        "assessmentYear": '2021-2022',
        "poNo": '1130224378',
        "challanDate": '07-05-2021',
        "amount": '500000',
      },
      {
        "assessmentYear": '2021-2022',
        "poNo": '1130224379',
        "challanDate": '08-05-2021',
        "amount": '1500000',
      }
    ]
  }

  payOrderConfirmation(i) {
    this.payOrderGetData.splice(i, 1);
    this.toastr.success('Verified!', '', {
      timeOut: 2000,
    });
  }

}
