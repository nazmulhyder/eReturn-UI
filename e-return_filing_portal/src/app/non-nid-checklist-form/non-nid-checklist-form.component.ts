import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { AuthRequestDTO } from '../model/dto/auth-util/auth-request-dto';
import { AuthUtilService } from '../service/auth-util/auth.util.service';
import { CommonUtilService } from '../service/utils/common-utils';

@Component({
  selector: 'app-non-nid-checklist-form',
  templateUrl: './non-nid-checklist-form.component.html',
  styleUrls: ['./non-nid-checklist-form.component.css']
})
export class NonNidChecklistFormComponent implements OnInit {

  public nonNidHolderform = new FormGroup({
    passportNumber: new FormControl('', Validators.required),
    mobilenumber : new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)])
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if(event.target != document.getElementById("mobilenumber")){
      this.nonNidHolderform.get("mobilenumber").setValue(CommonUtilService.removeZero(this.nonNidHolderform.value.mobilenumber));
    }
  }

 private signUpRequest: AuthRequestDTO;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private spinner: NgxUiLoaderService) {

      this.apiService = apiService;
      this.apiUrl = apiUrl;

    }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

  }

  onSubmit(): void {

    this.signUpRequest = new AuthRequestDTO();
    this.signUpRequest.passportNumber = this.nonNidHolderform.value.passportNumber;
    
    this.signUpRequest.phone = CommonUtilService.addZero(this.nonNidHolderform.value.mobilenumber);
    this.signUpRequest.feature = "PASSPORT_VALIDATION";
    this.signUpRequest.userType = "TAXPAYER";

    this.spinner.start();

    this.apiService.post(this.serviceUrl + 'api/auth/passport-validation', this.signUpRequest)
    .subscribe(result => {

        localStorage.setItem('passportNumber', this.nonNidHolderform.value.passportNumber);
        localStorage.setItem('mobile', CommonUtilService.addZero(this.nonNidHolderform.value.mobilenumber));

        this.spinner.stop();

        this.toastr.success(result.message, '',{
          timeOut: 1000,
        });

        this.router.navigate(["/auth/generate-token"]);

    },
      error => {

        this.spinner.stop();
        
        this.toastr.error(error['error'].errorMessage,'',{
          timeOut: 1000,
        });
        
      });

  }

  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

}
