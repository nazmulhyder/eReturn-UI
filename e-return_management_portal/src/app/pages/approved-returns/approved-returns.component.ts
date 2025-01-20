import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-approved-returns',
  templateUrl: './approved-returns.component.html',
  styleUrls: ['./approved-returns.component.scss']
})
export class ApprovedReturnsComponent implements OnInit {
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getAllApprovedReturnList: any;
  data: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.ApprovedReturnList();
  }
  ApprovedReturnList() {
    //http://103.92.84.210:8084/api/returns/approved-list/2021-2022
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/approved-list')
      .subscribe(result => {
        this.getAllApprovedReturnList = result.replyMessage;
        this.data = this.getAllApprovedReturnList;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }
  returnView(tin: any) {
    this.router.navigateByUrl("/pages/return/" + tin);
  }

  printReturnView(tin: any, isPrintClick: any) {
    // debugger;
    let obj = {
      "assessmentYr": "2021-2022",
      "tin": tin
    }
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/returns/print/'+tin, obj)
    .subscribe(result => {
       console.log(result);
       if(result.success)
       {
         localStorage.setItem('isPrintClick', isPrintClick);
         this.router.navigateByUrl("/pages/return/" + tin);
       }
    },
      error => {
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage, '', {
          timeOut: 3000,
        });
      });

  
  }
  search(text: string) {
    if (!text) {
      this.getAllApprovedReturnList = this.data;
    } else {
      this.getAllApprovedReturnList = this.data;
      this.getAllApprovedReturnList = this.getAllApprovedReturnList.filter((x) =>
        x.tinNo.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
  }
}
