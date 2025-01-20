import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';

@Component({
  selector: 'app-time-extension-print',
  templateUrl: './time-extension-print.component.html',
  styleUrls: ['./time-extension-print.component.css']
})
export class TimeExtensionPrintComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  isShow: boolean = true;
  userTin: any;
  constructor(
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
   }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.checkSubmissionStatus();
  }

  checkSubmissionStatus(): Promise<void> {
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_submission')
        .subscribe(result => {
          if (result.replyMessage != null) {
            if ((result.replyMessage).returnSubmissionType == "ONLINE") {
              this.isShow = false;
              this.toastr.error('You already submitted your return in online.', '', {
                timeOut: 3000,
              });
            } else if ((result.replyMessage).returnSubmissionType == "OFFLINE") {
              this.isShow = true;
            }
            resolve();
          }
          else {
            this.isShow = true;
            resolve();
          }
        },
          error => {
            reject();
            //console.log(error['error'].errorMessage);
          });
    });
  }


}
