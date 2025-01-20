import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { CommonService } from '../custom-services/common.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  //newly added 
  eReturnPortalBaseUrl:any;

  winOrTinNo: any;
  token: any;

  reqData: any;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  captchaImg: any;

  captchaInput: string;

  signinForm = new FormGroup({
    winOrTin: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    // winOrTin: new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    password: new FormControl("", Validators.required),
    captcha: new FormControl("", Validators.required),
  });

  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    private CommonService: CommonService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private jwtHelper: JwtHelperService,) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }


  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnAuth'].url;
      this.eReturnPortalBaseUrl = res['eReturnPortalUrl'].url;
    });

    // localStorage.removeItem('access_token');
    // localStorage.removeItem('winOrTinNo');
    // localStorage.removeItem('tokenInfo');
    // localStorage.removeItem('sourceUrl');

    // this.reloadCaptcha();

    //newly added
    // window.location.href = this.eReturnPortalBaseUrl + '/#/auth/sign-in';

    //added for company challan
    this.reloadCaptcha();
    localStorage.removeItem('userType');
  }


  submitData() {

    localStorage.setItem('winOrTinNo', this.signinForm.value.winOrTin);
    this.winOrTinNo = localStorage.getItem('winOrTinNo');

    // if (this.signinForm.value.captcha !== this.captchaInput) {

    //   this.toastr.error("Invalid Captcha", '', {
    //     timeOut: 3000,
    //   });

    //   this.reloadCaptcha();
    //   return;

    // }

     // static company login
    // if (this.winOrTinNo === '5199191227' && this.signinForm.value.password === 'eLedger@123#') {
    //   localStorage.setItem('userType', 'COMPANY');
    //   this.router.navigate(["/pages/home"]);
    // }

    // authenticate company login
    if(this.winOrTinNo.length == 10)
    {
      this.reqData = {
        "grantType": "password",
        "password": this.signinForm.value.password,
        "refreshToken": "",
        "rememberMe": true,
        "username": this.signinForm.value.winOrTin
      }

      this.apiService.post(this.serviceUrl + 'api/authenticate/company', this.reqData)
      .subscribe(result => {
        if (result.success = true) {
          localStorage.setItem('winOrTinNo', this.signinForm.value.winOrTin);
          localStorage.setItem('access_token', result.replyMessage['body']['id_token']);

          var token = result.replyMessage['body']['id_token'];
          let tokenInfo = this.jwtHelper.decodeToken(result.replyMessage['token'])['claims'];
          localStorage.setItem('companyName', tokenInfo['userFullName']);

          this.router.navigate(["/pages/home"]);
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
    }

    // authenticate taxpayer login
    if(this.winOrTinNo.length == 12)
    {
      this.reqData = {
        "grantType": "password",
        "password": this.signinForm.value.password,
        "refreshToken": "",
        "rememberMe": true,
        "username": this.signinForm.value.winOrTin
      }
  
      //#region  POST API Section
  
      this.apiService.post(this.serviceUrl + 'api/authenticate/taxpayer', this.reqData)
        .subscribe(result => {
          console.log('result Data:', result);
          if (result.success = true) {
            localStorage.setItem('winOrTinNo', this.signinForm.value.winOrTin);
            localStorage.setItem('access_token', result.replyMessage['body']['id_token'])
  
            var token = result.replyMessage['body']['id_token'];
            console.log('token:', token);
  
            this.router.navigate(["/pages/home"]);
          }
        },
          error => {
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }

    // this.reqData = {
    //   "grantType": "password",
    //   "password": this.signinForm.value.password,
    //   "refreshToken": "",
    //   "rememberMe": true,
    //   "username": this.signinForm.value.winOrTin
    // }

    // //#region  POST API Section

    // this.apiService.post(this.serviceUrl + 'api/authenticate/taxpayer', this.reqData)
    //   .subscribe(result => {
    //     console.log('result Data:', result);
    //     if (result.success = true) {
    //       localStorage.setItem('winOrTinNo', this.signinForm.value.winOrTin);
    //       localStorage.setItem('access_token', result.replyMessage['body']['id_token'])

    //       var token = result.replyMessage['body']['id_token'];
    //       console.log('token:', token);

    //       this.router.navigate(["/pages/home"]);
    //     }
    //   },
    //     error => {
    //       console.log(error['error'].errorMessage);
    //       this.toastr.error(error['error'].errorMessage, '', {
    //         timeOut: 3000,
    //       });
    //     });

    //#endregion

    //#region  Static Sign-in Section

    // localStorage.setItem('winOrTinNo', this.signinForm.value.winOrTin);
    // this.winOrTinNo = localStorage.getItem('winOrTinNo');

    // if (this.winOrTinNo === '2346783782' && this.signinForm.value.password === 'eLedger@123#') {
    //   localStorage.setItem('userType', 'TAXPAYER');
    //   this.router.navigate(["/pages/home"]);
    // }
    // else if (this.winOrTinNo === '5199191227' && this.signinForm.value.password === 'eLedger@123#') {
    //   localStorage.setItem('userType', 'COMPANY');
    //   this.router.navigate(["/pages/home"]);
    // }
    // else if (this.winOrTinNo === '3476141293' && this.signinForm.value.password === 'eLedger@123#') {
    //   localStorage.setItem('userType', 'DCT_LVL1');
    //   this.router.navigate(["/pages/home"]);
    // }
    // else if (this.winOrTinNo === '5841451956' && this.signinForm.value.password === 'eLedger@123#') {
    //   localStorage.setItem('userType', 'DCT_LVL2');
    //   this.router.navigate(["/pages/home"]);
    // }
    // else {
    //   this.toastr.error("WIN/TIN or Password is not correct.", '', {
    //     timeOut: 3000,
    //   });
    // }

    //#endregion

  }

  reloadCaptcha() {
    this.captchaInput = this.CommonService.captchaGenerator();
  }

}
