import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';

@Component({
  selector: 'app-return-view-it10-bb20167',
  templateUrl: './return-view-it10-bb20167.component.html',
  styleUrls: ['./return-view-it10-bb20167.component.css']
})
export class ReturnViewIT10BB20167Component implements OnInit {

  userTin: any;
  taxPayerName: any;

  expenditureGetData: any;
  expenditureGetDataReqBody: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  defaultTodaysDate = new Date();
  defaultDateInString: any;

  //default date
  mm1: any; mm2: any; dd1: any; dd2: any;
  yy1: any; yy2: any; yy3: any; yy4: any;

  food_exp_amt: any;
  food_exp_cmt: any;

  house_exp_amt: any;
  house_exp_cmt: any;

  te_driver_salary_fuel_maintenance_amt: any;
  te_driver_salary_fuel_maintenance_cmt: any;
  te_others_transportation_amt: any;
  te_others_transportation_cmt: any;

  auto_and_transportation_expenses_amt: any;
  auto_and_transportation_expenses_cmt: any;

  hue_electricity_amt: any;
  hue_electricity_cmt: any;
  hue_gas_water_sewer_garbage_amt: any;
  hue_gas_water_sewer_garbage_cmt: any;
  hue_home_support_stuff_other_expense_amt: any;
  hue_home_support_stuff_other_expense_cmt: any;
  hue_phone_internet_tvchannel_sub_amt: any;
  hue_phone_internet_tvchannel_sub_cmt: any;

  hue_expenses_amt: any;
  hue_expenses_cmt: any;

  child_edu_exp_amt: any;
  child_edu_exp_cmt: any;

  se_festival_party_expenses_amt: any;
  se_festival_party_expenses_cmt: any;
  se_domestic_overseas_tour_holiday_amt: any;
  se_domestic_overseas_tour_holiday_cmt: any;
  se_philan_thropy_amt: any;
  se_philan_thropy_cmt: any;
  se_other_social_expenses_amt: any;
  se_other_social_expenses_cmt: any;

  se_expenses_amt: any;
  se_expenses_cmt: any;

  other_exp_amt: any;
  other_exp_cmt: any;

  total_expenses_relatingTo_lifestyle_amt: any;

  total_expenses_relatingTo_lifestyle_amount: any;
  total_expenses_relatingTo_lifestyle_comment: any;

  tcp_payment_of_tax_at_source_amt: any;
  tcp_payment_of_tax_at_source_cmt: any;

  payment_of_taxsurcharge_OrOther_amt: any;
  payment_of_taxsurcharge_OrOther_cmt: any;

  payment_of_tax_charges_etc_amt: any;
  payment_of_tax_charges_etc_cmt: any;

  expense_tax_total_amt: any;

  total_amount_of_expense_and_tax_amt: any;
  total_amount_of_expense_and_tax_cmt: any;

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
    private datepipe: DatePipe,
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
    // this.taxPayerName = localStorage.getItem('name');

    // console.log('todays date',this.defaultTodaysDate);
    this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd-MM-yyyy');
    // console.log('text date', this.defaultDateInString);

    this.getExpenditureReturnViewData();
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    // this.getStatementOnDate();
    // this.splitAssessmentYr();
    this.getTaxpayerBasicInfo();
  }

  getExpenditureReturnViewData() {
    this.expenditureGetDataReqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/management/return-view/get_expendsummary', this.expenditureGetDataReqBody)
      .subscribe(result => {
        // console.log(result);
        // console.log(result.replyMessage);
        if (JSON.stringify(result.replyMessage) != '{}') {
          // console.log(result);
          this.expenditureGetData = result['replyMessage'];
          console.log('expenditureGetData:', this.expenditureGetData);

          this.expenditureGetData.Food_Cloth_Expense.forEach(element => {
            this.food_exp_amt = element.Food_Cloth_Expense_Amount;
            this.food_exp_cmt = element.Food_Cloth_Expense_Comment;
          });
          this.expenditureGetData.House_Expense.forEach(element => {
            this.house_exp_amt = element.House_Expense_Amount;
            this.house_exp_cmt = element.House_Expense_Comment;
          });
          this.expenditureGetData.Transportation_Expense.forEach(element => {
            this.te_driver_salary_fuel_maintenance_amt = element.TE_Driver_Salary_Fuel_Maintenance_Amount;
            this.te_driver_salary_fuel_maintenance_cmt = element.TE_Driver_Salary_Fuel_Maintenance_Comment;
            this.te_others_transportation_amt = element.TE_Others_Transportation_Amount;
            this.te_others_transportation_cmt = element.TE_Others_Transportation_Comment;
          });

          this.auto_and_transportation_expenses_amt = Math.round(this.te_driver_salary_fuel_maintenance_amt) + Math.round(this.te_others_transportation_amt);
          this.auto_and_transportation_expenses_cmt = this.te_driver_salary_fuel_maintenance_cmt + "," + this.te_others_transportation_cmt;

          this.expenditureGetData.Household_Utility_Expense.forEach(element => {
            this.hue_electricity_amt = element.HUE_Electricity_Amount;
            this.hue_electricity_cmt = element.HUE_Electricity_Comment;
            this.hue_gas_water_sewer_garbage_amt = element.HUE_Gas_Water_Sewer_Garbage_Amount;
            this.hue_gas_water_sewer_garbage_cmt = element.HUE_Gas_Water_Sewer_Garbage_Comment;
            this.hue_home_support_stuff_other_expense_amt = element.HUE_Home_Support_Stuff_Other_Expense_Amount;
            this.hue_home_support_stuff_other_expense_cmt = element.HUE_Home_Support_Stuff_Other_Expense_Comment;
            this.hue_phone_internet_tvchannel_sub_amt = element.HUE_Phone_Internet_TVChannel_Sub_Amount;
            this.hue_phone_internet_tvchannel_sub_cmt = element.HUE_Phone_Internet_TVChannel_Sub_Comment;
          });

          this.hue_expenses_amt = Math.round(this.hue_electricity_amt) + Math.round(this.hue_gas_water_sewer_garbage_amt) + Math.round(this.hue_phone_internet_tvchannel_sub_amt) + Math.round(this.hue_home_support_stuff_other_expense_amt);
          this.hue_expenses_cmt = this.hue_electricity_cmt + "," + this.hue_gas_water_sewer_garbage_cmt + "," + this.hue_phone_internet_tvchannel_sub_cmt + "," + this.hue_home_support_stuff_other_expense_cmt;

          this.expenditureGetData.Child_Edu_Expense.forEach(element => {
            this.child_edu_exp_amt = element.Child_Edu_Expense_Amount;
            this.child_edu_exp_cmt = element.Child_Edu_Expense_Comment;
          });
          this.expenditureGetData.Special_Expense.forEach(element => {
            this.se_festival_party_expenses_amt = element.SE_Festival_Party_Expenses_Amount;
            this.se_festival_party_expenses_cmt = element.SE_Festival_Party_Expenses_Comment;
            this.se_domestic_overseas_tour_holiday_amt = element.SE_Domestic_Overseas_Tour_Holiday_Amount;
            this.se_domestic_overseas_tour_holiday_cmt = element.SE_Domestic_Overseas_Tour_Holiday_Comment;
            this.se_philan_thropy_amt = element.SE_Philan_Thropy_Amount;
            this.se_philan_thropy_cmt = element.SE_Philan_Thropy_Comment;
            this.se_other_social_expenses_amt = element.SE_Other_Social_Expenses_Amount;
            this.se_other_social_expenses_cmt = element.SE_Other_Social_Expenses_Comment;

          });

          this.se_expenses_amt = Math.round(this.se_festival_party_expenses_amt) + Math.round(this.se_domestic_overseas_tour_holiday_amt)
            + Math.round(this.se_philan_thropy_amt) + Math.round(this.se_other_social_expenses_amt);
          this.se_expenses_cmt = this.se_festival_party_expenses_cmt + "," + this.se_domestic_overseas_tour_holiday_cmt + "," + this.se_philan_thropy_cmt + "," + this.se_other_social_expenses_cmt;

          this.expenditureGetData.Other_Expense.forEach(element => {
            this.other_exp_amt = element.Other_Expense_Amount;
            this.other_exp_cmt = element.Other_Expense_Comment;
          });

          this.total_expenses_relatingTo_lifestyle_amount = Math.round(this.food_exp_amt) + Math.round(this.house_exp_amt) + Math.round(this.auto_and_transportation_expenses_amt)
            + Math.round(this.hue_expenses_amt) + Math.round(this.child_edu_exp_amt) + Math.round(this.se_expenses_amt) + Math.round(this.other_exp_amt);

          this.total_expenses_relatingTo_lifestyle_comment = this.food_exp_cmt + "," + this.house_exp_cmt + "," + this.auto_and_transportation_expenses_cmt
            + "," + this.hue_expenses_cmt + "," + this.child_edu_exp_cmt + "," + this.se_expenses_cmt +"," + this.other_exp_cmt;

          this.expenditureGetData.Lifestyle_Total_Expense.forEach(element => {
            this.total_expenses_relatingTo_lifestyle_amt = element.Total_Expenses_RelatingTo_LifeStyle_Amount;
          });
          this.expenditureGetData.Tax_Charge_Payment.forEach(element => {
            this.tcp_payment_of_tax_at_source_amt = element.TCP_Payment_Of_Tax_At_Source_Amount;
            this.tcp_payment_of_tax_at_source_cmt = element.TCP_Payment_Of_Tax_At_Source_Comment;
          });
          this.expenditureGetData.Tax_Surcharge_Payment.forEach(element => {
            this.payment_of_taxsurcharge_OrOther_amt = element.Payment_Of_TaxSurcharge_OrOther_Amount;
            this.payment_of_taxsurcharge_OrOther_cmt = element.Payment_Of_TaxSurcharge_OrOther_Comment;
          });

          this.payment_of_tax_charges_etc_amt= Math.round(this.tcp_payment_of_tax_at_source_amt) + Math.round(this.payment_of_taxsurcharge_OrOther_amt);
          this.payment_of_tax_charges_etc_cmt= this.tcp_payment_of_tax_at_source_cmt + "," + this.payment_of_taxsurcharge_OrOther_cmt;

          this.expenditureGetData.Expense_Tax_Total.forEach(element => {
            this.expense_tax_total_amt = element.Expense_Tax_Total_Amount;
          });

          this.total_amount_of_expense_and_tax_amt= Math.round(this.total_expenses_relatingTo_lifestyle_amount) + Math.round(this.payment_of_tax_charges_etc_amt);
          this.total_amount_of_expense_and_tax_cmt= this.total_expenses_relatingTo_lifestyle_comment + "," + this.payment_of_tax_charges_etc_cmt;
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }
 
  addComma(inputString : any):any{
    return this.commaSeparator.currencySeparatorBD(inputString);
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
          this.ending_income_yr = result.replyMessage.endOfIncomeYr;
          this.referenceNo = result.replyMessage.referenceNo;
          this.splitAssessmentYr();
          this.getStatementOnDate();
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
  getStatementOnDate()
  {
    //day
    this.dd1 = this.ending_income_yr.substring(0, 1);
    this.dd2 = this.ending_income_yr.substring(1, 2);
    //month
    this.mm1 = this.ending_income_yr.substring(3, 4);
    this.mm2 = this.ending_income_yr.substring(4, 5);
    //year
    this.yy1 = this.ending_income_yr.substring(6, 7);
    this.yy2 = this.ending_income_yr.substring(7, 8);
    this.yy3 = this.ending_income_yr.substring(8, 9);
    this.yy4 = this.ending_income_yr.substring(9, 10);
  }

}
