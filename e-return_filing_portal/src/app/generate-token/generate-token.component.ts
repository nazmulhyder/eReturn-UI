import { HttpClient } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ApiService } from "../custom-services/ApiService";
import { AuthRequestDTO } from "../model/dto/auth-util/auth-request-dto";
import { AuthUtilService } from "../service/auth-util/auth.util.service";

@Component({
  selector: "app-generate-token",
  templateUrl: "./generate-token.component.html",
  styleUrls: ["./generate-token.component.css"],
})
export class GenerateTokenComponent implements OnInit {

  public nonNidHolderform = new FormGroup({
    passportNumber: new FormControl('',Validators.required),
    mobileNumber : new FormControl('',Validators.required)
  });

 private tokenRequest: AuthRequestDTO;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private authUtilService: AuthUtilService) {

      this.apiService = apiService;
      this.apiUrl = apiUrl;

    }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

  }

  sendToken(){

    this.tokenRequest = new AuthRequestDTO();
    this.tokenRequest.passportNumber = localStorage.getItem('passportNumber');
    this.tokenRequest.phone = localStorage.getItem('mobile');
    this.tokenRequest.feature = "PASSPORT_VALIDATION";
    this.tokenRequest.userType = "TAXPAYER";

    let redirectPath = "/auth/no-nid-holder-submission";
    
    this.authUtilService.sendOtpAndRedirect(this.tokenRequest, redirectPath);

  }

}
