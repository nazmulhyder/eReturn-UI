import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiUrl } from "../custom-services/api-url/api-url";
import { ApiService } from "../custom-services/ApiService";
import { AuthUtilService } from "../service/auth-util/auth.util.service";
import { TemplateRef } from "@angular/core";
import { CommonUtilService } from "../service/utils/common-utils";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  signinSuccessFlag: boolean = false;
  failedAlert: boolean = false;
  userEtin: any;
  userName: any;
  token: any;
  refreshToken: any;
  isLoggedIn: any;

  data: any;
  apiService: ApiService;
  private serviceUrl: string;
  private eReturnAuthUrl: string;
  apiUrl: ApiUrl;
  captchaImg: any;
  captchaInput: string;
  signinForm = new FormGroup({
    etin: new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    password: new FormControl("", Validators.required),
    captcha: new FormControl("", Validators.required)
  });

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  isTaxpayerAttemptFirstLogin: boolean = false;

  // for profile data
  taxpayerName: any;
  taxpayerEmail: any;
  taxpayerProfileImg: any;
  taxpayerPresentAddress: any;
  taxpayerPermanentAddress: any;
  taxpayerTIN: any;
  taxpayerFatherName: any;
  taxpayerMotherName: any;
  taxpayerDOB: any;
  taxpayerPhone: any;
  taxpayerZone: any;
  taxpayerCircle: any;
  taxpayerSpouse: any;
  taxpayerencodedImgUrl: any;
  userTin: any;
  isEmailEditDone: boolean = true;
  isAddressEditDone: boolean = true;
  isSpouseNameEditDone: boolean = true;
  isSpouseTinEditDone: boolean = true;

  //newly added 
  isCaptchaValidationOpen: boolean;

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private sanitizer: DomSanitizer, private authUtilService: AuthUtilService,
    private jwtHelper: JwtHelperService,
    private modalService: BsModalService,) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
      this.eReturnAuthUrl = res['eReturnAuth'].url;
      this.isCaptchaValidationOpen = res['checkIsCaptchaValidationOpen'].isOpen;
    });

    this.isLoggedIn = 'not logged in';
    // localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.setItem('isLogged', this.isLoggedIn);
    this.reloadCaptcha();
  }

  onSubmit(userProfilePopup): void {
    if (this.isCaptchaValidationOpen == true) {
      if (this.signinForm.value.captcha !== this.captchaInput) {

        this.toastr.error("Invalid Captcha", '', {
          timeOut: 3000,
        });

        this.reloadCaptcha();

        return;

      }
    }

    // debugger;

    this.data = {
      "username": this.signinForm.value.etin,
      "password": this.signinForm.value.password,
      "grantType": "password",
      "refreshToken": "",
      "rememberMe": true,
    }

    this.spinner.start();
    this.apiService.post(this.eReturnAuthUrl + 'api/authenticate/taxpayer', this.data)
      .subscribe(result => {
        // console.log('result Data:', result);
        if (result.success = true) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          this.userEtin = this.signinForm.value.etin;
          localStorage.setItem('tin', this.userEtin);

          this.token = result.replyMessage['body']['id_token'];
          this.refreshToken = result.replyMessage['body']['refresh_token'];
          localStorage.setItem('token', this.token);
          localStorage.setItem('refreshToken', this.refreshToken);

          let tokenInfo = this.jwtHelper.decodeToken(this.token)['claims'];
          // console.log(tokenInfo);
          this.userName = tokenInfo['userFullName'];
          localStorage.setItem('name', this.userName);

          this.isLoggedIn = 'logged in';
          localStorage.setItem('isLogged', this.isLoggedIn);
          this.router.navigate(["/user-panel/home"]);
          // this.checkUserUpdateProfileStatus(userProfilePopup);
        }
      },
        error => {
          this.signinForm.controls.captcha.setValue('');
          this.reloadCaptcha();
          this.spinner.stop();
          // this.showError();
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          })
        });

    this.spinner.stop();

  }

  reloadCaptcha() {
    this.captchaInput = this.authUtilService.captchaGenerator();
  }

  /*reloadCaptcha() {

    this.signinForm.controls.captcha.setValue('');

    this.authUtilService.captchaGenerator('LOGIN').subscribe(result => {

      this.captchaImg = this.authUtilService.decodeCaptcha(result.captcha);

    },
      error => {

        this.toastr.error(error['error'].errorMessage, 'Error', {
          timeOut: 1000
        });

      });

  }*/

  showError() {
    this.toastr.error('Something went wrong. Please try again later.');
  }

  closeAlert() {
    this.failedAlert = false;
  }

  changeProfileDetails(userProfilePopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(userProfilePopup, { class: 'modal-lg' });
  }

  unchange_UserProfile() {
    this.modalRef.hide();
  }

  getData() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/full')
      .subscribe(result => {
        if (result != null) {
          this.setTaxpayerProfile(result);
        }
      },
        error => {
          //   console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

  setTaxpayerProfile(profile: any) {
    this.taxpayerName = profile.assesName ? profile.assesName : '';
    this.taxpayerencodedImgUrl = profile.image ? profile.image : null;
    this.taxpayerProfileImg = profile.image == null || profile.image == "" ? "No image found"
      : this.imgTransform(profile.image);
    this.taxpayerEmail = profile.email ? profile.email : '';
    this.taxpayerPresentAddress = profile.presentAddress ? profile.presentAddress : '';
    this.taxpayerPermanentAddress = profile.permanentAddress ? profile.permanentAddress : '';
    this.taxpayerTIN = profile.tin ? profile.tin : '';
    this.taxpayerFatherName = profile.fathersName ? profile.fathersName : '';
    this.taxpayerMotherName = profile.mothersName ? profile.mothersName : '';
    this.taxpayerDOB = profile.dob ? profile.dob : '';
    this.taxpayerPhone = profile.phone ? profile.phone : '';
    this.taxpayerZone = profile.zone ? profile.zone : '';
    this.taxpayerCircle = profile.circle ? profile.circle : '';
    this.taxpayerSpouse = profile.spouseName ? profile.spouseName : '';

    // this.presentAddSubstring1 = this.taxpayerPresentAddress.substring(0,25);
    // this.presentAddSubstring2 = this.taxpayerPresentAddress.substring(26,50);
  }
  imgTransform(profileImg: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(profileImg) as any).changingThisBreaksApplicationSecurity;
  }

  validateEmail(email) {
    // debugger;
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }


  editEmail() {
    this.isEmailEditDone = false;
  }
  saveEmail() {
    this.isEmailEditDone = true;
  }
  editAddress() {
    this.isAddressEditDone = false;
  }
  saveAddress() {
    this.isAddressEditDone = true;
  }
  editSpouseName() {
    this.isSpouseNameEditDone = false;
  }
  saveSpouseName() {
    this.isSpouseNameEditDone = true;
  }
  editSpouseTin() {
    this.isSpouseTinEditDone = false;
  }
  saveSpouseTin() {
    this.isSpouseTinEditDone = true;
  }
  // GET /api/auth/taxpayer-profile/{userIdentification}/profile-update-status
  checkUserUpdateProfileStatus(userProfilePopup) {
    this.apiService.get(this.serviceUrl + 'api/auth/taxpayer-profile/profile-update-status')
      .subscribe(result => {
        if (!result.replyMessage) {
          this.getData();
          this.changeProfileDetails(userProfilePopup);
        }
        else {
          this.router.navigate(["/user-panel/home"]);
        }
      },
        error => {
          //   console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

  onNextPage() {
    // console.log('email',this.userEmail.nativeElement.value);
    let editableEmail = (<HTMLInputElement>document.getElementById('email')).value;
    let editablePermanentAdd = (<HTMLInputElement>document.getElementById('address')).value;
    let editableSpouseName = (<HTMLInputElement>document.getElementById('spouse')).value;
    let editableSpouseTin = (<HTMLInputElement>document.getElementById('sp_tin')).value;

    if (!this.validateEmail(editableEmail)) {
      this.toastr.warning('Please provide a valid email!');
      return;
    }

    let requestBody =
    {
      "assesName": this.taxpayerName,
      "circle": this.taxpayerCircle,
      "dob": this.taxpayerDOB,
      "email": editableEmail,
      "fathersName": this.taxpayerFatherName,
      "image": this.taxpayerencodedImgUrl,
      "mothersName": this.taxpayerMotherName,
      "permanentAddress": this.taxpayerPermanentAddress,
      "phone": this.taxpayerPhone,
      "presentAddress": editablePermanentAdd,
      "spouseName": editableSpouseName,
      "spouseTin": editableSpouseTin,
      "tin": this.taxpayerTIN,
      "zone": this.taxpayerZone,
    }
    //  console.log(requestBody);
    this.apiService.put(this.serviceUrl + 'api/user-panel/taxpayer-profile/first-login', requestBody)
      .subscribe(result => {
        //    console.log(result);
        if (result == 'S')
          this.toastr.success('Profile updated Successfully');
        this.router.navigate(["/user-panel/home"]);
        this.modalRef.hide();

      },
        error => {
          //       console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

}
