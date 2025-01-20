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
  selector: 'app-post-return-view941',
  templateUrl: './post-return-view941.component.html',
  styleUrls: ['./post-return-view941.component.css']
})
export class PostReturnView941Component implements OnInit {
  apiService: ApiService;
  private serviceUrl: string;
  private eLedgerUrl: string;
  apiUrl: ApiUrl;
  checkIsLoggedIn: any;
  userTin: any;
  taxpayerProfileImg: any;
  getReturnViewPart2Data: any;
  storeSplittedTin: any;
  storeOfficeRegisterNo: any;

  defaultTodaysDate = new Date();
  defaultDateInString: any;


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
  nid: any;
  bid: any;
  m1: any; m2: any; d1: any; d2: any;
  y1: any; y2: any; y3: any; y4: any;

  //default date
  mm1: any; mm2: any; dd1: any; dd2: any;
  yy1: any; yy2: any; yy3: any; yy4: any;
  //#endregion

  //#region  Return View Part ||
  totalSalaryAmt: any;
  totalInterestSecurityAmt: any;
  totalHousePropertyAmt: any;
  totalIncomeFromOtherSourcesAmt: any;
  totalCapitalGainAmt: any;
  totalAgriculture: any;
  totalBusinessOrProfession: any;
  totalFirm_AoP: any;
  totalSpouse_Income: any;
  totalForeign_Income: any;
  total_Income_Amt: any;
  total_Tax_Exempted_Income_Amt: any;
  total_Gross_Tax_Before_Tax_Rebate_Amt: any;
  total_Tax_Rebate_Amt: any;
  total_Net_Tax_After_Tax_Rebate_Amt: any;
  total_Min_Tax_Amt: any;
  total_Net_Wealth_Surcharge_Amt: any;
  total_Interest_or_Any_Other_Amt: any;
  total_Payable_Amt: any;
  tax_deducted_or_collected_at_source: any;
  total_Tax_Exempted_Income: any;
  refundable: any;
  payable: any;

  adv_tax_paid: any;
  adj_tax_refund: any;
  amt_paid_return: any;
  regularTax: any;
  total_amt_paid_adjusted: any;
  //#endregion

  office_register_no: any;

  assessmentYear: any;
  staring_income_yr: any;
  ending_income_yr: any;

  //split assessment yr
  assYr1: any; assYr2: any; assYr3: any; assYr4: any;
  assYr5: any; assYr6: any;
  isIT10B_applicable: boolean = false;
  is_still_want_IT10B: boolean = false;
  is24A: boolean = false;
  is24B: boolean = false;
  is24C: boolean = false;
  is24D: boolean = false;
  isIT10BB_mandatory: boolean = false;
  taxPaymentGetData: any;
  referenceNo: any;
  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
    private httpClient: HttpClient,
    private commaSeparator: CommaSeparatorService,
    private basicInfo: BasicInfoService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.apiUrl.getUrl().subscribe(res => {
      this.eLedgerUrl = res['eLedger'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd-MM-yyyy');

    let max = 9999999999;
    let randomNumber = Math.floor(Math.random() * max) + 1;
    this.office_register_no = randomNumber;
    localStorage.setItem('randomNumber', this.office_register_no);
    // console.log('tax office no', this.office_register_no);

    this.tax_deducted_or_collected_at_source = 0;
    this.adv_tax_paid = 0;
    this.adj_tax_refund = 0;
    this.regularTax = 0;
    this.amt_paid_return = 0;
    this.total_amt_paid_adjusted = 0;
    this.refundable = 0;

    this.total_Tax_Exempted_Income = 0;
    this.payable = 0;
    this.total_Payable_Amt = 0;

    this.getData();
    this.splitTIN();
    this.splitOfficeRegisterNo();
    this.returnView941Part1();
    this.returnView941Part2();

    // console.log('todays date',this.defaultTodaysDate);
    this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd-MM-yyyy');
    // console.log('text date', this.defaultDateInString);

    // this.getTdsFromIbasData();

    this.getEledgerSummary();

    // this.total_Tax_Exempted_Income = this.commaSeparator.currencySeparatorBD(localStorage.getItem('TaxExemptedIncome'));
    // this.refundable = this.commaSeparator.currencySeparatorBD(localStorage.getItem('RefundableAmount'));
    // this.payable = this.commaSeparator.currencySeparatorBD(localStorage.getItem('payable'));
    // debugger;
    // this.total_amt_paid_adjusted = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
    //get this from local storage
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr = localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    // this.splitAssessmentYr();
  }

  getEledgerSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get(this.eLedgerUrl + 'api/tds_summary')
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {
            //console.log('eLedgerData', result.replyMessage);

            let totalSourceTax: any;
            totalSourceTax = (result.replyMessage['IBassTDS']
              + result.replyMessage['BankTDS']
              + result.replyMessage['SavingCertificateTDS']
              + result.replyMessage['OtherTDS']);
            //  console.log('sourceTax', totalSourceTax);
            this.tax_deducted_or_collected_at_source = this.commaSeparator.currencySeparatorBD(totalSourceTax);

            let totalAdvanceIncomeTax: any;
            totalAdvanceIncomeTax = (result.replyMessage['CarTDS']
              + result.replyMessage['US64TDS']);
            //  console.log('advanceIncomeTax', totalAdvanceIncomeTax);
            this.adv_tax_paid = this.commaSeparator.currencySeparatorBD(totalAdvanceIncomeTax);

            let totalRegularTax: any;
            totalRegularTax = (result.replyMessage['US74TDS']);
            //   console.log('regularTax', totalRegularTax);
            this.regularTax = totalRegularTax;

            this.getTotalRegularPayment();

            // this.getTaxPaymentData();
          }
          resolve();
        },
          error => {
            reject();
            this.getTotalRegularPayment();
            //   console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });

    });
  }

  getTotalRegularPayment(): Promise<void> {
    let requestData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/payment/get_client_payment_summary')
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {
            //     console.log('totalPayment', result.replyMessage["totalPayment"]);
            this.amt_paid_return = result.replyMessage["totalPayment"];
            this.amt_paid_return = (this.amt_paid_return + this.regularTax);
            this.amt_paid_return = this.commaSeparator.currencySeparatorBD(this.amt_paid_return);
            // debugger;
            let sourceTax: any;
            let advTax: any;
            let amtPaidReturn: any;
            sourceTax = Number(this.commaSeparator.removeComma(this.tax_deducted_or_collected_at_source, 0));
            advTax = Number(this.commaSeparator.removeComma(this.adv_tax_paid, 0));
            amtPaidReturn = Number(this.commaSeparator.removeComma(this.amt_paid_return, 0));
            this.total_amt_paid_adjusted = (sourceTax + advTax + this.adj_tax_refund + amtPaidReturn);
            this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.total_amt_paid_adjusted);
            this.cal47();
          }
          resolve();
        },
          error => {
            reject();
            this.cal47();
            //   console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });

    });
  }

  getTdsFromIbasData() {
    if (this.userTin == "196890847278") {
      this.httpClient.get("assets/IbasSalary/196890847278.json").subscribe(data => {
        //  console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);
        //   console.log('tds', this.tax_deducted_or_collected_at_source);

        this.cal47();
      })
    }
    if (this.userTin == "243149308855") {
      this.httpClient.get("assets/IbasSalary/243149308855.json").subscribe(data => {
        //  console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }

    if (this.userTin == "334549984675") {
      this.httpClient.get("assets/IbasSalary/334549984675.json").subscribe(data => {
        // console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }

    if (this.userTin == "350066521535") {
      this.httpClient.get("assets/IbasSalary/350066521535.json").subscribe(data => {
        //   console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }
    if (this.userTin == "569041223610") {
      this.httpClient.get("assets/IbasSalary/569041223610.json").subscribe(data => {
        //  console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }
    if (this.userTin == "797445374920") {
      this.httpClient.get("assets/IbasSalary/797445374920.json").subscribe(data => {
        //     console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }
    if (this.userTin == "824432482354") {
      this.httpClient.get("assets/IbasSalary/824432482354.json").subscribe(data => {
        //    console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }
    if (this.userTin == "394350347898") {
      this.httpClient.get("assets/IbasSalary/394350347898.json").subscribe(data => {
        //     console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
        this.tax_deducted_or_collected_at_source = (this.tax_deducted_or_collected_at_source + this.adv_tax_paid + this.adj_tax_refund + this.amt_paid_return);
        this.total_amt_paid_adjusted = this.commaSeparator.currencySeparatorBD(this.tax_deducted_or_collected_at_source);
        this.tax_deducted_or_collected_at_source = this.total_amt_paid_adjusted;
        localStorage.setItem('total_amt_paid_adjusted', this.total_amt_paid_adjusted);

        this.cal47();
      })
    }

    else {
      this.cal47();
    }

  }

  getData() {
    // debugger;
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/short' )
      .subscribe(result => {
        if (JSON.stringify(result) != '{}') {
          this.taxpayerProfileImg = result.image == null || result.image == '' ? 'Image Not Found' : this.imgTransform(result.image);
        }
      },
        error => {
          //     console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

  imgTransform(profileImg: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(profileImg) as any).changingThisBreaksApplicationSecurity;
  }

  returnView941Part1() {
    //patch value from basic-info.service
    this.return_submit_under_82bb = this.basicInfo.return_under_82BB;
    this.nameOfAssessee = this.basicInfo.assesName;
    this.isMgender = this.basicInfo.gender === 'M' ? true : false;
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
    this.assessmentYear = this.basicInfo.assessmentYear;

    this.isIT10B_applicable = this.basicInfo.isALApplicable;
    this.is_still_want_IT10B = this.basicInfo.mandatoryITTenB;
    this.isIT10BB_mandatory = this.basicInfo.IT10BB_Mandatory;
    this.is24A = this.basicInfo.twenty_four_a;
    this.is24B = this.basicInfo.twenty_four_b;
    this.is24C = this.basicInfo.twenty_four_c;
    this.is24D = this.basicInfo.twenty_four_d;
    //referenceNo
    this.referenceNo = this.basicInfo.referenceNo;
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

    this.splitAssessmentYr();

  }
  returnView941Part2() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/tax_payment')
      .subscribe(result => {
        // console.log('part 2',result);
        this.getReturnViewPart2Data = result;
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.getReturnViewPart2Data = result.replyMessage;
          this.totalSalaryAmt = this.getReturnViewPart2Data.poti_SAL_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_SAL_Amt)) : 0;
          this.totalInterestSecurityAmt = this.getReturnViewPart2Data.poti_IOS_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_IOS_Amt)) : 0;
          this.totalHousePropertyAmt = this.getReturnViewPart2Data.poti_IFHP_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_IFHP_Amt)) : 0;
          this.totalIncomeFromOtherSourcesAmt = this.getReturnViewPart2Data.poti_IFOS_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_IFOS_Amt)) : 0;
          this.totalCapitalGainAmt = this.getReturnViewPart2Data.poti_CG_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_CG_Amt)) : 0;
          this.totalAgriculture = this.getReturnViewPart2Data.poti_AI_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_AI_Amt)) : 0;
          this.totalBusinessOrProfession = this.getReturnViewPart2Data.poti_IFBP_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_IFBP_Amt)) : 0;
          this.totalFirm_AoP = this.getReturnViewPart2Data.poti_SOIFFAOP_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_SOIFFAOP_Amt)) : 0;
          this.totalSpouse_Income = this.getReturnViewPart2Data.poti_IFMSUS_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_IFMSUS_Amt)) : 0;
          this.totalForeign_Income = this.getReturnViewPart2Data.poti_FI_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_FI_Amt)) : 0;
          this.total_Income_Amt = this.getReturnViewPart2Data.poti_Total_Income_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_Total_Income_Amt)) : 0;
          this.total_Tax_Exempted_Income_Amt = this.getReturnViewPart2Data.poti_Tax_Exempted_Income_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_Tax_Exempted_Income_Amt)) : 0;
          this.total_Gross_Tax_Before_Tax_Rebate_Amt = this.getReturnViewPart2Data.tc_Gross_Tax_Before_Tax_Rebate_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Gross_Tax_Before_Tax_Rebate_Amt)) : 0;
          this.total_Tax_Rebate_Amt = this.getReturnViewPart2Data.tc_Tax_Rebate_Amt != 'NaN' ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Tax_Rebate_Amt)) : 0;
          this.total_Net_Tax_After_Tax_Rebate_Amt = this.getReturnViewPart2Data.tc_Net_Tax_After_Tax_Rebate_Amt != 'NaN' ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Net_Tax_After_Tax_Rebate_Amt)) : 0;
          this.total_Min_Tax_Amt = this.getReturnViewPart2Data.tc_Min_Tax_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Min_Tax_Amt)) : 0;
          this.total_Net_Wealth_Surcharge_Amt = this.getReturnViewPart2Data.tc_Net_Wealth_Surcharge_Amt != 'NaN' ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Net_Wealth_Surcharge_Amt)) : 0;
          this.total_Interest_or_Any_Other_Amt = this.getReturnViewPart2Data.tc_Interest_or_Any_Other_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Interest_or_Any_Other_Amt)) : 0;
          this.total_Payable_Amt = this.getReturnViewPart2Data.tc_Total_Payable_Amt != 'NaN' ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.tc_Total_Payable_Amt)) : 0;
          this.total_Tax_Exempted_Income = this.getReturnViewPart2Data.poti_Tax_Exempted_Income_Amt ? this.commaSeparator.currencySeparatorBD(Math.round(this.getReturnViewPart2Data.poti_Tax_Exempted_Income_Amt)) : 0;
        }
      })
  }


  cal47() {
    // debugger;
    let TPA: any;
    let TAPA: any;
    let localTPA: any;
    // localTPA = localStorage.getItem('total_amount_payable') ? localStorage.getItem('total_amount_payable') : 0;
    localTPA = this.total_Payable_Amt;
    TPA = this.commaSeparator.removeComma(localTPA, 0);
    TAPA = this.total_amt_paid_adjusted ? this.commaSeparator.removeComma(this.total_amt_paid_adjusted, 0) : 0;
    this.refundable = (TPA - TAPA);
    if (this.refundable < 0) {
      this.refundable = -(this.refundable);
      this.refundable = this.commaSeparator.currencySeparatorBD(this.refundable);
    }
    else {
      this.refundable = this.commaSeparator.currencySeparatorBD(this.refundable);
    }
  }

  splitTIN() {
    let output = [],
      sNumber = this.userTin.toString();

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
      output.push(+sNumber.charAt(i));
    }

    this.storeSplittedTin = output;
  }
  splitOfficeRegisterNo() {
    let output = [],
      sNumber = this.office_register_no.toString();

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
      output.push(+sNumber.charAt(i));
    }

    this.storeOfficeRegisterNo = output;
  }

  splitAssessmentYr() {
    this.assYr1 = this.assessmentYear.substring(0, 1);
    this.assYr2 = this.assessmentYear.substring(1, 2);
    this.assYr3 = this.assessmentYear.substring(2, 3);
    this.assYr4 = this.assessmentYear.substring(3, 4);
    this.assYr5 = this.assessmentYear.substring(7, 8);
    this.assYr6 = this.assessmentYear.substring(8, 9);
  }

}
