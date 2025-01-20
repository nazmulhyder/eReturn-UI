import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommaSeparatorService } from '../../../service/comma-separator.service';

@Component({
  selector: 'app-offline-return-view941',
  templateUrl: './offline-return-view941.component.html',
  styleUrls: ['./offline-return-view941.component.css']
})
export class OfflineReturnView941Component implements OnInit {

  commonReturnForm: FormGroup;

  apiService: ApiService;
  private serviceUrl: string;
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
  //#endregion

  office_register_no: any;

  TDSAmt : any = 0;
AdvTaxPaid : any = 0;
AdjOfTaxRefund : any = 0;
AmountPaidReturn : any = 0;
amtPaidAdjusted : any = 0;
DeficitExcess : any = 0;

assessmentYear : any;
staring_income_yr : any;
ending_income_yr : any;

//split assessment yr
assYr1:any;assYr2:any;assYr3:any;assYr4:any;
assYr5:any;assYr6:any;

isIT10B_applicable : boolean = false;
is_still_want_IT10B : boolean = false;
is24A : boolean = false;
is24B : boolean = false;
is24C : boolean = false;
is24D : boolean = false;
isIT10BB_mandatory : boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
    private httpClient: HttpClient,
    private commaSeparator : CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
    this.commonReturnForm = new FormGroup({
      advanceTaxPaid: new FormControl(""),
      // password: new FormControl(""),
      // captcha: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd-MM-yyyy');

    let max = 9999999999;
    let randomNumber = Math.floor(Math.random() * max) + 1;
    this.office_register_no = randomNumber;
    localStorage.setItem('randomNumber', this.office_register_no);
   // console.log('tax office no', this.office_register_no);

    this.getData();
    this.splitTIN();
    this.splitOfficeRegisterNo();
    this.returnView941Part1();
    this.returnView941Part2();

    // console.log('todays date',this.defaultTodaysDate);
    this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd-MM-yyyy');
    // console.log('text date', this.defaultDateInString);

    this.getTdsFromIbasData();

    // this.total_Tax_Exempted_Income = this.commaSeparator.currencySeparatorBD(localStorage.getItem('TaxExemptedIncome'));
    this.refundable = localStorage.getItem('RefundableAmount');
    this.payable = localStorage.getItem('payable');

    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');

    // this.splitAssessmentYr();

  }

  initializeTDS(event) {
    this.TDSAmt = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value,0));
  }

  initializeAdvTaxPaid(event) {
    this.AdvTaxPaid = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value,0));
  }

  initializeAdjOfTaxRefund(event) {
    this.AdjOfTaxRefund = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value,0));
  }

  initializeAmountPaidReturn(event) {
    this.AmountPaidReturn = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value,0));
  }

  initializeTotalAmountPaidAdj(event) {
    this.amtPaidAdjusted = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value,0));
  }

  initializeDeficitExcess(event) {
    this.DeficitExcess = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value,0));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getTdsFromIbasData() {
    if (this.userTin == "196890847278") {
      this.httpClient.get("assets/IbasSalary/196890847278.json").subscribe(data => {
       // console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
      })
    }
    if (this.userTin == "243149308855") {
      this.httpClient.get("assets/IbasSalary/243149308855.json").subscribe(data => {
      //  console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
      })
    }

    if (this.userTin == "334549984675") {
      this.httpClient.get("assets/IbasSalary/334549984675.json").subscribe(data => {
       // console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
      })
    }

    if (this.userTin == "350066521535") {
      this.httpClient.get("assets/IbasSalary/350066521535.json").subscribe(data => {
     //   console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
      })
    }
    if (this.userTin == "569041223610") {
      this.httpClient.get("assets/IbasSalary/569041223610.json").subscribe(data => {
     //   console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;

      })
    }
    if (this.userTin == "797445374920") {
      this.httpClient.get("assets/IbasSalary/797445374920.json").subscribe(data => {
      //  console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;
      })
    }
    if (this.userTin == "824432482354") {
      this.httpClient.get("assets/IbasSalary/824432482354.json").subscribe(data => {
     //   console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;

      })
    }
    if (this.userTin == "394350347898") {
      this.httpClient.get("assets/IbasSalary/394350347898.json").subscribe(data => {
    //    console.log('Ibas Data:', data);
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.tax_deducted_or_collected_at_source = IbasData;

      })
    }
    else{
      this.tax_deducted_or_collected_at_source =0;
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
      //    console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

  imgTransform(profileImg: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(profileImg) as any).changingThisBreaksApplicationSecurity;
  }

  returnView941Part1() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
     //   console.log('part 1',result);
        this.getReturnViewPart2Data = result;
        if (JSON.stringify(result.replyMessage) != '{}') {
          // console.log('+++++',result.replyMessage);
          this.return_submit_under_82bb = result.replyMessage.return_under_82BB;
          this.nameOfAssessee = result.replyMessage.assesName;
          this.isMgender = result.replyMessage.gender === 'M' ? true : false;
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
          this.assessmentYear = result.replyMessage.assessmentYear;

          this.isIT10B_applicable = result.replyMessage.isALApplicable;
          this.is_still_want_IT10B = result.replyMessage.mandatoryITTenB;
          this.isIT10BB_mandatory = result.replyMessage.IT10BB_Mandatory;
          this.is24A = result.replyMessage.twenty_four_a;
          this.is24B = result.replyMessage.twenty_four_b;
          this.is24C = result.replyMessage.twenty_four_c;
          this.is24D = result.replyMessage.twenty_four_d;

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
      })

  }
  returnView941Part2() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/tax_payment')
      .subscribe(result => {
    //    console.log('part 2',result);
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

  splitAssessmentYr()
  {
    this.assYr1 = this.assessmentYear.substring(0, 1);
    this.assYr2 = this.assessmentYear.substring(1, 2);
    this.assYr3 = this.assessmentYear.substring(2, 3);
    this.assYr4 = this.assessmentYear.substring(3, 4);
    this.assYr5 = this.assessmentYear.substring(7, 8);
    this.assYr6 = this.assessmentYear.substring(8, 9);
  }

}
