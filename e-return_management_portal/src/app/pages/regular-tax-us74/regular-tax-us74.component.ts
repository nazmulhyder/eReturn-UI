import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-regular-tax-us74',
  templateUrl: './regular-tax-us74.component.html',
  styleUrls: ['./regular-tax-us74.component.scss']
})
export class RegularTaxUs74Component implements OnInit {

  regularTaxus74ListForm: FormGroup;

  regularTaxus74GetData: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.regularTaxus74ListForm = fb.group({
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.getRegularTaxus74Data();
    this.spinner.stop();
  }

  getRegularTaxus74Data() {
    this.regularTaxus74GetData = [
      {
        "tinNo":'245678137898',
        "type": 'CHALLAN',
        "challanNo": '456672773',
        "chequeNo": 'N/A',
        "poNo": 'N/A',
        "date": '08-09-2021',
        "amount":'2,000',
        "paymentMode":'CASH',
        "bank":'AB Bank Limited'
      },
      {
        "tinNo":'245678138943',
        "type": 'PAY_ORDER',
        "challanNo": '859241235',
        "chequeNo": 'N/A',
        "poNo": '56378321',
        "date": '07-07-2021',
        "amount":'4,255',
        "paymentMode":'CASH',
        "bank":'Agrani Bank Limited'
      },
      {
        "tinNo":'245678132726',
        "type": 'CHEQUE',
        "challanNo": '306704297',
        "chequeNo": '2577154552',
        "poNo": 'N/A',
        "date": '08-09-2021',
        "amount":'6,641',
        "paymentMode":'CASH',
        "bank":'BRAC Bank Limited'
      }
    ]
  }

  regularTaxus74Confirmation(i) {
    this.regularTaxus74GetData.splice(i, 1);
    this.toastr.success('Verified!', '', {
      timeOut: 2000,
    });
  }

}
