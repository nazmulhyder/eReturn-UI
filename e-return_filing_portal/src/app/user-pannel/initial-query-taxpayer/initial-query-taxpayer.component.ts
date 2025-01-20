import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-initial-query-taxpayer',
  templateUrl: './initial-query-taxpayer.component.html',
  styleUrls: ['./initial-query-taxpayer.component.css']
})
export class InitialQueryTaxpayerComponent implements OnInit {

  haveSrcTaxHtml = `<span class="btn-block well-sm";">Select YES if any advance tax or source tax was paid by you at source (such as TDS on salary, TDS on bank interest, AIT on car, etc.). Otherwise, select NO.</span>`;
  updateLedgerHtml = `<span class="btn-block well-sm";">Select YES if you need to update your tax payment (including source tax and advance tax).  Select NO if your payment status is already updated and you are ready for return filing.</span>`;

  basicQuestionForm = new FormGroup({
    haveSrcTax: new FormControl('0'),
    updateLedger: new FormControl('0'),
  });

  isHaveSrcTax: boolean = false;
  isUpdateLedger: boolean = false;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  isShow: boolean = true;
  eLedgerPortalBaseUrl: string;

  token: any;
  isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';
  yourIFrameUrl: any;

  constructor(private router: Router, public sanitizer: DomSanitizer, apiService: ApiService,
    apiUrl: ApiUrl, private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
      this.eLedgerPortalBaseUrl = res['eLedgerPortalUrl'].url;
    });
    this.yourIFrameUrl = this.eLedgerPortalBaseUrl + '/#/eReturn-login';
    this.userTin = localStorage.getItem('tin');
    this.checkSubmissionStatus();
  }

  checkSubmissionStatus(): Promise<void> {
    this.spinner.start();
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_submission')
        .subscribe(result => {
          if (result.replyMessage != null) {
            this.spinner.stop();
            this.toastr.error('You already submitted your return in this assessment year.', '', {
              timeOut: 2500,
            });
            this.isShow = false;
            resolve();
          }
          else {
            this.spinner.stop();
            this.isShow = true;
            resolve();
          }
        },
          error => {
            reject();
            this.spinner.stop();
          //  console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });
    });
  }

  haveSrcTax(event: any) {
    if (event.target.value === '1') {
      this.isHaveSrcTax = true;
    }
    else {
      this.isHaveSrcTax = false;
      this.basicQuestionForm.controls.updateLedger.setValue('0');
    }
  }
  updateLedger(event: any) {
    // debugger;
    if (event.target.value === '1') {
      this.isUpdateLedger = true;
    }
    else {
      this.isUpdateLedger = false;
    }
  }
  basicQueryProceed() {
    if (this.basicQuestionForm.value.haveSrcTax === '0') {
      this.router.navigate(["/user-panel/assessment"]);
    }
    else {
      if (this.basicQuestionForm.value.updateLedger === '0') {
        this.router.navigate(["/user-panel/assessment"]);
      }
      else {
        this.token = localStorage.getItem('token');
        let msg = {
          "token": this.token,
          "sourceUrl": '/user-panel/basic-query-taxpayer'
        }
        const frame = document.getElementById('ifr');
        if (this.isIFrame(frame) && frame.contentWindow) {
          frame.contentWindow.postMessage(msg, this.eLedgerPortalBaseUrl);
        }
        // window.location.href = 'http://103.92.84.210:82/#/pages/dashboard';
        window.location.href = this.eLedgerPortalBaseUrl + '/#/pages/home';
      }
    }
  }

  goToSource() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.yourIFrameUrl);
  }
}
