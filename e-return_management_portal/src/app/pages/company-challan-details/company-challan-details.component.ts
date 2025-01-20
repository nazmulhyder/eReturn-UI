import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-company-challan-details',
  templateUrl: './company-challan-details.component.html',
  styleUrls: ['./company-challan-details.component.scss']
})
export class CompanyChallanDetailsComponent implements OnInit {

  challanDetailsForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private httpClient: HttpClient,) {
    this.challanDetailsForm = fb.group({
      assessmentYear:['', Validators.required],
      win: ['', Validators.required],
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      section: ['', Validators.required],
      codeNo: ['', Validators.required],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      challanUploadFile: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.challanDetailsForm.patchValue({
      assessmentYear: '2021-2022',
      win: 519919122756,
      challanNo: 1045678932134,
      name: 'Synesis IT Ltd.',
      section: 'Salary [ Section-50]',
      amount: 1000000,
      challanDate:'10-05-2021',
      codeNo:'1-1141-0001-0111',
    })
    this.spinner.stop();
  }

  onBackPage(){
    this.router.navigateByUrl("/pages/company-challan-request");
  }

}
