import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';

@Component({
  selector: 'app-e-return-login',
  templateUrl: './e-return-login.component.html',
  styleUrls: ['./e-return-login.component.scss']
})
export class EReturnLoginComponent implements OnInit {

  token: any;
  message: any;
  tokenInfo: any;
  winOrTin: any;
  messageData :any;

  stopListening: Function;

  apiService: ApiService;
  eReturnPortalBaseUrl: string;
  eLedgerPortalBaseUrl: string;
  eLedgerServiceUrl:String;
  apiUrl: ApiUrl;
  requestSessionID:any;
  refresh_token:any;

  //newly added
  // /token:any;

  constructor(private renderer: Renderer2,
    private jwtHelper: JwtHelperService,
    private activeRoutes: ActivatedRoute,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private router: Router,
    private eReturnSpinner: NgxUiLoaderService) {
    // this.stopListening =
    //   renderer.listen('window', 'message', this.handleMessage.bind(this));
      this.apiService = apiService;
      this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.eReturnPortalBaseUrl = res['eReturnPortalUrl'].url;
      this.eLedgerPortalBaseUrl = res['eLedgerPortalUrl'].url;
      this.eLedgerServiceUrl = res['eLedger'].url;
      
    });
    this.eReturnSpinner.start();
    this.activeRoutes.queryParams.subscribe(params => {
      this.requestSessionID = (params['session_id']);
      this.getNewTokenForLedger();
    });
   
  }

 getNewTokenForLedger()
  {
    this.apiService.get(this.eLedgerServiceUrl + 'api/redirect/'+this.requestSessionID)
      .subscribe(result => {
        if (result.success) {
          this.token = result.replyMessage.token_id;
          this.refresh_token = result.replyMessage.refresh_token;
          this.checkToken();
        }
        this.eReturnSpinner.stop();
      },
        error => {
          this.eReturnSpinner.stop();
          console.log(error['error'].errorMessage);
        });
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;

    // Only trust messages from the below origin.
    if (message.origin !== this.eReturnPortalBaseUrl) return;
    this.messageData = message.data;
    // console.log('data', this.messageData);
    this.token = this.messageData['token'];
    let sourceUrl= this.messageData['sourceUrl'];
    if (this.token != null) {
      localStorage.setItem('access_token', this.messageData['token']);
      localStorage.removeItem('sourceUrl');
      localStorage.setItem('sourceUrl',sourceUrl);
      this.tokenInfo = this.jwtHelper.decodeToken(this.messageData['token'])['claims'];
      this.winOrTin = this.tokenInfo['userIdentity'];
      // console.log('winOrTin',this.winOrTin);
      localStorage.setItem('winOrTinNo', this.winOrTin);

      // window.open('http://localhost:82/#/pages/home');

      window.location.href = 'http://103.92.84.210:82/#/eReturn-login';
      
    }
    else{
      window.location.href = this.eLedgerPortalBaseUrl + '/#/auth/sign-in';
    }    
  }

  checkToken(){
    localStorage.setItem('refresh_token', this.refresh_token);
    localStorage.setItem('access_token', this.token);
    this.tokenInfo = this.jwtHelper.decodeToken(this.token)['claims'];
    this.winOrTin = this.tokenInfo['userIdentity'];
    // console.log('winOrTin',this.winOrTin);
    localStorage.setItem('winOrTinNo', this.winOrTin);
    this.router.navigate(["/pages/home"]);
  }

  // ngOnDestroy() {
  //   this.stopListening();
  // }

}
