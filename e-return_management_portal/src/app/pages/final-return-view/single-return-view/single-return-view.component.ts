import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';

@Component({
  selector: 'app-single-return-view',
  templateUrl: './single-return-view.component.html',
  styleUrls: ['./single-return-view.component.css']
})
export class SingleReturnViewComponent implements OnInit {

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
  currentDate:any;

  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
   }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
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
    this.getUserReturnData();
  }

  getUserImage() {
    // debugger;
    this.apiService.get(this.serviceUrl + 'api/management/return-view/taxpayer-profile/short/' + this.userTin)
      .subscribe(result => {
        // console.log('single Return view', result);
        if (JSON.stringify(result) != '{}') {
          this.taxpayerProfileImg = result.image == null || result.image == '' ? 'Image Not Found' : this.imgTransform(result.image);
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].message,);
        });
  }

  imgTransform(profileImg: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(profileImg) as any).changingThisBreaksApplicationSecurity;
  }

  getUserReturnData() {
    let getUserReturnDataRequestBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    };

    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-basic-return-info', getUserReturnDataRequestBody)
      .subscribe(result => {
        if (result != null) {
          //console.log('result Data:', result.replyMessage);
          this.taxPayerReturnData = result.replyMessage;

          this.tin = this.taxPayerReturnData.tin;
          this.nid = this.taxPayerReturnData.nid;
          this.name = this.taxPayerReturnData.assesName;
          localStorage.setItem('name', this.name);
          this.spouse_name = this.taxPayerReturnData.spouseName;
          this.father_name = this.taxPayerReturnData.fathersName;
          this.mother_name = this.taxPayerReturnData.mothersName;
          this.circle = this.taxPayerReturnData.circle;
          this.zone = this.taxPayerReturnData.zone;
          this.resident = this.taxPayerReturnData.residentStatus;
          if (this.resident == 'Resident') {
            this.isResidentChecked = true;
          }
          if (this.resident != 'Resident') {
            this.isNonResidentChecked = true;
          }
          this.Assessment_year = this.taxPayerReturnData.assessmentYear;
          this.present_address = this.taxPayerReturnData.presentAddress;
          this.permanent_address = this.taxPayerReturnData.permanentAddress;
          this.gross_wealth = this.taxPayerReturnData.grossWealth;
          this.mobile = this.taxPayerReturnData.phone;
          this.office_register_no = this.taxPayerReturnData.referenceNo;

        }

      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

}
