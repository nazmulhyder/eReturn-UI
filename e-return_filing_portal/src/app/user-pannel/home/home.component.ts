import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { AuthUtilService } from '../../service/auth-util/auth.util.service';
import { CommonUtilService } from '../../service/utils/common-utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('userProfilePopup', { static: true }) userProfilePopup: TemplateRef<HTMLDivElement>;
  
  isTaxpayerAttemptFirstLogin: boolean = false;
  taxpayerProfile : any;
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

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };


  apiService: ApiService;
  private serviceUrl: string;
  private eReturnAuthUrl: string;
  apiUrl: ApiUrl;
  userEtin: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private sanitizer: DomSanitizer, 
    private authUtilService: AuthUtilService,
    private jwtHelper: JwtHelperService,
    private modalService: BsModalService,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
   }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
      this.eReturnAuthUrl = res['eReturnAuth'].url;
    });
    this.userEtin = localStorage.getItem('tin');

    this.getData();
    this.checkUserUpdateProfileStatus();
    
  }

  checkUserUpdateProfileStatus() {
    this.apiService.get(this.serviceUrl + 'api/auth/taxpayer-profile/profile-update-status')
      .subscribe(result => {
        if (!result.replyMessage) {
          this.openModal();
        }
        else {
          // this.openModal();
          this.router.navigate(["/user-panel/home"]);
        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }

  onNextPage() {
    // console.log('email',this.userEmail.nativeElement.value);
    let editableEmail = (<HTMLInputElement>document.getElementById('email')).value;
    let editablePermanentAdd = (<HTMLInputElement>document.getElementById('address')).value;
    let editableSpouseName = (<HTMLInputElement>document.getElementById('spouse')).value;
    let editableSpouseTin = (<HTMLInputElement>document.getElementById('sp_tin')).value;

    if (editableEmail !='' && !this.validateEmail(editableEmail)) {
      this.toastr.warning('Please provide a valid email!');
      return;
    }

    if(editableSpouseTin.length!=0 && editableSpouseTin.length != 12)
    {
      this.toastr.warning('Spouse TIN must be 12 digit!');
      return;
    }

    let requestBody =
    {
      "email": editableEmail,
      "presentAddress": editablePermanentAdd,
      "spouseName": editableSpouseName,
      "spouseTin": editableSpouseTin,
    }
    //console.log(requestBody);
    this.apiService.put(this.serviceUrl + 'api/user-panel/taxpayer-profile/first-login', requestBody)
      .subscribe(result => {
        //console.log(result);
        if (result == 'S')
          this.toastr.success('Profile updated Successfully');
        this.router.navigate(["/user-panel/home"]);
        this.modalRef.hide();

      },
        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }

  
  getData() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/full')
      .subscribe(result => {
        if (result != null) {
          this.setTaxpayerProfile(result);
        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }

  changeProfileDetails(userProfilePopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(userProfilePopup, { class: 'modal-lg' });
  }

  openModal() {
    this.modalRef = this.modalService.show(this.userProfilePopup,
       { class: 'modal-lg', backdrop: true, ignoreBackdropClick: true });
  }

  unchange_UserProfile() {
    this.modalRef.hide();
    this.router.navigate(["/auth/sign-in"]);
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

  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

}
