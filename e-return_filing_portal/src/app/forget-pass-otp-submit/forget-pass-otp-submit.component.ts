import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CountdownComponent, CountdownEvent } from "ngx-countdown";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ApiService } from "../custom-services/ApiService";
import { AuthRequestDTO } from "../model/dto/auth-util/auth-request-dto";
import { AuthUtilService } from "../service/auth-util/auth.util.service";
import { CommonUtilService } from "../service/utils/common-utils";

@Component({
  selector: "app-forget-pass-otp-submit",
  templateUrl: "./forget-pass-otp-submit.component.html",
  styleUrls: ["./forget-pass-otp-submit.component.css"],
})
export class ForgetPassOtpSubmitComponent implements OnInit {
  @ViewChild("countdown") counter: CountdownComponent;
  @ViewChild('digitOne', {static: false}) inputEl: ElementRef;

  apiService: ApiService;
  apiUrl: ApiUrl;
  reqJson:any;

  isResendOTP: boolean = true;
  isCompleteOTPMaxLimit: boolean = false;
  otpTimeLeft : number = 0;

  private otpRequest: AuthRequestDTO;
  private otpVerifyRequest: AuthRequestDTO;
  private serviceUrl: string;

  otpForm = new FormGroup({

    otpInp1: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
    otpInp2: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
    otpInp3: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
    otpInp4: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
    otpInp5: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
    otpInp6: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ])

  });

  constructor(private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl, private authUtilService: AuthUtilService) {
      this.apiService = apiService;
      this.apiUrl = apiUrl;
    }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
  }


  onSubmit() {
      this.otpVerifyRequest = new AuthRequestDTO();
      this.otpVerifyRequest.phone = localStorage.getItem('userMobileNo');
      this.otpVerifyRequest.feature = "FORGOT_PASSWORD";
      this.otpVerifyRequest.userType = "TAXPAYER";

      let userProvidedOtp: any = this.otpForm.value.otpInp1 + '' + this.otpForm.value.otpInp2 + '' + this.otpForm.value.otpInp3 + '' +
      this.otpForm.value.otpInp4 + '' + this.otpForm.value.otpInp5 + '' + this.otpForm.value.otpInp6;

      if(userProvidedOtp.length != 6){

        this.toastr.error("Please provide 6 digit OTP!",'',{
          timeOut: 1000,
        });
        return;
      }

      try{
        userProvidedOtp = Number(userProvidedOtp);
      }
      catch(exception){
        this.toastr.error("OTP can only contain numbers!",'',{
          timeOut: 1000,
        });
      }

      this.otpVerifyRequest.otp = userProvidedOtp;

    this.apiService.post(this.serviceUrl + 'api/auth/verify-otp', this.otpVerifyRequest)
      .subscribe(result => {

        this.toastr.success(result.message, '',{
          timeOut: 1000,
        });
        
        this.router.navigate(["/auth/forget-pass-otp-success-generate-pass"]);

      },
      error => {

        this.toastr.error(error['error'].errorMessage,'',{
          timeOut: 1000,
        });

    });

  }

  resendOTP() {
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
      // this.toastr.warning('otp ends!');
    }
  }

  onDigitInput(event){

    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57))
    // {
    //   return;
    // }

    let element;
    if (event.code !== 'Backspace')
         element = event.srcElement.nextElementSibling;
     if (event.code === 'Backspace')
         element = event.srcElement.previousElementSibling;
     if(element == null)
         return;
     else
         element.focus();    

 }

 numberOnly(event): boolean {
  return CommonUtilService.numberOnly(event);
}

 resetOTP(){

  this.otpForm.get("otpInp1").setValue("");
  this.otpForm.get("otpInp2").setValue("");
  this.otpForm.get("otpInp3").setValue("");
  this.otpForm.get("otpInp4").setValue("");
  this.otpForm.get("otpInp5").setValue("");
  this.otpForm.get("otpInp6").setValue("");
  this.inputEl.nativeElement.focus();

 }

}
