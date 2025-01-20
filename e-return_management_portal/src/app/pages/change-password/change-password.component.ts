import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CustomValidators } from '../../custom-validators';
import { AuthRequestDTO } from '../../model/dto/auth-request-dto';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  apiService: ApiService;
  apiUrl: ApiUrl;
  private changePassRequest: AuthRequestDTO;
  private serviceUrl: string;
  userTin: any;

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl("", Validators.required),
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
      this.serviceUrl = res['eReturn'].url;
      this.userTin = localStorage.getItem('tin');
    });
  }

  onSubmit() {

    let password = this.changePasswordForm.value.password;
    let confirmpassword = this.changePasswordForm.value.confirmpassword;

    if (password !== confirmpassword) {
      this.toastr.warning("New Password and Confirm New Password didn't match!");
      return;
    }

    this.changePassRequest = new AuthRequestDTO();
    this.changePassRequest.userIdentification = this.userTin;
    this.changePassRequest.oldPass = this.changePasswordForm.value.oldPassword;
    this.changePassRequest.newPass = this.changePasswordForm.value.password;
    this.changePassRequest.retypedNewPass = this.changePasswordForm.value.confirmpassword;
    this.changePassRequest.feature = "CHANGE_PASSWORD";
    this.changePassRequest.userType = "MANAGEMENT";

    this.apiService.post(this.serviceUrl + 'api/auth/change-pass', this.changePassRequest)
    .subscribe(result => {

      this.toastr.success(result.message, '', {
        timeOut: 1000,
      });

      this.router.navigate(["/pages/home"]);

    },
    error => {

      this.toastr.error(error['error'].errorMessage, '', {
        timeOut: 3000,
      });

    });

  }

}
