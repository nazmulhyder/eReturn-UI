import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { AuthRequestDTO } from '../model/dto/auth-request-dto';
import { AuthUtilService } from '../service/auth.util.service';
import { CommonUtilService } from '../service/common-utils.service';

@Component({
  selector: 'app-forgot-pass-mobile',
  templateUrl: './forgot-pass-mobile.component.html',
  styleUrls: ['./forgot-pass-mobile.component.scss']
})
export class ForgotPassMobileComponent implements OnInit {
  forgetPassValidMobileForm = new FormGroup({
    // mobilenumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    userId:new FormControl('', Validators.required)
  });

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   if(event.target != document.getElementById("mobilenumber")){
  //     this.forgetPassValidMobileForm.get("mobilenumber").setValue(CommonUtilService.removeZero(this.forgetPassValidMobileForm.value.mobilenumber));
  //   }
  // }

  apiService: ApiService;
  apiUrl: ApiUrl;
  reqJson:any;
  private otpRequest: AuthRequestDTO;
  private serviceUrl: string;
  userMobileNo:any;
  constructor(private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl, 
    private authUtilService: AuthUtilService
    ) {
      this.apiService = apiService;
      this.apiUrl = apiUrl;
    }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
    });
  }

  onSubmit() {

    // let mobileNo: string = CommonUtilService.addZero(this.forgetPassValidMobileForm.value.mobilenumber);
    localStorage.setItem('userId', this.forgetPassValidMobileForm.value.userId);
    this.otpRequest = new AuthRequestDTO();
    this.otpRequest.userIdentification = localStorage.getItem('userId');
    this.otpRequest.feature = "RESET_PASSWORD_MANAGEMENT"
    this.otpRequest.userType = "MANAGEMENT";

    let redirectPath: string = "/auth/otp-submit";

    // this.router.navigate(['/auth/otp-submit']);
    this.authUtilService.sendOtpAndRedirect(this.otpRequest, redirectPath);
    
  }

  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

}
