import { Component, ElementRef, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { HeadsOfIncomeService } from "../heads-of-income.service";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommaSeparatorService } from "../../service/comma-separator.service";

@Component({
  selector: "app-interest-on-securities",
  templateUrl: "./interest-on-securities.component.html",
  styleUrls: ["./interest-on-securities.component.css"],
})
export class InterestOnSecuritiesComponent implements OnInit {

  group: FormGroup;
  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};

  selectedType: any

  isVisibleTab = [];
  isDisableAddSalBtn: boolean = true;
  navActive = {};
  headsOfIncome = [];
  lengthOfheads: any;

  requestIncomeHeadGetData: any;
  requestNavbarGetData: any;

  formGroup: FormGroup;
  additionalInformationForm: FormGroup;
  isSaveDraft: boolean = false;

  modalRef: BsModalRef;

  //#region Tooltip Text section

  securitiesTypeTooltip = `<span class="btn-block well-sm">
  Select the securities from which you received interest/profit, from the dropdown list.
  </span>`;

  sanchaypatraRegistrationTooltip = `<span class="btn-block well-sm">
  Registration number mentioned in your savings instrument.
  </span>`;

  issueDateTooltip = `<span class="btn-block well-sm">
  Issue date mentioned in your savings instrument.
  </span>`;

  valueTooltip = `<span class="btn-block well-sm">
  The face value (amount of investment) mentioned in your savings instrument.
  </span>`;

  grossInterestTooltip = `<span class="btn-block well-sm">
  The amount of interest earned on your savings instrument before deducting tax. This is net interest plus TDS amount.
  </span>`;

  tdsTooltip = `<span class="btn-block well-sm">
  The amount of tax deducted at source the time of interest payment.
  </span>`;

  nameOfBondTooltip = `<span class="btn-block well-sm">
  The name of the bond or other securities from which you received interest/ profit.
  </span>`;

  issueNoTooltip = `<span class="btn-block well-sm">
  Issue number mentioned in your securities.
  </span>`;

  bondIssueDateTooltip = `<span class="btn-block well-sm">
  Issue number mentioned in your securities.
  </span>`;

  bondValueTooltip = `<span class="btn-block well-sm">
  The face value (amount of investment) mentioned in your savings securities.
  </span>`;

  dateOfMaturityTooltip = `<span class="btn-block well-sm">
  The date of maturity mentioned in your securities.
  </span>`;

  bondGrossInterestTooltip = `<span class="btn-block well-sm">
  The amount of interest/profit earned on your securities before deducting tax. This is net interest plus source tax amount.
  </span>`;

  nameOfBondSROTooltip = `<span class="btn-block well-sm">
  The name of the bond or other securities from which you received interest/ profit.
  </span>`;

  issueNoSROTooltip = `<span class="btn-block well-sm">
  Issue number mentioned in your securities.
  </span>`;

  issueDateSROTooltip = `<span class="btn-block well-sm">
  Issue date mentioned in your securities.
  </span>`;

  issuingOfcSROTooltip = `<span class="btn-block well-sm">
  The name of the office that issued your securities. You may find this in your securities.
  </span>`;

  dateOfMaturitySROTooltip = `<span class="btn-block well-sm">
  The date of maturity mentioned in your securities.
  </span>`;

  grossInterestSROTooltip = `<span class="btn-block well-sm">
  The amount of interest/profit earned on your securities before deducting tax. This is net interest plus TDS amount.
  </span>`;

  relatedExpensesSROTooltip = `<span class="btn-block well-sm">
  The amount of expenses incurred (if any) for realization of interest income.  [Ignore expenses that are not allowed under the Income Tax Ordinance for computing income under this head].
  </span>`;

  interestIncomeSROTooltip = `<span class="btn-block well-sm">
  The amount of income computed after deducting allowable expenses from gross interest.
  </span>`;

  sroNOTooltip = `<span class="btn-block well-sm">
  The number of SRO under which your interest on securities enjoy special tax treatment.
  </span>`;

  SROyearTooltip = `<span class="btn-block well-sm ">
  The year which the SRO is issued.
  </span>`;

  particularSROTooltip = `<span class="btn-block well-sm">
  Any necessary description.
  </span>`;

  taxExemptedIncomeSROTooltip = `<span class="btn-block well-sm">
  The amount of income tax that is exempted from tax.
  </span>`;

  taxableIncomeSROTooltip = `<span class="btn-block well-sm">
  The amount of income tax that is taxable.
  </span>`;

  taxApplicableSROTooltip = `<span class="btn-block well-sm">
  Amount of tax calculated on taxable amount.
  </span>`;


  //#endregion

  item: any;
  isVisibleForm: any;
  formArray: FormArray;

  interestOnSecuritiesTypeName = [];
  interestOnSecurityDropdown = [];
  storeDropdownValue = [];


  sanchaypatraOtherArray = [];
  newSanchaypatraOther: any = {};
  isdeleteActionShowSanchaypatraOther: boolean;

  sanchaypatraPensionersArray = [];
  newSanchaypatraPensioners: any = {};
  isdeleteActionShowSanchaypatraPensioners: boolean;

  bondsandSecuritiesArray = [];
  newBondsandSecurities: any = {};
  isdeleteActionShowBondsandSecurities: boolean;

  maxDate: any;

  minYear: any;
  maxYear: any;

  requestData: any;
  userTin: any;
  sanchayapatraData: any;
  sanchayapatraPensionersData: any;
  bondsandSecuritiesData: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  isSanchayapatraHidden: boolean = false;
  hideSanchayapatra = [];
  isSanchayapatraPensionersHidden: boolean = false;
  hideSanchayapatraPensioners = [];
  isbondsandSecuritiesHidden: boolean = false;
  hideBondsandSecurities = [];

  interestSecurityData: any;
  taxableIncome = [];
  isTaxExemptedReadonly = [false];

  minIssueDate: any;
  maxIssueDate: any;

  //validation Arrays
  valdate_sanchayapatraOtherThanPensioners = [];
  validate_sanchayapatraPensioners = [];
  validate_bondsOtherSecurities = [];
  //
  IOS_Type_showError = [];
  sro_nameOfBond_showError = [];
  sro_issueDate_showError = [];
  sro_issuingOffice_showError = [];
  sro_dateOfMatirity_showError = [];
  sro_grossInterest_showError = [];
  sro_sroRef_showError = [];
  sro_year_showError = [];
  sro_particular_showError = [];
  sro_taxApplicable_showError = [];
  isShow: boolean = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private headService: HeadsOfIncomeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private elementRef: ElementRef,
    private datepipe: DatePipe,
    private spinner: NgxUiLoaderService,
    private mainNavbarList: mainNavbarListService,
    private commaSeparator: CommaSeparatorService) {
    this.formArray = new FormArray([]);
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  mainNavActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.mainNavActive = x;
  }

  navActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.navActive = x;
  }

  insertFormGroupToArray() {
    this.group = new FormGroup({
      id: new FormControl(0),
      interestOnSecuritiesType: new FormControl(0),
      interestOnSecuritiesTypeName: new FormControl(""),

      // registrationNo1: new FormControl(),
      // issueDate1: new FormControl(),
      // costValueOfSanchaypatra1: new FormControl(),
      // grossInterest1: new FormControl(),
      // sourceTaxDeducted1: new FormControl(),

      // registrationNo2: new FormControl(),
      // issueDate2: new FormControl(),
      // costValueOfSanchaypatra2: new FormControl(),
      // grossInterest2: new FormControl(),
      // sourceTaxDeducted2: new FormControl(),

      // nameofBond: new FormControl(),
      // issueNo: new FormControl(),
      // issueDate3: new FormControl(),
      // value:new FormControl(),
      // dateOfMaturity: new FormControl(),
      // grossInterest3: new FormControl(),

      // nameofBond2: new FormControl(),
      // issueNo2: new FormControl(),
      // issueDate4: new FormControl(),
      // issuingOffice: new FormControl(),
      // dateOfMaturity2: new FormControl(),
      // grossInterest4: new FormControl(),
      // income: new FormControl(),
      // sroNo: new FormControl(),
      // year: new FormControl(),
      // particular: new FormControl(),
      // taxExemptedIncome: new FormControl(),
      // taxApplicable: new FormControl(),

      //new
      nameofBond: new FormControl(),
      issueNo: new FormControl(),
      issueDate: new FormControl(),
      issuingOffice: new FormControl(),
      dateOfMaturity: new FormControl(),
      grossInterest: new FormControl(),
      relatedExpenses: new FormControl(),
      income: new FormControl(),
      sroNo: new FormControl(),
      year: new FormControl(),
      particular: new FormControl(),
      taxableIncome: new FormControl(),
      taxExemptedIncome: new FormControl(0),
      taxApplicable: new FormControl(),

      totalGrossInterest: new FormControl(),
      interestIncome: new FormControl(),

    });
    this.formArray.push(this.group);
    this.selectedProperty(this.formArray.length - 1);


    if (this.isSanchayapatraHidden == true) {
      this.hideSanchayapatra[this.formArray.length - 1] = true;
    }
    if (this.isSanchayapatraPensionersHidden == true) {
      this.hideSanchayapatraPensioners[this.formArray.length - 1] = true;
    }
    if (this.isbondsandSecuritiesHidden == true) {
      this.hideBondsandSecurities[this.formArray.length - 1] = true;
    }

  }

  ngOnInit(): void {

    this.interestOnSecurityDropdown = this.createIOSDropdown();
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.isVisibleForm = 0;
    this.navActiveSelect('2');
    this.getHeadsOfIncome();
    // this.insertFormGroupToArray();
    this.getMainNavbar();
    this.mainNavActiveSelect('2');
    this.isVisibleTab[0] = true;

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

    this.minYear = new Date(1972, 0, 1);
    this.maxYear = new Date();
    this.maxYear.setDate(this.maxYear.getDate());

    // this.minIssueDate = new Date(2020, 6, 1);
    this.maxIssueDate = new Date(2021, 5, 30);

    this.userTin = localStorage.getItem('tin');

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion

    this.getInterestData();
    this.checkSubmissionStatus();
  }

  loadAll_incomeHeads_on_Page_reload() {
    // get all selected income heads
    let allIncomeHeadsData: any;
    let getOnlyIncomeHeads = [];
    this.formGroup = this.fb.group({
      // returnScheme: new FormControl('Universal Self'),
      // assessmentYear: new FormControl('2021-2022'),
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
      // fromIncomeYear: new FormControl('01-07-2020'),
      // toIncomeYear: new FormControl('30-06-2021'),
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
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Interest on Securities');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();

      })

  }

  createIOSDropdown() {
    return [
      { typeId: '0', typeName: 'Select', active: true },
      { typeId: '1', typeName: 'Sanchayapatra (Other than Pensioners)', active: true },
      { typeId: '2', typeName: 'Sanchayapatra (Pensioners)', active: true },
      { typeId: '3', typeName: 'Bonds and Other Securities', active: false },
      { typeId: '4', typeName: 'Securities Subject to Reduced Tax Rate', active: true }
    ];
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }

  selectedProperty(i: number) {
    this.isVisibleForm = i;
  }

  getInterestData() {
    // debugger;
    let requestGetData: any;
    requestGetData =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };

    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-interest-on-security-data')
      .subscribe(result => {
        if (result.length > 0) {
          this.interestSecurityData = result;
          let registrationNo: any;
          let dateOfIssue: any;
          let value: any;
          let grossInterest: any;
          // let relatedExpenses:any;
          let deductedTax: any;
          let bondName: any;
          let dateOfMaturity: any;
          let issueOffice: any;
          let sroNo: any;
          let particularSro: any;
          let taxableIncome: any;
          let year: any;
          // debugger;
          if (this.interestSecurityData != null) {
           // console.log('ios get data', this.interestSecurityData);

            this.interestSecurityData.forEach((element, index) => {
              this.isVisibleTab[index] = false;
              this.isDisableAddSalBtn = false;

              if (element.iisTypeName == 'sanchayapatra_OTP') {
                this.isdeleteActionShowSanchaypatraOther = false;
                this.sanchaypatraOtherArray = [];
                let nestedSanchaypatraOtherArray = [];

                element.interestSecurityDetails.forEach((nesElement, i) => {
                  let issueDate = nesElement.dateOfIssue ? moment(nesElement.dateOfIssue, 'DD-MM-YYYY') : '';
                  let obj = {
                    registrationNo: nesElement.registrationNo ? nesElement.registrationNo : '',
                    issueDate: issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
                    costValueOfSanchaypatra: nesElement.value ? this.commaSeparator.currencySeparatorBD(nesElement.value) : 0,
                    grossInterest: nesElement.grossInterest >= 0 ? this.commaSeparator.currencySeparatorBD(nesElement.grossInterest) : '',
                    sourceTaxDeducted: nesElement.deductedTax >= 0 ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : '',
                  }
                  nestedSanchaypatraOtherArray.push(obj);

                  if (i > 0) {
                    this.isdeleteActionShowSanchaypatraOther = true;
                  }
                });
                this.sanchaypatraOtherArray = nestedSanchaypatraOtherArray;
                this.initializeSanchayapatraOTPValidation();
              }
              else if (element.iisTypeName == 'sanchayapatra_pensioners') {
                this.isdeleteActionShowSanchaypatraPensioners = false;
                this.sanchaypatraPensionersArray = [];
                let nestedSanchaypatraPensionersArray = [];

                element.interestSecurityDetails.forEach((nesElement, i) => {
                  let issueDate = nesElement.dateOfIssue ? moment(nesElement.dateOfIssue, 'DD-MM-YYYY') : '';
                  let obj = {
                    registrationNo: nesElement.registrationNo ? nesElement.registrationNo : '',
                    issueDate: issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
                    costValueOfSanchaypatra: nesElement.value ? this.commaSeparator.currencySeparatorBD(nesElement.value) : 0,
                    grossInterest: nesElement.grossInterest >= 0 ? this.commaSeparator.currencySeparatorBD(nesElement.grossInterest) : '',
                    sourceTaxDeducted: nesElement.deductedTax >= 0 ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : '',
                  }
                  nestedSanchaypatraPensionersArray.push(obj);
                  if (i > 0) {
                    this.isdeleteActionShowSanchaypatraPensioners = true;
                  }
                });

                this.sanchaypatraPensionersArray = nestedSanchaypatraPensionersArray;
                this.initializeSanchayapatraPansionersValidation();
              }
              else if (element.iisTypeName == 'bonds_and_other_securities') {
                this.isdeleteActionShowBondsandSecurities = false;
                this.bondsandSecuritiesArray = [];
                let nestedBondsandSecuritiesArray = [];
                element.interestSecurityDetails.forEach((nesElement, i) => {
                  let dateOfIssue = nesElement.dateOfIssue ? moment(nesElement.dateOfIssue, 'DD-MM-YYYY') : '';
                  let tmpDateOfMaturity = nesElement.dateOfMaturity ? moment(nesElement.dateOfMaturity, 'DD-MM-YYYY') : '';

                  let obj = {
                    nameofBond: nesElement.bondName ? nesElement.bondName : '',
                    issueNo: nesElement.registrationNo ? nesElement.registrationNo : '',
                    issueDate: dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
                    value: nesElement.value ? this.commaSeparator.currencySeparatorBD(nesElement.value) : 0,
                    dateOfMaturity: tmpDateOfMaturity ? this.datepipe.transform(tmpDateOfMaturity, 'dd-MM-yyyy') : '',
                    grossInterest: nesElement.grossInterest >= 0 ? this.commaSeparator.currencySeparatorBD(nesElement.grossInterest) : '',
                  }
                  nestedBondsandSecuritiesArray.push(obj);
                  if (i > 0) {
                    this.isdeleteActionShowBondsandSecurities = true;
                  }
                });
                this.bondsandSecuritiesArray = nestedBondsandSecuritiesArray;
                this.initializeBondsAndOtherValidation();
              }
              if (element.iisTypeName.substring(0, 30) === "income_exempted_reduced_by_sro") {
                element.interestSecurityDetails.forEach((nesElement, i) => {
                  registrationNo = nesElement.registrationNo ? nesElement.registrationNo : '';
                  dateOfIssue = nesElement.dateOfIssue ? nesElement.dateOfIssue : '';
                  value = nesElement.value ? nesElement.value : '';
                  grossInterest = nesElement.grossInterest ? nesElement.grossInterest : '';
                  deductedTax = nesElement.deductedTax ? nesElement.deductedTax : 0;
                  bondName = nesElement.bondName ? nesElement.bondName : 0;
                  dateOfMaturity = nesElement.dateOfMaturity ? nesElement.dateOfMaturity : '';
                  issueOffice = nesElement.issueOffice ? nesElement.issueOffice : '';
                  sroNo = nesElement.sroNo ? nesElement.sroNo : '';
                  particularSro = nesElement.particularSro ? nesElement.particularSro : 0;
                  taxableIncome = nesElement.taxableIncome ? nesElement.taxableIncome : 0;
                  year = nesElement.year ? nesElement.year : ''
                });
              }
              this.group = new FormGroup({
                id: new FormControl(element.id),
                interestOnSecuritiesType: new FormControl(element.iisTypeName.substring(0, 30)),

                nameofBond: new FormControl(bondName ? bondName : ''),
                issueNo: new FormControl(registrationNo ? registrationNo : ''),
                issueDate: new FormControl(dateOfIssue ? dateOfIssue : ''),
                issuingOffice: new FormControl(issueOffice ? issueOffice : ''),
                dateOfMaturity: new FormControl(dateOfMaturity ? dateOfMaturity : ''),
                grossInterest: new FormControl(grossInterest >= 0 ? this.commaSeparator.currencySeparatorBD(grossInterest) : ''),
                relatedExpenses: new FormControl(element.totalExpense >= 0 ? this.commaSeparator.currencySeparatorBD(element.totalExpense) : ''),
                income: new FormControl(value ? this.commaSeparator.currencySeparatorBD(value) : ''),
                sroNo: new FormControl(sroNo ? sroNo : ''),
                year: new FormControl(year ? year : ''),
                particular: new FormControl(particularSro ? particularSro : ''),
                taxableIncome: new FormControl(taxableIncome ? this.commaSeparator.currencySeparatorBD(taxableIncome) : 0),
                taxExemptedIncome: new FormControl(deductedTax >= 0 ? this.commaSeparator.currencySeparatorBD(deductedTax) : 0),
                taxApplicable: new FormControl(element.applicableTaxSRO ? this.commaSeparator.currencySeparatorBD(element.applicableTaxSRO) : ''),

                totalGrossInterest: new FormControl(),
                interestIncome: new FormControl(),

              })

              this.storeDropdownValue[index] = element.iisTypeName;
              this.formArray.push(this.group);
              this.interestOnSecuritiesTypeName[index] = this.getIIOSTypeName(element.iisTypeName);
              this.calBondTotalGross(1, index);
              if ((Number(this.commaSeparator.removeComma(this.formArray.at(index).get('income').value, 0))) < 0) {
                this.isTaxExemptedReadonly[index] = true;
              }
              this.selectedProperty(this.formArray.length - 1);
            });
          }
          this.spinner.stop();
        }
        else {
          this.insertFormGroupToArray();
          this.isDisableAddSalBtn = true;
          this.spinner.stop();
        }
      },
        error => {
          this.spinner.stop();
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  getIIOSTypeName(iiosType: String) {
    if (iiosType === 'sanchayapatra_OTP') return 'Sanchayapatra (Other than Pensioners)';
    else if (iiosType === 'sanchayapatra_pensioners') return 'Sanchayapatra (Pensioners)';
    else if (iiosType === 'bonds_and_other_securities') return 'Bonds and Other Securities';
    else if (iiosType.substring(0, 30) === 'income_exempted_reduced_by_sro') return 'Securities Subject to Reduced Tax Rate';
  }

  changeSnchayapatraOTP(i, formControlName) {
    if (formControlName === 'registrationNo')
      this.valdate_sanchayapatraOtherThanPensioners[i].registrationNo_showError = false;
    if (formControlName === 'issueDate')
      this.valdate_sanchayapatraOtherThanPensioners[i].issueDate_showError = false;
    if (formControlName === 'costValueOfSanchaypatra')
      this.valdate_sanchayapatraOtherThanPensioners[i].costValueOfSanchaypatra_showError = false;
    if (formControlName === 'grossInterest')
      this.valdate_sanchayapatraOtherThanPensioners[i].grossInterest_showError = false;
    if (formControlName === 'sourceTaxDeducted')
      this.valdate_sanchayapatraOtherThanPensioners[i].tds_showError = false;
  }

  changeSnchayapatraPansioners(i, formControlName) {
    if (formControlName === 'registrationNo')
      this.validate_sanchayapatraPensioners[i].registrationNo_showError = false;
    if (formControlName === 'issueDate')
      this.validate_sanchayapatraPensioners[i].issueDate_showError = false;
    if (formControlName === 'costValueOfSanchaypatra')
      this.validate_sanchayapatraPensioners[i].costValueOfSanchaypatra_showError = false;
    if (formControlName === 'grossInterest')
      this.validate_sanchayapatraPensioners[i].grossInterest_showError = false;
    if (formControlName === 'sourceTaxDeducted')
      this.validate_sanchayapatraPensioners[i].tds_showError = false;
  }

  changeBondsAndOther(i, formControlName) {
    if (formControlName === 'nameofBond')
      this.validate_bondsOtherSecurities[i].nameofBond_showError = false;
    if (formControlName === 'issueNo')
      this.validate_bondsOtherSecurities[i].issueNo_showError = false;
    if (formControlName === 'issueDate')
      this.validate_bondsOtherSecurities[i].issueDate_showError = false;
    if (formControlName === 'value')
      this.validate_bondsOtherSecurities[i].value_showError = false;
    if (formControlName === 'dateOfMaturity')
      this.validate_bondsOtherSecurities[i].dateOfMaturity_showError = false;
    if (formControlName === 'grossInterest')
      this.validate_bondsOtherSecurities[i].grossInterest_showError = false;
  }

  changeSRO(i, formControlName) {
    if (formControlName === 'nameofBond')
      this.sro_nameOfBond_showError[i] = false;
    if (formControlName === 'issueDate')
      this.sro_issueDate_showError[i] = false;
    if (formControlName === 'issuingOffice')
      this.sro_issuingOffice_showError[i] = false;
    if (formControlName === 'dateOfMaturity')
      this.sro_dateOfMatirity_showError[i] = false;
    if (formControlName === 'grossInterest')
      this.sro_grossInterest_showError[i] = false;
    if (formControlName === 'sroNo')
      this.sro_sroRef_showError[i] = false;
    if (formControlName === 'year')
      this.sro_year_showError[i] = false;
    if (formControlName === 'particular')
      this.sro_particular_showError[i] = false;
    if (formControlName === 'taxApplicable')
      this.sro_taxApplicable_showError[i] = false;
  }

  checkDropdownDuplication(event, i) {
    let status: boolean = false;
    this.storeDropdownValue.forEach(element => {
      if (element == event.target.value) {
        status = true;
      }
    });
    if (status) {
      this.interestOnSecuritiesTypeName[i] = '';
      this.storeDropdownValue[i] = '';
      return true;
    }
    else

      this.storeDropdownValue[i] = event.target.value;
    return false;
  }

  interestOnSecuritiesTypeChange(event, i) {
    // debugger;
    let isDuplicate: boolean = false;
    this.initializeErrorIndexes(i);
    if (event.target.value === "sanchayapatra_OTP") {
      //#region  check type duplication
      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Sanchayapatra (Other than Pensioners) already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          interestOnSecuritiesType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }
      //#endregion
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
      this.interestOnSecuritiesTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.sanchaypatraOtherArray = [];
      this.newSanchaypatraOther = { registrationNo: '', issueDate: '', costValueOfSanchaypatra: '', grossInterest: '', sourceTaxDeducted: '' };
      this.sanchaypatraOtherArray.push(this.newSanchaypatraOther);
      this.isdeleteActionShowSanchaypatraOther = false;
      this.initializeSanchayapatraOTPValidation();
    }
    else if (event.target.value === "sanchayapatra_pensioners") {
      //#region  check type duplication
      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Sanchayapatra (Pensioners) already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          interestOnSecuritiesType: 0,
        });
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }
      //#endregion


      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
      this.interestOnSecuritiesTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.sanchaypatraPensionersArray = [];
      this.newSanchaypatraPensioners = { registrationNo: "", issueDate: "", costValueOfSanchaypatra: "", grossInterest: "", sourceTaxDeducted: "" };
      this.sanchaypatraPensionersArray.push(this.newSanchaypatraPensioners);
      this.isdeleteActionShowSanchaypatraPensioners = false;
      this.initializeSanchayapatraPansionersValidation();
    }
    else if (event.target.value === "bonds_and_other_securities") {
      //#region  check type duplication
      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Bonds and Other Securities already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          interestOnSecuritiesType: 0,
        });
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }
      //#endregion

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
      this.interestOnSecuritiesTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.bondsandSecuritiesArray = [];
      this.newBondsandSecurities = { nameofBond: "", issueNo: "", issueDate: "", value: "", dateOfMaturity: "", grossInterest: "" };
      this.bondsandSecuritiesArray.push(this.newBondsandSecurities);
      this.isdeleteActionShowBondsandSecurities = false;
      this.initializeBondsAndOtherValidation();
    }
    else if (event.target.value.substring(0, 30) === "income_exempted_reduced_by_sro") {
      // debugger;
      this.storeDropdownValue[i] = event.target.value;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.interestOnSecuritiesTypeName[i] =
        event.target.options[event.target.options.selectedIndex].text;
    }

    else {
      this.interestOnSecuritiesTypeName[i] = '';
      this.isVisibleTab[i] = false;
    }

    if (!isDuplicate)
      this.formArray.controls[i].patchValue({
        interestOnSecuritiesTypeName: this.interestOnSecuritiesTypeName,
      });

  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
    this.lengthOfheads = this.headsOfIncome.length;
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }

  close(i) {
    // debugger;
    this.formArray.controls.forEach((element, index) => {
      if (index == i && element.value.id > 0) {
        this.apiService.delete(this.serviceUrl + 'api/user-panel/ios-deleteItem?id=' + element.value.id)
          .subscribe(result => {
            if (result.success) {
              this.toastr.success(result.replyMessage, '', {
                timeOut: 1000,
              });
              this.afterCloseTab(i);
              if (element.value.interestOnSecuritiesType === 'sanchayapatra_OTP') {
                this.sanchaypatraOtherArray = [];
              }
              if (element.value.interestOnSecuritiesType === 'sanchayapatra_pensioners') {
                this.sanchaypatraPensionersArray = [];
              }
              if (element.value.interestOnSecuritiesType === 'bonds_and_other_securities') {
                this.bondsandSecuritiesArray = [];
              }
            }
            else {
              this.toastr.warning('Failed to Delete!', '', {
                timeOut: 1000,
              });
              return;
            }
          })
      }
      else if (index == i && element.value.id <= 0) {
        this.afterCloseTab(i);
      }
    });
  }

  afterCloseTab(i: any) {
    this.formArray.controls.forEach((element, index) => {
      if (i == index) {
        if (element.value.interestOnSecuritiesType === 'sanchayapatra_OTP') {
          this.sanchaypatraOtherArray = [];
        }
        if (element.value.interestOnSecuritiesType === 'sanchayapatra_pensioners') {
          this.sanchaypatraPensionersArray = [];
        }
        if (element.value.interestOnSecuritiesType === 'bonds_and_other_securities') {
          this.bondsandSecuritiesArray = [];
        }
        if (element.value.interestOnSecuritiesType === 'income_exempted_reduced_by_sro') {
          this.closeErrorIndexes(i);
        }
      }
    });

    this.storeDropdownValue.splice(i, 1);
    this.formArray.removeAt(i);
    this.interestOnSecuritiesTypeName.splice(i, 1);

    if (this.formArray.length >= 1) {
      this.isVisibleForm = this.formArray.controls.length - 1;
      this.modalRef.hide();
    }
    else if (this.formArray.length < 1) {
      this.isVisibleForm = 0;
      this.insertFormGroupToArray();
      this.modalRef.hide();
      this.isVisibleTab[i] = true;
      this.isDisableAddSalBtn = true;
    }
    else {

    }
  }

  initializeErrorIndexes(i) {
    this.IOS_Type_showError[i] = false;
    this.sro_nameOfBond_showError[i] = false;
    this.sro_issueDate_showError[i] = false;
    this.sro_issuingOffice_showError[i] = false;
    this.sro_dateOfMatirity_showError[i] = false;
    this.sro_grossInterest_showError[i] = false;
    this.sro_sroRef_showError[i] = false;
    this.sro_year_showError[i] = false;
    this.sro_particular_showError[i] = false;
    this.sro_taxApplicable_showError[i] = false;
  }

  closeErrorIndexes(i) {
    this.IOS_Type_showError.splice(i, 1);
    this.sro_nameOfBond_showError.splice(i, 1);
    this.sro_issueDate_showError.splice(i, 1);
    this.sro_issuingOffice_showError.splice(i, 1);
    this.sro_dateOfMatirity_showError.splice(i, 1);
    this.sro_grossInterest_showError.splice(i, 1);
    this.sro_sroRef_showError.splice(i, 1);
    this.sro_year_showError.splice(i, 1);
    this.sro_particular_showError.splice(i, 1);
    this.sro_taxApplicable_showError.splice(i, 1);
  }

  addRowSanchaypatraOther(index) {
    if (this.validationCheckingSOTP()) {
      this.newSanchaypatraOther = { registrationNo: "", issueDate: "", costValueOfSanchaypatra: "", grossInterest: "", sourceTaxDeducted: "" };
      this.sanchaypatraOtherArray.push(this.newSanchaypatraOther);
      this.isdeleteActionShowSanchaypatraOther = true;
      this.initializeSanchayapatraOTPValidation();
      return true;
    }
    else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }

  }

  deleteRowSanchaypatraOther(index) {
    if (this.sanchaypatraOtherArray.length == 1) {
      this.isdeleteActionShowSanchaypatraOther = false;
      return false;
    } else {
      this.sanchaypatraOtherArray.splice(index, 1);
      this.valdate_sanchayapatraOtherThanPensioners.splice(index, 1);
      this.isdeleteActionShowSanchaypatraOther = true;
      if (this.sanchaypatraOtherArray.length == 1) {
        this.isdeleteActionShowSanchaypatraOther = false;
      }
      return true;
    }
  }

  addRowSanchaypatraPensioners(index) {
    // debugger;
    if (this.validationCheckingSP()) {
      this.newSanchaypatraPensioners = { registrationNo: "", issueDate: "", costValueOfSanchaypatra: "", grossInterest: "", sourceTaxDeducted: "" };
      this.sanchaypatraPensionersArray.push(this.newSanchaypatraPensioners);
      this.isdeleteActionShowSanchaypatraPensioners = true;
      this.initializeSanchayapatraPansionersValidation();
      return true;
    }
    else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }

  }

  deleteRowSanchaypatraPensioners(index) {
    if (this.sanchaypatraPensionersArray.length == 1) {
      this.isdeleteActionShowSanchaypatraPensioners = false;
      return false;
    } else {
      this.sanchaypatraPensionersArray.splice(index, 1);
      this.validate_sanchayapatraPensioners.splice(index, 1);
      this.isdeleteActionShowSanchaypatraPensioners = true;
      if (this.sanchaypatraPensionersArray.length == 1) {
        this.isdeleteActionShowSanchaypatraPensioners = false;
      }
      return true;
    }
  }

  addRowBondsandSecurities(index, i) {
    if (this.validationCheckingBondsOther()) {
      this.newBondsandSecurities = { nameofBond: "", issueNo: "", issueDate: "", value: "", dateOfMaturity: "", grossInterest: "" };
      this.bondsandSecuritiesArray.push(this.newBondsandSecurities);
      this.isdeleteActionShowBondsandSecurities = true;
      this.initializeBondsAndOtherValidation();
      return true;
    }
    else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteRowBondsandSecurities(index, i) {
    if (this.bondsandSecuritiesArray.length == 1) {
      this.isdeleteActionShowBondsandSecurities = false;
      this.calBondTotalGross(index, i);
      return false;
    } else {
      this.bondsandSecuritiesArray.splice(index, 1);
      this.validate_bondsOtherSecurities.splice(index, 1);
      this.isdeleteActionShowBondsandSecurities = true;
      if (this.bondsandSecuritiesArray.length == 1) {
        this.isdeleteActionShowBondsandSecurities = false;
      }
      this.calBondTotalGross(index, i);
      return true;
    }
  }

  calIncome(i) {
    let sroIncome = [];
    sroIncome[i] = (Number(this.commaSeparator.removeComma(this.formArray.at(i).get('grossInterest').value, 0)) - Number(this.commaSeparator.removeComma(this.formArray.at(i).get('relatedExpenses').value, 0)));
    this.formArray.at(i).get('income').setValue(this.commaSeparator.currencySeparatorBD(sroIncome[i]));

    this.calTaxableIncome(i);
  }

  calBondTotalGross(e: any, i) {
    // debugger;
    let totalGross: number;
    let gross: number;

    this.bondsandSecuritiesArray.forEach((element, i) => {
      gross = Number(this.commaSeparator.removeComma(element.grossInterest, 0));
      totalGross = (totalGross ? totalGross : 0) + gross;
    }
    );

    this.formArray.controls[i].patchValue({
      totalGrossInterest: this.commaSeparator.currencySeparatorBD(totalGross),
    });

    this.calInterestIncome(i);

  }

  calInterestIncome(i) {
    // debugger;
    let interestIncome = [];
    // if (this.formArray.at(i).get('relatedExpenses').value) {
    //   if (this.formArray.at(i).get('relatedExpenses').value > this.formArray.at(i).get('totalGrossInterest').value) {
    //     this.toastr.warning('Related expenses can not be greater than total gross interest.', '', {
    //       timeOut: 2000,
    //     });
    //     this.formArray.at(i).get('relatedExpenses').setValue(this.formArray.at(i).get('totalGrossInterest').value);
    //     interestIncome[i] = (this.formArray.at(i).get('totalGrossInterest').value - (this.formArray.at(i).get('relatedExpenses').value ? this.formArray.at(i).get('relatedExpenses').value : 0));
    //     this.formArray.at(i).get('interestIncome').setValue(interestIncome[i]);
    //     return;
    //   }
    // }
    interestIncome[i] = (Number(this.commaSeparator.removeComma(this.formArray.at(i).get('totalGrossInterest').value, 0)) - (this.formArray.at(i).get('relatedExpenses').value ? Number(this.commaSeparator.removeComma(this.formArray.at(i).get('relatedExpenses').value, 0)) : 0));
    this.formArray.at(i).get('interestIncome').setValue(this.commaSeparator.currencySeparatorBD(interestIncome[i]));
  }

  calTaxableIncome(i) {
    // if (this.taxableIncome[i] < 0) {
    //   this.taxableIncome[i] = 0;
    // }
    // if (isNaN(this.formArray.at(i).get('income').value)) {
    //   this.toastr.warning(this.formArray.at(i).get('income').value + "is not a numeric number", '', {
    //     timeOut: 2000,
    //   });
    //   this.formArray.at(i).get('income').setValue(0);
    //   return;
    // }
    if ((Number(this.commaSeparator.removeComma(this.formArray.at(i).get('income').value, 0))) < 0) {
      this.isTaxExemptedReadonly[i] = true;
      this.formArray.at(i).get('taxableIncome').setValue('0');
      this.formArray.at(i).get('taxExemptedIncome').setValue('0');
      return;
    }
    if ((Number(this.commaSeparator.removeComma(this.formArray.at(i).get('taxExemptedIncome').value, 0))) > (Number(this.commaSeparator.removeComma(this.formArray.at(i).get('income').value, 0)))) {
      this.isTaxExemptedReadonly[i] = false;
      this.toastr.warning('Tax Exempted Income value can not be greater than NetIncome value.', '', {
        timeOut: 3000,
      });
      this.formArray.at(i).get('taxExemptedIncome').setValue((this.formArray.at(i).get('income').value));
      this.taxableIncome[i] = (Number(this.commaSeparator.removeComma(this.formArray.at(i).get('income').value, 0)) - Number(this.commaSeparator.removeComma(this.formArray.at(i).get('taxExemptedIncome').value, 0)));
      this.formArray.at(i).get('taxableIncome').setValue(this.commaSeparator.currencySeparatorBD(this.taxableIncome[i]));
      return;
    }
    else {
      this.isTaxExemptedReadonly[i] = false;
      this.taxableIncome[i] = (Number(this.commaSeparator.removeComma(this.formArray.at(i).get('income').value, 0)) - Number(this.commaSeparator.removeComma(this.formArray.at(i).get('taxExemptedIncome').value, 0)));
      this.formArray.at(i).get('taxableIncome').setValue(this.commaSeparator.currencySeparatorBD(this.taxableIncome[i]));

    }

  }

  submittedData() {
    // debugger;
    this.requestData = [];
    let obj: any;

    this.sanchayapatraData = [];
    let sanchayapatraOBJ: any;

    this.sanchayapatraPensionersData = [];
    let sanchayapatraPensionersOBJ: any;

    this.bondsandSecuritiesData = [];
    let bondsandSecuritiesOBJ: any;

    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      if (element.value.interestOnSecuritiesType === "sanchayapatra_OTP" && successValidation) {
        if (this.sanchaypatraOtherArray.length > 0 && !this.validationCheckingSOTP()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          // this.getSanchyapatraOTPErrorIndex();
          return;
        }
      }
      if (element.value.interestOnSecuritiesType === "sanchayapatra_pensioners" && successValidation) {
        if (!this.validationCheckingSP()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          // this.getSanchyapatraPansionerErrorIndex();
          return;
        }
      }
      if (element.value.interestOnSecuritiesType === "bonds_and_other_securities" && successValidation) {
        if (this.bondsandSecuritiesArray.length > 0 && !this.validationCheckingBondsOther()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          //this.getBondsOtherErrorIndex();
          return;
        }
      }
      if (element.value.interestOnSecuritiesType === "income_exempted_reduced_by_sro" && successValidation) {
        if (!this.validateSRO()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = this.getSroErrorIndex();
          return;
        }
      }
    })
    if (!successValidation) return;
    // if(this.sanchaypatraOtherArray.length > 0 && !this.validationCheckingSOTP()) {
    //   this.toastr.warning('Please fill all the required fields!', '', {
    //     timeOut: 2000,
    //   });
    //   this.getSanchyapatraOTPErrorIndex();
    //   return;
    // }

    this.sanchaypatraOtherArray.forEach((element, index) => {
      let issueDate = element.issueDate ? moment(element.issueDate, 'DD-MM-YYYY') : '';
      sanchayapatraOBJ = {
        "registrationNo": element.registrationNo ? element.registrationNo : '',
        "dateOfIssue": issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
        "value": element.costValueOfSanchaypatra ? Math.round(Number(this.commaSeparator.removeComma(element.costValueOfSanchaypatra, 0))) : 0,
        "grossInterest": element.grossInterest ? Math.round(Number(this.commaSeparator.removeComma(element.grossInterest, 0))) : 0,
        "deductedTax": element.sourceTaxDeducted ? Math.round(Number(this.commaSeparator.removeComma(element.sourceTaxDeducted, 0))) : 0,
        "bondName": '',
        "dateOfMaturity": '',
        "issueOffice": "",
        "sroNo": "",
        "particularSro": "",
        "taxableIncome": 0,
        "year": ""
      }
      this.sanchayapatraData.push(sanchayapatraOBJ);
    });

   // console.log("sanchaypatraOtherArray: " + this.sanchayapatraData);

    // if(!this.validationCheckingSP()) {
    //   this.toastr.warning('Please fill all the required fields!', '', {
    //     timeOut: 2000,
    //   });
    //   this.getSanchyapatraPansionerErrorIndex();
    //   return;
    // }

    this.sanchaypatraPensionersArray.forEach((element, index) => {
      let issueDate = element.issueDate ? moment(element.issueDate, 'DD-MM-YYYY') : '';
      sanchayapatraPensionersOBJ = {
        "registrationNo": element.registrationNo ? element.registrationNo : '',
        "dateOfIssue": issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
        "value": element.costValueOfSanchaypatra ? Math.round(Number(this.commaSeparator.removeComma(element.costValueOfSanchaypatra, 0))) : 0,
        "grossInterest": element.grossInterest ? Math.round(Number(this.commaSeparator.removeComma(element.grossInterest, 0))) : 0,
        "deductedTax": element.sourceTaxDeducted ? Math.round(Number(this.commaSeparator.removeComma(element.sourceTaxDeducted, 0))) : 0,
        "bondName": '',
        "dateOfMaturity": '',
        "issueOffice": "",
        "sroNo": "",
        "particularSro": "",
        "taxableIncome": 0,
        "year": ""
      }
      this.sanchayapatraPensionersData.push(sanchayapatraPensionersOBJ);
    });

   // console.log("sanchayapatraPensionersData" + this.sanchayapatraPensionersData);

    // if(!this.validationCheckingBondsOther()) {
    //   this.toastr.warning('Please fill all the required fields!', '', {
    //     timeOut: 2000,
    //   });
    //   this.getBondsOtherErrorIndex();
    //   return;
    // }
    this.bondsandSecuritiesArray.forEach((element, index) => {
      let issueDate = element.issueDate ? moment(element.issueDate, 'DD-MM-YYYY') : '';
      let dateOfMaturity = element.dateOfMaturity ? moment(element.dateOfMaturity, 'DD-MM-YYYY') : '';
      bondsandSecuritiesOBJ = {
        "registrationNo": element.issueNo ? element.issueNo : '',
        "dateOfIssue": issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
        "value": element.value ? Math.round(Number(this.commaSeparator.removeComma(element.value, 0))) : 0,
        "grossInterest": element.grossInterest ? Math.round(Number(this.commaSeparator.removeComma(element.grossInterest, 0))) : 0,
        "deductedTax": 0,
        "bondName": element.nameofBond ? element.nameofBond : '',
        "dateOfMaturity": dateOfMaturity ? this.datepipe.transform(dateOfMaturity, 'dd-MM-yyyy') : '',
        "issueOffice": "",
        "sroNo": "",
        "particularSro": "",
        "taxableIncome": 0,
        "year": ""
      }
      this.bondsandSecuritiesData.push(bondsandSecuritiesOBJ);
    });

  //  console.log("bondsandSecuritiesData" + this.bondsandSecuritiesData);


    this.formArray.controls.forEach((element, index) => {

      if (element.value.interestOnSecuritiesType == 'sanchayapatra_OTP') {

        obj = {
          "iisTypeName": element.value.interestOnSecuritiesType,
          "applicableTaxSRO": 0,
          "totalExpense": element.value.relatedExpenses ? Number(this.commaSeparator.removeComma(element.value.relatedExpenses, 0)) : 0,
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "interestSecurityDetails": this.sanchayapatraData
        }
        this.requestData.push(obj);
      }

      if (element.value.interestOnSecuritiesType == 'sanchayapatra_pensioners') {

        obj = {
          "iisTypeName": element.value.interestOnSecuritiesType,
          "applicableTaxSRO": 0,
          "totalExpense": element.value.relatedExpenses ? Number(this.commaSeparator.removeComma(element.value.relatedExpenses, 0)) : 0,
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "interestSecurityDetails": this.sanchayapatraPensionersData
        }
        this.requestData.push(obj);
      }

      if (element.value.interestOnSecuritiesType == 'bonds_and_other_securities') {

        obj = {
          "iisTypeName": element.value.interestOnSecuritiesType,
          "applicableTaxSRO": 0,
          "totalExpense": element.value.relatedExpenses ? Number(this.commaSeparator.removeComma(element.value.relatedExpenses, 0)) : 0,
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "interestSecurityDetails": this.bondsandSecuritiesData
        }
        this.requestData.push(obj);
      }
    });


    //for SRO income==value & taxExemptedIncome==deductedTax

    // if (!this.validateSRO()) {
    //   this.toastr.warning('Please fill all the required fields!', '', {
    //     timeOut: 2000,
    //   });
    //   this.isVisibleForm = this.getSroErrorIndex();
    //   return;
    // }

    let countSro = 1;
    this.formArray.controls.forEach((element, index) => {
      if (element.value.interestOnSecuritiesType == 'income_exempted_reduced_by_sro') {
        let dateOfIssue = element.value.issueDate ? moment(element.value.issueDate, 'DD-MM-YYYY') : '';
        let dateOfMaturity = element.value.dateOfMaturity ? moment(element.value.dateOfMaturity, 'DD-MM-YYYY') : '';
        let year = element.value.year ? moment(element.value.year, 'YYYY') : '';
        obj = {
          "iisTypeName": element.value.interestOnSecuritiesType + countSro.toString(),
          "applicableTaxSRO": Number(this.commaSeparator.removeComma(element.value.taxApplicable, 0)),
          "totalExpense": element.value.relatedExpenses ? Number(this.commaSeparator.removeComma(element.value.relatedExpenses, 0)) : 0,
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "interestSecurityDetails": [
            {
              "registrationNo": element.value.issueNo ? element.value.issueNo : '',
              "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
              "value": element.value.income ? Number(this.commaSeparator.removeComma(element.value.income, 0)) : 0,
              "grossInterest": element.value.grossInterest ? Number(this.commaSeparator.removeComma(element.value.grossInterest, 0)) : 0,
              "deductedTax": element.value.taxExemptedIncome ? Number(this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0)) : 0,
              "bondName": element.value.nameofBond ? element.value.nameofBond : '',
              "dateOfMaturity": dateOfMaturity ? this.datepipe.transform(dateOfMaturity, 'dd-MM-yyyy') : '',
              "issueOffice": element.value.issuingOffice ? element.value.issuingOffice : '',
              "sroNo": element.value.sroNo ? element.value.sroNo : '',
              "particularSro": element.value.particular ? element.value.particular : '',
              "taxableIncome": element.value.taxableIncome ? Number(this.commaSeparator.removeComma(element.value.taxableIncome, 0)) : 0,
              "year": year ? this.datepipe.transform(year, 'yyyy') : '',
            }
          ]
        }
        this.requestData.push(obj);
      }
      countSro = countSro + 1;
    });

 //   console.log('Requested Data=', this.requestData);
    this.apiService.post(this.serviceUrl + 'api/user-panel/save-interest-on-security-data', this.requestData)
      .subscribe(result => {
        if (result != null && this.isSaveDraft == false) {
        //  console.log(result);
          this.toastr.success('Data Saved Successfully.', '', {
            timeOut: 1000,
          });
          this.headsOfIncome.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/interest-on-securities') {
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
     //     console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/interest-on-securities') {
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  sanchaypatraOTPCommaSeparator(i: number, columnTitle: any) {
    if (columnTitle === 'costValueOfSanchaypatra') this.sanchaypatraOtherArray[i].costValueOfSanchaypatra = this.sanchaypatraOtherArray[i].costValueOfSanchaypatra ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.sanchaypatraOtherArray[i].costValueOfSanchaypatra, 0)) : '';
    else if (columnTitle === 'grossInterest') this.sanchaypatraOtherArray[i].grossInterest = this.sanchaypatraOtherArray[i].grossInterest ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.sanchaypatraOtherArray[i].grossInterest, 0)) : '';
    else if (columnTitle === 'sourceTaxDeducted') this.sanchaypatraOtherArray[i].sourceTaxDeducted = this.sanchaypatraOtherArray[i].sourceTaxDeducted ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.sanchaypatraOtherArray[i].sourceTaxDeducted, 0)) : '';
  }

  sanchaypatraPensionersCommaSeparator(i: number, columnTitle: any) {
    if (columnTitle === 'costValueOfSanchaypatra') this.sanchaypatraPensionersArray[i].costValueOfSanchaypatra = this.sanchaypatraPensionersArray[i].costValueOfSanchaypatra ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.sanchaypatraPensionersArray[i].costValueOfSanchaypatra, 0)) : '';
    else if (columnTitle === 'grossInterest') this.sanchaypatraPensionersArray[i].grossInterest = this.sanchaypatraPensionersArray[i].grossInterest ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.sanchaypatraPensionersArray[i].grossInterest, 0)) : '';
    else if (columnTitle === 'sourceTaxDeducted') this.sanchaypatraPensionersArray[i].sourceTaxDeducted = this.sanchaypatraPensionersArray[i].sourceTaxDeducted ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.sanchaypatraPensionersArray[i].sourceTaxDeducted, 0)) : '';
  }

  bondsandSecuritiesCommaSeparator(i: number, columnTitle: any) {
    if (columnTitle === 'value') this.bondsandSecuritiesArray[i].value = this.bondsandSecuritiesArray[i].value ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.bondsandSecuritiesArray[i].value, 0)) : '';
    else if (columnTitle === 'grossInterest') this.bondsandSecuritiesArray[i].grossInterest = this.bondsandSecuritiesArray[i].grossInterest ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.bondsandSecuritiesArray[i].grossInterest, 0)) : '';
  }


  placeCommaSeparator(i: number, columnTitle: any) {


    if (columnTitle === 'grossInterest') {
      this.formArray.at(i).get('grossInterest').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('grossInterest').value, 0)));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.formArray.at(i).get('relatedExpenses').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('relatedExpenses').value, 0)));
    }
    else if (columnTitle === 'taxExemptedIncome') {
      this.formArray.at(i).get('taxExemptedIncome').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('taxExemptedIncome').value, 0)));
    }
    else if (columnTitle === 'taxApplicable') {
      this.formArray.at(i).get('taxApplicable').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('taxApplicable').value, 0)));
    }
  }


  //sanchyapatra other than pansioners validation start

  initializeSanchayapatraOTPValidation() {
    this.valdate_sanchayapatraOtherThanPensioners = [];
    this.sanchaypatraOtherArray.forEach(element => {
      let data = {
        "registrationNo_showError": false,
        "issueDate_showError": false,
        "costValueOfSanchaypatra_showError": false,
        "grossInterest_showError": false,
        "tds_showError": false
      }
      this.valdate_sanchayapatraOtherThanPensioners.push(data);
    });
 //   console.log(this.valdate_sanchayapatraOtherThanPensioners);
  }

  initializeSOTPValidationError(i) {
    this.valdate_sanchayapatraOtherThanPensioners[i].registrationNo_showError = false;
    this.valdate_sanchayapatraOtherThanPensioners[i].issueDate_showError = false;
    this.valdate_sanchayapatraOtherThanPensioners[i].costValueOfSanchaypatra_showError = false;
    this.valdate_sanchayapatraOtherThanPensioners[i].grossInterest_showError = false;
    this.valdate_sanchayapatraOtherThanPensioners[i].tds_showError = false;
  }

  validationCheckingSOTP(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.sanchaypatraOtherArray.forEach((element, index) => {
      // console.log('sanchyapatra otp ', element);
      this.initializeSOTPValidationError(index);
      if (element.registrationNo == null || element.registrationNo == '') {
        this.valdate_sanchayapatraOtherThanPensioners[index].registrationNo_showError = true;
        validationSuccess = false;
      }
      if (element.issueDate == null || element.issueDate == '') {
        this.valdate_sanchayapatraOtherThanPensioners[index].issueDate_showError = true;
        validationSuccess = false;
      }
      if (element.costValueOfSanchaypatra == null || element.costValueOfSanchaypatra == '' || element.costValueOfSanchaypatra == 0) {
        this.valdate_sanchayapatraOtherThanPensioners[index].costValueOfSanchaypatra_showError = true;
        validationSuccess = false;
      }
      if (element.grossInterest == null || element.grossInterest == '') {
        this.valdate_sanchayapatraOtherThanPensioners[index].grossInterest_showError = true;
        validationSuccess = false;
      }
      if (element.sourceTaxDeducted == null || element.sourceTaxDeducted == '') {
        this.valdate_sanchayapatraOtherThanPensioners[index].tds_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }
  //sanchyapatra other than pansioners validation end

  //sanchyapatra pansioners validation start
  initializeSanchayapatraPansionersValidation() {
    this.validate_sanchayapatraPensioners = [];
    this.sanchaypatraPensionersArray.forEach(element => {
      let data = {
        "registrationNo_showError": false,
        "issueDate_showError": false,
        "costValueOfSanchaypatra_showError": false,
        "grossInterest_showError": false,
        "tds_showError": false
      }
      this.validate_sanchayapatraPensioners.push(data);
    });
  }

  initializeSPValidationError(i) {
    this.validate_sanchayapatraPensioners[i].registrationNo_showError = false;
    this.validate_sanchayapatraPensioners[i].issueDate_showError = false;
    this.validate_sanchayapatraPensioners[i].costValueOfSanchaypatra_showError = false;
    this.validate_sanchayapatraPensioners[i].grossInterest_showError = false;
    this.validate_sanchayapatraPensioners[i].tds_showError = false;
  }

  validationCheckingSP(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.sanchaypatraPensionersArray.forEach((element, index) => {
      this.initializeSPValidationError(index);
      if (element.registrationNo == null || element.registrationNo == '') {
        this.validate_sanchayapatraPensioners[index].registrationNo_showError = true;
        validationSuccess = false;
      }
      if (element.issueDate == null || element.issueDate == '') {
        this.validate_sanchayapatraPensioners[index].issueDate_showError = true;
        validationSuccess = false;
      }
      if (element.costValueOfSanchaypatra == null || element.costValueOfSanchaypatra == '' || element.costValueOfSanchaypatra == 0) {
        this.validate_sanchayapatraPensioners[index].costValueOfSanchaypatra_showError = true;
        validationSuccess = false;
      }
      if (element.grossInterest == null || element.grossInterest == '') {
        this.validate_sanchayapatraPensioners[index].grossInterest_showError = true;
        validationSuccess = false;
      }
      if (element.sourceTaxDeducted == null || element.sourceTaxDeducted == '') {
        this.validate_sanchayapatraPensioners[index].tds_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }
  //sanchyapatra pansioners validation END

  //bonds and other securities validation start
  initializeBondsAndOtherValidation() {
    this.validate_bondsOtherSecurities = [];
    this.bondsandSecuritiesArray.forEach(element => {
      let data = {
        "nameofBond_showError": false,
        "issueNo_showError": false,
        "issueDate_showError": false,
        "value_showError": false,
        "dateOfMaturity_showError": false,
        "grossInterest_showError": false
      }
      this.validate_bondsOtherSecurities.push(data);
    });
  }

  initializeBondsOtherValidationError(i) {
    this.validate_bondsOtherSecurities[i].nameofBond_showError = false;
    this.validate_bondsOtherSecurities[i].issueNo_showError = false;
    this.validate_bondsOtherSecurities[i].issueDate_showError = false;
    this.validate_bondsOtherSecurities[i].value_showError = false;
    this.validate_bondsOtherSecurities[i].dateOfMaturity_showError = false;
    this.validate_bondsOtherSecurities[i].grossInterest_showError = false;
  }

  validationCheckingBondsOther(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.bondsandSecuritiesArray.forEach((element, index) => {
      this.initializeBondsOtherValidationError(index);
      if (element.nameofBond == null || element.nameofBond == '') {
        this.validate_bondsOtherSecurities[index].nameofBond_showError = true;
        validationSuccess = false;
      }
      if (element.issueNo == null || element.issueNo == '') {
        this.validate_bondsOtherSecurities[index].issueNo_showError = true;
        validationSuccess = false;
      }
      if (element.issueDate == null || element.issueDate == '') {
        this.validate_bondsOtherSecurities[index].issueDate_showError = true;
        validationSuccess = false;
      }
      if (element.value == null || element.value == '' || element.value == 0) {
        this.validate_bondsOtherSecurities[index].value_showError = true;
        validationSuccess = false;
      }
      if (element.dateOfMaturity == null || element.dateOfMaturity == '') {
        this.validate_bondsOtherSecurities[index].dateOfMaturity_showError = true;
        validationSuccess = false;
      }
      if (element.grossInterest == null || element.grossInterest == '') {
        this.validate_bondsOtherSecurities[index].grossInterest_showError = true;
        validationSuccess = false;
      }

    })

    if (validationSuccess)
      return true;
    else
      return false;
  }
  //sanchyapatra pansioners END

  //  validateIOSType() 
  //  {
  //   let successValidation: boolean = true;
  //   this.formArray.controls.forEach((element, index) => {
  //      this.initializeErrorIndexes(index);
  //      if (element.value.interestOnSecuritiesType === 0) {
  //       this.IOS_Type_showError[index] = true;
  //       successValidation = false;
  //     }
  //   })
  //  }

  validateSRO(): boolean {
    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      //  if (element.value.interestOnSecuritiesType === 0) {
      //   this.IOS_Type_showError[index] = true;
      //   successValidation = false;
      // }
      if (element.value.interestOnSecuritiesType === 'income_exempted_reduced_by_sro') {
        if (element.value.nameofBond == null || element.value.nameofBond == '') {
          this.sro_nameOfBond_showError[index] = true;
          successValidation = false;
        }
        if (element.value.issueDate == null || element.value.issueDate == '') {
          this.sro_issueDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.issuingOffice == null || element.value.issuingOffice == '') {
          this.sro_issuingOffice_showError[index] = true;
          successValidation = false;
        }
        if (element.value.dateOfMaturity == null || element.value.dateOfMaturity == '') {
          this.sro_dateOfMatirity_showError[index] = true;
          successValidation = false;
        }
        if (element.value.grossInterest == null || element.value.grossInterest == '') {
          this.sro_grossInterest_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sroNo == null || element.value.sroNo == '') {
          this.sro_sroRef_showError[index] = true;
          successValidation = false;
        }
        if (element.value.year == null || element.value.year == '') {
          this.sro_year_showError[index] = true;
          successValidation = false;
        }
        if (element.value.particular == null || element.value.particular == '') {
          this.sro_particular_showError[index] = true;
          successValidation = false;
        }
        if (element.value.taxApplicable == null || element.value.taxApplicable == '') {
          this.sro_taxApplicable_showError[index] = true;
          successValidation = false;
        }
      }
    })
    if (successValidation)
      return true;
    else
      return false;
  }

  getSroErrorIndex(): any {
    let foundSROFirstErrorIndex: boolean = false; let errorIndex: any;
    this.formArray.controls.forEach((element, index) => {

      if (element.value.interestOnSecuritiesType === 'income_exempted_reduced_by_sro' && !foundSROFirstErrorIndex
        && (this.sro_nameOfBond_showError[index] || this.sro_issueDate_showError[index] || this.sro_issuingOffice_showError[index] || this.sro_dateOfMatirity_showError[index] || this.sro_grossInterest_showError[index]
          || this.sro_sroRef_showError[index] || this.sro_year_showError[index] || this.sro_particular_showError[index] || this.sro_taxApplicable_showError[index])
      ) {
        foundSROFirstErrorIndex = true;
        errorIndex = index;
      }
    })

    return errorIndex;
  }

  getSanchyapatraOTPErrorIndex() {
    //#region  Sanchayapatra other than pensioners field validation
    this.sanchaypatraOtherArray.forEach((element, i) => {
      if (element.registrationNo === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_OTP") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.issueDate === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_OTP") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.costValueOfSanchaypatra === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_OTP") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.grossInterest === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_OTP") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.sourceTaxDeducted === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_OTP") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
    });
  }
  getSanchyapatraPansionerErrorIndex() {
    this.sanchaypatraPensionersArray.forEach((element, i) => {
      if (element.registrationNo === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_pensioners") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.issueDate === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_pensioners") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.costValueOfSanchaypatra === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_pensioners") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.grossInterest === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_pensioners") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.sourceTaxDeducted === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "sanchayapatra_pensioners") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
    });
  }

  getBondsOtherErrorIndex() {
    this.bondsandSecuritiesArray.forEach((element, i) => {
      if (element.nameofBond === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "bonds_and_other_securities") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.issueDate === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "bonds_and_other_securities") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.value === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "bonds_and_other_securities") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.dateOfMaturity === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "bonds_and_other_securities") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
      else if (element.grossInterest === "") {
        this.formArray.controls.forEach((element, index) => {
          if (element.value.interestOnSecuritiesType === "bonds_and_other_securities") {
            this.isVisibleForm = index;
          }
        });
        return;
      }
    });
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
    //        console.log(error['error'].errorMessage);
          });
    });
  }

}
