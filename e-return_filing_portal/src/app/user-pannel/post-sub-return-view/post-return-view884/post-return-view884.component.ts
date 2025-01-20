import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';
import { BasicInfoService } from '../basic-info.service';

@Component({
  selector: 'app-post-return-view884',
  templateUrl: './post-return-view884.component.html',
  styleUrls: ['./post-return-view884.component.css']
})
export class PostReturnView884Component implements OnInit {
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  taxPayerName: any;
  //#region Business Return View Data
  sales_turnover_receipt: any;
  grossProfit: any;
  gen_Ad_sel_otr: any;
  netProfit_Income: any;
  cashInHand: any;
  inventories: any;
  fixedAsset: any;
  otherAsset: any;
  totalAsset: any;
  openingCapital: any;
  netProfit_BalanceSheet: any;
  withdrawalsIncomeYr: any;
  closingCapital: any;
  liabilities: any;
  totalCapitalAndLiabilities: any;
  getBusinessData: any;
  storeBusinessData = [];
  businessObj: any;
  taxExemptedData: any;
  //#endregion

  assessmentYear: any;
  staring_income_yr: any;
  ending_income_yr: any;
  //split assessment yr
  assYr1: any; assYr2: any; assYr3: any; assYr4: any;
  assYr5: any; assYr6: any;

  referenceNo: any;

  constructor(
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private datepipe: DatePipe,
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
    this.getBusinessReturnView();
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    // this.splitAssessmentYr();
    this.getTaxpayerBasicInfo();
  }

  getBusinessReturnView() {

    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/business')
      .subscribe(result => {
        this.getBusinessData = result.data;
        this.getBusinessData.forEach(element => {
          this.businessObj = {
            "typeOfBusines": this.getBusinessCategoryName(element.businessCatg),
            "businessName": element.businessNm,
            "businessAddress": element.businessAddress,
            "sales_turnover_receipt": this.commaSeparator.currencySeparatorBD(element.salesTurnReceipts),
            "grossProfit": this.commaSeparator.currencySeparatorBD(element.grossProfit),
            "gen_Ad_sel_otr": this.commaSeparator.currencySeparatorBD(element.gasoExpenses),
            "netProfit_Income": this.commaSeparator.currencySeparatorBD(element.netProfit),
            "cashInHand": this.commaSeparator.currencySeparatorBD(element.cashHandBank),
            "inventories": this.commaSeparator.currencySeparatorBD(element.inventories),
            "fixedAsset": this.commaSeparator.currencySeparatorBD(element.fixedAssets),
            "otherAsset": this.commaSeparator.currencySeparatorBD(element.otherAssets),
            "totalAsset": this.commaSeparator.currencySeparatorBD(element.totalAssets),
            "openingCapital": this.commaSeparator.currencySeparatorBD(element.openingCp),
            "netProfit_BalanceSheet": this.commaSeparator.currencySeparatorBD(element.netProfit),
            "withdrawalsIncomeYr": this.commaSeparator.currencySeparatorBD(element.withdrawalsIncmYr),
            "closingCapital": this.commaSeparator.currencySeparatorBD(element.closingCp),
            "liabilities": this.commaSeparator.currencySeparatorBD(element.liabilities),
            "totalCapitalAndLiabilities": this.commaSeparator.currencySeparatorBD(element.totalCpLb),
          }
          this.storeBusinessData.push(this.businessObj);
        });
      });

    this.getBusinessDataFromExemptedIncome();
  }

  getBusinessDataFromExemptedIncome() {
    let reqObj =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    }
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-tax-exempted-income')
      .subscribe(result => {
        this.taxExemptedData = result.Data;
    //    console.log('tax exempted data post sub', this.taxExemptedData);
        this.taxExemptedData.forEach((element, index) => {
          if (element.TEI_TYPE === "software_and_it_business" || element.TEI_TYPE === "export_of_handicrafts") {
            this.businessObj = {
              "typeOfBusines": this.getBusinessCategoryName(element.TEI_TYPE),
              "businessName": element.TEI_BUSINESS_NAME,
              "businessAddress": element.TEI_BUSINESS_ADDRESS,
              "sales_turnover_receipt": this.commaSeparator.currencySeparatorBD(element.TEI_SALES_TURNOVER_RECEIPTS),
              "grossProfit": this.commaSeparator.currencySeparatorBD(element.TEI_GROSS_PROFIT),
              "gen_Ad_sel_otr": this.commaSeparator.currencySeparatorBD(element.TEI_GENERAL_ADMIN_IS_SELLING_AND_OTHER),
              "netProfit_Income": this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME),
              "cashInHand": this.commaSeparator.currencySeparatorBD(element.TEI_CASH_IN_HAND_AND_AT_BANK),
              "inventories": this.commaSeparator.currencySeparatorBD(element.TEI_INVENTORIES),
              "fixedAsset": this.commaSeparator.currencySeparatorBD(element.TEI_FIXED_ASSETS),
              "otherAsset": this.commaSeparator.currencySeparatorBD(element.TEI_OTHER_ASSETS),
              "totalAsset": this.commaSeparator.currencySeparatorBD(element.TEI_TOTAL_ASSETS),
              "openingCapital": this.commaSeparator.currencySeparatorBD(element.TEI_OPENING_CAPITAL),
              "netProfit_BalanceSheet": this.commaSeparator.currencySeparatorBD(element.TEI_NET_PROFIT_2),
              "withdrawalsIncomeYr": this.commaSeparator.currencySeparatorBD(element.TEI_WITHDRAWAL_INCOME_YEAR),
              "closingCapital": this.commaSeparator.currencySeparatorBD(element.TEI_CLOSING_CAPITAL),
              "liabilities": this.commaSeparator.currencySeparatorBD(element.TEI_LIABILITIES),
              "totalCapitalAndLiabilities": this.commaSeparator.currencySeparatorBD(element.TEI_TOTAL_CAPITAL_AND_LIABILITIES),
            }
            this.storeBusinessData.push(this.businessObj);
          }
        });
      })
  }

  getBusinessCategoryName(businessCategoryType: any) {
    if (businessCategoryType === 'REG_BUS_PROF') return 'Regular Business/Profession';
    else if (businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY') return 'Contract or Supply of Goods';
    else if (businessCategoryType === 'BSMT_REAL_EST_OR_LAND') return 'Real Estate or Land Development Business';
    else if (businessCategoryType === 'BSMT_IMPORT') return 'Import';
    else if (businessCategoryType === 'BSMT_EXP_OF_MAN') return 'Export of Manpower';
    else if (businessCategoryType === 'BSMT_EXP_US_53BB') return 'Export (u/s 53BB)';
    else if (businessCategoryType === 'BSMT_EXP_US_53BBBB') return 'Export (U/S 53BBBB)';
    else if (businessCategoryType === 'BSMT_EXP_CASH_SUB') return 'Export Cash Subsidy';
    else if (businessCategoryType === 'BSMT_C_F_AGEN') return 'C & F Agency';
    else if (businessCategoryType === 'BSMT_DSTR_OF_COMP') return 'Distributorship of Company';
    else if (businessCategoryType === 'BSMT_AGEN_FOREIGN_BUYER') return 'Agency of Foreign Buyer';
    else if (businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX') return 'Other Business Subject to Minimum Tax';
    else if (businessCategoryType === 'TOBACCO_BUS') return 'Tobacco Business';
    else if (businessCategoryType === 'TEA_RUB') return 'Product of Tea or Rubber';
    else if (businessCategoryType === 'EXEMPT_OR_REDUCED_SRO') return 'Income Exempted or at Reduced Tax Rate by SRO';
    else if (businessCategoryType === 'software_and_it_business') return 'Software and IT Business';
    else if (businessCategoryType === 'export_of_handicrafts') return 'Export of Handicrafts';
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
