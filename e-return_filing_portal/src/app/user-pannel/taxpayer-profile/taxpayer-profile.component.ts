import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommonUtilService } from '../../service/utils/common-utils';

@Component({
  selector: 'app-taxpayer-profile',
  templateUrl: './taxpayer-profile.component.html',
  styleUrls: ['./taxpayer-profile.component.css']
})
export class TaxpayerProfileComponent implements OnInit {
  @ViewChild('email') userEmail: ElementRef<HTMLInputElement>;
  @ViewChild('address') userPresentAddress: ElementRef<HTMLInputElement>;
  @ViewChild('spouse') spouseName: ElementRef<HTMLInputElement>;
  @ViewChild('sp_tin') sopuseTin: ElementRef<HTMLInputElement>;
  checkIsLoggedIn: any;
  userTin: any;
  token: any;
  imgUrl: any;
  isEmailEditDone: boolean = true;
  isAddressEditDone: boolean = true;
  isSpouseNameEditDone: boolean = true;
  isSpouseTinEditDone: boolean = true;

  presentAddSubstring1: any;
  presentAddSubstring2: any;

  data: any;
  requestBody: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

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
  spouseTin : any;
  taxpayerencodedImgUrl : any;

  isProfileValidedSuccess : boolean = false;
  constructor(private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.getData();
  }

  getData() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/full') //+ this.userTin)
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

  imgTransform(profileImg: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(profileImg) as any).changingThisBreaksApplicationSecurity;
  }

  validateEmail(email) {
    // debugger;
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
   }

  setTaxpayerProfile(profile: any) {
    this.taxpayerName = profile.assesName ? profile.assesName : '';
    this.taxpayerencodedImgUrl = profile.image?  profile.image : null;
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
    this.spouseTin = profile.spouseTin ? profile.spouseTin : '';

    // this.presentAddSubstring1 = this.taxpayerPresentAddress.substring(0,25);
    // this.presentAddSubstring2 = this.taxpayerPresentAddress.substring(26,50);
  }

  editEmail() {
    this.isEmailEditDone = false;
  }
  saveEmail() {
    this.isEmailEditDone = true;
    //console.log(this.userEmail.nativeElement.value);
  }
  editAddress() {
    this.isAddressEditDone = false;
  }
  saveAddress() {
    this.isAddressEditDone = true;
    //console.log(this.userPresentAddress.nativeElement.value);
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


  profileValidationProcess(): boolean{
     this.isProfileValidedSuccess = true;
     if(this.userEmail.nativeElement.value !='' && !this.validateEmail(this.userEmail.nativeElement.value)){
      this.toastr.warning('Please provide a valid email!');
      this.isProfileValidedSuccess = false;
      return;
     }
     if(this.userPresentAddress.nativeElement.value ===''){
      this.toastr.warning('Present Address is required!');
      this.isProfileValidedSuccess = false;
      return;
     }
     if(this.sopuseTin.nativeElement.value.length!=0 && this.sopuseTin.nativeElement.value.length != 12)
     {
       this.toastr.warning('Spouse TIN must be 12 digit!');
       this.isProfileValidedSuccess = false;
       return;
     }
 
     if(this.isProfileValidedSuccess)
     return true;
     else 
     return false;
  }


  onNextPage() {
    if(!this.profileValidationProcess()) return;

    this.requestBody =
    {
      "email": this.userEmail.nativeElement.value,
      "presentAddress": this.userPresentAddress.nativeElement.value,
      "spouseName": this.spouseName.nativeElement.value,
      "spouseTin" : this.sopuseTin.nativeElement.value,
    }
    //console.log(this.requestBody);
    this.apiService.put(this.serviceUrl + 'api/user-panel/taxpayer-profile', this.requestBody)
      .subscribe(result => {
       // console.log(result);
        if (result=='S')
          this.toastr.success('Data updated Successfully');
      },
        error => {
         // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }
  
  numberOnly(event): boolean {
    return CommonUtilService.numberOnly(event);
  }

  onSync(){

    this.apiService.put(this.serviceUrl + 'api/user-panel/taxpayer-profile/sync', null)
      .subscribe(result => {
        this.setTaxpayerProfile(result.replyMessage);
        this.toastr.success('Profile synced successfully');
      },
        error => {
          this.toastr.error(error['error'].errorMessage);
        }); 
  }

}
