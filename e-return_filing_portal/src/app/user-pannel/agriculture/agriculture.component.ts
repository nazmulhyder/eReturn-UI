import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable, of } from "rxjs";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { HeadsOfIncomeService } from "../heads-of-income.service";
import * as moment from 'moment';
import { CommaSeparatorService } from "../../service/comma-separator.service";
import { AgricultureValidationService } from "../../service/agriculture-validation.service";

@Component({
  selector: "app-agriculture",
  templateUrl: "./agriculture.component.html",
  styleUrls: ["./agriculture.component.css"],
})
export class AgricultureComponent implements OnInit {
  html: any = `<span class="btn-block well-sm ">No Tooltip Found!</span>`;
  agri_type: any = `<span class="btn-block well-sm ";">Select the source from which your income was earned, from the dropdown list.</span>`;
  totalCulArea: any;
  particularOfProduces: any;
  salesProceed: any;
  costOfProduction: any;
  otherAlwableDeduction: any;
  netIncome: any;

  //tea and rubber :: tooltip
  agri_income: any; business_income: any; cashInHand: any; inventories: any; fixedAsset: any; otherAsset: any;
  totalAsset: any; openingCapital: any; netProfit: any; withdrawalsIncome: any; closingCapital: any; liabilities: any; totalCpAndLiabilities: any;
  //income from adhi barga
  totalReceipt: any;
  leasingPersonName: any;
  farmersID: any;
  taxExemptedIncome: any;
  //sro
  sroNo: any; sroYear: any; sroParticular: any; taxableIncome: any; taxApplicable: any;

  selectedNavbar = [];
  mainNavActive = {};

  checkIsLoggedIn: any;
  group: FormGroup;
  item: any;
  popup: boolean = false;
  navActive = {};
  formArray: FormArray;
  modalRef: BsModalRef;
  incomeType: Observable<boolean>;
  salaryFormGrp: FormGroup;
  showOtherCalc: Observable<boolean>;
  isVisibleIncomeTab: boolean = true;
  organizationTitle: string = "";
  isDisableAddSalBtn: boolean = true;
  isCultivation = [];
  isProductionOfTreeOrRubber = [];
  isProductionOfCorn = [];
  isOtherAgriculturalIncome = [];
  isIncomefromBorga = [];
  isIncomeExempted = [];
  agricultureTypeName = [];
  isSaveDraft: boolean = false;
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

  requestGetData: any;
  isVisibleForm: any;
  headsOfIncome = [];
  lengthOfheads: any;

  minDate: any;
  maxDate: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  getResponseData: any;
  formGroup: FormGroup;
  additionalInformationForm: FormGroup;
  IS_TEA_RUBBER_PRESENT_IN_BUSINESS: boolean = false;
  minusCount = 0;
  agricultureValidationResponse: any;

  // validation arrays 
  agriType_showError = [];
  totalCulArea_showError = [];
  particularOfProduces_showError = [];
  salesProceed_showError = [];
  costOfProduction_showError = [];
  cashInHand_showError = [];
  inventories_showError = [];
  fixedAsset_showError = [];
  otherAsset_showError = [];
  openingCapital_showError = [];
  withdrawals_showError = [];
  liabilities_showError = [];

  totalReceipt_showError = [];
  leasingPersonName_showError = [];
  nidOrTin_showError = [];
  sroNo_showError = [];
  year_showError = [];
  particular_showError = [];
  taxApplicable_showError = [];
  isShow: boolean = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private headService: HeadsOfIncomeService,
    private modalService: BsModalService,
    private mainNavbarList: mainNavbarListService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private eReturnSpinner: NgxUiLoaderService,
    private commaSeparator: CommaSeparatorService,
  ) {
    this.formArray = new FormArray([]);
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  mainNavActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.mainNavActive = x;
  }

  insertFormGroupToArray() {
    this.group = new FormGroup({
      SERIAL_NO: new FormControl(0),
      agricultureType: new FormControl(0),
      agricultureTypeName: new FormControl(""),
      isMaintainedBookOfAC: new FormControl('0'),
      totalCultivationArea: new FormControl(),
      unitOfTotalCulArea: new FormControl('Decimal'),
      particularOfProduces: new FormControl(),
      salesProceed: new FormControl(),
      totalRecipt: new FormControl(),
      costOfProduction: new FormControl(),
      otherAllowableDeduction: new FormControl(),
      netIncome: new FormControl(),
      sroNoReference: new FormControl(),
      year: new FormControl(),
      particular: new FormControl(""),
      taxExemptedIncome: new FormControl(),
      taxApplicable: new FormControl(),

      sales: new FormControl(),
      costOfProduction2: new FormControl(),
      otherAllowableDeduction2: new FormControl(),
      netIncome2: new FormControl(),
      agriculturalIncome: new FormControl(),
      incomeFromBusinessOrProfession: new FormControl(),
      cashInHandandAtBank: new FormControl(),
      inventories: new FormControl(),
      fixedAssets: new FormControl(),
      otherAssets: new FormControl(),
      totalAssets: new FormControl(),
      openingCapital: new FormControl(),
      netProfit: new FormControl(),
      withdrawalIncomeYear: new FormControl(),
      closingCapital: new FormControl(),
      liabilities: new FormControl(),
      totalCapitalandLiabilities: new FormControl(),
      nameOfLeasingPerson: new FormControl(),
      chkTinOrNid: new FormControl('0'),
      nidOrTIN: new FormControl(),
      farmersID: new FormControl(),
      taxableIncome: new FormControl()
    });

    this.formArray.push(this.group);
    this.selectedAgriculture(this.formArray.length - 1);
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.navActiveSelect("4");
    this.insertFormGroupToArray();
    this.incomeType = of(true);
    this.getHeadsOfIncome();
    this.isDisableAddSalBtn = true;
    this.getMainNavbar();
    this.mainNavActiveSelect("2");

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion

    this.minDate = new Date(1972, 0, 1);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

    this.eReturnSpinner.start();
    this.getAgriculturalData();
    this.checkSubmissionStatus();
    this.eReturnSpinner.stop();
  }

  getAgriculturalData() {
    //get api
    this.formArray.clear();
    let reqObj =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    }
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-agriculture-data')
      .subscribe(result => {
    //    console.log(result);
        this.IS_TEA_RUBBER_PRESENT_IN_BUSINESS = result.TEA_RUBBER_PRESENT_IN_BUSINESS;
        this.getResponseData = result.Data;
        if (this.getResponseData.length > 0) {
          this.isDisableAddSalBtn = false
          this.isVisibleIncomeTab = false;
          this.getResponseData.forEach((element, index) => {
            this.loadAgricultureToolTips(element.IA_AGRICULTURE_TYPE);
            this.agricultureTypeName.push(this.getAgricultureTypeName(element.IA_AGRICULTURE_TYPE));
            this.group = new FormGroup({
              SERIAL_NO: new FormControl(element.SERIAL_NO),
              agricultureType: new FormControl(element.IA_AGRICULTURE_TYPE),
              agricultureTypeName: new FormControl(this.getAgricultureTypeName(element.IA_AGRICULTURE_TYPE)),
              totalCultivationArea: new FormControl(element.IA_TOTAL_CULTIVATION_AREA),
              particularOfProduces: new FormControl(element.IA_PARTICULAR_OF_PRODUCES),
              salesProceed: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_SALES_PROCEED)),
              totalRecipt: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_TOTAL_RECEIPT)),
              costOfProduction: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_COST_OF_PRODUCTION_L)),
              otherAllowableDeduction: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_OTHER_ALWBLE_DEDUCTION_L)),
              netIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_NET_INCOME_L)),
              sroNoReference: new FormControl(element.IA_SRO_NO),
              year: new FormControl(element.IA_YEAR),
              particular: new FormControl(element.IA_PARTICULAR),
              taxExemptedIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_TAX_EXEMPTED_INCOME)),
              taxApplicable: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_TAX_APPLICABLE)),

              sales: new FormControl(element.IA_SALES),
              costOfProduction2: new FormControl(element.IA_COST_OF_PRODUCTION_R),
              otherAllowableDeduction2: new FormControl(element.IA_OTHER_ALWBLE_DEDUCTION_R),
              netIncome2: new FormControl(element.IA_NET_INCOME_R),
              agriculturalIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_AGRICULTURAL_INCOME)),
              incomeFromBusinessOrProfession: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_INCOME_FRM_BUSINESS_PROFESSION)),
              cashInHandandAtBank: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_CASH_IN_HAND_AND_BANK)),
              inventories: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_INVENTORIES)),
              fixedAssets: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_FIXED_ASSETS)),
              otherAssets: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_OTHER_ASSETS)),
              totalAssets: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_TOTAL_ASSETS)),
              openingCapital: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_OPENING_CAPITAL)),
              netProfit: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_NET_PROFIT)),
              withdrawalIncomeYear: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_WITHDRAWAL_IN_INCOME_YR)),
              closingCapital: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_CLOSING_CAPITAL)),
              liabilities: new FormControl(element.IA_LIABILITIES),
              totalCapitalandLiabilities: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_TOTAL_CAPITAL_AND_LIABILITIES)),
              nameOfLeasingPerson: new FormControl(element.IA_NAME_OF_LEASING_PERSON),
              chkTinOrNid: new FormControl(element.IA_CHK_TIN_NID === 'F' ? '0' : '1'),
              nidOrTIN: new FormControl(element.IA_TIN_OR_NID),
              farmersID: new FormControl(element.IA_FARMER_ID),
              taxableIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IA_TAXABLE_INCOME)),
              isMaintainedBookOfAC: new FormControl(element.IA_MAINTAIN_BOOKS_OF_ACT === "true" ? '1' : '0'),
              unitOfTotalCulArea: new FormControl(element.IA_UNIT_OF_CUL_AREA),
            });

            this.formArray.push(this.group);
     //       console.log('test', this.formArray.controls);
            this.selectedAgriculture(this.formArray.length - 1);
          });
        }
        else {
          this.insertFormGroupToArray();
        }
      })
  }

  loadAgricultureToolTips(agricultureType: any) {
    if (agricultureType === 'cultivation') {
      this.getCultivation_Tooltips();
    }
    else if (agricultureType === 'prod_of_tea_rubber') {
      this.getTea_Rubber_Tooltips();
    }
    else if (agricultureType === 'prod_of_corn_sugar_beet') {
      this.getCornSugarBeet_Tooltips();
    }
    else if (agricultureType === 'other_agricultural_income') {
      this.getOtherAgriIncome_Tooltips();
    }
    else if (agricultureType === 'income_form_barga_adhi') {
      this.getIncomeFromAdhiBarga_Tooltips();
    }
    else if (agricultureType === 'income_exp_reduced_by_sro') {
      this.getSRO_Tooltips();
    }
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
    this.requestGetData =
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

        // console.log('total result',getOnlyIncomeHeads);
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
    this.requestGetData =
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
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Agriculture');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
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

  isNID(event: any, i) {
    if (event.target.checked) {
      this.formArray.controls[i].patchValue({
        chkTinOrNid: '1'
      })
    }
  }

  isTIN(event: any, i) {
    if (event.target.checked) {
      this.formArray.controls[i].patchValue({
        chkTinOrNid: '0'
      })
    }
  }

  getCultivation_Tooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">The name and brief description (if applicable) of agricultural products.</span>`;
    this.salesProceed = `<span class="btn-block well-sm ";">The amount received by you from selling agricultural produces.</span>`;
    this.costOfProduction = `<span class="btn-block well-sm ";">Amount spent for earning agricultural income. If you do not maintain books of accounts for agriculture on your land, allowable cost of production shall not exceed  60 percent of sale proceeds.</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">Expenses, other than Cost of Production, that you incurred and are allowable under Income Tax Ordinance, 1984.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount computed by deducting Cost of Production and Other Allowable Deductions from Sale Proceed.</span>`;
  }

  getTea_Rubber_Tooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">The name and brief description (if applicable) of agricultural products (tea or rubber).</span>`;
    this.salesProceed = `<span class="btn-block well-sm ";">The amount received by you from selling agricultural produces.</span>`;
    this.costOfProduction = `<span class="btn-block well-sm ";">Amount spent for earning agricultural income.</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">Other allowable expenses incurred in addition to Cost of Production.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount computed by deducting Cost of Production and Other Allowable Deductions from Sale Proceed.</span>`;
    this.agri_income = `<span class="btn-block well-sm ";">Portion (amount) of income that is classified as Agricultural Income.</span>`;
    this.business_income = `<span class="btn-block well-sm ";">Portion (amount) of income that is classified as Income from Business or Profession.</span>`;
    this.cashInHand = `<span class="btn-block well-sm ";">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories = `<span class="btn-block well-sm ";">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAsset = `<span class="btn-block well-sm ";">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAsset = `<span class="btn-block well-sm ";">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAsset = `<span class="btn-block well-sm ";">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital = `<span class="btn-block well-sm ";">The amount of capital at the beginning of income year.</span>`;
    this.netProfit = `<span class="btn-block well-sm ";">Net profit amount as shown in the income statement.</span>`;
    this.withdrawalsIncome = `<span class="btn-block well-sm ";">The amount taken out by you from your business or profession.</span>`;
    this.closingCapital = `<span class="btn-block well-sm ";">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;
    this.liabilities = `<span class="btn-block well-sm ";">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your business or profession.</span>`;
    this.totalCpAndLiabilities = `<span class="btn-block well-sm ";">The sum of capital and liabilities. Please note that total capital & liabilities of your business or professionmust equal its total assets.</span>`;
  }

  getCornSugarBeet_Tooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">The name and brief description (if applicable) of agricultural products (Production of Corn or Sugar-beet).</span>`;
    this.salesProceed = `<span class="btn-block well-sm ";">The amount received by you from selling agricultural produces.</span>`;
    this.costOfProduction = `<span class="btn-block well-sm ";">Amount spent for earning agricultural income.</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">Other allowable expenses incurred in addition to Cost of Production.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount computed by deducting Cost of Production and Other Allowable Deductions from Sale Proceed.</span>`;
    this.taxExemptedIncome = `<span class="btn-block well-sm ";">The amount of income that is exempted from tax.</span>`;
  }

  getOtherAgriIncome_Tooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">Name/description of agricultural products</span>`;
    this.salesProceed = `<span class="btn-block well-sm ";">The amount received by you from selling agricultural produces.</span>`;
    this.costOfProduction = `<span class="btn-block well-sm ";">Amount spent for earning agricultural income.</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">Other allowable expenses incurred in addition to Cost of Production.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount computed by deducting Cost of Production and Other Allowable Deductions from Sale Proceed.</span>`;
  }

  getIncomeFromAdhiBarga_Tooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">Name/description of agricultural products</span>`;
    this.totalReceipt = `<span class="btn-block well-sm ";">The amount received by you from granting any other person the right to cultivate your land.</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">The amount of related expenses incurred and allowable under Income Tax Ordinance, 1984.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount computed by deducting Allowable Deductions from Total Receipt.</span>`;
    this.leasingPersonName = `<span class="btn-block well-sm ";">The name of the lessor (if the lessor is an authority, the name of that authority).</span>`;
    this.farmersID = `<span class="btn-block well-sm ";">ID number (if any) given by relevant authority.</span>`;
  }

  getSRO_Tooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">Name/description of agricultural products</span>`;
    this.salesProceed = `<span class="btn-block well-sm ";">The amount received by you from selling agricultural produces.</span>`;
    this.costOfProduction = `<span class="btn-block well-sm ";">Amount spent for earning agricultural income.</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">Other allowable expenses incurred in addition to Cost of Production.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount computed by deducting Cost of Production and Other Allowable Deductions from Sale Proceed.</span>`;
    this.sroNo = `<span class="btn-block well-sm ";">The number of SRO (or the name & section, rule, etc. of related laws) under which your income under this head enjoys special tax treatment.</span>`;
    this.sroYear = `<span class="btn-block well-sm ";">In case of SRO, the year which the SRO is issued.</span>`;
    this.sroParticular = `<span class="btn-block well-sm ";">Any necessary description.</span>`;
    this.taxExemptedIncome = `<span class="btn-block well-sm ";">The amount of income that is exempted from tax.</span>`;
    this.taxableIncome = `<span class="btn-block well-sm ";">The amount of income that is taxable.</span>`;
    this.taxApplicable = `<span class="btn-block well-sm ";">Amount of tax calculated on Taxable Income.</span>`;
  }



  addComma(i) {
    this.formArray.controls.forEach((element, index) => {
      let salesProceed = this.commaSeparator.removeComma(element.value.salesProceed, 0);
  //    console.log(new Intl.NumberFormat('en-IN').format(parseInt(salesProceed)));
      if (index == i) {
        this.formArray.controls[i].patchValue({
          salesProceed: this.commaSeparator.currencySeparatorBD(salesProceed)
        });
      }
    })
  }

  initializeNameOfLeasingPerson(event, i) {
    this.leasingPersonName_showError[i] = false;
  }

  initializeSRORef(event, i) {
    this.sroNo_showError[i] = false;
  }

  initializeParticular(event, i) {
    this.particular_showError[i] = false;
  }

  initializeYear(i) {
    this.year_showError[i] = false;
  }

  initializeTaxApplicable(event, i) {
    this.taxApplicable_showError[i] = false;
  }

  initializeTotalArea(event, i) {
    if (parseFloat(event.target.value) <= 0) {
      this.totalCulArea_showError[i] = true;
      // this.toastr.warning('Total Area will be More than 0!');
      this.formArray.controls[i].patchValue({
        totalCultivationArea: ''
      });
      return;
    }
    else {
      this.totalCulArea_showError[i] = false;
    }
  }

  validateParticularOfProduces(event, i) {
    if (event.target.value == null || event.target.value == '') {
      this.particularOfProduces_showError[i] = true;
    }
    else {
      this.particularOfProduces_showError[i] = false;
    }
  }

  isMaintainedBookOfACFalse(agriType: any, i) {
    if (agriType === 'prod_of_tea_rubber') {
      this.resetForm_Tea_rubber(i);
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  acceptAreasFloatingPoints(event: any, i) {
    let str = event.target.value;
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(str).toLowerCase());
    if (!result) {
      this.formArray.controls[i].patchValue({
        totalCultivationArea: str.substring(0, str.length - 1)
      })
    }
    else {
    }
  }

  // customSalesProceedValidation(event,j): boolean {
  //   debugger;
  //   let str = event.target.value;

  //   if(this.minusCount>1){
  //     this.formArray.controls[j].patchValue({
  //       salesProceed: 0,
  //     });
  //     this.minusCount = 0;
  //     return false;
  //   }

  //   for (var i = 0; i < str.length-1; i++) {
  //     const charCode = str[i].charCodeAt(0);
  //     if (charCode == 45) {
  //       this.minusCount++;
  //     }

  //     if (charCode > 31 && (charCode < 48 && charCode != 45 || charCode > 57)) {
  //       return false;
  //     }

  //     return true;
  //   }

  // }

  agricultureTypeChange(event, i) {
    this.clearExistingFormData(i);
    this.initializeErrorIndexes(i);
    this.loadAgricultureToolTips(event.target.value);
    if (event.target.value === "cultivation") {
      this.incomeType = of(true);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isCultivation[i] = true;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isProductionOfCorn[i] = false;
      this.isOtherAgriculturalIncome[i] = false;
      this.isIncomefromBorga[i] = false;
      this.isIncomeExempted[i] = false;
      this.agricultureTypeName[i] = this.getAgricultureTypeName('cultivation');

    } else if (event.target.value === "prod_of_tea_rubber") {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isCultivation[i] = false;
      this.isProductionOfTreeOrRubber[i] = true;
      this.isProductionOfCorn[i] = false;
      this.isOtherAgriculturalIncome[i] = false;
      this.isIncomefromBorga[i] = false;
      this.isIncomeExempted[i] = false;
      this.agricultureTypeName[i] = this.getAgricultureTypeName('prod_of_tea_rubber');

    } else if (event.target.value === "prod_of_corn_sugar_beet") {

      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isCultivation[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isProductionOfCorn[i] = true;
      this.isOtherAgriculturalIncome[i] = false;
      this.isIncomefromBorga[i] = false;
      this.isIncomeExempted[i] = false;
      this.agricultureTypeName[i] = this.getAgricultureTypeName('prod_of_corn_sugar_beet');

    }
    else if (event.target.value === "other_agricultural_income") {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isCultivation[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isProductionOfCorn[i] = false;
      this.isOtherAgriculturalIncome[i] = true;
      this.isIncomefromBorga[i] = false;
      this.isIncomeExempted[i] = false;
      this.agricultureTypeName[i] = this.getAgricultureTypeName('other_agricultural_income');
    } else if (event.target.value === "income_form_barga_adhi") {

      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isCultivation[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isProductionOfCorn[i] = false;
      this.isOtherAgriculturalIncome[i] = false;
      this.isIncomefromBorga[i] = true;
      this.isIncomeExempted[i] = false;
      this.agricultureTypeName[i] = this.getAgricultureTypeName('income_form_barga_adhi');
    } else if (event.target.value === "income_exp_reduced_by_sro") {

      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isCultivation[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isProductionOfCorn[i] = false;
      this.isOtherAgriculturalIncome[i] = false;
      this.isIncomefromBorga[i] = false;
      this.isIncomeExempted[i] = true;
      this.agricultureTypeName[i] = this.getAgricultureTypeName('income_exp_reduced_by_sro');
    }

    this.formArray.controls[this.formArray.length - 1].patchValue({
      agricultureTypeName: this.agricultureTypeName[i],
    });
  }

  clearExistingFormData(i) {
    // debugger;
 //   console.log(this.formArray.controls[i].value.SERIAL_NO);
    //reset forms
    this.formArray.controls[i].patchValue({
      SERIAL_NO: this.formArray.controls[i].value.SERIAL_NO ? this.formArray.controls[i].value.SERIAL_NO : 0,
      // agricultureType: 0,
      // agricultureTypeName: '',
      totalCultivationArea: '',
      particularOfProduces: '',
      salesProceed: '',
      totalRecipt: '',
      costOfProduction: '',
      otherAllowableDeduction: '',
      netIncome: '',
      sroNoReference: '',
      year: '',
      particular: '',
      taxExemptedIncome: '',
      taxApplicable: '',

      sales: '',
      costOfProduction2: '',
      otherAllowableDeduction2: '',
      netIncome2: '',
      agriculturalIncome: '',
      incomeFromBusinessOrProfession: '',
      cashInHandandAtBank: '',
      inventories: '',
      fixedAssets: '',
      otherAssets: '',
      totalAssets: '',
      openingCapital: '',
      netProfit: '',
      withdrawalIncomeYear: '',
      closingCapital: '',
      liabilities: '',
      totalCapitalandLiabilities: '',
      nameOfLeasingPerson: '',
      chkTinOrNid: '0',
      nidOrTIN: '',
      farmersID: '',
      unitOfTotalCulArea: 'Decimal',
    });
  }

  salaryTypeChange(evt: any) {
    const target = evt.target;
    if (target.checked && evt.target.value === "1") {
      this.showOtherCalc = of(true);
    } else {
      this.showOtherCalc = of(false);
    }
  }

  selectedAgriculture(i: number) {
    this.isVisibleForm = i;
    this.loadAgricultureToolTips(this.formArray.controls[i].value.agricultureType);
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
    this.lengthOfheads = this.headsOfIncome.length;
  }

  close(i) {


    let requestGetData: any;
    requestGetData =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };

    this.formArray.controls.forEach((element, index) => {
      if (i == index && element.value.SERIAL_NO > 0) {
        this.apiService.post(this.serviceUrl + 'api/user-panel/agriculture-deleteItem?serialNo=' + element.value.SERIAL_NO,"")
          .subscribe(result => {
            if (result.success) {
              this.toastr.success(result.replyMessage, '', {
                timeOut: 1000,
              });
              this.afterTabClose(i);
            }
            else {
              this.toastr.warning('Failed to Delete!', '', {
                timeOut: 1000,
              });
              return;
            }
          })
      }
      else if (i == index && element.value.SERIAL_NO == 0) {
        this.afterTabClose(i);
      }
    });
    //end
  }

  afterTabClose(i) {
    this.formArray.removeAt(i);
    this.agricultureTypeName.splice(i, 1);
    this.closeErrorIndexes(i);
    if (this.formArray.length >= 1) {
      this.isVisibleForm = this.formArray.controls.length - 1;
      this.modalRef.hide();
    } else if (this.formArray.length < 1) {
      this.isVisibleForm = 0;
      this.insertFormGroupToArray();
      this.isVisibleIncomeTab = true;
      this.modalRef.hide();
    } else {
    }
  }

  initializeErrorIndexes(i) {
    this.agriType_showError[i] = false;
    this.totalCulArea_showError[i] = false;
    this.particularOfProduces_showError[i] = false;
    this.salesProceed_showError[i] = false;
    this.costOfProduction_showError[i] = false;
    this.cashInHand_showError[i] = false;
    this.inventories_showError[i] = false;
    this.fixedAsset_showError[i] = false;
    this.otherAsset_showError[i] = false;
    this.openingCapital_showError[i] = false;
    this.withdrawals_showError[i] = false;
    this.liabilities_showError[i] = false;
    this.totalReceipt_showError[i] = false;
    this.leasingPersonName_showError[i] = false;
    this.nidOrTin_showError[i] = false;
    this.sroNo_showError[i] = false;
    this.year_showError[i] = false;
    this.particular_showError[i] = false;
    this.taxApplicable_showError[i] = false;
  }

  closeErrorIndexes(i) {
    this.agriType_showError.splice(i, 1);
    this.totalCulArea_showError.splice(i, 1);
    this.particularOfProduces_showError.splice(i, 1);
    this.salesProceed_showError.splice(i, 1);
    this.costOfProduction_showError.splice(i, 1);
    this.cashInHand_showError.splice(i, 1);
    this.inventories_showError.splice(i, 1);
    this.fixedAsset_showError.splice(i, 1);
    this.otherAsset_showError.splice(i, 1);
    this.openingCapital_showError.splice(i, 1);
    this.withdrawals_showError.splice(i, 1);
    this.liabilities_showError.splice(i, 1);
    this.totalReceipt_showError.splice(i, 1);
    this.leasingPersonName_showError.splice(i, 1);
    this.nidOrTin_showError.splice(i, 1);
    this.sroNo_showError.splice(i, 1);
    this.year_showError.splice(i, 1);
    this.particular_showError.splice(i, 1);
    this.taxApplicable_showError.splice(i, 1);

  }

  validateCostOfProduction(i, salesProceed: any, costOfProduction: any): boolean {
    if (this.formArray.controls[i].value.isMaintainedBookOfAC === '0' && (costOfProduction > (0.6 * salesProceed)))
      return false;
    else
      return true;
  }
  //#region CALCULATION AREA
  netIncome_Calc_1(i, formControlName) {
    let sales: any; let cost_of_production: any;
    let other_alwable_deduction: any; let calcNetIncome: any;
    if (this.formArray.controls[i].value.salesProceed === '0') {
      this.toastr.warning('Sales Proceed will be more than 0!');
      this.formArray.controls[i].patchValue({
        salesProceed: ''
      });
    }
    if (this.formArray.controls[i].value.salesProceed === '') {
      this.formArray.controls[i].patchValue({
        salesProceed: ''
      });
    }
    else {
      this.formArray.controls.forEach((element, index) => {
        //if => agriculture type == 'cultivation' or tea_rubber, eqn : netIncome_1 = sales - cost_of_prod - other_alwable_ded
        if (index == i && (element.value.agricultureType === 'cultivation' || element.value.agricultureType === 'prod_of_tea_rubber' || element.value.agricultureType === 'other_agricultural_income')) {
          //set value
          if (!this.validateCostOfProduction(i, this.commaSeparator.removeComma(element.value.salesProceed, 0), this.commaSeparator.removeComma(element.value.costOfProduction, 0))) {
            this.toastr.warning('Cost of Production will be less or equal 60% of Sales Proceed!');
            this.formArray.controls[i].patchValue({
              costOfProduction: 0,
            });
          }


          if (formControlName === 'salesProceed') {
            this.salesProceed_showError[i] = false;
            this.formArray.controls[i].patchValue({
              salesProceed: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.salesProceed, 0)),
            });
          }
          if (formControlName === 'costOfProduction') {
            this.costOfProduction_showError[i] = false;
            this.formArray.controls[i].patchValue({
              costOfProduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costOfProduction, 0)),
            });
          }
          if (formControlName === 'otherAllowableDeduction') {
            this.formArray.controls[i].patchValue({
              otherAllowableDeduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0)),
            });
          }

          sales = element.value.salesProceed ? this.commaSeparator.removeComma(element.value.salesProceed, 0) : 0;
          cost_of_production = element.value.costOfProduction ? this.commaSeparator.removeComma(element.value.costOfProduction, 0) : 0;
          other_alwable_deduction = element.value.otherAllowableDeduction ? this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0) : 0;

          calcNetIncome = parseFloat(sales) - parseFloat(cost_of_production) - parseFloat(other_alwable_deduction)
          this.formArray.controls[i].patchValue({
            netIncome: this.commaSeparator.currencySeparatorBD(calcNetIncome),
          });

          // this is only execute for production of tea and rubber!
          if (element.value.agricultureType === 'prod_of_tea_rubber') {

            let net_income: any;
            net_income = element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0;
            this.formArray.controls[i].patchValue({
              agriculturalIncome: parseInt(net_income) ? this.commaSeparator.currencySeparatorBD(parseInt(net_income) * 0.6) : '',
            });

            this.formArray.controls[i].patchValue({
              incomeFromBusinessOrProfession: parseInt(net_income) ? this.commaSeparator.currencySeparatorBD(parseInt(net_income) * 0.4) : '',
            });

            this.formArray.controls[i].patchValue({
              openingCapital: parseInt(element.value.openingCapital) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.openingCapital, 0)) : '',
              netProfit: element.value.netIncome,
              withdrawalIncomeYear: parseInt(element.value.withdrawalIncomeYear) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.withdrawalIncomeYear, 0)) : '',
              liabilities: parseInt(element.value.liabilities) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.liabilities, 0)) : '',
            });

            // calculate right side closing captal
            let opening_capital: any; let net_profit: any;
            let withdrawal_income_yr: any; let tmpClosingCapital: any;
            this.formArray.controls.forEach((element, index) => {
              if (index == i) {
                opening_capital = element.value.openingCapital ? element.value.openingCapital : 0;
                net_profit = element.value.netProfit ? this.commaSeparator.removeComma(element.value.netProfit, 0) : 0;
                withdrawal_income_yr = element.value.withdrawalIncomeYear ? element.value.withdrawalIncomeYear : 0;

                //temp calc closing capital and assign to a veriable
                tmpClosingCapital = (parseInt(opening_capital) + parseInt(net_profit)) - parseInt(withdrawal_income_yr);

                this.formArray.controls[i].patchValue({
                  closingCapital: parseInt(tmpClosingCapital) ? this.commaSeparator.currencySeparatorBD(tmpClosingCapital) : '',
                });
              }
            });

            //calculate right side total capital and liabilties
            let closing_capital: any; let liabilities: any; let tmpTotalCpLiabilities: any;

            this.formArray.controls.forEach((element, index) => {
              if (index == i) {
                closing_capital = element.value.closingCapital ? this.commaSeparator.removeComma(element.value.closingCapital, 0) : 0;
                liabilities = element.value.liabilities ? this.commaSeparator.removeComma(element.value.liabilities, 0) : 0;
                tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

                this.formArray.controls[i].patchValue({
                  totalCapitalandLiabilities: parseInt(tmpTotalCpLiabilities) ? this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities) : '',
                });
              }
            });

          }
        }
      });
    }

  }

  cc_tcl_calc(i, formControlName) {
    // calculate right side closing captal
    let opening_capital: any; let net_profit: any;
    let withdrawal_income_yr: any; let tmpClosingCapital: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (formControlName === 'openingCapital') {
          this.openingCapital_showError[i] = false;
          this.formArray.controls[i].patchValue({
            openingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.openingCapital, 0)),
          });
        }
        if (formControlName === 'withdrawalIncomeYear') {
          this.withdrawals_showError[i] = false;
          this.formArray.controls[i].patchValue({
            withdrawalIncomeYear: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.withdrawalIncomeYear, 0)),
          });
        }
        if (formControlName === 'liabilities') {
          this.liabilities_showError[i] = false;
          this.formArray.controls[i].patchValue({
            liabilities: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.liabilities, 0)),
          });
        }

        opening_capital = element.value.openingCapital ? this.commaSeparator.removeComma(element.value.openingCapital, 0) : 0;
        net_profit = element.value.netProfit ? this.commaSeparator.removeComma(element.value.netProfit, 0) : 0;
        withdrawal_income_yr = element.value.withdrawalIncomeYear ? this.commaSeparator.removeComma(element.value.withdrawalIncomeYear, 0) : 0;

        //temp calc closing capital and assign to a veriable
        tmpClosingCapital = parseFloat(opening_capital) + parseFloat(net_profit) - parseFloat(withdrawal_income_yr);

        this.formArray.controls[i].patchValue({
          closingCapital: this.commaSeparator.currencySeparatorBD(tmpClosingCapital),
        });
      }
    });

    //calculate right side total capital and liabilties
    let closing_capital: any; let liabilities: any; let tmpTotalCpLiabilities: any;

    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        closing_capital = element.value.closingCapital ? this.commaSeparator.removeComma(element.value.closingCapital, 0) : 0;
        liabilities = element.value.liabilities ? this.commaSeparator.removeComma(element.value.liabilities, 0) : 0;
        tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

        this.formArray.controls[i].patchValue({
          totalCapitalandLiabilities: parseInt(tmpTotalCpLiabilities) ? this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities) : '',
        });
      }
    });
  }

  prod_of_tea_rubber_calc(i, formControlName) {
    // eqn : net profit = opening capital
    let cash_in_hand: any; let inventories: any; let fixed_Asset: any; let otherAssets: any; let tmpTotalAssetCalc: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        //set value
        if (formControlName === 'cashInHandandAtBank') {
          this.cashInHand_showError[i] = false;
          this.formArray.controls[i].patchValue({
            cashInHandandAtBank: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.cashInHandandAtBank, 0)),
          });
        }
        if (formControlName === 'inventories') {
          this.inventories_showError[i] = false;
          this.formArray.controls[i].patchValue({
            inventories: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.inventories, 0)),
          });
        }
        if (formControlName === 'fixedAssets') {
          this.fixedAsset_showError[i] = false;
          this.formArray.controls[i].patchValue({
            fixedAssets: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.fixedAssets, 0)),
          });
        }
        if (formControlName === 'otherAssets') {
          this.otherAsset_showError[i] = false;
          this.formArray.controls[i].patchValue({
            otherAssets: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.otherAssets, 0)),
          });
        }

        cash_in_hand = element.value.cashInHandandAtBank ? this.commaSeparator.removeComma(element.value.cashInHandandAtBank, 0) : 0;
        inventories = element.value.inventories ? this.commaSeparator.removeComma(element.value.inventories, 0) : 0;
        fixed_Asset = element.value.fixedAssets ? this.commaSeparator.removeComma(element.value.fixedAssets, 0) : 0;
        otherAssets = element.value.otherAssets ? this.commaSeparator.removeComma(element.value.otherAssets, 0) : 0;
        tmpTotalAssetCalc = parseFloat(cash_in_hand) + parseFloat(inventories) + parseFloat(fixed_Asset) + parseFloat(otherAssets)

        this.formArray.controls[i].patchValue({
          totalAssets: this.commaSeparator.currencySeparatorBD(tmpTotalAssetCalc),
        });
      }
    })
  }

  sugar_beet_net_income_calc(i, formControlName) {
    let sales: any; let cost_of_production: any;
    let other_alwable_deduction: any; let tmpNetInc: any; let tmpTaxExpInc: any;
    if (this.formArray.controls[i].value.salesProceed === '0') {
      this.toastr.warning('Sales Proceed will be more than 0!');
      this.formArray.controls[i].patchValue({
        salesProceed: ''
      });
    }
    else {
      this.formArray.controls.forEach((element, index) => {
        //if => agriculture type == 'cultivation' or tea_rubber, eqn : netIncome_1 = sales - cost_of_prod - other_alwable_ded
        if (index == i) {
          if (!this.validateCostOfProduction(i, this.commaSeparator.removeComma(element.value.salesProceed, 0), this.commaSeparator.removeComma(element.value.costOfProduction, 0))) {
            this.toastr.warning('Cost of Production will be less or equal 60% of Sales Proceed!');
            this.formArray.controls[i].patchValue({
              costOfProduction: 0,
            });
          }

          if (formControlName === 'salesProceed') {
            this.salesProceed_showError[i] = false;
            this.formArray.controls[i].patchValue({
              salesProceed: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.salesProceed, 0)),
            });
          }
          if (formControlName === 'costOfProduction') {
            this.costOfProduction_showError[i] = false;
            this.formArray.controls[i].patchValue({
              costOfProduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costOfProduction, 0)),
            });
          }
          if (formControlName === 'otherAllowableDeduction') {
            this.formArray.controls[i].patchValue({
              otherAllowableDeduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0)),
            });
          }

          sales = element.value.salesProceed ? this.commaSeparator.removeComma(element.value.salesProceed, 0) : 0;
          cost_of_production = element.value.costOfProduction ? this.commaSeparator.removeComma(element.value.costOfProduction, 0) : 0;
          other_alwable_deduction = element.value.otherAllowableDeduction ? this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0) : 0;

          tmpNetInc = (parseFloat(sales) - parseFloat(cost_of_production) - parseFloat(other_alwable_deduction)) / 2;
          tmpTaxExpInc = (parseFloat(sales) - parseFloat(cost_of_production) - parseFloat(other_alwable_deduction)) / 2;

          this.formArray.controls[i].patchValue({
            netIncome: parseInt(tmpNetInc) ? this.commaSeparator.currencySeparatorBD(tmpNetInc) : '',
            taxExemptedIncome: this.commaSeparator.currencySeparatorBD(tmpTaxExpInc),
          });
        }
      });
    }
  }

  income_from_adhi_barga_calc(i, formControlName) {
    let total_receipt: any; let other_alwable_ded: any; let tmpNetIncme: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (formControlName === 'totalRecipt') {
          this.totalReceipt_showError[i] = false;
          this.formArray.controls[i].patchValue({
            totalRecipt: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.totalRecipt, 0)),
          });
        }
        if (formControlName === 'otherAllowableDeduction') {
          this.formArray.controls[i].patchValue({
            otherAllowableDeduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0)),
          });
        }

        total_receipt = element.value.totalRecipt ? this.commaSeparator.removeComma(element.value.totalRecipt, 0) : 0;
        other_alwable_ded = element.value.otherAllowableDeduction ? this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0) : 0;
        tmpNetIncme = parseFloat(total_receipt) - parseFloat(other_alwable_ded);

        this.formArray.controls[i].patchValue({
          netIncome: this.commaSeparator.currencySeparatorBD(tmpNetIncme)
        });

      }
    });
  }

  sro_calc(i, formControlName) {
    let sales: any; let cost_of_production: any;
    let other_alwable_deduction: any; let tmpNetIncome: any;
    let taxExemptedIncome: any; let tmpTaxableIncome: any;
    if (this.formArray.controls[i].value.salesProceed === '0') {
      this.toastr.warning('Sales Proceed will be more than 0!');
      this.formArray.controls[i].patchValue({
        salesProceed: ''
      });
    }
    else {
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          if (!this.validateCostOfProduction(i, this.commaSeparator.removeComma(element.value.salesProceed, 0), this.commaSeparator.removeComma(element.value.costOfProduction, 0))) {
            this.toastr.warning('Cost of Production will be less or equal 60% of Sales Proceed!');
            this.formArray.controls[i].patchValue({
              costOfProduction: 0,
            });
          }

          if (formControlName === 'salesProceed') {
            this.salesProceed_showError[i] = false;
            this.formArray.controls[i].patchValue({
              salesProceed: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.salesProceed, 0)),
            });
          }
          if (formControlName === 'costOfProduction') {
            this.costOfProduction_showError[i] = false;
            this.formArray.controls[i].patchValue({
              costOfProduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costOfProduction, 0)),
            });
          }
          if (formControlName === 'otherAllowableDeduction') {
            this.formArray.controls[i].patchValue({
              otherAllowableDeduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0)),
            });
          }

          sales = element.value.salesProceed ? this.commaSeparator.removeComma(element.value.salesProceed, 0) : 0;
          cost_of_production = element.value.costOfProduction ? this.commaSeparator.removeComma(element.value.costOfProduction, 0) : 0;
          other_alwable_deduction = element.value.otherAllowableDeduction ? this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0) : 0;

          tmpNetIncome = (parseFloat(sales) - parseFloat(cost_of_production) - parseFloat(other_alwable_deduction));
          this.formArray.controls[i].patchValue({
            netIncome: this.commaSeparator.currencySeparatorBD(tmpNetIncome)
          });

        }
      });

      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            taxExemptedIncome: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0)),
          });

          if (parseFloat(element.value.salesProceed) < 0) {
            this.formArray.controls[i].patchValue({
              taxableIncome: 0,
              taxExemptedIncome: 0
            });
          }
          else {
            taxExemptedIncome = element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0;
            tmpTaxableIncome = parseFloat(this.commaSeparator.removeComma(element.value.netIncome, 0)) - parseFloat(taxExemptedIncome);
            this.formArray.controls[i].patchValue({
              taxableIncome: this.commaSeparator.currencySeparatorBD(tmpTaxableIncome),
            });
          }
        }
      });
    }

  }

  makeTaxExemptedIncReadOnly(salesProceed: any): boolean {
    // debugger;
    if (parseInt(salesProceed) < 0)
      return true;
    else
      return false;
  }

  calc_taxable_incm(i) {
    let taxableIncome: any;
    let taxExemptedIncome: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {

        this.formArray.controls[i].patchValue({
          taxExemptedIncome: parseInt(element.value.taxExemptedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0)) : '',
        });

        taxExemptedIncome = element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0;
        taxableIncome = parseFloat(this.commaSeparator.removeComma(element.value.netIncome, 0)) - parseFloat(taxExemptedIncome);

        taxExemptedIncome = element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0;

        if (taxExemptedIncome > parseFloat(this.commaSeparator.removeComma(element.value.netIncome, 0))) {
          this.toastr.warning('Tax Exempted Income cannot more than Sales Proceed!', '', {
            timeOut: 3000,
          });

          this.formArray.controls[i].patchValue({
            taxExemptedIncome: 0
          });

          taxableIncome = parseFloat(this.commaSeparator.removeComma(element.value.netIncome, 0)) - parseFloat(this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0));
          this.formArray.controls[i].patchValue({
            taxableIncome: parseInt(taxableIncome) ? this.commaSeparator.currencySeparatorBD(taxableIncome) : ''
          });
          return;
        }
        else {
          this.formArray.controls[i].patchValue({
            taxableIncome: (taxableIncome <= 0 ? 0 : this.commaSeparator.currencySeparatorBD(taxableIncome)),
          });
        }
      }
    });
  }
  //#endregion

  getAgricultureTypeName(agricultureType: any) {
    if (agricultureType === 'cultivation') return 'Cultivation';
    else if (agricultureType === 'prod_of_tea_rubber') return 'Production of Tea or Rubber';
    else if (agricultureType === 'prod_of_corn_sugar_beet') return 'Production of Corn or Sugar-beet';
    else if (agricultureType === 'other_agricultural_income') return 'Other Agricultural Income (Including Livestock)';
    else if (agricultureType === 'income_form_barga_adhi') return 'Income from Barga/Adhi/Bhag';
    else if (agricultureType === 'income_exp_reduced_by_sro') return 'Income Subject to Reduced Tax Rate';
  }

  resetForm_Tea_rubber(i) {
    this.formArray.controls[i].patchValue({
      cashInHandandAtBank: '',
      inventories: '',
      otherAssets: '',

      fixedAssets: '',
      totalAssets: '',
      openingCapital: '',

      netProfit: '',
      withdrawalIncomeYear: '',
      closingCapital: '',

      liabilities: '',
      totalCapitalandLiabilities: '',
    });
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }

  validateAgri(): any {
    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if (element.value.agricultureType === 0) {
        this.agriType_showError[index] = true;
        successValidation = false;
      }
      if (element.value.agricultureType === 'cultivation' || element.value.agricultureType === 'prod_of_tea_rubber' || element.value.agricultureType === 'prod_of_corn_sugar_beet' || element.value.agricultureType === 'other_agricultural_income'
        || element.value.agricultureType === 'income_form_barga_adhi' || element.value.agricultureType === 'income_exp_reduced_by_sro') {

        if (element.value.totalCultivationArea == '' || element.value.totalCultivationArea == null || element.value.totalCultivationArea == 0) {
          this.totalCulArea_showError[index] = true;
          successValidation = false;
        }
        if (element.value.particularOfProduces == '' || element.value.totalCultivationArea == null) {
          this.particularOfProduces_showError[index] = true;
          successValidation = false;
        }

        if (element.value.agricultureType != 'income_form_barga_adhi' && (element.value.salesProceed == '' || element.value.salesProceed == null || element.value.salesProceed == 0)) {
          this.salesProceed_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType != 'income_form_barga_adhi' && (element.value.costOfProduction == '' || element.value.costOfProduction == null)) {
          this.costOfProduction_showError[index] = true;
          successValidation = false;
        }

        if (element.value.agricultureType === 'income_exp_reduced_by_sro' && (element.value.sroNoReference == '' || element.value.sroNoReference == null)) {
          this.sroNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'income_exp_reduced_by_sro' && (element.value.year == '' || element.value.year == null)) {
          this.year_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'income_exp_reduced_by_sro' && (element.value.particular == '' || element.value.particular == null)) {
          this.particular_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'income_exp_reduced_by_sro' && (element.value.taxApplicable == '' || element.value.taxApplicable == null)) {
          this.taxApplicable_showError[index] = true;
          successValidation = false;
        }

        if (element.value.agricultureType === 'income_form_barga_adhi' && (element.value.totalRecipt == '' || element.value.totalRecipt == null)) {
          this.totalReceipt_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'income_form_barga_adhi' && (element.value.nameOfLeasingPerson == '' || element.value.nameOfLeasingPerson == null)) {
          this.leasingPersonName_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'income_form_barga_adhi' && element.value.chkTinOrNid === '0' && element.value.nidOrTIN != null && element.value.nidOrTIN != '' && element.value.nidOrTIN.length != 12) {
          this.nidOrTin_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'income_form_barga_adhi' && element.value.chkTinOrNid === '1' && element.value.nidOrTIN != null && element.value.nidOrTIN != '' && element.value.nidOrTIN.length != 10 && element.value.nidOrTIN.length != 13 && element.value.nidOrTIN.length != 17) {
          this.nidOrTin_showError[index] = true;
          successValidation = false;
        }

        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.cashInHandandAtBank == '' || element.value.cashInHandandAtBank == null)) {
          this.cashInHand_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.inventories == '' || element.value.inventories == null)) {
          this.inventories_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.fixedAssets == '' || element.value.fixedAssets == null)) {
          this.fixedAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.otherAssets == '' || element.value.otherAssets == null)) {
          this.otherAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.openingCapital == '' || element.value.openingCapital == null)) {
          this.openingCapital_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.withdrawalIncomeYear == '' || element.value.withdrawalIncomeYear == null)) {
          this.withdrawals_showError[index] = true;
          successValidation = false;
        }
        if (element.value.agricultureType === 'prod_of_tea_rubber' && element.value.isMaintainedBookOfAC === '1' && (element.value.liabilities == '' || element.value.liabilities == null)) {
          this.liabilities_showError[index] = true;
          successValidation = false;
        }
      }
    })

    if (!successValidation)
      return { "validate": false, "indexNo": this.funcSelectedFirstIndexError() };
    else
      return { "validate": true, "indexNo": "" };
  }

  funcSelectedFirstIndexError(): any {
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.formArray.controls.forEach((element, index) => {
      if (element.value.agricultureType === 0 && !isFoundErrorIndex && this.agriType_showError[index]) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if ((element.value.agricultureType === 'cultivation' || element.value.agricultureType === 'prod_of_corn_sugar_beet' || element.value.agricultureType === 'other_agricultural_income') && !isFoundErrorIndex && (this.totalCulArea_showError[index] || this.particularOfProduces_showError[index] || this.salesProceed_showError[index] || this.costOfProduction_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.agricultureType === 'prod_of_tea_rubber' && !isFoundErrorIndex && (this.totalCulArea_showError[index] || this.particularOfProduces_showError[index] || this.salesProceed_showError[index]
        || this.costOfProduction_showError[index] || this.inventories_showError[index] || this.fixedAsset_showError[index] || this.otherAsset_showError[index] || this.openingCapital_showError[index]
        || this.withdrawals_showError[index] || this.liabilities_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.agricultureType === 'income_form_barga_adhi' && !isFoundErrorIndex && (this.totalCulArea_showError[index] || this.particularOfProduces_showError[index] || this.totalReceipt_showError[index] || this.leasingPersonName_showError[index] || this.nidOrTin_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.agricultureType === 'income_exp_reduced_by_sro' && !isFoundErrorIndex && (this.totalCulArea_showError[index] || this.particularOfProduces_showError[index] || this.salesProceed_showError[index] || this.costOfProduction_showError[index] || this.sroNo_showError[index] || this.year_showError[index] || this.particular_showError[index] || this.taxApplicable_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

    });
    return errorIndex;
  }

  submittedData() {
    //post api
    let validateAgri: any;
    validateAgri = this.validateAgri();
    if (!validateAgri.validate) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      this.isVisibleForm = validateAgri.indexNo;
      return;
    }

    let requestJson = [];
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach((element, index) => {
        if (element.value.agricultureType === "prod_of_tea_rubber" && element.value.isMaintainedBookOfAC === '0') {
          this.resetForm_Tea_rubber(index);
        }
        let sroYr = element.value.year ? moment(element.value.year, 'YYYY') : '';
        //debugger;
        let obj = {
          //1 - cultivation
          "IA_AGRICULTURE_TYPE": element.value.agricultureType ? element.value.agricultureType : '',
          "IA_TOTAL_CULTIVATION_AREA": element.value.totalCultivationArea ? element.value.totalCultivationArea : '',
          "IA_UNIT_OF_CUL_AREA": element.value.unitOfTotalCulArea ? element.value.unitOfTotalCulArea : '',
          "IA_PARTICULAR_OF_PRODUCES": element.value.particularOfProduces ? element.value.particularOfProduces : '',

          "IA_MAINTAIN_BOOKS_OF_ACT": element.value.isMaintainedBookOfAC === '1' ? true : false,
          "IA_SALES_PROCEED": element.value.salesProceed ? this.commaSeparator.removeComma(element.value.salesProceed, 0) : '',
          "IA_COST_OF_PRODUCTION_L": element.value.costOfProduction ? this.commaSeparator.removeComma(element.value.costOfProduction, 0) : '',
          "IA_OTHER_ALWBLE_DEDUCTION_L": element.value.otherAllowableDeduction ? this.commaSeparator.removeComma(element.value.otherAllowableDeduction, 0) : '',
          "IA_NET_INCOME_L": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : '',

          //2 - rubber
          "IA_SALES": element.value.sales ? element.value.sales : '',
          "IA_COST_OF_PRODUCTION_R": element.value.costOfProduction2 ? element.value.costOfProduction2 : '',
          "IA_OTHER_ALWBLE_DEDUCTION_R": element.value.otherAllowableDeduction2 ? element.value.otherAllowableDeduction2 : '',
          "IA_NET_INCOME_R": element.value.netIncome2 ? element.value.netIncome2 : '',
          "IA_AGRICULTURAL_INCOME": element.value.agriculturalIncome ? this.commaSeparator.removeComma(element.value.agriculturalIncome, 0) : '',
          "IA_INCOME_FRM_BUSINESS_PROFESSION": element.value.incomeFromBusinessOrProfession ? this.commaSeparator.removeComma(element.value.incomeFromBusinessOrProfession, 0) : '',
          "IA_CASH_IN_HAND_AND_BANK": element.value.cashInHandandAtBank ? this.commaSeparator.removeComma(element.value.cashInHandandAtBank, 0) : '',
          "IA_INVENTORIES": element.value.inventories ? this.commaSeparator.removeComma(element.value.inventories, 0) : '',
          "IA_OTHER_ASSETS": element.value.otherAssets ? this.commaSeparator.removeComma(element.value.otherAssets, 0) : '',
          "IA_FIXED_ASSETS": element.value.fixedAssets ? this.commaSeparator.removeComma(element.value.fixedAssets, 0) : '',
          "IA_TOTAL_ASSETS": element.value.totalAssets ? this.commaSeparator.removeComma(element.value.totalAssets, 0) : '',
          "IA_OPENING_CAPITAL": element.value.openingCapital ? this.commaSeparator.removeComma(element.value.openingCapital, 0) : '',
          "IA_NET_PROFIT": element.value.netProfit ? this.commaSeparator.removeComma(element.value.netProfit, 0) : '',
          "IA_WITHDRAWAL_IN_INCOME_YR": element.value.withdrawalIncomeYear ? this.commaSeparator.removeComma(element.value.withdrawalIncomeYear, 0) : '',
          "IA_CLOSING_CAPITAL": element.value.closingCapital ? this.commaSeparator.removeComma(element.value.closingCapital, 0) : '',
          "IA_LIABILITIES": element.value.liabilities ? this.commaSeparator.removeComma(element.value.liabilities, 0) : '',
          "IA_TOTAL_CAPITAL_AND_LIABILITIES": element.value.totalCapitalandLiabilities ? this.commaSeparator.removeComma(element.value.totalCapitalandLiabilities, 0) : '',

          //3 -sugger-beet
          "IA_TAX_EXEMPTED_INCOME": element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0,

          //4 - livestock

          //5 -adhi-bhag
          "IA_TOTAL_RECEIPT": element.value.totalRecipt ? this.commaSeparator.removeComma(element.value.totalRecipt, 0) : '',
          "IA_NAME_OF_LEASING_PERSON": element.value.nameOfLeasingPerson ? element.value.nameOfLeasingPerson : '',
          "IA_CHK_TIN_NID": element.value.chkTinOrNid == '1' ? 'T' : 'F',
          "IA_TIN_OR_NID": element.value.nidOrTIN ? element.value.nidOrTIN : '',


          "IA_FARMER_ID": element.value.farmersID ? element.value.farmersID : '',

          //6 -sro
          "IA_SRO_NO": element.value.sroNoReference ? element.value.sroNoReference : '',
          "IA_YEAR": sroYr ? this.datepipe.transform(sroYr, 'yyyy') : '',
          "IA_PARTICULAR": element.value.particular ? element.value.particular : '',
          "IA_TAX_APPLICABLE": element.value.taxApplicable ? this.commaSeparator.removeComma(element.value.taxApplicable, 0) : '',
          "IA_TAXABLE_INCOME": element.value.taxableIncome ? this.commaSeparator.removeComma(element.value.taxableIncome, 0) : '',
          "SERIAL_NO": element.value.SERIAL_NO > 0 ? element.value.SERIAL_NO : '',
        }
        requestJson.push(obj);
      });
  //    console.log('agri req json ', requestJson);
      this.apiService.post(this.serviceUrl + 'api/user-panel/save-agriculture-data', requestJson)
        .subscribe(result => {
          if (result.body.success && !this.isSaveDraft) {
            this.toastr.success('Saved Successfully!', '', {
              timeOut: 1000,
            });
            this.headsOfIncome.forEach((Value, i) => {
              if (Value['link'] == '/user-panel/agriculture') {
                if (i + 1 > this.lengthOfheads - 1) {
                  this.router.navigate([this.selectedNavbar[2]['link']]);
                }
                if (i + 1 <= this.lengthOfheads - 1) {
                  this.router.navigate([this.headsOfIncome[i + 1]['link']]);
                }
              }
            });
          }
          if (result.body.success && this.isSaveDraft == true) {
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
  //          console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });

          });
    }
    //post end

  }
  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/agriculture') {
        if (i - 1 < 0) {
          this.router.navigate(["/user-panel/additional-information"]);
        }
        if (i - 1 >= 0) {
          this.router.navigate([this.headsOfIncome[i - 1]['link']]);
        }
      }
    });
  }

  checkSubmissionStatus(): Promise<void> {
    this.eReturnSpinner.start();
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_submission')
        .subscribe(result => {
          if (result.replyMessage != null) {
            this.eReturnSpinner.stop();
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
            this.eReturnSpinner.stop();
            this.isShow = true;
            resolve();
          }
        },
          error => {
            reject();
            this.eReturnSpinner.stop();
   //         console.log(error['error'].errorMessage);
          });
    });
  }
}
