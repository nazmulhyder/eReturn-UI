import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import { DynamicGrid } from './grid.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../custom-services/ApiService';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommaSeparatorService } from '../../service/comma-separator.service';


@Component({
  selector: 'app-income-from-other-sources',
  templateUrl: './income-from-other-sources.component.html',
  styleUrls: ['./income-from-other-sources.component.css']
})
export class IncomeFromOtherSourcesComponent implements OnInit {

  isSaveDraft: boolean = false;
  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};

  navActive = {};
  item: any;
  headsOfIncome = [];
  lengthOfheads: any;

  //#region Tooltip Text Section

  html: any = `<span class="btn-block well-sm" style="margin-left: 20px">Tooltip text will show here!!!</span>`;

  incomeTypeTooltip = `<span class="btn-block well-sm text-left">
  Select the source of your income in this head from the dropdown list.
  </span>`;

  bankNameTooltip = `<span class="btn-block well-sm text-left">
  The name of the bank/FI from which you received or earned interest/profit.
  </span>`;

  accountNoTooltip = `<span class="btn-block well-sm text-left">
  The account number against which you received or earned interest/profit.
  </span>`;

  grossAmountTooltip = `<span class="btn-block well-sm text-left">
  The amount of interest before source tax. This can be calculated as: net amount after source tax + amount of source tax.
  </span>`;

  tdsTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted at source against your interest/profit.
  </span>`;

  relatedFeesTooltip = `<span class="btn-block well-sm text-left">
  The fees & charge you incurred (if any) for the realization of interest/profit.
  </span>`;

  dividendCompanyTooltip = `<span class="btn-block well-sm text-left">
  The name of the company that paid you the dividend.
  </span>`;

  grossDividendAmountTooltip = `<span class="btn-block well-sm text-left">
  The amount of dividend before the deduction of tax at source. It is the net dividend you received after source tax plus tax deducted on dividend.
  </span>`;

  dividendRelatedExpenseTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for the realization of dividend.
  </span>`;

  dividendTDSTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted at source against your dividend income.
  </span>`;

  dividendOthersCompanyTooltip = `<span class="btn-block well-sm text-left">
  The name of the company that paid you the dividend.
  </span>`;

  dividentOthersGrossDividendAmtTooltip = `<span class="btn-block well-sm text-left">
  The amount of dividend before the deduction of tax at source. It is the net dividend you received after source tax plus tax deducted on dividend.
  </span>`;

  dividendOthersRelatedExpenseTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for the realization of dividend.
  </span>`;

  dividendOthersTDSTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted at source against your dividend income.
  </span>`;

  nameoftheMutualorUnitFundTooltip = `<span class="btn-block well-sm text-left">
  The name of the fund from which you received income.
  </span>`;

  mutualFundGrossReceiptTooltip = `<span class="btn-block well-sm text-left">
  The amount of income from mutual fund/unit fund before the deduction of tax at source. It is the net amount you received after source tax, plus tax deducted at source on the income.
  </span>`;

  mutualFundRelatedExpenseTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for the realization of income.
  </span>`;

  mutualFundTDSTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted at source against your income from mutual fund/unit fund.
  </span>`;

  royaltiesNameOfClientTooltip = `<span class="btn-block well-sm text-left">
  Name of the party from whom you received payments for royalties/ consultancy services.
  </span>`;

  royaltiesAgreementNoTooltip = `<span class="btn-block well-sm text-left">
  Agreement number mentioned in your agreement (if any) with the client.
  </span>`;

  royaltiesDateTooltip = `<span class="btn-block well-sm text-left">
  The date of signing agreement (if any) with the client.
  </span>`;

  royaltiesGrossPaymentTooltip = `<span class="btn-block well-sm text-left">
  The fees of Royalties/Consultancy Service before the deduction of tax at source. It is the net amount of fee you received after source tax, plus tax deducted at source on the fee.
  </span>`;

  royaltiesRelatedExpenseTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for earning the fee.
  </span>`;

  royaltiesTDSTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted by your client at the time of payment of fees for royalties/ consultancy services.
  </span>`;

  consultancyNameOfClientTooltip = `<span class="btn-block well-sm text-left">
  Name of the party from whom you received payments against consultancy services.
  </span>`;

  consultancyAgreementNoTooltip = `<span class="btn-block well-sm text-left">
  Agreement number mentioned in your agreement (if any) with the client.
  </span>`;

  consultancyDateTooltip = `<span class="btn-block well-sm text-left">
  The date of signing agreement (if any) with the client.
  </span>`;

  consultancyGrossTooltip = `<span class="btn-block well-sm text-left">
  The gross amount of fees for consultancy services (before the deduction of tax at source) that you earned. It is the net amount of fee you received after source tax, plus tax deducted at source on the fee.
  </span>`;

  consultancyRelatedExpenseTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for earning the fee.
  </span>`;

  consultancyTDSTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted by your client at the time of payment of fees for consultancy services.
  </span>`;

  wppfCompanyTooltip = `<span class="btn-block well-sm text-left">
  Name the company from which you received payment from WPPF .
  </span>`;

  wppfPaymentDateTooltip = `<span class="btn-block well-sm text-left">
  The date in which you received payment from WPPF.
  </span>`;

  wppfRefNoTooltip = `<span class="btn-block well-sm text-left">
  The reference number mentioned in the certificate or letter (if any) issued by the company in respect of WPPF payment.
  </span>`;

  wppfGrossAmtTooltip = `<span class="btn-block well-sm text-left">
  The gross amount of payment from WPPF before the deduction of tax at source. It is the net amount of WPPF payment after source tax, plus tax deducted at source on WPPF payment.
  </span>`;

  lotteryWinningTypeTooltip = `<span class="btn-block well-sm text-left">
  The name of income source (such as Lottery, Puzzle, Game, Gambling, Prize Bond etc.)
  </span>`;

  lotteryPaymentAuthorityTooltip = `<span class="btn-block well-sm text-left">
  The name of the paying authority.
  </span>`;

  lotteryRefNoTooltip = `<span class="btn-block well-sm text-left">
  The serial number or any other unique identifiable number that relates to your income.
  </span>`;

  lotteryGrossAmtTooltip = `<span class="btn-block well-sm text-left">
  The gross value of winning before the deduction of tax at source.
  </span>`;

  lotteryTDSTooltip = `<span class="btn-block well-sm text-left">
  The amount of tax deducted from you at the time of payment of the winning amount.
  </span>`;

  anyIncomeParticularsTooltip = `<span class="btn-block well-sm text-left">
  The source of income with brief description.
  </span>`;

  anyIncomePaymentAuthorityTooltip = `<span class="btn-block well-sm text-left">
  Name of the authority that made the payment to you.
  </span>`;

  anyIncomeDateTooltip = `<span class="btn-block well-sm text-left">
  The date in which you received the payment.
  </span>`;

  anyIncomeGrossAmtTooltip = `<span class="btn-block well-sm text-left">
  The gross amount (before the deduction of tax at source) that you earned. It is the net amount you received after source tax + source tax.
  </span>`;

  anyIncomeRelatedExpenseTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for earning the fee.
  </span>`;

  sroParticularsTooltip = `<span class="btn-block well-sm text-left">
  The source of income with brief description.
  </span>`;

  sroPaymentAuthorityTooltip = `<span class="btn-block well-sm text-left">
  Name of the authority that made the payment to you.
  </span>`;

  sroRefNoTooltip = `<span class="btn-block well-sm text-left">
  The reference number mentioned in the certificate or letter (if any) issued by the relevant authority/party.
  </span>`;

  sroDateTooltip = `<span class="btn-block well-sm text-left">
  The date of issue of the aforesaid certificate or letter (if any) .
  </span>`;

  sroGrossAmtTooltip = `<span class="btn-block well-sm text-left">
  The gross amount (before the deduction of tax at source) that you earned. It is the net amount you received after source tax + source tax.
  </span>`;

  sroRelatedExpensesTooltip = `<span class="btn-block well-sm text-left">
  Allowable expenses incurred (if any) for earning the fee.
  </span>`;

  sroNetIncomeTooltip = `<span class="btn-block well-sm text-left">
  Calculated by deducting Related Expenses (if any) from Gross Amount.
  </span>`;

  sroNoTooltip = `<span class="btn-block well-sm text-left">
  The number of SRO under which you income from this source enjoys special tax treatment.
  </span>`;

  sroYearTooltip = `<span class="btn-block well-sm text-left">
  The year which the SRO is issued.
  </span>`;

  particularOfSROTooltip = `<span class="btn-block well-sm text-left">
  Any necessary description of SRO (such as its subject matter).
  </span>`;

  sroExemptedIncomeTooltip = `<span class="btn-block well-sm text-left">
  The part of net income is exempted from tax.
  </span>`;

  sroTaxableIncomeTooltip = `<span class="btn-block well-sm text-left">
  The amount of income that is taxable.
  </span>`;

  sroApplicableTaxTooltip = `<span class="btn-block well-sm text-left">
  The tax rate here as mentioned in SRO. For example, if your income enjoyed a reduced tax rate of 10%, enter the rate 10% in this box.
  </span>`;



  //#endregion

  formArray: FormArray;
  isVisibleForm: any;

  incomeTypeName = [];

  interestorProfitArray = [];
  newInterestorProfit: any = {};
  isInterestorProfitDeleteActionShow: boolean;

  dividendArray = [];
  newDividend: any = {};
  isDividendDeleteActionShow: boolean;

  dividendOthersArray = [];
  newDividendOthers: any = {};
  isDividendOthersDeleteActionShow: boolean;

  mutualorUnitFundArray = [];
  newMutualorUnitFund: any = {};
  isMutualorUnitFundDeleteActionShow: boolean;

  royaltiesArray = [];
  newRoyalties: any = {};
  isRoyaltiesDeleteActionShow: boolean;

  consultancyServiceArray = [];
  newConsultancyService: any = {};
  isConsultancyServiceDeleteActionShow: boolean;

  paymentFromWPPFArray = [];
  newPaymentFromWPPFArray: any = {};
  isPaymentFromWPPFArrayDeleteActionShow: boolean;

  lotteryPuzzleArray = [];
  newLotteryPuzzle: any = {};
  isLotteryPuzzleDeleteActionShow: boolean;

  anyOtherIncomeArray = [];
  newAnyOtherIncome: any = {};
  isAnyOtherIncomeDeleteActionShow: boolean;

  modalRef: BsModalRef;
  isVisibleTab = [];
  isDisableAddSalBtn: boolean = true;

  storeDropdownValue = [];

  minDate: any;
  maxDate: any;
  minYear: any;
  maxYear: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  requestData: any;
  userTin: any;

  interestorProfitData: any;
  dividendData: any;
  dividendOthersData: any;
  mutualorUnitFundData: any;
  royaltiesData: any;
  consultancyServiceData: any;
  paymentFromWPPFData: any;
  lotteryPuzzleData: any;
  anyOtherIncomeData: any;

  incomeFromOtherSourcesData: any;
  group: FormGroup;

  sroArray = [];

  requestIncomeHeadGetData: any;
  requestNavbarGetData: any;

  formGroup: FormGroup;
  additionalInformationForm: FormGroup;

  taxExemptedIncome = [];
  isTaxExemptedReadonly = [false];
  taxableIncome = [];

  taxExemptedData: any;
  isDividentFromListedComInTaxExempted: boolean = false;
  isIncomeFromMutualInTaxExempted: boolean = false;
  isShow: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private headService: HeadsOfIncomeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private mainNavbarList: mainNavbarListService,
    private spinner: NgxUiLoaderService,
    private commaSeparator: CommaSeparatorService
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

  navActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.navActive = x;
  }

  insertFormGroupToArray() {
    this.group = new FormGroup({
      id: new FormControl(0),
      incomeType: new FormControl(0),
      incomeTypeName: new FormControl(""),

      // bankName: new FormControl(),
      // accountNo: new FormControl(),
      // grossAmount: new FormControl(),
      // sourceTaxDeducted: new FormControl(),
      // relatedFees: new FormControl(),
      netIncome: new FormControl(),
      taxExemptedIncome: new FormControl(),
      serialOfType: new FormControl(),

      // nameoftheCompany: new FormControl(),
      // nameoftheBank: new FormControl(),
      // grossDividendAmount: new FormControl(),
      // relatedExpenses: new FormControl(),
      // netIncome2: new FormControl(),
      // taxExemptedIncome: new FormControl(),

      // nameoftheMutualorUnitFund: new FormControl(),
      // grossReceipt: new FormControl(),
      // relatedExpenses2: new FormControl(),
      // netIncome3: new FormControl(),
      // taxExemptedIncome2: new FormControl(),

      // nameoftheClient: new FormControl(),
      // agreementNo: new FormControl(),
      // date: new FormControl(),
      // grossPaymentAmount: new FormControl(),
      // relatedExpenses3: new FormControl(),
      // netIncome4: new FormControl(),
      // taxExemptedIncome3: new FormControl(),

      // nameoftheClient2: new FormControl(),
      // agreementNo2: new FormControl(),
      // date2: new FormControl(),
      // grossPaymentAmount2: new FormControl(),
      // relatedExpenses4: new FormControl(),
      // netIncome5: new FormControl(),
      // taxExemptedIncome4: new FormControl(),

      // typeofWinning: new FormControl(),
      // paymentAuthority: new FormControl(),
      // nameofDeveloper: new FormControl(),
      // referenceNo: new FormControl(),
      // date3: new FormControl(),
      // grossWinningAmount: new FormControl(),
      // netIncome6: new FormControl(),
      // taxDeductedorCollected: new FormControl(),

      // particulars: new FormControl(),
      // paymentAuthority2: new FormControl(),
      // referenceNo2: new FormControl(),
      // grossAmountReceived: new FormControl(),
      // date4: new FormControl(),
      // netIncome7: new FormControl(),

      // particulars2: new FormControl(),
      // paymentAuthority3: new FormControl(),
      // referenceNo3: new FormControl(),
      // date5: new FormControl(),
      // grossAmountReceived2: new FormControl(),
      // relatedExpenses5: new FormControl(),
      // netIncome8: new FormControl(),
      // sroNo: new FormControl(),
      // year: new FormControl(),
      // particularofSro: new FormControl(),
      // incomeExemptedfromTax: new FormControl(),
      // applicableTaxasperSro: new FormControl(),

      particulars: new FormControl(),
      paymentAuthority: new FormControl(),
      referenceNo: new FormControl(),
      date: new FormControl(),
      grossAmountReceived: new FormControl(),
      relatedExpenses: new FormControl(),
      netIncomeSro: new FormControl(),
      sroNo: new FormControl(),
      year: new FormControl(),
      particularofSro: new FormControl(),
      taxableIncome: new FormControl(),
      incomeExemptedfromTax: new FormControl(0),
      applicableTaxasperSro: new FormControl(),
      detailSerialNo: new FormControl(),

    });
    this.formArray.push(this.group);
    this.selectedIncome(this.formArray.length - 1);
  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.isVisibleForm = 0;
    this.navActiveSelect("7");
    // this.insertFormGroupToArray();
    this.getHeadsOfIncome();
    this.getMainNavbar();
    this.mainNavActiveSelect('2');
    this.isVisibleTab[0] = true;

    this.minDate = new Date(2020, 6, 1);
    this.maxDate = new Date(2021, 5, 30);

    this.minYear = new Date(1972, 0, 1);
    this.maxYear = new Date();
    this.maxYear.setDate(this.maxYear.getDate());

    this.userTin = localStorage.getItem('tin');

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion

    this.getIncomeFromOtherSourcesData();

    //#region get tax exempted data
    this.getTaxExemptedIncomeData();
    //#endregion
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
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Income from Other Sources');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }

  getIncomeFromOtherSourcesData() {
    let requestGetData: any;
    requestGetData =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-ifos-data')
      .subscribe(result => {
        if (result.length > 0) {
          //console.log('get ifos data', result);
          this.incomeFromOtherSourcesData = result;

          let particularsSRO: any;
          let paymentAuthoritySRO: any;
          let referenceNoSRO: any;
          let dateSRO: any;
          let grossAmountReceivedSRO: any;
          let relatedExpensesSRO: any;
          let sroNo: any;
          let sroYear: any;
          let particularofSRO: any;
          let taxableIncome: any;
          let detailSerialNoSRO: any;

          this.incomeFromOtherSourcesData.forEach((element, i) => {
            this.isVisibleTab[i] = false;
            this.isDisableAddSalBtn = false;

            if (element.ifosTypeName === "interest_profit_bank_fi") {
              this.isInterestorProfitDeleteActionShow = false;
              this.interestorProfitArray = [];
              let nestedInterestorProfitArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  bankName: nesElement.name ? nesElement.name : '',
                  accountNo: nesElement.accAgRefNo ? nesElement.accAgRefNo : '',
                  grossAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  sourceTaxDeducted: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  relatedFees: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedInterestorProfitArray.push(obj);
                if (i > 0) {
                  this.isInterestorProfitDeleteActionShow = true;
                }
              });
              this.interestorProfitArray = nestedInterestorProfitArray;
              this.initialize_interest_profit_bank_fi_validation();
            }

            if (element.ifosTypeName === "dividend_from_listed_company") {
              this.isDividendDeleteActionShow = false;
              this.dividendArray = [];
              let nestedDividendArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  nameoftheCompany: nesElement.name ? nesElement.name : '',
                  grossDividendAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  relatedExpenses: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  sourceTaxDeducted: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedDividendArray.push(obj);
                if (i > 0) {
                  this.isDividendDeleteActionShow = true;
                }
              });
              this.dividendArray = nestedDividendArray;
              this.initialize_dividend_from_listed_company_validation();
            }

            if (element.ifosTypeName === "dividend_others") {
              this.isDividendOthersDeleteActionShow = false;
              this.dividendOthersArray = [];
              let nestedDividendOthersArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  nameoftheCompany: nesElement.name ? nesElement.name : '',
                  grossDividendAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  relatedExpenses: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  sourceTaxDeducted: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedDividendOthersArray.push(obj);
                if (i > 0) {
                  this.isDividendOthersDeleteActionShow = true;
                }
              });
              this.dividendOthersArray = nestedDividendOthersArray;
              this.initialize_dividend_others_validation();
            }

            if (element.ifosTypeName === "income_from_mutual_unit_fund") {
              this.isMutualorUnitFundDeleteActionShow = false;
              this.mutualorUnitFundArray = [];
              let nestedMutualorUnitFundArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  nameoftheMutualorUnitFund: nesElement.name ? nesElement.name : '',
                  grossReceipt: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  relatedExpenses: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  sourceTaxDeducted: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedMutualorUnitFundArray.push(obj);
                if (i > 0) {
                  this.isMutualorUnitFundDeleteActionShow = true;
                }
              });
              this.mutualorUnitFundArray = nestedMutualorUnitFundArray;
              this.initialize_income_from_mutual_unit_fund_validation();
            }

            if (element.ifosTypeName === "royalties") {
              this.isRoyaltiesDeleteActionShow = false;
              this.royaltiesArray = [];
              let nestedRoyaltiesArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  nameoftheClient: nesElement.name ? nesElement.name : '',
                  agreementNo: nesElement.accAgRefNo ? nesElement.accAgRefNo : '',
                  date: nesElement.dateOfIssue ? nesElement.dateOfIssue : '',
                  grossPaymentAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  relatedExpenses: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  taxDeductedorCollected: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedRoyaltiesArray.push(obj);
                if (i > 0) {
                  this.isRoyaltiesDeleteActionShow = true;
                }
              });
              this.royaltiesArray = nestedRoyaltiesArray;
              this.initialize_royalties_validation();
            }

            if (element.ifosTypeName === "consultancy_service") {
              this.isConsultancyServiceDeleteActionShow = false;
              this.consultancyServiceArray = [];
              let nestedConsultancyServiceArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  nameoftheClient: nesElement.name ? nesElement.name : '',
                  agreementNo: nesElement.accAgRefNo ? nesElement.accAgRefNo : '',
                  date: nesElement.dateOfIssue ? nesElement.dateOfIssue : '',
                  grossPaymentAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  relatedExpenses: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  taxDeductedorCollected: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedConsultancyServiceArray.push(obj);
                if (i > 0) {
                  this.isConsultancyServiceDeleteActionShow = true;
                }
              });
              this.consultancyServiceArray = nestedConsultancyServiceArray;
              this.initialize_consultancy_service_validation();
            }

            if (element.ifosTypeName === "payment_from_wppf") {
              this.isPaymentFromWPPFArrayDeleteActionShow = false;
              this.paymentFromWPPFArray = [];
              let nestedPaymentFromWPPFArrayArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  nameoftheCompany: nesElement.name ? nesElement.name : '',
                  referenceNo: nesElement.accAgRefNo ? nesElement.accAgRefNo : '',
                  date: nesElement.dateOfIssue ? nesElement.dateOfIssue : '',
                  grossAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedPaymentFromWPPFArrayArray.push(obj);
                if (i > 0) {
                  this.isPaymentFromWPPFArrayDeleteActionShow = true;
                }
              });
              this.paymentFromWPPFArray = nestedPaymentFromWPPFArrayArray;
              this.initialize_payment_from_wppf_validation();
            }

            if (element.ifosTypeName === "lottery_puzzle_game__gambling_prize_bond") {
              this.isLotteryPuzzleDeleteActionShow = false;
              this.lotteryPuzzleArray = [];
              let nestedlotteryPuzzleArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  typeofWinning: nesElement.name ? nesElement.name : '',
                  paymentAuthority: nesElement.paymentAuthority ? nesElement.paymentAuthority : '',
                  referenceNo: nesElement.accAgRefNo ? nesElement.accAgRefNo : '',
                  grossWinningAmount: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  taxDeductedorCollected: nesElement.deductedTax ? this.commaSeparator.currencySeparatorBD(nesElement.deductedTax) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedlotteryPuzzleArray.push(obj);
                if (i > 0) {
                  this.isLotteryPuzzleDeleteActionShow = true;
                }
              });
              this.lotteryPuzzleArray = nestedlotteryPuzzleArray;
              this.initialize_lottery_puzzle_game__gambling_prize_bond_validation();
            }

            if (element.ifosTypeName === "any_other_income") {
              this.isAnyOtherIncomeDeleteActionShow = false;
              this.anyOtherIncomeArray = [];
              let nestedanyOtherIncomeArray = [];

              element.ifosDetailDtos.forEach((nesElement, i) => {
                let obj = {
                  particulars: nesElement.name ? nesElement.name : '',
                  paymentAuthority: nesElement.paymentAuthority ? nesElement.paymentAuthority : '',
                  date: nesElement.dateOfIssue ? nesElement.dateOfIssue : '',
                  grossAmountReceived: nesElement.gross ? this.commaSeparator.currencySeparatorBD(nesElement.gross) : 0,
                  relatedExpenses: nesElement.expense ? this.commaSeparator.currencySeparatorBD(nesElement.expense) : 0,
                  detailSerialNo: nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0
                }
                nestedanyOtherIncomeArray.push(obj);
                if (i > 0) {
                  this.isAnyOtherIncomeDeleteActionShow = true;
                }
              });
              this.anyOtherIncomeArray = nestedanyOtherIncomeArray;
              this.initialize_any_other_income_validation();
            }

            if (element.ifosTypeName.substring(0, 30) === "income_exempted_reduced_by_sro") {

              // debugger;
              element.ifosDetailDtos.forEach((nesElement, i) => {
                particularsSRO = nesElement.name ? nesElement.name : '';
                paymentAuthoritySRO = nesElement.paymentAuthority ? nesElement.paymentAuthority : '';
                referenceNoSRO = nesElement.accAgRefNo ? nesElement.accAgRefNo : '';
                dateSRO = nesElement.issueDate ? nesElement.issueDate : '';
                grossAmountReceivedSRO = nesElement.gross ? Math.round(nesElement.gross) : 0;
                relatedExpensesSRO = nesElement.expense ? Math.round(nesElement.expense) : 0;
                sroNo = nesElement.sroNo ? nesElement.sroNo : '';
                sroYear = nesElement.year ? nesElement.year : '';
                particularofSRO = nesElement.particularSro ? nesElement.particularSro : '';
                taxableIncome = nesElement.taxableIncome ? nesElement.taxableIncome : 0;
                detailSerialNoSRO = nesElement.detailSerialNo ? Math.round(nesElement.detailSerialNo) : 0;

              });

            }

            this.group = new FormGroup({
              id: new FormControl(element.id),
              incomeType: new FormControl(element.ifosTypeName.substring(0, 30) === "income_exempted_reduced_by_sro" ? element.ifosTypeName.substring(0, 30) : element.ifosTypeName),
              netIncome: new FormControl(element.taxable ? this.commaSeparator.currencySeparatorBD(element.taxable) : 0),
              taxExemptedIncome: new FormControl(element.exempted ? this.commaSeparator.currencySeparatorBD(element.exempted) : 0),
              serialOfType: new FormControl(element.serialOfType),
              applicableTaxasperSro: new FormControl(element.applicableTaxSRO ? this.commaSeparator.currencySeparatorBD(element.applicableTaxSRO) : 0),

              particulars: new FormControl(particularsSRO ? particularsSRO : ''),
              paymentAuthority: new FormControl(paymentAuthoritySRO ? paymentAuthoritySRO : ''),
              referenceNo: new FormControl(referenceNoSRO ? referenceNoSRO : ''),
              date: new FormControl(dateSRO ? dateSRO : ''),
              grossAmountReceived: new FormControl(grossAmountReceivedSRO ? this.commaSeparator.currencySeparatorBD(grossAmountReceivedSRO) : ''),
              relatedExpenses: new FormControl(relatedExpensesSRO ? this.commaSeparator.currencySeparatorBD(relatedExpensesSRO) : ''),
              netIncomeSro: new FormControl(element.taxable ? this.commaSeparator.currencySeparatorBD(element.taxable) : 0),
              sroNo: new FormControl(sroNo ? sroNo : ''),
              year: new FormControl(sroYear ? sroYear : ''),
              particularofSro: new FormControl(particularofSRO ? particularofSRO : ''),
              taxableIncome: new FormControl(taxableIncome ? this.commaSeparator.currencySeparatorBD(taxableIncome) : 0),
              incomeExemptedfromTax: new FormControl(element.exempted ? this.commaSeparator.currencySeparatorBD(element.exempted) : 0),
              detailSerialNo: new FormControl(detailSerialNoSRO ? detailSerialNoSRO : ''),
            })

            this.storeDropdownValue[i] = element.ifosTypeName;
            this.formArray.push(this.group);
            this.incomeTypeName[i] = this.getIIFOSTypeName(element.ifosTypeName);
            this.selectedIncome(this.formArray.length - 1);
          });

          this.spinner.stop();
        }

        else {
          this.isVisibleForm = 0;
          this.navActiveSelect("7");
          this.insertFormGroupToArray();
          this.getHeadsOfIncome();
          this.getMainNavbar();
          this.mainNavActiveSelect('2');
          this.isVisibleTab[0] = true;

          this.maxDate = new Date();
          this.maxDate.setDate(this.maxDate.getDate());

          this.minYear = new Date(1972, 0, 1);
          this.maxYear = new Date();
          this.maxYear.setDate(this.maxYear.getDate());

          this.userTin = localStorage.getItem('tin');
          this.spinner.stop();
        }
      },
        error => {
          this.spinner.stop();
        //  console.log(error['error'].errorMessage);
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
      //  console.log('tax exempted data on salary page', this.taxExemptedData);
        this.taxExemptedData.forEach((element, index) => {
          if (element.TEI_TYPE === "other_exemption_under_sixth_schedule_part_a") {
          //  debugger;
            //interest on gpf
            if (element.TEI_PARAGRAPH_NO === '11A') {
              this.isDividentFromListedComInTaxExempted = true;
            }
            //pension
            if (element.TEI_PARAGRAPH_NO === '22A') {
              this.isIncomeFromMutualInTaxExempted = true;
            }
          }
        });
      })
  }

  getIIFOSTypeName(iifosType: String) {
    if (iifosType == 'interest_profit_bank_fi') return 'Interest/Profit (Bank & FI)';
    else if (iifosType == 'dividend_from_listed_company') return 'Dividend (From Listed Company)';
    else if (iifosType == 'dividend_others') return 'Dividend (Other than Listed Company & Mutual/Unit Fund)';
    else if (iifosType == 'income_from_mutual_unit_fund') return 'Income from Mutual/Unit Fund';
    else if (iifosType == 'royalties') return 'Royalties';
    else if (iifosType == 'consultancy_service') return 'Consultancy Service';
    else if (iifosType == 'payment_from_wppf') return 'Payment from WPPF';
    else if (iifosType == 'lottery_puzzle_game__gambling_prize_bond') return 'Lottery, Puzzle, Game, Gambling, Prize Bond';
    else if (iifosType == 'any_other_income') return 'Any Other Income';
    else if (iifosType.substring(0, 30) == 'income_exempted_reduced_by_sro') return 'Income Subject to Reduced Tax Rate';
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }

  checkDropdownDuplication(event, i) {
    // debugger;
    let status: boolean = false;
    this.storeDropdownValue.forEach(element => {
      if (element == event.target.value) {
        status = true;
      }
    });
    if (status) {
      this.incomeTypeName[i] = '';
      this.storeDropdownValue[i] = '';
      return true;
    }
    else

      this.storeDropdownValue[i] = event.target.value;
    return false;
  }

  incomeTypeChange(event, i) {
    // debugger;
    let isDuplicate: boolean = false;
    this.initializeErrorIndexes(i);
    if (event.target.value === "interest_profit_bank_fi") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Interest/Profit (Bank & FI) already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.interestorProfitArray = [];
      // this.dividendArray = [];
      // this.mutualorUnitFundArray = [];
      // this.royaltiesArray = [];
      // this.consultancyServiceArray = [];
      // this.lotteryPuzzleArray = [];
      // this.anyOtherIncomeArray = [];

      this.newInterestorProfit = { bankName: "", accountNo: "", grossAmount: "", sourceTaxDeducted: "", relatedFees: "", detailSerialNo: "" };
      this.interestorProfitArray.push(this.newInterestorProfit);
    //  console.log(this.interestorProfitArray);
      this.isInterestorProfitDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_interest_profit_bank_fi_validation();
    }
    else if (event.target.value === "dividend_from_listed_company") {
      // duplication check with tax exempted income
      if (this.isDividentFromListedComInTaxExempted) {
        this.toastr.warning('Divident(From Listed Company) already exist in tax exempted income!');
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        this.storeDropdownValue[i] = '';
        return;
      }
      else {
        isDuplicate = this.checkDropdownDuplication(event, i);
        if (isDuplicate) {
          this.toastr.warning('Dividend (From Listed Company) already exist', '', {
            timeOut: 1000,
          });
          this.formArray.controls[i].patchValue({
            incomeType: 0,
          });
          // this.storeDropdownValue.splice(i, 1);
          return;
        }
        else {
          this.storeDropdownValue[i] = event.target.value;
        }

        this.isVisibleTab[i] = false;
        this.isDisableAddSalBtn = false;

        this.dividendArray = [];
        // this.interestorProfitArray = [];
        // this.mutualorUnitFundArray = [];
        // this.royaltiesArray = [];
        // this.consultancyServiceArray = [];
        // this.lotteryPuzzleArray = [];
        // this.anyOtherIncomeArray = [];

        this.newDividend = { nameoftheCompany: "", grossDividendAmount: "", relatedExpenses: "", detailSerialNo: "" };
        this.dividendArray.push(this.newDividend);
    //    console.log(this.dividendArray);
        this.isDividendDeleteActionShow = false;
        this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
        this.formArray.controls[i].patchValue({
          netIncome: '',
          taxExemptedIncome: '',
        });
        this.initialize_dividend_from_listed_company_validation();
      }

    }

    else if (event.target.value === "dividend_others") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Dividend (Other than Listed Company & Mutual/Unit Fund)', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.dividendOthersArray = [];
      // this.interestorProfitArray = [];
      // this.mutualorUnitFundArray = [];
      // this.royaltiesArray = [];
      // this.consultancyServiceArray = [];
      // this.lotteryPuzzleArray = [];
      // this.anyOtherIncomeArray = [];

      this.newDividendOthers = { nameoftheCompany: "", grossDividendAmount: "", relatedExpenses: "", detailSerialNo: "" };
      this.dividendOthersArray.push(this.newDividendOthers);
   //   console.log(this.dividendOthersArray);
      this.isDividendOthersDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_dividend_others_validation();
    }
    else if (event.target.value === "income_from_mutual_unit_fund") {
      if (this.isIncomeFromMutualInTaxExempted) {
        this.toastr.warning('Income from Mutual/Unit Fund already exist in tax exempted income!');
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        this.storeDropdownValue[i]='';
        return;
      }
      else {
        isDuplicate = this.checkDropdownDuplication(event, i);
        if (isDuplicate) {
          this.toastr.warning('Income from Mutual/Unit Fund already exist', '', {
            timeOut: 1000,
          });
          this.formArray.controls[i].patchValue({
            incomeType: 0,
          });
          // this.storeDropdownValue.splice(i, 1);
          return;
        }
        else {
          this.storeDropdownValue[i] = event.target.value;
        }

        this.isVisibleTab[i] = false;
        this.isDisableAddSalBtn = false;

        this.mutualorUnitFundArray = [];
        // this.interestorProfitArray = [];
        // this.dividendArray = [];
        // this.royaltiesArray = [];
        // this.consultancyServiceArray = [];
        // this.lotteryPuzzleArray = [];
        // this.anyOtherIncomeArray = [];

        this.newMutualorUnitFund = { nameoftheMutualorUnitFund: "", grossReceipt: "", relatedExpenses: "", detailSerialNo: "" };
        this.mutualorUnitFundArray.push(this.newMutualorUnitFund);
      //  console.log(this.mutualorUnitFundArray);
        this.isMutualorUnitFundDeleteActionShow = false;
        this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
        this.formArray.controls[i].patchValue({
          netIncome: '',
          taxExemptedIncome: '',
        });
        this.initialize_income_from_mutual_unit_fund_validation();
      }


    }
    else if (event.target.value === "royalties") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Royalties already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.royaltiesArray = [];
      // this.interestorProfitArray = [];
      // this.dividendArray = [];
      // this.mutualorUnitFundArray = [];
      // this.consultancyServiceArray = [];
      // this.lotteryPuzzleArray = [];
      // this.anyOtherIncomeArray = [];

      this.newRoyalties = { nameoftheClient: "", agreementNo: "", date: "", grossPaymentAmount: "", relatedExpenses: "", taxDeductedorCollected: "", detailSerialNo: "" };
      this.royaltiesArray.push(this.newRoyalties);
    //  console.log(this.royaltiesArray);
      this.isRoyaltiesDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_royalties_validation();
    }
    else if (event.target.value === "consultancy_service") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Consultancy Service already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.consultancyServiceArray = [];
      // this.interestorProfitArray = [];
      // this.dividendArray = [];
      // this.mutualorUnitFundArray = [];
      // this.royaltiesArray = [];
      // this.lotteryPuzzleArray = [];
      // this.anyOtherIncomeArray = [];

      this.newConsultancyService = { nameoftheClient: "", agreementNo: "", date: "", grossPaymentAmount: "", relatedExpenses: "", taxDeductedorCollected: "", detailSerialNo: "" };
      this.consultancyServiceArray.push(this.newConsultancyService);
    //  console.log(this.consultancyServiceArray);
      this.isConsultancyServiceDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_consultancy_service_validation();
    }
    else if (event.target.value === "payment_from_wppf") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Payment from WPPF already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.paymentFromWPPFArray = [];
      // this.interestorProfitArray = [];
      // this.dividendArray = [];
      // this.mutualorUnitFundArray = [];
      // this.royaltiesArray = [];
      // this.lotteryPuzzleArray = [];
      // this.anyOtherIncomeArray = [];

      this.newPaymentFromWPPFArray = { nameoftheCompany: "", date: "", referenceNo: "", grossAmount: "", detailSerialNo: "" };
      this.paymentFromWPPFArray.push(this.newPaymentFromWPPFArray);
    //  console.log(this.paymentFromWPPFArray);
      this.isPaymentFromWPPFArrayDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_payment_from_wppf_validation();
    }
    else if (event.target.value === "lottery_puzzle_game__gambling_prize_bond") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Lottery, Puzzle, Game, Gambling, Prize Bond already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.lotteryPuzzleArray = [];
      // this.interestorProfitArray = [];
      // this.dividendArray = [];
      // this.mutualorUnitFundArray = [];
      // this.royaltiesArray = [];
      // this.consultancyServiceArray = [];
      // this.anyOtherIncomeArray = [];

      this.newLotteryPuzzle = { typeofWinning: "", paymentAuthority: "", referenceNo: "", grossWinningAmount: "", taxDeductedorCollected: "", detailSerialNo: "" };
      this.lotteryPuzzleArray.push(this.newLotteryPuzzle);
    //  console.log(this.lotteryPuzzleArray);
      this.isLotteryPuzzleDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_lottery_puzzle_game__gambling_prize_bond_validation();
    }
    else if (event.target.value === "any_other_income") {

      isDuplicate = this.checkDropdownDuplication(event, i);
      if (isDuplicate) {
        this.toastr.warning('Any other Income already exist', '', {
          timeOut: 1000,
        });
        this.formArray.controls[i].patchValue({
          incomeType: 0,
        });
        // this.storeDropdownValue.splice(i, 1);
        return;
      }
      else {
        this.storeDropdownValue[i] = event.target.value;
      }

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

      this.anyOtherIncomeArray = [];
      // this.interestorProfitArray = [];
      // this.dividendArray = [];
      // this.mutualorUnitFundArray = [];
      // this.royaltiesArray = [];
      // this.consultancyServiceArray = [];
      // this.lotteryPuzzleArray = [];

      this.newAnyOtherIncome = { particulars: "", paymentAuthority: "", date: "", grossAmountReceived: "", relatedExpenses: "", detailSerialNo: "" };
      this.anyOtherIncomeArray.push(this.newAnyOtherIncome);
     // console.log(this.anyOtherIncomeArray);
      this.isAnyOtherIncomeDeleteActionShow = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
      this.initialize_any_other_income_validation();
    }
    else if (event.target.value.substring(0, 30) === "income_exempted_reduced_by_sro") {
      this.storeDropdownValue[i] = event.target.value;

      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.formArray.controls[i].patchValue({
        netIncome: '',
        taxExemptedIncome: '',
      });
    }

    else {
      this.incomeTypeName[i] = '';
      this.isVisibleTab[i] = false;
    }

    // this.formArray.controls[this.formArray.length - 1].patchValue({
    //   incomeTypeName: this.incomeTypeName,
    // });

    if (!isDuplicate) {
      this.formArray.controls[i].patchValue({
        incomeTypeName: this.incomeTypeName,
      });
    }

  }

  selectedIncome(i: number) {
    this.isVisibleForm = i;
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
      if (i == index && element.value.id > 0) {
        this.apiService.delete(this.serviceUrl + 'api/user-panel/ifos-deleteItem?id=' + element.value.id)
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
      else if (i == index && element.value.id <= 0) {
        this.afterTabClose(i);
      }
    });

  }

  afterTabClose(i: any) {

    this.formArray.controls.forEach((element, index) => {
      if (i == index) {
        if (element.value.incomeType === 'income_exempted_reduced_by_sro') {
          this.closeErrorIndexes(i);
        }
      }
    });

    this.storeDropdownValue.splice(i, 1);
    this.formArray.removeAt(i);
    this.incomeTypeName.splice(i, 1);
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

  addInterestorProfitRow(index, i) {
    if (this.validation_checking_interest_profit_bank_fi()) {
      this.newInterestorProfit = { bankName: "", accountNo: "", grossAmount: "", sourceTaxDeducted: "", relatedFees: "", detailSerialNo: "" };
      this.interestorProfitArray.push(this.newInterestorProfit);
     // console.log(this.interestorProfitArray);
      this.isInterestorProfitDeleteActionShow = true;
      this.initialize_interest_profit_bank_fi_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteInterestorProfitRow(index, i) {
    if (this.interestorProfitArray.length == 1) {
      this.isInterestorProfitDeleteActionShow = false;
      this.totalNetIncomeInterestorProfit(index, i);
      return false;
    } else {
      this.interestorProfitArray.splice(index, 1);
    //  console.log(this.interestorProfitArray);
      this.isInterestorProfitDeleteActionShow = true;
      if (this.interestorProfitArray.length == 1) {
        this.isInterestorProfitDeleteActionShow = false;
      }
      this.totalNetIncomeInterestorProfit(index, i);
      return true;
    }
  }

  addDividendRow(index, i) {
    if (this.validation_checking_dividend_from_listed_company()) {
      this.newDividend = { nameoftheCompany: "", grossDividendAmount: "", relatedExpenses: "", sourceTaxDeducted: "", detailSerialNo: "" };
      this.dividendArray.push(this.newDividend);
   //   console.log(this.dividendArray);
      this.isDividendDeleteActionShow = true;
      this.initialize_dividend_from_listed_company_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteDividendRow(index, i) {
    if (this.dividendArray.length == 1) {
      this.isDividendDeleteActionShow = false;
      this.totalNetIncomeDividend(index, i);
      return false;
    } else {
      this.dividendArray.splice(index, 1);
   //   console.log(this.dividendArray);
      this.isDividendDeleteActionShow = true;
      if (this.dividendArray.length == 1) {
        this.isDividendDeleteActionShow = false;
      }
      this.totalNetIncomeDividend(index, i);
      return true;
    }
  }
  addDividendOthersRow(index, i) {
    if (this.validation_checking_dividend_others()) {
      this.newDividendOthers = { nameoftheCompany: "", grossDividendAmount: "", relatedExpenses: "", sourceTaxDeducted: "", detailSerialNo: "" };
      this.dividendOthersArray.push(this.newDividendOthers);
  //    console.log(this.dividendOthersArray);
      this.isDividendOthersDeleteActionShow = true;
      this.initialize_dividend_others_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteDividendOthersRow(index, i) {
    if (this.dividendOthersArray.length == 1) {
      this.isDividendOthersDeleteActionShow = false;
      this.totalNetIncomeDividendOthers(index, i);
      return false;
    } else {
      this.dividendOthersArray.splice(index, 1);
   //   console.log(this.dividendOthersArray);
      this.isDividendDeleteActionShow = true;
      if (this.dividendOthersArray.length == 1) {
        this.isDividendOthersDeleteActionShow = false;
      }
      this.totalNetIncomeDividendOthers(index, i);
      return true;
    }
  }

  addMutualorUnitFundRow(index, i) {
    if (this.validation_checking_income_from_mutual_unit_fund()) {
      this.newMutualorUnitFund = { nameoftheMutualorUnitFund: "", grossReceipt: "", relatedExpenses: "", sourceTaxDeducted: "", detailSerialNo: "" };
      this.mutualorUnitFundArray.push(this.newMutualorUnitFund);
   //   console.log(this.mutualorUnitFundArray);
      this.isMutualorUnitFundDeleteActionShow = true;
      this.initialize_income_from_mutual_unit_fund_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteMutualorUnitFundRow(index, i) {
    if (this.mutualorUnitFundArray.length == 1) {
      this.isMutualorUnitFundDeleteActionShow = false;
      this.totalNetIncomeMutualorUnitFund(index, i);
      return false;
    } else {
      this.mutualorUnitFundArray.splice(index, 1);
   //   console.log(this.mutualorUnitFundArray);
      this.isMutualorUnitFundDeleteActionShow = true;
      if (this.mutualorUnitFundArray.length == 1) {
        this.isMutualorUnitFundDeleteActionShow = false;
      }
      this.totalNetIncomeMutualorUnitFund(index, i);
      return true;
    }
  }

  addRoyaltiesRow(index, i) {
    if (this.validation_checking_royalties()) {
      this.newRoyalties = { nameoftheClient: "", agreementNo: "", date: "", grossPaymentAmount: "", relatedExpenses: "", taxDeductedorCollected: "", detailSerialNo: "" };
      this.royaltiesArray.push(this.newRoyalties);
  //    console.log(this.royaltiesArray);
      this.isRoyaltiesDeleteActionShow = true;
      this.initialize_royalties_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteRoyaltiesRow(index, i) {
    if (this.royaltiesArray.length == 1) {
      this.isRoyaltiesDeleteActionShow = false;
      this.totalNetIncomeRoyalties(index, i);
      return false;
    } else {
      this.royaltiesArray.splice(index, 1);
   //   console.log(this.royaltiesArray);
      this.isRoyaltiesDeleteActionShow = true;
      if (this.royaltiesArray.length == 1) {
        this.isRoyaltiesDeleteActionShow = false;
      }
      this.totalNetIncomeRoyalties(index, i);
      return true;
    }
  }

  addConsultancyServiceRow(index, i) {
    if (this.validation_checking_consultancy_service()) {
      this.newConsultancyService = { nameoftheClient: "", agreementNo: "", date: "", grossPaymentAmount: "", relatedExpenses: "", taxDeductedorCollected: "", detailSerialNo: "" };
      this.consultancyServiceArray.push(this.newConsultancyService);
   //   console.log(this.consultancyServiceArray);
      this.isConsultancyServiceDeleteActionShow = true;
      this.initialize_consultancy_service_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteConsultancyServiceRow(index, i) {
    if (this.consultancyServiceArray.length == 1) {
      this.isConsultancyServiceDeleteActionShow = false;
      this.totalNetIncomeConsultancyService(index, i);
      return false;
    } else {
      this.consultancyServiceArray.splice(index, 1);
  //    console.log(this.consultancyServiceArray);
      this.isConsultancyServiceDeleteActionShow = true;
      if (this.consultancyServiceArray.length == 1) {
        this.isConsultancyServiceDeleteActionShow = false;
      }
      this.totalNetIncomeConsultancyService(index, i);
      return true;
    }
  }

  addPaymentFromWPPFRow(index, i) {
    if (this.validation_checking_payment_from_wppf()) {
      this.newPaymentFromWPPFArray = { nameoftheCompany: "", date: "", referenceNo: "", grossAmount: "", detailSerialNo: "" };
      this.paymentFromWPPFArray.push(this.newPaymentFromWPPFArray);
   //   console.log(this.paymentFromWPPFArray);
      this.isPaymentFromWPPFArrayDeleteActionShow = true;
      this.initialize_payment_from_wppf_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deletePaymentFromWPPFRow(index, i) {
    if (this.paymentFromWPPFArray.length == 1) {
      this.isPaymentFromWPPFArrayDeleteActionShow = false;
      this.totalNetIncomePaymentFromWPPF(index, i);
      return false;
    } else {
      this.paymentFromWPPFArray.splice(index, 1);
   //   console.log(this.paymentFromWPPFArray);
      this.isDividendDeleteActionShow = true;
      if (this.paymentFromWPPFArray.length == 1) {
        this.isPaymentFromWPPFArrayDeleteActionShow = false;
      }
      this.totalNetIncomePaymentFromWPPF(index, i);
      return true;
    }
  }

  addLotteryPuzzleRow(index, i) {
    if (this.validation_checking_lottery_puzzle_game__gambling_prize_bond()) {
      this.newLotteryPuzzle = { typeofWinning: "", paymentAuthority: "", referenceNo: "", grossWinningAmount: "", taxDeductedorCollected: "", detailSerialNo: "" };
      this.lotteryPuzzleArray.push(this.newLotteryPuzzle);
  //    console.log(this.lotteryPuzzleArray);
      this.isLotteryPuzzleDeleteActionShow = true;
      this.initialize_lottery_puzzle_game__gambling_prize_bond_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteLotteryPuzzleRow(index, i) {
    if (this.lotteryPuzzleArray.length == 1) {
      this.isLotteryPuzzleDeleteActionShow = false;
      this.totalNetIncomeLotteryPuzzle(index, i);
      return false;
    } else {
      this.lotteryPuzzleArray.splice(index, 1);
   //   console.log(this.lotteryPuzzleArray);
      this.isLotteryPuzzleDeleteActionShow = true;
      if (this.lotteryPuzzleArray.length == 1) {
        this.isLotteryPuzzleDeleteActionShow = false;
      }
      this.totalNetIncomeLotteryPuzzle(index, i);
      return true;
    }
  }

  addAnyOtherIncomeRow(index, i) {
    if (this.validation_checking_any_other_income()) {
      this.newAnyOtherIncome = { particulars: "", paymentAuthority: "", date: "", grossAmountReceived: "", relatedExpenses: "", detailSerialNo: "" };
      this.anyOtherIncomeArray.push(this.newAnyOtherIncome);
  //    console.log(this.anyOtherIncomeArray);
      this.isAnyOtherIncomeDeleteActionShow = true;
      this.initialize_any_other_income_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteAnyOtherIncomeRow(index, i) {
    if (this.anyOtherIncomeArray.length == 1) {
      this.isAnyOtherIncomeDeleteActionShow = false;
      this.totalNetIncomeAnyOtherIncome(index, i);
      return false;
    } else {
      this.anyOtherIncomeArray.splice(index, 1);
   //   console.log(this.anyOtherIncomeArray);
      this.isAnyOtherIncomeDeleteActionShow = true;
      if (this.anyOtherIncomeArray.length == 1) {
        this.isAnyOtherIncomeDeleteActionShow = false;
      }
      this.totalNetIncomeAnyOtherIncome(index, i);
      return true;
    }
  }

  // start netincome & tax exempted calculation section

  interestorProfitArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossAmount') {
      this.interestorProfitArray[j].grossAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.interestorProfitArray[j].grossAmount, 0));
      // console.log('gross', this.interestorProfitArray[j].grossAmount);
    }
    else if (columnTitle === 'sourceTaxDeducted') {
      this.interestorProfitArray[j].sourceTaxDeducted = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.interestorProfitArray[j].sourceTaxDeducted, 0));
      // console.log('sourceTaxDeducted', this.interestorProfitArray[j].sourceTaxDeducted);
    }
    else if (columnTitle === 'relatedFees') {
      this.interestorProfitArray[j].relatedFees = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.interestorProfitArray[j].relatedFees, 0));
      // console.log('relatedFees', this.interestorProfitArray[j].relatedFees);
    }
    else {

    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    // if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57))
    {
      return false;
    }
    return true;
  }

  numberOnlyGrossReceipt(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    // if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57))
    {
      return false;
    }
    return true;
  }

  checkGrossReceiptValidation(event: any, i) {
    if (parseInt(event.target.value) == 0) {
      this.mutualorUnitFundArray[i].grossReceipt = "";
      this.toastr.warning('Gross Receipt will be greater than 0', '', {
        timeOut: 2000,
      });
    }
  }


  totalNetIncomeInterestorProfit(e: any, i) {
    // debugger;
    let totalGross: number;
    let totalCharge: number;
    let totalNetIncome: number;
    let gross: number;
    let charge: number;
    this.interestorProfitArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossAmount, 0));
      charge = element.relatedFees ? parseInt(this.commaSeparator.removeComma(element.relatedFees, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );
    // console.log('Tgross', totalGross);
    // console.log('Tcharge', totalCharge);
    totalNetIncome = (totalGross - totalCharge);
    // console.log('totalNetIncome:', totalNetIncome);

    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(totalNetIncome),
    });

  }

  initializeNetIncome(event, i) {
    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }

  initializeTaxExemptedIncome(event, i) {
    this.formArray.controls[i].patchValue({
      taxExemptedIncome: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }


  dividendArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossDividendAmount') {
      this.dividendArray[j].grossDividendAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.dividendArray[j].grossDividendAmount, 0));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.dividendArray[j].relatedExpenses = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.dividendArray[j].relatedExpenses, 0));
    }
    else if (columnTitle === 'sourceTaxDeducted') {
      this.dividendArray[j].sourceTaxDeducted = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.dividendArray[j].sourceTaxDeducted, 0));
    }
    else {

    }
  }

  totalNetIncomeDividend(e: any, i) {
    // debugger;
    let totalGross: number;
    let totalCharge: number;
    let result: number;
    let NetIncome: number;
    let TaxExemptedIncome: number;
    let gross: number;
    let charge: number;
    this.dividendArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossDividendAmount, 0));
      charge = element.relatedExpenses ? parseInt(this.commaSeparator.removeComma(element.relatedExpenses, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );

    result = (totalGross - totalCharge);
    if (result > 50000) {
      NetIncome = result - 50000;
      TaxExemptedIncome = 50000;
    }
    if (result <= 50000) {
      NetIncome = 0;
      TaxExemptedIncome = result;
    }

    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(NetIncome),
      taxExemptedIncome: this.commaSeparator.currencySeparatorBD(TaxExemptedIncome),
    });

  }

  dividendOthersArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossDividendAmount') {
      this.dividendOthersArray[j].grossDividendAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.dividendOthersArray[j].grossDividendAmount, 0));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.dividendOthersArray[j].relatedExpenses = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.dividendOthersArray[j].relatedExpenses, 0));
    }
    else if (columnTitle === 'sourceTaxDeducted') {
      this.dividendOthersArray[j].sourceTaxDeducted = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.dividendOthersArray[j].sourceTaxDeducted, 0));
    }
    else {

    }
  }

  totalNetIncomeDividendOthers(e: any, i) {
    // debugger;
    let totalGross: number;
    let totalCharge: number;
    let totalNetIncome: number;
    let gross: number;
    let charge: number;
    this.dividendOthersArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossDividendAmount, 0));
      charge = element.relatedExpenses ? parseInt(this.commaSeparator.removeComma(element.relatedExpenses, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );
    // console.log('Tgross', totalGross);
    // console.log('Tcharge', totalCharge);
    totalNetIncome = (totalGross - totalCharge);
    // console.log('totalNetIncome:', totalNetIncome);
    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(totalNetIncome),
    });
  }

  mutualorUnitFundArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossReceipt') {
      this.mutualorUnitFundArray[j].grossReceipt = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.mutualorUnitFundArray[j].grossReceipt, 0));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.mutualorUnitFundArray[j].relatedExpenses = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.mutualorUnitFundArray[j].relatedExpenses, 0));
    }
    else if (columnTitle === 'sourceTaxDeducted') {
      this.mutualorUnitFundArray[j].sourceTaxDeducted = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.mutualorUnitFundArray[j].sourceTaxDeducted, 0));
    }
    else {

    }
  }

  totalNetIncomeMutualorUnitFund(e: any, i) {
    // debugger;
    let totalGross: number;
    let totalCharge: number;
    let result: number;
    let NetIncome: number;
    let TaxExemptedIncome: number;
    let gross: number;
    let charge: number;
    this.mutualorUnitFundArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossReceipt, 0));
      charge = element.relatedExpenses ? parseInt(this.commaSeparator.removeComma(element.relatedExpenses, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );

    result = (totalGross - totalCharge);
    if (result > 25000) {
      NetIncome = result - 25000;
      TaxExemptedIncome = 25000;
    }
    if (result <= 25000) {
      NetIncome = 0;
      TaxExemptedIncome = result;
    }

    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(NetIncome),
      taxExemptedIncome: this.commaSeparator.currencySeparatorBD(TaxExemptedIncome),
    });

  }

  royaltiesArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossPaymentAmount') {
      this.royaltiesArray[j].grossPaymentAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.royaltiesArray[j].grossPaymentAmount, 0));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.royaltiesArray[j].relatedExpenses = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.royaltiesArray[j].relatedExpenses, 0));
    }
    else if (columnTitle === 'taxDeductedorCollected') {
      this.royaltiesArray[j].taxDeductedorCollected = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.royaltiesArray[j].taxDeductedorCollected, 0));
    }
    else {

    }
  }

  totalNetIncomeRoyalties(e: any, i) {
    let totalGross: number;
    let totalCharge: number;
    let totalNetIncome: number;
    let gross: number;
    let charge: number;
    this.royaltiesArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossPaymentAmount, 0));
      charge = element.relatedExpenses ? parseInt(this.commaSeparator.removeComma(element.relatedExpenses, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );
    totalNetIncome = (totalGross - totalCharge);
    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(totalNetIncome),
    });
  }

  consultancyServiceArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossPaymentAmount') {
      this.consultancyServiceArray[j].grossPaymentAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.consultancyServiceArray[j].grossPaymentAmount, 0));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.consultancyServiceArray[j].relatedExpenses = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.consultancyServiceArray[j].relatedExpenses, 0));
    }
    else if (columnTitle === 'taxDeductedorCollected') {
      this.consultancyServiceArray[j].taxDeductedorCollected = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.consultancyServiceArray[j].taxDeductedorCollected, 0));
    }
    else {

    }
  }

  totalNetIncomeConsultancyService(e: any, i) {
    let totalGross: number;
    let totalCharge: number;
    let totalNetIncome: number;
    let gross: number;
    let charge: number;
    this.consultancyServiceArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossPaymentAmount, 0));
      charge = element.relatedExpenses ? parseInt(this.commaSeparator.removeComma(element.relatedExpenses, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );
    totalNetIncome = (totalGross - totalCharge);
    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(totalNetIncome),
    });
  }

  paymentFromWPPFArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossAmount') {
      this.paymentFromWPPFArray[j].grossAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.paymentFromWPPFArray[j].grossAmount, 0));
    }
    else {

    }
  }

  totalNetIncomePaymentFromWPPF(e: any, i) {
    // debugger;
    let totalGross: number;
    let result: number;
    let NetIncome: number;
    let TaxExemptedIncome: number;
    let gross: number;
    this.paymentFromWPPFArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossAmount, 0));
      totalGross = (totalGross ? totalGross : 0) + gross;
    }
    );

    result = (totalGross);
    if (result > 50000) {
      NetIncome = result - 50000;
      TaxExemptedIncome = 50000;
    }
    if (result <= 50000) {
      NetIncome = 0;
      TaxExemptedIncome = result;
    }

    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(NetIncome),
      taxExemptedIncome: this.commaSeparator.currencySeparatorBD(TaxExemptedIncome),
    });

  }

  lotteryPuzzleArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossWinningAmount') {
      this.lotteryPuzzleArray[j].grossWinningAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.lotteryPuzzleArray[j].grossWinningAmount, 0));
    }
    else if (columnTitle === 'taxDeductedorCollected') {
      this.lotteryPuzzleArray[j].taxDeductedorCollected = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.lotteryPuzzleArray[j].taxDeductedorCollected, 0));
    }
    else {

    }
  }

  totalNetIncomeLotteryPuzzle(e: any, i) {
    let totalGross: number;
    let totalCharge: number;
    let totalNetIncome: number;
    let gross: number;
    let charge: number;
    this.lotteryPuzzleArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossWinningAmount, 0));
      // charge = element.relatedExpenses;
      totalGross = (totalGross ? totalGross : 0) + gross;
      // totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );
    totalNetIncome = (totalGross);
    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(totalNetIncome),
    });
  }

  anyOtherIncomeArrayCommaSeparator(e: any, j: number, columnTitle: any) {
    if (columnTitle === 'grossAmountReceived') {
      this.anyOtherIncomeArray[j].grossAmountReceived = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.anyOtherIncomeArray[j].grossAmountReceived, 0));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.anyOtherIncomeArray[j].relatedExpenses = this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.anyOtherIncomeArray[j].relatedExpenses, 0));
    }
    else {

    }
  }

  totalNetIncomeAnyOtherIncome(e: any, i) {
    let totalGross: number;
    let totalCharge: number;
    let totalNetIncome: number;
    let gross: number;
    let charge: number;
    this.anyOtherIncomeArray.forEach((element, i) => {
      gross = parseInt(this.commaSeparator.removeComma(element.grossAmountReceived, 0));
      charge = element.relatedExpenses ? parseInt(this.commaSeparator.removeComma(element.relatedExpenses, 0)) : 0;
      totalGross = (totalGross ? totalGross : 0) + gross;
      totalCharge = (totalCharge ? totalCharge : 0) + charge;
    }
    );
    totalNetIncome = (totalGross - totalCharge);
    this.formArray.controls[i].patchValue({
      netIncome: this.commaSeparator.currencySeparatorBD(totalNetIncome),
    });
  }

  initializeSro(e: any, i: number, columnTitle: any) {
    if (columnTitle === 'grossAmountReceived') {
      this.formArray.at(i).get('grossAmountReceived').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('grossAmountReceived').value, 0)));
    }
    else if (columnTitle === 'relatedExpenses') {
      this.formArray.at(i).get('relatedExpenses').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('relatedExpenses').value, 0)));
    }
    else if (columnTitle === 'incomeExemptedfromTax') {
      this.formArray.at(i).get('incomeExemptedfromTax').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('incomeExemptedfromTax').value, 0)));
    }
    else if (columnTitle === 'applicableTaxasperSro') {
      this.formArray.at(i).get('applicableTaxasperSro').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('applicableTaxasperSro').value, 0)));
    }
  }

  calNetIncome(i) {
    let netIncome = [];
    netIncome[i] = (parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('grossAmountReceived').value, 0)) -
      (this.formArray.at(i).get('relatedExpenses').value ? parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('relatedExpenses').value, 0)) : 0));
    // console.log('netIncome=', netIncome[i]);
    this.formArray.at(i).get('netIncomeSro').setValue(this.commaSeparator.currencySeparatorBD(netIncome[i]));
    // console.log('form data', this.formArray.controls[i]);
    this.calTaxableIncome(i);
  }

  calTaxableIncome(i) {
    // debugger;
    if ((parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('netIncomeSro').value, 0))) < 0) {
      this.isTaxExemptedReadonly[i] = true;
      this.formArray.at(i).get('taxableIncome').setValue(0);
      this.formArray.at(i).get('incomeExemptedfromTax').setValue(0);
      return;
    }
    if ((parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('incomeExemptedfromTax').value, 0))) > (parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('netIncomeSro').value, 0)))) {
      this.isTaxExemptedReadonly[i] = false;
      this.toastr.warning('Tax Exempted Income value can not be greater than NetIncome value.', '', {
        timeOut: 3000,
      });
      this.formArray.at(i).get('incomeExemptedfromTax').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(this.formArray.at(i).get('netIncomeSro').value, 0)));
      this.taxableIncome[i] = ((parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('netIncomeSro').value, 0))) - (parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('incomeExemptedfromTax').value, 0))));
      this.formArray.at(i).get('taxableIncome').setValue(this.commaSeparator.currencySeparatorBD(this.taxableIncome[i]));
      return;
    }
    else {
      this.isTaxExemptedReadonly[i] = false;
      this.taxableIncome[i] = ((parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('netIncomeSro').value, 0))) - (this.formArray.at(i).get('incomeExemptedfromTax').value ? parseInt(this.commaSeparator.removeComma(this.formArray.at(i).get('incomeExemptedfromTax').value, 0)) : 0));
      // console.log('taxableIncome=', this.taxableIncome[i]);
      this.formArray.at(i).get('taxableIncome').setValue(this.commaSeparator.currencySeparatorBD(this.taxableIncome[i]));
      // console.log('form data', this.formArray.controls[i]);
    }
  }

  submittedData() {
    // debugger;

    this.requestData = [];
    let obj: any;

    this.interestorProfitData = [];
    let interestorProfitOBJ: any;

    this.dividendData = [];
    let dividendOBJ: any;

    this.dividendOthersData = [];
    let dividendOthersOBJ: any;

    this.mutualorUnitFundData = [];
    let mutualorUnitFundOBJ: any;

    this.royaltiesData = [];
    let royaltiesOBJ: any;

    this.consultancyServiceData = [];
    let consultancyServiceOBJ: any;

    this.paymentFromWPPFData = [];
    let paymentFromWPPFOBJ: any;

    this.lotteryPuzzleData = [];
    let lotteryPuzzleOBJ: any;

    this.anyOtherIncomeData = [];
    let anyOtherIncomeOBJ: any;

    //#region Income Type select validation
    let isInterestProfitSuccess: boolean = true;
    let isdividend_from_listed_companySuccess: boolean = true;
    let isdividend_othersSuccess: boolean = true;
    let isincome_from_mutual_unit_fund: boolean = true;
    let isroyaltiesSuccess: boolean = true;
    let isconsultancy_serviceSuccess: boolean = true;
    let ispayment_from_wppfSuccess: boolean = true;
    let islotteryPuzzleArraySuccess: boolean = true;


    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType === "interest_profit_bank_fi" && successValidation) {
        if (this.interestorProfitArray.length > 0 && !this.validation_checking_interest_profit_bank_fi()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "dividend_from_listed_company" && successValidation) {
        if (this.dividendArray.length > 0 && !this.validation_checking_dividend_from_listed_company()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "dividend_others" && successValidation) {
        if (this.dividendOthersArray.length > 0 && !this.validation_checking_dividend_others()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "income_from_mutual_unit_fund" && successValidation) {
        if (this.mutualorUnitFundArray.length > 0 && !this.validation_checking_income_from_mutual_unit_fund()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "royalties" && successValidation) {
        debugger;
        if (this.royaltiesArray.length > 0 && !this.validation_checking_royalties()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "consultancy_service" && successValidation) {
        if (this.consultancyServiceArray.length > 0 && !this.validation_checking_consultancy_service()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "payment_from_wppf" && successValidation) {
        if (this.paymentFromWPPFArray.length > 0 && !this.validation_checking_payment_from_wppf()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "lottery_puzzle_game__gambling_prize_bond" && successValidation) {
        if (this.lotteryPuzzleArray.length > 0 && !this.validation_checking_lottery_puzzle_game__gambling_prize_bond()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "any_other_income" && successValidation) {
        if (this.anyOtherIncomeArray.length > 0 && !this.validation_checking_any_other_income()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = index;
          return;
        }
      }
      if (element.value.incomeType === "income_exempted_reduced_by_sro" && successValidation) {
        let sroValidationResponse: any;


        sroValidationResponse = this.validateSRO();
        if (!sroValidationResponse.status) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          this.isVisibleForm = sroValidationResponse.indexNo;
          return;
        }
      }
      if (element.value.incomeType !== "income_exempted_reduced_by_sro" && successValidation) {
        this.netIncome_showError[index] = false;
        this.formArray.controls.forEach((e, idx) => {
          if (idx == index) {
            if (e.value.netIncome == null || e.value.netIncome === '') {

              this.netIncome_showError[index] = true;
              this.toastr.warning('Please fill all the required fields!', '', {
                timeOut: 2000,
              });
              successValidation = false;
              this.isVisibleForm = index;
              return;
            }
          }
        })

      }

    })

    if (!successValidation) return;
    //#endregion      

    //#endregion    

    this.interestorProfitArray.forEach((element, index) => {
      interestorProfitOBJ = {
        "accAgRefNo": element.accountNo ? element.accountNo : '',
        "dateOfIssue": '',
        "deductedTax": element.sourceTaxDeducted ? this.commaSeparator.removeComma(element.sourceTaxDeducted, 0) : 0,
        "expense": element.relatedFees ? this.commaSeparator.removeComma(element.relatedFees, 0) : 0,
        "gross": element.grossAmount ? this.commaSeparator.removeComma(element.grossAmount, 0) : 0,
        "name": element.bankName ? element.bankName : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.interestorProfitData.push(interestorProfitOBJ);
    });

    this.dividendArray.forEach((element, index) => {
      dividendOBJ = {
        "accAgRefNo": '',
        "dateOfIssue": '',
        "deductedTax": element.sourceTaxDeducted ? this.commaSeparator.removeComma(element.sourceTaxDeducted, 0) : 0,
        "expense": element.relatedExpenses ? this.commaSeparator.removeComma(element.relatedExpenses, 0) : 0,
        "gross": element.grossDividendAmount ? this.commaSeparator.removeComma(element.grossDividendAmount, 0) : 0,
        "name": element.nameoftheCompany ? element.nameoftheCompany : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.dividendData.push(dividendOBJ);
    });

    this.dividendOthersArray.forEach((element, index) => {
      dividendOthersOBJ = {
        "accAgRefNo": '',
        "dateOfIssue": '',
        "deductedTax": element.sourceTaxDeducted ? this.commaSeparator.removeComma(element.sourceTaxDeducted, 0) : 0,
        "expense": element.relatedExpenses ? this.commaSeparator.removeComma(element.relatedExpenses, 0) : 0,
        "gross": element.grossDividendAmount ? this.commaSeparator.removeComma(element.grossDividendAmount, 0) : 0,
        "name": element.nameoftheCompany ? element.nameoftheCompany : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.dividendOthersData.push(dividendOthersOBJ);
    });

    this.mutualorUnitFundArray.forEach((element, index) => {
      mutualorUnitFundOBJ = {
        "accAgRefNo": '',
        "dateOfIssue": '',
        "deductedTax": element.sourceTaxDeducted ? this.commaSeparator.removeComma(element.sourceTaxDeducted, 0) : 0,
        "expense": element.relatedExpenses ? this.commaSeparator.removeComma(element.relatedExpenses, 0) : 0,
        "gross": element.grossReceipt ? this.commaSeparator.removeComma(element.grossReceipt, 0) : 0,
        "name": element.nameoftheMutualorUnitFund ? element.nameoftheMutualorUnitFund : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.mutualorUnitFundData.push(mutualorUnitFundOBJ);
    });

    this.royaltiesArray.forEach((element, index) => {
      let dateOfIssue = element.date ? moment(element.date, 'DD-MM-YYYY') : '';
      royaltiesOBJ = {
        "accAgRefNo": element.agreementNo ? element.agreementNo : '',
        "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
        "deductedTax": element.taxDeductedorCollected ? this.commaSeparator.removeComma(element.taxDeductedorCollected, 0) : 0,
        "expense": element.relatedExpenses ? this.commaSeparator.removeComma(element.relatedExpenses, 0) : 0,
        "gross": element.grossPaymentAmount ? this.commaSeparator.removeComma(element.grossPaymentAmount, 0) : 0,
        "name": element.nameoftheClient ? element.nameoftheClient : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.royaltiesData.push(royaltiesOBJ);
    });

    this.consultancyServiceArray.forEach((element, index) => {
      let dateOfIssue = element.date ? moment(element.date, 'DD-MM-YYYY') : '';
      consultancyServiceOBJ = {
        "accAgRefNo": element.agreementNo ? element.agreementNo : '',
        "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
        "deductedTax": element.taxDeductedorCollected ? this.commaSeparator.removeComma(element.taxDeductedorCollected, 0) : 0,
        "expense": element.relatedExpenses ? this.commaSeparator.removeComma(element.relatedExpenses, 0) : 0,
        "gross": element.grossPaymentAmount ? this.commaSeparator.removeComma(element.grossPaymentAmount, 0) : 0,
        "name": element.nameoftheClient ? element.nameoftheClient : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.consultancyServiceData.push(consultancyServiceOBJ);
    });

    this.paymentFromWPPFArray.forEach((element, index) => {
      let dateOfIssue = element.date ? moment(element.date, 'DD-MM-YYYY') : '';
      paymentFromWPPFOBJ = {
        "accAgRefNo": element.referenceNo ? element.referenceNo : '',
        "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
        "deductedTax": 0,
        "expense": 0,
        "gross": element.grossAmount ? this.commaSeparator.removeComma(element.grossAmount, 0) : 0,
        "name": element.nameoftheCompany ? element.nameoftheCompany : '',
        "particularSro": '',
        "paymentAuthority": '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.paymentFromWPPFData.push(paymentFromWPPFOBJ);
    });

    this.lotteryPuzzleArray.forEach((element, index) => {
      lotteryPuzzleOBJ = {
        "accAgRefNo": element.referenceNo ? element.referenceNo : '',
        "dateOfIssue": '',
        "deductedTax": element.taxDeductedorCollected ? this.commaSeparator.removeComma(element.taxDeductedorCollected, 0) : 0,
        "expense": 0,
        "gross": element.grossWinningAmount ? this.commaSeparator.removeComma(element.grossWinningAmount, 0) : 0,
        "name": element.typeofWinning ? element.typeofWinning : '',
        "particularSro": '',
        "paymentAuthority": element.paymentAuthority ? element.paymentAuthority : '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.lotteryPuzzleData.push(lotteryPuzzleOBJ);
    });

    this.anyOtherIncomeArray.forEach((element, index) => {
      let dateOfIssue = element.date ? moment(element.date, 'DD-MM-YYYY') : '';
      anyOtherIncomeOBJ = {
        "accAgRefNo": '',
        "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
        "deductedTax": 0,
        "expense": element.relatedExpenses ? this.commaSeparator.removeComma(element.relatedExpenses, 0) : 0,
        "gross": element.grossAmountReceived ? this.commaSeparator.removeComma(element.grossAmountReceived, 0) : 0,
        "name": element.particulars ? element.particulars : '',
        "particularSro": '',
        "paymentAuthority": element.paymentAuthority ? element.paymentAuthority : '',
        "sroNo": '',
        "taxableIncome": 0,
        "year": '',
        "detailSerialNo": element.detailSerialNo ? Math.round(element.detailSerialNo) : 0,
      }
      this.anyOtherIncomeData.push(anyOtherIncomeOBJ);
    });

    // console.log('interestorProfitData', this.interestorProfitData);
    // console.log('dividendData', this.dividendData);
    // console.log('mutualorUnitFundData', this.mutualorUnitFundData);
    // console.log('royaltiesData', this.royaltiesData);
    // console.log('consultancyServiceData', this.consultancyServiceData);
    // console.log('lotteryPuzzleData', this.lotteryPuzzleData);
    // console.log('anyOtherIncomeData', this.anyOtherIncomeData);


    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'interest_profit_bank_fi') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? Math.round(element.value.taxExemptedIncome) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.interestorProfitData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'dividend_from_listed_company') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.dividendData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'dividend_others') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? Math.round(element.value.taxExemptedIncome) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.dividendOthersData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'income_from_mutual_unit_fund') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.mutualorUnitFundData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'royalties') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? Math.round(element.value.taxExemptedIncome) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.royaltiesData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'consultancy_service') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? Math.round(element.value.taxExemptedIncome) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.consultancyServiceData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'payment_from_wppf') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? this.commaSeparator.removeComma(element.value.taxExemptedIncome, 0) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.paymentFromWPPFData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'lottery_puzzle_game__gambling_prize_bond') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? Math.round(element.value.taxExemptedIncome) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.lotteryPuzzleData
        }
        this.requestData.push(obj);
      }
    });

    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'any_other_income') {

        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType,
          "taxable": element.value.netIncome ? this.commaSeparator.removeComma(element.value.netIncome, 0) : 0,
          "exempted": element.value.taxExemptedIncome ? Math.round(element.value.taxExemptedIncome) : 0,
          "applicableTaxSRO": 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": this.anyOtherIncomeData
        }
        this.requestData.push(obj);
      }
    });

    let countSro = 1;
    this.formArray.controls.forEach((element, index) => {
      if (element.value.incomeType == 'income_exempted_reduced_by_sro') {
        let dateOfIssue = element.value.date ? moment(element.value.date, 'DD-MM-YYYY') : '';
        let year = element.value.year ? moment(element.value.year, 'YYYY') : '';
        obj = {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "ifosTypeName": element.value.incomeType + countSro.toString(),
          "taxable": element.value.netIncomeSro ? this.commaSeparator.removeComma(element.value.netIncomeSro, 0) : 0,
          "exempted": element.value.incomeExemptedfromTax ? this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0) : 0,
          "applicableTaxSRO": element.value.applicableTaxasperSro ? this.commaSeparator.removeComma(element.value.applicableTaxasperSro, 0) : 0,
          "serialOfType": element.value.serialOfType ? Math.round(element.value.serialOfType) : 0,
          "ifosDetailDtos": [
            {
              "accAgRefNo": element.value.referenceNo ? element.value.referenceNo : '',
              "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
              "deductedTax": 0,
              "expense": element.value.relatedExpenses ? this.commaSeparator.removeComma(element.value.relatedExpenses, 0) : 0,
              "gross": element.value.grossAmountReceived ? this.commaSeparator.removeComma(element.value.grossAmountReceived, 0) : 0,
              "name": element.value.particulars ? element.value.particulars : '',
              "particularSro": element.value.particularofSro ? element.value.particularofSro : '',
              "paymentAuthority": element.value.paymentAuthority ? element.value.paymentAuthority : '',
              "sroNo": element.value.sroNo ? element.value.sroNo : '',
              "taxableIncome": element.value.taxableIncome ? this.commaSeparator.removeComma(element.value.taxableIncome, 0) : 0,
              "year": year ? this.datepipe.transform(year, 'yyyy') : '',
              "detailSerialNo": element.value.detailSerialNo ? Math.round(element.value.detailSerialNo) : 0,
            }
          ]
        }
        this.requestData.push(obj);
      }
      countSro = countSro + 1;
    });

   // console.log('requested ifos Data:', this.requestData);
    // debugger;

    this.apiService.post(this.serviceUrl + 'api/user-panel/save-ifos-data', this.requestData)
      .subscribe(result => {
        if (result != null && this.isSaveDraft == false) {
       //   console.log(result);
          this.toastr.success('Data Saved Successfully.', '', {
            timeOut: 1000,
          });

          this.headsOfIncome.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/income-from-other-sources') {
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
       //   console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/income-from-other-sources') {
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


  //interest_profit_bank_fi validation start

  validate_interest_profit_bank_fi = [];
  initialize_interest_profit_bank_fi_validation() {
    this.validate_interest_profit_bank_fi = [];
    this.interestorProfitArray.forEach(element => {
      let data = {
        "bankName_showError": false,
        "accountNo_showError": false,
        "grossAmount_showError": false
      }
      this.validate_interest_profit_bank_fi.push(data);
    });
  }

  initialize_interest_profit_bank_fi_validation_error(i) {
    this.validate_interest_profit_bank_fi[i].bankName_showError = false;
    this.validate_interest_profit_bank_fi[i].accountNo_showError = false;
    this.validate_interest_profit_bank_fi[i].grossAmount_showError = false;
  }

  validation_checking_interest_profit_bank_fi(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.interestorProfitArray.forEach((element, index) => {
      this.initialize_interest_profit_bank_fi_validation_error(index);
      if (element.bankName === null || element.bankName === '') {
        this.validate_interest_profit_bank_fi[index].bankName_showError = true;
        validationSuccess = false;
      }
      if (element.accountNo === null || element.accountNo === '') {
        this.validate_interest_profit_bank_fi[index].accountNo_showError = true;
        validationSuccess = false;
      }
      if (element.grossAmount === null || element.grossAmount === '') {
        this.validate_interest_profit_bank_fi[index].grossAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_interest_profit_bank_fi(i, formControlName) {
    if (formControlName === 'bankName')
      this.validate_interest_profit_bank_fi[i].bankName_showError = false;
    if (formControlName === 'accountNo')
      this.validate_interest_profit_bank_fi[i].accountNo_showError = false;
    if (formControlName === 'grossAmount')
      this.validate_interest_profit_bank_fi[i].grossAmount_showError = false;
  }
  //interest_profit_bank_fi validation end


  //dividend_from_listed_company validation start

  validate_dividend_from_listed_company = [];
  initialize_dividend_from_listed_company_validation() {
    this.validate_dividend_from_listed_company = [];
    this.dividendArray.forEach(element => {
      let data = {
        "nameoftheCompany_showError": false,
        "grossDividendAmount_showError": false
      }
      this.validate_dividend_from_listed_company.push(data);
    });
  }

  initialize_dividend_from_listed_company_validation_error(i) {
    this.validate_dividend_from_listed_company[i].nameoftheCompany_showError = false;
    this.validate_dividend_from_listed_company[i].grossDividendAmount_showError = false;
  }

  validation_checking_dividend_from_listed_company(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.dividendArray.forEach((element, index) => {
      this.initialize_dividend_from_listed_company_validation_error(index);
      if (element.nameoftheCompany === null || element.nameoftheCompany === '') {
        this.validate_dividend_from_listed_company[index].nameoftheCompany_showError = true;
        validationSuccess = false;
      }
      if (element.grossDividendAmount === null || element.grossDividendAmount === '') {
        this.validate_dividend_from_listed_company[index].grossDividendAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_dividend_from_listed_company(i, formControlName) {
    if (formControlName === 'nameoftheCompany')
      this.validate_dividend_from_listed_company[i].nameoftheCompany_showError = false;
    if (formControlName === 'grossDividendAmount')
      this.validate_dividend_from_listed_company[i].grossDividendAmount_showError = false;
  }
  //dividend_from_listed_company validation end


  //dividend_others validation start

  validate_dividend_others = [];
  initialize_dividend_others_validation() {
    this.validate_dividend_others = [];
    this.dividendOthersArray.forEach(element => {
      let data = {
        "nameoftheCompany_showError": false,
        "grossDividendAmount_showError": false
      }
      this.validate_dividend_others.push(data);
    });
  }

  initialize_dividend_others_validation_error(i) {
    this.validate_dividend_others[i].nameoftheCompany_showError = false;
    this.validate_dividend_others[i].grossDividendAmount_showError = false;
  }

  validation_checking_dividend_others(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.dividendOthersArray.forEach((element, index) => {
      this.initialize_dividend_others_validation_error(index);
      if (element.nameoftheCompany === null || element.nameoftheCompany === '') {
        this.validate_dividend_others[index].nameoftheCompany_showError = true;
        validationSuccess = false;
      }
      if (element.grossDividendAmount === null || element.grossDividendAmount === '') {
        this.validate_dividend_others[index].grossDividendAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_dividend_others(i, formControlName) {
    if (formControlName === 'nameoftheCompany')
      this.validate_dividend_others[i].nameoftheCompany_showError = false;
    if (formControlName === 'grossDividendAmount')
      this.validate_dividend_others[i].grossDividendAmount_showError = false;
  }
  //dividend_others validation end


  //income_from_mutual_unit_fund validation start

  validate_income_from_mutual_unit_fund = [];
  initialize_income_from_mutual_unit_fund_validation() {
    this.validate_income_from_mutual_unit_fund = [];
    this.mutualorUnitFundArray.forEach(element => {
      let data = {
        "nameoftheMutualorUnitFund_showError": false,
        "grossReceipt_showError": false
      }
      this.validate_income_from_mutual_unit_fund.push(data);
    });
  }

  initialize_income_from_mutual_unit_fund_validation_error(i) {
    this.validate_income_from_mutual_unit_fund[i].nameoftheMutualorUnitFund_showError = false;
    this.validate_income_from_mutual_unit_fund[i].grossReceipt_showError = false;
  }

  validation_checking_income_from_mutual_unit_fund(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.mutualorUnitFundArray.forEach((element, index) => {
      this.initialize_income_from_mutual_unit_fund_validation_error(index);
      if (element.nameoftheMutualorUnitFund === null || element.nameoftheMutualorUnitFund === '') {
        this.validate_income_from_mutual_unit_fund[index].nameoftheMutualorUnitFund_showError = true;
        validationSuccess = false;
      }
      if (element.grossReceipt === null || element.grossReceipt === '') {
        this.validate_income_from_mutual_unit_fund[index].grossReceipt_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_income_from_mutual_unit_fund(i, formControlName) {
    if (formControlName === 'nameoftheMutualorUnitFund')
      this.validate_income_from_mutual_unit_fund[i].nameoftheMutualorUnitFund_showError = false;
    if (formControlName === 'grossReceipt')
      this.validate_income_from_mutual_unit_fund[i].grossReceipt_showError = false;
  }
  //income_from_mutual_unit_fund validation end


  //royalties validation start

  validate_royalties = [];
  initialize_royalties_validation() {
    this.validate_royalties = [];
    this.royaltiesArray.forEach(element => {
      let data = {
        "nameoftheClient_showError": false,
        "grossPaymentAmount_showError": false,
        "taxDeductedorCollected_showError": false
      }
      this.validate_royalties.push(data);
    });
  }

  initialize_royalties_validation_error(i) {
    this.validate_royalties[i].nameoftheClient_showError = false;
    this.validate_royalties[i].grossPaymentAmount_showError = false;
    this.validate_royalties[i].taxDeductedorCollected_showError = false;
  }

  validation_checking_royalties(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.royaltiesArray.forEach((element, index) => {
      this.initialize_royalties_validation_error(index);
      if (element.nameoftheClient === null || element.nameoftheClient === '') {
        this.validate_royalties[index].nameoftheClient_showError = true;
        validationSuccess = false;
      }
      if (element.grossPaymentAmount === null || element.grossPaymentAmount === '') {
        this.validate_royalties[index].grossPaymentAmount_showError = true;
        validationSuccess = false;
      }
      if (element.taxDeductedorCollected === null || element.taxDeductedorCollected === '') {
        this.validate_royalties[index].taxDeductedorCollected_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_royalties(i, formControlName) {
    if (formControlName === 'nameoftheClient')
      this.validate_royalties[i].nameoftheClient_showError = false;
    if (formControlName === 'grossPaymentAmount')
      this.validate_royalties[i].grossPaymentAmount_showError = false;
    if (formControlName === 'taxDeductedorCollected')
      this.validate_royalties[i].taxDeductedorCollected_showError = false;
  }
  //royalties validation end


  //consultancy_service validation start

  validate_consultancy_service = [];
  initialize_consultancy_service_validation() {
    this.validate_consultancy_service = [];
    this.consultancyServiceArray.forEach(element => {
      let data = {
        "nameoftheClient_showError": false,
        "grossPaymentAmount_showError": false,
        "taxDeductedorCollected_showError": false
      }
      this.validate_consultancy_service.push(data);
    });
  }

  initialize_consultancy_service_validation_error(i) {
    this.validate_consultancy_service[i].nameoftheClient_showError = false;
    this.validate_consultancy_service[i].grossPaymentAmount_showError = false;
    this.validate_consultancy_service[i].taxDeductedorCollected_showError = false;
  }

  validation_checking_consultancy_service(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.consultancyServiceArray.forEach((element, index) => {
      this.initialize_consultancy_service_validation_error(index);
      if (element.nameoftheClient === null || element.nameoftheClient === '') {
        this.validate_consultancy_service[index].nameoftheClient_showError = true;
        validationSuccess = false;
      }
      if (element.grossPaymentAmount === null || element.grossPaymentAmount === '') {
        this.validate_consultancy_service[index].grossPaymentAmount_showError = true;
        validationSuccess = false;
      }
      if (element.taxDeductedorCollected === null || element.taxDeductedorCollected === '') {
        this.validate_consultancy_service[index].taxDeductedorCollected_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_consultancy_service(i, formControlName) {
    if (formControlName === 'nameoftheClient')
      this.validate_consultancy_service[i].nameoftheClient_showError = false;
    if (formControlName === 'grossPaymentAmount')
      this.validate_consultancy_service[i].grossPaymentAmount_showError = false;
    if (formControlName === 'taxDeductedorCollected')
      this.validate_consultancy_service[i].taxDeductedorCollected_showError = false;
  }
  //consultancy_service validation end


  //payment_from_wppf validation start

  validate_payment_from_wppf = [];
  initialize_payment_from_wppf_validation() {
    this.validate_payment_from_wppf = [];
    this.paymentFromWPPFArray.forEach(element => {
      let data = {
        "nameoftheCompany_showError": false,
        "grossAmount_showError": false,
        "date_showError": false
      }
      this.validate_payment_from_wppf.push(data);
    });
  }

  initialize_payment_from_wppf_validation_error(i) {
    this.validate_payment_from_wppf[i].nameoftheCompany_showError = false;
    this.validate_payment_from_wppf[i].grossAmount_showError = false;
    this.validate_payment_from_wppf[i].date_showError = false;
  }

  validation_checking_payment_from_wppf(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.paymentFromWPPFArray.forEach((element, index) => {
      this.initialize_payment_from_wppf_validation_error(index);
      if (element.nameoftheCompany === null || element.nameoftheCompany === '') {
        this.validate_payment_from_wppf[index].nameoftheCompany_showError = true;
        validationSuccess = false;
      }
      if (element.grossAmount === null || element.grossAmount === '') {
        this.validate_payment_from_wppf[index].grossAmount_showError = true;
        validationSuccess = false;
      }
      if (element.date === null || element.date === '') {
        this.validate_payment_from_wppf[index].date_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_payment_from_wppf(i, formControlName) {
    if (formControlName === 'nameoftheCompany')
      this.validate_payment_from_wppf[i].nameoftheCompany_showError = false;
    if (formControlName === 'grossAmount')
      this.validate_payment_from_wppf[i].grossAmount_showError = false;
    if (formControlName === 'date')
      this.validate_payment_from_wppf[i].date_showError = false;
  }
  //payment_from_wppf validation end


  //lottery_puzzle_game__gambling_prize_bond validation start

  validate_lottery_puzzle_game__gambling_prize_bond = [];
  initialize_lottery_puzzle_game__gambling_prize_bond_validation() {
    this.validate_lottery_puzzle_game__gambling_prize_bond = [];
    this.lotteryPuzzleArray.forEach(element => {
      let data = {
        "typeofWinning_showError": false,
        "paymentAuthority_showError": false,
        "grossWinningAmount_showError": false,
        "taxDeductedorCollected_showError": false
      }
      this.validate_lottery_puzzle_game__gambling_prize_bond.push(data);
    });
  }

  initialize_lottery_puzzle_game__gambling_prize_bond_validation_error(i) {
    this.validate_lottery_puzzle_game__gambling_prize_bond[i].typeofWinning_showError = false;
    this.validate_lottery_puzzle_game__gambling_prize_bond[i].paymentAuthority_showError = false;
    this.validate_lottery_puzzle_game__gambling_prize_bond[i].grossWinningAmount_showError = false;
    this.validate_lottery_puzzle_game__gambling_prize_bond[i].taxDeductedorCollected_showError = false;
  }

  validation_checking_lottery_puzzle_game__gambling_prize_bond(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.lotteryPuzzleArray.forEach((element, index) => {
      this.initialize_lottery_puzzle_game__gambling_prize_bond_validation_error(index);
      if (element.typeofWinning === null || element.typeofWinning === '') {
        this.validate_lottery_puzzle_game__gambling_prize_bond[index].typeofWinning_showError = true;
        validationSuccess = false;
      }
      if (element.paymentAuthority === null || element.paymentAuthority === '') {
        this.validate_lottery_puzzle_game__gambling_prize_bond[index].paymentAuthority_showError = true;
        validationSuccess = false;
      }
      if (element.grossWinningAmount === null || element.grossWinningAmount === '') {
        this.validate_lottery_puzzle_game__gambling_prize_bond[index].grossWinningAmount_showError = true;
        validationSuccess = false;
      }
      if (element.taxDeductedorCollected === null || element.taxDeductedorCollected === '') {
        this.validate_lottery_puzzle_game__gambling_prize_bond[index].taxDeductedorCollected_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_lottery_puzzle_game__gambling_prize_bond(i, formControlName) {
    if (formControlName === 'typeofWinning')
      this.validate_lottery_puzzle_game__gambling_prize_bond[i].typeofWinning_showError = false;
    if (formControlName === 'paymentAuthority')
      this.validate_lottery_puzzle_game__gambling_prize_bond[i].paymentAuthority_showError = false;
    if (formControlName === 'grossWinningAmount')
      this.validate_lottery_puzzle_game__gambling_prize_bond[i].grossWinningAmount_showError = false;
    if (formControlName === 'taxDeductedorCollected')
      this.validate_lottery_puzzle_game__gambling_prize_bond[i].taxDeductedorCollected_showError = false;
  }
  //lottery_puzzle_game__gambling_prize_bond validation end


  //any_other_income validation start

  validate_any_other_income = [];
  initialize_any_other_income_validation() {
    this.validate_any_other_income = [];
    this.anyOtherIncomeArray.forEach(element => {
      let data = {
        "particulars_showError": false,
        "paymentAuthority_showError": false,
        "date_showError": false,
        "grossAmountReceived_showError": false
      }
      this.validate_any_other_income.push(data);
    });
  }

  initialize_any_other_income_validation_error(i) {
    this.validate_any_other_income[i].particulars_showError = false;
    this.validate_any_other_income[i].paymentAuthority_showError = false;
    this.validate_any_other_income[i].date_showError = false;
    this.validate_any_other_income[i].grossAmountReceived_showError = false;
  }

  validation_checking_any_other_income(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.anyOtherIncomeArray.forEach((element, index) => {
      this.initialize_any_other_income_validation_error(index);
      if (element.particulars === null || element.particulars === '') {
        this.validate_any_other_income[index].particulars_showError = true;
        validationSuccess = false;
      }
      if (element.paymentAuthority === null || element.paymentAuthority === '') {
        this.validate_any_other_income[index].paymentAuthority_showError = true;
        validationSuccess = false;
      }
      if (element.date === null || element.date === '') {
        this.validate_any_other_income[index].date_showError = true;
        validationSuccess = false;
      }
      if (element.grossAmountReceived == null || element.grossAmountReceived === '') {
        this.validate_any_other_income[index].grossAmountReceived_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_any_other_income(i, formControlName) {
    if (formControlName === 'particulars')
      this.validate_any_other_income[i].particulars_showError = false;
    if (formControlName === 'paymentAuthority')
      this.validate_any_other_income[i].paymentAuthority_showError = false;
    if (formControlName === 'date')
      this.validate_any_other_income[i].date_showError = false;
    if (formControlName === 'grossAmountReceived')
      this.validate_any_other_income[i].grossAmountReceived_showError = false;
  }
  //any_other_income validation end

  //Net Income validation
  netIncome_showError = [];
  onNetIncomeKeyUp(i) {
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.netIncome === null || element.value.netIncome === '') {
          this.netIncome_showError[i] = true;
        }
        else this.netIncome_showError[i] = false;
      }
    });


  }
  //end



  //sro
  //IOS_Type_showError = [];
  sro_particulars_showError = [];
  sro_paymentAuthority_showError = [];
  sro_date_showError = [];
  sro_grossAmountReceived_showError = [];
  sro_sroNo_showError = [];
  sro_year_showError = [];
  sro_particularofSro_showError = [];
  sro_applicableTaxasperSro_showError = [];

  validateSRO(): any {
    let successValidation: boolean = true;
    let firstSroIndex: boolean = false;
    let firstSroIndexNumber: any = 0;
    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if (element.value.incomeType === 'income_exempted_reduced_by_sro') {
        if (element.value.particulars === null || element.value.particulars === '') {
          this.sro_particulars_showError[index] = true;
          successValidation = false;
        }
        if (element.value.paymentAuthority === null || element.value.paymentAuthority === '') {
          this.sro_paymentAuthority_showError[index] = true;
          successValidation = false;
        }
        if (element.value.date === null || element.value.date === '') {
          this.sro_date_showError[index] = true;
          successValidation = false;
        }
        if (element.value.grossAmountReceived === null || element.value.grossAmountReceived === '') {
          this.sro_grossAmountReceived_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sroNo === null || element.value.sroNo === '') {
          this.sro_sroNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.year === null || element.value.year === '') {
          this.sro_year_showError[index] = true;
          successValidation = false;
        }
        if (element.value.particularofSro === null || element.value.particularofSro === '') {
          this.sro_particularofSro_showError[index] = true;
          successValidation = false;
        }
        if (element.value.applicableTaxasperSro === null || element.value.applicableTaxasperSro === '') {
          this.sro_applicableTaxasperSro_showError[index] = true;
          successValidation = false;
        }

        if (!firstSroIndex) {
          firstSroIndex = true;
          firstSroIndexNumber = index;
        }

      }
    })
    if (!successValidation) return { "status": false, "indexNo": firstSroIndexNumber };
    else return { "status": true, "indexNo": "" };
  }

  initializeErrorIndexes(i) {
    //this.IOS_Type_showError[i] = false;
    this.netIncome_showError[i] = false;
    this.sro_particulars_showError[i] = false;
    this.sro_paymentAuthority_showError[i] = false;
    this.sro_date_showError[i] = false;
    this.sro_grossAmountReceived_showError[i] = false;
    this.sro_sroNo_showError[i] = false;
    this.sro_year_showError[i] = false;
    this.sro_particularofSro_showError[i] = false;
    this.sro_applicableTaxasperSro_showError[i] = false;
  }

  closeErrorIndexes(i) {
    //this.IOS_Type_showError.splice(i, 1);
    this.netIncome_showError.splice(i, 1);
    this.sro_particulars_showError.splice(i, 1);
    this.sro_paymentAuthority_showError.splice(i, 1);
    this.sro_date_showError.splice(i, 1);
    this.sro_grossAmountReceived_showError.splice(i, 1);
    this.sro_sroNo_showError.splice(i, 1);
    this.sro_year_showError.splice(i, 1);
    this.sro_particularofSro_showError.splice(i, 1);
    this.sro_applicableTaxasperSro_showError.splice(i, 1);
  }

  changeSRO(i, formControlName) {
    if (formControlName === 'particulars')
      this.sro_particulars_showError[i] = false;
    if (formControlName === 'paymentAuthority')
      this.sro_paymentAuthority_showError[i] = false;
    if (formControlName === 'date')
      this.sro_date_showError[i] = false;
    if (formControlName === 'grossAmountReceived')
      this.sro_grossAmountReceived_showError[i] = false;
    if (formControlName === 'sroNo')
      this.sro_sroNo_showError[i] = false;
    if (formControlName === 'year')
      this.sro_year_showError[i] = false;
    if (formControlName === 'particularofSro')
      this.sro_particularofSro_showError[i] = false;
    if (formControlName === 'applicableTaxasperSro')
      this.sro_applicableTaxasperSro_showError[i] = false;
  }

  // end sro

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
        //    console.log(error['error'].errorMessage);
          });
    });
  }


}


