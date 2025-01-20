import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from './custom-services/api-url/api-url';
import { ApiService } from './custom-services/ApiService';
import { AuthService } from './service/auth.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  private eReturnAuthUrl: string;
  constructor(private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private apiUrl: ApiUrl,
    private jwtHelper: JwtHelperService,
    private spinner: NgxUiLoaderService) { }

  ngOnInit() {
    this.apiUrl.getUrl().subscribe(res => {
      this.eReturnAuthUrl = res['eReturnAuth'].url;
    });
    this.spinner.start();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      else {
        //#region token expiration checking
        // debugger;
        let token = this.authService.getToken();
        if (token) {
          if (this.jwtHelper.isTokenExpired(token)) {
            // token expired 
            // if (window.location.href != window.location.origin + '/#/auth/sign-in') {
            //   this.toastr.error("Your session has expired! Please sign in again.", '', {
            //     timeOut: 3500,
            //   });
            //   this.router.navigate(["/auth/sign-in"]);
            // }

            //#region Implement Refresh Token

            let reqData = {
              "grantType": "refresh_token",
              "refreshToken": localStorage.getItem('refreshToken'),
              "rememberMe": true
            }
            this.apiService.post(this.eReturnAuthUrl + 'api/authenticate/taxpayer', reqData)
              .subscribe(result => {
                // console.log('result Data:', result);
                if (result.success = true) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');

                  let token = result.replyMessage['body']['id_token'];
                  let refreshToken = result.replyMessage['body']['refresh_token'];
                  localStorage.setItem('token', token);
                  localStorage.setItem('refreshToken', refreshToken);

                  let tokenInfo = this.jwtHelper.decodeToken(token)['claims'];
                  // console.log(tokenInfo);
                  let userName = tokenInfo['userFullName'];
                  localStorage.setItem('name', userName);

                  let isLoggedIn = 'logged in';
                  localStorage.setItem('isLogged', isLoggedIn);
                }
              },
                error => {
                  // console.log(error['error'].errorMessage);
                  this.toastr.error(error['error'].errorMessage, '', {
                    timeOut: 3000,
                  })
                });
                
            //#endregion
          }
          else {
            // token valid
          }
        }
        //#endregion
      }
      window.scrollTo(0, 0);
    });

    //logout user from all tabs
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        let token = this.authService.getToken();
        if (token == undefined) {
          this.router.navigate(["/auth/sign-in"]);
        }
      }
    });

    this.spinner.stop();
  }
}
