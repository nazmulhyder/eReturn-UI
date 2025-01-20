import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.scss']
})
export class ApproveRequestComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getAllApprovedRequestList: any;

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
    //http://103.92.84.210:8084/api/returns/approval-request-list/2021-2022
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/approval-request-list')
      .subscribe(result => {
        this.getAllApprovedRequestList = result.replyMessage;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  approveRequest(k, tinNo) {
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/returns/approve-request/' + tinNo, '')
      .subscribe(result => {
        console.log(result);
        if (result.success) {
          this.toastr.success('Approved successfully.', '', {
            timeOut: 2500,
          });
          this.getAllApprovedRequestList.splice(k, 1);
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
