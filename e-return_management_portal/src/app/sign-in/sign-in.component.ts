import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { CommonService } from '../custom-services/common.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  reqData: any;
  apiService: ApiService;
  private serviceUrl: string;
  private eReturnAuthUrl: string;
  private eReturnManagement: string;
  apiUrl: ApiUrl;
  captchaImg: any;

  token: any;
  captchaInput: string;

  //newly added 
  isCaptchaValidationOpen: boolean;

  signinForm = new FormGroup({
    userName: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    captcha: new FormControl("", Validators.required),
  });

  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private CommonService: CommonService,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }


  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
      this.eReturnAuthUrl = res['eReturnAuth'].url;
      this.eReturnManagement = res['managementApi'].url;
      this.isCaptchaValidationOpen = res['checkIsCaptchaValidationOpen'].isOpen;
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userType');
    localStorage.removeItem('notificationNumber');
    this.reloadCaptcha();
  }


  submitData() {

    if (this.isCaptchaValidationOpen==true){
      if (this.signinForm.value.captcha !== this.captchaInput) {

        this.toastr.error("Invalid Captcha", '', {
          timeOut: 3000,
        });
  
        this.reloadCaptcha();
  
        return;
  
      }
    }

    this.reqData = {
      "username": this.signinForm.value.userName,
      "password": this.signinForm.value.password,
      "grantType": "password",
      "refreshToken": "",
      "rememberMe": true,
    }

    this.apiService.post(environment.management_base_url + '/ereturnauth/v2/api/authenticate/management', this.reqData)
      .subscribe(result => {
        console.log('api response', result);
        if (result.success = true) {
          this.token = result.replyMessage['body']['id_token'];
          localStorage.setItem('token', this.token);
          let tokenInfo = this.jwtHelper.decodeToken(this.token)['claims'];
          console.log(tokenInfo);
          console.log(tokenInfo.userRoles[0])
          if (tokenInfo.userRoles[0] == 'CIRCLE_INSPECTOR' || tokenInfo.userRoles[0] == 'CIRCLE_OFFICER' || tokenInfo.userRoles[0] == 'SYSTEM_MANAGER'
            || tokenInfo.userRoles[0] == 'RANGE_OFFICER' || tokenInfo.userRoles[0] == 'ZONAL_HEAD' || tokenInfo.userRoles[0] == 'SS_ICT_SUPER_ADMIN'
            || tokenInfo.userRoles[0] == 'DCT_HQ_ZONE_LTU_ADMIN' || tokenInfo.userRoles[0] == 'DCT_HQ_CIC_INSPECTION_ADMIN' || tokenInfo.userRoles[0] == 'SS_ICT_ADMIN') {
            localStorage.setItem('userRoles', tokenInfo.userRoles[0]);
            localStorage.setItem('userName', tokenInfo.userFullName);
            localStorage.setItem('userType', tokenInfo.userType);
            this.router.navigate(["/pages/home"]);
          }
          else {
            this.toastr.error("Invalid User Name", '', {
              timeOut: 2500,
            });
          }
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  reloadCaptcha() {
    this.captchaInput = this.CommonService.captchaGenerator();
  }

}
