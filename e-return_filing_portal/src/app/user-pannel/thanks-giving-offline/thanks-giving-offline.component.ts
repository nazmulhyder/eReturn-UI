import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-thanks-giving-offline',
  templateUrl: './thanks-giving-offline.component.html',
  styleUrls: ['./thanks-giving-offline.component.css']
})
export class ThanksGivingOfflineComponent implements OnInit {

  name: any;
  referenceNo: any;
  year: number;
  userTin: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  isShow: boolean = true;
  isSubmittedOffline: boolean = false;
  isSubmittedOnline: boolean = false;

  constructor(private toastr: ToastrService,
    private eReturnSpinner: NgxUiLoaderService,
    apiService: ApiService,
    private router: Router,
    apiUrl: ApiUrl,) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.eReturnSpinner.start();
    this.year = new Date().getFullYear();
    this.userTin = localStorage.getItem('tin');
    // this.name = localStorage.getItem('name');
    // this.referenceNo = localStorage.getItem('randomNumber');
    this.checkSubmissionStatus();
    this.getTaxpayerBasicInfo();
    this.eReturnSpinner.stop();
  }

  checkSubmissionStatus() {
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get_submission')
      .subscribe(result => {
        if (result.replyMessage != null) {
          if ((result.replyMessage).returnSubmissionType=="ONLINE") {
            this.isSubmittedOnline = true;
          } else if((result.replyMessage).returnSubmissionType=="OFFLINE") {
            this.isSubmittedOffline = true;
          }
        }
        else {
          this.isSubmittedOffline = false;
          this.isSubmittedOnline = false;
        }
      },
        error => {
         // console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  getTaxpayerBasicInfo() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          // debugger;
          this.name = result.replyMessage.assesName;
          this.referenceNo = result.replyMessage.referenceNo;

        }
      })

  }

  onClickgotoOffline() {
    // if (this.isSubmittedOffline == true) {
    //   this.toastr.error('You already prepared your offline (paper) return.', '', {
    //     timeOut: 3000,
    //   });
    // }
    if (this.isSubmittedOnline == true) {
      this.toastr.error('You already submitted your return in online.', '', {
        timeOut: 3000,
      });
    } 
    else {
      // this.router.navigate(['/user-panel/offline-submission']);

      //newly added
      let reqData = {
        "assessmentYear": "2021-2022",
        "submissionStatus": true,
        "returnSubmissionType": "OFFLINE",
        "tinNo": this.userTin
      }
      this.apiService.post(this.serviceUrl + 'api/save_offline_submission', reqData)
        .subscribe(result => {
        //  console.log('offline-submission response:', result);
          this.router.navigate(['/user-panel/offline-submission']);
        },
          error => {
         //   console.log(error['error'].errorMessage);
            this.router.navigate(['/user-panel/offline-submission']);
          });
    }
  }

}
