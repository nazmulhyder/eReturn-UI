import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';
import { BasicInfoService } from '../basic-info.service';

@Component({
  selector: 'app-post-acknowledgement941',
  templateUrl: './post-acknowledgement941.component.html',
  styleUrls: ['./post-acknowledgement941.component.css']
})
export class PostAcknowledgement941Component implements OnInit {
  userTin: any;
  checkIsLoggedIn: any;
  storeSplittedTin: any;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getReturnViewACKData: any;
  //#region Rtrurn View Part |
  assessmentYr: any;
  return_submit_under_82bb: boolean = false;
  nameOfAssessee: any;
  isMgender: boolean = false;
  twelveDigitTIN: any;
  oldTIN: any;
  circle: any;
  zone: any;
  isResident: boolean = false;
  gazzetedWarWondedFF: boolean = false;
  personWithDisablilty: boolean = false;
  age65OrMore: boolean = false;
  parent_legal_of_person_with_disability: boolean = false;
  dateOfBirth: any;
  startingIncYr: any;
  endingIncYr: any;
  employerName: any;
  spouseName: any;
  spouseTIN: any;
  fatherName: any;
  motherName: any;
  presentAdd: any;
  permanentAdd: any;
  contact: any;
  email: any;
  telephone: any;
  gross_wealth: any;
  nid: any;
  bid: any;
  defaultDateInString: any;
  m1: any; m2: any; d1: any; d2: any;
  y1: any; y2: any; y3: any; y4: any;

  //default date
  mm1: any; mm2: any; dd1: any; dd2: any;
  yy1: any; yy2: any; yy3: any; yy4: any;
  //#endregion

  office_entry_no: any;
  totalIncome: any;
  amountPayable: any;
  amt_paid_adjusted : any;
  taxPaymentGetData:any;
  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private commaSeparator : CommaSeparatorService,
    private basicInfo: BasicInfoService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    // debugger;
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    // let max = 9999999999;
    // let randomNumber = Math.floor(Math.random() * max) + 1;
    this.office_entry_no = localStorage.getItem('randomNumber');
    this.returnView941ACK();
    this.splitTIN();
    this.defaultDateInString = this.datepipe.transform(Date(), 'dd-MM-yyyy')

    //newly added
    this.totalIncome =0;
    this.amountPayable =0;
    this.amt_paid_adjusted =0;
    this.getTaxPaymentData();

    // this.totalIncome = this.commaSeparator.currencySeparatorBD(localStorage.getItem('TotalIncome'));
    // this.amountPayable = localStorage.getItem('total_amount_payable');
    // this.amountPayable = this.commaSeparator.currencySeparatorBD(localStorage.getItem('total_amount_payable'));
    this.amt_paid_adjusted = localStorage.getItem('total_amt_paid_adjusted');

    // console.log('amt_paid_adjusted',this.amt_paid_adjusted);

  }

  returnView941ACK() {
    this.return_submit_under_82bb = this.basicInfo.return_under_82BB;
    this.nameOfAssessee = this.basicInfo.assesName;
    this.isMgender = this.basicInfo.gender === '1' ? true : false;
    this.twelveDigitTIN = this.basicInfo.tin;
    this.oldTIN = this.basicInfo.oldTin;
    this.circle = this.basicInfo.circle;
    this.zone = this.basicInfo.zone;
    this.isResident = this.basicInfo.residentStatus === 'Resident' ? true : false;
    this.gazzetedWarWondedFF = this.basicInfo.warWoundedFreedomFighter;
    this.personWithDisablilty = this.basicInfo.personWithDisability;
    this.age65OrMore = false;
    this.parent_legal_of_person_with_disability = this.basicInfo.guardianOfDisablePerson;
    this.startingIncYr = this.basicInfo.startOfIncomeYr;
    this.endingIncYr = this.basicInfo.endOfIncomeYr;
    this.employerName = this.basicInfo.totalEmployerAndOffice;
    this.spouseName = this.basicInfo.spouseName;
    this.spouseTIN = this.basicInfo.spouseTin;
    this.fatherName = this.basicInfo.fathersName;
    this.motherName = this.basicInfo.mothersName;
    this.presentAdd = this.basicInfo.presentAddress;
    this.permanentAdd = this.basicInfo.permanentAddress;
    this.contact = this.basicInfo.phone;
    this.email = this.basicInfo.email;
    this.nid = this.basicInfo.nid;
    this.bid = this.basicInfo.businessIdNumber;
    this.dateOfBirth = this.basicInfo.dob;
    this.gross_wealth = this.commaSeparator.currencySeparatorBD(this.basicInfo.grossWealth);

    //day
    this.m1 = this.dateOfBirth.substring(0, 1);
    this.m2 = this.dateOfBirth.substring(1, 2);
    //month
    this.d1 = this.dateOfBirth.substring(3, 4);
    this.d2 = this.dateOfBirth.substring(4, 5);
    //year
    this.y1 = this.dateOfBirth.substring(6, 7);
    this.y2 = this.dateOfBirth.substring(7, 8);
    this.y3 = this.dateOfBirth.substring(8, 9);
    this.y4 = this.dateOfBirth.substring(9, 10);

    //default date
    //day
    this.dd1 = this.defaultDateInString.substring(0, 1);
    this.dd2 = this.defaultDateInString.substring(1, 2);
    //month
    this.mm1 = this.defaultDateInString.substring(3, 4);
    this.mm2 = this.defaultDateInString.substring(4, 5);
    //year
    this.yy1 = this.defaultDateInString.substring(6, 7);
    this.yy2 = this.defaultDateInString.substring(7, 8);
    this.yy3 = this.defaultDateInString.substring(8, 9);
    this.yy4 = this.defaultDateInString.substring(9, 10);

  }

  getTaxPaymentData() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/tax_payment')
    .subscribe(result => {
      if (JSON.stringify(result.replyMessage) != '{}') {
        this.taxPaymentGetData = result.replyMessage;
        this.totalIncome = this.taxPaymentGetData.poti_Total_Income_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_Total_Income_Amt)) : 0;
        this.amountPayable = this.taxPaymentGetData.tc_Total_Payable_Amt != 'NaN' ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Total_Payable_Amt)) : 0;
      }
    },
    error => {
     // console.log(error['error'].errorMessage);
      // this.toastr.error(error['error'].errorMessage, '', {
      //   timeOut: 1000,
      // });
    });
  }

  splitTIN() {
    let output = [],
      sNumber = this.userTin.toString();

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
      output.push(+sNumber.charAt(i));
    }
    this.storeSplittedTin = output;
  }


}
