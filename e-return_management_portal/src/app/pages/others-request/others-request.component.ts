import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-others-request',
  templateUrl: './others-request.component.html',
  styleUrls: ['./others-request.component.scss']
})
export class OthersRequestComponent implements OnInit {

  othersListForm: FormGroup;

  othersGetData: any;
  othersVerify = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) {
    this.othersListForm = fb.group({
    });
  }

  ngOnInit(): void {
    this.getOthersData();
  }

  getOthersData() {
    this.spinner.start();
    this.othersGetData = [
      {
        "assessmentYear": '2021-2022',
        "tinNo":"347821564321",
        "section": "Salary [ Section-50]",
        "challanNo": '1130222351',
        "challanDate": '10-06-2021',
        "referenceNo":'546456456',
        "amount": '1000000',
      },
      {
        "assessmentYear": '2021-2022',
        "tinNo":"347821569754",
        "section": "Salary [ Section-50]",
        "challanNo": '1130224378',
        "challanDate": '07-05-2021',
        "referenceNo":'326456467',
        "amount": '500000',
      },
      {
        "assessmentYear": '2021-2022',
        "tinNo":"347821567542",
        "section": "Salary [ Section-50]",
        "challanNo": '1130224379',
        "challanDate": '08-05-2021',
        "referenceNo":'6432556616',
        "amount": '1500000',
      }
    ]
    this.spinner.stop();
  }

  othersConfirmation(i) {
    this.othersGetData.splice(i, 1);
    this.toastr.success('Verified!', '', {
      timeOut: 2000,
    });
  }

}
