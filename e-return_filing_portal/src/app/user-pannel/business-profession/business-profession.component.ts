import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, of, timer } from "rxjs";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { HeadsOfIncomeService } from "../heads-of-income.service";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ApiService } from "../../custom-services/ApiService";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommaSeparatorService } from "../../service/comma-separator.service";
import { BusinessValidationService } from "../../service/business-validation.service";

@Component({
  selector: "app-business-profession",
  templateUrl: "./business-profession.component.html",
  styleUrls: ["./business-profession.component.css"],
})
export class BusinessProfessionComponent implements OnInit {
  html: any = `<span class="btn-block well-sm">No Tooltip Found!</span>`;
  //general tooltip
  business_type: any = `<span class="btn-block well-sm ";">Select the business or profession from which you earned income from the dropdown list.</span>`;
  //regular
  businessName: any; businessAddress: any; salesTurnoverReceipt: any; grossProfit: any; genAdministrative: any; netProfit_income: any;
  maintainBooksOfAccounts: any; cashInHand: any; inventories: any; fixedAsset: any; otherAsset: any; totalAsset: any; openingCapital: any; netProfit_balance: any; withdrawalsIncome: any; closingCapital: any; liabilities: any; totalCpAndLiabilities: any;
  TDS: any; releventSectionTDS: any; totalCulArea: any; particularOfProduces: any;
  salesProceed: any; costOfProduction: any; otherAlwableDeduction: any; agri_income: any; business_income: any; netIncome: any;
  sro_reference: any; yearSRO: any; particular: any; taxExemptedIncome: any; taxableIncome: any; taxApplicable: any;
  subsidyParticular: any; amountOfCashSubsidy: any;



  selectedNavbar = [];
  mainNavActive = {};
  group: FormGroup;
  checkIsLoggedIn: any;
  isSaveDraft: boolean = false;

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
  businessCategoryTypeName = [];

  isRegularBusinessOrProfession = [];
  isBSMT = [];
  isTobaccoBusiness = [];
  isProductionOfTreeOrRubber = [];
  isIncomeExempted = [];

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

  minYear: any;
  maxYear: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  getResponseData: any;
  requestGetData: any;
  formGroup: FormGroup;
  additionalInformationForm: FormGroup;
  IS_TEA_RUBBER_PRESENT_IN_AGRI: boolean = false;
  is_gross_negative = [];

  // validation arrays 
  businessType_showError = [];
  businessTypeName_showError = [];
  businessName_showError = [];
  BusinessAddress_showError = [];
  totalCulArea_showError = [];
  particularOfProduces_showError = [];
  salesProceed_showError = [];
  costOfProduction_showError = [];
  salesTurnoverReceipt_showError = [];
  grossProfit_showError = [];
  generalAdminisSell_showError = [];
  tds_showError = [];
  releventSectionTDS_showError = [];
  amountOfCashSubsidy_showError = [];
  particulars_showError = [];
  particular_showError = [];
  sroNo_showError = [];
  year_showError = [];
  taxApplicable_showError = [];
  cashInHand_showError = [];
  inventories_showError = [];
  fixedAsset_showError = [];
  otherAsset_showError = [];
  openingCapital_showError = [];
  withdrawals_showError = [];
  liabilities_showError = [];
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
    private rReturnSpinner: NgxUiLoaderService,
    private commaSeparator: CommaSeparatorService,
    private businessValidationService: BusinessValidationService
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
      id: new FormControl(),
      incomeParticularSourceId: new FormControl(),
      businessCategoryType: new FormControl(0),
      businessTypeName: new FormControl(),
      totalCultivationArea: new FormControl(),
      unitOfTotalCulArea: new FormControl('Decimal'),
      // particularOfProduces: new FormControl(),
      businessCategoryTypeName: new FormControl(),
      businessName: new FormControl(),
      businessAddress: new FormControl(),

      salesTurnoverReceipts: new FormControl(),
      grossProfit: new FormControl(),
      generalAdminisSellingAndOther: new FormControl(),
      netProfit_1: new FormControl(),
      netProfit_2: new FormControl(),
      taxToDeducted: new FormControl(),

      otherAssets: new FormControl(),
      salesProceed: new FormControl(),
      totalRecipt: new FormControl(),
      costOfProduction: new FormControl(),
      otherAllowableDeduction: new FormControl(),
      netIncome: new FormControl(),
      sroNoReference: new FormControl(),
      year: new FormControl(),
      // particular: new FormControl(""),
      taxExemptedIncome: new FormControl(),
      taxApplicable: new FormControl(),

      sales: new FormControl(),
      agriculturalIncome: new FormControl(),
      incomeFromBusinessOrProfession: new FormControl(),
      cashInHandandAtBank: new FormControl(),
      inventories: new FormControl(),
      fixedAssets: new FormControl(),
      totalAssets: new FormControl(),
      openingCapital: new FormControl(),

      withdrawalIncomeYear: new FormControl(),
      closingCapital: new FormControl(),
      liabilities: new FormControl(),
      // cs_particulars: new FormControl(),
      amountOfCashSubsidy: new FormControl(),

      releventSectionTDS: new FormControl(),
      totalCapitalandLiabilities: new FormControl(),
      commonParticulars: new FormControl(),
      isMaintainedBookOfAC: new FormControl('1'),
      taxableIncome: new FormControl()

    });

    this.formArray.push(this.group);
    this.selectedBusinessProfession(this.formArray.length - 1);
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.navActiveSelect("5");
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

    this.minYear = new Date(1972, 0, 1);
    this.maxYear = new Date();
    this.maxYear.setDate(this.maxYear.getDate());

    this.rReturnSpinner.start();
    this.getBusinessOrProfessionData();
    this.checkSubmissionStatus();
    this.rReturnSpinner.stop();
  }

  getBusinessOrProfessionData() {
    //debugger;
    //get api
    this.formArray.clear();
    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/business')
      .subscribe(result => {
       // console.log('business result ', result);
        this.IS_TEA_RUBBER_PRESENT_IN_AGRI = result.TEA_RUBBER_PRESENT_IN_AGRICULTURE;
        this.getResponseData = result.data;
        if (this.getResponseData.length > 0) {
          this.getResponseData.forEach((element, index) => {
            this.loadBusinessProfessionTooltips(element.businessCatg);
            this.setBusinessCategoryTypeNameforGet(element.businessCatg, index);
            this.group = new FormGroup({
              id: new FormControl(element.id),
              incomeParticularSourceId: new FormControl(element.incomeParticularSourceId),
              businessCategoryType: new FormControl(element.businessCatg),
              businessTypeName: new FormControl(element.businessTypeName),
              totalCultivationArea: new FormControl(element.teaRubberCultivationArea),
              unitOfTotalCulArea: new FormControl(element.unitOfTotalCulArea),
              // particularOfProduces: new FormControl(),
              businessCategoryTypeName: new FormControl(),
              businessName: new FormControl(element.businessNm),
              businessAddress: new FormControl(element.businessAddress),

              salesTurnoverReceipts: new FormControl(this.commaSeparator.currencySeparatorBD(element.salesTurnReceipts)),
              grossProfit: new FormControl(this.commaSeparator.currencySeparatorBD(element.grossProfit)),
              generalAdminisSellingAndOther: new FormControl(this.commaSeparator.currencySeparatorBD(element.gasoExpenses)),
              netProfit_1: new FormControl(this.commaSeparator.currencySeparatorBD(element.netProfit)),
              netProfit_2: new FormControl(this.commaSeparator.currencySeparatorBD(element.netProfit)),
              taxToDeducted: new FormControl(this.commaSeparator.currencySeparatorBD(element.tds)),

              otherAssets: new FormControl(this.commaSeparator.currencySeparatorBD(element.otherAssets)),
              salesProceed: new FormControl(),
              totalRecipt: new FormControl(),
              costOfProduction: new FormControl(this.commaSeparator.currencySeparatorBD(element.teaRubberProdCost)),
              otherAllowableDeduction: new FormControl(this.commaSeparator.currencySeparatorBD(element.teaRubberOtherDeduct)),
              netIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.teaRubberNetIncm)),
              sroNoReference: new FormControl(element.sroNoRef),
              year: new FormControl(element.sroYear),
              // particular: new FormControl(element.sroParticular),
              taxExemptedIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.taxExemptedIncm)),
              taxApplicable: new FormControl(this.commaSeparator.currencySeparatorBD(element.taxAppl)),

              sales: new FormControl(this.commaSeparator.currencySeparatorBD(element.teaRubberSales)),
              agriculturalIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.teaRubberAgrIncm)),
              incomeFromBusinessOrProfession: new FormControl(this.commaSeparator.currencySeparatorBD(element.teaRubberIncmBusProf)),
              cashInHandandAtBank: new FormControl(this.commaSeparator.currencySeparatorBD(element.cashHandBank)),
              inventories: new FormControl(this.commaSeparator.currencySeparatorBD(element.inventories)),
              fixedAssets: new FormControl(this.commaSeparator.currencySeparatorBD(element.fixedAssets)),
              totalAssets: new FormControl(this.commaSeparator.currencySeparatorBD(element.totalAssets)),
              openingCapital: new FormControl(this.commaSeparator.currencySeparatorBD(element.openingCp)),

              withdrawalIncomeYear: new FormControl(this.commaSeparator.currencySeparatorBD(element.withdrawalsIncmYr)),
              closingCapital: new FormControl(this.commaSeparator.currencySeparatorBD(element.closingCp)),
              liabilities: new FormControl(this.commaSeparator.currencySeparatorBD(element.liabilities)),
              // cs_particulars: new FormControl(element.cashSubParticulars),
              amountOfCashSubsidy: new FormControl(this.commaSeparator.currencySeparatorBD(element.netProfit)),

              releventSectionTDS: new FormControl(element.tdsRelevant),
              totalCapitalandLiabilities: new FormControl(this.commaSeparator.currencySeparatorBD(element.totalCpLb)),
              commonParticulars: new FormControl(element.commonParticulars),
              isMaintainedBookOfAC: new FormControl(element.maintainBooksOfAccounts === true ? '1' : '0'),
              taxableIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.taxableIncm))
            });
            this.formArray.push(this.group);
            this.selectedBusinessProfession(this.formArray.length - 1);
         //   console.log(this.formArray);

          });
        }
        else {
          this.insertFormGroupToArray();
        }
      })
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
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Business');
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

  loadBusinessProfessionTooltips(businessCategory: any) {
    //debugger;
    if (businessCategory === 'REG_BUS_PROF') {
      this.getRegularBusinessProfessionTooltips();
    }
    else if (businessCategory === 'BSMT_OTHER_BUS_SUB_MIN_TAX') {
      this.getOtherBusinessSubMinTaxTooltips();
    }
    else if (businessCategory === 'TEA_RUB') {
      this.getTeaRubberTooltips();
    }
    else if (businessCategory === 'TOBACCO_BUS') {
      this.getTobaccoBusinessTooltips();
    }
    else if (businessCategory === 'EXEMPT_OR_REDUCED_SRO') {
      this.getSROTooltips();
    }
    else {
      this.getBSMTAllTooltips();
    }


  }
  getRegularBusinessProfessionTooltips() {
    this.businessName = `<span class="btn-block well-sm ";">The name (if any) of your sole proprietorship business or profession. [You may enter the name as mentioned in the trade license].</span>`;
    this.businessAddress = `<span class="btn-block well-sm ";">The address of your sole proprietorship business or profession. [You may enter the address as mentioned in the trade license].</span>`;
    this.salesTurnoverReceipt = `<span class="btn-block well-sm ";">The amount of revenues earned from this business.</span>`;
    this.grossProfit = `<span class="btn-block well-sm ";">Calculated by deducting cost of goods sold or cost of sales or cost of services from the amount of revenue.</span>`;
    this.genAdministrative = `<span class="btn-block well-sm ";">All allowable expenses incurred for this business other than those considered in calculating Gross Profit.</span>`;
    this.netProfit_income = `<span class="btn-block well-sm ";">Calculated by deducting General, Administrative, Selling and Other Expenses from Gross profit.</span>`;
    this.maintainBooksOfAccounts = `<span class="btn-block well-sm ";">Select “Yes” if you maintain Books of Accounts for your sole proprietorship business or profession. Otherwise, select “No”.</span>`;
    this.TDS = `<span class="btn-block well-sm ";">The amount of tax deducted/collected at source against this business/profession.</span>`;
    // not provided we take it from angiculture
    this.cashInHand = `<span class="btn-block well-sm ";">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories = `<span class="btn-block well-sm ";">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAsset = `<span class="btn-block well-sm ";">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAsset = `<span class="btn-block well-sm ";">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAsset = `<span class="btn-block well-sm ";">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital = `<span class="btn-block well-sm ";">The amount of capital at the beginning of income year.</span>`;
    this.netProfit_balance = `<span class="btn-block well-sm ";">Net profit amount as shown in the income statement.</span>`;
    this.withdrawalsIncome = `<span class="btn-block well-sm ";">The amount taken out by you from your business or profession.</span>`;
    this.closingCapital = `<span class="btn-block well-sm ";">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;
    this.liabilities = `<span class="btn-block well-sm ";">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your business or profession.</span>`;
    this.totalCpAndLiabilities = `<span class="btn-block well-sm ";">The sum of capital and liabilities. Please note that total capital & liabilities of your business or profession must equal its total assets.</span>`;


  }
  getBSMTAllTooltips() {
    //income side
    this.businessName = `<span class="btn-block well-sm ";">The name (if any) of your sole proprietorship business or profession. [You may enter the name as mentioned in the trade license].</span>`;
    this.businessAddress = `<span class="btn-block well-sm ";">The address of your sole proprietorship business or profession. [You may enter the address as mentioned in the trade license].</span>`;
    this.salesTurnoverReceipt = `<span class="btn-block well-sm ";">Amount of revenues earned from this business.</span>`;
    this.grossProfit = `<span class="btn-block well-sm ";">Calculated by deductingcost of goods sold, sales or services from the amount of revenue.</span>`;
    this.genAdministrative = `<span class="btn-block well-sm ";">All allowable expenses incurred for this business other than those considered in calculating Gross Profit.</span>`;
    this.netProfit_income = `<span class="btn-block well-sm ";">Calculated by deducting General, Administrative, Selling and other expenses from the amount of Gross profit</span>`;
    this.maintainBooksOfAccounts = `<span class="btn-block well-sm ";">Select “Yes” if you maintain Books of Accounts for your sole proprietorship business or profession. Otherwise, select “No”.</span>`;
    this.TDS = `<span class="btn-block well-sm ";">The amount of tax deducted/collected at source against this business/profession.</span>`;
    this.taxExemptedIncome = `<span class="btn-block well-sm ";">The amount of income tax that is exempted from tax.</span>`;
    this.taxableIncome = `<span class="btn-block well-sm ";">The amount of income tax that is taxable.</span>`;
    this.subsidyParticular = `<span class="btn-block well-sm ";">The name/description of export item against which the cash subsidy was received.</span>`;
    this.amountOfCashSubsidy = `<span class="btn-block well-sm ";">The gross amount of cash subsidy. This is the cash subsidy amount before deducting source tax.</span>`;


    //balance sheet summary side
    // not provided we take it from angiculture
    this.cashInHand = `<span class="btn-block well-sm ";">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories = `<span class="btn-block well-sm ";">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAsset = `<span class="btn-block well-sm ";">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAsset = `<span class="btn-block well-sm ";">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAsset = `<span class="btn-block well-sm ";">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital = `<span class="btn-block well-sm ";">The amount of capital at the beginning of income year.</span>`;
    this.netProfit_balance = `<span class="btn-block well-sm ";">Net profit amount as shown in the income statement.</span>`;
    this.withdrawalsIncome = `<span class="btn-block well-sm ";">The amount taken out by you from your business or profession.</span>`;
    this.closingCapital = `<span class="btn-block well-sm ";">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;
    this.liabilities = `<span class="btn-block well-sm ";">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your business or profession.</span>`;
    this.totalCpAndLiabilities = `<span class="btn-block well-sm ";">The sum of capital and liabilities. Please note that total capital & liabilities of your business or profession must equal its total assets.</span>`;
  }
  getOtherBusinessSubMinTaxTooltips() {
    this.businessName = `<span class="btn-block well-sm ";">The name (if any) of your sole proprietorship business or profession. [You may enter the name as mentioned in the trade license].</span>`;
    this.businessAddress = `<span class="btn-block well-sm ";">The address of your sole proprietorship business or profession. [You may enter the address as mentioned in the trade license].</span>`;
    this.salesTurnoverReceipt = `<span class="btn-block well-sm ";">The amount of revenues earned from this business.</span>`;
    this.grossProfit = `<span class="btn-block well-sm ";">Calculated by deductingcost of goods sold, sales or services from the amount of revenue.</span>`;
    this.genAdministrative = `<span class="btn-block well-sm ";">All expenses other than cost of goods sold, sales or services.</span>`;
    this.netProfit_income = `<span class="btn-block well-sm ";">Calculated by deducting General, Administrative, Selling and other expensesfrom the amount of Gross Profit.</span>`;
    this.TDS = `<span class="btn-block well-sm ";">The amount of tax deducted/collected at source against this business/profession.</span>`;
    this.releventSectionTDS = `<span class="btn-block well-sm ";">Section number under which tax deducted/collected at source against this business/ profession.</span>`;
    this.maintainBooksOfAccounts = `<span class="btn-block well-sm ";">Select “Yes” if you maintain Books of Accounts for your sole proprietorship business or profession. Otherwise, select “No”.</span>`;

  }
  getTobaccoBusinessTooltips() {
    this.businessName = `<span class="btn-block well-sm ";">The name (if any) of your sole proprietorship business or profession. [You may enter the name as mentioned in the trade license].</span>`;
    this.businessAddress = `<span class="btn-block well-sm ";">The address of your sole proprietorship business or profession. [You may enter the address as mentioned in the trade license].</span>`;
    this.salesTurnoverReceipt = `<span class="btn-block well-sm ";">The amount of revenues earned from this tobacco business.</span>`;
    this.grossProfit = `<span class="btn-block well-sm ";">Calculated by deducting cost of goods sold, sales or services from the amount of revenue.</span>`;
    this.genAdministrative = `<span class="btn-block well-sm ";">All allowable expenses incurred for this business other than those considered in calculating Gross Profit.</span>`;
    this.netProfit_income = `<span class="btn-block well-sm ";">Calculated by deducting General, Administrative, Selling and Other Expenses from the amount of Gross Profit.</span>`;
  }
  getTeaRubberTooltips() {
    this.totalCulArea = `<span class="btn-block well-sm ";">Total area used in earning agricultural income.</span>`;
    this.particularOfProduces = `<span class="btn-block well-sm ";">The name and brief description (if applicable) of Business products (tea or rubber).</span>`;
    this.salesProceed = `<span class="btn-block well-sm ";">Amount received by selling tea/rubber (whoever is applicable).</span>`;
    this.costOfProduction = `<span class="btn-block well-sm ";">Amount spent for producing tea/rubber (whoever is applicable).</span>`;
    this.otherAlwableDeduction = `<span class="btn-block well-sm ";">Other allowable expenses incurred for this business in addition to Cost of Production.</span>`;
    this.netIncome = `<span class="btn-block well-sm ";">The amount calculated by deducting Cost of Production and Other Allowable Deductions from Sale Proceed.</span>`;
    this.agri_income = `<span class="btn-block well-sm ";">Portion (amount) of income that is classified as Agricultural Income.</span>`;
    this.business_income = `<span class="btn-block well-sm ";">Portion (amount) of income that is classified as Income from Business or Profession.</span>`;
    this.cashInHand = `<span class="btn-block well-sm ";">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories = `<span class="btn-block well-sm ";">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAsset = `<span class="btn-block well-sm ";">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAsset = `<span class="btn-block well-sm ";">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAsset = `<span class="btn-block well-sm ";">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital = `<span class="btn-block well-sm ";">The amount of capital at the beginning of income year.</span>`;
    this.netProfit_balance = `<span class="btn-block well-sm ";">Net profit amount as shown in the income statement.</span>`;
    this.withdrawalsIncome = `<span class="btn-block well-sm ";">The amount taken out by you from your business or profession.</span>`;
    this.closingCapital = `<span class="btn-block well-sm ";">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;
    this.liabilities = `<span class="btn-block well-sm ";">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your business or profession.</span>`;
    this.totalCpAndLiabilities = `<span class="btn-block well-sm ";">The sum of capital and liabilities. Please note that total capital & liabilities of your business or profession must equal its total assets.</span>`;
  }
  getSROTooltips() {
    this.businessName = `<span class="btn-block well-sm ";">The name (if any) of your sole proprietorship business or profession. [You may enter the name as mentioned in the trade license].</span>`;
    this.businessAddress = `<span class="btn-block well-sm ";">The address of your sole proprietorship business or profession. [You may enter the address as mentioned in the trade license].</span>`;
    this.salesTurnoverReceipt = `<span class="btn-block well-sm ";">The amount of revenues earned from this business/profession.</span>`;
    this.grossProfit = `<span class="btn-block well-sm ";">Calculated by deductingcost of goods sold, sales or services from the amount of revenue.</span>`;
    this.genAdministrative = `<span class="btn-block well-sm ";">All allowable expenses incurred for this business other than those considered in calculating Gross Profit.</span>`;
    this.netProfit_income = `<span class="btn-block well-sm ";">Calculated by deducting General, Administrative, Selling and Other Expenses from the amount of Gross Profit.</span>`;
    this.sro_reference = `<span class="btn-block well-sm ";">The number of SRO under which your income from business or profession enjoy special tax treatment.</span>`;
    this.yearSRO = `<span class="btn-block well-sm ";">The year which the SRO is issued.</span>`;
    this.particular = `<span class="btn-block well-sm ";">Any necessary description of SRO (such as its subject matter).</span>`;
    this.taxExemptedIncome = `<span class="btn-block well-sm ";">The amount of income tax that is exempted from tax.</span>`;
    this.taxableIncome = `<span class="btn-block well-sm ";">The amount of income tax that is taxable.</span>`;
    this.taxApplicable = `<span class="btn-block well-sm ";">Amount of tax calculated on taxable amount.</span>`;

    this.cashInHand = `<span class="btn-block well-sm ";">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories = `<span class="btn-block well-sm ";">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAsset = `<span class="btn-block well-sm ";">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAsset = `<span class="btn-block well-sm ";">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAsset = `<span class="btn-block well-sm ";">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital = `<span class="btn-block well-sm ";">The amount of capital at the beginning of income year.</span>`;
    this.netProfit_balance = `<span class="btn-block well-sm ";">Net profit amount as shown in the income statement.</span>`;
    this.withdrawalsIncome = `<span class="btn-block well-sm ";">The amount taken out by you from your business or profession.</span>`;
    this.closingCapital = `<span class="btn-block well-sm ";">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;
    this.liabilities = `<span class="btn-block well-sm ";">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your business or profession.</span>`;
    this.totalCpAndLiabilities = `<span class="btn-block well-sm ";">The sum of capital and liabilities. Please note that total capital & liabilities of your business or profession must equal its total assets.</span>`;

  }

  removeOption() {
    this.formArray.removeAt(this.formArray.length - 1);
    if (this.formArray.length === this.isVisibleForm) {
      this.isVisibleForm = this.formArray.controls.length - 1;
    }
  }

  allowNegativeValue(grossProfit, i) {
    let isSuccess: boolean; let grossProfit2 = this.commaSeparator.extractComma(grossProfit);
    const regularExpression = /^-?\d*\.{0,1}\d+$/;
   // console.log(regularExpression.test(String(grossProfit2).toLowerCase()));
    isSuccess = regularExpression.test(String(grossProfit2).toLowerCase());
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^-?\d*\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  integerOnly(event): boolean {
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

  acceptNegativeNumber(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && charCode != 45 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  floatingNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode == 47 || charCode > 57)) {
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

  makeTaxExemptedIncReadOnly(salesProceed: any): boolean {
    // debugger;
    if (parseInt(salesProceed) < 0)
      return true;
    else
      return false;
  }

  initializeBusinessType(event, i) {
    this.businessTypeName_showError[i] = false;
  }

  initializeBusinessName(event, i) {
    this.businessName_showError[i] = false;
  }

  initializeBusinessAddress(event, i) {
    this.BusinessAddress_showError[i] = false;
  }

  initializeParticulars(event, i) {
    this.particulars_showError[i] = false;
    this.particular_showError[i] = false;
  }

  initializeSroRef(event, i) {
    this.sroNo_showError[i] = false;
  }

  initializeYear(i) {
    this.year_showError[i] = false;
  }

  initializeTotalCulArea(i) {
    this.totalCulArea_showError[i] = false;
  }

  initializeParticularofProduces(i) {
    this.particularOfProduces_showError[i] = false;
  }

  initializeSalesTurnoverReceipt(event, i) {
    this.salesTurnoverReceipt_showError[i] = false;
    this.formArray.controls[i].patchValue({
      salesTurnoverReceipts: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value))
    });
  }

  initializeTDS(event, i) {
    this.tds_showError[i] = false;
    this.formArray.controls[i].patchValue({
      taxToDeducted: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value))
    });
  }

  initializeNetProfit(event, i) {
    this.amountOfCashSubsidy_showError[i] = false;
    this.formArray.controls[i].patchValue({
      netProfit_1: event.target.value === '0' ? '' : this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value))
    });
  }

  initializeTotalArea(event, i) {
    if (parseFloat(event.target.value) <= 0) {
      this.toastr.warning('Total Area will be More than 0!');
      this.formArray.controls[i].patchValue({
        totalCultivationArea: ''
      });
      return;
    }
  }

  initializeTaxApplicable(event, i) {
    this.taxApplicable_showError[i] = false;
    this.formArray.controls[i].patchValue({
      taxApplicable: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value))
    });
  }

  setBusinessCategoryTypeNameforGet(businessCategoryType, i) {
    //debugger;
    const optValue = businessCategoryType;
    const parent = businessCategoryType.substring(0, 4) === 'BSMT' ? 'BSMT' : null;
    const optParentValue = this.getBusinessCategoryName(businessCategoryType);
    let concatParentChild = "";
    concatParentChild =
      parent != null
        ? parent +
        ">" +
        optParentValue
        : optParentValue;
    if (optValue === 'REG_BUS_PROF') {
      this.incomeType = of(true);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = true;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;

    }

    else if (optValue === 'BSMT_CONTRACT_OR_SUPPLY' || optValue === 'BSMT_REAL_EST_OR_LAND' || optValue === 'BSMT_IMPORT' || optValue === 'BSMT_EXP_OF_MAN' || optValue === 'BSMT_C_F_AGENCY' || optValue === 'BSMT_SHIP_BUS' //(1-7)
      || optValue === 'BSMT_DSTR_OF_COMP' || optValue === 'BSMT_AGENCY_FOREIGN_BUYER' || optValue === 'BSMT_OTHER_BUS_SUB_MIN_TAX' || optValue === 'BSMT_EXP_US_53BB' || optValue === 'BSMT_EXP_US_53BBBB' || optValue === 'BSMT_EXP_CASH_SUB') {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = true;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;
    } else if (optValue === 'TOBACCO_BUS') {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = true;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;
    } else if (optValue === 'TEA_RUB') {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = true;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;

    } else if (optValue === 'EXEMPT_OR_REDUCED_SRO') {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = true;
      this.businessCategoryTypeName[i] = concatParentChild;

    }
  }
  businessCategoryTypeChange(event, i) {
    this.initializeErrorIndexes(i);
    this.clearExistingFormData(i);
    const optValue = event.target.value;
    const optParentValue = event.target.options[
      event.target.options.selectedIndex
    ].parentNode.getAttribute("label");
    let concatParentChild = "";
    concatParentChild =
      optParentValue != null
        ? optParentValue.substring(32, 36) +
        ">" +
        event.target.options[event.target.options.selectedIndex].text
        : event.target.options[event.target.options.selectedIndex].text;
    if (optValue === 'REG_BUS_PROF') {
      this.loadBusinessProfessionTooltips(optValue);
      this.incomeType = of(true);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = true;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;
    }

    else if (optValue === 'BSMT_CONTRACT_OR_SUPPLY' || optValue === 'BSMT_REAL_EST_OR_LAND' || optValue === 'BSMT_IMPORT' || optValue === 'BSMT_EXP_OF_MAN' || optValue === 'BSMT_C_F_AGENCY' || optValue === 'BSMT_SHIP_BUS' //(1-7)
      || optValue === 'BSMT_DSTR_OF_COMP' || optValue === 'BSMT_AGENCY_FOREIGN_BUYER' || optValue === 'BSMT_OTHER_BUS_SUB_MIN_TAX' || optValue === 'BSMT_EXP_US_53BB' || optValue === 'BSMT_EXP_US_53BBBB' || optValue === 'BSMT_EXP_CASH_SUB') {
      this.loadBusinessProfessionTooltips(optValue);
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = true;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;
    } else if (optValue === 'TOBACCO_BUS') {
      this.loadBusinessProfessionTooltips(optValue);
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = true;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;

    } else if (optValue === 'TEA_RUB') {
      this.loadBusinessProfessionTooltips(optValue);
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = true;
      this.isIncomeExempted[i] = false;
      this.businessCategoryTypeName[i] = concatParentChild;

    } else if (optValue === 'EXEMPT_OR_REDUCED_SRO') {
      this.loadBusinessProfessionTooltips(optValue);
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isDisableAddSalBtn = false;
      this.isRegularBusinessOrProfession[i] = false;
      this.isBSMT[i] = false;
      this.isTobaccoBusiness[i] = false;
      this.isProductionOfTreeOrRubber[i] = false;
      this.isIncomeExempted[i] = true;
      this.businessCategoryTypeName[i] = concatParentChild;

    }

    this.formArray.controls[this.formArray.length - 1].patchValue({
      businessCategoryTypeName: this.businessCategoryTypeName[i],
    });

  }

  isMaintainedBookOfACFalse(event, i) {
    //debugger;
    if (event.target.checked) {
      this.formArray.controls[i].patchValue({
        id: this.formArray.controls[i].value.id ? this.formArray.controls[i].value.id : null,
        incomeParticularSourceId: this.formArray.controls[i].value.incomeParticularSourceId ? this.formArray.controls[i].value.incomeParticularSourceId : null,

        sales: '',
        agriculturalIncome: '',
        incomeFromBusinessOrProfession: '',
        cashInHandandAtBank: '',
        inventories: '',
        fixedAssets: '',
        totalAssets: '',
        openingCapital: '',
        withdrawalIncomeYear: '',
        closingCapital: '',
        liabilities: '',
        amountOfCashSubsidy: '',
        otherAssets: '',
        totalCapitalandLiabilities: '',
      });
    }
  }

  clearExistingFormData(i) {
    //debugger;
    // console.log(this.formArray.controls[i].value.incomeParticularSourceId);
    //reset forms
    this.formArray.controls[i].patchValue({
      id: this.formArray.controls[i].value.id ? this.formArray.controls[i].value.id : null,
      incomeParticularSourceId: this.formArray.controls[i].value.incomeParticularSourceId ? this.formArray.controls[i].value.incomeParticularSourceId : null,
      // businessCategoryType: new FormControl(0),
      totalCultivationArea: '',
      // businessCategoryTypeName: new FormControl(),
      businessName: '',
      businessAddress: '',

      salesTurnoverReceipts: '',
      grossProfit: '',
      generalAdminisSellingAndOther: '',
      netProfit_1: '',
      netProfit_2: '',
      taxToDeducted: '',

      otherAssets: '',
      salesProceed: '',
      totalRecipt: '',
      costOfProduction: '',
      otherAllowableDeduction: '',
      netIncome: '',
      sroNoReference: '',
      year: '',
      // particular: new FormControl(""),
      taxExemptedIncome: '',
      taxableIncome: '',
      taxApplicable: '',

      sales: '',
      agriculturalIncome: '',
      incomeFromBusinessOrProfession: '',
      cashInHandandAtBank: '',
      inventories: '',
      fixedAssets: '',
      totalAssets: '',
      openingCapital: '',

      withdrawalIncomeYear: '',
      closingCapital: '',
      liabilities: '',
      // cs_particulars: '',
      amountOfCashSubsidy: '',

      releventSectionTDS: '',
      totalCapitalandLiabilities: '',
      commonParticulars: '',
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

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }

  selectedBusinessProfession(i: number) {
    this.isVisibleForm = i;
    this.loadBusinessProfessionTooltips(this.formArray.controls[i].value.businessCatg);
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
    this.lengthOfheads = this.headsOfIncome.length;
  }

  close(i) {

    //delete api

    this.formArray.controls.forEach((element, index) => {
      if (i == index && element.value.id > 0) {
        this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/business/' + element.value.id)
          .subscribe(result => {
            if (result === 'S') {
              this.toastr.success('Deleted Successfully!', '', {
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
      else if (i == index && element.value.id == null) {
        this.afterTabClose(i);
      }
    });
    //end
  }

  afterTabClose(i) {
    this.formArray.removeAt(i);
    this.businessCategoryTypeName.splice(i, 1);
    this.closeErrorIndexes(i);
    if (this.formArray.length >= 1) {
      this.modalRef.hide();
      this.isVisibleForm = this.formArray.controls.length - 1;
    } else if (this.formArray.length < 1) {
      this.isVisibleForm = 0;
      this.isVisibleIncomeTab = true;
      this.modalRef.hide();
      this.insertFormGroupToArray();
    } else {
    }
  }

  initializeErrorIndexes(i) {
    this.businessType_showError[i] = false;
    this.businessTypeName_showError[i] = false;
    this.businessName_showError[i] = false;
    this.BusinessAddress_showError[i] = false;
    this.totalCulArea_showError[i] = false;
    this.particularOfProduces_showError[i] = false;
    this.salesProceed_showError[i] = false;
    this.costOfProduction_showError[i] = false;
    this.salesTurnoverReceipt_showError[i] = false;
    this.grossProfit_showError[i] = false;
    this.generalAdminisSell_showError[i] = false;
    this.tds_showError[i] = false;
    this.releventSectionTDS_showError[i] = false;
    this.amountOfCashSubsidy_showError = [];
    this.particulars_showError[i] = false;
    this.particular_showError[i] = false;
    this.sroNo_showError[i] = false;
    this.year_showError[i] = false;
    this.taxApplicable_showError[i] = false;
    this.cashInHand_showError[i] = false;
    this.inventories_showError[i] = false;
    this.fixedAsset_showError[i] = false;
    this.otherAsset_showError[i] = false;
    this.openingCapital_showError[i] = false;
    this.withdrawals_showError[i] = false;
    this.liabilities_showError[i] = false;
  }

  closeErrorIndexes(i) {
    this.businessType_showError.splice(i, 1);
    this.businessTypeName_showError.splice(i, 1);
    this.businessName_showError.splice(i, 1);
    this.BusinessAddress_showError.splice(i, 1);
    this.totalCulArea_showError.splice(i, 1);
    this.particularOfProduces_showError.splice(i, 1);
    this.salesProceed_showError.splice(i, 1);
    this.costOfProduction_showError.splice(i, 1);
    this.salesTurnoverReceipt_showError.splice(i, 1);
    this.grossProfit_showError.splice(i, 1);
    this.generalAdminisSell_showError.splice(i, 1);
    this.tds_showError.splice(i, 1);
    this.releventSectionTDS_showError.splice(i, 1);
    this.amountOfCashSubsidy_showError = [];
    this.particulars_showError.splice(i, 1);
    this.particular_showError.splice(i, 1);
    this.sroNo_showError.splice(i, 1);
    this.year_showError.splice(i, 1);
    this.taxApplicable_showError.splice(i, 1);
    this.cashInHand_showError.splice(i, 1);
    this.inventories_showError.splice(i, 1);
    this.fixedAsset_showError.splice(i, 1);
    this.otherAsset_showError.splice(i, 1);
    this.openingCapital_showError.splice(i, 1);
    this.withdrawals_showError.splice(i, 1);
    this.liabilities_showError.splice(i, 1);
  }

  //#region CALCULATION AREA
  netProfit_Calc_1(i, businessType: any, formControlName) {
    // eqn : net profit = gross profit - GAS_Other income
    let grossProfit: any; let SalesTurnoverReceipt: any;
    let gen_ads_sell_other_exp: any;
    let opening_capital: any; let net_profit: any;
    let withdrawal_income_yr: any;
    let closing_capital: any; let liabilities: any;
    let tmpCalcNetProfit: any; let tmpClosingCapital: any; let tmpTotalCpLiabilities: any; let tmpTaxable_taxExemptedInc: any;
    if (businessType === 'BSMT_EXP_US_53BB' || businessType === 'BSMT_EXP_US_53BBBB') {
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          if (formControlName === 'grossProfit') {
            this.grossProfit_showError[i] = false;
            SalesTurnoverReceipt = element.value.salesTurnoverReceipts ? this.commaSeparator.extractComma(element.value.salesTurnoverReceipts) : 0;
            if (SalesTurnoverReceipt < parseInt(this.commaSeparator.extractComma(element.value.grossProfit))) {
              this.toastr.warning('Gross profit will not be more than Sales/Turnover/Receipts', '', {
                timeOut: 2000,
              });
              this.formArray.controls[i].patchValue({
                grossProfit: '',
              });
            }
            else {
              this.formArray.controls[i].patchValue({
                grossProfit: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.grossProfit)),
              });
            }
          }
          if (formControlName === 'generalAdminisSellingAndOther') {
            this.generalAdminisSell_showError[i] = false;
            this.formArray.controls[i].patchValue({
              generalAdminisSellingAndOther: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther)),
            });
          }

          grossProfit = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0; // gross profit
          gen_ads_sell_other_exp = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0; // GAS_Other income

          tmpCalcNetProfit = parseFloat(grossProfit) - parseFloat(gen_ads_sell_other_exp);
          tmpTaxable_taxExemptedInc = (tmpCalcNetProfit * 0.5);

          this.formArray.controls[i].patchValue({
            netProfit_1: this.commaSeparator.currencySeparatorBD(tmpCalcNetProfit),
            taxableIncome: this.commaSeparator.currencySeparatorBD(tmpTaxable_taxExemptedInc),
            taxExemptedIncome: this.commaSeparator.currencySeparatorBD(tmpTaxable_taxExemptedInc),
          });
        }
      });

      // calculate right side closing captal
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            openingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.openingCapital)),
            netProfit_1: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.netProfit_1)),
            withdrawalIncomeYear: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.withdrawalIncomeYear)),
          });

          opening_capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          net_profit = element.value.netProfit_1 ? this.commaSeparator.extractComma(element.value.netProfit_1) : 0;
          withdrawal_income_yr = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;

          tmpClosingCapital = (parseFloat(opening_capital) + parseFloat(net_profit)) - parseFloat(withdrawal_income_yr);

          this.formArray.controls[i].patchValue({
            closingCapital: this.commaSeparator.currencySeparatorBD(tmpClosingCapital),
          });
        }
      });

      //calculate right side total capital and liabilties
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            closingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.closingCapital)),
            liabilities: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.liabilities)),
          });

          closing_capital = element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : 0;
          liabilities = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

          this.formArray.controls[i].patchValue({
            totalCapitalandLiabilities: this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities)
          });
        }
      });

    }
    else if (businessType === 'EXEMPT_OR_REDUCED_SRO') {
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {

          if (formControlName === 'grossProfit') {
            this.grossProfit_showError[i] = false;
            SalesTurnoverReceipt = element.value.salesTurnoverReceipts ? this.commaSeparator.extractComma(element.value.salesTurnoverReceipts) : 0;
            if (SalesTurnoverReceipt < parseInt(this.commaSeparator.extractComma(element.value.grossProfit))) {
              this.toastr.warning('Gross profit will not be more than Sales/Turnover/Receipts', '', {
                timeOut: 2000,
              });
              this.formArray.controls[i].patchValue({
                grossProfit: '',
              });
            }
            else {
              this.formArray.controls[i].patchValue({
                grossProfit: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.grossProfit)),
              });
            }
          }
          if (formControlName === 'generalAdminisSellingAndOther') {
            this.generalAdminisSell_showError[i] = false;
            this.formArray.controls[i].patchValue({
              generalAdminisSellingAndOther: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther)),
            });
          }

          grossProfit = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0; // gross profit
          gen_ads_sell_other_exp = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0; // GAS_Other income

          tmpCalcNetProfit = parseFloat(grossProfit) - parseFloat(gen_ads_sell_other_exp);

          this.formArray.controls[i].patchValue({
            netProfit_1: this.commaSeparator.currencySeparatorBD(tmpCalcNetProfit),
          });
        }
      });

      // calculate right side closing captal
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            openingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.openingCapital)),
            netProfit_1: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.netProfit_1)),
            withdrawalIncomeYear: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.withdrawalIncomeYear)),
          });

          opening_capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          net_profit = element.value.netProfit_1 ? this.commaSeparator.extractComma(element.value.netProfit_1) : 0;
          withdrawal_income_yr = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;

          tmpClosingCapital = (parseFloat(opening_capital) + parseFloat(net_profit)) - parseFloat(withdrawal_income_yr);

          this.formArray.controls[i].patchValue({
            closingCapital: this.commaSeparator.currencySeparatorBD(tmpClosingCapital),
          });
        }
      });


      //calculate right side total capital and liabilties
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            closingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.closingCapital)),
            liabilities: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.liabilities)),
          });

          closing_capital = element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : 0;
          liabilities = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

          this.formArray.controls[i].patchValue({
            totalCapitalandLiabilities: this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities)
          });
        }
      });


      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            taxExemptedIncome: parseInt(element.value.taxExemptedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.taxExemptedIncome)) : '',
          });
          let tmpTaxableIncome: any;
          let taxExemptedIncome = element.value.taxExemptedIncome ? this.commaSeparator.extractComma(element.value.taxExemptedIncome) : 0;
          if (parseFloat(element.value.netProfit_1) < 0) {
            this.formArray.controls[i].patchValue({
              taxableIncome: 0,
              taxExemptedIncome: 0
            });
          }
          else {
            tmpTaxableIncome = parseFloat(this.commaSeparator.extractComma(element.value.netProfit_1)) - parseFloat(taxExemptedIncome.toString());
         //   console.log(tmpTaxableIncome);
            this.formArray.controls[i].patchValue({
              taxableIncome: parseInt(tmpTaxableIncome) ? this.commaSeparator.currencySeparatorBD(tmpTaxableIncome) : ''
            });
          }

        }
      });
    }
    else {
      // debugger;
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          // initialize
          if (formControlName === 'grossProfit') {
            this.grossProfit_showError[i] = false;
            SalesTurnoverReceipt = element.value.salesTurnoverReceipts ? this.commaSeparator.extractComma(element.value.salesTurnoverReceipts) : 0;
            if (SalesTurnoverReceipt < parseInt(this.commaSeparator.extractComma(element.value.grossProfit))) {
              this.toastr.warning('Gross profit will not be more than Sales/Turnover/Receipts', '', {
                timeOut: 2000,
              });
              this.formArray.controls[i].patchValue({
                grossProfit: '',
              });
            }
            else {
              this.formArray.controls[i].patchValue({
                grossProfit: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.grossProfit)),
              });
            }
          }
          if (formControlName === 'generalAdminisSellingAndOther') {
            this.generalAdminisSell_showError[i] = false;
            this.formArray.controls[i].patchValue({
              generalAdminisSellingAndOther: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther)),
            });
          }

          grossProfit = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0; // gross profit
          gen_ads_sell_other_exp = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0; // GAS_Other income
          tmpCalcNetProfit = parseFloat(grossProfit) - parseFloat(gen_ads_sell_other_exp);
          this.formArray.controls[i].patchValue({
            netProfit_1: this.commaSeparator.currencySeparatorBD(tmpCalcNetProfit),
          });
        }
      });

      // calculate right side closing captal
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            openingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.openingCapital)),
            netProfit_1: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.netProfit_1)),
            withdrawalIncomeYear: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.withdrawalIncomeYear)),
          });

          opening_capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          net_profit = element.value.netProfit_1 ? this.commaSeparator.extractComma(element.value.netProfit_1) : 0;
          withdrawal_income_yr = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
          tmpClosingCapital = (parseFloat(opening_capital) + parseFloat(net_profit)) - parseFloat(withdrawal_income_yr);

          this.formArray.controls[i].patchValue({
            closingCapital: this.commaSeparator.currencySeparatorBD(tmpClosingCapital)
          });
        }
      });

      //calculate right side total capital and liabilties
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            closingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.closingCapital)),
            liabilities: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.liabilities)),
          });

          closing_capital = element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : 0;
          liabilities = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

          this.formArray.controls[i].patchValue({
            totalCapitalandLiabilities: this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities)
          });
        }
      });
    }
  }

  calc_taxable_Inc_sro(i) {
    //debugger;
    let taxableIncome: any;
    let taxExemptedIncome: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        this.formArray.controls[i].patchValue({
          taxExemptedIncome: parseInt(element.value.taxExemptedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.taxExemptedIncome)) : '',
        });

        taxExemptedIncome = element.value.taxExemptedIncome ? this.commaSeparator.extractComma(element.value.taxExemptedIncome) : 0;
        taxableIncome = parseFloat(this.commaSeparator.extractComma(element.value.netProfit_1)) - parseFloat(taxExemptedIncome);

        if (taxExemptedIncome > parseFloat(this.commaSeparator.extractComma(element.value.grossProfit))) {
          this.toastr.warning('Tax Exempted Income cannot more than Gross Profit!', '', {
            timeOut: 3000,
          });
          this.formArray.controls[i].patchValue({
            taxExemptedIncome: 0
          });

          taxableIncome = parseFloat(this.commaSeparator.extractComma(element.value.netProfit_1)) - parseFloat(this.commaSeparator.extractComma(element.value.taxExemptedIncome));
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

  tea_rubber_netIncome_Calc(i, formControlName) {
    let sales: any; let cost_of_production: any; let net_profit: any; let withdrawal_income_yr: any;
    let other_alwable_deduction: any; let calcNetIncome: any; let opening_capital: any; let tmpClosingCapital: any;
    let closing_capital: any; let liabilities: any; let tmpTotalCpLiabilities: any; let net_income: any;
    this.formArray.controls.forEach((element, index) => {
      //if => agriculture type == 'cultivation' or tea_rubber, eqn : netIncome_1 = sales - cost_of_prod - other_alwable_ded
      if (index == i) {
        // calculate left side net income
        if (formControlName === 'salesTurnoverReceipts') {
          this.salesProceed_showError[i] = false;
          this.formArray.controls[i].patchValue({
            salesTurnoverReceipts: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.salesTurnoverReceipts)),
          });
        }
        if (formControlName === 'costOfProduction') {
          this.costOfProduction_showError[i] = false;
          this.formArray.controls[i].patchValue({
            costOfProduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.costOfProduction)),
          });
        }
        if (formControlName === 'otherAllowableDeduction') {
          this.formArray.controls[i].patchValue({
            otherAllowableDeduction: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.otherAllowableDeduction)),
          });
        }

        sales = element.value.salesTurnoverReceipts ? this.commaSeparator.extractComma(element.value.salesTurnoverReceipts) : 0;
        cost_of_production = element.value.costOfProduction ? this.commaSeparator.extractComma(element.value.costOfProduction) : 0;
        other_alwable_deduction = element.value.otherAllowableDeduction ? this.commaSeparator.extractComma(element.value.otherAllowableDeduction) : 0;

        calcNetIncome = parseFloat(sales) - parseFloat(cost_of_production) - parseFloat(other_alwable_deduction);

        this.formArray.controls[i].patchValue({
          netIncome: parseInt(calcNetIncome) ? this.commaSeparator.currencySeparatorBD(calcNetIncome) : '',
        });

        // calculate right side net income
        // let net_income: any;
        // net_income = element.value.netIncome ? element.value.netIncome : 0;
        this.formArray.controls[i].patchValue({
          netProfit_1: parseInt(calcNetIncome) ? this.commaSeparator.currencySeparatorBD(calcNetIncome) : '',
        });

        // calculate right side closing captal
        this.formArray.controls.forEach((element, index) => {
          if (index == i) {
            this.formArray.controls[i].patchValue({
              openingCapital: parseInt(element.value.openingCapital) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.openingCapital)) : '',
              netProfit_1: parseInt(element.value.netProfit_1) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.netProfit_1)) : '',
              withdrawalIncomeYear: parseInt(element.value.withdrawalIncomeYear) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.withdrawalIncomeYear)) : '',
            });

            opening_capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
            net_profit = element.value.netProfit_1 ? this.commaSeparator.extractComma(element.value.netProfit_1) : 0;
            withdrawal_income_yr = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
            tmpClosingCapital = (parseFloat(opening_capital) + parseFloat(net_profit)) - parseFloat(withdrawal_income_yr);

            this.formArray.controls[i].patchValue({
              closingCapital: parseInt(tmpClosingCapital) ? this.commaSeparator.currencySeparatorBD(tmpClosingCapital) : ''
            });
          }
        });

        //calculate right side total capital and liabilties
        this.formArray.controls.forEach((element, index) => {
          if (index == i) {
            this.formArray.controls[i].patchValue({
              closingCapital: parseInt(element.value.closingCapital) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.closingCapital)) : '',
              liabilities: parseInt(element.value.liabilities) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.liabilities)) : '',
            });

            closing_capital = element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : 0;
            liabilities = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
            tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

            this.formArray.controls[i].patchValue({
              totalCapitalandLiabilities: parseInt(tmpTotalCpLiabilities) ? this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities) : ''
            });
          }
        });

        net_income = element.value.netIncome ? this.commaSeparator.extractComma(element.value.netIncome) : 0;
        this.formArray.controls[i].patchValue({
          agriculturalIncome: parseInt(net_income) ? this.commaSeparator.currencySeparatorBD(parseInt(net_income) * 0.6) : '',
        });

        this.formArray.controls[i].patchValue({
          incomeFromBusinessOrProfession: parseInt(net_income) ? this.commaSeparator.currencySeparatorBD(parseInt(net_income) * 0.4) : '',
        });

        // calculate left side agriculture income
        // net_income = 0;
        // net_income = element.value.netIncome ? element.value.netIncome : 0;
        // this.formArray.controls[i].patchValue({
        //   agriculturalIncome: parseFloat(net_income) * 60 / 100,
        // });

        // // calculate left side business income
        // this.formArray.controls[i].patchValue({
        //   incomeFromBusinessOrProfession: parseFloat(net_income) * 40 / 100,
        // });
      }
    });
  }

  netProfit_Calc_2(i) {
    // eqn : net profit = opening capital
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        this.formArray.controls[i].patchValue({
          netProfit_2: parseInt(element.value.openingCapital) ? element.value.openingCapital : ''
        });
      }
    })

  }

  totalAsset_Calc(i, formControlName) {
    // eqn :total asset  = cash_in_hand + inventories + fixed asset + other asset
    let cash_in_hand: any; let fixed_Asset: any;
    let inventories: any; let other_assets: any;
    let tmpTotalAssetCalc: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (formControlName === 'cashInHandandAtBank') {
          this.cashInHand_showError[i] = false;
          this.formArray.controls[i].patchValue({
            cashInHandandAtBank: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.cashInHandandAtBank)),
          });
        }
        if (formControlName === 'inventories') {
          this.inventories_showError[i] = false;
          this.formArray.controls[i].patchValue({
            inventories: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.inventories)),
          });
        }
        if (formControlName === 'fixedAssets') {
          this.fixedAsset_showError[i] = false;
          this.formArray.controls[i].patchValue({
            fixedAssets: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.fixedAssets)),
          });
        }
        if (formControlName === 'otherAssets') {
          this.otherAsset_showError[i] = false;
          this.formArray.controls[i].patchValue({
            otherAssets: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.otherAssets)),
          });
        }

        cash_in_hand = element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : 0;
        inventories = element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : 0;
        fixed_Asset = element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : 0;
        other_assets = element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : 0;
        tmpTotalAssetCalc = parseFloat(cash_in_hand) + parseFloat(inventories) + parseFloat(fixed_Asset) + parseFloat(other_assets);

        this.formArray.controls[i].patchValue({
          totalAssets: this.commaSeparator.currencySeparatorBD(tmpTotalAssetCalc)
        });
      }
    });


  }
  closing_capital_Calc(i, formControlName) {
    //debugger;
    // eqn : closing capital = opening capital+net profit-withdrawal income yr
    let opening_capital: any; let net_profit: any;
    let withdrawal_income_yr: any;
    let closing_capital: any; let liabilities: any;
    let tmpCalClosingCapital: any; let tmpTotalCpLiabilities: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (formControlName === 'openingCapital') {
          this.openingCapital_showError[i] = false;
          this.formArray.controls[i].patchValue({
            openingCapital: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.openingCapital)),
          });
        }
        if (formControlName === 'withdrawalIncomeYear') {
          this.withdrawals_showError[i] = false;
          this.formArray.controls[i].patchValue({
            withdrawalIncomeYear: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.withdrawalIncomeYear)),
          });
        }

        this.formArray.controls[i].patchValue({
          netProfit_1: parseInt(element.value.netProfit_1) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.netProfit_1)) : 0,
        });


        opening_capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
        net_profit = element.value.netProfit_1 ? this.commaSeparator.extractComma(element.value.netProfit_1) : 0;
        withdrawal_income_yr = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
        tmpCalClosingCapital = (parseFloat(opening_capital) + parseFloat(net_profit)) - parseFloat(withdrawal_income_yr);

        this.formArray.controls[i].patchValue({
          closingCapital: parseInt(tmpCalClosingCapital) ? this.commaSeparator.currencySeparatorBD(tmpCalClosingCapital) : 0,
        });

        //calculate right side total capital and liabilties

        this.formArray.controls.forEach((element, index) => {
          if (index == i) {
            this.formArray.controls[i].patchValue({
              closingCapital: parseInt(element.value.closingCapital) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.closingCapital)) : 0,
            });

            if (formControlName === 'liabilities') {
              this.liabilities_showError[i] = false;
              this.formArray.controls[i].patchValue({
                liabilities: this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.liabilities)),
              });
            }

            closing_capital = element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : 0;
            liabilities = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
            tmpTotalCpLiabilities = parseFloat(closing_capital) + parseFloat(liabilities);

            this.formArray.controls[i].patchValue({
              totalCapitalandLiabilities: parseInt(tmpTotalCpLiabilities) ? this.commaSeparator.currencySeparatorBD(tmpTotalCpLiabilities) : 0
            });
          }
        });
      }
    });
  }

  // totalCapital_Liabilities_Calc(i) {
  //   // eqn : total capital and liabilities = closing capital + liabilities
  //   let closing_capital: any; let liabilities: any;
  //   this.formArray.controls.forEach((element, index) => {
  //     if (index == i) {
  //       closing_capital = element.value.closingCapital ? element.value.closingCapital : 0;
  //       liabilities = element.value.liabilities ? element.value.liabilities : 0;
  //       this.formArray.controls[i].patchValue({
  //         totalCapitalandLiabilities: parseFloat(closing_capital) + parseFloat(liabilities),
  //       });
  //     }
  //   });
  // }

  //#endregion

  getBusinessCategoryName(businessCategoryType: any) {
    if (businessCategoryType === 'REG_BUS_PROF') return 'Regular Business/Profession';
    else if (businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY') return 'Contract or Supply of Goods';
    else if (businessCategoryType === 'BSMT_REAL_EST_OR_LAND') return 'Real Estate or Land Development Business';
    else if (businessCategoryType === 'BSMT_IMPORT') return 'Import';
    else if (businessCategoryType === 'BSMT_EXP_OF_MAN') return 'Export of Manpower';
    else if (businessCategoryType === 'BSMT_EXP_US_53BB') return 'Export (u/s 53BB)';
    else if (businessCategoryType === 'BSMT_EXP_US_53BBBB') return 'Export (U/S 53BBBB)';
    else if (businessCategoryType === 'BSMT_EXP_CASH_SUB') return 'Export Cash Subsidy';
    else if (businessCategoryType === 'BSMT_C_F_AGENCY') return 'C & F Agency';
    else if (businessCategoryType === 'BSMT_SHIP_BUS') return 'Shipping Business';
    else if (businessCategoryType === 'BSMT_DSTR_OF_COMP') return 'Distributorship of Company';
    else if (businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER') return 'Agency of Foreign Buyer';
    else if (businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX') return 'Other Business Subject to Minimum Tax';
    else if (businessCategoryType === 'TOBACCO_BUS') return 'Tobacco Business';
    else if (businessCategoryType === 'TEA_RUB') return 'Product of Tea or Rubber';
    else if (businessCategoryType === 'EXEMPT_OR_REDUCED_SRO') return 'Income Subject to Presumptive or Reduced Tax Rate';
  }

  validateBusiness(): any {
    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if (element.value.businessCategoryType === 0) {
        this.businessType_showError[index] = true;
        successValidation = false;
      }
      //AgricultureType : Cultivation,production of tea or rubber, sugar beet
      if (element.value.businessCategoryType === 'REG_BUS_PROF' || element.value.businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY' || element.value.businessCategoryType === 'BSMT_REAL_EST_OR_LAND' || element.value.businessCategoryType === 'BSMT_IMPORT' || element.value.businessCategoryType === 'BSMT_EXP_OF_MAN' || element.value.businessCategoryType === 'BSMT_EXP_US_53BB' || element.value.businessCategoryType === 'BSMT_EXP_US_53BBBB'
        || element.value.businessCategoryType === 'BSMT_C_F_AGENCY' || element.value.businessCategoryType === 'BSMT_SHIP_BUS' || element.value.businessCategoryType === 'BSMT_DSTR_OF_COMP' || element.value.businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER' || element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' || element.value.businessCategoryType === 'TOBACCO_BUS' || element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO') {
        if (element.value.businessTypeName == '' || element.value.businessTypeName == null) {
          this.businessTypeName_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessName == '' || element.value.businessName == null) {
          this.businessName_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessAddress == '' || element.value.businessAddress == null) {
          this.BusinessAddress_showError[index] = true;
          successValidation = false;
        }
        if (element.value.salesTurnoverReceipts == '' || element.value.salesTurnoverReceipts == null) {
          this.salesTurnoverReceipt_showError[index] = true;
          successValidation = false;
        }
        if (element.value.grossProfit == '' || element.value.grossProfit == null) {
          this.grossProfit_showError[index] = true;
          successValidation = false;
        }

        if (element.value.generalAdminisSellingAndOther == '' || element.value.generalAdminisSellingAndOther == null) {
          this.generalAdminisSell_showError[index] = true;
          successValidation = false;
        }
        if ((element.value.businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY' || element.value.businessCategoryType === 'BSMT_REAL_EST_OR_LAND' || element.value.businessCategoryType === 'BSMT_IMPORT' || element.value.businessCategoryType === 'BSMT_EXP_OF_MAN' || element.value.businessCategoryType === 'BSMT_EXP_US_53BB' || element.value.businessCategoryType === 'BSMT_EXP_US_53BBBB' || element.value.businessCategoryType === 'BSMT_C_F_AGENCY' || element.value.businessCategoryType === 'BSMT_SHIP_BUS' || element.value.businessCategoryType === 'BSMT_DSTR_OF_COMP' || element.value.businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER' || element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX') && (element.value.taxToDeducted == '' || element.value.taxToDeducted == null)) {
          this.tds_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' && (element.value.releventSectionTDS == '' || element.value.releventSectionTDS == null)) {
          this.releventSectionTDS_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.sroNoReference == '' || element.value.sroNoReference == null)) {
          this.sroNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.year == '' || element.value.year == null)) {
          this.year_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.commonParticulars == '' || element.value.commonParticulars == null)) {
          this.particular_showError[index] = true;
          successValidation = false;
        }
        if (element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.taxApplicable == '' || element.value.taxApplicable == null)) {
          this.taxApplicable_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.cashInHandandAtBank == '' || element.value.cashInHandandAtBank == null)) {
          this.cashInHand_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.inventories == '' || element.value.inventories == null)) {
          this.inventories_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.fixedAssets == '' || element.value.fixedAssets == null)) {
          this.fixedAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.otherAssets == '' || element.value.otherAssets == null)) {
          this.otherAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.openingCapital == '' || element.value.openingCapital == null)) {
          this.openingCapital_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.withdrawalIncomeYear == '' || element.value.withdrawalIncomeYear == null)) {
          this.withdrawals_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.liabilities == '' || element.value.liabilities == null)) {
          this.liabilities_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.businessCategoryType === 'BSMT_EXP_CASH_SUB') {
        if (element.value.businessTypeName == '' || element.value.businessTypeName == null) {
          this.businessTypeName_showError[index] = true;
          successValidation = false;
        }
        if (element.value.commonParticulars == '' || element.value.commonParticulars == null) {
          this.particulars_showError[index] = true;
          successValidation = false;
        }
        if (element.value.netProfit_1 == '' || element.value.netProfit_1 == null || element.value.netProfit_1 == 0) {
          this.amountOfCashSubsidy_showError[index] = true;
          successValidation = false;
        }
        // if (element.value.netProfit_1 == '' || element.value.netProfit_1 == null || element.value.netProfit_1 == 0) {
        //   this.amountOfCashSubsidy_showError[index] = true;
        //   successValidation = false;
        // }
        if (element.value.taxToDeducted == '' || element.value.taxToDeducted == null) {
          this.tds_showError[index] = true;
          successValidation = false;
        }
      }

      if (element.value.businessCategoryType === 'TEA_RUB') {
        if (element.value.totalCultivationArea == '' || element.value.totalCultivationArea == null) {
          this.totalCulArea_showError[index] = true;
          successValidation = false;
        }
        if (element.value.commonParticulars == '' || element.value.commonParticulars == null) {
          this.particularOfProduces_showError[index] = true;
          successValidation = false;
        }
        if (element.value.salesTurnoverReceipts == '' || element.value.salesTurnoverReceipts == null || element.value.salesTurnoverReceipts == 0) {
          this.salesProceed_showError[index] = true;
          successValidation = false;
        }
        if (element.value.costOfProduction == '' || element.value.costOfProduction == null) {
          this.costOfProduction_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.cashInHandandAtBank == '' || element.value.cashInHandandAtBank == null)) {
          this.cashInHand_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.inventories == '' || element.value.inventories == null)) {
          this.inventories_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.fixedAssets == '' || element.value.fixedAssets == null)) {
          this.fixedAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.otherAssets == '' || element.value.otherAssets == null)) {
          this.otherAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.openingCapital == '' || element.value.openingCapital == null)) {
          this.openingCapital_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.withdrawalIncomeYear == '' || element.value.withdrawalIncomeYear == null)) {
          this.withdrawals_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC == '1' && (element.value.liabilities == '' || element.value.liabilities == null)) {
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
      if (element.value.businessCategoryType === 0 && !isFoundErrorIndex && this.businessType_showError[index]) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      // regular business start
      if ((element.value.businessCategoryType === 'REG_BUS_PROF' || element.value.businessCategoryType === 'TOBACCO_BUS') && element.value.isMaintainedBookOfAC === '0' && !isFoundErrorIndex && (this.businessTypeName_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index]
        || this.salesTurnoverReceipt_showError[index] || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if ((element.value.businessCategoryType === 'REG_BUS_PROF' || element.value.businessCategoryType === 'TOBACCO_BUS') && element.value.isMaintainedBookOfAC === '1' && !isFoundErrorIndex && (this.businessTypeName_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index]
        || this.salesTurnoverReceipt_showError[index] || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index] || this.cashInHand_showError[index] || this.inventories_showError[index] || this.fixedAsset_showError[index] || this.otherAsset_showError[index] || this.openingCapital_showError[index] || this.withdrawals_showError[index] || this.liabilities_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      // regular business ends
      // contract or supply of goods, real estate or land development business,Import,export to manpower,53BB,53BBBB start
      if ((element.value.businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY' || element.value.businessCategoryType === 'BSMT_REAL_EST_OR_LAND' || element.value.businessCategoryType === 'BSMT_IMPORT' || element.value.businessCategoryType === 'BSMT_EXP_OF_MAN' || element.value.businessCategoryType === 'BSMT_EXP_US_53BB' || element.value.businessCategoryType === 'BSMT_EXP_US_53BBBB' || element.value.businessCategoryType === 'BSMT_C_F_AGENCY' || element.value.businessCategoryType === 'BSMT_SHIP_BUS' || element.value.businessCategoryType === 'BSMT_DSTR_OF_COMP' || element.value.businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER' || element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' || element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO') && element.value.isMaintainedBookOfAC === '0' && !isFoundErrorIndex && ((element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' && this.releventSectionTDS_showError[index]) || (element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (this.sroNo_showError[index] || this.year_showError[index] || this.particular_showError[index] || this.taxApplicable_showError[index])) || this.businessTypeName_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index]
        || this.salesTurnoverReceipt_showError[index] || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if ((element.value.businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY' || element.value.businessCategoryType === 'BSMT_REAL_EST_OR_LAND' || element.value.businessCategoryType === 'BSMT_IMPORT' || element.value.businessCategoryType === 'BSMT_EXP_OF_MAN' || element.value.businessCategoryType === 'BSMT_EXP_US_53BB' || element.value.businessCategoryType === 'BSMT_EXP_US_53BBBB' || element.value.businessCategoryType === 'BSMT_C_F_AGENCY' || element.value.businessCategoryType === 'BSMT_SHIP_BUS' || element.value.businessCategoryType === 'BSMT_DSTR_OF_COMP' || element.value.businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER' || element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' || element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO') && element.value.isMaintainedBookOfAC === '1' && !isFoundErrorIndex && ((element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' && this.releventSectionTDS_showError[index]) || (element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (this.sroNo_showError[index] || this.year_showError[index] || this.particular_showError[index] || this.taxApplicable_showError[index])) || this.businessTypeName_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index]
        || this.salesTurnoverReceipt_showError[index] || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index] || this.tds_showError[index] || this.cashInHand_showError[index] || this.inventories_showError[index] || this.fixedAsset_showError[index] || this.otherAsset_showError[index] || this.openingCapital_showError[index] || this.withdrawals_showError[index] || this.liabilities_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      // contract or supply of goods, real estate or land development business,import,export to manpower,53BB,53BBBB ends
      //export cash subsidy starts
      if (element.value.businessCategoryType === 'BSMT_EXP_CASH_SUB' && !isFoundErrorIndex && (this.businessTypeName_showError[index] || this.particulars_showError[index] || this.amountOfCashSubsidy_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      //export cash subsidy end
      if (element.value.businessCategoryType === 'TEA_RUB' && element.value.isMaintainedBookOfAC === '0' && !isFoundErrorIndex && (this.totalCulArea_showError[index] || this.particularOfProduces_showError[index] || this.salesProceed_showError[index] || this.costOfProduction_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.businessCategoryType === 'TEA_RUB' && element.value.isMaintainedBookOfAC === '1' && !isFoundErrorIndex && (this.totalCulArea_showError[index] || this.particularOfProduces_showError[index] || this.salesProceed_showError[index] || this.costOfProduction_showError[index]
        || this.cashInHand_showError[index] || this.inventories_showError[index] || this.fixedAsset_showError[index] || this.otherAsset_showError[index] || this.openingCapital_showError[index] || this.withdrawals_showError[index] || this.liabilities_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

    })

    return errorIndex;
  }


  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }

  submittedData() {
    // let validateBusiness : any, inputElement:any;
    // validateBusiness = this.businessValidationService.businessValidate(this.formArray);
    // if(!validateBusiness.validate)
    // {
    //   this.isVisibleForm = validateBusiness.indexNo;
    //   return;
    // }

    let validateBusiness: any;
    validateBusiness = this.validateBusiness();
    if (!validateBusiness.validate) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
      this.isVisibleForm = validateBusiness.indexNo;
      return;
    }

    let requestJson = [];
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach(element => {
        let sroYr = element.value.year ? moment(element.value.year, 'YYYY') : '';
        let obj = {
          "id": element.value.id ? element.value.id : null,
          "businessCatg": element.value.businessCategoryType ? element.value.businessCategoryType : null,
          "businessTypeName": element.value.businessTypeName ? element.value.businessTypeName : null,
          "businessNm": element.value.businessName ? element.value.businessName : null,
          "businessAddress": element.value.businessAddress ? element.value.businessAddress : null,
          "salesTurnReceipts": element.value.salesTurnoverReceipts ? this.commaSeparator.extractComma(element.value.salesTurnoverReceipts) : null,
          "grossProfit": element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : null,
          "gasoExpenses": element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : null,
          "netProfit": element.value.netProfit_1 ? this.commaSeparator.extractComma(element.value.netProfit_1) : 0,
          "teaRubberCultivationArea": element.value.totalCultivationArea ? element.value.totalCultivationArea : 0,
          "unitOfTotalCulArea": element.value.unitOfTotalCulArea ? element.value.unitOfTotalCulArea : null,
          "commonParticulars": element.value.commonParticulars ? element.value.commonParticulars : '',
          "taxableIncm": element.value.taxableIncome ? this.commaSeparator.extractComma(element.value.taxableIncome) : 0,
          // "cashSubParticulars": element.value.cs_particulars ? element.value.cs_particulars : null,
          // "cashSubAmt": element.value.amountOfCashSubsidy ? element.value.amountOfCashSubsidy : null,
          "tds": element.value.taxToDeducted ? this.commaSeparator.extractComma(element.value.taxToDeducted) : 0,
          "tdsRelevant": element.value.releventSectionTDS ? this.commaSeparator.extractComma(element.value.releventSectionTDS) : null,
          "cashHandBank": element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : null,
          "inventories": element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : null,
          "fixedAssets": element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : null,
          "otherAssets": element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : null,
          "totalAssets": element.value.totalAssets ? this.commaSeparator.extractComma(element.value.totalAssets) : null,
          "openingCp": element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : null,
          // "netProfit": element.value.netProfit_2 ? element.value.netProfit_2 : null,
          "withdrawalsIncmYr": element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : null,
          "closingCp": element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : null,
          "liabilities": element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : null,
          "totalCpLb": element.value.totalCapitalandLiabilities ? this.commaSeparator.extractComma(element.value.totalCapitalandLiabilities) : null,
          "teaRubberSales": element.value.sales ? this.commaSeparator.extractComma(element.value.sales) : null,
          "teaRubberProdCost": element.value.costOfProduction ? this.commaSeparator.extractComma(element.value.costOfProduction) : null,
          "teaRubberOtherDeduct": element.value.otherAllowableDeduction ? this.commaSeparator.extractComma(element.value.otherAllowableDeduction) : null,
          "teaRubberNetIncm": element.value.netIncome ? this.commaSeparator.extractComma(element.value.netIncome) : null,
          "teaRubberAgrIncm": element.value.agriculturalIncome ? this.commaSeparator.extractComma(element.value.agriculturalIncome) : null,
          "teaRubberIncmBusProf": element.value.incomeFromBusinessOrProfession ? this.commaSeparator.extractComma(element.value.incomeFromBusinessOrProfession) : null,
          "sroNoRef": element.value.sroNoReference ? element.value.sroNoReference : null,
          "sroYear": sroYr ? this.datepipe.transform(sroYr, 'yyyy') : '',
          // "sroParticular": element.value.particular ? element.value.particular : null,
          "taxExemptedIncm": element.value.taxExemptedIncome ? this.commaSeparator.extractComma(element.value.taxExemptedIncome) : 0,
          "taxAppl": element.value.taxApplicable ? this.commaSeparator.extractComma(element.value.taxApplicable) : 0,
          "maintainBooksOfAccounts": element.value.isMaintainedBookOfAC === '1' ? true : false,
          "tin": this.userTin ? this.userTin : null,
          "assessmentYr": "2021-2022",
          "incomeParticularSourceId": element.value.incomeParticularSourceId ? element.value.incomeParticularSourceId : null,
        }
        requestJson.push(obj);
      });
      this.apiService.post(this.serviceUrl + 'api/user-panel/income-head/business', requestJson)
        .subscribe(result => {
          // console.log(result);
          if (result === 'S' && !this.isSaveDraft) {
            this.toastr.success("Data Saved Successfully", '', {
              timeOut: 1000,
            });
            this.headsOfIncome.forEach((Value, i) => {
              if (Value['link'] == '/user-panel/business-or-profession') {
                if (i + 1 > this.lengthOfheads - 1) {
                  this.router.navigate([this.selectedNavbar[2]['link']]);
                }
                if (i + 1 <= this.lengthOfheads - 1) {
                  this.router.navigate([this.headsOfIncome[i + 1]['link']]);
                }
              }
            });
          }
          // if tea and rubber already exists in agriculture
          if (result === 'D' && !this.isSaveDraft) {
            this.toastr.warning('Save Failed! This Tea and Rubber already exists in agriculture.', '', {
              timeOut: 3000,
            });
            return;
          }

          if (result === 'S' && this.isSaveDraft == true) {
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
          // if tea and rubber already exists in agriculture
          if (result === 'D' && this.isSaveDraft == true) {
            this.toastr.warning('Draft Failed! This Tea and Rubber already exists in agriculture.', '', {
              timeOut: 3000,
            });
            this.isSaveDraft = false;
            return;
          }
        },
          error => {
       //     console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
    //post end
  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/business-or-profession') {
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
    this.rReturnSpinner.start();
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_submission')
        .subscribe(result => {
          if (result.replyMessage != null) {
            this.rReturnSpinner.stop();
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
            this.rReturnSpinner.stop();
            this.isShow = true;
            resolve();
          }
        },
          error => {
            reject();
            this.rReturnSpinner.stop();
       //     console.log(error['error'].errorMessage);
          });
    });
  }
}
