import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { BasicInfoService } from '../basic-info.service';

@Component({
  selector: 'app-post-single-return-view',
  templateUrl: './post-single-return-view.component.html',
  styleUrls: ['./post-single-return-view.component.css']
})
export class PostSingleReturnViewComponent implements OnInit {
  userTin: any;
  taxpayerProfileImg: any;
  taxPayerReturnData: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  office_register_no: any;
  tin: any;
  nid: any;
  name: any;
  spouse_name: any;
  father_name: any;
  mother_name: any;
  circle: any;
  zone: any;
  resident: any;
  Assessment_year: any;
  present_address: any;
  permanent_address: any;
  taxable_income: any;
  gross_wealth: any;
  amount_of_tax: any;
  source_of_income: any;
  bank_and_challan_no: any;
  mobile: any;

  isResidentChecked: boolean = false;
  isNonResidentChecked: boolean = false;
  currentDate: any;

  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private basicInfo: BasicInfoService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    // let max = 9999999999;
    // let randomNumber = Math.floor(Math.random() * max) + 1;
    // this.office_register_no = randomNumber;
    // console.log('randomNumber', this.randomNumber);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.currentDate = mm + '-' + dd + '-' + yyyy;
    this.getUserImage();
    this.getUserReturnBasicInfoData();
  }

  getUserImage() {
    // debugger;
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/short' )
      .subscribe(result => {
        // console.log('single Return view', result);
        if (JSON.stringify(result) != '{}') {
          this.taxpayerProfileImg = result.image == null || result.image == '' ? 'Image Not Found' : this.imgTransform(result.image);
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].message,);
        });
  }

  imgTransform(profileImg: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(profileImg) as any).changingThisBreaksApplicationSecurity;
  }

  getUserReturnBasicInfoData() {
    //patch value from basic-info.service
    this.tin = this.basicInfo.tin;
    this.nid = this.basicInfo.nid;
    this.name = this.basicInfo.assesName;
    localStorage.setItem('name', this.name);
    this.spouse_name = this.basicInfo.spouseName;
    this.father_name = this.basicInfo.fathersName;
    this.mother_name = this.basicInfo.mothersName;
    this.circle = this.basicInfo.circle;
    this.zone = this.basicInfo.zone;
    this.resident = this.basicInfo.residentStatus;
    if (this.resident == 'Resident') {
      this.isResidentChecked = true;
    }
    if (this.resident != 'Resident') {
      this.isNonResidentChecked = true;
    }
    //referenceNo
    this.office_register_no = this.basicInfo.referenceNo;
    this.Assessment_year = this.basicInfo.assessmentYear;
    this.present_address = this.basicInfo.presentAddress;
    this.permanent_address = this.basicInfo.permanentAddress;
    this.gross_wealth = this.basicInfo.grossWealth;
    this.mobile = this.basicInfo.phone;
  }

}
