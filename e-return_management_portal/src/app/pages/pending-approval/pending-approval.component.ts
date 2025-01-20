import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.scss']
})
export class PendingApprovalComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getAllPendingApprovalList: any;
  data : any;
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
    this.PendingApprovalList();
  }

  PendingApprovalList() {
    //http://103.92.84.210:8084/api/returns/approval-request-list/2021-2022
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/pending-list')
      .subscribe(result => {
        this.getAllPendingApprovalList = result.replyMessage;
        this.data = this.getAllPendingApprovalList;
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
      this.getAllPendingApprovalList = this.data;
    } else {
      this.getAllPendingApprovalList = this.data;
      this.getAllPendingApprovalList = this.getAllPendingApprovalList.filter((x) =>
        x.tinNo.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
  }

}
