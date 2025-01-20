import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';

@Component({
  selector: 'app-acknowledgement941',
  templateUrl: './acknowledgement941.component.html',
  styleUrls: ['./acknowledgement941.component.css']
})
export class Acknowledgement941Component implements OnInit {
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
  amt_paid_adjusted: any;
  taxPaymentGetData: any;
  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private commaSeparator: CommaSeparatorService
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
    // this.office_entry_no = localStorage.getItem('randomNumber');
    this.returnView941ACK();
    this.splitTIN();
    this.defaultDateInString = this.datepipe.transform(Date(), 'dd-MM-yyyy')

    //newly added
    this.totalIncome = 0;
    this.amountPayable = 0;
    this.amt_paid_adjusted = 0;
    this.getTaxPaymentData();

    // this.totalIncome = this.commaSeparator.currencySeparatorBD(localStorage.getItem('TotalIncome'));
    // this.amountPayable = localStorage.getItem('total_amount_payable');
    // this.amountPayable = this.commaSeparator.currencySeparatorBD(localStorage.getItem('total_amount_payable'));
    this.amt_paid_adjusted = localStorage.getItem('total_amt_paid_adjusted');

    // console.log('amt_paid_adjusted',this.amt_paid_adjusted);

  }

  returnView941ACK() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
        //console.log('part 1', result);
        this.getReturnViewACKData = result;
        if (JSON.stringify(result.replyMessage) != '{}') {
          // console.log('+++++', result.replyMessage);
          this.return_submit_under_82bb = result.replyMessage.return_under_82BB;
          this.nameOfAssessee = result.replyMessage.assesName;
          this.isMgender = result.replyMessage.gender === '1' ? true : false;
          this.twelveDigitTIN = result.replyMessage.tin;
          this.oldTIN = result.replyMessage.oldTin;
          this.circle = result.replyMessage.circle;
          this.zone = result.replyMessage.zone;
          this.isResident = result.replyMessage.residentStatus === 'Resident' ? true : false;
          this.gazzetedWarWondedFF = result.replyMessage.warWoundedFreedomFighter;
          this.personWithDisablilty = result.replyMessage.personWithDisability;
          this.age65OrMore = false;
          this.parent_legal_of_person_with_disability = result.replyMessage.guardianOfDisablePerson;
          this.startingIncYr = result.replyMessage.startOfIncomeYr;
          this.endingIncYr = result.replyMessage.endOfIncomeYr;
          this.employerName = result.replyMessage.totalEmployerAndOffice;
          this.spouseName = result.replyMessage.spouseName;
          this.spouseTIN = result.replyMessage.spouseTin;
          this.fatherName = result.replyMessage.fathersName;
          this.motherName = result.replyMessage.mothersName;
          this.presentAdd = result.replyMessage.presentAddress;
          this.permanentAdd = result.replyMessage.permanentAddress;
          this.contact = result.replyMessage.phone;
          this.email = result.replyMessage.email;
          this.nid = result.replyMessage.nid;
          this.bid = result.replyMessage.businessIdNumber;
          this.dateOfBirth = result.replyMessage.dob;
          this.gross_wealth = this.commaSeparator.currencySeparatorBD(result.replyMessage.grossWealth);
          this.office_entry_no = result.replyMessage.referenceNo;

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
      })

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
