import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { AuthService } from './service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit {
  token: any;
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private authService: AuthService,
    private toastr: ToastrService,
    private jwtHelper: JwtHelperService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      else {
        this.token = this.authService.getToken();
        //#region token expiration checking
        if (this.token) {
          if (this.jwtHelper.isTokenExpired(this.token)) {
            // token expired 
            if (window.location.href != window.location.origin + '/#/auth/sign-in') {
              this.toastr.error("Your session has expired! Please sign in again.", '', {
                timeOut: 3500,
              });
              this.router.navigate(["/auth/sign-in"]);
            }
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
        this.token = this.authService.getToken();
        if (this.token == undefined) {
          this.router.navigate(["/auth/sign-in"]);
        }
      }
    });
    
  }
}
