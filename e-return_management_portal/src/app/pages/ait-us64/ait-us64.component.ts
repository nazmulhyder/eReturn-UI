import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-ait-us64',
  templateUrl: './ait-us64.component.html',
  styleUrls: ['./ait-us64.component.scss']
})
export class AitUs64Component implements OnInit {

  aitus64ListForm: FormGroup;

  aitus64GetData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) {
    this.aitus64ListForm = fb.group({
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.getAitus64Data();
    this.spinner.stop();
  }

  getAitus64Data() {
    this.aitus64GetData = [
      {
        "tinNo": '245678132452',
        "type": 'CHALLAN',
        "challanNo": '456672773',
        "chequeNo": 'N/A',
        "poNo": 'N/A',
        "date": '08-09-2021',
        "amount": '2,000',
        "paymentMode": 'CASH',
        "bank": 'AB Bank Limited'
      },
      {
        "tinNo": '245678132562',
        "type": 'PAY_ORDER',
        "challanNo": '859241235',
        "chequeNo": 'N/A',
        "poNo": '56378321',
        "date": '07-07-2021',
        "amount": '4,255',
        "paymentMode": 'CASH',
        "bank": 'Agrani Bank Limited'
      },
      {
        "tinNo": '245678132875',
        "type": 'CHEQUE',
        "challanNo": '306704297',
        "chequeNo": '2577154552',
        "poNo": 'N/A',
        "date": '08-09-2021',
        "amount": '6,641',
        "paymentMode": 'CASH',
        "bank": 'BRAC Bank Limited'
      }
    ]
  }

  aitus64Confirmation(i) {
    this.aitus64GetData.splice(i, 1);
    this.toastr.success('Verified!', '', {
      timeOut: 2000,
    });
  }

}
