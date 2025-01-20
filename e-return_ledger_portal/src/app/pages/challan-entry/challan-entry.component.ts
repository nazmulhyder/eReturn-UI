import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-challan-entry',
  templateUrl: './challan-entry.component.html',
  styleUrls: ['./challan-entry.component.scss']
})
export class ChallanEntryComponent implements OnInit {

  public challanEntryForm: FormGroup;
  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  winOrTinNo: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService) {
    this.challanEntryForm = fb.group({
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      // assessmentYear: ['2021-2022', Validators.required],
      section: ['0', Validators.required],
      depositedin: ['CASH', Validators.required],
      amount: ['', Validators.required],
      bank: ['0', Validators.required],
      branch: ['0', Validators.required],
      codeNo: ['', Validators.required],
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
  }

  reset() {
    this.challanEntryForm.reset();
    this.challanEntryForm.patchValue(
      {
        section: '0',
        // assessmentYear:'2021-2022',
        bank: '0',
        branch: '0',
      }
    )
  }

  submittedData(): Promise<void> {

    return new Promise((resolve, reject) => {
      
      let challanDate: any;
      challanDate = this.challanEntryForm.value.challanDate ? moment(this.challanEntryForm.value.challanDate, 'DD-MM-YYYY') : '';
      let requestPostData = {
        "challanDate": challanDate ? this.datepipe.transform(challanDate, 'dd-MM-yyyy') : '',
        "challanNo": this.challanEntryForm.value.challanNo,
        "section": this.challanEntryForm.value.section,
        "depositType": this.challanEntryForm.value.depositedin,
        "bank": this.challanEntryForm.value.bank,
        "branch": this.challanEntryForm.value.branch,
        "code": this.challanEntryForm.value.codeNo,
        "totalChallanAmount": this.challanEntryForm.value.amount
      }

      this.spinner.start();
      this.apiService.post(this.serviceUrl + 'api/company/challan', requestPostData)
        .subscribe(result => {

          this.toastr.success(result.replyMessage, '', {
            timeOut: 1000,
          });

          this.router.navigateByUrl("/pages/challan-list");

          this.reset();
          resolve();

        },
          error => {
            reject();
            this.spinner.stop();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });

  }

}
