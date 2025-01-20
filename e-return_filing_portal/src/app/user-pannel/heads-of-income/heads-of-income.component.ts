import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable, of } from "rxjs";
import { HeadsOfIncomeService } from "../heads-of-income.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { NavigationEnd, Router } from "@angular/router";
import { ApiService } from "../../custom-services/ApiService";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ToastrService } from "ngx-toastr";
import { SalaryAdditionalInput } from "../salary-additional-input";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommaSeparatorService } from "../../service/comma-separator.service";

@Component({
  selector: "app-heads-of-income",
  templateUrl: "heads-of-income.component.html",
  styleUrls: ["heads-of-income.component.css"],
})
export class HeadsOfIncomeComponent implements OnInit {
  salaryData: any;
  requestData: any;
  isSaveDraft: boolean = false;
  totalTax: any;
  userTin: any;
  group: FormGroup;
  checkIsLoggedIn: any;
  govIbasGetData = [];

  isSummaryCollapsed: boolean = false;
  salarySummaryData = [];

  //#region declare Show Input
  showInput1 = [];
  showInput2 = [];
  showInput3 = [];
  showInput4 = [];
  showInput5 = [];
  showInput6 = [];
  showInput7 = [];
  showInput8 = [];
  showInput9 = [];
  showInput10 = [];
  showInput11 = [];
  showInput12 = [];
  showInput13 = [];
  showInput14 = [];
  showInput15 = [];
  showInput16 = [];
  showInput17 = [];
  showInput18 = [];
  showInput19 = [];
  showInput20 = [];
  showInput21 = [];
  showInput22 = [];
  showInput23 = [];
  showInput24 = [];
  showInput25 = [];
  showInput26 = [];
  showInput27 = [];
  showInput28 = [];
  showInput29 = [];
  showInput30 = [];
  showInput31 = [];
  showInput32 = [];
  showInput33 = [];
  showInput34 = [];
  showInput35 = [];
  showInput36 = [];
  showInput37 = [];
  showInput38 = [];
  showInput39 = [];
  showInput40 = [];
  showInput41 = [];
  showInput42 = [];
  showInput43 = [];
  showInput44 = [];
  showInput45 = [];
  showInput46 = [];
  showInput47 = [];
  showInput48 = [];
  showInput49 = [];
  showInput50 = [];
  showInput51 = [];
  showInput52 = [];
  showInput53 = [];
  showInput54 = [];
  showInput55 = [];
  showInput56 = [];
  showInput57 = [];
  showInput58 = [];

  //#endregion

  checkedSRO = [];
  checkedRent = [];
  checkedCon = [];
  checkedNcash = [];
  salaryAdditionalInput = SalaryAdditionalInput;
  salaryAdditionalInputStore = [];

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  salaryName = [];
  minDate: any;
  maxDate: any;

  item: any;
  popup: boolean = false;
  navActive = {};
  formArray: FormArray;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  incomeType: Observable<boolean>;
  salaryFormGrp: FormGroup;
  showOtherCalc: Observable<boolean>;
  isVisibleIncomeTab: boolean = true;
  organizationTitle: string = "";
  isVisibleAddSalBtn: boolean = false;
  isDataFound = [];
  onGovtToNonGovt = [];
  salaryExempted = [
    {
      label: "Yes",
      value: 1,
    },
    {
      label: "No",
      value: 2,
    },
  ];
  isVisibleForm: any;
  headsOfIncome = [];
  lengthOfheads: any;
  data: any[][] = [];

  addMoreGetData = [];

  isDisabled = [];

  isCheckedRentFreeAccommodation = [];
  isCheckedAccommodationAtConcessRate = [];
  isCheckedVehicleFacilityProvided = [];
  isCheckedOtherNonCashBenefit = [];

  isSroNoEmpty: any;
  isSroYearEmpty: any;
  isParticularOfSroEmpty: any;
  isTaxableIncomeOfSroEmpty: any;
  isTaxExemptedIncomeOfSroEmpty: any;
  isTaxApplicableOfSroEmpty: any;

  requestIncomeHeadGetData: any;
  requestNavbarGetData: any;

  formGroup: FormGroup;
  additionalInformationForm: FormGroup;

  hasSummary = [false];

  isSummary: boolean = false;

  is_sum_total_gross: any;
  is_sum_total_exempted: any;
  is_sum_total_taxable: any;

  taxExemptedData: any;
  isInterestOnGPFInTaxExempted: boolean = false;
  still_want_gpf: boolean = false;
  isPensionInTaxExempted: boolean = false;
  isGratuityInTaxExempted: boolean = false;
  isInterestOnRPFInTaxExempted: boolean = false;


  //#region tooltip text section

  sroSalaryTooltip = `<span class="btn-block well-sm">
  Select if your salary income enjoys special tax treatment under any SRO or any provision of laws.
  </span>`;

  employmentTypeTooltip = `<span class="btn-block well-sm">
  Select the payment source of your salary income from the dropdown list.
  </span>`;

  ofcNameTooltip = `<span class="btn-block well-sm">
  The name of the office in which you are currently employed. If you are a retired person or are no more in work, use the name of the office in which you were employed during your income year.
  </span>`;

  employerNameTooltip = `<span class="btn-block well-sm">
  The name of the entity/office/individual under which you were employed during the income year.
  </span>`;

  shareholderDirectorTooltip = `<span class="btn-block well-sm">
  Check (√) this box if in any time during the income year you were a shareholder director at your employer company. Otherwise, leave the box blank.
  </span>`;

  nonCashBenefitsTooltip = `<span class="btn-block well-sm">
  Select the non-cash benefits (if any) you received in relation to your employment.
  </span>`;

  rentFreeAccommodationTooltip = `<span class="btn-block well-sm">
  Select if you are provided rent free accommodation in relation to your employment.
  </span>`;

  rentFreeAccommodationValueTooltip = `<span class="btn-block well-sm">
  The rent of the house/apartment and other expense related to your accommodation benefit (that your employer paid).
  </span>`;

  ACRTooltip = `<span class="btn-block well-sm">
  Select if your accommodation expense was partly paid by your employer.
  </span>`;

  acrAccommodationValueTooltip = `<span class="btn-block well-sm">
  The rent of the house/apartment and other related expense to your accommodation (that you and your employer jointly paid).
  </span>`;

  rentPaidTaxpayerTooltip = `<span class="btn-block well-sm">
  The amount paid by you as part of the value of the accommodation. [For example, your accommodation expense in the income year was 6,00,000 and your part of payment was 2,40,000. In such case, enter 2,40,000.]
  </span>`;

  vehicleFacilityTooltip = `<span class="btn-block well-sm">
  Select if you were provided any vehicle facility from the office. (For example, your office provided a car for your transportation to or from office. Select this field if you bear partial expense or not for that car).
  </span>`;

  otherNonCashBenefitTooltip = `<span class="btn-block well-sm">
  Select if you received any non-cash benefits other than accommodation or vehicle.
  </span>`;

  otherNonCashBenefitParticularTooltip = `<span class="btn-block well-sm">
  The name/nature of non-cash benefits. Mention all you were provided.
  </span>`;

  otherNonCashBenefitValueTooltip = `<span class="btn-block well-sm">
  The amount spent by your employer (or on employer’s behalf) for non-cash benefits provided to you. In case of more than one benefits, enter aggregate amount.
  </span>`;

  sroReferenceTooltip = `<span class="btn-block well-sm">
  The number of SRO (or the name & section, rule, etc. of related laws) under which your salaries income enjoys special tax treatment.
  </span>`;

  sroYearTooltip = `<span class="btn-block well-sm">
  In case of SRO, the year which the SRO is issued.
  </span>`;

  sroParticularTooltip = `<span class="btn-block well-sm">
  Any necessary description.
  </span>`;

  sroTaxExemptedIncomeTooltip = `<span class="btn-block well-sm">
  The amount of salaries income that is exempted from tax.
  </span>`;

  sroTaxableIncomeTooltip = `<span class="btn-block well-sm">
  The amount of salaries income that is taxable.
  </span>`;

  sroTaxApplicableIncomeTooltip = `<span class="btn-block well-sm">
  Amount of tax calculated on Taxable Income.
  </span>`;

  GI_ParticularsTooltip = `<span class="btn-block well-sm">
  In following fields, enter basic salary and cash allowances/benefits according to your iBAS salary bill. If you have earned any amount in relation to your employment that is not mentioned in your iBAS salary bill, select appropriate field below to enter that amount.
  </span>`;

  G_ParticularsTooltip = `<span class="btn-block well-sm">
  In following fields, enter basic salary and cash allowances/benefits according  to your salary bill/statement. If you have earned any amount in relation to your employment that is not mentioned in your salary bill/state/statement, select appropriate field below to enter that amount.
  </span>`;

  NG_ParticularsTooltip = `<span class="btn-block well-sm">
  Enter the amount of basic salary and cash allowances/benefits according to your salary statement.
  </span>`;

  GI_DesignationTooltip = `<span class="btn-block well-sm">
  Use your current designation. If you are a retired person or are no more in work, use the designation you last hold in the income year. You may use the word “former ” in bracket.
  </span>`;

  G_DesignationTooltip = `<span class="btn-block well-sm">
  Use your current designation. If you are a retired person or are no more in work, use the designation you last hold in the income year. You may use the word “former ” in bracket.
  </span>`;

  NG_DesignationTooltip = `<span class="btn-block well-sm">
  The name of the position you last hold in your employment during the income year.
  </span>`;

  //#endregion

  //#region  for OtherIfAny purpose
  incArray = [];
  expArray = [];
  //#endregion

  isChangedSalarySummary: boolean = false;
  changedExemptedValue: any;
  changedTotalRegularValue: any;
  changedTotalValue: any;
  newGross: any;
  newExempted: any;
  newTaxable: any;
  newTotalRegularExempted: any;
  newTotalRegularTaxable: any;
  newTotalSroExempted: any;
  newTotalSroTaxable: any;
  newTotalExempted: any;
  newTotalTaxable: any;
  isShow: boolean = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private headService: HeadsOfIncomeService,
    private modalService: BsModalService,
    private mainNavbarList: mainNavbarListService,
    private spinner: NgxUiLoaderService,
    private httpClient: HttpClient,
    private commaSeparator: CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
    this.formArray = new FormArray([]);
  }

  insertFormGroupToArray(empType: any) {
    this.group = new FormGroup({
      salaryNo: new FormControl(),
      employmentType: new FormControl(empType),
      organizationName: new FormControl(""),
      salaryName: new FormControl(""),
      employerName: new FormControl(""),
      designation: new FormControl(""),
      isShareholderDirector: new FormControl(false),

      // otherIfAnyHead: new FormControl(""),
      // otherIfAnyValue: new FormControl(""),

      //#region for otherIfAny Section
      Other_If_Any: this.fb.array([this.fb.group({
        otherIfAnyHead: new FormControl(),
        otherIfAnyValue: new FormControl(),
      })]),
      //#endregion

      basicPay: new FormControl(""),
      houseRentAllowance: new FormControl(""),
      mobileAllowance: new FormControl(""),
      telephoneAllowance: new FormControl(),
      medicalAllowance: new FormControl(""),
      conveyanceAllowance: new FormControl(),
      banglaNewYearAllowance: new FormControl(""),
      festivalAllowance: new FormControl(""),
      recreationAllowance: new FormControl(""),
      educationAllowance: new FormControl(""),
      gpfInterest: new FormControl(""),
      festivalBonus: new FormControl(""),
      entertainmentAllowance: new FormControl(""),
      tadaExpended: new FormControl(""),
      freeConcessionalPassage: new FormControl(""),
      gratuity: new FormControl(""),

      salaryExempte: new FormControl("2"),
      ibas: new FormControl(),

      isRentFreeAccommodation: new FormControl(false),
      RentFreeAccValue: new FormControl(),
      isAccommodationAtConcessRate: new FormControl(false),
      ConcessRateValue: new FormControl(),
      ConcessRateRentPaidByTaxpayer: new FormControl(),
      isVehicleFacilityProvided: new FormControl(false),
      isOtherNonCashBenefit: new FormControl(false),
      particularOfOtherNonCashBenefit: new FormControl(),
      valueOfOtherNonCashBenefit: new FormControl(),
      isSalaryExemptedUnderSRO: new FormControl(false),
      SroNo: new FormControl(),
      sroYear: new FormControl(),
      particularOfSro: new FormControl(),
      taxableIncomeOfSro: new FormControl(),
      taxExemptedIncomeOfSro: new FormControl(),
      taxApplicableOfSro: new FormControl(),

      //select2 - dropdown
      speacialPay: new FormControl(""),
      arrearPay: new FormControl(""),
      dearnessAllowance: new FormControl(""),
      deputationAllowance: new FormControl(""),
      chargeAllowance: new FormControl(""),
      judicialAllowance: new FormControl(""),
      defenseServiceAllowance: new FormControl(""),
      transportMaintenanceAllowance: new FormControl(""),
      foreignAllowance: new FormControl(""),
      hillAllowance: new FormControl(""),
      hazardousJobAllowance: new FormControl(""),
      personalPay: new FormControl(""),
      honorariumRewardFee: new FormControl(""),
      otherRetirementBenefits: new FormControl(""),

      appointmentPay: new FormControl(""),
      flyingPay: new FormControl(""),
      goodConductPay: new FormControl(""),
      ssgPay: new FormControl(""),
      worthynessPay: new FormControl(""),
      batsmanPay: new FormControl(""),
      chawkiAllowance: new FormControl(""),
      compensatoryAllowance: new FormControl(""),
      cookAllowance: new FormControl(""),
      dailyAllowance: new FormControl(""),
      disturbanceAllowance: new FormControl(""),
      domesticAidAllowance: new FormControl(""),
      haircutAllowance: new FormControl(""),
      medalAllowance: new FormControl(""),
      rationAllowance: new FormControl(""),
      refreshmentAllowance: new FormControl(""),
      retainerAllowance: new FormControl(""),
      securityAllowance: new FormControl(""),
      tiffinAllowance: new FormControl(""),
      trainingAllowance: new FormControl(""),
      travelAllowance: new FormControl(""),
      uniformAllowance: new FormControl(""),
      washingAllowance: new FormControl(""),
      otherAllowance: new FormControl(""),


      supportStaffAllowance: new FormControl(""),
      leaveAllowance: new FormControl(""),
      overtimeAllowance: new FormControl(""),
      bonusExGratia: new FormControl(""),
      empContributionToRPF: new FormControl(""),
      interestAccruedOnRPF: new FormControl(""),
      pension: new FormControl(""),
      deemedIncomeForTranfortFacility: new FormControl(""),
      deemedIncomeForFreeFurnishedNonFurnishedAcco: new FormControl(""),
      // otherIfAny: new FormControl(""),
    });

    this.formArray.push(this.group);
    this.selectedSalary(this.formArray.length - 1);

    //#region for otherIfAny Section
    this.incArray[this.formArray.length - 1] = false;
    //#endregion

    //start- show tab name salary 1, salary 2.... initially
    let x: number = 1;
    x = x + (this.formArray.length - 1);
    this.salaryName[this.formArray.length - 1] = 'Salary' + ' ' + x;
    this.formArray.controls[this.formArray.length - 1].patchValue({
      salaryName: this.salaryName[this.formArray.length - 1],
    });
    //end

    this.showInput1[this.formArray.controls.length - 1] = true;
    this.showInput2[this.formArray.controls.length - 1] = true;
    this.showInput3[this.formArray.controls.length - 1] = true;
    this.showInput4[this.formArray.controls.length - 1] = true;
    this.showInput5[this.formArray.controls.length - 1] = true;
    this.showInput6[this.formArray.controls.length - 1] = true;
    this.showInput7[this.formArray.controls.length - 1] = true;
    this.showInput8[this.formArray.controls.length - 1] = true;
    this.showInput9[this.formArray.controls.length - 1] = true;
    this.showInput10[this.formArray.controls.length - 1] = true;
    this.showInput11[this.formArray.controls.length - 1] = true;
    this.showInput12[this.formArray.controls.length - 1] = true;
    this.showInput13[this.formArray.controls.length - 1] = true;
    this.showInput14[this.formArray.controls.length - 1] = true;
    this.showInput15[this.formArray.controls.length - 1] = true;
    this.showInput16[this.formArray.controls.length - 1] = true;
    this.data[this.formArray.controls.length - 1] =  //this.salaryAdditionalInput;
      [
        { id: 1, text: "Special Pay" },
        { id: 2, text: "Arrear Pay" },
        { id: 3, text: "Dearness Allowance" },
        { id: 4, text: "Allowance for Support Stuff" },
        { id: 5, text: "Leave Allowance" },
        { id: 6, text: "Honorarium/Reward/Fee" },
        { id: 7, text: "Overtime Allowance" },
        { id: 8, text: "Bonus/Ex-gratia" },
        { id: 9, text: "Other Allowances" },
        { id: 10, text: "Employer’s Contribution to a RPF" },
        { id: 11, text: "Interest Accrued on a RPF" },
        { id: 16, text: "Vehicle Maintenance Allowance" },
        { id: 15, text: "Pension" },
        // { id: 12, text: "Deemed Income for Transport Facility" },
        // { id: 13, text: "Deemed Income for Free Furnished/Unfurnished Accommodation" },
        { id: 14, text: "Other, If Any (Give Detail)" },
      ];
  }

  //#region for otherIfAny Section

  other_if_any_List(index: number): FormArray {
    return this.formArray.at(index).get('Other_If_Any') as FormArray;
  }

  add_row_other_if_any(i) {
    if (this.incArray[i]) {
      this.other_if_any_List(i).push(this.fb.group({
        otherIfAnyHead: new FormControl(),
        otherIfAnyValue: new FormControl(),
      }));
    }
    else {
      this.incArray[i] = true;
    }
  }

  delete_row_other_if_any(i, index) {
    this.other_if_any_List(i).removeAt(index);
  }

  getValueByKey(object, row) {
    return object[row];
  }

  //#endregion

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.navActiveSelect("1");
    // this.insertFormGroupToArray(0);
    this.incomeType = of(true);
    this.isVisibleAddSalBtn = true;
    this.getMainNavbar();
    this.mainNavActiveSelect("2");
    this.minDate = new Date(1972, 0, 1);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion
    this.getHeadsOfIncome();
    this.getSalaryData();

    this.is_sum_total_gross = "0";
    this.is_sum_total_exempted = "0";
    this.is_sum_total_taxable = "0";

    //#region get tax exempted data
    this.getTaxExemptedIncomeData();
    this.checkSubmissionStatus();
    //#endregion
  }

  loadAll_incomeHeads_on_Page_reload() {
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
          // console.log('@@@', element);
          getOnlyIncomeHeads.push(element.incomeSourceType);
        });

        //console.log('total result in salary:', getOnlyIncomeHeads);
        getOnlyIncomeHeads.forEach(element => {
          if (element.incomeSourceTypeId === 1 && element.active) {
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
          this.lengthOfheads = this.headsOfIncome.length;
        });
      })
  }

  loadAll_navbar_on_Page_reload() {
    this.mainNavActiveSelect('2');
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

        // this.mainNavbarList.addSelectedMainNavbar(this.additionalInformationForm.value);
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Salaries');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }

  getSalaryData() {
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/salaries')
      .subscribe(result => {
        if (result.length > 0) {
          //console.log('Salary getdata=', result);
          this.salaryData = result;

          let empType: any;
          let shareHolder: any;
          let RentFreeAccommodation: any;
          let AccommodationAtConcessRate: any;
          let VehicleFacilityProvided: any;
          let OtherNonCashBenefit: any;
          let SalaryExemptedUnderSRO: any;
          let head = [];
          // let value:any;
          let otherIfAnyHead: any;
          let otherIfAnyValue: any;

          this.salaryData.forEach((element, i) => {

            //#region initialize show input fun

            this.showInput1[i] = true;
            this.showInput2[i] = true;
            this.showInput3[i] = true;
            this.showInput4[i] = true;
            this.showInput5[i] = true;
            this.showInput6[i] = true;
            this.showInput7[i] = true;
            this.showInput8[i] = true;
            this.showInput9[i] = true;
            this.showInput10[i] = true;
            this.showInput11[i] = true;
            this.showInput12[i] = true;
            this.showInput13[i] = true;
            this.showInput14[i] = true;
            this.showInput15[i] = true;
            this.showInput16[i] = true;
            this.showInput17[i] = true;
            this.showInput18[i] = true;
            this.showInput19[i] = true;
            this.showInput20[i] = true;
            this.showInput21[i] = true;
            this.showInput22[i] = true;
            this.showInput23[i] = true;
            this.showInput24[i] = true;
            this.showInput25[i] = true;
            this.showInput26[i] = true;
            this.showInput27[i] = true;
            this.showInput28[i] = true;
            this.showInput29[i] = true;
            this.showInput30[i] = true;
            this.showInput31[i] = true;
            this.showInput32[i] = true;
            this.showInput33[i] = true;
            this.showInput34[i] = true;
            this.showInput35[i] = true;
            this.showInput36[i] = true;
            this.showInput37[i] = true;
            this.showInput38[i] = true;
            this.showInput39[i] = true;
            this.showInput40[i] = true;
            this.showInput41[i] = true;
            this.showInput42[i] = true;
            this.showInput43[i] = true;
            this.showInput44[i] = true;
            this.showInput45[i] = true;
            this.showInput46[i] = true;
            this.showInput47[i] = true;
            this.showInput48[i] = true;
            this.showInput49[i] = true;
            this.showInput50[i] = true;
            this.showInput51[i] = true;
            this.showInput52[i] = true;
            this.showInput53[i] = true;
            this.showInput54[i] = true;
            this.showInput55[i] = true;
            this.showInput56[i] = true;
            this.showInput57[i] = true;

            //#endregion

            // debugger;
            this.isVisibleIncomeTab = false;
            this.isVisibleAddSalBtn = false;

            if (element.IS_OFC_NAME) {
              this.salaryName[i] = element.IS_OFC_NAME;
            }

            if (element.IS_EMP_NAME) {
              this.salaryName[i] = element.IS_EMP_NAME;
            }
            if (!element.IS_EMP_NAME && !element.IS_OFC_NAME) {
              let x: number = 1;
              x = x + i;
              this.salaryName[i] = 'Salary' + ' ' + x;
            }

            if (element.IS_EMP_TYPE === 'GI') {
              empType = "1";
              this.govIbasGetData[i] = true;
            }
            if (element.IS_EMP_TYPE === 'G') {
              empType = "2";
            }
            if (element.IS_EMP_TYPE === 'NG') {
              empType = "3";
            }
            if (element.IS_EMP_TYPE === 'SRO') {
              empType = "4";
            }
            if (!element.IS_EMP_TYPE) {
              empType = "0";
            }

            //#region All checkbox
            if (element.IS_CHK_SHAREHOLDER_DIRECTOR) {
              shareHolder = true;
            }
            if (!element.IS_CHK_SHAREHOLDER_DIRECTOR) {
              shareHolder = false;
            }
            if (!element.IS_CHK_RENT_FREE_ACMDTN) {
              RentFreeAccommodation = false;
              this.checkedRent[i] = false;
              this.isCheckedRentFreeAccommodation[i] = false;
            }
            if (element.IS_CHK_RENT_FREE_ACMDTN === 'T') {
              RentFreeAccommodation = true;
              this.checkedRent[i] = true;
              this.isCheckedRentFreeAccommodation[i] = true;
            }
            if (!element.IS_CHK_ACMDTN_AT_CONCESS_RATE) {
              AccommodationAtConcessRate = false;
              this.checkedCon[i] = false;
              this.isCheckedAccommodationAtConcessRate[i] = false;
            }
            if (element.IS_CHK_ACMDTN_AT_CONCESS_RATE === 'T') {
              AccommodationAtConcessRate = true;
              this.checkedCon[i] = true;
              this.isCheckedAccommodationAtConcessRate[i] = true;
            }
            if (!element.IS_CHK_VEHICLE_FACILITY_PROVIDED) {
              VehicleFacilityProvided = false;
              this.isCheckedVehicleFacilityProvided[i] = false;
            }
            if (element.IS_CHK_VEHICLE_FACILITY_PROVIDED === 'T') {
              VehicleFacilityProvided = true;
              this.isCheckedVehicleFacilityProvided[i] = true;
            }
            if (!element.IS_CHK_OTHER_NON_CASH_BENEFIT) {
              OtherNonCashBenefit = false;
              this.checkedNcash[i] = false;
              this.isCheckedOtherNonCashBenefit[i] = false;
            }
            if (element.IS_CHK_OTHER_NON_CASH_BENEFIT === 'T') {
              OtherNonCashBenefit = true;
              this.checkedNcash[i] = true;
              this.isCheckedOtherNonCashBenefit[i] = true;
            }

            if (!element.IS_CHK_SAL_EXEMPTED_BY_SRO) {
              SalaryExemptedUnderSRO = false;
              this.checkedSRO[i] = false;
            }

            if (element.IS_CHK_SAL_EXEMPTED_BY_SRO === 'T') {
              SalaryExemptedUnderSRO = true;
              this.checkedSRO[i] = true;
            }
            //#endregion

            //#region select 2 show/hide
            if (element.IS_ARREAR_PAY) {
              this.showInput1[i] = false;
            }
            if (element.IS_EDUCATION_ALW) {
              this.showInput2[i] = false;
              this.showInput14[i] = false;
            }
            if (element.IS_ENTERTAINMENT_ALW) {
              this.showInput3[i] = false;
            }
            if (element.IS_OVERTIME_ALW) {
              this.showInput4[i] = false;
            }
            if (element.IS_LEAVE_ALW) {
              this.showInput5[i] = false;
            }
            if (element.IS_TADA_NOT_EXPENDED) {
              this.showInput6[i] = false;
            }
            if (element.IS_OTHER_ALW) {
              this.showInput7[i] = false;
              this.showInput57[i] = false;
            }
            if (element.IS_FREE_OR_CONCESSIONAL_PASSAGE) {
              this.showInput8[i] = false;
            }
            if (element.IS_EMP_CONTRIBUTION_RPF) {
              this.showInput9[i] = false;
            }
            if (element.IS_INTEREST_ACCRUED_RPF) {
              this.showInput10[i] = false;
            }

            if (element.IS_GRATUITY) {
              this.showInput11[i] = false;
            }
            if (element.IS_PENSION) {
              this.showInput12[i] = false;
            }
            // if (element.IS_OTHER_INCOME_HEAD || element.IS_OTHER_INCOME_VALUE) {
            //   this.showInput13[i] = false;
            // }
            if (element.IS_MOBILE_ALW) {
              this.showInput15[i] = false;
            }
            if (element.IS_RESIDENTIAL_TELEPHN_ALW) {
              this.showInput16[i] = false;
            }
            if (element.IS_REST_RECREATION_ALW) {
              this.showInput17[i] = false;
            }
            if (element.IS_DEARNESS_ALW) {
              this.showInput18[i] = false;
            }
            if (element.IS_DEPUTATION_ALW) {
              this.showInput19[i] = false;
            }
            if (element.IS_CHARGE_ALW) {
              this.showInput20[i] = false;
            }
            if (element.IS_JUDICIAL_ALW) {
              this.showInput21[i] = false;
            }
            if (element.IS_DEFENSE_SERVICE_ALW) {
              this.showInput22[i] = false;
            }
            if (element.IS_TRANSPORT_MAINTENANCE_ALW) {
              this.showInput23[i] = false;
            }
            if (element.IS_FOREIGN_ALW) {
              this.showInput24[i] = false;
            }
            if (element.IS_HILL_ALW) {
              this.showInput25[i] = false;
            }
            if (element.IS_HAZARDOUS_JOB_ALW) {
              this.showInput26[i] = false;
            }
            if (element.IS_ARREAR_PAY) {
              this.showInput27[i] = false;
            }
            if (element.IS_SPECIAL_PAY) {
              this.showInput28[i] = false;
            }
            if (element.IS_PERSONAL_PAY) {
              this.showInput29[i] = false;
            }
            if (element.IS_HONORARIUM_REWARD_FEE) {
              this.showInput30[i] = false;
            }
            if (element.IS_GPF_INTEREST) {
              this.showInput31[i] = false;
            }
            if (element.IS_OTHER_RETIREMENT_BENEFITS) {
              this.showInput32[i] = false;
            }

            if (element.IS_APPOINTMENT_PAY) {
              this.showInput33[i] = false;
            }
            if (element.IS_FLYING_PAY) {
              this.showInput34[i] = false;
            }
            if (element.IS_GOOD_CONDUCT_PAY) {
              this.showInput35[i] = false;
            }

            if (element.IS_SSG_PAY) {
              this.showInput36[i] = false;
            }
            if (element.IS_WORTHYNESS_PAY) {
              this.showInput37[i] = false;
            }
            if (element.IS_BATSMAN_ALW) {
              this.showInput38[i] = false;
            }

            if (element.IS_CONVEYANCE_ALW) {
              this.showInput39[i] = false;
            }
            if (element.IS_CHAWKI_ALW) {
              this.showInput40[i] = false;
            }
            if (element.IS_COMPENSATORY_ALW) {
              this.showInput41[i] = false;
            }

            if (element.IS_COOK_ALW) {
              this.showInput42[i] = false;
            }
            if (element.IS_DAILY_ALW) {
              this.showInput43[i] = false;
            }
            if (element.IS_DISTURBANCE_ALW) {
              this.showInput44[i] = false;
            }

            if (element.IS_DOMESTIC_AID_ALW) {
              this.showInput45[i] = false;
            }
            if (element.IS_HAIRCUT_ALW) {
              this.showInput46[i] = false;
            }
            if (element.IS_MEDAL_ALW) {
              this.showInput47[i] = false;
            }

            if (element.IS_RATION_ALW) {
              this.showInput48[i] = false;
            }
            if (element.IS_REFRESHMENT_ALW) {
              this.showInput49[i] = false;
            }
            if (element.IS_RETAINER_ALW) {
              this.showInput50[i] = false;
            }

            if (element.IS_SECURITY_ALW) {
              this.showInput51[i] = false;
            }
            if (element.IS_TIFFIN_ALW) {
              this.showInput52[i] = false;
            }
            if (element.IS_TRAINING_ALW) {
              this.showInput53[i] = false;
            }

            if (element.IS_TRAVEL_ALW) {
              this.showInput54[i] = false;
            }
            if (element.IS_UNIFORM_ALW) {
              this.showInput55[i] = false;
            }
            if (element.IS_WASHING_ALW) {
              this.showInput56[i] = false;
            }

            //#region for otherIfAny Section
            else {
              head = Object.keys(element);
            }
            //#endregion


            //#endregion

            this.group = new FormGroup({
              salaryNo: new FormControl(element.IS_SALARY_NO ? element.IS_SALARY_NO : ''),
              employmentType: new FormControl(empType),
              organizationName: new FormControl(element.IS_OFC_NAME ? element.IS_OFC_NAME : ''),
              employerName: new FormControl(element.IS_EMP_NAME ? element.IS_EMP_NAME : ''),
              designation: new FormControl(element.IS_EMP_DESIGNATION ? element.IS_EMP_DESIGNATION : ''),
              isShareholderDirector: new FormControl(shareHolder),

              Other_If_Any: this.fb.array([this.fb.group({
                otherIfAnyHead: new FormControl(),
                otherIfAnyValue: new FormControl(),
              })]),

              isRentFreeAccommodation: new FormControl(RentFreeAccommodation),
              RentFreeAccValue: new FormControl(element.IS_VAL_OF_ACMDTN_RFA ? this.commaSeparator.currencySeparatorBD(element.IS_VAL_OF_ACMDTN_RFA) : ''),
              isAccommodationAtConcessRate: new FormControl(AccommodationAtConcessRate),
              ConcessRateValue: new FormControl(element.IS_VAL_OF_ACMDTN_ACR ? this.commaSeparator.currencySeparatorBD(element.IS_VAL_OF_ACMDTN_ACR) : ''),
              ConcessRateRentPaidByTaxpayer: new FormControl(element.IS_RENT_PAID_BY_TAXPAYER_ACR ? this.commaSeparator.currencySeparatorBD(element.IS_RENT_PAID_BY_TAXPAYER_ACR) : ''),
              isVehicleFacilityProvided: new FormControl(VehicleFacilityProvided),
              isOtherNonCashBenefit: new FormControl(OtherNonCashBenefit),
              particularOfOtherNonCashBenefit: new FormControl(element.IS_PARTICULAR_ONCB ? element.IS_PARTICULAR_ONCB : ''),
              valueOfOtherNonCashBenefit: new FormControl(element.IS_VAL_ONCB ? this.commaSeparator.currencySeparatorBD(element.IS_VAL_ONCB) : ''),
              isSalaryExemptedUnderSRO: new FormControl(SalaryExemptedUnderSRO),
              SroNo: new FormControl(element.IS_SRO_NO_SES ? element.IS_SRO_NO_SES : ''),
              sroYear: new FormControl(element.IS_YEAR_SES ? element.IS_YEAR_SES : ''),
              particularOfSro: new FormControl(element.IS_PARTICULAR_SES ? element.IS_PARTICULAR_SES : ''),
              taxableIncomeOfSro: new FormControl(element.IS_TAXABLE_INCM_SES ? this.commaSeparator.currencySeparatorBD(element.IS_TAXABLE_INCM_SES) : ''),
              taxExemptedIncomeOfSro: new FormControl(element.IS_TAX_EXEMPTED_INCM_SES ? this.commaSeparator.currencySeparatorBD(element.IS_TAX_EXEMPTED_INCM_SES) : ''),
              taxApplicableOfSro: new FormControl(element.IS_TAX_APPLICABLE_SES ? this.commaSeparator.currencySeparatorBD(element.IS_TAX_APPLICABLE_SES) : ''),

              basicPay: new FormControl(element.IS_BASIC_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_BASIC_PAY) : ''),
              houseRentAllowance: new FormControl(element.IS_HOUSE_RENT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HOUSE_RENT_ALW) : ''),
              medicalAllowance: new FormControl(element.IS_MEDICAL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_MEDICAL_ALW) : ''),
              conveyanceAllowance: new FormControl(element.IS_CONVEYANCE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_CONVEYANCE_ALW) : ''),
              banglaNewYearAllowance: new FormControl(element.IS_BANGLA_NEW_YEAR_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_BANGLA_NEW_YEAR_ALW) : ''),
              festivalBonus: new FormControl(element.IS_FESTIVAL_BONUS ? this.commaSeparator.currencySeparatorBD(element.IS_FESTIVAL_BONUS) : ''),

              //select2 - dropdown
              educationAllowance: new FormControl(element.IS_EDUCATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_EDUCATION_ALW) : ''),
              mobileAllowance: new FormControl(element.IS_MOBILE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_MOBILE_ALW) : ''),
              telephoneAllowance: new FormControl(element.IS_RESIDENTIAL_TELEPHN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_RESIDENTIAL_TELEPHN_ALW) : ''),
              recreationAllowance: new FormControl(element.IS_REST_RECREATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_REST_RECREATION_ALW) : ''),
              dearnessAllowance: new FormControl(element.IS_DEARNESS_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DEARNESS_ALW) : ''),
              deputationAllowance: new FormControl(element.IS_DEPUTATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DEPUTATION_ALW) : ''),
              chargeAllowance: new FormControl(element.IS_CHARGE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_CHARGE_ALW) : ''),
              judicialAllowance: new FormControl(element.IS_JUDICIAL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_JUDICIAL_ALW) : ''),
              defenseServiceAllowance: new FormControl(element.IS_DEFENSE_SERVICE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DEFENSE_SERVICE_ALW) : ''),
              transportMaintenanceAllowance: new FormControl(element.IS_TRANSPORT_MAINTENANCE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TRANSPORT_MAINTENANCE_ALW) : ''),
              foreignAllowance: new FormControl(element.IS_FOREIGN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_FOREIGN_ALW) : ''),
              hillAllowance: new FormControl(element.IS_HILL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HILL_ALW) : ''),
              hazardousJobAllowance: new FormControl(element.IS_HAZARDOUS_JOB_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HAZARDOUS_JOB_ALW) : ''),
              arrearPay: new FormControl(element.IS_ARREAR_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_ARREAR_PAY) : ''),
              speacialPay: new FormControl(element.IS_SPECIAL_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_SPECIAL_PAY) : ''),
              personalPay: new FormControl(element.IS_PERSONAL_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_PERSONAL_PAY) : ''),
              honorariumRewardFee: new FormControl(element.IS_HONORARIUM_REWARD_FEE ? this.commaSeparator.currencySeparatorBD(element.IS_HONORARIUM_REWARD_FEE) : ''),
              tadaExpended: new FormControl(element.IS_TADA_NOT_EXPENDED ? this.commaSeparator.currencySeparatorBD(element.IS_TADA_NOT_EXPENDED) : ''),
              gpfInterest: new FormControl(element.IS_GPF_INTEREST ? this.commaSeparator.currencySeparatorBD(element.IS_GPF_INTEREST) : ''),
              pension: new FormControl(element.IS_PENSION ? this.commaSeparator.currencySeparatorBD(element.IS_PENSION) : ''),
              gratuity: new FormControl(element.IS_GRATUITY ? this.commaSeparator.currencySeparatorBD(element.IS_GRATUITY) : ''),
              otherRetirementBenefits: new FormControl(element.IS_OTHER_RETIREMENT_BENEFITS ? this.commaSeparator.currencySeparatorBD(element.IS_OTHER_RETIREMENT_BENEFITS) : ''),
              appointmentPay: new FormControl(element.IS_APPOINTMENT_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_APPOINTMENT_PAY) : ''),
              flyingPay: new FormControl(element.IS_FLYING_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_FLYING_PAY) : ''),
              goodConductPay: new FormControl(element.IS_GOOD_CONDUCT_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_GOOD_CONDUCT_PAY) : ''),
              ssgPay: new FormControl(element.IS_SSG_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_SSG_PAY) : ''),
              worthynessPay: new FormControl(element.IS_WORTHYNESS_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_WORTHYNESS_PAY) : ''),
              batsmanPay: new FormControl(element.IS_BATSMAN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_BATSMAN_ALW) : ''),
              chawkiAllowance: new FormControl(element.IS_CHAWKI_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_CHAWKI_ALW) : ''),
              compensatoryAllowance: new FormControl(element.IS_COMPENSATORY_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_COMPENSATORY_ALW) : ''),
              cookAllowance: new FormControl(element.IS_COOK_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_COOK_ALW) : ''),
              dailyAllowance: new FormControl(element.IS_DAILY_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DAILY_ALW) : ''),
              disturbanceAllowance: new FormControl(element.IS_DISTURBANCE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DISTURBANCE_ALW) : ''),
              domesticAidAllowance: new FormControl(element.IS_DOMESTIC_AID_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DOMESTIC_AID_ALW) : ''),
              haircutAllowance: new FormControl(element.IS_HAIRCUT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HAIRCUT_ALW) : ''),
              medalAllowance: new FormControl(element.IS_MEDAL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_MEDAL_ALW) : ''),
              overtimeAllowance: new FormControl(element.IS_OVERTIME_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_OVERTIME_ALW) : ''),
              rationAllowance: new FormControl(element.IS_RATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_RATION_ALW) : ''),
              refreshmentAllowance: new FormControl(element.IS_REFRESHMENT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_REFRESHMENT_ALW) : ''),
              retainerAllowance: new FormControl(element.IS_RETAINER_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_RETAINER_ALW) : ''),
              securityAllowance: new FormControl(element.IS_SECURITY_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_SECURITY_ALW) : ''),
              tiffinAllowance: new FormControl(element.IS_TIFFIN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TIFFIN_ALW) : ''),
              trainingAllowance: new FormControl(element.IS_TRAINING_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TRAINING_ALW) : ''),
              travelAllowance: new FormControl(element.IS_TRAVEL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TRAVEL_ALW) : ''),
              uniformAllowance: new FormControl(element.IS_UNIFORM_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_UNIFORM_ALW) : ''),
              washingAllowance: new FormControl(element.IS_WASHING_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_WASHING_ALW) : ''),
              otherAllowance: new FormControl(element.IS_OTHER_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_OTHER_ALW) : ''),

              entertainmentAllowance: new FormControl(element.IS_ENTERTAINMENT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_ENTERTAINMENT_ALW) : ''),
              leaveAllowance: new FormControl(element.IS_LEAVE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_LEAVE_ALW) : ''),
              freeConcessionalPassage: new FormControl(element.IS_FREE_OR_CONCESSIONAL_PASSAGE ? this.commaSeparator.currencySeparatorBD(element.IS_FREE_OR_CONCESSIONAL_PASSAGE) : ''),
              empContributionToRPF: new FormControl(element.IS_EMP_CONTRIBUTION_RPF ? this.commaSeparator.currencySeparatorBD(element.IS_EMP_CONTRIBUTION_RPF) : ''),
              interestAccruedOnRPF: new FormControl(element.IS_INTEREST_ACCRUED_RPF ? this.commaSeparator.currencySeparatorBD(element.IS_INTEREST_ACCRUED_RPF) : ''),

              // otherIfAnyHead: new FormControl(element.IS_OTHER_INCOME_HEAD ? element.IS_OTHER_INCOME_HEAD : ''),
              // otherIfAnyValue: new FormControl(element.IS_OTHER_INCOME_VALUE ? this.commaSeparator.currencySeparatorBD(element.IS_OTHER_INCOME_VALUE) : ''),
            });

            this.formArray.push(this.group);
            this.selectedSalary(this.formArray.length - 1);

            //#region for otherIfAny Section

            this.incArray[i] = false;
            let counter = 0;
            if (head.length > 0) {
              head.forEach((result, index) => {
                if (result.substring(0, 3) != "IS_") {
                  counter = counter + 1;
                  if (counter == 1) {
                    this.showInput13[i] = false;
                    this.delete_row_other_if_any(i, 0);
                  }
                  otherIfAnyHead = result;
                  if (result) {
                    otherIfAnyValue = this.getValueByKey(element, result);
                    this.other_if_any_List(i).push(this.fb.group({
                      otherIfAnyHead: new FormControl(otherIfAnyHead),
                      otherIfAnyValue: new FormControl(otherIfAnyValue ? this.commaSeparator.currencySeparatorBD(otherIfAnyValue) : ''),
                    }));
                    this.incArray[i] = true;
                  }
                }
              });
            }

            //#endregion

            if (empType == "1" || "2") {

              this.addMoreGetData = [];

              if (this.showInput27[i] == true) {
                this.addMoreGetData.push({ id: 27, text: "Arrear Pay" });
              }
              if (this.showInput33[i] == true) {
                this.addMoreGetData.push({ id: 33, text: "Appointment Pay" });
              }
              if (this.showInput38[i] == true) {
                this.addMoreGetData.push({ id: 38, text: "Batsman Allowance" });
              }
              if (this.showInput20[i] == true) {
                this.addMoreGetData.push({ id: 20, text: "Charge Allowance" });
              }
              if (this.showInput40[i] == true) {
                this.addMoreGetData.push({ id: 40, text: "Chawki Allowance" });
              }
              if (this.showInput41[i] == true) {
                this.addMoreGetData.push({ id: 41, text: "Compensatory Allowance" });
              }
              if (this.showInput39[i] == true) {
                this.addMoreGetData.push({ id: 39, text: "Conveyance Allowance" });
              }
              if (this.showInput42[i] == true) {
                this.addMoreGetData.push({ id: 42, text: "Cook Allowance" });
              }
              if (this.showInput43[i] == true) {
                this.addMoreGetData.push({ id: 43, text: "Daily Allowance" });
              }
              if (this.showInput18[i] == true) {
                this.addMoreGetData.push({ id: 18, text: "Dearness Allowance" });
              }
              if (this.showInput22[i] == true) {
                this.addMoreGetData.push({ id: 22, text: "Defence Services Allowance" });
              }
              if (this.showInput19[i] == true) {
                this.addMoreGetData.push({ id: 19, text: "Deputation Allowance" });
              }
              if (this.showInput44[i] == true) {
                this.addMoreGetData.push({ id: 44, text: "Disturbance Allowance" });
              }
              if (this.showInput45[i] == true) {
                this.addMoreGetData.push({ id: 45, text: "Domestic Aid Allowance" });
              }
              if (this.showInput14[i] == true) {
                this.addMoreGetData.push({ id: 14, text: "Education Allowance" });
              }
              if (this.showInput34[i] == true) {
                this.addMoreGetData.push({ id: 34, text: "Flying Pay" });
              }
              if (this.showInput24[i] == true) {
                this.addMoreGetData.push({ id: 24, text: "Foreign Allowance" });
              }
              if (this.showInput11[i] == true) {
                this.addMoreGetData.push({ id: 11, text: "Gratuity" });
              }
              if (this.showInput31[i] == true) {
                this.addMoreGetData.push({ id: 31, text: "GPF Interest" });
              }
              if (this.showInput35[i] == true) {
                this.addMoreGetData.push({ id: 35, text: "Good Conduct Pay" });
              }
              if (this.showInput26[i] == true) {
                this.addMoreGetData.push({ id: 26, text: "Hazardous Job Allowance" });
              }
              if (this.showInput46[i] == true) {
                this.addMoreGetData.push({ id: 46, text: "Haircut Allowance" });
              }
              if (this.showInput25[i] == true) {
                this.addMoreGetData.push({ id: 25, text: "Hill Allowance" });
              }
              if (this.showInput30[i] == true) {
                this.addMoreGetData.push({ id: 30, text: "Honorarium" });
              }
              if (this.showInput21[i] == true) {
                this.addMoreGetData.push({ id: 21, text: "Judicial Allowance" });
              }
              if (this.showInput47[i] == true) {
                this.addMoreGetData.push({ id: 47, text: "Medal Allowance" });
              }
              if (this.showInput15[i] == true) {
                this.addMoreGetData.push({ id: 15, text: "Mobile/cellphone Allowance" });
              }
              if (this.showInput4[i] == true) {
                this.addMoreGetData.push({ id: 4, text: "Overtime Allowance" });
              }
              if (this.showInput32[i] == true) {
                this.addMoreGetData.push({ id: 32, text: "Other Retirement Benefits" });
              }
              if (this.showInput12[i] == true) {
                this.addMoreGetData.push({ id: 12, text: "Pension" });
              }
              if (this.showInput29[i] == true) {
                this.addMoreGetData.push({ id: 29, text: "Personal Pay" });
              }
              if (this.showInput16[i] == true) {
                this.addMoreGetData.push({ id: 16, text: "Residential Telephone Encashment Allowance" });
              }
              if (this.showInput48[i] == true) {
                this.addMoreGetData.push({ id: 48, text: "Ration Allowance" });
              }
              if (this.showInput49[i] == true) {
                this.addMoreGetData.push({ id: 49, text: "Refreshment Allowance" });
              }
              if (this.showInput17[i] == true) {
                this.addMoreGetData.push({ id: 17, text: "Rest and Recreation Allowance" });
              }
              if (this.showInput50[i] == true) {
                this.addMoreGetData.push({ id: 50, text: "Retainer Allowance" });
              }
              if (this.showInput28[i] == true) {
                this.addMoreGetData.push({ id: 28, text: "Special Pay" });
              }
              if (this.showInput36[i] == true) {
                this.addMoreGetData.push({ id: 36, text: "SSG Pay" });
              }
              if (this.showInput51[i] == true) {
                this.addMoreGetData.push({ id: 51, text: "Security Allowance" });
              }
              if (this.showInput6[i] == true) {
                this.addMoreGetData.push({ id: 6, text: "TA/DA etc. not Expended" });
              }
              if (this.showInput52[i] == true) {
                this.addMoreGetData.push({ id: 52, text: "Tiffin Allowance" });
              }
              if (this.showInput23[i] == true) {
                this.addMoreGetData.push({ id: 23, text: "Transport Maintenance Allowance" });
              }
              if (this.showInput53[i] == true) {
                this.addMoreGetData.push({ id: 53, text: "Training Allowance" });
              }
              if (this.showInput54[i] == true) {
                this.addMoreGetData.push({ id: 54, text: "Travel Allowance" });
              }
              if (this.showInput55[i] == true) {
                this.addMoreGetData.push({ id: 55, text: "Uniform Allowance" });
              }
              if (this.showInput56[i] == true) {
                this.addMoreGetData.push({ id: 56, text: "Washing Allowance" });
              }
              if (this.showInput57[i] == true) {
                this.addMoreGetData.push({ id: 57, text: "Other Allowance" });
              }
              if (this.showInput37[i] == true) {
                this.addMoreGetData.push({ id: 37, text: "Worthiness Pay" });
              }
              if (this.showInput13[i] == true) {
                this.addMoreGetData.push({ id: 13, text: "Other, If Any (Give Detail)" });
              }

              this.data[this.formArray.controls.length - 1] = [];
              this.data[this.formArray.controls.length - 1] = this.addMoreGetData;

            }

            if (empType == "3") {
              this.addMoreGetData = [];
              if (this.showInput1[i] == true) {
                this.addMoreGetData.push({ id: 1, text: "Arrear Salary" });
              }

              if (this.showInput2[i] == true) {
                this.addMoreGetData.push({ id: 2, text: "Education Allowance" });
              }

              if (this.showInput3[i] == true) {
                this.addMoreGetData.push({ id: 3, text: "Entertainment Allowance" });
              }

              if (this.showInput9[i] == true) {
                this.addMoreGetData.push({ id: 9, text: "Employer’s Contribution to RPF" });
              }

              if (this.showInput11[i] == true) {
                this.addMoreGetData.push({ id: 11, text: "Gratuity" });
              }

              if (this.showInput10[i] == true) {
                this.addMoreGetData.push({ id: 10, text: "Interest Accrued on RPF" });
              }

              if (this.showInput5[i] == true) {
                this.addMoreGetData.push({ id: 5, text: "Leave Allowance" });
              }

              if (this.showInput7[i] == true) {
                this.addMoreGetData.push({ id: 7, text: "Other Bonus" });
              }

              if (this.showInput4[i] == true) {
                this.addMoreGetData.push({ id: 4, text: "Overtime Allowance" });
              }

              if (this.showInput12[i] == true) {
                this.addMoreGetData.push({ id: 12, text: "Pension" });
              }

              if (this.showInput6[i] == true) {
                this.addMoreGetData.push({ id: 6, text: "TA/DA etc. not Expended" });
              }

              // if (this.showInput8[i] == true) {
              //   this.addMoreGetData.push({ id: 8, text: "Free or Concessional Passage" });
              // }

              // if (this.showInput10[i] == true) {
              //   this.addMoreGetData.push({ id: 10, text: "Interest Accrued on RPF" });
              // }

              if (this.showInput15[i] == true) {
                this.addMoreGetData.push({ id: 13, text: "Other, If Any (Give Detail)" });
              }

              this.data[this.formArray.controls.length - 1] = [];
              this.data[this.formArray.controls.length - 1] = this.addMoreGetData;

            }

          });
          this.spinner.stop();
        }

        else {
          this.isVisibleForm = 0;
          this.navActiveSelect("1");
          this.insertFormGroupToArray(0);
          this.incomeType = of(true);
          this.getHeadsOfIncome();
          this.isVisibleAddSalBtn = true;
          this.getMainNavbar();
          this.mainNavActiveSelect("2");
          this.minDate = new Date(1972, 0, 1);
          this.maxDate = new Date();
          this.maxDate.setDate(this.maxDate.getDate());

          this.data[this.formArray.controls.length - 1] =
            [
              { id: 1, text: "Special Pay" },
              { id: 2, text: "Arrear Pay" },
              { id: 3, text: "Dearness Allowance" },
              { id: 4, text: "Allowance for Support Stuff" },
              { id: 5, text: "Leave Allowance" },
              { id: 6, text: "Honorarium/Reward/Fee" },
              { id: 7, text: "Overtime Allowance" },
              { id: 8, text: "Bonus/Ex-gratia" },
              { id: 9, text: "Other Allowances" },
              { id: 10, text: "Employer’s Contribution to a RPF" },
              { id: 11, text: "Interest Accrued on a RPF" },
              { id: 16, text: "Vehicle Maintenance Allowance" },
              { id: 15, text: "Pension" },
              // { id: 12, text: "Deemed Income for Transport Facility" },
              // { id: 13, text: "Deemed Income for Free Furnished/Unfurnished Accommodation" },
              { id: 14, text: "Other, If Any (Give Detail)" },
            ];
          this.spinner.stop();
        }
      },
        error => {
          this.spinner.stop();
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  getTaxExemptedIncomeData() {
    let reqObj =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    }
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-tax-exempted-income')
      .subscribe(result => {
        this.taxExemptedData = result.Data;
        //console.log('tax exempted data on salary page', this.taxExemptedData);
        this.taxExemptedData.forEach((element, index) => {
          if (element.TEI_TYPE === "other_exemption_under_sixth_schedule_part_a") {
            // debugger;
            //interest on gpf
            if (element.TEI_PARAGRAPH_NO === '4') {
              this.isInterestOnGPFInTaxExempted = true;
            }
            //pension
            if (element.TEI_PARAGRAPH_NO === '8') {
              this.isPensionInTaxExempted = true;
            }
            //gratuity
            if (element.TEI_PARAGRAPH_NO === '20') {
              this.isGratuityInTaxExempted = true;
            }
            //interest on rpf
            if (element.TEI_PARAGRAPH_NO === '25') {
              this.isInterestOnRPFInTaxExempted = true;
            }
          }
        });
      })
  }

  showSummary(k) {
    // debugger;
    // console.log('show summary');
    this.selectedSalary(k);
    this.hasSummary[k] = true;
    this.isSummary = true;
    this.salarySummaryGetData();
  }

  salarySummaryGetData(): Promise<void> {
    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/user-panel/return-view/salaries')
        .subscribe(result => {
          //console.log('Salary Summary data', result);
          if (result.length > 0) {
            this.salarySummaryData = result;

            // debugger;
            this.salarySummaryData.forEach(element => {
              element.gross = this.commaSeparator.currencySeparatorBD(element.gross.toString());
              element.exempted = this.commaSeparator.currencySeparatorBD(element.exempted.toString());
              element.taxable = this.commaSeparator.currencySeparatorBD(element.taxable.toString());
              if (element.titleKey === 'IS_SUM') {
                this.is_sum_total_gross = element.gross;
                this.is_sum_total_exempted = element.exempted;
                this.is_sum_total_taxable = element.taxable;
              }
            });

            // if (result.IS_SUM) {
            //   result.IS_SUM.forEach(element => {
            //     is_sum_total_gross=element.totalGross;
            //     is_sum_total_exempted=element.totalExempted;
            //     is_sum_total_taxable=element.totalTaxable;
            //   });
            // }
          }
          resolve();
          this.spinner.stop();
        },
          error => {
            reject();
            this.spinner.stop();
            //console.log(error['error'].errorMessage);
            this.salarySummaryData = [];
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });
    });
  }

  onChangeExemptedValue(titleKey, event: any) {
    // debugger;
    this.isChangedSalarySummary = true;
    if (parseInt(this.commaSeparator.removeComma(event.target.value, 0)) > 0) {
      // debugger;
      this.changedExemptedValue = this.salarySummaryData.find(item => item.titleKey === titleKey);
      this.newGross = this.commaSeparator.removeComma((this.changedExemptedValue).gross, 0);
      this.newExempted = this.commaSeparator.removeComma(event.target.value, 0);
      this.newTaxable = (this.newGross) - (this.newExempted ? this.newExempted : 0);
      if (parseInt(this.newExempted) <= parseInt(this.newGross)) {
        (this.changedExemptedValue).exempted = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0));
        (this.changedExemptedValue).taxable = this.commaSeparator.currencySeparatorBD(this.newTaxable);
        this.changedRegularAndTotalValue();
      }
      else {
        this.newGross = this.commaSeparator.removeComma((this.changedExemptedValue).gross, 0);
        (this.changedExemptedValue).exempted = this.commaSeparator.currencySeparatorBD(this.newGross);
        this.newExempted = this.commaSeparator.removeComma((this.changedExemptedValue).gross, 0);
        this.newTaxable = (this.newGross) - (this.newExempted);
        (this.changedExemptedValue).taxable = this.commaSeparator.currencySeparatorBD(this.newTaxable);
        this.toastr.warning('Exempted value can not be greater than gross value', '', {
          timeOut: 2500,
        });
        this.changedRegularAndTotalValue();
      }
    }

    else {
      this.changedExemptedValue = this.salarySummaryData.find(item => item.titleKey === titleKey);
      this.newGross = this.commaSeparator.removeComma((this.changedExemptedValue).gross, 0);
      this.newExempted = 0;
      this.newTaxable = (this.newGross) - (this.newExempted);
      (this.changedExemptedValue).exempted = (this.newExempted).toString();
      (this.changedExemptedValue).taxable = this.commaSeparator.currencySeparatorBD(this.newTaxable);
      this.changedRegularAndTotalValue();
    }
  }

  changedRegularAndTotalValue() {
    this.changedTotalRegularValue = this.salarySummaryData.find(item => item.titleKey === "IS_SUM_REG");
    this.changedTotalValue = this.salarySummaryData.find(item => item.titleKey === "IS_SUM");
    this.newTotalRegularExempted = 0;
    this.newTotalRegularTaxable = 0;
    this.newTotalSroExempted = 0;
    this.newTotalSroTaxable = 0;
    this.newTotalExempted = 0;
    this.newTotalTaxable = 0;
    this.salarySummaryData.forEach(element => {
      // debugger;
      if (element.titleKey != 'IS_SUM' && element.titleKey != 'IS_SUM_REG' && element.titleKey != 'IS_SUM_SRO') {
        this.newTotalRegularExempted += parseInt(this.commaSeparator.removeComma(element.exempted, 0));
        this.newTotalRegularTaxable += parseInt(this.commaSeparator.removeComma(element.taxable, 0));
      }
      else if (element.titleKey === 'IS_SUM_SRO') {
        this.newTotalSroExempted = parseInt(this.commaSeparator.removeComma(element.exempted, 0));
        this.newTotalSroTaxable = parseInt(this.commaSeparator.removeComma(element.taxable, 0));
      }

    });
    (this.changedTotalRegularValue).exempted = this.commaSeparator.currencySeparatorBD(this.newTotalRegularExempted);
    (this.changedTotalRegularValue).taxable = this.commaSeparator.currencySeparatorBD(this.newTotalRegularTaxable);
    this.newTotalExempted = (this.newTotalRegularExempted + this.newTotalSroExempted);
    this.newTotalTaxable = (this.newTotalRegularTaxable + this.newTotalSroTaxable);
    (this.changedTotalValue).exempted = this.commaSeparator.currencySeparatorBD(this.newTotalExempted);
    this.is_sum_total_exempted = (this.changedTotalValue).exempted;
    (this.changedTotalValue).taxable = this.commaSeparator.currencySeparatorBD(this.newTotalTaxable);
    this.is_sum_total_taxable = (this.changedTotalValue).taxable;
    //console.log('updatedSummary', this.salarySummaryData);

  }
  storeAdditionalItems(item: any) {
    // debugger;
    //  console.log(item);
  }

  showInputFun(i, value: any, popup: TemplateRef<any>) {
    // debugger;
    switch (value) {
      case "1":
        if (!this.showInput1[i]) {
          this.item = 1;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput1[i] = !this.showInput1[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Arrear Salary"),
            1
          );
        }
        break;
      case "2":
        if (!this.showInput2[i]) {
          this.item = 2;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput2[i] = !this.showInput2[i];
          this.data[i].splice(
            this.data[i].findIndex(
              (x) => x.text === "Education Allowance"
            ),
            1
          );
        }
        break;
      case "3":
        if (!this.showInput3[i]) {
          this.item = 3;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput3[i] = !this.showInput3[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Entertainment Allowance"),
            1
          );
        }
        break;
      case "4":
        if (!this.showInput4[i]) {
          this.item = 4;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput4[i] = !this.showInput4[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Overtime Allowance"),
            1
          );
        }
        break;
      case "5":
        if (!this.showInput5[i]) {
          this.item = 5;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput5[i] = !this.showInput5[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Leave Allowance"),
            1
          );
        }
        break;
      case "6":
        if (!this.showInput6[i]) {
          this.item = 6;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput6[i] = !this.showInput6[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "TA/DA etc. not Expended"),
            1
          );
        }
        break;
      case "7":
        if (!this.showInput7[i]) {
          this.item = 7;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput7[i] = !this.showInput7[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Other Bonus"),
            1
          );
        }
        break;
      case "8":
        if (!this.showInput8[i]) {
          this.item = 8;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput8[i] = !this.showInput8[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Free or Concessional Passage"),
            1
          );
        }
        break;
      case "9":
        if (!this.showInput9[i]) {
          this.item = 9;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput9[i] = !this.showInput9[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Employer’s Contribution to RPF"),
            1
          );
        }
        break;
      case "10":
        if (!this.showInput10[i]) {
          this.item = 10;
          this.modalRef = this.modalService.show(popup);
        } else {
          if (this.isInterestOnRPFInTaxExempted) {
            this.toastr.warning('Interest Accrued on RPF already exists in tax exempted income!');
            this.removeInterestOnRPF(i);
          }
          else {
            this.item = 0;
            this.showInput10[i] = !this.showInput10[i];
            this.data[i].splice(
              this.data[i].findIndex((x) => x.text === "Interest Accrued on RPF"),
              1
            );
          }
        }
        break;
      case "11":
        if (!this.showInput11[i]) {
          this.item = 11;
          this.modalRef = this.modalService.show(popup);
        } else {
          if (this.isGratuityInTaxExempted) {
            this.toastr.warning('Gratuity already exists in tax exempted income!');
            this.removeGratuity(i);
          }
          else {
            this.item = 0;
            this.showInput11[i] = !this.showInput11[i];
            this.data[i].splice(
              this.data[i].findIndex((x) => x.text === "Gratuity"),
              1
            );
          }

        }
        break;
      case "12":
        if (!this.showInput12[i]) {
          this.item = 12;
          this.modalRef = this.modalService.show(popup);
        } else {
          if (this.isPensionInTaxExempted) {
            this.toastr.warning('Pension already exists in tax exempted income!');
            this.removePension(i);
          }
          else {
            this.item = 0;
            this.showInput12[i] = !this.showInput12[i];
            this.data[i].splice(
              this.data[i].findIndex((x) => x.text === "Pension"),
              1
            );
          }
        }
        break;
      case "13":
        // if (!this.showInput13[i]) {
        //   this.item = 13;
        //   this.modalRef = this.modalService.show(popup);
        // } else {
        //   this.item = 0;
        //   this.showInput13[i] = !this.showInput13[i];
        //   this.data[i].splice(
        //     this.data[i].findIndex((x) => x.text === "Other, If Any (Give Detail)"),
        //     1
        //   );
        // }
        // break;

        //#region for otherIfAny Section
        this.expArray = [];
        this.item = 0;
        this.showInput13[i] = false;
        this.add_row_other_if_any(i);
        this.data[i] = this.data[i];
        this.data[i].splice(
          this.data[i].findIndex((x) => x.text === "Other, If Any (Give Detail)"),
          1
        );
        this.expArray = this.data[i];
        this.expArray.push({ id: 13, text: "Other, If Any (Give Detail)" });
        this.data[i] = this.expArray;
        break;
      //#endregion

      //non-govt end
      case "14":
        if (!this.showInput14[i]) {
          this.item = 14;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput14[i] = !this.showInput14[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Education Allowance"),
            1
          );
        }
        break;
      case "15":
        if (!this.showInput15[i]) {
          this.item = 15;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput15[i] = !this.showInput15[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Mobile/cellphone Allowance"),
            1
          );
        }
        break;
      case "16":
        if (!this.showInput16[i]) {
          this.item = 16;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput16[i] = !this.showInput16[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Residential Telephone Encashment Allowance"),
            1
          );
        }
        break;
      case "17":
        if (!this.showInput17[i]) {
          this.item = 17;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput17[i] = !this.showInput17[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Rest and Recreation Allowance"),
            1
          );
        }
        break;
      case "18":
        if (!this.showInput18[i]) {
          this.item = 18;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput18[i] = !this.showInput18[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Dearness Allowance"),
            1
          );
        }
        break;
      case "19":
        if (!this.showInput19[i]) {
          this.item = 19;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput19[i] = !this.showInput19[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Deputation Allowance"),
            1
          );
        }
        break;
      case "20":
        if (!this.showInput20[i]) {
          this.item = 20;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput20[i] = !this.showInput20[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Charge Allowance"),
            1
          );
        }
        break;
      case "21":
        if (!this.showInput21[i]) {
          this.item = 21;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput21[i] = !this.showInput21[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Judicial Allowance"),
            1
          );
        }
        break;
      case "22":
        if (!this.showInput22[i]) {
          this.item = 22;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput22[i] = !this.showInput22[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Defence Services Allowance"),
            1
          );
        }
        break;
      case "23":
        if (!this.showInput23[i]) {
          this.item = 23;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput23[i] = !this.showInput23[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Transport Maintenance Allowance"),
            1
          );
        }
        break;
      case "24":
        if (!this.showInput24[i]) {
          this.item = 24;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput24[i] = !this.showInput24[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Foreign Allowance"),
            1
          );
        }
        break;
      case "25":
        if (!this.showInput25[i]) {
          this.item = 25;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput25[i] = !this.showInput25[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Hill Allowance"),
            1
          );
        }
        break;
      case "26":
        if (!this.showInput26[i]) {
          this.item = 26;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput26[i] = !this.showInput26[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Hazardous Job Allowance"),
            1
          );
        }
        break;
      case "27":
        if (!this.showInput27[i]) {
          this.item = 27;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput27[i] = !this.showInput27[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Arrear Pay"),
            1
          );
        }
        break;
      case "28":
        if (!this.showInput28[i]) {
          this.item = 28;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput28[i] = !this.showInput28[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Special Pay"),
            1
          );
        }
        break;
      case "29":
        if (!this.showInput29[i]) {
          this.item = 29;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput29[i] = !this.showInput29[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Personal Pay"),
            1
          );
        }
        break;
      case "30":
        if (!this.showInput30[i]) {
          this.item = 30;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput30[i] = !this.showInput30[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Honorarium"),
            1
          );
        }
        break;
      case "31":
        if (!this.showInput31[i]) {
          this.item = 31;
          this.modalRef = this.modalService.show(popup);
        }
        else {
          if (this.isInterestOnGPFInTaxExempted) {
            this.toastr.warning('GPF Interest already exists in tax exempted income!');
            this.removeInterestOnGPF(i);
          }
          else {
            this.item = 0;
            this.showInput31[i] = !this.showInput31[i];
            this.data[i].splice(
              this.data[i].findIndex((x) => x.text === "GPF Interest"),
              1
            );
          }
        }
        break;
      case "32":
        if (!this.showInput32[i]) {
          this.item = 32;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput32[i] = !this.showInput32[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Other Retirement Benefits"),
            1
          );
        }
        break;
      case "33":
        if (!this.showInput33[i]) {
          this.item = 33;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput33[i] = !this.showInput33[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Appointment Pay"),
            1
          );
        }
        break;
      case "34":
        if (!this.showInput34[i]) {
          this.item = 34;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput34[i] = !this.showInput34[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Flying Pay"),
            1
          );
        }
        break;
      case "35":
        if (!this.showInput35[i]) {
          this.item = 35;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput35[i] = !this.showInput35[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Good Conduct Pay"),
            1
          );
        }
        break;
      case "36":
        if (!this.showInput36[i]) {
          this.item = 36;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput36[i] = !this.showInput36[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "SSG Pay"),
            1
          );
        }
        break;
      case "37":
        if (!this.showInput37[i]) {
          this.item = 37;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput37[i] = !this.showInput37[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Worthiness Pay"),
            1
          );
        }
        break;
      case "38":
        if (!this.showInput38[i]) {
          this.item = 38;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput38[i] = !this.showInput38[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Batsman Allowance"),
            1
          );
        }
        break;
      case "39":
        if (!this.showInput39[i]) {
          this.item = 39;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput39[i] = !this.showInput39[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Conveyance Allowance"),
            1
          );
        }
        break;
      case "40":
        if (!this.showInput40[i]) {
          this.item = 40;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput40[i] = !this.showInput40[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Chawki Allowance"),
            1
          );
        }
        break;
      case "41":
        if (!this.showInput41[i]) {
          this.item = 41;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput41[i] = !this.showInput41[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Compensatory Allowance"),
            1
          );
        }
        break;
      case "42":
        if (!this.showInput42[i]) {
          this.item = 42;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput42[i] = !this.showInput42[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Cook Allowance"),
            1
          );
        }
        break;
      case "43":
        if (!this.showInput43[i]) {
          this.item = 43;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput43[i] = !this.showInput43[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Daily Allowance"),
            1
          );
        }
        break;
      case "44":
        if (!this.showInput44[i]) {
          this.item = 44;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput44[i] = !this.showInput44[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Disturbance Allowance"),
            1
          );
        }
        break;
      case "45":
        if (!this.showInput45[i]) {
          this.item = 45;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput45[i] = !this.showInput45[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Domestic Aid Allowance"),
            1
          );
        }
        break;
      case "46":
        if (!this.showInput46[i]) {
          this.item = 46;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput46[i] = !this.showInput46[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Haircut Allowance"),
            1
          );
        }
        break;
      case "47":
        if (!this.showInput47[i]) {
          this.item = 47;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput47[i] = !this.showInput47[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Medal Allowance"),
            1
          );
        }
        break;
      case "48":
        if (!this.showInput48[i]) {
          this.item = 48;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput48[i] = !this.showInput48[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Ration Allowance"),
            1
          );
        }
        break;
      case "49":
        if (!this.showInput49[i]) {
          this.item = 49;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput49[i] = !this.showInput49[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Refreshment Allowance"),
            1
          );
        }
        break;
      case "50":
        if (!this.showInput50[i]) {
          this.item = 50;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput50[i] = !this.showInput50[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Retainer Allowance"),
            1
          );
        }
        break;
      case "51":
        if (!this.showInput51[i]) {
          this.item = 51;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput51[i] = !this.showInput51[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Security Allowance"),
            1
          );
        }
        break;
      case "52":
        if (!this.showInput52[i]) {
          this.item = 52;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput52[i] = !this.showInput52[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Tiffin Allowance"),
            1
          );
        }
        break;
      case "53":
        if (!this.showInput53[i]) {
          this.item = 53;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput53[i] = !this.showInput53[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Training Allowance"),
            1
          );
        }
        break;
      case "54":
        if (!this.showInput54[i]) {
          this.item = 54;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput54[i] = !this.showInput54[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Travel Allowance"),
            1
          );
        }
        break;
      case "55":
        if (!this.showInput55[i]) {
          this.item = 55;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput55[i] = !this.showInput55[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Uniform Allowance"),
            1
          );
        }
        break;
      case "56":
        if (!this.showInput56[i]) {
          this.item = 56;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput56[i] = !this.showInput56[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Washing Allowance"),
            1
          );
        }
        break;
      case "57":
        if (!this.showInput57[i]) {
          this.item = 57;
          this.modalRef = this.modalService.show(popup);
        } else {
          this.item = 0;
          this.showInput57[i] = !this.showInput57[i];
          this.data[i].splice(
            this.data[i].findIndex((x) => x.text === "Other Allowance"),
            1
          );
        }
        break;
      default:
        break;
    }
  }

  popupRemoveOnClick(i) {
    //  debugger;
    // console.log(i);
    if (this.item == 1) {
      this.showInput1[i] = !this.showInput1[i];
      this.formArray.controls[i].value.arrearPay = '';
      this.data[i].push({ id: 1, text: "Arrear Salary" });
    } else if (this.item == 2) {
      this.showInput2[i] = !this.showInput2[i];
      this.formArray.controls[i].value.educationAllowance = '';
      this.data[i].push({ id: 2, text: "Education Allowance" });
    } else if (this.item == 3) {
      this.showInput3[i] = !this.showInput3[i];
      this.formArray.controls[i].value.entertainmentAllowance = '';
      this.data[i].push({ id: 3, text: "Entertainment Allowance" });
    } else if (this.item == 4) {
      this.showInput4[i] = !this.showInput4[i];
      this.formArray.controls[i].value.overtimeAllowance = '';
      this.data[i].push({ id: 4, text: "Overtime Allowance" });
    } else if (this.item == 5) {
      this.showInput5[i] = !this.showInput5[i];
      this.formArray.controls[i].value.leaveAllowance = '';
      this.data[i].push({ id: 5, text: "Leave Allowance" });
    } else if (this.item == 6) {
      this.showInput6[i] = !this.showInput6[i];
      this.formArray.controls[i].value.tadaExpended = '';
      this.data[i].push({ id: 6, text: "TA/DA etc. not Expended" });
    } else if (this.item == 7) {
      this.showInput7[i] = !this.showInput7[i];
      this.formArray.controls[i].value.otherAllowance = '';
      this.data[i].push({ id: 7, text: "Other Bonus" });
    } else if (this.item == 8) {
      this.showInput8[i] = !this.showInput8[i];
      this.formArray.controls[i].value.freeConcessionalPassage = '';
      this.data[i].push({ id: 8, text: "Free or Concessional Passage" });
    } else if (this.item == 9) {
      this.showInput9[i] = !this.showInput9[i];
      this.formArray.controls[i].value.empContributionToRPF = '';
      this.data[i].push({ id: 9, text: "Employer’s Contribution to RPF" });
    } else if (this.item == 10) {
      this.showInput10[i] = !this.showInput10[i];
      this.formArray.controls[i].value.interestAccruedOnRPF = '';
      this.data[i].push({ id: 10, text: "Interest Accrued on RPF" });
    } else if (this.item == 11) {
      this.showInput11[i] = !this.showInput11[i];
      this.formArray.controls[i].value.gratuity = '';
      this.data[i].push({ id: 11, text: "Gratuity" });
    } else if (this.item == 12) {
      this.showInput12[i] = !this.showInput12[i];
      this.formArray.controls[i].value.pension = '';
      this.data[i].push({ id: 12, text: "Pension" });
    } else if (this.item == 13) {
      this.showInput13[i] = !this.showInput13[i];
      // this.formArray.controls[i].value.otherIfAnyHead = '';
      // this.formArray.controls[i].value.otherIfAnyValue = '';
      this.data[i].push({ id: 13, text: "Other, If Any (Give Detail)" });
    } else if (this.item == 14) {
      this.showInput14[i] = !this.showInput14[i];
      this.formArray.controls[i].value.educationAllowance = '';
      this.data[i].push({ id: 14, text: "Education Allowance" });
    } else if (this.item == 15) {
      this.showInput15[i] = !this.showInput15[i];
      this.formArray.controls[i].value.mobileAllowance = '';
      this.data[i].push({ id: 15, text: "Mobile/cellphone Allowance" });
    } else if (this.item == 16) {
      this.showInput16[i] = !this.showInput16[i];
      this.formArray.controls[i].value.telephoneAllowance = '';
      this.data[i].push({ id: 16, text: "Residential Telephone Encashment Allowance" });
    }
    else if (this.item == 17) {
      this.showInput17[i] = !this.showInput17[i];
      this.formArray.controls[i].value.recreationAllowance = '';
      this.data[i].push({ id: 17, text: "Rest and Recreation Allowance" });
    }
    else if (this.item == 18) {
      this.showInput18[i] = !this.showInput18[i];
      this.formArray.controls[i].value.dearnessAllowance = '';
      this.data[i].push({ id: 18, text: "Dearness Allowance" });
    }
    else if (this.item == 19) {
      this.showInput19[i] = !this.showInput19[i];
      this.formArray.controls[i].value.deputationAllowance = '';
      this.data[i].push({ id: 19, text: "Deputation Allowance" });
    }
    else if (this.item == 20) {
      this.showInput20[i] = !this.showInput20[i];
      this.formArray.controls[i].value.chargeAllowance = '';
      this.data[i].push({ id: 20, text: "Charge Allowance" });
    }
    else if (this.item == 21) {
      this.showInput21[i] = !this.showInput21[i];
      this.formArray.controls[i].value.judicialAllowance = '';
      this.data[i].push({ id: 21, text: "Judicial Allowance" });
    }
    else if (this.item == 22) {
      this.showInput22[i] = !this.showInput22[i];
      this.formArray.controls[i].value.defenseServiceAllowance = '';
      this.data[i].push({ id: 22, text: "Defence Services Allowance" });
    }
    else if (this.item == 23) {
      this.showInput23[i] = !this.showInput23[i];
      this.formArray.controls[i].value.transportMaintenanceAllowance = '';
      this.data[i].push({ id: 23, text: "Transport Maintenance Allowance" });
    } else if (this.item == 24) {
      this.showInput24[i] = !this.showInput24[i];
      this.formArray.controls[i].value.foreignAllowance = '';
      this.data[i].push({ id: 24, text: "Foreign Allowance" });
    } else if (this.item == 25) {
      this.showInput25[i] = !this.showInput25[i];
      this.formArray.controls[i].value.hillAllowance = '';
      this.data[i].push({ id: 25, text: "Hill Allowance" });
    } else if (this.item == 26) {
      this.showInput26[i] = !this.showInput26[i];
      this.formArray.controls[i].value.hazardousJobAllowance = '';
      this.data[i].push({ id: 26, text: "Hazardous Job Allowance" });
    } else if (this.item == 27) {
      this.showInput27[i] = !this.showInput27[i];
      this.formArray.controls[i].value.arrearPay = '';
      this.data[i].push({ id: 27, text: "Arrear Pay" });
    } else if (this.item == 28) {
      this.showInput28[i] = !this.showInput28[i];
      this.formArray.controls[i].value.speacialPay = '';
      this.data[i].push({ id: 28, text: "Special Pay" });
    } else if (this.item == 29) {
      this.showInput29[i] = !this.showInput29[i];
      this.formArray.controls[i].value.personalPay = '';
      this.data[i].push({ id: 29, text: "Personal Pay" });
    } else if (this.item == 30) {
      this.showInput30[i] = !this.showInput30[i];
      this.formArray.controls[i].value.honorariumRewardFee = '';
      this.data[i].push({ id: 30, text: "Honorarium" });
    } else if (this.item == 31) {
      this.showInput31[i] = !this.showInput31[i];
      this.formArray.controls[i].value.gpfInterest = '';
      this.data[i].push({ id: 31, text: "GPF Interest" });
    } else if (this.item == 32) {
      this.showInput32[i] = !this.showInput32[i];
      this.formArray.controls[i].value.otherRetirementBenefits = '';
      this.data[i].push({ id: 32, text: "Other Retirement Benefits" });
    } else if (this.item == 33) {
      this.showInput33[i] = !this.showInput33[i];
      this.formArray.controls[i].value.appointmentPay = '';
      this.data[i].push({ id: 33, text: "Appointment Pay" });
    } else if (this.item == 34) {
      this.showInput34[i] = !this.showInput34[i];
      this.formArray.controls[i].value.flyingPay = '';
      this.data[i].push({ id: 34, text: "Flying Pay" });
    } else if (this.item == 35) {
      this.showInput35[i] = !this.showInput35[i];
      this.formArray.controls[i].value.goodConductPay = '';
      this.data[i].push({ id: 35, text: "Good Conduct Pay" });
    } else if (this.item == 36) {
      this.showInput36[i] = !this.showInput36[i];
      this.formArray.controls[i].value.ssgPay = '';
      this.data[i].push({ id: 36, text: "SSG Pay" });
    } else if (this.item == 37) {
      this.showInput37[i] = !this.showInput37[i];
      this.formArray.controls[i].value.worthynessPay = '';
      this.data[i].push({ id: 37, text: "Worthiness Pay" });
    } else if (this.item == 38) {
      this.showInput38[i] = !this.showInput38[i];
      this.formArray.controls[i].value.batsmanPay = '';
      this.data[i].push({ id: 38, text: "Batsman Allowance" });
    } else if (this.item == 39) {
      this.showInput39[i] = !this.showInput39[i];
      this.formArray.controls[i].value.conveyanceAllowance = '';
      this.data[i].push({ id: 39, text: "Conveyance Allowance" });
    } else if (this.item == 40) {
      this.showInput40[i] = !this.showInput40[i];
      this.formArray.controls[i].value.chawkiAllowance = '';
      this.data[i].push({ id: 40, text: "Chawki Allowance" });
    }
    else if (this.item == 41) {
      this.showInput41[i] = !this.showInput41[i];
      this.formArray.controls[i].value.compensatoryAllowance = '';
      this.data[i].push({ id: 41, text: "Compensatory Allowance" });
    }
    else if (this.item == 42) {
      this.showInput42[i] = !this.showInput42[i];
      this.formArray.controls[i].value.cookAllowance = '';
      this.data[i].push({ id: 42, text: "Cook Allowance" });
    }
    else if (this.item == 43) {
      this.showInput43[i] = !this.showInput43[i];
      this.formArray.controls[i].value.dailyAllowance = '';
      this.data[i].push({ id: 43, text: "Daily Allowance" });
    }
    else if (this.item == 44) {
      this.showInput44[i] = !this.showInput44[i];
      this.formArray.controls[i].value.disturbanceAllowance = '';
      this.data[i].push({ id: 44, text: "Disturbance Allowance" });
    }
    else if (this.item == 45) {
      this.showInput45[i] = !this.showInput45[i];
      this.formArray.controls[i].value.domesticAidAllowance = '';
      this.data[i].push({ id: 45, text: "Domestic Aid Allowance" });
    }
    else if (this.item == 46) {
      this.showInput46[i] = !this.showInput46[i];
      this.formArray.controls[i].value.haircutAllowance = '';
      this.data[i].push({ id: 46, text: "Haircut Allowance" });
    }
    else if (this.item == 47) {
      this.showInput47[i] = !this.showInput47[i];
      this.formArray.controls[i].value.medalAllowance = '';
      this.data[i].push({ id: 47, text: "Medal Allowance" });
    }
    else if (this.item == 48) {
      this.showInput48[i] = !this.showInput48[i];
      this.formArray.controls[i].value.rationAllowance = '';
      this.data[i].push({ id: 48, text: "Ration Allowance" });
    }
    else if (this.item == 49) {
      this.showInput49[i] = !this.showInput49[i];
      this.formArray.controls[i].value.refreshmentAllowance = '';
      this.data[i].push({ id: 49, text: "Refreshment Allowance" });
    }
    else if (this.item == 50) {
      this.showInput50[i] = !this.showInput50[i];
      this.formArray.controls[i].value.retainerAllowance = '';
      this.data[i].push({ id: 50, text: "Retainer Allowance" });
    }
    else if (this.item == 51) {
      this.showInput51[i] = !this.showInput51[i];
      this.formArray.controls[i].value.securityAllowance = '';
      this.data[i].push({ id: 51, text: "Security Allowance" });
    }
    else if (this.item == 52) {
      this.showInput52[i] = !this.showInput52[i];
      this.formArray.controls[i].value.tiffinAllowance = '';
      this.data[i].push({ id: 52, text: "Tiffin Allowance" });
    }
    else if (this.item == 53) {
      this.showInput53[i] = !this.showInput53[i];
      this.formArray.controls[i].value.trainingAllowance = '';
      this.data[i].push({ id: 53, text: "Training Allowance" });
    }
    else if (this.item == 54) {
      this.showInput54[i] = !this.showInput54[i];
      this.formArray.controls[i].value.travelAllowance = '';
      this.data[i].push({ id: 54, text: "Travel Allowance" });
    }
    else if (this.item == 55) {
      this.showInput55[i] = !this.showInput55[i];
      this.formArray.controls[i].value.uniformAllowance = '';
      this.data[i].push({ id: 55, text: "Uniform Allowance" });
    }
    else if (this.item == 56) {
      this.showInput56[i] = !this.showInput56[i];
      this.formArray.controls[i].value.washingAllowance = '';
      this.data[i].push({ id: 56, text: "Washing Allowance" });
    }
    else if (this.item == 57) {
      this.showInput57[i] = !this.showInput57[i];
      this.formArray.controls[i].value.otherAllowance = '';
      this.data[i].push({ id: 57, text: "Other Allowance" });
    }
    this.modalRef.hide();
  }

  popupKeepOnClick() {
    this.modalRef.hide();
  }

  navActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.navActive = x;
  }

  scroll(e1: HTMLElement) {
    e1.scrollIntoView({ behavior: "smooth" });
  }

  removeOption() {
    this.formArray.removeAt(this.formArray.length - 1);
    if (this.formArray.length === this.isVisibleForm) {
      this.isVisibleForm = this.formArray.controls.length - 1;
    }
  }

  employmentTypeChange(event: any, i) {
    this.clearExistingFormData(i);
    this.initializeErrorIndexes(i);
    // debugger;
    this.isDataFound[i] = false;
    this.onGovtToNonGovt[i] = false;

    this.checkedSRO[i] = false;
    this.isCheckedRentFreeAccommodation[i] = false;
    this.isCheckedAccommodationAtConcessRate[i] = false;
    this.isCheckedVehicleFacilityProvided[i] = false;
    this.isCheckedOtherNonCashBenefit[i] = false;

    if (event.target.value === "1") {
      this.isVisibleIncomeTab = false;
      this.isVisibleAddSalBtn = false;

      //As Ibas++ API is not integrated yet, the below code is for that reason.
      this.onGovtToNonGovt[i] = true;
      //end

      //#region fetch Ibas++ Salary Data

      // if (this.govIbasGetData[i] != 'true') {

      //   //#region fetch Ibas++ Salary Data from mock Api

      //   this.spinner.start();

      //   // this.apiService.get(this.serviceUrl + 'api/salary-data/ibas/' + this.userTin + '/2021-2022')
      //   this.httpClient.get("assets/IbasSalary/" + this.userTin + ".json")
      //     .subscribe(result => {
      //       console.log('iBas++:', result);
      //       if (result != null) {
      //         this.onGovtToNonGovt[i] = false;
      //         let IbasData: any;
      //         IbasData = result["salary"];
      //         // IbasData = result;


      //         // console.log('IbasData from Api', IbasData);

      //         //#region Assign value into input field

      //         //#region initialize show input fun

      //         this.showInput1[i] = true;
      //         this.showInput2[i] = true;
      //         this.showInput3[i] = true;
      //         this.showInput4[i] = true;
      //         this.showInput5[i] = true;
      //         this.showInput6[i] = true;
      //         this.showInput7[i] = true;
      //         this.showInput8[i] = true;
      //         this.showInput9[i] = true;
      //         this.showInput10[i] = true;
      //         this.showInput11[i] = true;
      //         this.showInput12[i] = true;
      //         this.showInput13[i] = true;
      //         this.showInput14[i] = true;
      //         this.showInput15[i] = true;
      //         this.showInput16[i] = true;
      //         this.showInput17[i] = true;
      //         this.showInput18[i] = true;
      //         this.showInput19[i] = true;
      //         this.showInput20[i] = true;
      //         this.showInput21[i] = true;
      //         this.showInput22[i] = true;
      //         this.showInput23[i] = true;
      //         this.showInput24[i] = true;
      //         this.showInput25[i] = true;
      //         this.showInput26[i] = true;
      //         this.showInput27[i] = true;
      //         this.showInput28[i] = true;
      //         this.showInput29[i] = true;
      //         this.showInput30[i] = true;
      //         this.showInput31[i] = true;
      //         this.showInput32[i] = true;
      //         this.showInput33[i] = true;
      //         this.showInput34[i] = true;
      //         this.showInput35[i] = true;
      //         this.showInput36[i] = true;
      //         this.showInput37[i] = true;
      //         this.showInput38[i] = true;
      //         this.showInput39[i] = true;
      //         this.showInput40[i] = true;
      //         this.showInput41[i] = true;
      //         this.showInput42[i] = true;
      //         this.showInput43[i] = true;
      //         this.showInput44[i] = true;
      //         this.showInput45[i] = true;
      //         this.showInput46[i] = true;
      //         this.showInput47[i] = true;
      //         this.showInput48[i] = true;
      //         this.showInput49[i] = true;
      //         this.showInput50[i] = true;
      //         this.showInput51[i] = true;
      //         this.showInput52[i] = true;
      //         this.showInput53[i] = true;
      //         this.showInput54[i] = true;
      //         this.showInput55[i] = true;
      //         this.showInput56[i] = true;
      //         this.showInput57[i] = true;

      //         //#endregion

      //         // debugger;
      //         IbasData.forEach(element => {

      //           if (element.IS_OFC_NAME) {
      //             this.salaryName[i] = element.IS_OFC_NAME;
      //             this.formArray.controls[this.formArray.length - 1].patchValue({
      //               salaryName: this.salaryName[i],
      //             });
      //           }
      //           if (!element.IS_OFC_NAME) {
      //             let x: number = 1;
      //             x = x + i;
      //             this.salaryName[i] = 'Salary' + ' ' + x;
      //             this.formArray.controls[this.formArray.length - 1].patchValue({
      //               salaryName: this.salaryName[i],
      //             });
      //           }

      //           //#region select 2 show/hide
      //           if (element.IS_ARREAR_PAY) {
      //             this.showInput1[i] = false;
      //           }
      //           if (element.IS_EDUCATION_ALW) {
      //             this.showInput2[i] = false;
      //             this.showInput14[i] = false;
      //           }
      //           if (element.IS_ENTERTAINMENT_ALW) {
      //             this.showInput3[i] = false;
      //           }
      //           if (element.IS_OVERTIME_ALW) {
      //             this.showInput4[i] = false;
      //           }
      //           if (element.IS_LEAVE_ALW) {
      //             this.showInput5[i] = false;
      //           }
      //           if (element.IS_TADA_NOT_EXPENDED) {
      //             this.showInput6[i] = false;
      //           }
      //           if (element.IS_OTHER_ALW) {
      //             this.showInput7[i] = false;
      //             this.showInput57[i] = false;
      //           }
      //           if (element.IS_FREE_OR_CONCESSIONAL_PASSAGE) {
      //             this.showInput8[i] = false;
      //           }
      //           if (element.IS_EMP_CONTRIBUTION_RPF) {
      //             this.showInput9[i] = false;
      //           }
      //           if (element.IS_INTEREST_ACCRUED_RPF) {
      //             this.showInput10[i] = false;
      //           }

      //           if (element.IS_GRATUITY) {
      //             this.showInput11[i] = false;
      //           }
      //           if (element.IS_PENSION) {
      //             this.showInput12[i] = false;
      //           }
      //           if (element.IS_OTHER_INCOME_HEAD || element.IS_OTHER_INCOME_VALUE) {
      //             this.showInput13[i] = false;
      //           }
      //           if (element.IS_MOBILE_ALW) {
      //             this.showInput15[i] = false;
      //           }
      //           if (element.IS_RESIDENTIAL_TELEPHN_ALW) {
      //             this.showInput16[i] = false;
      //           }
      //           if (element.IS_REST_RECREATION_ALW) {
      //             this.showInput17[i] = false;
      //           }
      //           if (element.IS_DEARNESS_ALW) {
      //             this.showInput18[i] = false;
      //           }
      //           if (element.IS_DEPUTATION_ALW) {
      //             this.showInput19[i] = false;
      //           }
      //           if (element.IS_CHARGE_ALW) {
      //             this.showInput20[i] = false;
      //           }
      //           if (element.IS_JUDICIAL_ALW) {
      //             this.showInput21[i] = false;
      //           }
      //           if (element.IS_DEFENSE_SERVICE_ALW) {
      //             this.showInput22[i] = false;
      //           }
      //           if (element.IS_TRANSPORT_MAINTENANCE_ALW) {
      //             this.showInput23[i] = false;
      //           }
      //           if (element.IS_FOREIGN_ALW) {
      //             this.showInput24[i] = false;
      //           }
      //           if (element.IS_HILL_ALW) {
      //             this.showInput25[i] = false;
      //           }
      //           if (element.IS_HAZARDOUS_JOB_ALW) {
      //             this.showInput26[i] = false;
      //           }
      //           if (element.IS_ARREAR_PAY) {
      //             this.showInput27[i] = false;
      //           }
      //           if (element.IS_SPECIAL_PAY) {
      //             this.showInput28[i] = false;
      //           }
      //           if (element.IS_PERSONAL_PAY) {
      //             this.showInput29[i] = false;
      //           }
      //           if (element.IS_HONORARIUM_REWARD_FEE) {
      //             this.showInput30[i] = false;
      //           }
      //           if (element.IS_GPF_INTEREST) {
      //             this.showInput31[i] = false;
      //           }
      //           if (element.IS_OTHER_RETIREMENT_BENEFITS) {
      //             this.showInput32[i] = false;
      //           }

      //           if (element.IS_APPOINTMENT_PAY) {
      //             this.showInput33[i] = false;
      //           }
      //           if (element.IS_FLYING_PAY) {
      //             this.showInput34[i] = false;
      //           }
      //           if (element.IS_GOOD_CONDUCT_PAY) {
      //             this.showInput35[i] = false;
      //           }

      //           if (element.IS_SSG_PAY) {
      //             this.showInput36[i] = false;
      //           }
      //           if (element.IS_WORTHYNESS_PAY) {
      //             this.showInput37[i] = false;
      //           }
      //           if (element.IS_BATSMAN_ALW) {
      //             this.showInput38[i] = false;
      //           }

      //           if (element.IS_CONVEYANCE_ALW) {
      //             this.showInput39[i] = false;
      //           }
      //           if (element.IS_CHAWKI_ALW) {
      //             this.showInput40[i] = false;
      //           }
      //           if (element.IS_COMPENSATORY_ALW) {
      //             this.showInput41[i] = false;
      //           }

      //           if (element.IS_COOK_ALW) {
      //             this.showInput42[i] = false;
      //           }
      //           if (element.IS_DAILY_ALW) {
      //             this.showInput43[i] = false;
      //           }
      //           if (element.IS_DISTURBANCE_ALW) {
      //             this.showInput44[i] = false;
      //           }

      //           if (element.IS_DOMESTIC_AID_ALW) {
      //             this.showInput45[i] = false;
      //           }
      //           if (element.IS_HAIRCUT_ALW) {
      //             this.showInput46[i] = false;
      //           }
      //           if (element.IS_MEDAL_ALW) {
      //             this.showInput47[i] = false;
      //           }

      //           if (element.IS_RATION_ALW) {
      //             this.showInput48[i] = false;
      //           }
      //           if (element.IS_REFRESHMENT_ALW) {
      //             this.showInput49[i] = false;
      //           }
      //           if (element.IS_RETAINER_ALW) {
      //             this.showInput50[i] = false;
      //           }

      //           if (element.IS_SECURITY_ALW) {
      //             this.showInput51[i] = false;
      //           }
      //           if (element.IS_TIFFIN_ALW) {
      //             this.showInput52[i] = false;
      //           }
      //           if (element.IS_TRAINING_ALW) {
      //             this.showInput53[i] = false;
      //           }

      //           if (element.IS_TRAVEL_ALW) {
      //             this.showInput54[i] = false;
      //           }
      //           if (element.IS_UNIFORM_ALW) {
      //             this.showInput55[i] = false;
      //           }
      //           if (element.IS_WASHING_ALW) {
      //             this.showInput56[i] = false;
      //           }

      //           //#endregion

      //           //#region Patch value

      //           this.formArray.controls[i].patchValue({
      //             organizationName: element.IS_OFC_NAME ? element.IS_OFC_NAME : '',
      //             designation: element.IS_EMP_DESIGNATION ? element.IS_EMP_DESIGNATION : '',

      //             basicPay: element.IS_BASIC_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_BASIC_PAY) : '',
      //             houseRentAllowance: element.IS_HOUSE_RENT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HOUSE_RENT_ALW) : '',
      //             medicalAllowance: element.IS_MEDICAL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_MEDICAL_ALW) : '',
      //             conveyanceAllowance: element.IS_CONVEYANCE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_CONVEYANCE_ALW) : '',
      //             banglaNewYearAllowance: element.IS_BANGLA_NEW_YEAR_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_BANGLA_NEW_YEAR_ALW) : '',
      //             festivalBonus: element.IS_FESTIVAL_BONUS ? this.commaSeparator.currencySeparatorBD(element.IS_FESTIVAL_BONUS) : '',

      //             //select2 - dropdown
      //             educationAllowance: element.IS_EDUCATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_EDUCATION_ALW) : '',
      //             mobileAllowance: element.IS_MOBILE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_MOBILE_ALW) : '',
      //             telephoneAllowance: element.IS_RESIDENTIAL_TELEPHN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_RESIDENTIAL_TELEPHN_ALW) : '',
      //             recreationAllowance: element.IS_REST_RECREATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_REST_RECREATION_ALW) : '',
      //             dearnessAllowance: element.IS_DEARNESS_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DEARNESS_ALW) : '',
      //             deputationAllowance: element.IS_DEPUTATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DEPUTATION_ALW) : '',
      //             chargeAllowance: element.IS_CHARGE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_CHARGE_ALW) : '',
      //             judicialAllowance: element.IS_JUDICIAL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_JUDICIAL_ALW) : '',
      //             defenseServiceAllowance: element.IS_DEFENSE_SERVICE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DEFENSE_SERVICE_ALW) : '',
      //             transportMaintenanceAllowance: element.IS_TRANSPORT_MAINTENANCE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TRANSPORT_MAINTENANCE_ALW) : '',
      //             foreignAllowance: element.IS_FOREIGN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_FOREIGN_ALW) : '',
      //             hillAllowance: element.IS_HILL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HILL_ALW) : '',
      //             hazardousJobAllowance: element.IS_HAZARDOUS_JOB_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HAZARDOUS_JOB_ALW) : '',
      //             arrearPay: element.IS_ARREAR_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_ARREAR_PAY) : '',
      //             speacialPay: element.IS_SPECIAL_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_SPECIAL_PAY) : '',
      //             personalPay: element.IS_PERSONAL_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_PERSONAL_PAY) : '',
      //             honorariumRewardFee: element.IS_HONORARIUM_REWARD_FEE ? this.commaSeparator.currencySeparatorBD(element.IS_HONORARIUM_REWARD_FEE) : '',
      //             tadaExpended: element.IS_TADA_NOT_EXPENDED ? this.commaSeparator.currencySeparatorBD(element.IS_TADA_NOT_EXPENDED) : '',
      //             gpfInterest: element.IS_GPF_INTEREST ? this.commaSeparator.currencySeparatorBD(element.IS_GPF_INTEREST) : '',
      //             pension: element.IS_PENSION ? this.commaSeparator.currencySeparatorBD(element.IS_PENSION) : '',
      //             gratuity: element.IS_GRATUITY ? this.commaSeparator.currencySeparatorBD(element.IS_GRATUITY) : '',
      //             otherRetirementBenefits: element.IS_OTHER_RETIREMENT_BENEFITS ? this.commaSeparator.currencySeparatorBD(element.IS_OTHER_RETIREMENT_BENEFITS) : '',
      //             appointmentPay: element.IS_APPOINTMENT_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_APPOINTMENT_PAY) : '',
      //             flyingPay: element.IS_FLYING_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_FLYING_PAY) : '',
      //             goodConductPay: element.IS_GOOD_CONDUCT_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_GOOD_CONDUCT_PAY) : '',
      //             ssgPay: element.IS_SSG_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_SSG_PAY) : '',
      //             worthynessPay: element.IS_WORTHYNESS_PAY ? this.commaSeparator.currencySeparatorBD(element.IS_WORTHYNESS_PAY) : '',
      //             batsmanPay: element.IS_BATSMAN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_BATSMAN_ALW) : '',
      //             chawkiAllowance: element.IS_CHAWKI_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_CHAWKI_ALW) : '',
      //             compensatoryAllowance: element.IS_COMPENSATORY_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_COMPENSATORY_ALW) : '',
      //             cookAllowance: element.IS_COOK_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_COOK_ALW) : '',
      //             dailyAllowance: element.IS_DAILY_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DAILY_ALW) : '',
      //             disturbanceAllowance: element.IS_DISTURBANCE_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DISTURBANCE_ALW) : '',
      //             domesticAidAllowance: element.IS_DOMESTIC_AID_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_DOMESTIC_AID_ALW) : '',
      //             haircutAllowance: element.IS_HAIRCUT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_HAIRCUT_ALW) : '',
      //             medalAllowance: element.IS_MEDAL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_MEDAL_ALW) : '',
      //             overtimeAllowance: element.IS_OVERTIME_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_OVERTIME_ALW) : '',
      //             rationAllowance: element.IS_RATION_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_RATION_ALW) : '',
      //             refreshmentAllowance: element.IS_REFRESHMENT_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_REFRESHMENT_ALW) : '',
      //             retainerAllowance: element.IS_RETAINER_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_RETAINER_ALW) : '',
      //             securityAllowance: element.IS_SECURITY_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_SECURITY_ALW) : '',
      //             tiffinAllowance: element.IS_TIFFIN_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TIFFIN_ALW) : '',
      //             trainingAllowance: element.IS_TRAINING_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TRAINING_ALW) : '',
      //             travelAllowance: element.IS_TRAVEL_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_TRAVEL_ALW) : '',
      //             uniformAllowance: element.IS_UNIFORM_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_UNIFORM_ALW) : '',
      //             washingAllowance: element.IS_WASHING_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_WASHING_ALW) : '',
      //             otherAllowance: element.IS_OTHER_ALW ? this.commaSeparator.currencySeparatorBD(element.IS_OTHER_ALW) : '',
      //           });

      //           //#endregion

      //           //#region Add select item

      //           this.addMoreGetData = [];

      //           if (this.showInput27[i] == true) {
      //             this.addMoreGetData.push({ id: 27, text: "Arrear Pay" });
      //           }
      //           if (this.showInput33[i] == true) {
      //             this.addMoreGetData.push({ id: 33, text: "Appointment Pay" });
      //           }
      //           if (this.showInput38[i] == true) {
      //             this.addMoreGetData.push({ id: 38, text: "Batsman Allowance" });
      //           }
      //           if (this.showInput20[i] == true) {
      //             this.addMoreGetData.push({ id: 20, text: "Charge Allowance" });
      //           }
      //           if (this.showInput40[i] == true) {
      //             this.addMoreGetData.push({ id: 40, text: "Chawki Allowance" });
      //           }
      //           if (this.showInput41[i] == true) {
      //             this.addMoreGetData.push({ id: 41, text: "Compensatory Allowance" });
      //           }
      //           if (this.showInput39[i] == true) {
      //             this.addMoreGetData.push({ id: 39, text: "Conveyance Allowance" });
      //           }
      //           if (this.showInput42[i] == true) {
      //             this.addMoreGetData.push({ id: 42, text: "Cook Allowance" });
      //           }
      //           if (this.showInput43[i] == true) {
      //             this.addMoreGetData.push({ id: 43, text: "Daily Allowance" });
      //           }
      //           if (this.showInput18[i] == true) {
      //             this.addMoreGetData.push({ id: 18, text: "Dearness Allowance" });
      //           }
      //           if (this.showInput22[i] == true) {
      //             this.addMoreGetData.push({ id: 22, text: "Defence Services Allowance" });
      //           }
      //           if (this.showInput19[i] == true) {
      //             this.addMoreGetData.push({ id: 19, text: "Deputation Allowance" });
      //           }
      //           if (this.showInput44[i] == true) {
      //             this.addMoreGetData.push({ id: 44, text: "Disturbance Allowance" });
      //           }
      //           if (this.showInput45[i] == true) {
      //             this.addMoreGetData.push({ id: 45, text: "Domestic Aid Allowance" });
      //           }
      //           if (this.showInput14[i] == true) {
      //             this.addMoreGetData.push({ id: 14, text: "Education Allowance" });
      //           }
      //           if (this.showInput34[i] == true) {
      //             this.addMoreGetData.push({ id: 34, text: "Flying Pay" });
      //           }
      //           if (this.showInput24[i] == true) {
      //             this.addMoreGetData.push({ id: 24, text: "Foreign Allowance" });
      //           }
      //           if (this.showInput11[i] == true) {
      //             this.addMoreGetData.push({ id: 11, text: "Gratuity" });
      //           }
      //           if (this.showInput31[i] == true) {
      //             this.addMoreGetData.push({ id: 31, text: "GPF Interest" });
      //           }
      //           if (this.showInput35[i] == true) {
      //             this.addMoreGetData.push({ id: 35, text: "Good Conduct Pay" });
      //           }
      //           if (this.showInput26[i] == true) {
      //             this.addMoreGetData.push({ id: 26, text: "Hazardous Job Allowance" });
      //           }
      //           if (this.showInput46[i] == true) {
      //             this.addMoreGetData.push({ id: 46, text: "Haircut Allowance" });
      //           }
      //           if (this.showInput25[i] == true) {
      //             this.addMoreGetData.push({ id: 25, text: "Hill Allowance" });
      //           }
      //           if (this.showInput30[i] == true) {
      //             this.addMoreGetData.push({ id: 30, text: "Honorarium" });
      //           }
      //           if (this.showInput21[i] == true) {
      //             this.addMoreGetData.push({ id: 21, text: "Judicial Allowance" });
      //           }
      //           if (this.showInput47[i] == true) {
      //             this.addMoreGetData.push({ id: 47, text: "Medal Allowance" });
      //           }
      //           if (this.showInput15[i] == true) {
      //             this.addMoreGetData.push({ id: 15, text: "Mobile/cellphone Allowance" });
      //           }
      //           if (this.showInput4[i] == true) {
      //             this.addMoreGetData.push({ id: 4, text: "Overtime Allowance" });
      //           }
      //           if (this.showInput32[i] == true) {
      //             this.addMoreGetData.push({ id: 32, text: "Other Retirement Benefits" });
      //           }
      //           if (this.showInput16[i] == true) {
      //             this.addMoreGetData.push({ id: 12, text: "Pension" });
      //           }
      //           if (this.showInput29[i] == true) {
      //             this.addMoreGetData.push({ id: 29, text: "Personal Pay" });
      //           }
      //           if (this.showInput16[i] == true) {
      //             this.addMoreGetData.push({ id: 16, text: "Residential Telephone Encashment Allowance" });
      //           }
      //           if (this.showInput48[i] == true) {
      //             this.addMoreGetData.push({ id: 48, text: "Ration Allowance" });
      //           }
      //           if (this.showInput49[i] == true) {
      //             this.addMoreGetData.push({ id: 49, text: "Refreshment Allowance" });
      //           }
      //           if (this.showInput17[i] == true) {
      //             this.addMoreGetData.push({ id: 17, text: "Rest and Recreation Allowance" });
      //           }
      //           if (this.showInput50[i] == true) {
      //             this.addMoreGetData.push({ id: 50, text: "Retainer Allowance" });
      //           }
      //           if (this.showInput28[i] == true) {
      //             this.addMoreGetData.push({ id: 28, text: "Special Pay" });
      //           }
      //           if (this.showInput36[i] == true) {
      //             this.addMoreGetData.push({ id: 36, text: "SSG Pay" });
      //           }
      //           if (this.showInput51[i] == true) {
      //             this.addMoreGetData.push({ id: 51, text: "Security Allowance" });
      //           }
      //           if (this.showInput6[i] == true) {
      //             this.addMoreGetData.push({ id: 6, text: "TA/DA etc. not Expended" });
      //           }
      //           if (this.showInput52[i] == true) {
      //             this.addMoreGetData.push({ id: 52, text: "Tiffin Allowance" });
      //           }
      //           if (this.showInput23[i] == true) {
      //             this.addMoreGetData.push({ id: 23, text: "Transport Maintenance Allowance" });
      //           }
      //           if (this.showInput53[i] == true) {
      //             this.addMoreGetData.push({ id: 53, text: "Training Allowance" });
      //           }
      //           if (this.showInput54[i] == true) {
      //             this.addMoreGetData.push({ id: 54, text: "Travel Allowance" });
      //           }
      //           if (this.showInput55[i] == true) {
      //             this.addMoreGetData.push({ id: 55, text: "Uniform Allowance" });
      //           }
      //           if (this.showInput56[i] == true) {
      //             this.addMoreGetData.push({ id: 56, text: "Washing Allowance" });
      //           }
      //           if (this.showInput57[i] == true) {
      //             this.addMoreGetData.push({ id: 57, text: "Other Allowance" });
      //           }
      //           if (this.showInput37[i] == true) {
      //             this.addMoreGetData.push({ id: 37, text: "Worthiness Pay" });
      //           }

      //           if (this.showInput15[i] == true) {
      //             this.addMoreGetData.push({ id: 13, text: "Other, If Any (Give Detail)" });
      //           }

      //           this.data[i] = [];
      //           this.data[i] = this.addMoreGetData;

      //           //#endregion

      //         });

      //         //#endregion
      //         this.spinner.stop();

      //       }
      //       else {
      //         this.onGovtToNonGovt[i] = true;
      //         let x: number = 1;
      //         x = x + i;
      //         this.salaryName[i] = 'Salary' + ' ' + x;
      //         this.formArray.controls[this.formArray.length - 1].patchValue({
      //           salaryName: this.salaryName[i],
      //         });
      //         this.spinner.stop();
      //       }
      //     },
      //       error => {
      //         this.spinner.stop();
      //         console.log(error['error'].errorMessage);

      //         // this below line is applicable only for local Storage ibas++ mock data purpose
      //         this.onGovtToNonGovt[i] = true;

      //         // this.toastr.error(error['error'].errorMessage, '', {
      //         //   timeOut: 3000,
      //         // });
      //       });

      //   //#endregion

      // }

      //#endregion

    }

    if (event.target.value === "1" || event.target.value === "2") {

      this.isVisibleIncomeTab = false;
      this.isVisibleAddSalBtn = false;

      //hidden select 2 field
      this.showInput6[i] = true;
      this.showInput11[i] = true;
      this.showInput12[i] = true;
      this.showInput13[i] = true;
      this.showInput14[i] = true;
      this.showInput15[i] = true;
      this.showInput16[i] = true;
      this.showInput17[i] = true;
      this.showInput18[i] = true;
      this.showInput19[i] = true;
      this.showInput20[i] = true;
      this.showInput21[i] = true;
      this.showInput22[i] = true;
      this.showInput23[i] = true;
      this.showInput24[i] = true;
      this.showInput25[i] = true;
      this.showInput26[i] = true;
      this.showInput27[i] = true;
      this.showInput28[i] = true;
      this.showInput29[i] = true;
      this.showInput30[i] = true;
      this.showInput31[i] = true;
      this.showInput32[i] = true;
      this.showInput33[i] = true;
      this.showInput34[i] = true;
      this.showInput35[i] = true;
      this.showInput36[i] = true;
      this.showInput37[i] = true;
      this.showInput38[i] = true;
      this.showInput39[i] = true;
      this.showInput40[i] = true;
      this.showInput41[i] = true;
      this.showInput42[i] = true;
      this.showInput43[i] = true;
      this.showInput44[i] = true;
      this.showInput45[i] = true;
      this.showInput46[i] = true;
      this.showInput47[i] = true;
      this.showInput4[i] = true;
      this.showInput48[i] = true;
      this.showInput49[i] = true;
      this.showInput50[i] = true;
      this.showInput51[i] = true;
      this.showInput52[i] = true;
      this.showInput53[i] = true;
      this.showInput54[i] = true;
      this.showInput55[i] = true;
      this.showInput56[i] = true;
      this.showInput57[i] = true;
      this.data[i] = [];
      this.data[i] =
        [
          { id: 27, text: "Arrear Pay" },
          { id: 33, text: "Appointment Pay" },
          { id: 38, text: "Batsman Allowance" },
          { id: 20, text: "Charge Allowance" },
          { id: 40, text: "Chawki Allowance" },
          { id: 41, text: "Compensatory Allowance" },
          { id: 39, text: "Conveyance Allowance" },
          { id: 42, text: "Cook Allowance" },
          { id: 43, text: "Daily Allowance" },
          { id: 18, text: "Dearness Allowance" },
          { id: 22, text: "Defence Services Allowance" },
          { id: 19, text: "Deputation Allowance" },
          { id: 44, text: "Disturbance Allowance" },
          { id: 45, text: "Domestic Aid Allowance" },
          { id: 14, text: "Education Allowance" },
          { id: 34, text: "Flying Pay" },
          { id: 24, text: "Foreign Allowance" },
          { id: 11, text: "Gratuity" },
          { id: 31, text: "GPF Interest" },
          { id: 35, text: "Good Conduct Pay" },
          { id: 26, text: "Hazardous Job Allowance" },
          { id: 46, text: "Haircut Allowance" },
          { id: 25, text: "Hill Allowance" },
          { id: 30, text: "Honorarium" },
          { id: 21, text: "Judicial Allowance" },
          { id: 47, text: "Medal Allowance" },
          { id: 15, text: "Mobile/cellphone Allowance" },
          { id: 4, text: "Overtime Allowance" },
          { id: 32, text: "Other Retirement Benefits" },
          { id: 12, text: "Pension" },
          { id: 29, text: "Personal Pay" },
          { id: 16, text: "Residential Telephone Encashment Allowance" },
          { id: 48, text: "Ration Allowance" },
          { id: 49, text: "Refreshment Allowance" },
          { id: 17, text: "Rest and Recreation Allowance" },
          { id: 50, text: "Retainer Allowance" },
          { id: 28, text: "Special Pay" },
          { id: 36, text: "SSG Pay" },
          { id: 51, text: "Security Allowance" },
          { id: 6, text: "TA/DA etc. not Expended" },
          { id: 52, text: "Tiffin Allowance" },
          { id: 23, text: "Transport Maintenance Allowance" },
          { id: 53, text: "Training Allowance" },
          { id: 54, text: "Travel Allowance" },
          { id: 55, text: "Uniform Allowance" },
          { id: 56, text: "Washing Allowance" },
          { id: 37, text: "Worthiness Pay" },
          { id: 13, text: "Other, If Any (Give Detail)" },
        ];

    }

    if (event.target.value === "2" || event.target.value === "3") {

      //#region start- show tab name salary 1, salary 2.... initially on type change

      // let x: number = 1;
      // x = x + i;
      // this.salaryName[i] = 'Salary' + ' ' + x;
      // this.formArray.controls[this.formArray.length - 1].patchValue({
      //   salaryName: this.salaryName[i],
      // });

      //#endregion

    }

    if (event.target.value === "3") {

      // debugger;
      this.onGovtToNonGovt[i] = false;
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isVisibleAddSalBtn = false;

      //hidden select 2 field
      this.showInput1[i] = true;
      this.showInput2[i] = true;
      this.showInput3[i] = true;
      this.showInput4[i] = true;
      this.showInput5[i] = true;
      this.showInput6[i] = true;
      this.showInput7[i] = true;
      this.showInput8[i] = true;
      this.showInput9[i] = true;
      this.showInput10[i] = true;
      this.showInput11[i] = true;
      this.showInput12[i] = true;
      this.showInput13[i] = true;

      this.data[i] = [];
      this.data[i] =
        [
          { id: 1, text: "Arrear Salary" },
          { id: 2, text: "Education Allowance" },
          { id: 3, text: "Entertainment Allowance" },
          { id: 9, text: "Employer’s Contribution to RPF" },
          { id: 11, text: "Gratuity" },
          { id: 10, text: "Interest Accrued on RPF" },
          { id: 5, text: "Leave Allowance" },
          { id: 7, text: "Other Bonus" },
          { id: 4, text: "Overtime Allowance" },
          { id: 12, text: "Pension" },
          { id: 6, text: "TA/DA etc. not Expended" },
          // { id: 8, text: "Free or Concessional Passage" },
          { id: 13, text: "Other, If Any (Give Detail)" },
        ];
    }

    if (event.target.value === "4") {
      this.onGovtToNonGovt[i] = false;
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isVisibleAddSalBtn = false;
      this.formArray.at(i).get('isSalaryExemptedUnderSRO').setValue(true);
    }
  }

  clearExistingFormData(i) {
    this.formArray.controls[i].patchValue({
      organizationName: '',
      employerName: '',
      designation: '',
      basicPay: '',
      houseRentAllowance: '',
      medicalAllowance: '',
      conveyanceAllowance: '',
      banglaNewYearAllowance: '',
      festivalAllowance: '',
      festivalBonus: ''
    });
  }

  onEmployerNameKeyUp(i) {
    this.salaryName[i] = "";
    this.salaryName[i] = this.formArray.controls[i].value.employerName;
    this.formArray.controls[i].value.salaryName = this.salaryName[i];
    if (this.formArray.controls[i].value.employerName === "") this.employerName_showError[i] = true;
    else this.employerName_showError[i] = false;
  }

  onOrganizationNameKeyUp(i) {
    this.salaryName[i] = "";
    this.salaryName[i] = this.formArray.controls[i].value.organizationName;
    this.formArray.controls[i].value.salaryName = this.salaryName[i];
    if (this.formArray.controls[i].value.organizationName === "") this.organizationName_showError[i] = true;
    else this.organizationName_showError[i] = false;
  }

  onDesignationKeyUp(i) {
    if (this.formArray.controls[i].value.designation === "") this.designation_showError[i] = true;
    else this.designation_showError[i] = false;
  }

  onSroNoKeyUp(i) {
    if (this.formArray.controls[i].value.SroNo === null || this.formArray.controls[i].value.SroNo === "") this.sroNo_showError[i] = true;
    else this.sroNo_showError[i] = false;
  }

  onSroYearKeyUp(i) {
    this.sroYear_showError[i] = false;
  }

  onParticularOfSroKeyUp(i) {
    if (this.formArray.controls[i].value.particularOfSro === null || this.formArray.controls[i].value.particularOfSro === "") this.particularOfSro_showError[i] = true;
    else this.particularOfSro_showError[i] = false;
  }

  onParticularOfOtherNonCashBenefitKeyUp(i) {
    if (this.formArray.controls[i].value.particularOfOtherNonCashBenefit === "") this.particularOfOtherNonCashBenefit_showError[i] = true;
    else this.particularOfOtherNonCashBenefit_showError[i] = false;
  }

  salaryTypeChange(evt: any) {
    const target = evt.target;
    if (target.checked && evt.target.value === "1") {
      this.showOtherCalc = of(true);
    } else {
      this.showOtherCalc = of(false);
    }
  }

  selectedSalary(i: number) {
    this.isVisibleForm = i;
    this.isSummary = false;
  }

  onRentPaidChange(i) {
    if (Number(this.commaSeparator.extractComma(this.formArray.at(i).get('ConcessRateRentPaidByTaxpayer').value)) >= Number(this.commaSeparator.extractComma(this.formArray.at(i).get('ConcessRateValue').value))) {
      this.toastr.warning('Rent paid value can not be greater than accommodation value', '', {
        timeOut: 6000,
      });

      //new
      this.formArray.at(i).get('ConcessRateRentPaidByTaxpayer').setValue('');

      //previous
      // if (Number(this.commaSeparator.extractComma(this.formArray.at(i).get('ConcessRateValue').value)) <= 1) {
      //   this.formArray.at(i).get('ConcessRateRentPaidByTaxpayer').setValue(this.commaSeparator.currencySeparatorBD(0));
      // }
      // else {
      //   this.formArray.at(i).get('ConcessRateRentPaidByTaxpayer').setValue(this.commaSeparator.currencySeparatorBD(Number(this.commaSeparator.extractComma(this.formArray.at(i).get('ConcessRateValue').value)) - 1));
      // }
    }
  }

  //interest on GPF
  addInterestOnGPF(i) {
    this.item = 0;
    this.showInput31[i] = !this.showInput31[i];
    this.data[i].splice(
      this.data[i].findIndex((x) => x.text === "GPF Interest"),
      1
    );
    // this.modalRef.hide();
  }

  removeInterestOnGPF(i) {
    this.addInterestOnGPF(i);
    this.item = 31;
    this.popupRemoveOnClick(i);
    // this.modalRef.hide();
  }

  //pension
  addPension(i) {
    this.item = 0;
    this.showInput12[i] = !this.showInput12[i];
    this.data[i].splice(
      this.data[i].findIndex((x) => x.text === "Pension"),
      1
    );
    // this.modalRef.hide();
  }

  removePension(i) {
    this.addPension(i);
    this.item = 12;
    this.popupRemoveOnClick(i);
    // this.modalRef.hide();
  }

  //gratuity
  addGratuity(i) {
    this.item = 0;
    this.showInput11[i] = !this.showInput11[i];
    this.data[i].splice(
      this.data[i].findIndex((x) => x.text === "Gratuity"),
      1
    );
    // this.modalRef.hide();
  }

  removeGratuity(i) {
    this.addGratuity(i);
    this.item = 11;
    this.popupRemoveOnClick(i);
    this.modalRef.hide();
  }

  //Interest on RPF
  addInterestOnRPF(i) {
    this.item = 0;
    this.showInput10[i] = !this.showInput10[i];
    this.data[i].splice(
      this.data[i].findIndex((x) => x.text === "Interest Accrued on RPF"),
      1
    );
    // this.modalRef.hide();
  }

  removeInterestOnRPF(i) {
    this.addInterestOnRPF(i);
    this.item = 10;
    this.popupRemoveOnClick(i);
    // this.modalRef.hide();
  }

  mainNavActive = {};
  mainNavActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.mainNavActive = x;
  }

  selectedNavbar = [];
  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
    this.lengthOfheads = this.headsOfIncome.length;
  }

  onSROFilterChange(e, i) {
    if (e.target.checked) {
      this.checkedSRO[i] = true;
      this.isCheckedRentFreeAccommodation[i] = false;
      this.checkedRent[i] = false;
      this.checkedCon[i] = false;
      this.isCheckedAccommodationAtConcessRate[i] = false;
      this.isCheckedVehicleFacilityProvided[i] = false;
      this.checkedNcash[i] = false;
      this.isCheckedOtherNonCashBenefit[i] = false;
      this.formArray.controls[i].patchValue({
        basicPay: '',
        houseRentAllowance: '',
        medicalAllowance: '',
        conveyanceAllowance: '',
        festivalBonus: '',
        speacialPay: '',
        arrearPay: '',
        dearnessAllowance: '',
        supportStaffAllowance: '',
        leaveAllowance: '',
        honorariumRewardFee: '',
        overtimeAllowance: '',
        bonusExGratia: '',
        otherAllowance: '',
        empContributionToRPF: '',
        interestAccruedOnRPF: '',
        otherIfAnyHead: '',
        otherIfAnyValue: '',
        RentFreeAccValue: '',
        ConcessRateValue: '',
        ConcessRateRentPaidByTaxpayer: '',
        particularOfOtherNonCashBenefit: '',
        valueOfOtherNonCashBenefit: '',
      });

    }
    else {
      // debugger;
      this.checkedSRO[i] = false;

      this.formArray.controls[i].patchValue({
        SroNo: '',
        sroYear: '',
        particularOfSro: '',
        taxableIncomeOfSro: '',
        taxExemptedIncomeOfSro: '',
        taxApplicableOfSro: '',
      });
    }
  }

  onVehicleFacilityFilterChange(e, i) {
    if (e.target.checked) {
      this.isCheckedVehicleFacilityProvided[i] = true;
    }
    else {
      this.isCheckedVehicleFacilityProvided[i] = false;
    }
  }

  onRentFilterChange(e, i) {
    // debugger;
    if (e.target.checked) {
      this.checkedRent[i] = true;
      this.isCheckedRentFreeAccommodation[i] = true;
    }
    else {
      this.checkedRent[i] = false;
      this.isCheckedRentFreeAccommodation[i] = false;

      this.formArray.controls[i].patchValue({
        RentFreeAccValue: '',
      });
    }
  }

  onConFilterChange(e, i) {
    if (e.target.checked) {
      this.checkedCon[i] = true;
      this.isCheckedAccommodationAtConcessRate[i] = true;
    }
    else {
      this.checkedCon[i] = false;
      this.isCheckedAccommodationAtConcessRate[i] = false;
      this.formArray.controls[i].patchValue({
        ConcessRateValue: '',
        ConcessRateRentPaidByTaxpayer: '',
      });
    }
  }

  onNonCashilterChange(e, i) {
    if (e.target.checked) {
      this.checkedNcash[i] = true;
      this.isCheckedOtherNonCashBenefit[i] = true;
    }
    else {
      this.checkedNcash[i] = false;
      this.isCheckedOtherNonCashBenefit[i] = false;
      this.formArray.controls[i].patchValue({
        particularOfOtherNonCashBenefit: '',
        valueOfOtherNonCashBenefit: '',
      });
    }
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }

  close(i, empType) {
    // console.log('salaryNo:', this.formArray.controls[i].value.salaryNo);
    this.closeErrorIndexes(i);
    if (this.formArray.controls[i].value.salaryNo != null) {
      this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/salaries/' + this.formArray.controls[i].value.salaryNo)
        .subscribe(result => {
          if (result != null) {
            //console.log(result);

            this.salaryName.splice(i, 1);
            this.formArray.removeAt(i);
            if (empType == 2) {
              this.insertFormGroupToArray(empType);
              this.isVisibleForm = this.formArray.controls.length - 1;
              this.onGovtToNonGovt[this.isVisibleForm] = true;
              this.incomeType = of(false);
              this.isVisibleIncomeTab = false;
              this.isVisibleAddSalBtn = false;
            } else if (this.formArray.length >= 1) {
              this.isVisibleForm = this.formArray.controls.length - 1;
              this.modalRef.hide();
            } else if (this.formArray.length < 1) {
              this.isVisibleForm = 0;
              this.insertFormGroupToArray(empType);
              this.modalRef.hide();
              this.isVisibleIncomeTab = true;
            } else {
            }

            this.toastr.success('Data Removed Successfully.', '', {
              timeOut: 1000,
            });
          }
        },
          error => {
            //console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].message,);
          });
    }

    else {
      this.salaryName.splice(i, 1);
      this.formArray.removeAt(i);
      if (empType == 2) {
        this.insertFormGroupToArray(empType);
        this.isVisibleForm = this.formArray.controls.length - 1;
        this.onGovtToNonGovt[this.isVisibleForm] = true;
        this.incomeType = of(false);
        this.isVisibleIncomeTab = false;
        this.isVisibleAddSalBtn = false;
      } else if (this.formArray.length >= 1) {
        this.isVisibleForm = this.formArray.controls.length - 1;
        this.modalRef.hide();
      } else if (this.formArray.length < 1) {
        this.isVisibleForm = 0;
        this.insertFormGroupToArray(empType);
        this.modalRef.hide();
        this.isVisibleIncomeTab = true;
      } else {
      }
    }
  }


  salaryType_showError = [];
  organizationName_showError = [];
  designation_showError = [];
  particular_showError = [];
  employerName_showError = [];
  rentFreeAccValue_showError = [];
  concessRateValue_showError = [];
  particularOfOtherNonCashBenefit_showError = [];
  valueOfOtherNonCashBenefit_showError = [];
  sroNo_showError = [];
  sroYear_showError = [];
  particularOfSro_showError = [];
  taxableIncomeOfSro_showError = [];
  taxApplicableOfSro_showError = [];
  initializeErrorIndexes(i) {
    this.salaryType_showError[i] = false;
    this.organizationName_showError[i] = false;
    this.designation_showError[i] = false;
    this.particular_showError[i] = false;
    this.employerName_showError[i] = false;
    this.rentFreeAccValue_showError[i] = false;
    this.concessRateValue_showError[i] = false;
    this.particularOfOtherNonCashBenefit_showError[i] = false;
    this.valueOfOtherNonCashBenefit_showError[i] = false;
    this.sroNo_showError[i] = false;
    this.sroYear_showError[i] = false;
    this.particularOfSro_showError[i] = false;
    this.taxableIncomeOfSro_showError[i] = false;
    this.taxApplicableOfSro_showError[i] = false;
  }

  closeErrorIndexes(i) {
    this.salaryType_showError.splice(i, 1);
    this.organizationName_showError.splice(i, 1);
    this.designation_showError.splice(i, 1);
    this.particular_showError.splice(i, 1);
    this.employerName_showError.splice(i, 1);
    this.rentFreeAccValue_showError.splice(i, 1);
    this.concessRateValue_showError.splice(i, 1);
    this.particularOfOtherNonCashBenefit_showError.splice(i, 1);
    this.valueOfOtherNonCashBenefit_showError.splice(i, 1);
    this.sroNo_showError.splice(i, 1);
    this.sroYear_showError.splice(i, 1);
    this.particularOfSro_showError.splice(i, 1);
    this.taxableIncomeOfSro_showError.splice(i, 1);
    this.taxApplicableOfSro_showError.splice(i, 1);
  }

  validateSalary(): any {
    let successValidation: boolean = true;
    let isFirstErrorIndex: boolean = false;
    let firstErrorIndexNumber = 0;

    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if (element.value.employmentType === 0) {
        this.salaryType_showError[index] = true;
        successValidation = false;
      }
      if (element.value.organizationName === "" && element.value.employmentType === "1") {
        this.organizationName_showError[index] = true;
        successValidation = false;
      }
      if (element.value.designation === "" && element.value.employmentType === "1") {
        this.designation_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "1" && (element.value.basicPay == "" && element.value.houseRentAllowance == ""
        && element.value.medicalAllowance == "" && element.value.banglaNewYearAllowance == "" && element.value.festivalBonus == "")) {
        this.particular_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employerName === "" && element.value.employmentType === "2") {
        this.employerName_showError[index] = true;
        successValidation = false;
      }
      if (element.value.designation === "" && element.value.employmentType === "2") {
        this.designation_showError[index] = true;
        successValidation = false;
      }
      if (element.value.designation === "" && element.value.employmentType === "3") {
        this.designation_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "2" && (element.value.basicPay == "" && element.value.houseRentAllowance == ""
        && element.value.medicalAllowance == "" && element.value.banglaNewYearAllowance == "" && element.value.festivalBonus == "")) {
        this.particular_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employerName === "" && element.value.employmentType === "3") {
        this.employerName_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "3" && (element.value.basicPay == "" && element.value.houseRentAllowance == ""
        && element.value.medicalAllowance == "" && element.value.conveyanceAllowance == "" && element.value.festivalBonus == "")) {
        this.particular_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "3" && (element.value.isRentFreeAccommodation == true && element.value.RentFreeAccValue == "")) {
        this.rentFreeAccValue_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "3" && (element.value.isAccommodationAtConcessRate == true && element.value.ConcessRateValue == "")) {
        this.concessRateValue_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "3" && (element.value.isOtherNonCashBenefit == true && element.value.particularOfOtherNonCashBenefit == "")) {
        this.particularOfOtherNonCashBenefit_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employmentType === "3" && (element.value.isOtherNonCashBenefit == true && element.value.valueOfOtherNonCashBenefit == "")) {
        this.valueOfOtherNonCashBenefit_showError[index] = true;
        successValidation = false;
      }
      if (element.value.employerName === "" && element.value.employmentType === "4") {
        this.employerName_showError[index] = true;
        successValidation = false;
      }
      if (element.value.designation === "" && element.value.employmentType === "4") {
        this.designation_showError[index] = true;
        successValidation = false;
      }
      if (element.value.SroNo === null && element.value.employmentType === "4") {
        this.sroNo_showError[index] = true;
        successValidation = false;
      }

      if (element.value.sroYear == null && element.value.employmentType === "4") {
        this.sroYear_showError[index] = true;
        successValidation = false;
      }
      if (element.value.particularOfSro === null && element.value.employmentType === "4") {
        this.particularOfSro_showError[index] = true;
        successValidation = false;
      }
      if ((element.value.taxableIncomeOfSro === null || element.value.taxableIncomeOfSro === "") && element.value.employmentType === "4") {
        this.taxableIncomeOfSro_showError[index] = true;
        successValidation = false;
      }

      if ((element.value.taxApplicableOfSro === null || element.value.taxApplicableOfSro === "") && element.value.employmentType === "4") {
        this.taxApplicableOfSro_showError[index] = true;
        successValidation = false;
      }

      if (!successValidation && !isFirstErrorIndex) {
        isFirstErrorIndex = true;
        firstErrorIndexNumber = index;
      }

    });

    if (!successValidation)
      return { "validate": false, "indexNo": firstErrorIndexNumber };
    else
      return { "validate": true, "indexNo": "" };
  }

  submittedData() {
    // console.log('Form data=', this.formArray.controls);
    this.requestData = [];
    let obj: any;

    let empType: any;
    let shareHolder: any;
    let RentFreeAccommodation: any;
    let AccommodationAtConcessRate: any;
    let VehicleFacilityProvided: any;
    let OtherNonCashBenefit: any;
    let SalaryExemptedUnderSRO: any;

    this.isSroNoEmpty = false;
    this.isSroYearEmpty = false;
    this.isParticularOfSroEmpty = false;
    this.isTaxableIncomeOfSroEmpty = false;
    this.isTaxExemptedIncomeOfSroEmpty = false;
    this.isTaxApplicableOfSroEmpty = false;

    let validateSalary: any;
    validateSalary = this.validateSalary();
    if (!validateSalary.validate) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
      this.isVisibleForm = validateSalary.indexNo;
      return;
    }

    this.formArray.controls.forEach((element, index) => {
      if (element.value.employmentType == '1') {
        empType = "GI";
      }
      if (element.value.employmentType == '2') {
        empType = "G";
      }
      if (element.value.employmentType == '3') {
        empType = "NG";
      }
      if (element.value.employmentType == '4') {
        empType = "SRO";
      }
      if (element.value.isShareholderDirector == true) {
        shareHolder = 'T'
      }
      if (element.value.isShareholderDirector == false) {
        shareHolder = 'F'
      }
      if (element.value.isRentFreeAccommodation == true) {
        RentFreeAccommodation = 'T'
      }
      if (element.value.isRentFreeAccommodation == false) {
        RentFreeAccommodation = 'F'
      }
      if (element.value.isAccommodationAtConcessRate == true) {
        AccommodationAtConcessRate = 'T'
      }
      if (element.value.isAccommodationAtConcessRate == false) {
        AccommodationAtConcessRate = 'F'
      }
      if (element.value.isVehicleFacilityProvided == true) {
        VehicleFacilityProvided = 'T'
      }
      if (element.value.isVehicleFacilityProvided == false) {
        VehicleFacilityProvided = 'F'
      }
      if (element.value.isOtherNonCashBenefit == true) {
        OtherNonCashBenefit = 'T'
      }
      if (element.value.isOtherNonCashBenefit == false) {
        OtherNonCashBenefit = 'F'
      }
      if (element.value.isSalaryExemptedUnderSRO == true) {
        SalaryExemptedUnderSRO = 'T'
        // debugger;
        if (element.value.SroNo === '' || element.value.SroNo == null) {
          this.isSroNoEmpty = true;
        }
        if (element.value.sroYear === '' || element.value.sroYear == null) {
          this.isSroYearEmpty = true;
        }
        if (element.value.particularOfSro === '' || element.value.particularOfSro == null) {
          this.isParticularOfSroEmpty = true;
        }
        if (element.value.taxableIncomeOfSro === '' || element.value.taxableIncomeOfSro == null) {
          this.isTaxableIncomeOfSroEmpty = true;
        }
        if (element.value.taxExemptedIncomeOfSro === '' || element.value.taxExemptedIncomeOfSro == null) {
          this.isTaxExemptedIncomeOfSroEmpty = true;
        }
        if (element.value.taxApplicableOfSro === '' || element.value.taxApplicableOfSro == null) {
          this.isTaxApplicableOfSroEmpty = true;
        }

      }
      if (element.value.isSalaryExemptedUnderSRO == false) {
        SalaryExemptedUnderSRO = 'F'
      }

      //#region for otherIfAny section

      let otherOBJ = {};
      element.value.Other_If_Any.forEach((result, index) => {
        let tempObj = {
          ["IS_OTHER_HEAD_" + result.otherIfAnyHead]: result.otherIfAnyValue ? this.commaSeparator.extractComma(result.otherIfAnyValue) : '',
        };
        otherOBJ = Object.assign(otherOBJ, tempObj);
      });
      // console.log('otherObj', otherOBJ);

      //#endregion

      let SroYear = element.value.sroYear ? moment(element.value.sroYear, 'YYYY') : '';
      // debugger;
      // new OBJ
      obj = {
        // "tin": this.userTin,
        "IS_SALARY_NO": element.value.salaryNo ? element.value.salaryNo : '',
        "IS_EMP_TYPE": empType,
        "IS_OFC_NAME": element.value.organizationName ? element.value.organizationName : '',
        "IS_EMP_NAME": element.value.employerName ? element.value.employerName : '',
        "IS_EMP_DESIGNATION": element.value.designation ? element.value.designation : '',
        "IS_CHK_SHAREHOLDER_DIRECTOR": shareHolder,
        "IS_CHK_RENT_FREE_ACMDTN": RentFreeAccommodation,
        "IS_CHK_ACMDTN_AT_CONCESS_RATE": AccommodationAtConcessRate,
        "IS_CHK_VEHICLE_FACILITY_PROVIDED": VehicleFacilityProvided,
        "IS_CHK_OTHER_NON_CASH_BENEFIT": OtherNonCashBenefit,
        "IS_CHK_SAL_EXEMPTED_BY_SRO": SalaryExemptedUnderSRO,
        "IS_VAL_OF_ACMDTN_RFA": element.value.RentFreeAccValue ? this.commaSeparator.extractComma(element.value.RentFreeAccValue) : '',
        "IS_VAL_OF_ACMDTN_ACR": element.value.ConcessRateValue ? this.commaSeparator.extractComma(element.value.ConcessRateValue) : '',
        "IS_RENT_PAID_BY_TAXPAYER_ACR": element.value.ConcessRateRentPaidByTaxpayer ? this.commaSeparator.extractComma(element.value.ConcessRateRentPaidByTaxpayer) : '',
        "IS_PARTICULAR_ONCB": element.value.particularOfOtherNonCashBenefit ? element.value.particularOfOtherNonCashBenefit : '',
        "IS_VAL_ONCB": element.value.valueOfOtherNonCashBenefit ? this.commaSeparator.extractComma(element.value.valueOfOtherNonCashBenefit) : '',
        "IS_SRO_NO_SES": element.value.SroNo ? element.value.SroNo : '',
        "IS_YEAR_SES": SroYear ? this.datepipe.transform(SroYear, 'yyyy') : '',
        "IS_PARTICULAR_SES": element.value.particularOfSro ? element.value.particularOfSro : '',
        "IS_TAXABLE_INCM_SES": element.value.taxableIncomeOfSro ? this.commaSeparator.extractComma(element.value.taxableIncomeOfSro) : '',
        "IS_TAX_EXEMPTED_INCM_SES": element.value.taxExemptedIncomeOfSro ? this.commaSeparator.extractComma(element.value.taxExemptedIncomeOfSro) : '',
        "IS_TAX_APPLICABLE_SES": element.value.taxApplicableOfSro ? this.commaSeparator.extractComma(element.value.taxApplicableOfSro) : '',

        "IS_BASIC_PAY": element.value.basicPay ? this.commaSeparator.extractComma(element.value.basicPay) : '',
        "IS_HOUSE_RENT_ALW": element.value.houseRentAllowance ? this.commaSeparator.extractComma(element.value.houseRentAllowance) : '',
        "IS_MEDICAL_ALW": element.value.medicalAllowance ? this.commaSeparator.extractComma(element.value.medicalAllowance) : '',
        "IS_BANGLA_NEW_YEAR_ALW": element.value.banglaNewYearAllowance ? this.commaSeparator.extractComma(element.value.banglaNewYearAllowance) : '',
        "IS_FESTIVAL_BONUS": element.value.festivalBonus ? this.commaSeparator.extractComma(element.value.festivalBonus) : '',
        "IS_CONVEYANCE_ALW": element.value.conveyanceAllowance ? this.commaSeparator.extractComma(element.value.conveyanceAllowance) : '',


        "IS_EDUCATION_ALW": element.value.educationAllowance ? this.commaSeparator.extractComma(element.value.educationAllowance) : '',
        "IS_MOBILE_ALW": element.value.mobileAllowance ? this.commaSeparator.extractComma(element.value.mobileAllowance) : '',
        "IS_RESIDENTIAL_TELEPHN_ALW": element.value.telephoneAllowance ? this.commaSeparator.extractComma(element.value.telephoneAllowance) : '',
        "IS_REST_RECREATION_ALW": element.value.recreationAllowance ? this.commaSeparator.extractComma(element.value.recreationAllowance) : '',
        "IS_DEARNESS_ALW": element.value.dearnessAllowance ? this.commaSeparator.extractComma(element.value.dearnessAllowance) : '',
        "IS_DEPUTATION_ALW": element.value.deputationAllowance ? this.commaSeparator.extractComma(element.value.deputationAllowance) : '',
        "IS_CHARGE_ALW": element.value.chargeAllowance ? this.commaSeparator.extractComma(element.value.chargeAllowance) : '',
        "IS_JUDICIAL_ALW": element.value.judicialAllowance ? this.commaSeparator.extractComma(element.value.judicialAllowance) : '',
        "IS_DEFENSE_SERVICE_ALW": element.value.defenseServiceAllowance ? this.commaSeparator.extractComma(element.value.defenseServiceAllowance) : '',
        "IS_TRANSPORT_MAINTENANCE_ALW": element.value.transportMaintenanceAllowance ? this.commaSeparator.extractComma(element.value.transportMaintenanceAllowance) : '',
        "IS_FOREIGN_ALW": element.value.foreignAllowance ? this.commaSeparator.extractComma(element.value.foreignAllowance) : '',
        "IS_HILL_ALW": element.value.hillAllowance ? this.commaSeparator.extractComma(element.value.hillAllowance) : '',
        "IS_HAZARDOUS_JOB_ALW": element.value.hazardousJobAllowance ? this.commaSeparator.extractComma(element.value.hazardousJobAllowance) : '',
        "IS_ARREAR_PAY": element.value.arrearPay ? this.commaSeparator.extractComma(element.value.arrearPay) : '',
        "IS_SPECIAL_PAY": element.value.speacialPay ? this.commaSeparator.extractComma(element.value.speacialPay) : '',
        "IS_PERSONAL_PAY": element.value.personalPay ? this.commaSeparator.extractComma(element.value.personalPay) : '',
        "IS_HONORARIUM_REWARD_FEE": element.value.honorariumRewardFee ? this.commaSeparator.extractComma(element.value.honorariumRewardFee) : '',
        "IS_TADA_NOT_EXPENDED": element.value.tadaExpended ? this.commaSeparator.extractComma(element.value.tadaExpended) : '',
        "IS_GPF_INTEREST": element.value.gpfInterest ? this.commaSeparator.extractComma(element.value.gpfInterest) : '',
        "IS_PENSION": element.value.pension ? this.commaSeparator.extractComma(element.value.pension) : '',
        "IS_GRATUITY": element.value.gratuity ? this.commaSeparator.extractComma(element.value.gratuity) : '',
        "IS_OTHER_RETIREMENT_BENEFITS": element.value.otherRetirementBenefits ? this.commaSeparator.extractComma(element.value.otherRetirementBenefits) : '',
        "IS_APPOINTMENT_PAY": element.value.appointmentPay ? this.commaSeparator.extractComma(element.value.appointmentPay) : '',
        "IS_FLYING_PAY": element.value.flyingPay ? this.commaSeparator.extractComma(element.value.flyingPay) : '',
        "IS_GOOD_CONDUCT_PAY": element.value.goodConductPay ? this.commaSeparator.extractComma(element.value.goodConductPay) : '',
        "IS_SSG_PAY": element.value.ssgPay ? this.commaSeparator.extractComma(element.value.ssgPay) : '',
        "IS_WORTHYNESS_PAY": element.value.worthynessPay ? this.commaSeparator.extractComma(element.value.worthynessPay) : '',
        "IS_BATSMAN_ALW": element.value.batsmanPay ? this.commaSeparator.extractComma(element.value.batsmanPay) : '',
        "IS_CHAWKI_ALW": element.value.chawkiAllowance ? this.commaSeparator.extractComma(element.value.chawkiAllowance) : '',
        "IS_COMPENSATORY_ALW": element.value.compensatoryAllowance ? this.commaSeparator.extractComma(element.value.compensatoryAllowance) : '',
        "IS_COOK_ALW": element.value.cookAllowance ? this.commaSeparator.extractComma(element.value.cookAllowance) : '',
        "IS_DAILY_ALW": element.value.dailyAllowance ? this.commaSeparator.extractComma(element.value.dailyAllowance) : '',
        "IS_DISTURBANCE_ALW": element.value.disturbanceAllowance ? this.commaSeparator.extractComma(element.value.disturbanceAllowance) : '',
        "IS_DOMESTIC_AID_ALW": element.value.domesticAidAllowance ? this.commaSeparator.extractComma(element.value.domesticAidAllowance) : '',
        "IS_HAIRCUT_ALW": element.value.haircutAllowance ? this.commaSeparator.extractComma(element.value.haircutAllowance) : '',
        "IS_MEDAL_ALW": element.value.medalAllowance ? this.commaSeparator.extractComma(element.value.medalAllowance) : '',
        "IS_OVERTIME_ALW": element.value.overtimeAllowance ? this.commaSeparator.extractComma(element.value.overtimeAllowance) : '',
        "IS_RATION_ALW": element.value.rationAllowance ? this.commaSeparator.extractComma(element.value.rationAllowance) : '',
        "IS_REFRESHMENT_ALW": element.value.refreshmentAllowance ? this.commaSeparator.extractComma(element.value.refreshmentAllowance) : '',
        "IS_RETAINER_ALW": element.value.retainerAllowance ? this.commaSeparator.extractComma(element.value.retainerAllowance) : '',
        "IS_SECURITY_ALW": element.value.securityAllowance ? this.commaSeparator.extractComma(element.value.securityAllowance) : '',
        "IS_TIFFIN_ALW": element.value.tiffinAllowance ? this.commaSeparator.extractComma(element.value.tiffinAllowance) : '',
        "IS_TRAINING_ALW": element.value.trainingAllowance ? this.commaSeparator.extractComma(element.value.trainingAllowance) : '',
        "IS_TRAVEL_ALW": element.value.travelAllowance ? this.commaSeparator.extractComma(element.value.travelAllowance) : '',
        "IS_UNIFORM_ALW": element.value.uniformAllowance ? this.commaSeparator.extractComma(element.value.uniformAllowance) : '',
        "IS_WASHING_ALW": element.value.washingAllowance ? this.commaSeparator.extractComma(element.value.washingAllowance) : '',
        "IS_OTHER_ALW": element.value.otherAllowance ? this.commaSeparator.extractComma(element.value.otherAllowance) : '',

        "IS_ENTERTAINMENT_ALW": element.value.entertainmentAllowance ? this.commaSeparator.extractComma(element.value.entertainmentAllowance) : '',
        "IS_LEAVE_ALW": element.value.leaveAllowance ? this.commaSeparator.extractComma(element.value.leaveAllowance) : '',
        "IS_FREE_OR_CONCESSIONAL_PASSAGE": element.value.freeConcessionalPassage ? this.commaSeparator.extractComma(element.value.freeConcessionalPassage) : '',
        "IS_EMP_CONTRIBUTION_RPF": element.value.empContributionToRPF ? this.commaSeparator.extractComma(element.value.empContributionToRPF) : '',
        "IS_INTEREST_ACCRUED_RPF": element.value.interestAccruedOnRPF ? this.commaSeparator.extractComma(element.value.interestAccruedOnRPF) : '',


        // "IS_OTHER_INCOME_HEAD": element.value.otherIfAnyHead ? element.value.otherIfAnyHead : '',
        // "IS_OTHER_INCOME_VALUE": element.value.otherIfAnyValue ? this.commaSeparator.extractComma(element.value.otherIfAnyValue) : '',

      }
      // debugger;

      //#region for otherIfAny section
      obj = Object.assign(obj, otherOBJ);
      //#endregion

      this.requestData.push(obj);
    });

    //console.log('Salary requestData=', this.requestData);
    // debugger;
    this.spinner.start();
    this.apiService.post(this.serviceUrl + 'api/user-panel/income-head/salaries', this.requestData)
      .subscribe(result => {
        this.spinner.stop();

        if (this.isChangedSalarySummary) {
          this.updateSalarySummaryData();
        }

        if (result != null && this.isSaveDraft == false) {
          // console.log(result);

          this.toastr.success('Data Saved Successfully.', '', {
            timeOut: 1000,
          });

          this.headsOfIncome.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/heads-of-income') {
              if (i + 1 > this.lengthOfheads - 1) {
                this.router.navigate([this.selectedNavbar[2]['link']]);
              }
              if (i + 1 <= this.lengthOfheads - 1) {
                this.router.navigate([this.headsOfIncome[i + 1]['link']]);
              }
            }
          });
        }
        if (result != null && this.isSaveDraft == true) {
          this.toastr.success('item saved as a draft!', '', {
            timeOut: 1000,
          });
          //#region navigate current url without reloading
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          //#endregion
          this.isSaveDraft = false;
        }
      },
        error => {
          this.spinner.stop();
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/heads-of-income') {
        if (i - 1 < 0) {
          this.router.navigate(["/user-panel/additional-information"]);
        }
        if (i - 1 >= 0) {
          this.router.navigate([this.headsOfIncome[i - 1]['link']]);
        }
      }
    });
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }

  updateSalarySummaryData(): Promise<void> {
    let salarySummaryReqJson: any;
    salarySummaryReqJson = this.salarySummaryData;
    salarySummaryReqJson.forEach(element => {
      element.gross = this.commaSeparator.removeComma(element.gross, 0);
      element.exempted = this.commaSeparator.removeComma(element.exempted, 0);
      element.taxable = this.commaSeparator.removeComma(element.taxable, 0);
    });
    // console.log('salarySummaryReqJson', salarySummaryReqJson);
    return new Promise((resolve, reject) => {
      this.apiService.post(this.serviceUrl + 'api/user-panel/summary-info/salaries', salarySummaryReqJson)
        .subscribe(result => {
          resolve();
        },
          error => {
            reject();
            //console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 2500,
            });
          });
    });
  }

  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  positiveIntegerOnly(event): boolean {
    let value = event.target.value;


    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    if (next && !String(this.commaSeparator.extractComma(next)).match(this.regex)) {
      event.preventDefault();
    }

  }

  onKeyUpTaxableIncomeOfSro(i) {
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if ((element.value.taxableIncomeOfSro === null || element.value.taxableIncomeOfSro === "") && element.value.employmentType === "4") {
          this.taxableIncomeOfSro_showError[index] = true;
        } else this.taxableIncomeOfSro_showError[index] = false;
      }
    });
  }

  onKeyUpTaxApplicableOfSro(i) {
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if ((element.value.taxApplicableOfSro === null || element.value.taxApplicableOfSro === "") && element.value.employmentType === "4") {
          this.taxApplicableOfSro_showError[index] = true;
        } else this.taxApplicableOfSro_showError[index] = false;
      }
    });
  }

  placeCommaSeparator(i) {
    this.formArray.controls.forEach((element, index) => {

      if (index == i) {

        //validation
        if (element.value.employmentType === "1" && (element.value.basicPay == "" && element.value.houseRentAllowance == ""
          && element.value.medicalAllowance == "" && element.value.banglaNewYearAllowance == "" && element.value.festivalBonus == "")) {
          this.particular_showError[i] = true;
        } else this.particular_showError[i] = false;

        if (element.value.employmentType === "3" && (element.value.isRentFreeAccommodation == true && element.value.RentFreeAccValue == "")) {
          this.rentFreeAccValue_showError[i] = true;
        } else this.rentFreeAccValue_showError[i] = false;

        if (element.value.employmentType === "3" && (element.value.isAccommodationAtConcessRate == true && element.value.ConcessRateValue == "")) {
          this.concessRateValue_showError[i] = true;
        } else this.concessRateValue_showError[i] = false;

        if (element.value.employmentType === "3" && (element.value.isOtherNonCashBenefit == true && element.value.valueOfOtherNonCashBenefit == "")) {
          this.valueOfOtherNonCashBenefit_showError[index] = true;
        } else this.valueOfOtherNonCashBenefit_showError[index] = false;

        //end validation


        this.formArray.controls[i].patchValue({
          RentFreeAccValue: element.value.RentFreeAccValue ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.RentFreeAccValue)) : '',
          ConcessRateValue: element.value.ConcessRateValue ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.ConcessRateValue)) : '',
          ConcessRateRentPaidByTaxpayer: element.value.ConcessRateRentPaidByTaxpayer ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.ConcessRateRentPaidByTaxpayer)) : '',
          valueOfOtherNonCashBenefit: element.value.valueOfOtherNonCashBenefit ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.valueOfOtherNonCashBenefit)) : '',

          taxableIncomeOfSro: element.value.taxableIncomeOfSro ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.taxableIncomeOfSro)) : '',
          taxExemptedIncomeOfSro: element.value.taxExemptedIncomeOfSro ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.taxExemptedIncomeOfSro)) : '',
          taxApplicableOfSro: element.value.taxApplicableOfSro ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.taxApplicableOfSro)) : '',

          basicPay: element.value.basicPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.basicPay)) : '',
          houseRentAllowance: element.value.houseRentAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.houseRentAllowance)) : '',
          medicalAllowance: element.value.medicalAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.medicalAllowance)) : '',
          conveyanceAllowance: element.value.conveyanceAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.conveyanceAllowance)) : '',
          banglaNewYearAllowance: element.value.banglaNewYearAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.banglaNewYearAllowance)) : '',
          festivalBonus: element.value.festivalBonus ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.festivalBonus)) : '',

          //select2 - dropdown
          educationAllowance: element.value.educationAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.educationAllowance)) : '',
          mobileAllowance: element.value.mobileAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.mobileAllowance)) : '',
          telephoneAllowance: element.value.telephoneAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.telephoneAllowance)) : '',
          recreationAllowance: element.value.recreationAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.recreationAllowance)) : '',
          dearnessAllowance: element.value.dearnessAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.dearnessAllowance)) : '',
          deputationAllowance: element.value.deputationAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.deputationAllowance)) : '',
          chargeAllowance: element.value.chargeAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.chargeAllowance)) : '',
          judicialAllowance: element.value.judicialAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.judicialAllowance)) : '',
          defenseServiceAllowance: element.value.defenseServiceAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.defenseServiceAllowance)) : '',
          transportMaintenanceAllowance: element.value.transportMaintenanceAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.transportMaintenanceAllowance)) : '',
          foreignAllowance: element.value.foreignAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.foreignAllowance)) : '',
          hillAllowance: element.value.hillAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.hillAllowance)) : '',
          hazardousJobAllowance: element.value.hazardousJobAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.hazardousJobAllowance)) : '',
          arrearPay: element.value.arrearPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.arrearPay)) : '',
          speacialPay: element.value.speacialPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.speacialPay)) : '',
          personalPay: element.value.personalPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.personalPay)) : '',
          honorariumRewardFee: element.value.honorariumRewardFee ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.honorariumRewardFee)) : '',
          tadaExpended: element.value.tadaExpended ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.tadaExpended)) : '',
          gpfInterest: element.value.gpfInterest ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.gpfInterest)) : '',
          pension: element.value.pension ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.pension)) : '',
          gratuity: element.value.gratuity ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.gratuity)) : '',
          otherRetirementBenefits: element.value.otherRetirementBenefits ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.otherRetirementBenefits)) : '',
          appointmentPay: element.value.appointmentPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.appointmentPay)) : '',
          flyingPay: element.value.flyingPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.flyingPay)) : '',
          goodConductPay: element.value.goodConductPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.goodConductPay)) : '',
          ssgPay: element.value.ssgPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.ssgPay)) : '',
          worthynessPay: element.value.worthynessPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.worthynessPay)) : '',
          batsmanPay: element.value.batsmanPay ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.batsmanPay)) : '',
          chawkiAllowance: element.value.chawkiAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.chawkiAllowance)) : '',
          compensatoryAllowance: element.value.compensatoryAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.compensatoryAllowance)) : '',
          cookAllowance: element.value.cookAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.cookAllowance)) : '',
          dailyAllowance: element.value.dailyAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.dailyAllowance)) : '',
          disturbanceAllowance: element.value.disturbanceAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.disturbanceAllowance)) : '',
          domesticAidAllowance: element.value.domesticAidAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.domesticAidAllowance)) : '',
          haircutAllowance: element.value.haircutAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.haircutAllowance)) : '',
          medalAllowance: element.value.medalAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.medalAllowance)) : '',
          overtimeAllowance: element.value.overtimeAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.overtimeAllowance)) : '',
          rationAllowance: element.value.rationAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.rationAllowance)) : '',
          refreshmentAllowance: element.value.refreshmentAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.refreshmentAllowance)) : '',
          retainerAllowance: element.value.retainerAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.retainerAllowance)) : '',
          securityAllowance: element.value.securityAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.securityAllowance)) : '',
          tiffinAllowance: element.value.tiffinAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.tiffinAllowance)) : '',
          trainingAllowance: element.value.trainingAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.trainingAllowance)) : '',
          travelAllowance: element.value.travelAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.travelAllowance)) : '',
          uniformAllowance: element.value.uniformAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.uniformAllowance)) : '',
          washingAllowance: element.value.washingAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.washingAllowance)) : '',
          otherAllowance: element.value.otherAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.otherAllowance)) : '',

          entertainmentAllowance: element.value.entertainmentAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.entertainmentAllowance)) : '',
          leaveAllowance: element.value.leaveAllowance ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.leaveAllowance)) : '',
          freeConcessionalPassage: element.value.freeConcessionalPassage ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.freeConcessionalPassage)) : '',
          empContributionToRPF: element.value.empContributionToRPF ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.empContributionToRPF)) : '',
          interestAccruedOnRPF: element.value.interestAccruedOnRPF ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.interestAccruedOnRPF)) : '',

          // otherIfAnyValue: element.value.otherIfAnyValue ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.otherIfAnyValue)) : '',
        });

        //#region for otherIfAny section
        element.value.Other_If_Any.forEach((result, j) => {
          element.get('Other_If_Any')['controls'][j].patchValue({
            otherIfAnyValue: result.otherIfAnyValue ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(result.otherIfAnyValue)) : '',
          })
        });
        //#endregion
      }

    });
  }

  checkRentFreeAccommodationValue(i) {
    // debugger;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.RentFreeAccValue == 0) {
          element.value.RentFreeAccValue = '';
        }
      }
    });
  }

  checkConcessionalRateAccommodationValue(i){
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.ConcessRateValue == 0) {
          element.value.ConcessRateValue = '';
        }
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
            //console.log(error['error'].errorMessage);
          });
    });
  }

}


