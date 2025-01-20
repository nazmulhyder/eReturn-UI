import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-make-claim-message',
  templateUrl: './make-claim-message.component.html',
  styleUrls: ['./make-claim-message.component.scss']
})
export class MakeClaimMessageComponent implements OnInit {

  serviceUrl: string;
  eReturnUrl: string;
  eReturnPortalBaseUrl: string;
  token: any;

  isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';
  yourIFrameUrl: any;

  constructor(
    private apiService: ApiService,
    private apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
      this.eReturnUrl = res['eReturn'].url;
      this.eReturnPortalBaseUrl = res['eReturnPortalUrl'].url;
    });
    this.yourIFrameUrl = this.eReturnPortalBaseUrl + '/#/eLedger-login';

    //temporary added
    this.spinner.start();
    this.spinner.stop();
  }

  goToEReturnOffline() {
    const frame = document.getElementById('ifr');
    if (this.isIFrame(frame) && frame.contentWindow) {
      frame.contentWindow.postMessage(this.token, this.eReturnPortalBaseUrl);
    }
    let sourceUrl = localStorage.getItem('sourceUrl') ? localStorage.getItem('sourceUrl') : null;

    if (sourceUrl != null) {
      if (sourceUrl === '/user-panel/basic-query-taxpayer') {
        window.location.href = this.eReturnPortalBaseUrl + '/#/user-panel/assessment';
      } else {
        let destUrl = this.eReturnPortalBaseUrl + '/#' + sourceUrl;
        window.location.href = destUrl;
      }

    } else {
      window.location.href = this.eReturnPortalBaseUrl + '/#/user-panel/home';
    }
  }

  goToSource() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.yourIFrameUrl);
  }

}
