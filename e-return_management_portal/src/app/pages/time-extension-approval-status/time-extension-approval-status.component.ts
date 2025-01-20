import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-time-extension-approval-status',
  templateUrl: './time-extension-approval-status.component.html',
  styleUrls: ['./time-extension-approval-status.component.scss']
})
export class TimeExtensionApprovalStatusComponent implements OnInit {
  timeExtensionGetData: any;
  private serviceUrl: string;

  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.getTimeExtensionData();
    this.spinner.stop();
  }

  getTimeExtensionData() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/time-extension/dct/approved-rejected-list')
      .subscribe(result => {
        // console.log('response', result);
        this.timeExtensionGetData = "";
        this.timeExtensionGetData = result.replyMessage;
      },
        error => {
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

}
