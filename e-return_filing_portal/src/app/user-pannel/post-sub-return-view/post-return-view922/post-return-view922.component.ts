import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';
import { BasicInfoService } from '../basic-info.service';

@Component({
  selector: 'app-post-return-view922',
  templateUrl: './post-return-view922.component.html',
  styleUrls: ['./post-return-view922.component.css']
})
export class PostReturnView922Component implements OnInit {
  userTin: any;
  salaryReturnViewData: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  basicPay_gross: any;
  basicPay_exempted: any;
  basicPay_taxable: any;

  specialPay_gross: any;
  specialPay_exempted: any;
  specialPay_taxable: any;

  arrearPay_gross: any;
  arrearPay_exempted: any;
  arrearPay_taxable: any;

  dearness_gross: any;
  dearness_exempted: any;
  dearness_taxable: any;

  houseRent_gross: any;
  houseRent_exempted: any;
  houseRent_taxable: any;

  medicalAlw_gross: any;
  medicalAlw_exempted: any;
  medicalAlw_taxable: any;

  conveyanceAlw_gross: any;
  conveyanceAlw_exempted: any;
  conveyanceAlw_taxable: any;

  festivalAlw_gross: any;
  festivalAlw_exempted: any;
  festivalAlw_taxable: any;

  banglaNewYearAlw_gross: any;
  banglaNewYearAlw_exempted: any;
  banglaNewYearAlw_taxable: any;

  leaveAlw_gross: any;
  leaveAlw_exempted: any;
  leaveAlw_taxable: any;

  honorarium_gross: any;
  honorarium_exempted: any;
  honorarium_taxable: any;

  overTimeAlw_gross: any;
  overTimeAlw_exempted: any;
  overTimeAlw_taxable: any;

  tadaAlw_gross: any;
  tadaAlw_exempted: any;
  tadaAlw_taxable: any;

  educationAlw_gross: any;
  educationAlw_exempted: any;
  educationAlw_taxable: any;

  empContributionToRPF_gross: any;
  empContributionToRPF_exempted: any;
  empContributionToRPF_taxable: any;

  interestAccruedOnRPF_gross: any;
  interestAccruedOnRPF_exempted: any;
  interestAccruedOnRPF_taxable: any;

  mobileAlw_gross: any;
  mobileAlw_exempted: any;
  mobileAlw_taxable: any;

  telephoneAlw_gross: any;
  telephoneAlw_exempted: any;
  telephoneAlw_taxable: any;

  entertainmentAlw_gross: any;
  entertainmentAlw_exempted: any;
  entertainmentAlw_taxable: any;

  recreationAlw_gross: any;
  recreationAlw_exempted: any;
  recreationAlw_taxable: any;

  deputationAlw_gross: any;
  deputationAlw_exempted: any;
  deputationAlw_taxable: any;

  chargeAlw_gross: any;
  chargeAlw_exempted: any;
  chargeAlw_taxable: any;

  judicialAlw_gross: any;
  judicialAlw_exempted: any;
  judicialAlw_taxable: any;

  defenseServiceAlw_gross: any;
  defenseServiceAlw_exempted: any;
  defenseServiceAlw_taxable: any;

  transportAlw_gross: any;
  transportAlw_exempted: any;
  transportAlw_taxable: any;

  foreignAlw_gross: any;
  foreignAlw_exempted: any;
  foreignAlw_taxable: any;

  personalPay_gross: any;
  personalPay_exempted: any;
  personalPay_taxable: any;

  gpfInterest_gross: any;
  gpfInterest_exempted: any;
  gpfInterest_taxable: any;

  pension_gross: any;
  pension_exempted: any;
  pension_taxable: any;

  gratuity_gross: any;
  gratuity_exempted: any;
  gratuity_taxable: any;

  retireBenefit_gross: any;
  retireBenefit_exempted: any;
  retireBenefit_taxable: any;

  otherIfny_gross: any;
  otherIfny_exempted: any;
  otherIfny_taxable: any;

  total_gross: any;
  total_exempted: any;
  total_taxable: any;

  taxPayerName: any;
  assessmentYear: any;
  staring_income_yr: any;
  ending_income_yr: any;

  //split assessment yr
  assYr1: any; assYr2: any; assYr3: any; assYr4: any;
  assYr5: any; assYr6: any;

  referenceNo: any;

  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private commaSeparator: CommaSeparatorService,
    private toastr: ToastrService,
    private basicInfo: BasicInfoService,
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
    //get this from local storage
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    this.getTaxpayerBasicInfo();
    this.salaryReturnGetData();
    // this.splitAssessmentYr();
  }

  salaryReturnGetData() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/return-view/salaries')
      .subscribe(result => {
        //  console.log('Salary Return data', result);
        if (result.length > 0) {
          this.salaryReturnViewData = result;
          if (result.IS_BASIC_PAY) {
            result.IS_BASIC_PAY.forEach(element => {
              this.basicPay_gross = element.totalGross;
              this.basicPay_exempted = element.totalExempted;
              this.basicPay_taxable = element.totalTaxable;
            });
          }
          if (result.IS_SPECIAL_PAY) {
            result.IS_SPECIAL_PAY.forEach(element => {
              this.specialPay_gross = element.totalGross;
              this.specialPay_exempted = element.totalExempted;
              this.specialPay_taxable = element.totalTaxable;
            });
          }
          if (result.IS_ARREAR_PAY) {
            result.IS_ARREAR_PAY.forEach(element => {
              this.arrearPay_gross = element.totalGross;
              this.arrearPay_exempted = element.totalExempted;
              this.arrearPay_taxable = element.totalTaxable;
            });
          }
          if (result.IS_DEARNESS_ALW) {
            result.IS_DEARNESS_ALW.forEach(element => {
              this.dearness_gross = element.totalGross;
              this.dearness_exempted = element.totalExempted;
              this.dearness_taxable = element.totalTaxable;
            });
          }
          if (result.IS_HOUSE_RENT_ALW) {
            result.IS_HOUSE_RENT_ALW.forEach(element => {
              this.houseRent_gross = element.totalGross;
              this.houseRent_exempted = element.totalExempted;
              this.houseRent_taxable = element.totalTaxable;
            });
          }
          if (result.IS_MEDICAL_ALW) {
            result.IS_MEDICAL_ALW.forEach(element => {
              this.medicalAlw_gross = element.totalGross;
              this.medicalAlw_exempted = element.totalExempted;
              this.medicalAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_CONVEYANCE_ALW) {
            result.IS_CONVEYANCE_ALW.forEach(element => {
              this.conveyanceAlw_gross = element.totalGross;
              this.conveyanceAlw_exempted = element.totalExempted;
              this.conveyanceAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_FESTIVAL_BONUS) {
            result.IS_FESTIVAL_BONUS.forEach(element => {
              this.festivalAlw_gross = element.totalGross;
              this.festivalAlw_exempted = element.totalExempted;
              this.festivalAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_BANGLA_NEW_YEAR_ALW) {
            result.IS_BANGLA_NEW_YEAR_ALW.forEach(element => {
              this.banglaNewYearAlw_gross = element.totalGross;
              this.banglaNewYearAlw_exempted = element.totalExempted;
              this.banglaNewYearAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_LEAVE_ALW) {
            result.IS_LEAVE_ALW.forEach(element => {
              this.leaveAlw_gross = element.totalGross;
              this.leaveAlw_exempted = element.totalExempted;
              this.leaveAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_HONORARIUM_REWARD_FEE) {
            result.IS_HONORARIUM_REWARD_FEE.forEach(element => {
              this.honorarium_gross = element.totalGross;
              this.honorarium_exempted = element.totalExempted;
              this.honorarium_taxable = element.totalTaxable;
            });
          }
          if (result.IS_OVERTIME_ALW) {
            result.IS_OVERTIME_ALW.forEach(element => {
              this.overTimeAlw_gross = element.totalGross;
              this.overTimeAlw_exempted = element.totalExempted;
              this.overTimeAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_TADA_NOT_EXPENDED) {
            result.IS_TADA_NOT_EXPENDED.forEach(element => {
              this.tadaAlw_gross = element.totalGross;
              this.tadaAlw_exempted = element.totalExempted;
              this.tadaAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_EDUCATION_ALW) {
            result.IS_EDUCATION_ALW.forEach(element => {
              this.educationAlw_gross = element.totalGross;
              this.educationAlw_exempted = element.totalExempted;
              this.educationAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_EMP_CONTRIBUTION_RPF) {
            result.IS_EMP_CONTRIBUTION_RPF.forEach(element => {
              this.empContributionToRPF_gross = element.totalGross;
              this.empContributionToRPF_exempted = element.totalExempted;
              this.empContributionToRPF_taxable = element.totalTaxable;
            });
          }
          if (result.IS_INTEREST_ACCRUED_RPF) {
            result.IS_INTEREST_ACCRUED_RPF.forEach(element => {
              this.interestAccruedOnRPF_gross = element.totalGross;
              this.interestAccruedOnRPF_exempted = element.totalExempted;
              this.interestAccruedOnRPF_taxable = element.totalTaxable;
            });
          }
          if (result.IS_MOBILE_ALW) {
            result.IS_MOBILE_ALW.forEach(element => {
              this.mobileAlw_gross = element.totalGross;
              this.mobileAlw_exempted = element.totalExempted;
              this.mobileAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_RESIDENTIAL_TELEPHN_ALW) {
            result.IS_RESIDENTIAL_TELEPHN_ALW.forEach(element => {
              this.telephoneAlw_gross = element.totalGross;
              this.telephoneAlw_exempted = element.totalExempted;
              this.telephoneAlw_taxable = element.totalTaxable;
            });
          }

          if (result.IS_ENTERTAINMENT_ALW) {
            result.IS_ENTERTAINMENT_ALW.forEach(element => {
              this.entertainmentAlw_gross = element.totalGross;
              this.entertainmentAlw_exempted = element.totalExempted;
              this.entertainmentAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_REST_RECREATION_ALW) {
            result.IS_REST_RECREATION_ALW.forEach(element => {
              this.recreationAlw_gross = element.totalGross;
              this.recreationAlw_exempted = element.totalExempted;
              this.recreationAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_DEPUTATION_ALW) {
            result.IS_DEPUTATION_ALW.forEach(element => {
              this.deputationAlw_gross = element.totalGross;
              this.deputationAlw_exempted = element.totalExempted;
              this.deputationAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_CHARGE_ALW) {
            result.IS_CHARGE_ALW.forEach(element => {
              this.chargeAlw_gross = element.totalGross;
              this.chargeAlw_exempted = element.totalExempted;
              this.chargeAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_JUDICIAL_ALW) {
            result.IS_JUDICIAL_ALW.forEach(element => {
              this.judicialAlw_gross = element.totalGross;
              this.judicialAlw_exempted = element.totalExempted;
              this.judicialAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_DEFENSE_SERVICE_ALW) {
            result.IS_DEFENSE_SERVICE_ALW.forEach(element => {
              this.defenseServiceAlw_gross = element.totalGross;
              this.defenseServiceAlw_exempted = element.totalExempted;
              this.defenseServiceAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_TRANSPORT_MAINTENANCE_ALW) {
            result.IS_TRANSPORT_MAINTENANCE_ALW.forEach(element => {
              this.transportAlw_gross = element.totalGross;
              this.transportAlw_exempted = element.totalExempted;
              this.transportAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_FOREIGN_ALW) {
            result.IS_FOREIGN_ALW.forEach(element => {
              this.foreignAlw_gross = element.totalGross;
              this.foreignAlw_exempted = element.totalExempted;
              this.foreignAlw_taxable = element.totalTaxable;
            });
          }
          if (result.IS_PERSONAL_PAY) {
            result.IS_PERSONAL_PAY.forEach(element => {
              this.personalPay_gross = element.totalGross;
              this.personalPay_exempted = element.totalExempted;
              this.personalPay_taxable = element.totalTaxable;
            });
          }
          if (result.IS_GPF_INTEREST) {
            result.IS_GPF_INTEREST.forEach(element => {
              this.gpfInterest_gross = element.totalGross;
              this.gpfInterest_exempted = element.totalExempted;
              this.gpfInterest_taxable = element.totalTaxable;
            });
          }
          if (result.IS_PENSION) {
            result.IS_PENSION.forEach(element => {
              this.pension_gross = element.totalGross;
              this.pension_exempted = element.totalExempted;
              this.pension_taxable = element.totalTaxable;
            });
          }
          if (result.IS_GRATUITY) {
            result.IS_GRATUITY.forEach(element => {
              this.gratuity_gross = element.totalGross;
              this.gratuity_exempted = element.totalExempted;
              this.gratuity_taxable = element.totalTaxable;
            });
          }
          if (result.IS_OTHER_RETIREMENT_BENEFITS) {
            result.IS_OTHER_RETIREMENT_BENEFITS.forEach(element => {
              this.retireBenefit_gross = element.totalGross;
              this.recreationAlw_exempted = element.totalExempted;
              this.retireBenefit_taxable = element.totalTaxable;
            });
          }
          if (result.IS_OTHER_INCOME_VALUE) {
            result.IS_OTHER_INCOME_VALUE.forEach(element => {
              this.otherIfny_gross = element.totalGross;
              this.otherIfny_exempted = element.totalExempted;
              this.otherIfny_taxable = element.totalTaxable;
            });
          }
          if (result.IS_SUM) {
            result.IS_SUM.forEach(element => {
              this.total_gross = element.totalGross;
              this.total_exempted = element.totalExempted;
              this.total_taxable = element.totalTaxable;
            });
          }
        }
      },
        error => {
          //  console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage,);
        });
  }

  addComma(input: any): any {
    return this.commaSeparator.currencySeparatorBD(input);
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
