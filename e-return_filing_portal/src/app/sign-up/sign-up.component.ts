import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { User } from "../model/user.model";
import { Router } from "@angular/router";
import { ApiService } from "../custom-services/ApiService";
import { environment } from "../../environments/environment.prod";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient } from '@angular/common/http';
import { AuthRequestDTO } from "../model/dto/auth-util/auth-request-dto";
import { AuthUtilService } from "../service/auth-util/auth.util.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonUtilService } from "../service/utils/common-utils";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {

  isSignUP: any;
  private signUpRequest: AuthRequestDTO;

  otp: any;

  public userEtin: any;
  public userMobileNumber: any;

  public signupForm: FormGroup;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  captchaImg: any;
  captchaInput: string;

  //newly added 
  isCaptchaValidationOpen: boolean;

  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private authUtilService: AuthUtilService, private spinner: NgxUiLoaderService) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
    this.signupForm = fb.group({
      etin: new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
      mobilenumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
      captcha: new FormControl("", Validators.required),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target != document.getElementById("mobilenumber")) {
      this.signupForm.get("mobilenumber").setValue(CommonUtilService.removeZero(this.signupForm.value.mobilenumber));
    }
  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
      this.isCaptchaValidationOpen = res['checkIsCaptchaValidationOpen'].isOpen;
    });

    this.isSignUP = 'not signed up';
    localStorage.setItem('isSignUP', this.isSignUP);
    this.reloadCaptcha();

  }

  // removeZero()
  // {
  //   let phoneNoLen  = this.signupForm.value.mobilenumber.length;
  //   // let cutstring  = this.signupForm.value.mobilenumber.substring(1, phoneNoLen);
  //   if(this.signupForm.value.mobilenumber.startsWith('0'))
  //   {
  //     this.signupForm.patchValue(
  //       {
  //          mobilenumber : this.signupForm.value.mobilenumber.substring(1, phoneNoLen),
  //       });
  //   }
  // }

  onSubmit(): void {

    if (this.isCaptchaValidationOpen == true) {
      if (this.signupForm.value.captcha !== this.captchaInput) {

        this.toastr.error("Invalid Captcha", '', {
          timeOut: 3000,
        });

        this.reloadCaptcha();

        return;

      }
    }

    this.signUpRequest = new AuthRequestDTO();
    this.signUpRequest.userIdentification = this.signupForm.value.etin;
    this.signUpRequest.phone = CommonUtilService.addZero(this.signupForm.value.mobilenumber);
    this.signUpRequest.feature = "REGISTRATION";
    this.signUpRequest.userType = "TAXPAYER";
    this.signUpRequest.captcha = this.signupForm.value.captcha;

    this.spinner.start();

    this.apiService.post(this.serviceUrl + 'api/auth/sign-up', this.signUpRequest)
      .subscribe(result => {

        if (result.message == "P") {
          this.router.navigate(["/auth/proceed-to-form"]);
          return;
        }

        localStorage.setItem('otpResponse', result);

        this.userMobileNumber = CommonUtilService.addZero(this.signupForm.value.mobilenumber);

        localStorage.setItem('etin', this.signupForm.value.etin);
        localStorage.setItem('mobile', this.userMobileNumber);

        this.isSignUP = 'signed up';
        localStorage.setItem('isSignUP', this.isSignUP);

        this.spinner.stop();

        this.toastr.success(result.message, '', {
          timeOut: 1000,
        });

        this.router.navigate(["/auth/generate-pass"]);

      },
        error => {

          this.spinner.stop();

          this.signupForm.controls.captcha.setValue('');
          this.reloadCaptcha();

          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 6000,
          });

        });

  }

  reloadCaptcha() {
    this.captchaInput = this.authUtilService.captchaGenerator();
  }

  /*reloadCaptcha()
  {

    this.signupForm.controls.captcha.setValue('');

    this.authUtilService.captchaGenerator('REGISTRATION').subscribe(result => {
    
        this.captchaImg = this.authUtilService.decodeCaptcha(result.captcha);

      },
      error => {

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });
  
        });
    
  }*/

  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

}
