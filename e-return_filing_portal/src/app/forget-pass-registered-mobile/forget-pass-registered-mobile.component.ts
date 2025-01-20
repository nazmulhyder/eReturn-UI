import { Component, HostListener, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ApiService } from "../custom-services/ApiService";
import { AuthRequestDTO } from "../model/dto/auth-util/auth-request-dto";
import { AuthUtilService } from "../service/auth-util/auth.util.service";
import { CommonUtilService } from "../service/utils/common-utils";

@Component({
  selector: "app-forget-pass-registered-mobile",
  templateUrl: "./forget-pass-registered-mobile.component.html",
  styleUrls: ["./forget-pass-registered-mobile.component.css"],
})
export class ForgetPassRegisteredMobileComponent implements OnInit {

  forgetPassValidMobileForm = new FormGroup({
    mobilenumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if(event.target != document.getElementById("mobilenumber")){
      this.forgetPassValidMobileForm.get("mobilenumber").setValue(CommonUtilService.removeZero(this.forgetPassValidMobileForm.value.mobilenumber));
    }
  }

  apiService: ApiService;
  apiUrl: ApiUrl;
  reqJson:any;
  private otpRequest: AuthRequestDTO;
  private serviceUrl: string;
  userMobileNo:any;
  constructor(private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl, private authUtilService: AuthUtilService
    ) {
      this.apiService = apiService;
      this.apiUrl = apiUrl;
    }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
  }

  onSubmit() {

    let mobileNo: string = CommonUtilService.addZero(this.forgetPassValidMobileForm.value.mobilenumber);

    localStorage.setItem('userMobileNo', mobileNo);

    this.otpRequest = new AuthRequestDTO();
    this.otpRequest.phone = localStorage.getItem('userMobileNo');
    this.otpRequest.feature = "FORGOT_PASSWORD"
    this.otpRequest.userType = "TAXPAYER";

    let redirectPath: string = "/auth/forget-pass-mobile-otp";

    this.authUtilService.sendOtpAndRedirect(this.otpRequest, redirectPath);
    
  }

  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

}
