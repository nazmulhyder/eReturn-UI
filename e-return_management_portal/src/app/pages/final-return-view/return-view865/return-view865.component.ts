import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';

@Component({
  selector: 'app-return-view865',
  templateUrl: './return-view865.component.html',
  styleUrls: ['./return-view865.component.css']
})
export class ReturnView865Component implements OnInit {

  userTin: any;
  taxPayerName:any;

  taxPaymentGetData:any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  lifeInsurancePremium:any;
  DPS:any;
  approvedStocks:any;
  approvedSavingCertificate:any;
  gpf:any;
  rpf:any;
  benevolentFund:any;
  others:any;
  totalRebateAmt:any;
  eligibleAmtRebate:any;
  percentageOfTotalIncomeRebate:any;
  totalInvestmentRebate:any;

  staticValue:any;

  assessmentYear:any;
  staring_income_yr:any;
  ending_income_yr:any;
  //split assessment yr
  assYr1:any;assYr2:any;assYr3:any;assYr4:any;
  assYr5:any;assYr6:any;

  referenceNo: any;

  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private commaSeparator : CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
   }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
    });
    this.userTin = localStorage.getItem('tin');
    // this.taxPayerName=localStorage.getItem('name');

    this.rebateReturnGetData();
    this.getTaxPaymentData();
    this.staticValue= this.commaSeparator.currencySeparatorBD(10000000);
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    // this.splitAssessmentYr();
    this.getTaxpayerBasicInfo();
  }

  rebateReturnGetData(){
    this.apiService.get(this.serviceUrl + 'api/management/return-view/rebate/' + this.userTin + '/2021-2022/')
      .subscribe(result => {
        console.log('rebateReturnGetData', result);
        if (result.RB_CAT_LIFE_INS_PREM) {
          result.RB_CAT_LIFE_INS_PREM.forEach(element => {
            this.lifeInsurancePremium= this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_DPS) {
          result.RB_CAT_DPS.forEach(element => {
            this.DPS=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_APPR_SAVINGS_CERT) {
          result.RB_CAT_APPR_SAVINGS_CERT.forEach(element => {
            this.approvedSavingCertificate=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_APPR_STOCKS_OR_SHARES) {
          result.RB_CAT_APPR_STOCKS_OR_SHARES.forEach(element => {
            this.approvedStocks=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_GPF) {
          result.RB_CAT_GPF.forEach(element => {
            this.gpf=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_RPF) {
          result.RB_CAT_RPF.forEach(element => {
            this.rpf=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM) {
          result.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM.forEach(element => {
            this.benevolentFund=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_OTHERS_INVESTMENT_U_6_B) {
          result.RB_CAT_OTHERS_INVESTMENT_U_6_B.forEach(element => {
            this.others=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
        if (result.RB_CAT_OTHERS_SRO) {
          result.RB_CAT_OTHERS_SRO.forEach(element => {
            this.others= this.commaSeparator.currencySeparatorBD((this.others+element.totalGross));
          });
        }
        if (result.RB_SUM) {
          result.RB_SUM.forEach(element => {
            this.totalRebateAmt=this.commaSeparator.currencySeparatorBD(element.totalGross);
          });
        }
      },
      error => {
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage,);
      });
  }
  getTaxPaymentData() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/management/return-view/tax_payment', reqBody)
    .subscribe(result => {
      console.log(result);
      if (JSON.stringify(result.replyMessage) != '{}') {
        console.log('All TaxPaymentData=', result.replyMessage);
        this.taxPaymentGetData = result.replyMessage;
        // console.log(this.taxPaymentGetData);

        this.eligibleAmtRebate=this.taxPaymentGetData.tc_Eligible_Amount_For_Rebate ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Eligible_Amount_For_Rebate)) :0;
        this.percentageOfTotalIncomeRebate=this.taxPaymentGetData.tc_Percent_Of_Total_Income ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Percent_Of_Total_Income)) :0;
        this.totalInvestmentRebate=this.taxPaymentGetData.tc_Total_Investment_Rebate ? this.commaSeparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Total_Investment_Rebate)) :0;


      }
    },
      error => {
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage,);
      });
  }

  getTaxpayerBasicInfo() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-basic-return-info', reqBody)
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.assessmentYear = result.replyMessage.assessmentYear;
          this.taxPayerName = result.replyMessage.assesName;
          this.referenceNo = result.replyMessage.referenceNo;
          this.splitAssessmentYr();
        }
      })

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
