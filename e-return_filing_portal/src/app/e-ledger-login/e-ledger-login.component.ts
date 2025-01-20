import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';

@Component({
  selector: 'app-e-ledger-login',
  templateUrl: './e-ledger-login.component.html',
  styleUrls: ['./e-ledger-login.component.css']
})
export class ELedgerLoginComponent implements OnInit {

  userEtin: any;
  userName: any;
  token: any;
  isLoggedIn: any;

  stopListening: Function;
  apiService: ApiService;
  eReturnPortalBaseUrl: string;
  eLedgerPortalBaseUrl: string;
  apiUrl: ApiUrl;
  eReturnServiceUrl : any;


  requestSessionID : any;
  refresh_token:any;
  constructor(private renderer: Renderer2,
    private jwtHelper: JwtHelperService,
    apiService: ApiService,
    private activeRoutes: ActivatedRoute,
    apiUrl: ApiUrl,
    private router: Router,
    private eReturnSpinner: NgxUiLoaderService,) {
    // this.stopListening =
    //   renderer.listen('window', 'message', this.handleMessage.bind(this));
      this.apiService = apiService;
      this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.eReturnPortalBaseUrl = res['eReturnPortalUrl'].url;
      this.eLedgerPortalBaseUrl = res['eLedgerPortalUrl'].url;
      this.eReturnServiceUrl = res['eReturnPortal'].url;
    });
    this.isLoggedIn = 'not logged in';
    localStorage.removeItem('token');
    localStorage.setItem('isLogged', this.isLoggedIn);

    this.eReturnSpinner.start();
    this.activeRoutes.queryParams.subscribe(params => {
      this.requestSessionID = (params['session_id']);
      this.getNewTokenForFiling();
    });
  }

  getNewTokenForFiling()
  {
    this.apiService.get(this.eReturnServiceUrl + 'api/redirect/'+this.requestSessionID)
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
    if (message.origin !== this.eLedgerPortalBaseUrl) return;

    this.token = message.data;
    if (this.token != null) {
      localStorage.setItem('token', this.token);
      let tokenInfo = this.jwtHelper.decodeToken(this.token)['claims'];
      this.userEtin = tokenInfo['userIdentity'];
      localStorage.setItem('tin', this.userEtin);
      this.userName = tokenInfo['userFullName'];
      localStorage.setItem('name', this.userName);

      this.isLoggedIn = 'logged in';
      localStorage.setItem('isLogged', this.isLoggedIn);
      
    }
    else{
      window.location.href = this.eReturnPortalBaseUrl + '/#/landing-page';
    }    
  }

  // ngOnDestroy() {
  //   this.stopListening();
  // }

  checkToken(){
    localStorage.setItem('refresh_token', this.refresh_token);
    localStorage.setItem('token', this.token);
    let tokenInfo = this.jwtHelper.decodeToken(this.token)['claims'];
    this.userEtin = tokenInfo['userIdentity'];
    localStorage.setItem('tin', this.userEtin);
    this.userName = tokenInfo['userFullName'];
    localStorage.setItem('name', this.userName);

    this.isLoggedIn = 'logged in';
    localStorage.setItem('isLogged', this.isLoggedIn);

    this.router.navigate(["/user-panel/tax-and-payment"]);
  }

}
