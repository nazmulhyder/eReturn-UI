import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CountdownComponent, CountdownEvent } from "ngx-countdown";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ApiService } from "../custom-services/ApiService";
import { CustomValidators } from '../custom-validators';
import { AuthRequestDTO } from "../model/dto/auth-util/auth-request-dto";
import { AuthUtilService } from "../service/auth-util/auth.util.service";

@Component({
  selector: "app-signup-generate-password",
  templateUrl: "./signup-generate-password.component.html",
  styleUrls: ["./signup-generate-password.component.css"],
})
export class SignupGeneratePasswordComponent implements OnInit {
  @ViewChild("countdown") counter: CountdownComponent;
  otpResponseData: any;
  private generatePassRequest: AuthRequestDTO;
  public userEtin: any;
  public userMobileNumber: any;
  private otpRequest: AuthRequestDTO;

  otp: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  checkIsSignedUp: any;
  isGeneratedPass: any;
  submitted: boolean = false;
  isOTPSuccessful: boolean = false;
  generatepassForm = new FormGroup({
    userid: new FormControl(""),
    otp: new FormControl("", [Validators.required,Validators.minLength(6),Validators.maxLength(6)]),
    password: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required,
    Validators.minLength(8),
    // password: new FormControl(Validators.compose([Validators.required,
    //   Validators.minLength(8),
    // // check whether the entered password has a number
    CustomValidators.patternValidator(/\d/, {
      hasNumber: true
    }),
    // // check whether the entered password has upper case letter
    CustomValidators.patternValidator(/[A-Z]/, {
      hasCapitalCase: true
    }),
    // // check whether the entered password has a lower case letter
    CustomValidators.patternValidator(/[a-z]/, {
      hasSmallCase: true
    }),
    // // check whether the entered password has a special character
    CustomValidators.patternValidator(
      /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      {
        hasSpecialCharacters: true
      }
    )])),
    confirmpassword: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    // password: new FormControl("", Validators.required),
    // confirmpassword: new FormControl("", Validators.required),
  });

  isResendOTP: boolean = true;
  isCompleteOTPMaxLimit: boolean = false;
  otpTimeLeft : number = 0;

  constructor(private router: Router,
    apiService: ApiService,
    private toastr: ToastrService,
    apiUrl: ApiUrl, private authUtilService: AuthUtilService) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.checkIsSignedUp = localStorage.getItem('isSignUP');
    if (this.checkIsSignedUp === 'not signed up') {
      this.router.navigate(["/auth/sign-up"]);
    }
    else {
      this.userEtin = localStorage.getItem('etin');
      this.userMobileNumber = localStorage.getItem('mobile');
      this.isGeneratedPass = 'no';
      localStorage.setItem('isGeneratedPass', this.isGeneratedPass);
      this.otp = localStorage.getItem('otp');
      this.otpResponseData = localStorage.getItem('otpResponse');
      if (this.otpResponseData == 'true') {
        this.toastr.success('OTP send successfully','',{
          timeOut: 1000,
        });
      }
      if (this.otpResponseData == 'false') {
        this.toastr.warning('OTP sending failed. Please, resend your OTP','',{
          timeOut: 1000,
        });
      }
      // console.log('otp', this.otp);
    }
    
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  resendOTP(){

    // this.otpRequest = new AuthRequestDTO();
    // this.otpRequest.phone = localStorage.getItem('mobile');
    // this.otpRequest.feature = "REGISTRATION";
    // this.otpRequest.userType = "TAXPAYER";
    
    // this.authUtilService.sendOtp(this.otpRequest);
    if(this.otpTimeLeft <= 0){
      this.isResendOTP = true;
      this.resetOTP();
      this.otpRequest = new AuthRequestDTO();
      this.otpRequest.phone = localStorage.getItem('userMobileNo');
      this.otpRequest.feature = "FORGOT_PASSWORD"
      this.otpRequest.userType = "TAXPAYER";
  
      this.apiService.post(this.serviceUrl + 'api/auth/send-otp', this.otpRequest)
        .subscribe(result => {
          this.toastr.success(result.message, '', {
            timeOut: 1000
          });
  
        },
          error => {
            this.toastr.error(error['error'].errorMessage, 'Error', {
              timeOut: 1000
            });
            this.isCompleteOTPMaxLimit = true;
            setTimeout(() => {
              this.isCompleteOTPMaxLimit = false;
              this.isResendOTP = false;
            }
              , 60000);
  
          });
        }
  }

  handleEvent(e: CountdownEvent) {
    this.otpTimeLeft = e.left;
    if(e.left === 0){
      this.isResendOTP = false;
    }
  }

  resetOTP()
  {
    this.generatepassForm.patchValue(
      {
        otp: '',
      });
   }

  onSubmit(): void {

    this.submitted = true;
    const { password, confirmpassword } = this.generatepassForm.value;

    if (this.generatepassForm.invalid) {
      return;
    }

    if (password == confirmpassword) {

      this.generatePassRequest = new AuthRequestDTO();
      this.generatePassRequest.userIdentification = this.userEtin;
      this.generatePassRequest.phone = this.userMobileNumber;
      this.generatePassRequest.newPass = this.generatepassForm.value.password;
      this.generatePassRequest.retypedNewPass = this.generatepassForm.value.confirmpassword;
      this.generatePassRequest.feature = "REGISTRATION";
      this.generatePassRequest.userType = "TAXPAYER";
      this.generatePassRequest.otp = this.generatepassForm.value.otp;

      this.apiService.post(this.serviceUrl + 'api/auth/generate-pass', this.generatePassRequest)
        .subscribe(result => {

          this.isGeneratedPass='yes';
          localStorage.setItem('isGeneratedPass', this.isGeneratedPass);

          this.toastr.success(result.message, '',{
            timeOut: 1000,
          });

          this.router.navigate(["/auth/signup-success"]);

        },
          error => {

            this.toastr.error(error['error'].errorMessage, 'Error',{
              timeOut: 1000,
            });

          });
    }

  }

  onPasswordMatch(): boolean {
    const { password, confirmpassword } = this.generatepassForm.value;
    if (password == confirmpassword) {
      return true;
    }
  }

  onOtpMatch(): boolean {
    // const { otp } = this.generatepassForm.value;
    // if (otp == this.otp) {
    //   document.getElementById("otp").classList.add('is-valid');
    //   this.generatepassForm.controls['password'].enable();
    //   this.generatepassForm.controls['confirmpassword'].enable();
    //   this.isOTPSuccessful = true;
    //   return true;
    // }
    // else {
    //   document.getElementById("otp").classList.remove('is-valid');
    //   this.generatepassForm.controls['password'].disable();
    //   this.generatepassForm.controls['confirmpassword'].disable();
    //   return false;
    // }
    return true;
  }

}
