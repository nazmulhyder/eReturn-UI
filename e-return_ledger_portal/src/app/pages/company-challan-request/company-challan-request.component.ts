import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-challan-request',
  templateUrl: './company-challan-request.component.html',
  styleUrls: ['./company-challan-request.component.scss']
})
export class CompanyChallanRequestComponent implements OnInit {

  challanListForm: FormGroup

  companyChallanGetData: any;
  companyChallanVerify = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.challanListForm = fb.group({
    });
  }

  ngOnInit(): void {
    this.getCompanyChallanData();
  }

  getCompanyChallanData() {
    this.companyChallanGetData = [
      {
        "assessmentYear": '2021-2022',
        "codeNo": '1-1141-0001-0111',
        "challanNo": '1130224377',
        "challanDate": '10-06-2021',
        "amount": '1000000',
      },
      {
        "assessmentYear": '2021-2022',
        "codeNo": '1-1141-0001-0111',
        "challanNo": '1130224378',
        "challanDate": '07-05-2021',
        "amount": '500000',
      },
      {
        "assessmentYear": '2021-2022',
        "codeNo": '1-1141-0001-0111',
        "challanNo": '1130224379',
        "challanDate": '08-05-2021',
        "amount": '1500000',
      }
    ]
    // this.companyChallanGetData.forEach((element,index) => {
    //   if (index===0) {
    //     this.companyChallanVerify[index]=true;
    //   }
    //   else{
    //     this.companyChallanVerify[index]=false;
    //   }
    // });
  }

  companyChallanConfirmation(i) {
    this.companyChallanGetData.splice(i, 1);
    this.toastr.success('Verified!', '', {
      timeOut: 2000,
    });
    //  this.companyChallanVerify[i]=true;
  }

  goToDetailsPage(event:any){
    this.router.navigateByUrl("/pages/company-challan-details");
  }

}
