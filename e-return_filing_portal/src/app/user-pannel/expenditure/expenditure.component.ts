import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";
import { CommaSeparatorService } from "../../service/comma-separator.service";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { HeadsOfIncomeService } from "../heads-of-income.service";

@Component({
  selector: "app-expenditure",
  templateUrl: "./expenditure.component.html",
  styleUrls: ["./expenditure.component.css"],
})
export class ExpenditureComponent implements OnInit {
  headsOfIncome = [];
  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};
  lengthOfheads: any;
  isSaveDraft: boolean = false;

  isAutoTransportationCollapsed = false;
  isHouseholdUtilityCollapsed = false;
  isSpecialExpensesCollapsed = false;

  expenseFoodClothingAmt: any = 0;
  housingExpenseAmt: any = 0;
  driverSalaryFuelMaintanceAmt: any = 0;
  otherTransportationAmt: any = 0;
  electricityAmt: any = 0;
  gasWaterSewerGurbageAmt: any = 0;
  phoneInternetTVChannelSubAmt: any = 0;
  homeSupportStuffandOtherExpensesAmt: any = 0;
  childrensEducationExpensesAmt: any = 0;
  festivalPartyExpensesAmt: any = 0;
  domesticOverseasTourHolidayAmt: any = 0;
  philanthropyAmt: any = 0;
  otherSocialExpensesAmt: any = 0;
  anyOtherExpensesAmt: any = 0;
  totalExpensesRelatingToLifeStyleAmt: any = 0;
  paymentOfTaxAtSourceAmt: any = 0;
  paymentOfTaxSurchargeOrOtherAmt: any = 0;
  totalAmountOfExpenseAndTaxAmt: any = 0;

  requestData: any;
  userTin: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  expenditureData: any;
  expenditureGetDataReqBody: any;

  requestIncomeHeadGetData: any;
  requestNavbarGetData: any;
  formGroup: FormGroup;
  additionalInformationForm: FormGroup;
  hasAnyIncome: boolean = false;
  isIT10BMandatory: boolean = true;
  isTickSalOrBus: boolean = false;
  isIncomeExceed4Lakhs: boolean = true;
  isShareHolderDir: boolean = true;
  isShareHolderDir_Sal: boolean = true;
  load_IT10BRegion: boolean = false;
  tmp_isIT10BMandatory: boolean = false;

  //for validation
  expenditureValidation_ShowError: boolean = false;
  isShow: boolean = true;
  constructor(
    private fb: FormBuilder,
    private mainNavbarList: mainNavbarListService,
    private router: Router,
    private toastr: ToastrService,
    private headService: HeadsOfIncomeService,
    apiService: ApiService,
    private spinner: NgxUiLoaderService,
    apiUrl: ApiUrl,
    private commaSeparator: CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  mainNavActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.mainNavActive = x;
  }

  expenditureForm = new FormGroup({
    expenseFoodClothingAmt: new FormControl(),
    expenseFoodClothingCmt: new FormControl(''),
    housingExpenseAmt: new FormControl(),
    housingExpenseCmt: new FormControl(''),
    driverSalaryFuelMaintanceAmt: new FormControl(),
    driverSalaryFuelMaintanceCmt: new FormControl(''),
    otherTransportationAmt: new FormControl(),
    otherTransportationCmt: new FormControl(''),
    electricityAmt: new FormControl(),
    electricityCmt: new FormControl(''),
    gasWaterSewerGurbageAmt: new FormControl(),
    gasWaterSewerGurbageCmt: new FormControl(''),
    phoneInternetTVChannelSubAmt: new FormControl(),
    phoneInternetTVChannelSubCmt: new FormControl(''),
    homeSupportStuffandOtherExpensesAmt: new FormControl(),
    homeSupportStuffandOtherExpensesCmt: new FormControl(''),
    childrensEducationExpensesAmt: new FormControl(),
    childrensEducationExpensesCmt: new FormControl(''),
    festivalPartyExpensesAmt: new FormControl(),
    festivalPartyExpensesCmt: new FormControl(''),
    domesticOverseasTourHolidayAmt: new FormControl(),
    domesticOverseasTourHolidayCmt: new FormControl(''),
    philanthropyAmt: new FormControl(),
    philanthropyCmt: new FormControl(''),
    otherSocialExpensesAmt: new FormControl(),
    otherSocialExpensesCmt: new FormControl(''),
    anyOtherExpensesAmt: new FormControl(),
    anyOtherExpensesCmt: new FormControl(''),
    totalExpensesRelatingToLifeStyleAmt: new FormControl(),
    paymentOfTaxAtSourceAmt: new FormControl(),
    paymentOfTaxAtSourceCmt: new FormControl(''),
    paymentOfTaxSurchargeOrOtherAmt: new FormControl(),
    paymentOfTaxSurchargeOrOtherCmt: new FormControl(''),
    totalAmountOfExpenseAndTaxAmt: new FormControl(),
    chkIT10B: new FormControl('1'),

    auto_and_Transportation_Expenses_Sum: new FormControl(),
    household_and_Utility_Expenses_Sum: new FormControl(),
    special_Expenses_Sum: new FormControl(),
  });

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.getHeadsOfIncome();
    this.getMainNavbar();
    this.mainNavActiveSelect('4');
    this.userTin = localStorage.getItem('tin');

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    //#endregion

    // previous
    // this.getExpenditureData();
    // this.loadIT10BRegion();

    //new
    this.checkSubmissionStatus();
    this.getExpenditureData()
      .then(() => this.loadIT10BRegion());
     
  }

  loadAll_incomeHeads_on_Page_reload() {
    // get all selected income heads
    let allIncomeHeadsData: any;
    let getOnlyIncomeHeads = [];
    this.formGroup = this.fb.group({
      anyIncome: new FormControl('1'),
      residentStatus: new FormControl('1'),
      others: [false],
      capital: [false],
      businessProfession: [false],
      agriculture: [false],
      houseProperty: [false],
      security: [false],
      salaries: [false],
      firm: [false],
      aop: [false],
      outsideIncome: [false],
      spouseChild: [false],
      taxExemptedIncome: [false],
    });
    this.requestIncomeHeadGetData =
    {
      "tinNo": this.userTin
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-selected-income-heads')
      .subscribe(result => {
        allIncomeHeadsData = result;
        allIncomeHeadsData.forEach(element => {
          getOnlyIncomeHeads.push(element.incomeSourceType);
        });

        getOnlyIncomeHeads.forEach(element => {
          if (element.incomeSourceTypeId === 1 && element.active) {
            this.isTickSalOrBus = true;
            this.formGroup.controls.salaries.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 2 && element.active) {
            this.formGroup.controls.security.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 3 && element.active) {
            this.formGroup.controls.houseProperty.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 4 && element.active) {
            this.formGroup.controls.agriculture.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 5 && element.active) {
            this.isTickSalOrBus = true;
            this.formGroup.controls.businessProfession.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 6 && element.active) {
            this.formGroup.controls.capital.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 7 && element.active) {
            this.formGroup.controls.others.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 8 && element.active) {
            this.formGroup.controls.firm.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 9 && element.active) {
            this.formGroup.controls.aop.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 10 && element.active) {
            this.formGroup.controls.outsideIncome.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 11 && element.active) {
            this.formGroup.controls.spouseChild.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          else if (element.incomeSourceTypeId === 12 && element.active) {
            this.formGroup.controls.taxExemptedIncome.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
          }
          this.headsOfIncome = this.headService.getHeads();
          // this.lengthOfheads = this.headsOfIncome.length;
        });
      });
    this.loadAll_navbar_on_Page_reload();
  }

  loadAll_navbar_on_Page_reload() {
    // this.mainNavActiveSelect('2');
    let getAdditional_info_data: any;
    this.additionalInformationForm = new FormGroup({
      returnSchemeType: new FormControl('0'),
      isWarWoundedGazettedFreedomFighter: new FormControl(false),
      gazetteNo: new FormControl(""),
      isPersonWithDisability: new FormControl(false),
      referenceNo: new FormControl(""),
      referenceDate: new FormControl(""),
      isClaimBenefitAsAParent: new FormControl(false),
      nameOfTheChild: new FormControl(""),
      disabilityReferenceNo: new FormControl(""),
      dateDisability: new FormControl(""),
      isInvestmentforTaxRebate: new FormControl("0"),
      isIncomeExceeding4Lakhs: new FormControl("1"),
      isShareholderDirectorofCompany: new FormControl("0"),
      isGrossWealthOver4Lakhs: new FormControl("1"),
      isOwnmotorCar: new FormControl("0"),
      isHaveHouseProperty: new FormControl("0"),
      isIT10BNotMandatory: new FormControl("1"),
      amountOfGrossWealth: new FormControl(""),
    });
    //get additional-information data
    this.requestNavbarGetData =
    {
      "tinNo": this.userTin
    };

    this.apiService.get(this.serviceUrl + 'api/user-panel/get-assessment-additional-info')
      .subscribe(result => {
        getAdditional_info_data = result;
        if (getAdditional_info_data != null) {
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue(getAdditional_info_data.anyTaxRebate == true ? '1' : '0');
          this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue(getAdditional_info_data.incomeExceedFourLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue(getAdditional_info_data.shareholder == true ? '1' : '0');
          this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue(getAdditional_info_data.grossWealthOverFortyLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isOwnmotorCar.setValue(getAdditional_info_data.ownMotorCar == true ? '1' : '0');
          this.additionalInformationForm.controls.isHaveHouseProperty.setValue(getAdditional_info_data.houseProperty == true ? '1' : '0');
          this.additionalInformationForm.controls.isIT10BNotMandatory.setValue(getAdditional_info_data.mandatoryITTenB == true ? '1' : '0');
        }

        if (!getAdditional_info_data.anyIncome) {

          this.mainNavbarList.addSelectedMainNavbar(this.additionalInformationForm.value);
        }
        else {
          this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Expenditure');
        }

        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        this.lengthOfheads = this.selectedNavbar.length;
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      });
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
  }

  getExpenditureData(): Promise<void> {
    this.expenditureGetDataReqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_expendsummary')
        .subscribe(result => {
          // console.log(result);
          // console.log(result.replyMessage);
          if (JSON.stringify(result.replyMessage) != '{}') {
            // console.log(result);
            this.expenditureData = result['replyMessage'];
          //  console.log('getdata:', this.expenditureData);

            let food_exp_amt;
            let food_exp_cmt;

            let house_exp_amt;
            let house_exp_cmt;

            let te_driver_salary_fuel_maintenance_amt;
            let te_driver_salary_fuel_maintenance_cmt;
            let te_others_transportation_amt;
            let te_others_transportation_cmt;

            let hue_electricity_amt;
            let hue_electricity_cmt;
            let hue_gas_water_sewer_garbage_amt;
            let hue_gas_water_sewer_garbage_cmt;
            let hue_home_support_stuff_other_expense_amt;
            let hue_home_support_stuff_other_expense_cmt;
            let hue_phone_internet_tvchannel_sub_amt;
            let hue_phone_internet_tvchannel_sub_cmt;

            let child_edu_exp_amt;
            let child_edu_exp_cmt;

            let se_festival_party_expenses_amt;
            let se_festival_party_expenses_cmt;
            let se_domestic_overseas_tour_holiday_amt;
            let se_domestic_overseas_tour_holiday_cmt;
            let se_philan_thropy_amt;
            let se_philan_thropy_cmt;
            let se_other_social_expenses_amt;
            let se_other_social_expenses_cmt;

            let other_exp_amt;
            let other_exp_cmt;

            let total_expenses_relatingTo_lifestyle_amt;

            let tcp_payment_of_tax_at_source_amt;
            let tcp_payment_of_tax_at_source_cmt;

            let payment_of_taxsurcharge_OrOther_amt;
            let payment_of_taxsurcharge_OrOther_cmt;

            let expense_tax_total_amt;

            this.expenditureData.Food_Cloth_Expense.forEach(element => {
              food_exp_amt = element.Food_Cloth_Expense_Amount;
              food_exp_cmt = element.Food_Cloth_Expense_Comment;
            });
            this.expenditureData.House_Expense.forEach(element => {
              house_exp_amt = element.House_Expense_Amount;
              house_exp_cmt = element.House_Expense_Comment;
            });
            this.expenditureData.Transportation_Expense.forEach(element => {
              te_driver_salary_fuel_maintenance_amt = element.TE_Driver_Salary_Fuel_Maintenance_Amount;
              te_driver_salary_fuel_maintenance_cmt = element.TE_Driver_Salary_Fuel_Maintenance_Comment;
              te_others_transportation_amt = element.TE_Others_Transportation_Amount;
              te_others_transportation_cmt = element.TE_Others_Transportation_Comment;
            });
            this.expenditureData.Household_Utility_Expense.forEach(element => {
              hue_electricity_amt = element.HUE_Electricity_Amount;
              hue_electricity_cmt = element.HUE_Electricity_Comment;
              hue_gas_water_sewer_garbage_amt = element.HUE_Gas_Water_Sewer_Garbage_Amount;
              hue_gas_water_sewer_garbage_cmt = element.HUE_Gas_Water_Sewer_Garbage_Comment;
              hue_home_support_stuff_other_expense_amt = element.HUE_Home_Support_Stuff_Other_Expense_Amount;
              hue_home_support_stuff_other_expense_cmt = element.HUE_Home_Support_Stuff_Other_Expense_Comment;
              hue_phone_internet_tvchannel_sub_amt = element.HUE_Phone_Internet_TVChannel_Sub_Amount;
              hue_phone_internet_tvchannel_sub_cmt = element.HUE_Phone_Internet_TVChannel_Sub_Comment;
            });
            this.expenditureData.Child_Edu_Expense.forEach(element => {
              child_edu_exp_amt = element.Child_Edu_Expense_Amount;
              child_edu_exp_cmt = element.Child_Edu_Expense_Comment;
            });
            this.expenditureData.Special_Expense.forEach(element => {
              se_festival_party_expenses_amt = element.SE_Festival_Party_Expenses_Amount;
              se_festival_party_expenses_cmt = element.SE_Festival_Party_Expenses_Comment;
              se_domestic_overseas_tour_holiday_amt = element.SE_Domestic_Overseas_Tour_Holiday_Amount;
              se_domestic_overseas_tour_holiday_cmt = element.SE_Domestic_Overseas_Tour_Holiday_Comment;
              se_philan_thropy_amt = element.SE_Philan_Thropy_Amount;
              se_philan_thropy_cmt = element.SE_Philan_Thropy_Comment;
              se_other_social_expenses_amt = element.SE_Other_Social_Expenses_Amount;
              se_other_social_expenses_cmt = element.SE_Other_Social_Expenses_Comment;

            });
            this.expenditureData.Other_Expense.forEach(element => {
              other_exp_amt = element.Other_Expense_Amount;
              other_exp_cmt = element.Other_Expense_Comment;
            });
            this.expenditureData.Lifestyle_Total_Expense.forEach(element => {
              total_expenses_relatingTo_lifestyle_amt = element.Total_Expenses_RelatingTo_LifeStyle_Amount;
            });
            this.expenditureData.Tax_Charge_Payment.forEach(element => {
              tcp_payment_of_tax_at_source_amt = element.TCP_Payment_Of_Tax_At_Source_Amount;
              tcp_payment_of_tax_at_source_cmt = element.TCP_Payment_Of_Tax_At_Source_Comment;
            });
            this.expenditureData.Tax_Surcharge_Payment.forEach(element => {
              payment_of_taxsurcharge_OrOther_amt = element.Payment_Of_TaxSurcharge_OrOther_Amount;
              payment_of_taxsurcharge_OrOther_cmt = element.Payment_Of_TaxSurcharge_OrOther_Comment;
            });

            // debugger;
            this.expenditureData.Expense_Tax_Total.forEach(element => {
              expense_tax_total_amt = element.Expense_Tax_Total_Amount;
              this.expenditureForm.controls.chkIT10B.setValue(element.IT10BB_Mandatory);
              this.tmp_isIT10BMandatory = element.IT10BB_Mandatory === '1' ? true : false;
            });

        //    console.log('tmp_isIT10BMandatory', this.tmp_isIT10BMandatory);
            this.expenditureForm.patchValue({
              expenseFoodClothingAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(food_exp_amt, 0)),
              expenseFoodClothingCmt: food_exp_cmt,
              housingExpenseAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(house_exp_amt, 0)),
              housingExpenseCmt: house_exp_cmt,
              driverSalaryFuelMaintanceAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(te_driver_salary_fuel_maintenance_amt, 0)),
              driverSalaryFuelMaintanceCmt: te_driver_salary_fuel_maintenance_cmt,
              otherTransportationAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(te_others_transportation_amt, 0)),
              otherTransportationCmt: te_others_transportation_cmt,
              electricityAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(hue_electricity_amt, 0)),
              electricityCmt: hue_electricity_cmt,
              gasWaterSewerGurbageAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(hue_gas_water_sewer_garbage_amt, 0)),
              gasWaterSewerGurbageCmt: hue_gas_water_sewer_garbage_cmt,
              phoneInternetTVChannelSubAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(hue_home_support_stuff_other_expense_amt, 0)),
              phoneInternetTVChannelSubCmt: hue_home_support_stuff_other_expense_cmt,
              homeSupportStuffandOtherExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(hue_phone_internet_tvchannel_sub_amt, 0)),
              homeSupportStuffandOtherExpensesCmt: hue_phone_internet_tvchannel_sub_cmt,
              childrensEducationExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(child_edu_exp_amt, 0)),
              childrensEducationExpensesCmt: child_edu_exp_cmt,
              festivalPartyExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(se_festival_party_expenses_amt, 0)),
              festivalPartyExpensesCmt: se_festival_party_expenses_cmt,
              domesticOverseasTourHolidayAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(se_domestic_overseas_tour_holiday_amt, 0)),
              domesticOverseasTourHolidayCmt: se_domestic_overseas_tour_holiday_cmt,
              philanthropyAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(se_philan_thropy_amt, 0)),
              philanthropyCmt: se_philan_thropy_cmt,
              otherSocialExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(se_other_social_expenses_amt, 0)),
              otherSocialExpensesCmt: se_other_social_expenses_cmt,
              anyOtherExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(other_exp_amt, 0)),
              anyOtherExpensesCmt: other_exp_cmt,
              totalExpensesRelatingToLifeStyleAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(total_expenses_relatingTo_lifestyle_amt, 0)),
              paymentOfTaxAtSourceAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(tcp_payment_of_tax_at_source_amt, 0)),
              paymentOfTaxAtSourceCmt: tcp_payment_of_tax_at_source_cmt,
              paymentOfTaxSurchargeOrOtherAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(payment_of_taxsurcharge_OrOther_amt, 0)),
              paymentOfTaxSurchargeOrOtherCmt: payment_of_taxsurcharge_OrOther_cmt,
              totalAmountOfExpenseAndTaxAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(expense_tax_total_amt, 0)),
            });

            this.totalExpenseInputSum();

            this.spinner.stop();
          }
          else {
            this.tmp_isIT10BMandatory = true;
            this.apiService.get(this.serviceUrl + 'api/get_total_tds')
              .subscribe(result => {
            //    console.log('tds', result);
                this.expenditureForm.get("paymentOfTaxAtSourceAmt").setValue(result.replyMessage);
                this.totalAmtExpenseTax();
              },
                error => {
                  this.spinner.stop();
              //    console.log(error['error'].errorMessage);
                  this.toastr.error(error['error'].errorMessage, '', {
                    timeOut: 3000,
                  });
                });
            this.spinner.stop();
          }
          resolve();
        },
          error => {
            this.spinner.stop();
            reject();
        //    console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
    this.lengthOfheads = this.selectedNavbar.length;
   // console.log('selectedNavbar', this.selectedNavbar);
  }

  loadIT10BRegion(): Promise<void> {
    let chk_it10bstatus: boolean = false;
    let requestData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_IT10BB_status')
        .subscribe(result => {
          if (result.success)
            // debugger;
            chk_it10bstatus = result.replyMessage;
        //  console.log('it10mandatory from api', chk_it10bstatus);
          if (!chk_it10bstatus) {
            this.load_IT10BRegion = false;
            this.isIT10BMandatory = true;

          }
          else {
            this.load_IT10BRegion = true;
            this.isIT10BMandatory = this.tmp_isIT10BMandatory;
          }
          resolve();
        },
          error => {
            this.spinner.stop();
            reject();
        //    console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });
    });
  }

  onRadioChangeYes() {
    this.expenditureValidation_ShowError = false;
    this.isIT10BMandatory = true;
    this.initializeExpenditure();
  }
  onRadioChangeNo() {
    this.expenditureValidation_ShowError = false;
    this.isIT10BMandatory = false;
    this.initializeExpenditure();
    // this.removeExpenditure();
  }

  initializeExpenditure() {
    this.expenditureForm.patchValue({
      expenseFoodClothingAmt: '',
      expenseFoodClothingCmt: '',
      housingExpenseAmt: '',
      housingExpenseCmt: '',
      driverSalaryFuelMaintanceAmt: '',
      driverSalaryFuelMaintanceCmt: '',
      otherTransportationAmt: '',
      otherTransportationCmt: '',
      electricityAmt: '',
      electricityCmt: '',
      gasWaterSewerGurbageAmt: '',
      gasWaterSewerGurbageCmt: '',
      phoneInternetTVChannelSubAmt: '',
      phoneInternetTVChannelSubCmt: '',
      homeSupportStuffandOtherExpensesAmt: '',
      homeSupportStuffandOtherExpensesCmt: '',
      childrensEducationExpensesAmt: '',
      childrensEducationExpensesCmt: '',
      festivalPartyExpensesAmt: '',
      festivalPartyExpensesCmt: '',
      domesticOverseasTourHolidayAmt: '',
      domesticOverseasTourHolidayCmt: '',
      philanthropyAmt: '',
      philanthropyCmt: '',
      otherSocialExpensesAmt: '',
      otherSocialExpensesCmt: '',
      anyOtherExpensesAmt: '',
      anyOtherExpensesCmt: '',
      totalExpensesRelatingToLifeStyleAmt: '',
      paymentOfTaxAtSourceAmt: '',
      paymentOfTaxAtSourceCmt: '',
      paymentOfTaxSurchargeOrOtherAmt: '',
      paymentOfTaxSurchargeOrOtherCmt: '',
      totalAmountOfExpenseAndTaxAmt: '',
    });
  }
  numberOnly(event): boolean {
    this.expenditureValidation_ShowError = false;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  removeExpenditure() {
    let dlt_all_expenditure = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/delete_expendsummary', "")
      .subscribe(result => {

      },
        error => {
     //     console.log(error['error'].errorMessage);
          // this.toastr.warning('Failed to remove expenditure!', '', {
          //   timeOut: 3000,
          // });
        });
  }

  initializeTotalAmtOfExp(event) {
    this.expenditureForm.patchValue({
      totalAmountOfExpenseAndTaxAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }

  totalExpenseInputSum() {
    this.expenditureForm.patchValue({
      expenseFoodClothingAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("expenseFoodClothingAmt").value, 0)),
      housingExpenseAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("housingExpenseAmt").value, 0)),
      driverSalaryFuelMaintanceAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("driverSalaryFuelMaintanceAmt").value, 0)),
      otherTransportationAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("otherTransportationAmt").value, 0)),
      electricityAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("electricityAmt").value, 0)),
      gasWaterSewerGurbageAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("gasWaterSewerGurbageAmt").value, 0)),
      phoneInternetTVChannelSubAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("phoneInternetTVChannelSubAmt").value, 0)),
      homeSupportStuffandOtherExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("homeSupportStuffandOtherExpensesAmt").value, 0)),
      childrensEducationExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("childrensEducationExpensesAmt").value, 0)),
      festivalPartyExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("festivalPartyExpensesAmt").value, 0)),
      domesticOverseasTourHolidayAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("domesticOverseasTourHolidayAmt").value, 0)),
      philanthropyAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("philanthropyAmt").value, 0)),
      otherSocialExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("otherSocialExpensesAmt").value, 0)),
      anyOtherExpensesAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("anyOtherExpensesAmt").value, 0)),
      totalExpensesRelatingToLifeStyleAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("totalExpensesRelatingToLifeStyleAmt").value, 0)),

    });

    this.expenseFoodClothingAmt = this.expenditureForm.get("expenseFoodClothingAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("expenseFoodClothingAmt").value, 0) : 0;
    this.housingExpenseAmt = this.expenditureForm.get("housingExpenseAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("housingExpenseAmt").value, 0) : 0;
    this.driverSalaryFuelMaintanceAmt = this.expenditureForm.get("driverSalaryFuelMaintanceAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("driverSalaryFuelMaintanceAmt").value, 0) : 0;
    this.otherTransportationAmt = this.expenditureForm.get("otherTransportationAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("otherTransportationAmt").value, 0) : 0;
    this.electricityAmt = this.expenditureForm.get("electricityAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("electricityAmt").value, 0) : 0;
    this.gasWaterSewerGurbageAmt = this.expenditureForm.get("gasWaterSewerGurbageAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("gasWaterSewerGurbageAmt").value, 0) : 0;
    this.phoneInternetTVChannelSubAmt = this.expenditureForm.get("phoneInternetTVChannelSubAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("phoneInternetTVChannelSubAmt").value, 0) : 0;
    this.homeSupportStuffandOtherExpensesAmt = this.expenditureForm.get("homeSupportStuffandOtherExpensesAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("homeSupportStuffandOtherExpensesAmt").value, 0) : 0;
    this.childrensEducationExpensesAmt = this.expenditureForm.get("childrensEducationExpensesAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("childrensEducationExpensesAmt").value, 0) : 0;
    this.festivalPartyExpensesAmt = this.expenditureForm.get("festivalPartyExpensesAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("festivalPartyExpensesAmt").value, 0) : 0;
    this.domesticOverseasTourHolidayAmt = this.expenditureForm.get("domesticOverseasTourHolidayAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("domesticOverseasTourHolidayAmt").value, 0) : 0;
    this.philanthropyAmt = this.expenditureForm.get("philanthropyAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("philanthropyAmt").value, 0) : 0;
    this.otherSocialExpensesAmt = this.expenditureForm.get("otherSocialExpensesAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("otherSocialExpensesAmt").value, 0) : 0;
    this.anyOtherExpensesAmt = this.expenditureForm.get("anyOtherExpensesAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("anyOtherExpensesAmt").value, 0) : 0;

    let auto_and_Transportation_Expenses_Summm: any;
    auto_and_Transportation_Expenses_Summm = (Number(this.driverSalaryFuelMaintanceAmt) + Number(this.otherTransportationAmt));
    auto_and_Transportation_Expenses_Summm = this.commaSeparator.currencySeparatorBD(auto_and_Transportation_Expenses_Summm);
    this.expenditureForm.get('auto_and_Transportation_Expenses_Sum').setValue(auto_and_Transportation_Expenses_Summm === 0 ? '' : auto_and_Transportation_Expenses_Summm);

    let household_and_Utility_Expenses_Summm: any;
    household_and_Utility_Expenses_Summm = (Number(this.electricityAmt) + Number(this.gasWaterSewerGurbageAmt)
      + Number(this.phoneInternetTVChannelSubAmt) + Number(this.homeSupportStuffandOtherExpensesAmt));
    household_and_Utility_Expenses_Summm = this.commaSeparator.currencySeparatorBD(household_and_Utility_Expenses_Summm);
    this.expenditureForm.get('household_and_Utility_Expenses_Sum').setValue(household_and_Utility_Expenses_Summm === 0 ? '' : household_and_Utility_Expenses_Summm);

    let special_Expenses_Summm: any;
    special_Expenses_Summm = (Number(this.festivalPartyExpensesAmt) + Number(this.domesticOverseasTourHolidayAmt)
      + Number(this.philanthropyAmt) + Number(this.otherSocialExpensesAmt));
    special_Expenses_Summm = this.commaSeparator.currencySeparatorBD(special_Expenses_Summm);
    this.expenditureForm.get('special_Expenses_Sum').setValue(special_Expenses_Summm === 0 ? '' : special_Expenses_Summm);

    this.totalExpensesRelatingToLifeStyleAmt = Math.round(this.expenseFoodClothingAmt) + Math.round(this.housingExpenseAmt) + Math.round(this.driverSalaryFuelMaintanceAmt) + Math.round(this.otherTransportationAmt) + Math.round(this.electricityAmt) + Math.round(this.gasWaterSewerGurbageAmt) + Math.round(this.phoneInternetTVChannelSubAmt) + Math.round(this.homeSupportStuffandOtherExpensesAmt) + Math.round(this.childrensEducationExpensesAmt) + Math.round(this.festivalPartyExpensesAmt) + Math.round(this.domesticOverseasTourHolidayAmt) + Math.round(this.philanthropyAmt) + Math.round(this.otherSocialExpensesAmt) + Math.round(this.anyOtherExpensesAmt);
    this.expenditureForm.get("totalExpensesRelatingToLifeStyleAmt").setValue(this.commaSeparator.currencySeparatorBD(this.totalExpensesRelatingToLifeStyleAmt));
    this.totalAmtExpenseTax();
  }

  totalAmtExpenseTax() {
    this.expenditureForm.patchValue({
      totalExpensesRelatingToLifeStyleAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("totalExpensesRelatingToLifeStyleAmt").value, 0)),
      paymentOfTaxAtSourceAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("paymentOfTaxAtSourceAmt").value, 0)),
      paymentOfTaxSurchargeOrOtherAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("paymentOfTaxSurchargeOrOtherAmt").value, 0)),
      totalAmountOfExpenseAndTaxAmt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("totalAmountOfExpenseAndTaxAmt").value, 0)),

    });

    this.totalExpensesRelatingToLifeStyleAmt = this.expenditureForm.get("totalExpensesRelatingToLifeStyleAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("totalExpensesRelatingToLifeStyleAmt").value, 0) : 0;
    this.paymentOfTaxAtSourceAmt = this.expenditureForm.get("paymentOfTaxAtSourceAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("paymentOfTaxAtSourceAmt").value, 0) : 0;
    this.paymentOfTaxSurchargeOrOtherAmt = this.expenditureForm.get("paymentOfTaxSurchargeOrOtherAmt").value != null ? this.commaSeparator.removeCommaExpenditure(this.expenditureForm.get("paymentOfTaxSurchargeOrOtherAmt").value, 0) : 0;

    this.totalAmountOfExpenseAndTaxAmt = Math.round(this.totalExpensesRelatingToLifeStyleAmt) + Math.round(this.paymentOfTaxAtSourceAmt) + Math.round(this.paymentOfTaxSurchargeOrOtherAmt);
    // localStorage.setItem('totalAmountOfExpenseAndTaxAmt', this.totalAmountOfExpenseAndTaxAmt);
    // debugger;
    if (this.totalAmountOfExpenseAndTaxAmt > 0) {
      this.expenditureForm.get("totalAmountOfExpenseAndTaxAmt").setValue(this.commaSeparator.currencySeparatorBD(this.totalAmountOfExpenseAndTaxAmt));
    }
    else if (this.totalAmountOfExpenseAndTaxAmt == 0 && this.expenditureForm.value.chkIT10B=="1") {
      this.expenditureForm.get("totalAmountOfExpenseAndTaxAmt").setValue('');
    }
  }

  validateExpenditure(): boolean {
    let totalAmtOfExpenditure = this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.totalAmountOfExpenseAndTaxAmt, 0);
    if (totalAmtOfExpenditure == null || totalAmtOfExpenditure == '' || parseInt(totalAmtOfExpenditure) == 0)
      return false;
    else
      return true;
  }

  submittedData() {

    // console.log('form Value', this.expenditureForm.value);
    if (!this.validateExpenditure() && this.isIT10BMandatory) {
      this.expenditureValidation_ShowError = true;
      this.toastr.warning('Please fill at least one amount field!', '', {
        timeOut: 2000,
      });
      return;
    }

    if (!this.validateExpenditure() && !this.isIT10BMandatory) {
      this.expenditureValidation_ShowError = true;
      this.toastr.warning('Please fill the amount!', '', {
        timeOut: 2000,
      });
      return;
    }

    this.requestData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin,
      "expenditureParticularsList": [
        {
          "expenditureType": "Food_Cloth_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "Food_Cloth_Expense_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.expenseFoodClothingAmt, 0)
            },
            {
              "fieldName": "Food_Cloth_Expense_Comment",
              "fieldValue": this.expenditureForm.value.expenseFoodClothingCmt
            }
          ]
        },
        {
          "expenditureType": "House_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "House_Expense_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.housingExpenseAmt, 0)
            },
            {
              "fieldName": "House_Expense_Comment",
              "fieldValue": this.expenditureForm.value.housingExpenseCmt
            }
          ]
        },
        {
          "expenditureType": "Transportation_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "TE_Driver_Salary_Fuel_Maintenance_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.driverSalaryFuelMaintanceAmt, 0)
            },
            {
              "fieldName": "TE_Driver_Salary_Fuel_Maintenance_Comment",
              "fieldValue": this.expenditureForm.value.driverSalaryFuelMaintanceCmt
            },
            {
              "fieldName": "TE_Others_Transportation_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.otherTransportationAmt, 0)
            },
            {
              "fieldName": "TE_Others_Transportation_Comment",
              "fieldValue": this.expenditureForm.value.otherTransportationCmt
            }
          ]
        },
        {
          "expenditureType": "Household_Utility_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "HUE_Electricity_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.electricityAmt, 0)
            },
            {
              "fieldName": "HUE_Electricity_Comment",
              "fieldValue": this.expenditureForm.value.electricityCmt
            },
            {
              "fieldName": "HUE_Gas_Water_Sewer_Garbage_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.gasWaterSewerGurbageAmt, 0)
            },
            {
              "fieldName": "HUE_Gas_Water_Sewer_Garbage_Comment",
              "fieldValue": this.expenditureForm.value.gasWaterSewerGurbageCmt
            },
            {
              "fieldName": "HUE_Phone_Internet_TVChannel_Sub_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.phoneInternetTVChannelSubAmt, 0)
            },
            {
              "fieldName": "HUE_Phone_Internet_TVChannel_Sub_Comment",
              "fieldValue": this.expenditureForm.value.phoneInternetTVChannelSubCmt
            },
            {
              "fieldName": "HUE_Home_Support_Stuff_Other_Expense_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.homeSupportStuffandOtherExpensesAmt, 0)
            },
            {
              "fieldName": "HUE_Home_Support_Stuff_Other_Expense_Comment",
              "fieldValue": this.expenditureForm.value.homeSupportStuffandOtherExpensesCmt
            },
          ]
        },
        {
          "expenditureType": "Child_Edu_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "Child_Edu_Expense_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.childrensEducationExpensesAmt, 0)
            },
            {
              "fieldName": "Child_Edu_Expense_Comment",
              "fieldValue": this.expenditureForm.value.childrensEducationExpensesCmt
            }
          ]
        },
        {
          "expenditureType": "Special_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "SE_Festival_Party_Expenses_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.festivalPartyExpensesAmt, 0)
            },
            {
              "fieldName": "SE_Festival_Party_Expenses_Comment",
              "fieldValue": this.expenditureForm.value.festivalPartyExpensesCmt
            },
            {
              "fieldName": "SE_Domestic_Overseas_Tour_Holiday_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.domesticOverseasTourHolidayAmt, 0)
            },
            {
              "fieldName": "SE_Domestic_Overseas_Tour_Holiday_Comment",
              "fieldValue": this.expenditureForm.value.domesticOverseasTourHolidayCmt
            },
            {
              "fieldName": "SE_Philan_Thropy_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.philanthropyAmt, 0)
            },
            {
              "fieldName": "SE_Philan_Thropy_Comment",
              "fieldValue": this.expenditureForm.value.philanthropyCmt
            },
            {
              "fieldName": "SE_Other_Social_Expenses_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.otherSocialExpensesAmt, 0)
            },
            {
              "fieldName": "SE_Other_Social_Expenses_Comment",
              "fieldValue": this.expenditureForm.value.otherSocialExpensesCmt
            }
          ]
        },
        {
          "expenditureType": "Other_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "Other_Expense_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.anyOtherExpensesAmt, 0)
            },
            {
              "fieldName": "Other_Expense_Comment",
              "fieldValue": this.expenditureForm.value.anyOtherExpensesCmt
            }
          ]
        },
        {
          "expenditureType": "Lifestyle_Total_Expense",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "Total_Expenses_RelatingTo_LifeStyle_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.totalExpensesRelatingToLifeStyleAmt, 0)
            },
            {
              "fieldName": "Total_Expenses_RelatingTo_LifeStyle_Comment",
              "fieldValue": ""
            }
          ]
        },
        {
          "expenditureType": "Tax_Charge_Payment",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "TCP_Payment_Of_Tax_At_Source_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.paymentOfTaxAtSourceAmt, 0)
            },
            {
              "fieldName": "TCP_Payment_Of_Tax_At_Source_Comment",
              "fieldValue": this.expenditureForm.value.paymentOfTaxAtSourceCmt
            }
          ]
        },
        {
          "expenditureType": "Tax_Surcharge_Payment",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "Payment_Of_TaxSurcharge_OrOther_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.paymentOfTaxSurchargeOrOtherAmt, 0)
            },
            {
              "fieldName": "Payment_Of_TaxSurcharge_OrOther_Comment",
              "fieldValue": this.expenditureForm.value.paymentOfTaxSurchargeOrOtherCmt
            }
          ]
        },
        {
          "expenditureType": "Expense_Tax_Total",
          "expenditureDetailsDTOList": [
            {
              "fieldName": "Expense_Tax_Total_Amount",
              "fieldValue": this.commaSeparator.removeCommaExpenditure(this.expenditureForm.value.totalAmountOfExpenseAndTaxAmt, 0)
            },
            {
              "fieldName": "Expense_Tax_Total_Comment",
              "fieldValue": ""
            },
            {
              "fieldName": "IT10BB_Mandatory",
              "fieldValue": this.expenditureForm.value.chkIT10B
            }
          ]
        }
      ]
    }

    // console.log('data', this.requestData);

    this.apiService.post(this.serviceUrl + 'api/create_expendsummary', "")
      .subscribe(result => {
        if (result != null && this.isSaveDraft == false) {
      //    console.log(result);
          localStorage.setItem('totalAmountOfExpenseAndTaxAmt', this.expenditureForm.value.totalAmountOfExpenseAndTaxAmt);
          this.toastr.success('Data Saved Successfully.', '', {
            timeOut: 1000,
          });

          // newly added
          // if (this.isIT10BMandatory == false) {
          //   this.removeExpenditure();
          // }

       //   console.log('lenOfHead', this.lengthOfheads);
          this.selectedNavbar.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/expenditure') {
              if (i + 1 > this.lengthOfheads - 1) {
                this.router.navigate(["/user-panel/final-return-view"]);
              }
              if (i + 1 <= this.lengthOfheads - 1) {
                this.router.navigate([this.selectedNavbar[i + 1]['link']]);
              }
            }
          });
        }
        if (result != null && this.isSaveDraft == true) {
          this.toastr.success('item saved as a draft!', '', {
            timeOut: 1000,
          });
          this.isSaveDraft = false;
        }
      },
        error => {
     //     console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

  }

  onBackPage() {
    // console.log('Navbar:', this.selectedNavbar);
    this.selectedNavbar.forEach((Value, i) => {
      // debugger;
      if (Value['link'] == '/user-panel/expenditure') {
        if (i - 2 < 0) {
          this.router.navigate(["/user-panel/additional-information"]);
          return;
        }
        if (i - 1 >= 0) {
          this.router.navigate([this.selectedNavbar[i - 1]['link']]);
        }
      }
    });
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }

  checkSubmissionStatus(): Promise<void> {
    this.spinner.start();
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_submission')
        .subscribe(result => {
          // debugger;
          if (result.replyMessage != null) {
            this.spinner.stop();
            if ((result.replyMessage).returnSubmissionType == "ONLINE") {
              this.isShow = false;
              this.toastr.error('You already submitted your return in online.', '', {
                timeOut: 3000,
              });
            } else if ((result.replyMessage).returnSubmissionType == "OFFLINE") {
              this.isShow = true;
            }
            resolve();
          }
          else {
            this.spinner.stop();
            this.isShow = true;
            resolve();
          }
        },
          error => {
            reject();
            this.spinner.stop();
       //     console.log(error['error'].errorMessage);
          });
    });
  }

}
