import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ApiService } from "../custom-services/ApiService";
import { CustomValidators } from "../custom-validators";
import { AuthRequestDTO } from "../model/dto/auth-util/auth-request-dto";

@Component({
  selector: "app-forget-pass-otp-success-generate-pass",
  templateUrl: "./forget-pass-otp-success-generate-pass.component.html",
  styleUrls: ["./forget-pass-otp-success-generate-pass.component.css"],
})
export class ForgetPassOtpSuccessGeneratePassComponent implements OnInit {
  apiService: ApiService;
  apiUrl: ApiUrl;
  reqJson:any;
  private serviceUrl: string;
  private resetPassRequest: AuthRequestDTO;
  
  otpSuccessGeneratePassForm = new FormGroup({
    password: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required,
      Validators.minLength(8),
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
      confirmpassword: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required,Validators.minLength(8)])),
  });

  constructor(private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl) {
      this.apiService = apiService;
      this.apiUrl = apiUrl;
    }

    ngOnInit(): void {
      this.apiUrl.getUrl().subscribe(res => {
        this.serviceUrl = res['eReturnPortal'].url;
      });
    }
  

  onSubmit() {

    let password = this.otpSuccessGeneratePassForm.value.password;
    let confirmpassword = this.otpSuccessGeneratePassForm.value.confirmpassword;

    if(!password.match(confirmpassword))
    {

      this.toastr.error('Password mismatch!','',{
        timeOut: 1000,
      });

    }
    else{

      this.resetPassRequest = new AuthRequestDTO();
      this.resetPassRequest.phone = localStorage.getItem('userMobileNo');
      this.resetPassRequest.newPass = this.otpSuccessGeneratePassForm.value.password;
      this.resetPassRequest.retypedNewPass = this.otpSuccessGeneratePassForm.value.confirmpassword;
      this.resetPassRequest.feature = "FORGOT_PASSWORD";
      this.resetPassRequest.userType = "TAXPAYER";

      this.apiService.post(this.serviceUrl + 'api/auth/change-pass', this.resetPassRequest)
        .subscribe(result => {

          this.toastr.success(result.message, '',{
            timeOut: 1000,
          });

          this.router.navigate(["/auth/sign-in"]);

        },
          error => {

            this.toastr.error(error['error'].errorMessage,'',{
              timeOut: 1000,
            });

        });
    }

  }

}
