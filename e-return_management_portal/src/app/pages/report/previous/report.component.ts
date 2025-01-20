import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  reportForm: FormGroup;

  reportGetData: any;
  data: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) {
    this.reportForm = fb.group({
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    localStorage.removeItem('isPrintClick');
    this.getReportData();
    this.spinner.stop();
  }

  getReportData() {
    this.reportGetData = [
      {
        "assessmentYear": '2021-2022',
        "tin": "196890847278",
        "referenceNo": '2112169899',
        "assesseeName": "Md. Khademul Islam Chowdhury",
        "submissionDate": "16-08-2021",
        "totalIncome":"9,58,500",
        "taxExemptedIncome":"2,68,600",
        "grossTaxbeforeTaxRebate":"73,775",
        "taxRebate":"9,000",
        "netTaxafterTaxRebate":"64,775",
        "minimumTax":"5,000",
        "surcharge":"0",
        "sourceTax":"27,000",
        "advanceIncomeTax":"10,500",
        "regularTax":"0",
        "paymentWithReturn":"1,15,34,358"
      },
      {
        "assessmentYear": '2021-2022',
        "tin": '654345424977',
        "referenceNo": '2112169834',
        "assesseeName": 'Md. Sazidur Rahman',
        "submissionDate": "09-08-2021",
        "totalIncome":"5,00,000",
        "taxExemptedIncome":"0",
        "grossTaxbeforeTaxRebate":"15,000",
        "taxRebate":"0",
        "netTaxafterTaxRebate":"15,000",
        "minimumTax":"5,000",
        "surcharge":"0",
        "sourceTax":"12,730",
        "advanceIncomeTax":"0",
        "regularTax":"0",
        "paymentWithReturn":"1,71,800"
      },
      {
        "assessmentYear": '2021-2022',
        "tin": '234678378252',
        "referenceNo": '2112169764',
        "assesseeName": 'Saurav Saha',
        "submissionDate": "19-08-2021",
        "totalIncome":"11,33,176",
        "taxExemptedIncome":"2,06,111",
        "grossTaxbeforeTaxRebate":"97,275",
        "taxRebate":"0",
        "netTaxafterTaxRebate":"97,275",
        "minimumTax":"5,117",
        "surcharge":"0",
        "sourceTax":"19,907",
        "advanceIncomeTax":"12,896",
        "regularTax":"0",
        "paymentWithReturn":"1,30,078"
      },
    ]
    this.data = this.reportGetData;
  }

  search(text: string) {
    if (!text) {
      this.reportGetData = this.data;
    } else {
      this.reportGetData = this.data;
      this.reportGetData = this.reportGetData.filter((x) =>
        x.tin.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
  }

}
