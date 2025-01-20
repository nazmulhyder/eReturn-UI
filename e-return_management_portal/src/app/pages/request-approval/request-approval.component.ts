import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-request-approval',
  templateUrl: './request-approval.component.html',
  styleUrls: ['./request-approval.component.scss']
})
export class RequestApprovalComponent implements OnInit {

  returnListForm: FormGroup;
  returnGetData: any;
  returnVerify = [];
  data: any;
  isRequestBtnDisable: boolean = false;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getAllRequestApproval: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
  ) {
    this.returnListForm = fb.group({
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    localStorage.removeItem('isPrintClick');
    this.getRequestForApprovalList();
  }

  getRequestForApprovalList() {
    //http://103.92.84.210:8084/api/returns/list/2021-2022
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/list')
      .subscribe(result => {
        this.getAllRequestApproval = result.replyMessage;
        this.data = this.getAllRequestApproval;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  downloadReturn(tin: any) {
    console.log(tin);
  }

  returnView(tin: any) {
    this.router.navigateByUrl("/pages/return/" + tin);
  }

  printReturnView(tin: any, isPrintClick: any) {
    localStorage.setItem('isPrintClick', isPrintClick);
    this.router.navigateByUrl("/pages/return/" + tin);
  }

  search(text: string) {
    if (!text) {
      this.getAllRequestApproval = this.data;
    } else {
      this.getAllRequestApproval = this.data;
      this.getAllRequestApproval = this.getAllRequestApproval.filter((x) =>
        x.tinNo.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
  }

  requestSent(k, tinNo) {
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/returns/approval-request/' + tinNo, '')
      .subscribe(result => {
        console.log(result);
        if (result.success) {
          this.toastr.success('Request sent successfully.', '', {
            timeOut: 2500,
          });
          this.getAllRequestApproval.splice(k, 1);
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

}
