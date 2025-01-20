import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { CommonService } from '../custom-services/common.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  captchaImg: any;
  captchaInput: string;

  signupForm = new FormGroup({
    name: new FormControl("", Validators.required),
    tin: new FormControl(""),
    address: new FormControl("", Validators.required),
    contactPersonName: new FormControl("", Validators.required),
    contactPersonMobile: new FormControl("", Validators.required),
    contactPersonEmail: new FormControl("", Validators.required),
    contactPersonDesignation: new FormControl("", Validators.required),
    captcha: new FormControl("", Validators.required),
  });
  constructor(
    private fb: FormBuilder,
    private CommonService: CommonService,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private sanitizer: DomSanitizer,
    ) 
  {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnAuth'].url;
    });
    this.reloadCaptcha();
  }

  reloadCaptcha(){
    this.captchaInput = this.CommonService.captchaGenerator();
  }

  onSubmit(){
    this.router.navigate(["/auth/signup-success"]);
  }

}
