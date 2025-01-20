import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-tax-payer-thanks-giving',
  templateUrl: './tax-payer-thanks-giving.component.html',
  styleUrls: ['./tax-payer-thanks-giving.component.css']
})
export class TaxPayerThanksGivingComponent implements OnInit {

  name: any;
  referenceNo: any;
  year: number;
  userTin:any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  isShow: boolean = false;

  constructor(private toastr: ToastrService,
    private eReturnSpinner: NgxUiLoaderService,
    apiService: ApiService,
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
    this.getTaxpayerBasicInfo();
    this.checkSubmissionStatus();
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
          if ((result.replyMessage).returnSubmissionType == "ONLINE") {
            this.isShow = true;
          } else if ((result.replyMessage).returnSubmissionType == "OFFLINE") {
            this.isShow = false;
            this.toastr.error('Submit your return in online first.', '', {
              timeOut: 3000,
            });
          }
        }
        else {
          this.isShow = false;
          this.toastr.error('Submit your return in online first.', '', {
            timeOut: 3000,
          });
        }
      },
        error => {
        //  console.log(error['error'].errorMessage);
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

}
