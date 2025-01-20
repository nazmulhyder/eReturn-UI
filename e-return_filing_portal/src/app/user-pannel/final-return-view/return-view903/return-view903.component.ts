import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';

@Component({
  selector: 'app-return-view903',
  templateUrl: './return-view903.component.html',
  styleUrls: ['./return-view903.component.css']
})
export class ReturnView903Component implements OnInit {
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  getHpData: any;
  taxPayerName: any;
  storeHPData = [];
  hpObj: any;
  totalIncomeFromHP: any = 0;

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
    private commaSeparator: CommaSeparatorService
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
    this.getHPReturnView();
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    this.getTaxpayerBasicInfo();
  }

  getHPReturnView() {
    this.hpObj =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-house-property-data')
      .subscribe(result => {
        this.getHpData = result;
       // console.log('hp return view', this.getHpData);
        let temp_calcTotalFinalTotal = 0;

        this.getHpData.forEach(element => {
          let obj = {
            "desOfProperty": element.housePropertyType,
            "addressOfProperty": element.housePropertyAddress,
            "totalArea": this.commaSeparator.currencySeparatorBD(element.totalArea),
            "shareOfAsessee": element.shareOfOwnership,
            "annualValue": this.commaSeparator.currencySeparatorBD(element.totalAnnualRent),
            "deductions": this.commaSeparator.currencySeparatorBD(element.totalDeduction),
            "repairCollection": this.commaSeparator.currencySeparatorBD(element.repairCollection),
            "municipalLocalTax": this.commaSeparator.currencySeparatorBD(element.municipalLocalTax),
            "landRev": this.commaSeparator.currencySeparatorBD(element.landRevenue),
            "interestOnLoan": this.commaSeparator.currencySeparatorBD(element.interestOnLoanMortgage),
            "insurancePremium": this.commaSeparator.currencySeparatorBD(element.insurancePremium),
            "vacancyAlw": this.commaSeparator.currencySeparatorBD(element.vacancyAllowance),
            "OthrIfAny": this.commaSeparator.currencySeparatorBD(element.other),
            "incomeFromHP": this.commaSeparator.currencySeparatorBD((element.totalAnnualRent - element.totalDeduction)),
            "partialOwnershipShare": this.commaSeparator.currencySeparatorBD(element.finalTotal)
          }
          temp_calcTotalFinalTotal += parseInt(element.finalTotal);
          this.totalIncomeFromHP = this.commaSeparator.currencySeparatorBD(temp_calcTotalFinalTotal);
          // console.log('totalIncomeFromHP',this.totalIncomeFromHP);
          this.storeHPData.push(obj);
        });
      })
  }

  getTaxpayerBasicInfo() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.assessmentYear = result.replyMessage.assessmentYear;
          this.taxPayerName = result.replyMessage.assesName;
          this.referenceNo = result.replyMessage.referenceNo;
          this.splitAssessmentYr();
        }
      })

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
