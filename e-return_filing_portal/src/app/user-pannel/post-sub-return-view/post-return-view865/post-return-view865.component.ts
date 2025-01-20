import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';
import { BasicInfoService } from '../basic-info.service';

@Component({
  selector: 'app-post-return-view865',
  templateUrl: './post-return-view865.component.html',
  styleUrls: ['./post-return-view865.component.css']
})
export class PostReturnView865Component implements OnInit {
  userTin: any;
  taxPayerName: any;

  taxPaymentGetData: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  lifeInsurancePremium: any;
  DPS: any;
  approvedStocks: any;
  approvedSavingCertificate: any;
  gpf: any;
  rpf: any;
  benevolentFund: any;
  others_under6Schedule: any;
  others_sro: any;
  total_Others: any;
  totalRebateAmt: any;
  eligibleAmtRebate: any;
  percentageOfTotalIncomeRebate: any;
  totalInvestmentRebate: any;

  staticValue: any;

  assessmentYear: any;
  staring_income_yr: any;
  ending_income_yr: any;
  //split assessment yr
  assYr1: any; assYr2: any; assYr3: any; assYr4: any;
  assYr5: any; assYr6: any;

  paragraph_6_amount: any;
  paragraph_13_amount: any;
  paragraph_other_particular: any;
  paragraph_other_amount: any;

  referenceNo: any;

  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private commaSeparator: CommaSeparatorService,
    private basicInfo : BasicInfoService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    // this.taxPayerName=localStorage.getItem('name');

    this.rebateReturnGetData();
    this.getTaxPaymentData();
    this.staticValue = this.commaSeparator.currencySeparatorBD(10000000);
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    // this.splitAssessmentYr();
    this.getTaxpayerBasicInfo();
  }

  rebateReturnGetData() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/return-view/rebate')
      .subscribe(result => {
       // console.log('rebateReturnGetData', result);
        if (result.RB_CAT_LIFE_INS_PREM) {
          result.RB_CAT_LIFE_INS_PREM.forEach(element => {
            this.lifeInsurancePremium = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_DPS) {
          result.RB_CAT_DPS.forEach(element => {
            this.DPS = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_APPR_SAVINGS_CERT) {
          result.RB_CAT_APPR_SAVINGS_CERT.forEach(element => {
            this.approvedSavingCertificate = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_APPR_STOCKS_OR_SHARES) {
          result.RB_CAT_APPR_STOCKS_OR_SHARES.forEach(element => {
            this.approvedStocks = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_GPF) {
          result.RB_CAT_GPF.forEach(element => {
            this.gpf = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_RPF) {
          result.RB_CAT_RPF.forEach(element => {
            this.rpf = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM) {
          result.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM.forEach(element => {
            this.benevolentFund = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_OTHERS_INVESTMENT_U_6_B) {
          result.RB_CAT_OTHERS_INVESTMENT_U_6_B.forEach(element => {
            this.others_under6Schedule = element.totalGross;
          });
        }
        if (result.RB_CAT_OTHERS_INVESTMENT_U_6_B_BREAKDOWN) {
          result.RB_CAT_OTHERS_INVESTMENT_U_6_B_BREAKDOWN.forEach(element => {
            if (element.investmentCatg == 'PARAGRAPH_6') {
              this.paragraph_6_amount = this.commaSeparator.currencySeparatorBD(element.totalGross);
            }
            else if (element.investmentCatg == 'PARAGRAPH_13') {
              this.paragraph_13_amount = this.commaSeparator.currencySeparatorBD(element.totalGross);
            }
            else if (element.investmentCatg == 'PARAGRAPH_OTHER_PARTICULARS') {
              this.paragraph_other_particular = element.totalGross;
            }
            else if (element.investmentCatg == 'PARAGRAPH_OTHER_AMT') {
              this.paragraph_other_amount = this.commaSeparator.currencySeparatorBD(element.totalGross);
            }
          });
        }
        if (result.RB_CAT_OTHERS_SRO) {
          result.RB_CAT_OTHERS_SRO.forEach(element => {
            this.others_sro = element.totalGross;
          });
        }
        if (result.RB_SUM) {
          result.RB_SUM.forEach(element => {
            this.totalRebateAmt = this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        this.total_Others = this.commaSeparator.currencySeparatorBD(this.others_under6Schedule + this.others_sro);
       // console.log('total_Others', this.total_Others);
      },
        error => {
     //     console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage,);
        });
  }
  getTaxPaymentData() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/tax_payment')
      .subscribe(result => {
      //  console.log(result);
        if (JSON.stringify(result.replyMessage) != '{}') {
      //    console.log('All TaxPaymentData=', result.replyMessage);
          this.taxPaymentGetData = result.replyMessage;
          // console.log(this.taxPaymentGetData);

          this.eligibleAmtRebate = this.taxPaymentGetData.tc_Eligible_Amount_For_Rebate ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Eligible_Amount_For_Rebate)) : 0;
          this.percentageOfTotalIncomeRebate = this.taxPaymentGetData.tc_Percent_Of_Total_Income ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Percent_Of_Total_Income)) : 0;
          this.totalInvestmentRebate = this.taxPaymentGetData.tc_Total_Investment_Rebate ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Total_Investment_Rebate)) : 0;


        }
      },
        error => {
      //    console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage,);
        });
  }

  getTaxpayerBasicInfo() {
    this.assessmentYear = this.basicInfo.assessmentYear;
    this.taxPayerName = this.basicInfo.assesName;
    this.referenceNo = this.basicInfo.referenceNo;
    this.splitAssessmentYr();
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
