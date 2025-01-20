import { Component, Renderer2, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debug } from 'console';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TemplateRef } from "@angular/core";

@Component({
  selector: 'app-assets-and-liabilities',
  templateUrl: './assets-and-liabilities.component.html',
  styleUrls: ['./assets-and-liabilities.component.css']
})
export class AssetsAndLiabilitiesComponent implements OnInit {

  hasAnyIncome: any;
  headsOfIncome = [];
  formArray: FormArray;
  selectedNavbar = [];
  mainNavActive = {};
  lengthOfheads: any;

  isSaveDraft: boolean = false;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  checkIsLoggedIn: any;

  isSummaryCollapsed = true;

  //#region Tooltip Text Section

  businessCapitalTooltip = `<span class="btn-block well-sm text-left">
  Closing balance of capital of your sole proprietorship business or profession and your share capital (if any) in various companies. You may calculate the closing capital of your sole proprietorship business or profession as: Opening capital + new capital - withdrawal + profit (or - loss).
  </span>`;

  nonAgriPropertyTooltip = `<span class="btn-block well-sm text-left">
  Description of your all non-agricultural tangible property (other than that used in your sole proprietorship business or profession) such as land, plot, apartment and other house property. Values of property must be at their cost including legal, registration and other related expenses.
  </span>`;

  agriPropertyTooltip = `<span class="btn-block well-sm text-left">
  Location, description and area of land used exclusively for agricultural purpose.
  </span>`;

  financialAssetsTooltip = `<span class="btn-block well-sm text-left">
  Financial assets include your shares, bonds, saving certificates and securities,  savings and deposit schemes (such as DPS & FDR), loan given to others and other investments.
  </span>`;

  motorCarTooltip = `<span class="btn-block well-sm text-left">
  Motor car owned by you or registered by your name.
  </span>`;

  goldDiamondTooltip = `<span class="btn-block well-sm text-left">
  Jewellery and other personal items of value owned by you.
  </span>`;

  furnitureTooltip = `<span class="btn-block well-sm text-left">
  Personal furniture, home equipment including refrigerator, AC, washing machine, and electronic gadgets including computers, mobile phone, camera, etc.
  </span>`;

  otherAssetsTooltip = `<span class="btn-block well-sm text-left">
  Paintings, art collections and other items of significant value.
  </span>`;

  outsideBusinessTooltip = `<span class="btn-block well-sm text-left">
  Your cash, balances with financial institutions, balances with mobile and other electronic financial services, fund balance, deposits and advance.
  </span>`;

  borrowingFromBankTooltip = `<span class="btn-block well-sm text-left">
  Debt balance in all banks and other financial institutions.
  </span>`;

  unsecuredLoanTooltip = `<span class="btn-block well-sm text-left">
  Any loan taken from non-institutional source such as from your spouse, parents, siblings, relatives, friends and colleagues.
  <strong>Attention!</strong> If the loan provider is someone other than your parents/ spouse, total allowable loan taking limit is 5 lakh Taka.
  </span>`;

  otherLoanTooltip = `<span class="btn-block well-sm text-left">
  Any overdraft (withdrawals more than deposit), any advance received or any loan against a fund or any other personal liability not covered earlier.
  </span>`;

  annualLivingExpenseTooltip = `<span class="btn-block well-sm text-left">
  Personal expenses incurred for meeting the cost of living of you and your dependants and tax paid during the income year. You may follow Form IT10BB for more information.
  </span>`;

  lossDeductionTooltip = `<span class="btn-block well-sm text-left">
  All losses in the nature of non-business (for example, you sold your personal car at a lower than purchase price, or you may have realized loss in share transfer), all deductions and charges (for example, bank charge and interest, BO account fees & charge) and all expenses (for example, special philanthropic expenses) that are not covered in Annual Living expense.
  </span>`;

  giftDonationTooltip = `<span class="btn-block well-sm text-left">
  All gifts (for example, gift to spouse, siblings or parents), all donations, and all contributions that are not shown in anywhere else.
  </span>`;

  incomeShownTooltip = `<span class="btn-block well-sm text-left">
  Total income as computed in the return.
  </span>`;

  taxExemptedTooltip = `<span class="btn-block well-sm text-left">
  All exempted income (for example, tax exempted foreign remittance), and tax exempted allowances (for example, medical allowances within exemption limit), that were not included in total income.
  </span>`;

  otherReceiptTooltip = `<span class="btn-block well-sm text-left">
  All Inflows of fund that do fall under ‘Income Shown in the Return’ or ‘Tax Exempted Income and Allowances’. For example, if you receive money as gift from your spouse, this will be treated as Other Receipts.
  </span>`;

  netWealthPreviousYearTooltip = `<span class="btn-block well-sm text-left">
  Your net wealth (asset – liabilities) on the last day of the previous income year. This is important to calculate the accretion of your net wealth in current income year.
  </span>`;


  //#endregion


  //PreviousNetWealth
  isPreviousYearNetWealthCollapsed = false;
  isPreviousYearNetWealth = [];

  maxDate: any;

  postRequestBody: any;
  getDataReqBody: any;
  userTin: any;

  //Asset
  isAssetsCollapsed = false;
  isAssets = [];

  //business
  isBusinessCapital = [];

  // Business Director
  businessDirectorArray = [];
  newBusinessDirector: any = {};
  isBusinessDirectorDeleteActionShow: boolean;

  //Business Other
  businessOtherArray = [];
  newBusinessOther: any = {};
  isBusinessOtherDeleteActionShow: boolean;

  //non agriculture Parent
  isNonAgriculture = [];

  // Non agriculture Child
  nonAgriPropertyArray = [];
  newNonAgriProperty: any = {};
  isNonAgriPropertyDeleteActionShow: boolean;

  //Advance Non Agri
  advanceNonAgriPropertyArray = [];
  newAdvanceNonAgriProperty: any = {};
  isAdvanceNonAgriPropertyDeleteActionShow: boolean;

  //agriculture
  agriPropertyArray = [];
  newAgriProperty: any = {};
  isAgriPropertyDeleteActionShow: boolean;

  //Financial Assets Value
  isFinancial = [];

  //Financial Share, Debenture etc.
  financialShareArray = [];
  newFinancialShare: any = {};
  isFinancialShareDeleteActionShow: boolean;

  //Financial Savings Certificate, Bonds and other Government Securities
  financialSavingsArray = [];
  newFinancialSavings: any = {};
  isFinancialSavingsDeleteActionShow: boolean;

  //Financial Fix Deposits, Term Deposits and DPS
  financialDepositsArray = [];
  newFinancialDeposits: any = {};
  isFinancialDepositsDeleteActionShow: boolean;

  //Financial Loans Given to others
  financialLoansArray = [];
  newFinancialLoans: any = {};
  isFinancialLoansDeleteActionShow: boolean;

  //Other Financial Assets
  financialOtherArray = [];
  newFinancialOther: any = {};
  isFinancialOtherDeleteActionShow: boolean;

  //Motor Car
  motorCarArray = [];
  newMotorCar: any = {};
  isMotorCarDeleteActionShow: boolean;

  //Gold, Diamond, Other Jewellery
  jewelleryArray = [];
  newJewellery: any = {};
  isJewelleryDeleteActionShow: boolean;

  //Furniture and Equipments
  furnitureArray = [];
  newFurniture: any = {};
  isFurnitureDeleteActionShow: boolean;

  //Other Assets of Significant Value
  otherAssetsArray = [];
  newOtherAssets: any = {};
  isOtherAssetsDeleteActionShow: boolean;

  //Cash and Fund outside Business
  isCashFundOutsideBusiness = [];

  // Notes & Currencies
  notesCurrenciesArray = [];
  newNotesCurrencies: any = {};
  isNotesCurrenciesDeleteActionShow: boolean;

  //  Banks, Cards And Other Electronic Cash
  electronicCashArray = [];
  newElectronicCashRow: any = {};
  isElectronicCashDeleteActionShow: boolean;

  //  Provident Fund and Other Fund
  fundArray = [];
  newFundRow: any = {};
  isFundDeleteActionShow: boolean;

  //  Other Deposits, Balance and Advance
  outsideDepositsArray = [];
  newOutsideDepositsRow: any = {};
  isOutsideDepositsDeleteActionShow: boolean;

  //Liabilities (Outside Business)
  isLiabilitiesCollapsed = false;
  isLiabilities = [];

  //Borrowing from Bank or other FI
  liabilitiesBorrowArray = [];
  newLiabilitiesBorrow: any = {};
  isLiabilitiesBorrowDeleteActionShow: boolean;

  // Unsecured Loan
  liabilitiesUnsecuredLoanArray = [];
  newLiabilitiesUnsecuredLoan: any = {};
  isLiabilitiesUnsecuredLoanDeleteActionShow: boolean;

  // Other Loan or Overdraft
  liabilitiesOtherArray = [];
  newLiabilitiesOther: any = {};
  isLiabilitiesOtherDeleteActionShow: boolean;

  //Other Outflow
  isOutflowCollapsed = false;
  isOutflow = [];

  //Loss, Deduction, Other Expense
  outflowLossArray = [];
  newOutflowLoss: any = {};
  isOutflowLossDeleteActionShow: boolean;

  // Gift, Donation and Contribution
  outflowGiftArray = [];
  newOutflowGift: any = {};
  isOutflowGiftDeleteActionShow: boolean;

  //Sources of Fund
  isSourceFundCollapsed = false;
  isSourceFund = [];

  // Other Receipts
  sourceFundReceiptsArray = [];
  newSourceFundReceipts: any = {};
  isSourceFundReceiptsDeleteActionShow: boolean;

  //All Checked Property
  isCheckedBusinessCapital: boolean = false;
  isCheckedDirectorShareholdings: boolean = false;
  isCheckedBusinessCapitalOtherThanDirectorShareholdings: boolean = false;
  isCheckedNonAgriPropertyParent: boolean = false;
  isCheckedNonAgriPropertyChild: boolean = false;
  ischeckedAdvanceMadeNonAgriProperty: boolean = false;
  isCheckedAgriProperty: boolean = false;
  isCheckedFinancialAssets: boolean = false;
  isCheckedShareDebentureEtc: boolean = false;
  isCheckedSavingsCertificate: boolean = false;
  isCheckedFixDepositTermDeposit: boolean = false;
  isCheckedLoanGiven: boolean = false;
  isCheckedOtherFinancial: boolean = false;
  isCheckedMotorCar: boolean = false;
  isCheckedGoldDiamond: boolean = false;
  isCheckedFurnitureEquipment: boolean = false;
  isCheckedOtherAssets: boolean = false;
  isCheckedCashFundOutsideBusiness: boolean = false;
  isCheckedNotesCurrencies: boolean = false;
  isCheckedBankCard: boolean = false;
  isCheckedProvidentFund: boolean = false;
  isCheckedOtherDepositBalance: boolean = false;
  isCheckedBorrowingFromBank: boolean = false;
  isCheckedUnsecuredLoan: boolean = false;
  isCheckedOtherLoanOrOverdraft: boolean = false;
  isCheckedAnnualLivingExpense: boolean = false;
  isCheckedLossDeductionOtherExpense: boolean = false;
  isCheckedGiftDonationContribution: boolean = false;
  isCheckedIncomeShownInTheTown: boolean = false;
  isCheckedTaxExemptedIncome: boolean = false;
  isCheckedOtherReceipts: boolean = false;
  isSetoffLossExists: boolean = false;
  isCheckedPreviousYearNetWealth: boolean = false;


  // Summary field variable initialization start

  bc_directors_shareholdings_tg: any;
  bc_other_than_directors_shareholdings_tg: any;
  non_agri_property_tg: any;
  advance_made_non_agri_property_tg: any;
  agri_property_tg: any;
  fa_share_debenture_etc_tg: any;
  fa_savings_certificate_tg: any;
  fa_fix_deposit_tg: any;
  fa_loans_given_tg: any;
  fa_other_financial_assets_tg: any;
  motor_car_tg: any;
  gold_Diamond_tg: any;
  furniture_equipments_tg: any;
  other_assets_tg: any;
  cfob_notes_currencies_tg: any;
  //cfob_electronic_cash_tg: any;
  cfob_provident_fund_tg: any;
  cfob_other_deposits_tg: any

  borrowing_from_bank_tl: any;
  unsecured_loan_tl: any;
  other_loan_tl: any;

  annual_living_expense_other_outflow: any;
  loss_deduction_other_expense_other_outflow: any;
  gift_donation_and_contribution_other_outflow: any;

  income_shown_in_return_sources_of_fund: any;
  tax_exempted_income_and_allowances_sources_of_fund: any;
  other_receipts_sources_of_fund: any;

  totalGrossWealth: any;
  totalLiabilities: any;
  totalNetWealth: any;
  Change_in_net_wealth: any;
  other_fund_outflow: any;
  total_fund_outflow: any;
  sources_of_fund: any;
  difference: any;


  previousIncomeYearNetWealth: any;


  // Summary field variable initialization end

  group: FormGroup;

  requestNavbarGetData: any;
  additionalInformationForm: FormGroup;
  requestIncomeHeadGetData: any;
  formGroup: FormGroup;

  otherReceiptData: any;

  incomeYearFrom:any;
  incomeYearTo:any;
  minDateLen:any;
  maxDateLen:any;
  includeBankAccountDetails : boolean= false;
  isShow: boolean = true;
  constructor(
    private fb: FormBuilder,
    private mainNavbarList: mainNavbarListService,
    private headService: HeadsOfIncomeService,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private commaSeparator : CommaSeparatorService,
    private modalService: BsModalService,
    private renderer: Renderer2) {
    this.formArray = new FormArray([]);
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  mainNavActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.mainNavActive = x;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.getHeadsOfIncome();
    // this.insertFormGroupToArray();
    this.getMainNavbar();
    this.mainNavActiveSelect('5');
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    this.userTin = localStorage.getItem('tin');
    this.hasAnyIncome = localStorage.getItem('hasAnyIncome');

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    // this.loadAll_navbar_on_Page_reload();
    //#endregion


    //tax payment page data
    //this.getTaxPaymentData();

    //#region all initialize

    //businessDirector
    this.businessDirectorArray = [];
    this.newBusinessDirector = { businessDirectorCompany: "", businessDirectorAcquisition: "", businessDirectorShares: "", businessDirectorValue: "" };
    this.businessDirectorArray.push(this.newBusinessDirector);
    this.isBusinessDirectorDeleteActionShow = false;

    //businessOther
    this.businessOtherArray = [];
    this.newBusinessOther = { businessOtherProfession: "", businessOtherCapital: "" };
    this.businessOtherArray.push(this.newBusinessDirector);
    this.isBusinessOtherDeleteActionShow = false;

    //nonAgriProperty
    this.nonAgriPropertyArray = [];
    this.newNonAgriProperty = { nonAgriPropertyLocation: "", nonAgriPropertyAcquisition: "", nonAgriPropertyArea: "", unitOfArea:"", nonAgriPropertyValueStart: "", nonAgriPropertyValueEnd: "" };
    this.nonAgriPropertyArray.push(this.newNonAgriProperty);
    this.isNonAgriPropertyDeleteActionShow = false;

    //advanceNonAgriProperty
    this.advanceNonAgriPropertyArray = [];
    this.newAdvanceNonAgriProperty = { advanceNonAgriPropertyLocation: "", advanceNonAgriPropertyAcquisition: "", advanceNonAgriPropertyValueStart: "", advanceNonAgriPropertyValueEnd: "" };
    this.advanceNonAgriPropertyArray.push(this.newAdvanceNonAgriProperty);
    this.isAdvanceNonAgriPropertyDeleteActionShow = false;

    //agriculture
    this.agriPropertyArray = [];
    this.newAgriProperty = { agriPropertyLocation: "", agriPropertyAcquisition: "", agriPropertyArea: "", unitOfAgriArea:"", agriPropertyValueStart: "", agriPropertyValueEnd: "" };
    this.agriPropertyArray.push(this.newAdvanceNonAgriProperty);
    this.isAgriPropertyDeleteActionShow = false;

    //Financial Share
    this.financialShareArray = [];
    this.newFinancialShare = { financialShareBO: "", financialShareAcquisition: "", financialShareBrokerage: "", financialShareValue: "" };
    this.financialShareArray.push(this.newFinancialShare);
    this.isFinancialShareDeleteActionShow = false;

    //Financial Savings
    this.financialSavingsArray = [];
    this.newFinancialSavings = { financialSavingsSecurity: "", financialSavingsIssueNo: "", financialSavingsIssueDate: "", financialSavingsValue: "" };
    this.financialSavingsArray.push(this.newFinancialSavings);
    this.isFinancialSavingsDeleteActionShow = false;

    //Financial deposit
    this.financialDepositsArray = [];
    this.newFinancialDeposits = { financialDepositsParticulars: "", financialDepositsAcquisition: "", financialDepositsBankName: "", financialDepositsAccount: "", financialDepositsBalance: "" };
    this.financialDepositsArray.push(this.newFinancialDeposits);
    this.isFinancialDepositsDeleteActionShow = false;

    //Financial Loans
    this.financialLoansArray = [];
    this.newFinancialLoans = { financialLoansParticulars: "", financialLoansBorrowerName: "", financialLoansBorrowerTIN: "", financialLoansAmount: "" };
    this.financialLoansArray.push(this.newFinancialLoans);
    this.isFinancialLoansDeleteActionShow = false;

    //Financial Other assets
    this.financialOtherArray = [];
    this.newFinancialOther = { financialOtherParticulars: "", financialOtherAcquisition: "", financialOtherDetails: "", financialOtherAmount: "" };
    this.financialOtherArray.push(this.newFinancialOther);
    this.isFinancialOtherDeleteActionShow = false;

    //Motor Car
    this.motorCarArray = [];
    this.newMotorCar = { motorCarParticulars: "", motorCarAcquisition: "", motorCarEngine: "", engineType: "", motorCarRegistration: "", motorCarAmount: "" };
    this.motorCarArray.push(this.newMotorCar);
    this.isMotorCarDeleteActionShow = false;

    //Gold, Diamond, Other Jewellery
    this.jewelleryArray = [];
    this.newJewellery = { jewelleryParticulars: "", jewelleryAcquisition: "", jewelleryQuantityEnd: "", unitOfJewellery:"", jewelleryValue: "" };
    this.jewelleryArray.push(this.newJewellery);
    this.isJewelleryDeleteActionShow = false;

    //Furniture and Equipments
    this.furnitureArray = [];
    this.newFurniture = { FurnitureParticulars: "", FurnitureAcquisition: "", FurnitureQuantity: "", FurnitureValue: "" };
    this.furnitureArray.push(this.newFurniture);
    this.isFurnitureDeleteActionShow = false;

    //Other Assets of Significant Value
    this.otherAssetsArray = [];
    this.newOtherAssets = { otherAssetsParticulars: "", otherAssetsAcquisition: "", otherAssetsDetail: "", otherAssetsValue: "" };
    this.otherAssetsArray.push(this.newOtherAssets);
    this.isOtherAssetsDeleteActionShow = false;

    //Notes Currency
    this.notesCurrenciesArray = [];
    this.newNotesCurrencies = { notesCurrenciesAmount: "" };
    this.notesCurrenciesArray.push(this.newNotesCurrencies);
    this.isNotesCurrenciesDeleteActionShow = false;

    //Electronic Cash
    this.electronicCashArray = [];
    this.newElectronicCashRow = { electronicCashFI: "", electronicCashFIName: "", electronicCashAccountCardNo: "", electronicCashBalance: "" };
    this.electronicCashArray.push(this.newElectronicCashRow);
    this.isElectronicCashDeleteActionShow = false;

    //Provident Fund
    this.fundArray = [];
    this.newFundRow = { fundParticulars: "", fundAccount: "", fundBalance: "" };
    this.fundArray.push(this.newFundRow);
    this.isFundDeleteActionShow = false;

    //Other Deposits, Balance and Advance
    this.outsideDepositsArray = [];
    this.newOutsideDepositsRow = { outsideDepositsParticulars: "", outsideDepositsBalance: "" };
    this.outsideDepositsArray.push(this.newOutsideDepositsRow);
    this.isOutsideDepositsDeleteActionShow = false;

    //Borrowing from Bank or other FI
    this.liabilitiesBorrowArray = [];
    this.newLiabilitiesBorrow = { liabilitiesBorrowBankName: "", liabilitiesBorrowAccount: "", liabilitiesBorrowPurpose: "", liabilitiesBorrowBalance: "" };
    this.liabilitiesBorrowArray.push(this.newLiabilitiesBorrow);
    this.isLiabilitiesBorrowDeleteActionShow = false;

    // Unsecured Loan
    this.liabilitiesUnsecuredLoanArray = [];
    this.newLiabilitiesUnsecuredLoan = { liabilitiesUnsecuredLoanName: "", liabilitiesUnsecuredLoanTIN: "", liabilitiesUnsecuredLoanPurpose: "", liabilitiesUnsecuredLoanBalance: "" };
    this.liabilitiesUnsecuredLoanArray.push(this.newLiabilitiesUnsecuredLoan);
    this.isLiabilitiesUnsecuredLoanDeleteActionShow = false;

    // Other Loan or Overdraft
    this.liabilitiesOtherArray = [];
    this.newLiabilitiesOther = { liabilitiesOtherParticulars: "", liabilitiesOtherLoan: "", liabilitiesOtherDetail: "", liabilitiesOtherBalance: "" };
    this.liabilitiesOtherArray.push(this.newLiabilitiesOther);
    this.isLiabilitiesOtherDeleteActionShow = false;

    //Loss, Deduction, Other Expense
    this.outflowLossArray = [];
    this.newOutflowLoss = { outflowLossLocation: "", outflowLossAmount: "" };
    this.outflowLossArray.push(this.newOutflowLoss);
    this.isOutflowLossDeleteActionShow = false;

    // Gift, Donation and Contribution
    this.outflowGiftArray = [];
    this.newOutflowGift = { outflowGiftParticulars: "", outflowGiftName: "", outflowGiftTIN: "", outflowGiftAmount: "" };
    this.outflowGiftArray.push(this.newOutflowGift);
    this.isOutflowGiftDeleteActionShow = false;

    // Other Receipts
    // if (!(this.sourceFundReceiptsArray.length > 0)) {
    //   this.sourceFundReceiptsArray = [];
    //   this.newSourceFundReceipts = { sourceFundReceiptsParticulars: "", sourceFundReceiptsReference: "", sourceFundReceiptsAmount: "" };
    //   this.sourceFundReceiptsArray.push(this.newSourceFundReceipts);
    //   this.isSourceFundReceiptsDeleteActionShow = false;
    // }

    //#endregion

    // summary calculation
    this.previousIncomeYearNetWealth = 0;
    this.totalGrossWealth = 0;
    this.totalLiabilities = 0;
    this.totalNetWealth = 0;
    this.Change_in_net_wealth = 0;
    this.other_fund_outflow = 0;
    this.total_fund_outflow = 0;
    this.sources_of_fund = 0;
    this.difference = 0;

    this.getTaxPaymentData()
      .then(() => this.getAssetsLiabilitiesData());

    //this.getAssetsLiabilitiesData();
    this.checkSubmissionStatus();
    // this.populateOtherReceiptData();
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
      taxExemptedIncome:[false],
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
          // this.lengthOfheads = this.headsOfIncome.length;
        });
        this.loadAll_navbar_on_Page_reload();
      })
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
          this.incomeYearFrom = getAdditional_info_data.startOfIncomeYr;
          this.minDateLen = new Date(this.incomeYearFrom.substring(6, 12),parseInt(this.incomeYearFrom.substring(3, 5))-1,this.incomeYearFrom.substring(0, 2));
          this.incomeYearTo = getAdditional_info_data.endOfIncomeYr;
          this.maxDateLen = new Date(this.incomeYearTo.substring(6, 12),parseInt(this.incomeYearTo.substring(3, 5))-1,this.incomeYearTo.substring(0, 2));

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
          this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Assets and Liabilities');
        }

        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        this.lengthOfheads = this.selectedNavbar.length;
      })

  }

  insertFormGroupToArray() {
    this.group = new FormGroup({
      //business director
      businessDirectorCompany: new FormControl(),
      businessDirectorAcquisition: new FormControl('Purchased'),
      businessDirectorShares: new FormControl(),
      businessDirectorValue: new FormControl(),

      //business other
      businessOtherProfession: new FormControl(),
      businessOtherCapital: new FormControl(),

      //non agri property
      nonAgriPropertyLocation: new FormControl(),
      nonAgriPropertyAcquisition: new FormControl('Purchased'),
      nonAgriPropertyArea: new FormControl(),
      unitOfArea: new FormControl(),
      nonAgriPropertyValueStart: new FormControl(),
      nonAgriPropertyValueEnd: new FormControl(),

      //advance non agri property
      advanceNonAgriPropertyLocation: new FormControl(),
      advanceNonAgriPropertyAcquisition: new FormControl('Purchased'),
      advanceNonAgriPropertyValueStart: new FormControl(),
      advanceNonAgriPropertyValueEnd: new FormControl(),

      //agri property
      agriPropertyLocation: new FormControl(),
      agriPropertyAcquisition: new FormControl('Purchased'),
      agriPropertyArea: new FormControl(),
      unitOfAgriArea: new FormControl(),
      agriPropertyValueStart: new FormControl(),
      agriPropertyValueEnd: new FormControl(),

      //financial- Share, Debenture etc.
      financialShareBO: new FormControl(),
      financialShareAcquisition: new FormControl('Purchased'),
      financialShareBrokerage: new FormControl(),
      financialShareValue: new FormControl(),

      //financial- Savings Certificate, Bonds and other Government Securities
      financialSavingsSecurity: new FormControl('Sanchayapatra'),
      financialSavingsIssueNo: new FormControl(),
      financialSavingsIssueDate: new FormControl(),
      financialSavingsValue: new FormControl(),

      //financial- Fix Deposits, Term Deposits and DPS
      financialDepositsParticulars: new FormControl(),
      financialDepositsAcquisition: new FormControl('Purchased'),
      financialDepositsBankName: new FormControl(),
      financialDepositsAccount: new FormControl(),
      financialDepositsBalance: new FormControl(),

      //financial- Loans Given to others
      financialLoansParticulars: new FormControl(),
      financialLoansBorrowerName: new FormControl(),
      financialLoansBorrowerTIN: new FormControl(),
      financialLoansAmount: new FormControl(),

      //financial- Other Financial Assets
      financialOtherParticulars: new FormControl(),
      financialOtherAcquisition: new FormControl('Purchased'),
      financialOtherDetails: new FormControl(),
      financialOtherAmount: new FormControl(),

      //Motor Car
      motorCarParticulars: new FormControl(),
      motorCarAcquisition: new FormControl('Purchased'),
      engineType: new FormControl(),
      motorCarEngine: new FormControl(),
      motorCarRegistration: new FormControl(),
      motorCarAmount: new FormControl(),

      //Gold, Diamond, Other Jewellery
      jewelleryParticulars: new FormControl('Gold'),
      jewelleryAcquisition: new FormControl('Purchased'),
      unitOfJewellery: new FormControl(),
      jewelleryQuantityEnd: new FormControl(),
      jewelleryValue: new FormControl('Values'),

      //Furniture, Equipments and Electronic Items
      FurnitureParticulars: new FormControl(),
      FurnitureAcquisition: new FormControl('Purchased'),
      FurnitureQuantity: new FormControl(),
      FurnitureValue: new FormControl(),

      //Other Assets of Significant Value
      otherAssetsParticulars: new FormControl(),
      otherAssetsAcquisition: new FormControl('Purchased'),
      otherAssetsDetail: new FormControl(),
      otherAssetsValue: new FormControl(),

      //Notes & Currencies
      notesCurrenciesAmount: new FormControl(),

      //Banks, Cards And Other Electronic Cash
      electronicCashFI: new FormControl('Account'),
      electronicCashFIName: new FormControl(),
      electronicCashAccountCardNo: new FormControl(),
      electronicCashBalance: new FormControl(),

      // Provident Fund and Other Fund
      fundParticulars: new FormControl(),
      fundAccount: new FormControl(),
      fundBalance: new FormControl(),

      //Other Deposits, Balance and Advance
      outsideDepositsParticulars: new FormControl(),
      outsideDepositsBalance: new FormControl(),

      //Borrowing from Bank or other FI
      liabilitiesBorrowBankName: new FormControl(),
      liabilitiesBorrowAccount: new FormControl(),
      liabilitiesBorrowPurpose: new FormControl(),
      liabilitiesBorrowBalance: new FormControl(),

      //Unsecured Loan
      liabilitiesUnsecuredLoanName: new FormControl(),
      liabilitiesUnsecuredLoanTIN: new FormControl(),
      liabilitiesUnsecuredLoanPurpose: new FormControl(),
      liabilitiesUnsecuredLoanBalance: new FormControl(),

      //Other Loan or Overdraft
      liabilitiesOtherParticulars: new FormControl(),
      liabilitiesOtherLoan: new FormControl(),
      liabilitiesOtherDetail: new FormControl(),
      liabilitiesOtherBalance: new FormControl(),

      //Annual Living Expense
      outflowLivingExpense: new FormControl(),

      //Loss, Deduction, Other Expense
      outflowLossLocation: new FormControl(),
      outflowLossAmount: new FormControl(),

      //Gift, Donation and Contribution
      outflowGiftParticulars: new FormControl('Gift'),
      outflowGiftName: new FormControl(),
      outflowGiftTIN: new FormControl(),
      outflowGiftAmount: new FormControl(),

      //Income Shown in the Return
      sourceFundIncome: new FormControl(),

      //Tax Exempted Income and Allowances
      taxExemptedIncomeAndAllowances: new FormControl('0'),

      // Other Receipts
      sourceFundReceiptsParticulars: new FormControl(),
      sourceFundReceiptsReference: new FormControl(),
      sourceFundReceiptsAmount: new FormControl(),

      //Previous Income Year Net Wealth

      PreviousIncomeYearNetWealth: new FormControl(),

    })
    this.formArray.push(this.group);
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
    this.lengthOfheads = this.selectedNavbar.length;
  }

  getAssetsLiabilitiesData(): Promise<void> {
    let getData: any;
    this.getDataReqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/user-panel/get_alsummary')
        .subscribe(result => {

          if (result.replyMessage.alParticularsDtos.length > 0) {

            getData = result.replyMessage;
            let outflowLivingExpenseValue: any;
            let PreviousIncomeYearNetWealth: any;

            if (getData != null) {
              getData.alParticularsDtos.forEach(element => {
                //#region Assets
                if (element.typeKey === 'assets') {
                  this.isAssetsCollapsed = element.typeValue;
                  //#region Business Capital
                  if (element.firstSubTypeKey === 'business_capital') {
                    this.isCheckedBusinessCapital = element.firstSubTypeValue;
                    this.isAssets[0] = this.isCheckedBusinessCapital;
                    if (element.secondSubTypeKey === "director_shareholdings_in_limited_companies") {
                      this.isCheckedDirectorShareholdings = element.secondSubTypeValue;
                      this.isBusinessCapital[0] = this.isCheckedDirectorShareholdings;
                      let businessDirectorArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          businessDirectorCompany: nesElement.name,
                          businessDirectorAcquisition: nesElement.type,
                          businessDirectorShares: this.commaSeparator.currencySeparatorBD(nesElement.otherInfo),
                          businessDirectorValue: this.commaSeparator.currencySeparatorBD(nesElement.value)
                        }
                        businessDirectorArrayGet.push(obj);
                        if (i > 0) {
                          this.isBusinessDirectorDeleteActionShow = true;
                        }
                      });
                      this.businessDirectorArray = businessDirectorArrayGet;
                      this.initialize_director_shareholdings_in_limited_companies_validation();
                    }
                    if (element.secondSubTypeKey === "business_capital_other_than_director's_shareholdings_in_limited_companies") {
                      this.isCheckedBusinessCapitalOtherThanDirectorShareholdings = element.secondSubTypeValue;
                      this.isBusinessCapital[1] = this.isCheckedBusinessCapitalOtherThanDirectorShareholdings;
                      let businessOtherArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          businessOtherProfession: nesElement.name,
                          businessOtherCapital: this.commaSeparator.currencySeparatorBD(nesElement.value)
                        }
                        businessOtherArrayGet.push(obj);
                        if (i > 0) {
                          this.isBusinessOtherDeleteActionShow = true;
                        }

                      });
                      this.businessOtherArray = businessOtherArrayGet;
                      this.initialize_business_capital_other_than_director_shareholdings_in_limited_companies_validation();
                    }
                  }
                  //#endregion

                  //#region Non Agriculture Property
                  if (element.firstSubTypeKey === 'non_agricultural_property_parent') {
                    this.isCheckedNonAgriPropertyParent = element.firstSubTypeValue;
                    this.isAssets[1] = this.isCheckedNonAgriPropertyParent;
                    if (element.secondSubTypeKey === "non_agricultural_property_child") {
                      this.isCheckedNonAgriPropertyChild = element.secondSubTypeValue;
                      this.isNonAgriculture[0] = this.isCheckedNonAgriPropertyChild;
                      let nonAgriPropertyArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          nonAgriPropertyLocation: nesElement.description,
                          nonAgriPropertyAcquisition: nesElement.type,
                          nonAgriPropertyArea: nesElement.otherInfo,
                          unitOfArea: nesElement.name,
                          nonAgriPropertyValueStart: this.commaSeparator.currencySeparatorBD(nesElement.startYrAmount),
                          nonAgriPropertyValueEnd: this.commaSeparator.currencySeparatorBD(nesElement.endYrAmount)
                        }
                        nonAgriPropertyArrayGet.push(obj);
                        if (i > 0) {
                          this.isNonAgriPropertyDeleteActionShow = true;
                        }

                      });
                      this.nonAgriPropertyArray = nonAgriPropertyArrayGet;
                      this.initialize_non_agricultural_property_parent_validation();
                    }
                    if (element.secondSubTypeKey === "advance_made_for_non_agricultural_property") {
                      this.ischeckedAdvanceMadeNonAgriProperty = element.secondSubTypeValue;
                      this.isNonAgriculture[1] = this.ischeckedAdvanceMadeNonAgriProperty;
                      let advanceNonAgriPropertyArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          advanceNonAgriPropertyLocation: nesElement.description,
                          advanceNonAgriPropertyAcquisition: nesElement.type,
                          advanceNonAgriPropertyValueStart: this.commaSeparator.currencySeparatorBD(nesElement.startYrAmount),
                          advanceNonAgriPropertyValueEnd: this.commaSeparator.currencySeparatorBD(nesElement.endYrAmount)
                        }
                        advanceNonAgriPropertyArrayGet.push(obj);
                        if (i > 0) {
                          this.isAdvanceNonAgriPropertyDeleteActionShow = true;
                        }

                      });
                      this.advanceNonAgriPropertyArray = advanceNonAgriPropertyArrayGet;
                      this.initialize_advance_made_for_non_agricultural_property_validation();
                    }
                  }
                  //#endregion

                  //#region Agriculture Property
                  if (element.firstSubTypeKey === 'agricultural_property') {
                    this.isCheckedAgriProperty = element.firstSubTypeValue;
                    this.isAssets[2] = this.isCheckedAgriProperty;

                    let agriPropertyArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        agriPropertyLocation: nesElement.description,
                        agriPropertyAcquisition: nesElement.type,
                        agriPropertyArea: nesElement.otherInfo,
                        unitOfAgriArea: nesElement.name,
                        agriPropertyValueStart: this.commaSeparator.currencySeparatorBD(nesElement.startYrAmount),
                        agriPropertyValueEnd: this.commaSeparator.currencySeparatorBD(nesElement.endYrAmount)
                      }
                      agriPropertyArrayGet.push(obj);
                      if (i > 0) {
                        this.isAgriPropertyDeleteActionShow = true;
                      }

                    });
                    this.agriPropertyArray = agriPropertyArrayGet;
                    this.initialize_agricultural_property_validation();
                  }
                  //#endregion

                  //#region Financial Assets
                  if (element.firstSubTypeKey === 'financial_assets') {
                    this.isCheckedFinancialAssets = element.firstSubTypeValue;
                    this.isAssets[3] = this.isCheckedFinancialAssets;
                    if (element.secondSubTypeKey === "share_debenture_etc") {
                      this.isCheckedShareDebentureEtc = element.secondSubTypeValue;
                      // this.isFinancial[0] = this.isCheckedDirectorShareholdings;
                      this.isFinancial[0] = this.isCheckedShareDebentureEtc;
                      let financialShareArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          financialShareBO: nesElement.relatedIN,
                          financialShareAcquisition: nesElement.type,
                          financialShareBrokerage: nesElement.name,
                          financialShareValue: this.commaSeparator.currencySeparatorBD(nesElement.value)
                        }
                        financialShareArrayGet.push(obj);
                        if (i > 0) {
                          this.isFinancialShareDeleteActionShow = true;
                        }
                      });
                      this.financialShareArray = financialShareArrayGet;
                      this.initialize_share_debenture_etc_validation();
                    }
                    if (element.secondSubTypeKey === "savings_certificate_bonds_and_other_government_securities") {
                      this.isCheckedSavingsCertificate = element.secondSubTypeValue;
                      this.isFinancial[1] = this.isCheckedSavingsCertificate;
                      let financialSavingsArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          financialSavingsIssueNo: nesElement.relatedIN,
                          financialSavingsSecurity: nesElement.type,
                          financialSavingsIssueDate: nesElement.dateOfIssue,
                          financialSavingsValue: this.commaSeparator.currencySeparatorBD(nesElement.value)
                        }
                        financialSavingsArrayGet.push(obj);
                        if (i > 0) {
                          this.isFinancialSavingsDeleteActionShow = true;
                        }

                      });
                      this.financialSavingsArray = financialSavingsArrayGet;
                      this.initialize_savings_certificate_bonds_and_other_government_securities_validation();
                    }
                    if (element.secondSubTypeKey === "fix_deposits_term_deposits_and_dps") {
                      this.isCheckedFixDepositTermDeposit = element.secondSubTypeValue;
                      this.isFinancial[2] = this.isCheckedFixDepositTermDeposit;
                      let financialDepositsArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          financialDepositsAccount: nesElement.relatedIN,
                          financialDepositsAcquisition: nesElement.type,
                          financialDepositsBalance: this.commaSeparator.currencySeparatorBD(nesElement.value),
                          financialDepositsBankName: nesElement.name,
                          financialDepositsParticulars: nesElement.description
                        }
                        financialDepositsArrayGet.push(obj);
                        if (i > 0) {
                          this.isFinancialDepositsDeleteActionShow = true;
                        }

                      });
                      this.financialDepositsArray = financialDepositsArrayGet;
                      this.initialize_fix_deposits_term_deposits_and_dps_validation();
                    }
                    if (element.secondSubTypeKey === "loans_given_to_others") {
                      this.isCheckedLoanGiven = element.secondSubTypeValue;
                      this.isFinancial[3] = this.isCheckedLoanGiven;
                      let financialLoansArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          financialLoansBorrowerName: nesElement.name,
                          financialLoansParticulars: nesElement.description,
                          financialLoansAmount: this.commaSeparator.currencySeparatorBD(nesElement.value),
                          financialLoansBorrowerTIN: nesElement.relatedIN
                        }
                        financialLoansArrayGet.push(obj);
                        if (i > 0) {
                          this.isFinancialLoansDeleteActionShow = true;
                        }

                      });
                      this.financialLoansArray = financialLoansArrayGet;
                      this.initialize_loans_given_to_others_validation();
                    }
                    if (element.secondSubTypeKey === "other_financial_assets") {
                      this.isCheckedOtherFinancial = element.secondSubTypeValue;
                      this.isFinancial[4] = this.isCheckedOtherFinancial;
                      let financialOtherArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          financialOtherAcquisition: nesElement.type,
                          financialOtherParticulars: nesElement.description,
                          financialOtherAmount: this.commaSeparator.currencySeparatorBD(nesElement.value),
                          financialOtherDetails: nesElement.otherInfo
                        }
                        financialOtherArrayGet.push(obj);
                        if (i > 0) {
                          this.isFinancialOtherDeleteActionShow = true;
                        }

                      });
                      this.financialOtherArray = financialOtherArrayGet;
                      this.initialize_other_financial_assets_validation();
                    }
                  }
                  //#endregion

                  //#region Motor Car
                  if (element.firstSubTypeKey === 'motor_car') {
                    this.isCheckedMotorCar = element.firstSubTypeValue;
                    this.isAssets[4] = this.isCheckedMotorCar;

                    let motorCarArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        engineType: nesElement.name,
                        motorCarAcquisition: nesElement.type,
                        motorCarEngine: nesElement.otherInfo,
                        motorCarParticulars: nesElement.description,
                        motorCarAmount: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        motorCarRegistration: nesElement.relatedIN
                      }
                      motorCarArrayGet.push(obj);
                      if (i > 0) {
                        this.isMotorCarDeleteActionShow = true;
                      }

                    });
                    this.motorCarArray = motorCarArrayGet;
                    this.initialize_motor_car_validation();
                  }
                  //#endregion

                  //#region Gold Diamond
                  if (element.firstSubTypeKey === 'gold_diamond_gems_and_other_items') {
                    this.isCheckedGoldDiamond = element.firstSubTypeValue;
                    this.isAssets[5] = this.isCheckedGoldDiamond;

                    let jewelleryArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        jewelleryAcquisition: nesElement.type,
                        jewelleryValue: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        jewelleryParticulars: nesElement.description,
                        unitOfJewellery: nesElement.name,
                        jewelleryQuantityEnd: this.commaSeparator.currencySeparatorBD(nesElement.endYrAmount)
                      }
                      jewelleryArrayGet.push(obj);
                      if (i > 0) {
                        this.isJewelleryDeleteActionShow = true;
                      }

                    });
                    this.jewelleryArray = jewelleryArrayGet;
                    this.initialize_gold_diamond_gems_and_other_items_validation();
                  }
                  //#endregion

                  //#region Furniture
                  if (element.firstSubTypeKey === 'furniture_equipments_and_electronic_items') {
                    this.isCheckedFurnitureEquipment = element.firstSubTypeValue;
                    this.isAssets[6] = this.isCheckedFurnitureEquipment;

                    let furnitureArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        FurnitureParticulars: nesElement.description,
                        FurnitureAcquisition: nesElement.type,
                        FurnitureQuantity: nesElement.otherInfo,
                        FurnitureValue: this.commaSeparator.currencySeparatorBD(nesElement.value)
                      }
                      furnitureArrayGet.push(obj);
                      if (i > 0) {
                        this.isFurnitureDeleteActionShow = true;
                      }

                    });
                    this.furnitureArray = furnitureArrayGet;
                    this.initialize_furniture_equipments_and_electronic_items_validation();
                  }
                  //#endregion

                  //#region Other Assets
                  if (element.firstSubTypeKey === 'other_assets_of_significant_value') {
                    this.isCheckedOtherAssets = element.firstSubTypeValue;
                    this.isAssets[7] = this.isCheckedOtherAssets;

                    let otherAssetsArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        otherAssetsAcquisition: nesElement.type,
                        otherAssetsParticulars: nesElement.description,
                        otherAssetsValue: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        otherAssetsDetail: nesElement.otherInfo
                      }
                      otherAssetsArrayGet.push(obj);
                      if (i > 0) {
                        this.isOtherAssetsDeleteActionShow = true;
                      }

                    });
                    this.otherAssetsArray = otherAssetsArrayGet;
                    this.initialize_other_assets_of_significant_value_validation();
                  }
                  //#endregion

                  //#region Cash and Fund outside Business
                  if (element.firstSubTypeKey === 'cash_and_fund_outside_business') {
                    this.isCheckedCashFundOutsideBusiness = element.firstSubTypeValue;
                    this.isAssets[8] = this.isCheckedCashFundOutsideBusiness;
                    if (element.secondSubTypeKey === "notes_and_currencies") {
                      this.isCheckedNotesCurrencies = element.secondSubTypeValue;
                      this.isCashFundOutsideBusiness[0] = this.isCheckedNotesCurrencies;
                      let notesCurrenciesArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          notesCurrenciesAmount: this.commaSeparator.currencySeparatorBD(nesElement.value)
                        }
                        notesCurrenciesArrayGet.push(obj);
                        if (i > 0) {
                          this.isNotesCurrenciesDeleteActionShow = true;
                        }
                      });
                      this.notesCurrenciesArray = notesCurrenciesArrayGet;
                      this.initialize_notes_and_currencies_validation();
                    }
                    if (element.secondSubTypeKey === "banks_cards_and_other_electronic_cash") {
                      // debugger;
                      this.includeBankAccountDetails = true;
                      this.isCheckedBankCard = element.secondSubTypeValue;
                      this.isCashFundOutsideBusiness[1] = this.isCheckedBankCard;
                      let electronicCashArrayGet = [];
                      let isElectronicCashEmpty: boolean = false;
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          electronicCashFIName: nesElement.name,
                          electronicCashFI: nesElement.type,
                          electronicCashBalance: this.commaSeparator.currencySeparatorBD(nesElement.value),
                          electronicCashAccountCardNo: nesElement.relatedIN,
                        }
                        electronicCashArrayGet.push(obj);
                        if (i > 0) {
                          this.isElectronicCashDeleteActionShow = true;
                        }

                        if (nesElement.name === "" && nesElement.type === "" && nesElement.value <= 0 && nesElement.relatedIN === "") isElectronicCashEmpty = true;
                        else isElectronicCashEmpty = false;
                      });
                      this.electronicCashArray = electronicCashArrayGet;

                      if (isElectronicCashEmpty) this.includeBankAccountDetails = false;
                      else this.includeBankAccountDetails = true;

                    }
                    if (element.secondSubTypeKey === "provident_fund_and_other_fund") {
                      this.isCheckedProvidentFund = element.secondSubTypeValue;
                      this.isCashFundOutsideBusiness[2] = this.isCheckedProvidentFund;
                      let fundArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          fundParticulars: nesElement.description,
                          fundBalance: this.commaSeparator.currencySeparatorBD(nesElement.value),
                          fundAccount: nesElement.relatedIN,
                        }
                        fundArrayGet.push(obj);
                        if (i > 0) {
                          this.isFundDeleteActionShow = true;
                        }
                      });
                      this.fundArray = fundArrayGet;
                      this.initialize_provident_fund_and_other_fund_validation();
                    }
                    if (element.secondSubTypeKey === "other_deposits_balance_and_advance") {
                      this.isCheckedOtherDepositBalance = element.secondSubTypeValue;
                      this.isCashFundOutsideBusiness[3] = this.isCheckedOtherDepositBalance;
                      let outsideDepositsArrayGet = [];
                      element.alDetailsDtos.forEach((nesElement, i) => {
                        let obj = {
                          outsideDepositsParticulars: nesElement.description,
                          outsideDepositsBalance: this.commaSeparator.currencySeparatorBD(nesElement.value)
                        }
                        outsideDepositsArrayGet.push(obj);
                        if (i > 0) {
                          this.isOutsideDepositsDeleteActionShow = true;
                        }
                      });
                      this.outsideDepositsArray = outsideDepositsArrayGet;
                      this.initialize_other_deposits_balance_and_advance_validation();
                    }
                  }
                  //#endregion
                  // debugger;
                  this.calGrossWealth();
                  this.calNetWealth();
                }
                //#endregion

                //#region liabilities
                if (element.typeKey === 'liabilities') {
                  this.isLiabilitiesCollapsed = element.typeValue;
                  //#region borrowing_from_bank_or_other_fi
                  if (element.firstSubTypeKey === 'borrowing_from_bank_or_other_fi') {
                    this.isCheckedBorrowingFromBank = element.firstSubTypeValue;
                    this.isLiabilities[0] = this.isCheckedBorrowingFromBank;

                    let liabilitiesBorrowArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        liabilitiesBorrowBankName: nesElement.name,
                        liabilitiesBorrowPurpose: nesElement.description,
                        liabilitiesBorrowBalance: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        liabilitiesBorrowAccount: nesElement.relatedIN
                      }
                      liabilitiesBorrowArrayGet.push(obj);
                      if (i > 0) {
                        this.isLiabilitiesBorrowDeleteActionShow = true;
                      }

                    });
                    this.liabilitiesBorrowArray = liabilitiesBorrowArrayGet;
                    this.initialize_borrowing_from_bank_or_other_fi_validation();
                  }
                  //#endregion

                  //#region unsecured_loan
                  if (element.firstSubTypeKey === 'unsecured_loan') {
                    this.isCheckedUnsecuredLoan = element.firstSubTypeValue;
                    this.isLiabilities[1] = this.isCheckedUnsecuredLoan;

                    let liabilitiesUnsecuredLoanArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        liabilitiesUnsecuredLoanName: nesElement.name,
                        liabilitiesUnsecuredLoanPurpose: nesElement.description,
                        liabilitiesUnsecuredLoanBalance: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        liabilitiesUnsecuredLoanTIN: nesElement.relatedIN
                      }
                      liabilitiesUnsecuredLoanArrayGet.push(obj);
                      if (i > 0) {
                        this.isLiabilitiesUnsecuredLoanDeleteActionShow = true;
                      }

                    });
                    this.liabilitiesUnsecuredLoanArray = liabilitiesUnsecuredLoanArrayGet;
                    this.initialize_unsecured_loan_validation();
                  }
                  //#endregion

                  //#region Other Loan or Overdraft
                  if (element.firstSubTypeKey === 'other_loan_or_overdraft') {
                    this.isCheckedOtherLoanOrOverdraft = element.firstSubTypeValue;
                    this.isLiabilities[2] = this.isCheckedOtherLoanOrOverdraft;

                    let liabilitiesOtherArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        liabilitiesOtherLoan: nesElement.type,
                        liabilitiesOtherParticulars: nesElement.description,
                        liabilitiesOtherBalance: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        liabilitiesOtherDetail: nesElement.otherInfo
                      }
                      liabilitiesOtherArrayGet.push(obj);
                      if (i > 0) {
                        this.isLiabilitiesOtherDeleteActionShow = true;
                      }

                    });
                    this.liabilitiesOtherArray = liabilitiesOtherArrayGet;
                    this.initialize_other_loan_or_overdraft_validation();
                  }
                  //#endregion
                  this.calTotalLiabilities();
                  this.calNetWealth();
                }
                //#endregion

                //#region Other Outflow
                if (element.typeKey === '0ther_outflow') {
                  this.isOutflowCollapsed = element.typeValue;

                  //#region annual_living_expense
                  if (element.firstSubTypeKey === 'annual_living_expense') {
                    this.isCheckedAnnualLivingExpense = element.firstSubTypeValue;
                    this.isOutflow[0] = this.isCheckedAnnualLivingExpense;

                    element.alDetailsDtos.forEach((nesElement, i) => {
                      outflowLivingExpenseValue = this.commaSeparator.currencySeparatorBD(nesElement.value);
                    });
                  }
                  //#endregion

                  //#region loss_deduction_other_expense
                  if (element.firstSubTypeKey === 'loss_deduction_other_expense') {
                    this.isCheckedLossDeductionOtherExpense = element.firstSubTypeValue;
                    this.isOutflow[1] = this.isCheckedLossDeductionOtherExpense;

                    let outflowLossArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        outflowLossLocation: nesElement.name,
                        outflowLossAmount: this.commaSeparator.currencySeparatorBD(nesElement.value)
                      }
                      outflowLossArrayGet.push(obj);
                      if (i > 0) {
                        this.isOutflowLossDeleteActionShow = true;
                      }

                    });
                    this.outflowLossArray = outflowLossArrayGet;
                    this.initialize_loss_deduction_other_expense_validation();
                  }
                  //#endregion

                  //#region gift_donation_and_contribution
                  if (element.firstSubTypeKey === 'gift_donation_and_contribution') {
                    this.isCheckedGiftDonationContribution = element.firstSubTypeValue;
                    this.isOutflow[2] = this.isCheckedGiftDonationContribution;

                    let outflowGiftArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        outflowGiftName: nesElement.name,
                        outflowGiftParticulars: nesElement.description,
                        outflowGiftAmount: this.commaSeparator.currencySeparatorBD(nesElement.value),
                        outflowGiftTIN: nesElement.relatedIN
                      }
                      outflowGiftArrayGet.push(obj);
                      if (i > 0) {
                        this.isOutflowGiftDeleteActionShow = true;
                      }

                    });
                    this.outflowGiftArray = outflowGiftArrayGet;
                    this.initialize_gift_donation_and_contribution_validation();
                  }
                  //#endregion
                }
                //#endregion

                //#region sources of fund
                if (element.typeKey === 'sources_of_fund') {
                  this.isSourceFundCollapsed = element.typeValue;

                  //#region income_shown_in_the_return
                  // if (element.firstSubTypeKey === 'income_shown_in_the_return') {
                  //   this.isCheckedIncomeShownInTheTown = element.firstSubTypeValue;
                  //   this.isSourceFund[0] = this.isCheckedIncomeShownInTheTown;

                  //   element.alDetailsDtos.forEach((nesElement, i) => {
                  //     sourceFundIncomeValue = this.commaSeparator.currencySeparatorBD(nesElement.value);
                  //   });
                  // }
                  //#endregion

                  //#region loss_deduction_other_expense
                  // if (element.firstSubTypeKey === 'tax_exempted_income_and_allowances') {
                  //   this.isCheckedTaxExemptedIncome = element.firstSubTypeValue;
                  //   this.isSourceFund[1] = this.isCheckedTaxExemptedIncome;

                  //   element.alDetailsDtos.forEach((nesElement, i) => {
                  //     taxExemptedIncomeAndAllowancesValue = this.commaSeparator.currencySeparatorBD(nesElement.value);
                  //   });
                  // }
                  //#endregion

                  //#region other_receipts
                  if (element.firstSubTypeKey === 'other_receipts') {


                    if (this.total_loss_not_setoff == 0) this.sourceFundReceiptsArray = [];
                    let obj: any;

                    // if(this.total_loss_not_setoff != 0) {
                    //   obj = {
                    //     sourceFundReceiptsParticulars: "Loss Not Set Off",
                    //     sourceFundReceiptsAmount: this.total_loss_not_setoff ? this.commaSeparator.currencySeparatorBD(this.total_loss_not_setoff) : '',
                    //     sourceFundReceiptsReference: "Section 37"
                    //   }
                    //   this.sourceFundReceiptsArray.push(obj);
                    // }



                    element.alDetailsDtos.forEach((nesElement, i) => {


                      if (nesElement.description !== 'Loss Not Set Off') {
                        if (!(this.total_loss_not_setoff != 0 && (nesElement.description === '' || nesElement.description == null))) {
                          this.isCheckedOtherReceipts = element.firstSubTypeValue;
                          this.isSourceFund[2] = this.isCheckedOtherReceipts;

                          obj = {
                            sourceFundReceiptsParticulars: nesElement.description,
                            sourceFundReceiptsAmount: this.commaSeparator.currencySeparatorBD(nesElement.value),
                            sourceFundReceiptsReference: nesElement.relatedIN
                          }

                          this.sourceFundReceiptsArray.push(obj);
                        }

                      }
                      if (i > 0 || this.total_loss_not_setoff != 0) {
                        this.isSourceFundReceiptsDeleteActionShow = true;
                      }


                    });
                    this.initialize_other_receipts_validation();
                  }
                  //#endregion

                }
                //#endregion

                //#region Previous Net Wealth
                if (element.typeKey === 'previous_net_wealth') {
                  this.isPreviousYearNetWealthCollapsed = element.typeValue;

                  //#region income_shown_in_the_return
                  if (element.firstSubTypeKey === 'previous_income_year_net_wealth') {
                    this.isCheckedPreviousYearNetWealth = element.firstSubTypeValue;
                    this.isPreviousYearNetWealth[0] = this.isCheckedPreviousYearNetWealth;

                    element.alDetailsDtos.forEach((nesElement, i) => {
                      PreviousIncomeYearNetWealth = this.commaSeparator.currencySeparatorBD(nesElement.value);
                      this.previousIncomeYearNetWealth = PreviousIncomeYearNetWealth;
                    });
                  }
                  //#endregion
                  this.calChangeInNetWealth();
                }
                //#endregion

              });



              this.group = new FormGroup({
                outflowLivingExpense: new FormControl(outflowLivingExpenseValue ? outflowLivingExpenseValue : ''),
                sourceFundIncome: new FormControl(this.total_Income_Amt ? this.commaSeparator.currencySeparatorBD(this.total_Income_Amt) : ''),
                taxExemptedIncomeAndAllowances: new FormControl(this.total_Exempted_Income_Amt ? this.commaSeparator.currencySeparatorBD(this.total_Exempted_Income_Amt) : ''),
                PreviousIncomeYearNetWealth: new FormControl(PreviousIncomeYearNetWealth ? PreviousIncomeYearNetWealth : ''),
              })
              this.formArray.push(this.group);
              this.refreshTotalExpenseTax();
              this.calOtherFundOutflow();
              this.calSourcesofFund();

              this.spinner.stop();
            }

          }
          else {
            this.insertFormGroupToArray();
            this.refreshTotalExpenseTax();
            //this.populateOtherReceiptData();
            this.getTotalAmountOfExpenseAndTax();
            this.getTotalIncome();
            this.getTotalExemptedIncome();
            this.spinner.stop();
          }
          resolve();
        },
          error => {
            this.spinner.stop();
            reject();
         //   console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });

  }

  // populateOtherReceiptData() {
  //   let otherReceiptRequestData = {
  //     "assessmentYear": "2021-2022",
  //     "tinNo": this.userTin
  //   }

  //   this.apiService.post(this.serviceUrl + 'api/list_of_not_setoff', otherReceiptRequestData)
  //     .subscribe(result => {
  //
  //       if (JSON.stringify(result.replyMessage) != '{}') {
  //         // debugger;
  //         this.otherReceiptData = result.replyMessage;
  //
  //

  //         this.isCheckedOtherReceipts = true;
  //         this.isSourceFund[2] = this.isCheckedOtherReceipts;
  //         let keys: any;
  //         let values: any;
  //         let sourceFundReceiptsArrayGet = [];
  //         this.otherReceiptData.forEach((element, j) => {
  //           keys = Object.keys(element);
  //           values = Object.values(element);

  //
  //

  //           keys.forEach((nesElement, i) => {
  //             let obj = {
  //               sourceFundReceiptsParticulars: nesElement,
  //               sourceFundReceiptsAmount: values[i],
  //               sourceFundReceiptsReference: ''
  //             }
  //             sourceFundReceiptsArrayGet.push(obj);
  //             if (i > 0) {
  //               this.isSourceFundReceiptsDeleteActionShow = true;
  //             }
  //           });

  //         });
  //         // this.sourceFundReceiptsArray = sourceFundReceiptsArrayGet;
  //         this.calSourcesofFund();
  //       }
  //     },
  //       error => {
  //
  //         this.toastr.error(error['error'].errorMessage, '', {
  //           timeOut: 1000,
  //         });
  //       });
  // }


  onAssetsChange(e, i) {

    // initialize "Bank account details" button from "Notes, Currencies, Banks, Cards and Other Electronic Cash"
    if(i==8) {
      this.onElectronicCashChange2(false, 1);
    }

    // debugger;
    this.isAssets[i] = e.target.checked;

    //#region Business Capital
    if (e.target.checked == true && i == 0) {
      this.isCheckedBusinessCapital = true;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 0) {
      this.isBusinessCapital[0] = false;
      this.isBusinessCapital[1] = false;
      this.isCheckedBusinessCapital = false;
      this.isCheckedDirectorShareholdings = false;
      this.isCheckedBusinessCapitalOtherThanDirectorShareholdings = false;
      this.businessDirectorArray = [];
      this.businessOtherArray = [];
      this.calGrossWealth();
    }
    //#endregion

    //#region Non Agri Property
    if (e.target.checked == true && i == 1) {
      this.isCheckedNonAgriPropertyParent = true;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 1) {
      this.isNonAgriculture[0] = false;
      this.isNonAgriculture[1] = false;
      this.isCheckedNonAgriPropertyParent = false;
      this.isCheckedNonAgriPropertyChild = false;
      this.ischeckedAdvanceMadeNonAgriProperty = false;
      this.nonAgriPropertyArray = [];
      this.advanceNonAgriPropertyArray = [];
      this.calGrossWealth();
    }
    //#endregion

    //#region Agri Property
    if (e.target.checked == true && i == 2) {
      this.initialize_agricultural_property_validation();
      this.isCheckedAgriProperty = true;
      this.agriPropertyArray = [];
      this.newAgriProperty = { agriPropertyLocation: "", agriPropertyAcquisition: "", agriPropertyArea: "", unitOfAgriArea:"", agriPropertyValueStart: "", agriPropertyValueEnd: "" };
      this.agriPropertyArray.push(this.newAgriProperty);
      this.isAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 2) {
      this.initialize_agricultural_property_validation();
      this.isCheckedAgriProperty = false;
      this.agriPropertyArray = [];
      this.newAgriProperty = { agriPropertyLocation: "", agriPropertyAcquisition: "", agriPropertyArea: "", unitOfAgriArea:"", agriPropertyValueStart: "", agriPropertyValueEnd: "" };
      this.agriPropertyArray.push(this.newAgriProperty);
      this.isAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
    }
    //#endregion

    //#region Financial Assets
    if (e.target.checked == true && i == 3) {
      this.isCheckedFinancialAssets = true;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 3) {
      this.isCheckedFinancialAssets = false;
      this.isCheckedShareDebentureEtc = false;
      this.isCheckedSavingsCertificate = false;
      this.isCheckedFixDepositTermDeposit = false;
      this.isCheckedLoanGiven = false;
      this.isCheckedOtherFinancial = false;
      this.isFinancial[0] = false;
      this.isFinancial[1] = false;
      this.isFinancial[2] = false;
      this.isFinancial[3] = false;
      this.isFinancial[4] = false;
      this.financialShareArray = [];
      this.financialSavingsArray = [];
      this.financialDepositsArray = [];
      this.financialLoansArray = [];
      this.financialOtherArray = [];
      this.calGrossWealth();
    }
    //#endregion

    //#region Motor Car
    if (e.target.checked == true && i == 4) {
      this.initialize_motor_car_validation();
      this.isCheckedMotorCar = true;
      //Motor Car
      this.motorCarArray = [];
      this.newMotorCar = { motorCarParticulars: "", motorCarAcquisition: "", motorCarEngine: "",engineType: "", motorCarRegistration: "", motorCarAmount: "" };
      this.motorCarArray.push(this.newMotorCar);
      this.isMotorCarDeleteActionShow = false;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 4) {
      this.initialize_motor_car_validation();
      this.isCheckedMotorCar = false;
      //Motor Car
      this.motorCarArray = [];
      this.newMotorCar = { motorCarParticulars: "", motorCarAcquisition: "", motorCarEngine: "", engineType: "", motorCarRegistration: "", motorCarAmount: "" };
      this.motorCarArray.push(this.newMotorCar);
      this.isMotorCarDeleteActionShow = false;
      this.calGrossWealth();
    }

    //#endregion

    //#region Gold Diamond
    if (e.target.checked == true && i == 5) {
      this.initialize_gold_diamond_gems_and_other_items_validation();
      this.isCheckedGoldDiamond = true;
      //Gold, Diamond, Other Jewellery
      this.jewelleryArray = [];
      this.newJewellery = { jewelleryParticulars: "", jewelleryAcquisition: "", jewelleryQuantityEnd: "", unitOfJewellery:"", jewelleryValue: "" };
      this.jewelleryArray.push(this.newJewellery);
      this.isJewelleryDeleteActionShow = false;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 5) {
      this.initialize_gold_diamond_gems_and_other_items_validation();
      this.isCheckedGoldDiamond = false;
      //Gold, Diamond, Other Jewellery
      this.jewelleryArray = [];
      this.newJewellery = { jewelleryParticulars: "", jewelleryAcquisition: "", jewelleryQuantityEnd: "", unitOfJewellery:"", jewelleryValue: "" };
      this.jewelleryArray.push(this.newJewellery);
      this.isJewelleryDeleteActionShow = false;
      this.calGrossWealth();
    }


    //#endregion

    //#region Furniture, Equipments

    if (e.target.checked == true && i == 6) {
      this.initialize_furniture_equipments_and_electronic_items_validation();
      this.isCheckedFurnitureEquipment = true;
      //Furniture and Equipments
      this.furnitureArray = [];
      this.newFurniture = { FurnitureParticulars: "", FurnitureAcquisition: "", FurnitureQuantity: "", FurnitureValue: "" };
      this.furnitureArray.push(this.newFurniture);
      this.isFurnitureDeleteActionShow = false;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 6) {
      this.initialize_furniture_equipments_and_electronic_items_validation();
      this.isCheckedFurnitureEquipment = false;
      //Furniture and Equipments
      this.furnitureArray = [];
      this.newFurniture = { FurnitureParticulars: "", FurnitureAcquisition: "", FurnitureQuantity: "", FurnitureValue: "" };
      this.furnitureArray.push(this.newFurniture);
      this.isFurnitureDeleteActionShow = false;
      this.calGrossWealth();
    }


    //#endregion

    //#region Other Assets
    if (e.target.checked == true && i == 7) {
      this.initialize_other_assets_of_significant_value_validation();
      this.isCheckedOtherAssets = true;
      //Other Assets of Significant Value
      this.otherAssetsArray = [];
      this.newOtherAssets = { otherAssetsParticulars: "", otherAssetsAcquisition: "", otherAssetsDetail: "", otherAssetsValue: "" };
      this.otherAssetsArray.push(this.newOtherAssets);
      this.isOtherAssetsDeleteActionShow = false;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 7) {
      this.initialize_other_assets_of_significant_value_validation();
      this.isCheckedOtherAssets = false;
      //Other Assets of Significant Value
      this.otherAssetsArray = [];
      this.newOtherAssets = { otherAssetsParticulars: "", otherAssetsAcquisition: "", otherAssetsDetail: "", otherAssetsValue: "" };
      this.otherAssetsArray.push(this.newOtherAssets);
      this.isOtherAssetsDeleteActionShow = false;
      this.calGrossWealth();
    }


    //#endregion

    //#region Cash Fund Outside Business
    if (e.target.checked == true && i == 8) {
      this.isCheckedCashFundOutsideBusiness = true;
      this.calGrossWealth();
    }
    if (e.target.checked == false && i == 8) {
      this.isCheckedCashFundOutsideBusiness = false;
      this.isCheckedNotesCurrencies = false;
      this.isCheckedBankCard = false;
      this.isCheckedProvidentFund = false;
      this.isCheckedOtherDepositBalance = false;
      this.isCashFundOutsideBusiness[0] = false;
      this.isCashFundOutsideBusiness[1] = false;
      this.isCashFundOutsideBusiness[2] = false;
      this.isCashFundOutsideBusiness[3] = false;
      this.notesCurrenciesArray = [];
      this.electronicCashArray = [];
      this.fundArray = [];
      this.outsideDepositsArray = [];
      this.calGrossWealth();
    }
    //#endregion

  }

  //#region Business Director On change, Add, Delete
  onBusinessDirectorChange(e, i) {
    // this.initialize_director_shareholdings_in_limited_companies_validation();
    this.isBusinessCapital[i] = e.target.checked;
    if (e.target.checked == true && i == 0) {
      this.isCheckedDirectorShareholdings = true;
      this.businessDirectorArray = [];
      this.newBusinessDirector = { businessDirectorCompany: "", businessDirectorAcquisition: "", businessDirectorShares: "", businessDirectorValue: "" };
      this.businessDirectorArray.push(this.newBusinessDirector);
      this.isBusinessDirectorDeleteActionShow = false;
      this.calGrossWealth();
    }
    else {
      this.isCheckedDirectorShareholdings = false;
      this.businessDirectorArray = [];
      this.newBusinessDirector = { businessDirectorCompany: "", businessDirectorAcquisition: "", businessDirectorShares: "", businessDirectorValue: "" };
      this.businessDirectorArray.push(this.newBusinessDirector);
      this.isBusinessDirectorDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_director_shareholdings_in_limited_companies_validation();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  // Allow negative values
  private neg_regex: RegExp = new RegExp(/^-?\d*\d{0,2}$/g);
  integerOnly(event): boolean {
    let value = event.target.value;


    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    if (next && !String(this.commaSeparator.extractComma(next)).match(this.neg_regex)) {
      event.preventDefault();
    }

  }

  // Allow decimal numbers
  private dec_regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);

  positiveDecimalOnly(event): boolean {
    let value = event.target.value;


    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    if (next && !String(this.commaSeparator.extractComma(next)).match(this.dec_regex)) {
      event.preventDefault();
    }

  }

  addCommaBusinessCapital(event,i,colTitle:any)
  {
    //debugger;
    if(colTitle === 'businessDirectorShares')
    this.businessDirectorArray[i].businessDirectorShares = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'businessDirectorValue')
    this.businessDirectorArray[i].businessDirectorValue = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'businessOtherCapital')
    this.businessOtherArray[i].businessOtherCapital = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addBusinessDirectorRow(index) {
    if(this.validation_checking_director_shareholdings_in_limited_companies()) {
      this.newBusinessDirector = { businessDirectorCompany: "", businessDirectorAcquisition: "", businessDirectorShares: "", businessDirectorValue: "" };
    this.businessDirectorArray.push(this.newBusinessDirector);
    this.isBusinessDirectorDeleteActionShow = true;
    this.initialize_director_shareholdings_in_limited_companies_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteBusinessDirectorRow(index) {
    if (this.businessDirectorArray.length == 1) {
      this.isBusinessDirectorDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.businessDirectorArray.splice(index, 1);
      this.isBusinessDirectorDeleteActionShow = true;
      this.calGrossWealth();
      if (this.businessDirectorArray.length == 1) {
        this.isBusinessDirectorDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Business Other On change, Add, Delete
  onBusinessOtherChange(e, i) {
    this.isBusinessCapital[i] = e.target.checked;
    if (e.target.checked == true && i == 1) {
      this.isCheckedBusinessCapitalOtherThanDirectorShareholdings = true;
      this.businessOtherArray = [];
      this.newBusinessOther = { businessOtherProfession: "", businessOtherCapital: "" };
      this.businessOtherArray.push(this.newBusinessDirector);
      this.isBusinessOtherDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedBusinessCapitalOtherThanDirectorShareholdings = false;
      this.businessOtherArray = [];
      this.newBusinessOther = { businessOtherProfession: "", businessOtherCapital: "" };
      this.businessOtherArray.push(this.newBusinessDirector);
      this.isBusinessOtherDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_business_capital_other_than_director_shareholdings_in_limited_companies_validation();
  }

  addBusinessOtherRow(index) {
    if(this.validation_checking_business_capital_other_than_director_shareholdings_in_limited_companies()) {
      this.newBusinessOther = { businessOtherProfession: "", businessOtherCapital: "" };
      this.businessOtherArray.push(this.newBusinessOther);
      this.isBusinessOtherDeleteActionShow = true;
      this.initialize_business_capital_other_than_director_shareholdings_in_limited_companies_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteBusinessOtherRow(index) {
    if (this.businessOtherArray.length == 1) {
      this.isBusinessOtherDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.businessOtherArray.splice(index, 1);
      this.isBusinessOtherDeleteActionShow = true;
      this.calGrossWealth();
      if (this.businessOtherArray.length == 1) {
        this.isBusinessOtherDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Non Agriculture On change, Add, Delete
  onNonAgriculturalPropertyChange(e, i) {
    this.isNonAgriculture[i] = e.target.checked;
    if (e.target.checked == true && i == 0) {
      this.isCheckedNonAgriPropertyChild = true;
      this.nonAgriPropertyArray = [];
      this.newNonAgriProperty = { nonAgriPropertyLocation: "", nonAgriPropertyAcquisition: "", nonAgriPropertyArea: "", unitOfArea:"", nonAgriPropertyValueStart: "", nonAgriPropertyValueEnd: "" };
      this.nonAgriPropertyArray.push(this.newNonAgriProperty);
      this.isNonAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedNonAgriPropertyChild = false;
      this.nonAgriPropertyArray = [];
      this.newNonAgriProperty = { nonAgriPropertyLocation: "", nonAgriPropertyAcquisition: "", nonAgriPropertyArea: "", unitOfArea: "", nonAgriPropertyValueStart: "", nonAgriPropertyValueEnd: "" };
      this.nonAgriPropertyArray.push(this.newNonAgriProperty);
      this.isNonAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_non_agricultural_property_parent_validation();
  }


  addCommaNonAgriProperty(event,i,colTitle:any)
  {
    //Non-Agricultural Property
    if(colTitle === 'nonAgriPropertyArea')
    this.nonAgriPropertyArray[i].nonAgriPropertyArea = this.commaSeparator.extractComma(event.target.value);
    if(colTitle === 'nonAgriPropertyValueStart')
    this.nonAgriPropertyArray[i].nonAgriPropertyValueStart = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'nonAgriPropertyValueEnd')
    this.nonAgriPropertyArray[i].nonAgriPropertyValueEnd = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

    //Advance Made for Non-Agricultural Property
    if(colTitle === 'advanceNonAgriPropertyValueStart')
    this.advanceNonAgriPropertyArray[i].advanceNonAgriPropertyValueStart = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'advanceNonAgriPropertyValueEnd')
    this.advanceNonAgriPropertyArray[i].advanceNonAgriPropertyValueEnd = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addNonAgriPropertyRow(index) {
    if(this.validation_checking_non_agricultural_property_parent()) {
      this.newNonAgriProperty = { nonAgriPropertyLocation: "", nonAgriPropertyAcquisition: "", nonAgriPropertyArea: "", unitOfArea:"",nonAgriPropertyValueStart: "", nonAgriPropertyValueEnd: "" };
    this.nonAgriPropertyArray.push(this.newNonAgriProperty);
    this.isNonAgriPropertyDeleteActionShow = true;
    this.initialize_non_agricultural_property_parent_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteNonAgriPropertyRow(index) {
    if (this.nonAgriPropertyArray.length == 1) {
      this.isNonAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.nonAgriPropertyArray.splice(index, 1);
      this.isNonAgriPropertyDeleteActionShow = true;
      this.calGrossWealth();
      if (this.nonAgriPropertyArray.length == 1) {
        this.isNonAgriPropertyDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Advance NonAgriculturalProperty On change, Add, Delete
  onAdvanceNonAgriculturalPropertyChange(e, i) {

    this.isNonAgriculture[i] = e.target.checked;
    if (e.target.checked == true && i == 1) {
      this.ischeckedAdvanceMadeNonAgriProperty = true;
      this.advanceNonAgriPropertyArray = [];
      this.newAdvanceNonAgriProperty = { advanceNonAgriPropertyLocation: "", advanceNonAgriPropertyAcquisition: "", advanceNonAgriPropertyValueStart: "", advanceNonAgriPropertyValueEnd: "" };
      this.advanceNonAgriPropertyArray.push(this.newAdvanceNonAgriProperty);
      this.isAdvanceNonAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.ischeckedAdvanceMadeNonAgriProperty = false;
      this.advanceNonAgriPropertyArray = [];
      this.newAdvanceNonAgriProperty = { advanceNonAgriPropertyLocation: "", advanceNonAgriPropertyAcquisition: "", advanceNonAgriPropertyValueStart: "", advanceNonAgriPropertyValueEnd: "" };
      this.advanceNonAgriPropertyArray.push(this.newAdvanceNonAgriProperty);
      this.isAdvanceNonAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_advance_made_for_non_agricultural_property_validation();
  }

  addAdvanceNonAgriPropertyRow(index) {
    if (this.validation_checking_advance_made_for_non_agricultural_property()) {
      this.newAdvanceNonAgriProperty = { advanceNonAgriPropertyLocation: "", advanceNonAgriPropertyAcquisition: "", advanceNonAgriPropertyValueStart: "", advanceNonAgriPropertyValueEnd: "" };
      this.advanceNonAgriPropertyArray.push(this.newAdvanceNonAgriProperty);
      this.isAdvanceNonAgriPropertyDeleteActionShow = true;
      this.initialize_advance_made_for_non_agricultural_property_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteAdvanceNonAgriPropertyRow(index) {
    if (this.advanceNonAgriPropertyArray.length == 1) {
      this.isAdvanceNonAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.advanceNonAgriPropertyArray.splice(index, 1);
      this.isAdvanceNonAgriPropertyDeleteActionShow = true;
      this.calGrossWealth();
      if (this.advanceNonAgriPropertyArray.length == 1) {
        this.isAdvanceNonAgriPropertyDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Agriculture Property Add, Delete
  addCommaAgriProperty(event,i,colTitle:any)
  {
    //Agricultural Property
    if(colTitle === 'agriPropertyArea') this.agriPropertyArray[i].agriPropertyArea = this.commaSeparator.extractComma(event.target.value);
    if(colTitle === 'agriPropertyValueStart')
    this.agriPropertyArray[i].agriPropertyValueStart = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'agriPropertyValueEnd')
    this.agriPropertyArray[i].agriPropertyValueEnd = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }


  addAgriPropertyRow(index) {
    if (this.validation_checking_agricultural_property()) {
      this.newAgriProperty = { agriPropertyLocation: "", agriPropertyAcquisition: "", agriPropertyArea: "", unitOfAgriArea: "", agriPropertyValueStart: "", agriPropertyValueEnd: "" };
      this.agriPropertyArray.push(this.newAgriProperty);
      this.isAgriPropertyDeleteActionShow = true;
      this.initialize_agricultural_property_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteAgriPropertyRow(index) {
    if (this.agriPropertyArray.length == 1) {
      this.isAgriPropertyDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.agriPropertyArray.splice(index, 1);
      this.isAgriPropertyDeleteActionShow = true;
      this.calGrossWealth();
      if (this.agriPropertyArray.length == 1) {
        this.isAgriPropertyDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Financial Share On Change Add, Delete

  addCommaFinancialAssets(event,i,colTitle:any)
  {
    //Share, Debenture etc.
    if(colTitle === 'financialShareValue')
    this.financialShareArray[i].financialShareValue = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

     //Savings Certificate, Bonds and Other Government Securities
    if(colTitle === 'financialSavingsValue')
    this.financialSavingsArray[i].financialSavingsValue = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

    //Fix Deposits, Term Deposits and DPS
    if(colTitle === 'financialDepositsBalance')
    this.financialDepositsArray[i].financialDepositsBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

     //Loans Given to Others
     if(colTitle === 'financialLoansAmount')
     this.financialLoansArray[i].financialLoansAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

      //Other Financial Assets
      if(colTitle === 'financialOtherAmount')
      this.financialOtherArray[i].financialOtherAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));


  }

  onFinancialShareChange(e, i) {
   
    this.isFinancial[i] = e.target.checked;
    if (e.target.checked == true && i == 0) {
      this.isCheckedShareDebentureEtc = true;
      this.financialShareArray = [];
      this.newFinancialShare = { financialShareBO: "", financialShareAcquisition: "", financialShareBrokerage: "", financialShareValue: "" };
      this.financialShareArray.push(this.newFinancialShare);
      this.isFinancialShareDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedShareDebentureEtc = false;
      this.financialShareArray = [];
      this.newFinancialShare = { financialShareBO: "", financialShareAcquisition: "", financialShareBrokerage: "", financialShareValue: "" };
      this.financialShareArray.push(this.newFinancialShare);
      this.isFinancialShareDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_share_debenture_etc_validation();
  }

  addFinancialShareRow(index) {
    if(this.validation_checking_share_debenture_etc()) {
      this.newFinancialShare = { financialShareBO: "", financialShareAcquisition: "", financialShareBrokerage: "", financialShareValue: "" };
    this.financialShareArray.push(this.newFinancialShare);
    this.isFinancialShareDeleteActionShow = true;
    this.initialize_share_debenture_etc_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFinancialShareRow(index) {
    if (this.financialShareArray.length == 1) {
      this.isFinancialShareDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.financialShareArray.splice(index, 1);
      this.isFinancialShareDeleteActionShow = true;
      this.calGrossWealth();
      if (this.financialShareArray.length == 1) {
        this.isFinancialShareDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Financial Savings On Change Add, Delete
  onFinancialSavingsChange(e, i) {
    
    this.isFinancial[i] = e.target.checked;
    if (e.target.checked == true && i == 1) {
      this.isCheckedSavingsCertificate = true;
      this.financialSavingsArray = [];
      this.newFinancialSavings = { financialSavingsSecurity: "", financialSavingsIssueNo: "", financialSavingsIssueDate: "", financialSavingsValue: "" };
      this.financialSavingsArray.push(this.newFinancialSavings);
      this.isFinancialSavingsDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedSavingsCertificate = false;
      this.financialSavingsArray = [];
      this.newFinancialSavings = { financialSavingsSecurity: "", financialSavingsIssueNo: "", financialSavingsIssueDate: "", financialSavingsValue: "" };
      this.financialSavingsArray.push(this.newFinancialSavings);
      this.isFinancialSavingsDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_savings_certificate_bonds_and_other_government_securities_validation();
  }

  addFinancialSavingsRow(index) {
    if(this.validation_checking_savings_certificate_bonds_and_other_government_securities()) {
      this.newFinancialSavings = { financialSavingsSecurity: "", financialSavingsIssueNo: "", financialSavingsIssueDate: "", financialSavingsValue: "" };
    this.financialSavingsArray.push(this.newFinancialSavings);
    this.isFinancialSavingsDeleteActionShow = true;
    this.initialize_savings_certificate_bonds_and_other_government_securities_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFinancialSavingsRow(index) {
    if (this.financialSavingsArray.length == 1) {
      this.isFinancialSavingsDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.financialSavingsArray.splice(index, 1);
      this.isFinancialSavingsDeleteActionShow = true;
      this.calGrossWealth();
      if (this.financialSavingsArray.length == 1) {
        this.isFinancialSavingsDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Financial Deposit On Change Add, Delete
  onFinancialDepositsChange(e, i) {
   
    this.isFinancial[i] = e.target.checked;
    if (e.target.checked == true && i == 2) {
      this.isCheckedFixDepositTermDeposit = true;
      this.financialDepositsArray = [];
      this.newFinancialDeposits = { financialDepositsParticulars: "", financialDepositsAcquisition: "", financialDepositsBankName: "", financialDepositsAccount: "", financialDepositsBalance: "" };
      this.financialDepositsArray.push(this.newFinancialDeposits);
      this.isFinancialDepositsDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedFixDepositTermDeposit = false;
      this.financialDepositsArray = [];
      this.newFinancialDeposits = { financialDepositsParticulars: "", financialDepositsAcquisition: "", financialDepositsBankName: "", financialDepositsAccount: "", financialDepositsBalance: "" };
      this.financialDepositsArray.push(this.newFinancialDeposits);
      this.isFinancialDepositsDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_fix_deposits_term_deposits_and_dps_validation();
  }

  addFinancialDepositsRow(index) {
    if(this.validation_checking_fix_deposits_term_deposits_and_dps()) {
      this.newFinancialDeposits = { financialDepositsParticulars: "", financialDepositsAcquisition: "", financialDepositsBankName: "", financialDepositsAccount: "", financialDepositsBalance: "" };
    this.financialDepositsArray.push(this.newFinancialDeposits);
    this.isFinancialDepositsDeleteActionShow = true;
    this.initialize_fix_deposits_term_deposits_and_dps_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFinancialDepositsRow(index) {
    if (this.financialDepositsArray.length == 1) {
      this.isFinancialDepositsDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.financialDepositsArray.splice(index, 1);
      this.isFinancialDepositsDeleteActionShow = true;
      this.calGrossWealth();
      if (this.financialDepositsArray.length == 1) {
        this.isFinancialDepositsDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Financial Loans On Change Add, Delete
  onFinancialLoansChange(e, i) {
    
    this.isFinancial[i] = e.target.checked;
    if (e.target.checked == true && i == 3) {
      this.isCheckedLoanGiven = true;
      this.financialLoansArray = [];
      this.newFinancialLoans = { financialLoansParticulars: "", financialLoansBorrowerName: "", financialLoansBorrowerTIN: "", financialLoansAmount: "" };
      this.financialLoansArray.push(this.newFinancialLoans);
      this.isFinancialLoansDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedLoanGiven = false;
      this.financialLoansArray = [];
      this.newFinancialLoans = { financialLoansParticulars: "", financialLoansBorrowerName: "", financialLoansBorrowerTIN: "", financialLoansAmount: "" };
      this.financialLoansArray.push(this.newFinancialLoans);
      this.isFinancialLoansDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_loans_given_to_others_validation();
  }

  addFinancialLoansRow(index) {
    if(this.validation_checking_loans_given_to_others()) {
      this.newFinancialLoans = { financialLoansParticulars: "", financialLoansBorrowerName: "", financialLoansBorrowerTIN: "", financialLoansAmount: "" };
    this.financialLoansArray.push(this.newFinancialLoans);
    this.isFinancialLoansDeleteActionShow = true;
    this.initialize_loans_given_to_others_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFinancialLoansRow(index) {
    if (this.financialLoansArray.length == 1) {
      this.isFinancialLoansDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.financialLoansArray.splice(index, 1);
      this.isFinancialLoansDeleteActionShow = true;
      this.calGrossWealth();
      if (this.financialLoansArray.length == 1) {
        this.isFinancialLoansDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Financial Others On Change Add, Delete
  onFinancialOtherChange(e, i) {
    
    this.isFinancial[i] = e.target.checked;
    if (e.target.checked == true && i == 4) {
      this.isCheckedOtherFinancial = true;
      this.financialOtherArray = [];
      this.newFinancialOther = { financialOtherParticulars: "", financialOtherAcquisition: "", financialOtherDetails: "", financialOtherAmount: "" };
      this.financialOtherArray.push(this.newFinancialOther);
      this.isFinancialOtherDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedOtherFinancial = false;
      this.financialOtherArray = [];
      this.newFinancialOther = { financialOtherParticulars: "", financialOtherAcquisition: "", financialOtherDetails: "", financialOtherAmount: "" };
      this.financialOtherArray.push(this.newFinancialOther);
      this.isFinancialOtherDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_other_financial_assets_validation();

  }

  addFinancialOtherRow(index) {
    if(this.validation_checking_other_financial_assets()) {
      this.newFinancialOther = { financialOtherParticulars: "", financialOtherAcquisition: "", financialOtherDetails: "", financialOtherAmount: "" };
    this.financialOtherArray.push(this.newFinancialOther);
    this.isFinancialOtherDeleteActionShow = true;
    this.initialize_other_financial_assets_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFinancialOtherRow(index) {
    if (this.financialOtherArray.length == 1) {
      this.isFinancialOtherDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.financialOtherArray.splice(index, 1);
      this.isFinancialOtherDeleteActionShow = true;
      this.calGrossWealth();
      if (this.financialOtherArray.length == 1) {
        this.isFinancialOtherDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Motor Car Add, Delete

  addCommaMotorCar(event,i,colTitle:any)
  {
    if(colTitle === 'motorCarAmount')
    this.motorCarArray[i].motorCarAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addMotorCarRow(index) {
    if (this.validation_checking_motor_car()) {
      this.newMotorCar = { motorCarParticulars: "", motorCarAcquisition: "", motorCarEngine: "", engineType: "", motorCarRegistration: "", motorCarAmount: "" };
      this.motorCarArray.push(this.newMotorCar);
      this.isMotorCarDeleteActionShow = true;
      this.initialize_motor_car_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteMotorCarRow(index) {
    if (this.motorCarArray.length == 1) {
      this.isMotorCarDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.motorCarArray.splice(index, 1);
      this.isMotorCarDeleteActionShow = true;
      this.calGrossWealth();
      if (this.motorCarArray.length == 1) {
        this.isMotorCarDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Gold, Diamond, Gems and Other Items Add, Delete
  addCommaGoldDiamond(event,i,colTitle:any)
  {
    if(colTitle === 'jewelleryQuantityBegin')
    this.jewelleryArray[i].jewelleryQuantityBegin = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'jewelleryQuantityEnd')
    this.jewelleryArray[i].jewelleryQuantityEnd = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'jewelleryValue')
    this.jewelleryArray[i].jewelleryValue = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addJewelleryRow(index) {
    if(this.validation_checking_gold_diamond_gems_and_other_items()) {
      this.newJewellery = { jewelleryParticulars: "", jewelleryAcquisition: "", jewelleryQuantityEnd: "", unitOfJewellery:"", jewelleryValue: "" };
    this.jewelleryArray.push(this.newJewellery);
    this.isJewelleryDeleteActionShow = true;
    this.initialize_gold_diamond_gems_and_other_items_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteJewelleryRow(index) {
    if (this.jewelleryArray.length == 1) {
      this.isJewelleryDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.jewelleryArray.splice(index, 1);
      this.isJewelleryDeleteActionShow = true;
      this.calGrossWealth();
      if (this.jewelleryArray.length == 1) {
        this.isJewelleryDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Furniture Add, Delete
  addCommaFEEItems(event,i,colTitle:any)
  {
    if(colTitle === 'FurnitureQuantity')
    this.furnitureArray[i].FurnitureQuantity = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
    if(colTitle === 'FurnitureValue')
    this.furnitureArray[i].FurnitureValue = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addFurnitureRow(index) {
    if(this.validation_checking_furniture_equipments_and_electronic_items()) {
      this.newFurniture = { FurnitureParticulars: "", FurnitureAcquisition: "", FurnitureQuantity: "", FurnitureValue: "" };
    this.furnitureArray.push(this.newFurniture);
    this.isFurnitureDeleteActionShow = true;
    this.initialize_furniture_equipments_and_electronic_items_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFurnitureRow(index) {
    if (this.furnitureArray.length == 1) {
      this.isFurnitureDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.furnitureArray.splice(index, 1);
      this.isFurnitureDeleteActionShow = true;
      this.calGrossWealth();
      if (this.furnitureArray.length == 1) {
        this.isFurnitureDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion

  //#region Other Asset Add, Delete
  addCommaOtherAssets(event,i,colTitle:any)
  {
    if(colTitle === 'otherAssetsValue')
    this.otherAssetsArray[i].otherAssetsValue = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addOtherAssetsRow(index) {
    if(this.validation_checking_other_assets_of_significant_value()) {
      this.newOtherAssets = { otherAssetsParticulars: "", otherAssetsAcquisition: "", otherAssetsDetail: "", otherAssetsValue: "" };
    this.otherAssetsArray.push(this.newOtherAssets);
    this.isOtherAssetsDeleteActionShow = true;
    this.initialize_other_assets_of_significant_value_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteOtherAssetsRow(index) {
    if (this.otherAssetsArray.length == 1) {
      this.isOtherAssetsDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.otherAssetsArray.splice(index, 1);
      this.isOtherAssetsDeleteActionShow = true;
      this.calGrossWealth();
      if (this.otherAssetsArray.length == 1) {
        this.isOtherAssetsDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Notes Currency On change, Add, delete

  addCommaCashFundOutsideBusiness(event,i,colTitle:any)
  {
    //Notes & Currencies
    if(colTitle === 'notesCurrenciesAmount')
    this.notesCurrenciesArray[i].notesCurrenciesAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

    //Banks, Cards and Other Electronic Cash
    if(colTitle === 'electronicCashBalance')
    this.electronicCashArray[i].electronicCashBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

    //Provident Fund and Other Fund
    if(colTitle === 'fundBalance')
    this.fundArray[i].fundBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

    //Other Deposits, Balance and Advance
    if(colTitle === 'outsideDepositsBalance')
    this.outsideDepositsArray[i].outsideDepositsBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));

  }

  onNotesCurrenciesChange(e, i) {
    
    this.isCashFundOutsideBusiness[i] = e.target.checked;
    if (e.target.checked == true && i == 0) {
      this.isCheckedNotesCurrencies = true;
      this.notesCurrenciesArray = [];
      this.newNotesCurrencies = { notesCurrenciesAmount: "" };
      this.notesCurrenciesArray.push(this.newNotesCurrencies);
      this.isNotesCurrenciesDeleteActionShow = false;
      this.calGrossWealth();
    }
    else {
      this.isCheckedNotesCurrencies = false;
      this.notesCurrenciesArray = [];
      this.newNotesCurrencies = { notesCurrenciesAmount: "" };
      this.notesCurrenciesArray.push(this.newNotesCurrencies);
      this.isNotesCurrenciesDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_notes_and_currencies_validation();
    this.onElectronicCashChange2(false, 1);



  }

  addNotesCurrenciesRow(index) {
    this.newNotesCurrencies = { notesCurrenciesAmount: "" };
    this.notesCurrenciesArray.push(this.newNotesCurrencies);
    this.isNotesCurrenciesDeleteActionShow = true;
    return true;
  }

  deleteNotesCurrenciesRow(index) {
    if (this.notesCurrenciesArray.length == 1) {
      this.isNotesCurrenciesDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.notesCurrenciesArray.splice(index, 1);
      this.isNotesCurrenciesDeleteActionShow = true;
      this.calGrossWealth();
      if (this.notesCurrenciesArray.length == 1) {
        this.isNotesCurrenciesDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Banks, Cards And Other Electronic Cash On Change, Add, Delete
  onElectronicCashChange2(test : boolean, i) {
    this.isCashFundOutsideBusiness[i] = test == true? true : false;
    if (test == true && i == 1) {
      this.includeBankAccountDetails = test == true? true : false;
      this.isCheckedBankCard = true;
      this.electronicCashArray = [];
      this.newElectronicCashRow = { electronicCashFI: "", electronicCashFIName: "", electronicCashAccountCardNo: "", electronicCashBalance: "" };
      this.electronicCashArray.push(this.newElectronicCashRow);
      this.isElectronicCashDeleteActionShow = false;
      this.calGrossWealth();
    }
    else {
      this.includeBankAccountDetails = test == true? true : false;
      this.isCheckedBankCard = false;
      this.electronicCashArray = [];
      this.newElectronicCashRow = { electronicCashFI: "", electronicCashFIName: "", electronicCashAccountCardNo: "", electronicCashBalance: "" };
      this.electronicCashArray.push(this.newElectronicCashRow);
      this.isElectronicCashDeleteActionShow = false;
      this.calGrossWealth();
    }
  }

  onElectronicCashChange(e, i) {
    this.isCashFundOutsideBusiness[i] = e.target.checked;
    if (e.target.checked == true && i == 1) {
      this.isCheckedBankCard = true;
      this.electronicCashArray = [];
      this.newElectronicCashRow = { electronicCashFI: "", electronicCashFIName: "", electronicCashAccountCardNo: "", electronicCashBalance: "" };
      this.electronicCashArray.push(this.newElectronicCashRow);
      this.isElectronicCashDeleteActionShow = false;
      this.calGrossWealth();
    }
    else {
      this.isCheckedBankCard = false;
      this.electronicCashArray = [];
      this.newElectronicCashRow = { electronicCashFI: "", electronicCashFIName: "", electronicCashAccountCardNo: "", electronicCashBalance: "" };
      this.electronicCashArray.push(this.newElectronicCashRow);
      this.isElectronicCashDeleteActionShow = false;
      this.calGrossWealth();
    }


  }

  addElectronicCashRow(index) {
    this.newElectronicCashRow = { electronicCashFI: "", electronicCashFIName: "", electronicCashAccountCardNo: "", electronicCashBalance: "" };
    this.electronicCashArray.push(this.newElectronicCashRow);
    this.isElectronicCashDeleteActionShow = true;
    return true;
  }

  deleteElectronicCashRow(index) {
    if (this.electronicCashArray.length == 1) {
      this.isElectronicCashDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.electronicCashArray.splice(index, 1);
      this.isElectronicCashDeleteActionShow = true;
      this.calGrossWealth();
      if (this.electronicCashArray.length == 1) {
        this.isElectronicCashDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Provident Fund and Other Fund On Change, Add, Delete
  onFundChange(e, i) {
   
    this.isCashFundOutsideBusiness[i] = e.target.checked;
    if (e.target.checked == true && i == 2) {
      this.isCheckedProvidentFund = true;
      this.fundArray = [];
      this.newFundRow = { fundParticulars: "", fundAccount: "", fundBalance: "" };
      this.fundArray.push(this.newFundRow);
      this.isFundDeleteActionShow = false;
      this.calGrossWealth();
    }
    else {
      this.isCheckedProvidentFund = false;
      this.fundArray = [];
      this.newFundRow = { fundParticulars: "", fundAccount: "", fundBalance: "" };
      this.fundArray.push(this.newFundRow);
      this.isFundDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_provident_fund_and_other_fund_validation();
  }

  addFundRow(index) {
    if(this.validation_checking_provident_fund_and_other_fund()) {
      this.newFundRow = { fundParticulars: "", fundAccount: "", fundBalance: "" };
    this.fundArray.push(this.newFundRow);
    this.isFundDeleteActionShow = true;
    this.initialize_provident_fund_and_other_fund_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteFundRow(index) {
    if (this.fundArray.length == 1) {
      this.isFundDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.fundArray.splice(index, 1);
      this.isFundDeleteActionShow = true;
      this.calGrossWealth();
      if (this.fundArray.length == 1) {
        this.isFundDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }

  //#endregion

  //#region Other Deposits, Balance and Advance On Change, Add, Delete
  onOutsideDepositsChange(e, i) {
   
    this.isCashFundOutsideBusiness[i] = e.target.checked;
    if (e.target.checked == true && i == 3) {
      this.isCheckedOtherDepositBalance = true;
      this.outsideDepositsArray = [];
      this.newOutsideDepositsRow = { outsideDepositsParticulars: "", outsideDepositsBalance: "" };
      this.outsideDepositsArray.push(this.newOutsideDepositsRow);
      this.isOutsideDepositsDeleteActionShow = false;
      this.calGrossWealth();
    } else {
      this.isCheckedOtherDepositBalance = false;
      this.outsideDepositsArray = [];
      this.newOutsideDepositsRow = { outsideDepositsParticulars: "", outsideDepositsBalance: "" };
      this.outsideDepositsArray.push(this.newOutsideDepositsRow);
      this.isOutsideDepositsDeleteActionShow = false;
      this.calGrossWealth();
    }
    this.initialize_other_deposits_balance_and_advance_validation();
  }

  addOutsideDepositsRow(index) {
    if(this.validation_checking_other_deposits_balance_and_advance()) {
      this.newOutsideDepositsRow = { outsideDepositsParticulars: "", outsideDepositsBalance: "" };
    this.outsideDepositsArray.push(this.newOutsideDepositsRow);
    this.isOutsideDepositsDeleteActionShow = true;
    this.initialize_other_deposits_balance_and_advance_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteOutsideDepositsRow(index) {
    if (this.outsideDepositsArray.length == 1) {
      this.isOutsideDepositsDeleteActionShow = false;
      this.calGrossWealth();
      return false;
    } else {
      this.outsideDepositsArray.splice(index, 1);
      this.isOutsideDepositsDeleteActionShow = true;
      this.calGrossWealth();
      if (this.outsideDepositsArray.length == 1) {
        this.isOutsideDepositsDeleteActionShow = false;
        this.calGrossWealth();
      }
      return true;
    }
  }
  //#endregion


  onLiabilitiesChange(e, i) {
    this.isLiabilities[i] = e.target.checked;

    //#region Borrowing from Bank or other FI
    if (e.target.checked == true && i == 0) {
      this.initialize_borrowing_from_bank_or_other_fi_validation();
      this.isCheckedBorrowingFromBank = true;
      this.liabilitiesBorrowArray = [];
      this.newLiabilitiesBorrow = { liabilitiesBorrowBankName: "", liabilitiesBorrowAccount: "", liabilitiesBorrowPurpose: "", liabilitiesBorrowBalance: "" };
      this.liabilitiesBorrowArray.push(this.newLiabilitiesBorrow);
      this.isLiabilitiesBorrowDeleteActionShow = false;
      this.calTotalLiabilities();
    }
    if (e.target.checked == false && i == 0) {
      this.initialize_borrowing_from_bank_or_other_fi_validation();
      this.isCheckedBorrowingFromBank = false;
      this.liabilitiesBorrowArray = [];
      this.newLiabilitiesBorrow = { liabilitiesBorrowBankName: "", liabilitiesBorrowAccount: "", liabilitiesBorrowPurpose: "", liabilitiesBorrowBalance: "" };
      this.liabilitiesBorrowArray.push(this.newLiabilitiesBorrow);
      this.isLiabilitiesBorrowDeleteActionShow = false;
      this.calTotalLiabilities();
    }
    //#endregion

    //#region Unsecured Loan
    if (e.target.checked == true && i == 1) {
      this.initialize_unsecured_loan_validation();
      this.isCheckedUnsecuredLoan = true;
      // Unsecured Loan
      this.liabilitiesUnsecuredLoanArray = [];
      this.newLiabilitiesUnsecuredLoan = { liabilitiesUnsecuredLoanName: "", liabilitiesUnsecuredLoanTIN: "", liabilitiesUnsecuredLoanPurpose: "", liabilitiesUnsecuredLoanBalance: "" };
      this.liabilitiesUnsecuredLoanArray.push(this.newLiabilitiesUnsecuredLoan);
      this.isLiabilitiesUnsecuredLoanDeleteActionShow = false;
      this.calTotalLiabilities();
    }
    if (e.target.checked == false && i == 1) {
      this.initialize_unsecured_loan_validation();
      this.isCheckedUnsecuredLoan = false;
      // Unsecured Loan
      this.liabilitiesUnsecuredLoanArray = [];
      this.newLiabilitiesUnsecuredLoan = { liabilitiesUnsecuredLoanName: "", liabilitiesUnsecuredLoanTIN: "", liabilitiesUnsecuredLoanPurpose: "", liabilitiesUnsecuredLoanBalance: "" };
      this.liabilitiesUnsecuredLoanArray.push(this.newLiabilitiesUnsecuredLoan);
      this.isLiabilitiesUnsecuredLoanDeleteActionShow = false;
      this.calTotalLiabilities();
    }
    //#endregion

    //#region Other Loan or Overdraft
    if (e.target.checked == true && i == 2) {
      this.initialize_other_loan_or_overdraft_validation();
      this.isCheckedOtherLoanOrOverdraft = true;
      // Other Loan or Overdraft
      this.liabilitiesOtherArray = [];
      this.newLiabilitiesOther = { liabilitiesOtherParticulars: "", liabilitiesOtherLoan: "", liabilitiesOtherDetail: "", liabilitiesOtherBalance: "" };
      this.liabilitiesOtherArray.push(this.newLiabilitiesOther);
      this.isLiabilitiesOtherDeleteActionShow = false;
      this.calTotalLiabilities();
    }
    if (e.target.checked == false && i == 2) {
      this.initialize_other_loan_or_overdraft_validation();
      this.isCheckedOtherLoanOrOverdraft = false;
      // Other Loan or Overdraft
      this.liabilitiesOtherArray = [];
      this.newLiabilitiesOther = { liabilitiesOtherParticulars: "", liabilitiesOtherLoan: "", liabilitiesOtherDetail: "", liabilitiesOtherBalance: "" };
      this.liabilitiesOtherArray.push(this.newLiabilitiesOther);
      this.isLiabilitiesOtherDeleteActionShow = false;
      this.calTotalLiabilities();
    }
    //#endregion
  }

  //#region Borrowing from Bank or other FI Add, Delete
  addCommaBorrowingBankOrOther(event,i,colTitle:any)
  {
    if(colTitle === 'liabilitiesBorrowBalance')
    this.liabilitiesBorrowArray[i].liabilitiesBorrowBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addLiabilitiesBorrowRow(index) {
    if(this.validation_checking_borrowing_from_bank_or_other_fi()) {
      this.newLiabilitiesBorrow = { liabilitiesBorrowBankName: "", liabilitiesBorrowAccount: "", liabilitiesBorrowPurpose: "", liabilitiesBorrowBalance: "" };
    this.liabilitiesBorrowArray.push(this.newLiabilitiesBorrow);
    this.isLiabilitiesBorrowDeleteActionShow = true;
    this.initialize_borrowing_from_bank_or_other_fi_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteLiabilitiesBorrowRow(index) {
    if (this.liabilitiesBorrowArray.length == 1) {
      this.isLiabilitiesBorrowDeleteActionShow = false;
      this.calTotalLiabilities();
      return false;
    } else {
      this.liabilitiesBorrowArray.splice(index, 1);
      this.isLiabilitiesBorrowDeleteActionShow = true;
      this.calTotalLiabilities();
      if (this.liabilitiesBorrowArray.length == 1) {
        this.isLiabilitiesBorrowDeleteActionShow = false;
        this.calTotalLiabilities();
      }
      return true;
    }
  }
  //#endregion

  //#region Unsecured Loan Add, Delete
  addCommaUnsecuredLoan(event,i,colTitle:any)
  {
    if(colTitle === 'liabilitiesUnsecuredLoanBalance')
    this.liabilitiesUnsecuredLoanArray[i].liabilitiesUnsecuredLoanBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addLiabilitiesUnsecuredLoanRow(index) {
    if(this.validation_checking_unsecured_loan()) {
      this.newLiabilitiesUnsecuredLoan = { liabilitiesUnsecuredLoanName: "", liabilitiesUnsecuredLoanTIN: "", liabilitiesUnsecuredLoanPurpose: "", liabilitiesUnsecuredLoanBalance: "" };
    this.liabilitiesUnsecuredLoanArray.push(this.newLiabilitiesUnsecuredLoan);
    this.isLiabilitiesUnsecuredLoanDeleteActionShow = true;
    this.initialize_unsecured_loan_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteLiabilitiesUnsecuredLoanRow(index) {
    if (this.liabilitiesUnsecuredLoanArray.length == 1) {
      this.isLiabilitiesUnsecuredLoanDeleteActionShow = false;
      this.calTotalLiabilities();
      return false;
    } else {
      this.liabilitiesUnsecuredLoanArray.splice(index, 1);
      this.isLiabilitiesUnsecuredLoanDeleteActionShow = true;
      this.calTotalLiabilities();
      if (this.liabilitiesUnsecuredLoanArray.length == 1) {
        this.isLiabilitiesUnsecuredLoanDeleteActionShow = false;
        this.calTotalLiabilities();
      }
      return true;
    }
  }
  //#endregion

  //#region Other Loan or Overdraft Add, Delete
  addCommaOtherLoanOrOverdraft(event,i,colTitle:any)
  {
    if(colTitle === 'liabilitiesOtherBalance')
    this.liabilitiesOtherArray[i].liabilitiesOtherBalance = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addLiabilitiesOtherRow(index) {
    if (this.validation_checking_other_loan_or_overdraft()) {
      this.newLiabilitiesOther = { liabilitiesOtherParticulars: "", liabilitiesOtherLoan: "", liabilitiesOtherDetail: "", liabilitiesOtherBalance: "" };
      this.liabilitiesOtherArray.push(this.newLiabilitiesOther);
      this.isLiabilitiesOtherDeleteActionShow = true;
      this.initialize_other_loan_or_overdraft_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteLiabilitiesOtherRow(index) {
    if (this.liabilitiesOtherArray.length == 1) {
      this.isLiabilitiesOtherDeleteActionShow = false;
      this.calTotalLiabilities();
      return false;
    } else {
      this.liabilitiesOtherArray.splice(index, 1);
      this.isLiabilitiesOtherDeleteActionShow = true;
      this.calTotalLiabilities();
      if (this.liabilitiesOtherArray.length == 1) {
        this.isLiabilitiesOtherDeleteActionShow = false;
        this.calTotalLiabilities();
      }
      return true;
    }
  }
  //#endregion


  onOutFlowChange(e, i) {
    this.isOutflow[i] = e.target.checked;
    //#region Annual Living Expense
    if (e.target.checked == true && i == 0) {
      this.isCheckedAnnualLivingExpense = true;
      // this.formArray.controls[i].patchValue({
      //   outflowLivingExpense: localStorage.getItem('totalAmountOfExpenseAndTaxAmt'),
      // });
      // this.calOtherFundOutflow();
      this.getTotalAmountOfExpenseAndTax();
    }
    if (e.target.checked == false && i == 0) {
      this.isCheckedAnnualLivingExpense = false;
      this.formArray.controls[i].patchValue({
        outflowLivingExpense: '',
      });
      this.calOtherFundOutflow();
    }
    //#endregion

    //#region Loss, Deduction, Other Expense
    if (e.target.checked == true && i == 1) {
      this.initialize_loss_deduction_other_expense_validation();
      this.isCheckedLossDeductionOtherExpense = true;
      //Loss, Deduction, Other Expense
      this.outflowLossArray = [];
      this.newOutflowLoss = { outflowLossLocation: "", outflowLossAmount: "" };
      this.outflowLossArray.push(this.newOutflowLoss);
      this.isOutflowLossDeleteActionShow = false;
      this.calOtherFundOutflow();
    }

    if (e.target.checked == false && i == 1) {
      this.initialize_loss_deduction_other_expense_validation();
      this.isCheckedLossDeductionOtherExpense = false;
      //Loss, Deduction, Other Expense
      this.outflowLossArray = [];
      this.newOutflowLoss = { outflowLossLocation: "", outflowLossAmount: "" };
      this.outflowLossArray.push(this.newOutflowLoss);
      this.isOutflowLossDeleteActionShow = false;
      this.calOtherFundOutflow();
    }
    //#endregion

    //#region Gift, Donation and Contribution
    if (e.target.checked == true && i == 2) {
      this.initialize_gift_donation_and_contribution_validation();
      this.isCheckedGiftDonationContribution = true;
      // Gift, Donation and Contribution
      this.outflowGiftArray = [];
      this.newOutflowGift = { outflowGiftParticulars: "", outflowGiftName: "", outflowGiftTIN: "", outflowGiftAmount: "" };
      this.outflowGiftArray.push(this.newOutflowGift);
      this.isOutflowGiftDeleteActionShow = false;
      this.calOtherFundOutflow();
    }
    if (e.target.checked == false && i == 2) {
      this.initialize_gift_donation_and_contribution_validation();
      this.isCheckedGiftDonationContribution = false;
      // Gift, Donation and Contribution
      this.outflowGiftArray = [];
      this.newOutflowGift = { outflowGiftParticulars: "", outflowGiftName: "", outflowGiftTIN: "", outflowGiftAmount: "" };
      this.outflowGiftArray.push(this.newOutflowGift);
      this.isOutflowGiftDeleteActionShow = false;
      this.calOtherFundOutflow();
    }
    //#endregion
  }

  //#region Loss, Deduction, Other Expense Add, Delete
  addCommaLossDeduction(event,i,colTitle:any)
  {
    if(colTitle === 'outflowLossAmount')
    this.outflowLossArray[i].outflowLossAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addOutflowLossRow(index) {
    if (this.validation_checking_loss_deduction_other_expense()) {
      this.newOutflowLoss = { outflowLossLocation: "", outflowLossAmount: "" };
      this.outflowLossArray.push(this.newOutflowLoss);
      this.isOutflowLossDeleteActionShow = true;
      this.initialize_loss_deduction_other_expense_validation();
      return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteOutflowLossRow(index) {
    if (this.outflowLossArray.length == 1) {
      this.isOutflowLossDeleteActionShow = false;
      this.calOtherFundOutflow();
      return false;
    } else {
      this.outflowLossArray.splice(index, 1);
      this.isOutflowLossDeleteActionShow = true;
      this.calOtherFundOutflow();
      if (this.outflowLossArray.length == 1) {
        this.isOutflowLossDeleteActionShow = false;
        this.calOtherFundOutflow();
      }
      return true;
    }
  }
  //#endregion

  //#region Gift, Donation and Contribution Add, Delete

  addCommaGiftDonationContribution(event,i,colTitle:any)
  {
    if(colTitle === 'outflowGiftAmount')
    this.outflowGiftArray[i].outflowGiftAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addOutflowGiftRow(index) {
    if(this.validation_checking_gift_donation_and_contribution()) {
      this.newOutflowGift = { outflowGiftParticulars: "", outflowGiftName: "", outflowGiftTIN: "", outflowGiftAmount: "" };
    this.outflowGiftArray.push(this.newOutflowGift);
    this.isOutflowGiftDeleteActionShow = true;
    this.initialize_gift_donation_and_contribution_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteOutflowGiftRow(index) {
    if (this.outflowGiftArray.length == 1) {
      this.isOutflowGiftDeleteActionShow = false;
      this.calOtherFundOutflow();
      return false;
    } else {
      this.outflowGiftArray.splice(index, 1);
      this.isOutflowGiftDeleteActionShow = true;
      this.calOtherFundOutflow();
      if (this.outflowGiftArray.length == 1) {
        this.isOutflowGiftDeleteActionShow = false;
        this.calOtherFundOutflow();
      }
      return true;
    }
  }
  //#endregion



  onSourceFundChange(e, i) {
    this.isSourceFund[i] = e.target.checked;

    //#region Income Shown In The Return
    if (e.target.checked == true && i == 0) {
      this.isCheckedIncomeShownInTheTown = true;
      this.formArray.controls[i].patchValue({
        sourceFundIncome: '',
      });
      this.calSourcesofFund();
      this.getTotalIncome();
    }
    if (e.target.checked == false && i == 0) {
      this.isCheckedIncomeShownInTheTown = false;
      this.formArray.controls[i].patchValue({
        sourceFundIncome: '',
      });
      this.calSourcesofFund();
    }
    //#endregion

    //#region Tax Exempted Income and Allowances
    if (e.target.checked == true && i == 1) {
      this.isCheckedTaxExemptedIncome = true;
      this.formArray.controls[i].patchValue({
        taxExemptedIncomeAndAllowances: '',
      });
      this.calSourcesofFund();
      this.getTotalExemptedIncome();
    }
    if (e.target.checked == false && i == 1) {
      this.isCheckedTaxExemptedIncome = false;
      this.formArray.controls[i].patchValue({
        taxExemptedIncomeAndAllowances: '',
      });
      this.calSourcesofFund();
    }
    //#endregion

    //#region Other Receipts
    if (e.target.checked == true && i == 2) {
      this.isCheckedOtherReceipts = true;
      // Other Receipts
      this.sourceFundReceiptsArray = [];
      this.newSourceFundReceipts = { sourceFundReceiptsParticulars: "", sourceFundReceiptsReference: "", sourceFundReceiptsAmount: "" };
      this.sourceFundReceiptsArray.push(this.newSourceFundReceipts);
      this.initialize_other_receipts_validation();
      this.isSourceFundReceiptsDeleteActionShow = false;
      this.calSourcesofFund();
    }
    if (e.target.checked == false && i == 2) {
      this.isCheckedOtherReceipts = false;
      // Other Receipts
      this.sourceFundReceiptsArray = [];
      this.newSourceFundReceipts = { sourceFundReceiptsParticulars: "", sourceFundReceiptsReference: "", sourceFundReceiptsAmount: "" };
      this.sourceFundReceiptsArray.push(this.newSourceFundReceipts);
      this.initialize_other_receipts_validation();
      this.isSourceFundReceiptsDeleteActionShow = false;
      this.calSourcesofFund();
    }
    //#endregion

  }






  //#region Other Receipts Add, Delete
  addCommaOtherReceipts(event,i,colTitle:any)
  {
    if(colTitle === 'sourceFundReceiptsAmount')
    this.sourceFundReceiptsArray[i].sourceFundReceiptsAmount = this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(event.target.value));
  }

  addSourceFundReceiptsRow(index) {
    if(this.validation_checking_other_receipts()) {
      this.newSourceFundReceipts = { sourceFundReceiptsParticulars: "", sourceFundReceiptsReference: "", sourceFundReceiptsAmount: "" };
    this.sourceFundReceiptsArray.push(this.newSourceFundReceipts);
    this.isSourceFundReceiptsDeleteActionShow = true;
    this.initialize_other_receipts_validation();
    return true;
    } else {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }

  deleteSourceFundReceiptsRow(index) {
    if (this.sourceFundReceiptsArray.length == 1) {
      this.isSourceFundReceiptsDeleteActionShow = false;
      this.calSourcesofFund();
      return false;
    } else {
      this.sourceFundReceiptsArray.splice(index, 1);
      this.isSourceFundReceiptsDeleteActionShow = true;
      this.calSourcesofFund();
      if (this.sourceFundReceiptsArray.length == 1) {
        this.isSourceFundReceiptsDeleteActionShow = false;
        this.calSourcesofFund();
      }
      return true;
    }
  }
  //#endregion


  onPreviousYearNetWealth(e, i) {
    this.isPreviousYearNetWealth[i] = e.target.checked;

    //#region Previous Year Net Wealth
    if (e.target.checked == true && i == 0) {
      this.isCheckedPreviousYearNetWealth = true;
      this.formArray.controls[i].patchValue({
        PreviousIncomeYearNetWealth: '',
      });
      // this.previousIncomeYearNetWealth = 0;
      this.calPreviousIncomeYearNetWealth();
    }
    if (e.target.checked == false && i == 0) {
      this.isCheckedPreviousYearNetWealth = false;
      this.formArray.controls[i].patchValue({
        PreviousIncomeYearNetWealth: '',
      });
      // this.previousIncomeYearNetWealth = 0;
      this.calPreviousIncomeYearNetWealth();
    }
    //#endregion
  }

  refreshTotalExpenseTax(){
    this.getTotalAmountOfExpenseAndTax();
  }

  getTotalAmountOfExpenseAndTax() {
    //debugger;

    let expenditureGetDataReqBody:any;
    let expenditureData:any;
    let totalAmountOfExpenseAndTax: any;

    expenditureGetDataReqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/get_expendsummary')
      .subscribe(result => {

        if (JSON.stringify(result.replyMessage) != '{}') {

          expenditureData = result['replyMessage'];
          expenditureData.Expense_Tax_Total.forEach(element => {
            totalAmountOfExpenseAndTax = element.Expense_Tax_Total_Amount;
          });

          // if (totalAmountOfExpenseAndTax > 0) {
            this.isOutflowCollapsed = true;
            this.isCheckedAnnualLivingExpense = true;
            this.isOutflow[0] = true;
            this.group.get("outflowLivingExpense").setValue(totalAmountOfExpenseAndTax);
            this.calOtherFundOutflow();
          // }
        }
        else{
          this.isOutflowCollapsed = true;
          this.isCheckedAnnualLivingExpense = true;
          this.isOutflow[0] = true;
          this.group.get("outflowLivingExpense").setValue(0);
          this.calOtherFundOutflow();
        }
        this.spinner.stop();
      },
        error => {
          this.spinner.stop();
       //   console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

    // totalAmountOfExpenseAndTax = localStorage.getItem('totalAmountOfExpenseAndTaxAmt');
    // if (totalAmountOfExpenseAndTax > 0) {
    //   this.isOutflowCollapsed = true;
    //   this.isCheckedAnnualLivingExpense = true;
    //   this.isOutflow[0] = true;
    //   this.group.get("outflowLivingExpense").setValue(totalAmountOfExpenseAndTax);
    //   this.calOtherFundOutflow();
    // }
  }

  total_Income_Amt: any;
  total_Exempted_Income_Amt: any;
  total_loss_not_setoff: any;

  getTaxPaymentData(): Promise<void> {
    let reqBody: any;
    let taxPaymentGetData: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/tax_payment')
        .subscribe(result => {

          if (JSON.stringify(result.replyMessage) != '{}') {
            taxPaymentGetData = result.replyMessage;

            this.total_Income_Amt = taxPaymentGetData.poti_Total_Income_Amt ? Math.round(taxPaymentGetData.poti_Total_Income_Amt) : 0;

            if (this.total_Income_Amt > 0) {
              this.isSourceFundCollapsed = true;
              this.isCheckedIncomeShownInTheTown = true;
              this.isSourceFund[0] = true;
            } else {
              this.isSourceFundCollapsed = false;
              this.isCheckedIncomeShownInTheTown = false;
              this.isSourceFund[0] = false;
            }

            this.total_Exempted_Income_Amt = taxPaymentGetData.poti_Tax_Exempted_Income_Amt ? Math.round(taxPaymentGetData.poti_Tax_Exempted_Income_Amt) : 0;
            if (this.total_Exempted_Income_Amt > 0) {
              this.isSourceFundCollapsed = true;
              this.isCheckedTaxExemptedIncome = true;
            } else {
              this.isCheckedTaxExemptedIncome = false;
            }

            // Other Receipts
            this.total_loss_not_setoff = taxPaymentGetData.set_Off_Total_Loss_Not_Set_Off ? Math.round(taxPaymentGetData.set_Off_Total_Loss_Not_Set_Off) : 0;
            if (this.total_loss_not_setoff != 0) {
              this.sourceFundReceiptsArray = [];
              let obj = {
                sourceFundReceiptsParticulars: "Loss Not Set Off",
                sourceFundReceiptsAmount: this.total_loss_not_setoff ? this.commaSeparator.currencySeparatorBD(this.total_loss_not_setoff) : '',
                sourceFundReceiptsReference: "Section 37"
              }
              this.sourceFundReceiptsArray.push(obj);
              this.isSourceFundCollapsed = true;
              this.isCheckedOtherReceipts = true;
              this.isSetoffLossExists = true;
              this.isSourceFund[2] = true;
            } else {
              this.isCheckedOtherReceipts = false;
              this.isSetoffLossExists = false;
              this.isSourceFund[2] = false;
            }
          }
          resolve();
        },
          error => {
            reject();
    //        console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
      // Other Receipts
      if (!(this.sourceFundReceiptsArray.length > 0)) {
        this.sourceFundReceiptsArray = [];
        this.newSourceFundReceipts = { sourceFundReceiptsParticulars: "", sourceFundReceiptsReference: "", sourceFundReceiptsAmount: "" };
        this.sourceFundReceiptsArray.push(this.newSourceFundReceipts);
        this.isSourceFundReceiptsDeleteActionShow = false;
      }

      //#endregion
    });
  }

  getTotalIncome() {
    let reqBody: any;
    let taxPaymentGetData: any;
    let total_Income_Amt: any;

    //#region RequestBody
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    //#endregion

    this.apiService.get(this.serviceUrl + 'api/tax_payment')
      .subscribe(result => {

        if (JSON.stringify(result.replyMessage) != '{}') {

          taxPaymentGetData = result.replyMessage;

          total_Income_Amt = taxPaymentGetData.poti_Total_Income_Amt ? Math.round(taxPaymentGetData.poti_Total_Income_Amt) : 0;
          if (total_Income_Amt > 0) {
            this.isSourceFundCollapsed = true;
            this.isCheckedIncomeShownInTheTown = true;
            this.isSourceFund[0] = true;
            this.group.get("sourceFundIncome").setValue(this.commaSeparator.currencySeparatorBD(total_Income_Amt));
            this.calSourcesofFund();
          }
        }
      },
        error => {
     //     console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  getTotalExemptedIncome() {
    let reqBody: any;
    let taxPaymentGetData: any;
    let total_Exempted_Income_Amt: any;

    //#region RequestBody
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    //#endregion

    this.apiService.get(this.serviceUrl + 'api/tax_payment')
      .subscribe(result => {

        if (JSON.stringify(result.replyMessage) != '{}') {

          taxPaymentGetData = result.replyMessage;

          total_Exempted_Income_Amt = taxPaymentGetData.poti_Tax_Exempted_Income_Amt ? Math.round(taxPaymentGetData.poti_Tax_Exempted_Income_Amt) : 0;
          if (total_Exempted_Income_Amt > 0) {
            this.isSourceFundCollapsed = true;
            this.isCheckedTaxExemptedIncome = true;
            this.isSourceFund[1] = true;
            this.group.get("taxExemptedIncomeAndAllowances").setValue(this.commaSeparator.currencySeparatorBD(total_Exempted_Income_Amt));
            this.calSourcesofFund();
          }
        }
      },
        error => {
    //      console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  isMandatoryFieldEmpty: boolean = false;
  submittedData() {
    this.isMandatoryFieldEmpty = false;

    //#region Assets & Liabilities Post Api Field  & their values (For documentation)

    // Name(Name, Unit)
    // Type(Type of the Securities, Type of Acquisition, Bank and Other FI Type)
    // Description(Description & Location, Particulars / Type and Particulars / Particulars of the Fund / Particulars of the Lender, Purpose)
    // Value(All single value or amount fields)
    // OtherInfo(No of Shares, Related Details, Other Detail, Area of the Property, Engine(CC), Quantity)
    // StartYrAmount
    // EndYrAmount
    // Issue Date
    // relatedIN(TIN, AccountNo, Registration / Issue No, Amount / Card no.Reference)

    // * Exception:
    // 1. for Gold, Diamond, Gems and Other Items-- > OtherInfo(value)

    //#endregion

    let successValidation: boolean = true;
    if(this.isCheckedDirectorShareholdings) {
      if (this.businessDirectorArray.length > 0 && !this.validation_checking_director_shareholdings_in_limited_companies() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }
    if(this.isCheckedBusinessCapitalOtherThanDirectorShareholdings) {
      if (this.businessOtherArray.length > 0 && !this.validation_checking_business_capital_other_than_director_shareholdings_in_limited_companies() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }
    if(this.isCheckedNonAgriPropertyChild) {
      if (this.nonAgriPropertyArray.length > 0 && !this.validation_checking_non_agricultural_property_parent() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }
    if(this.ischeckedAdvanceMadeNonAgriProperty) {
      if (this.advanceNonAgriPropertyArray.length > 0 && !this.validation_checking_advance_made_for_non_agricultural_property() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedAgriProperty) {
      if (this.agriPropertyArray.length > 0 && !this.validation_checking_agricultural_property() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedShareDebentureEtc) {
      if (this.financialShareArray.length > 0 && !this.validation_checking_share_debenture_etc() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedSavingsCertificate) {
      if (this.financialSavingsArray.length > 0 && !this.validation_checking_savings_certificate_bonds_and_other_government_securities() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedFixDepositTermDeposit) {
      if (this.financialDepositsArray.length > 0 && !this.validation_checking_fix_deposits_term_deposits_and_dps() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if (this.isCheckedLoanGiven) {
      if (successValidation) {
        if (this.financialLoansArray.length > 0 && !this.validation_checking_loans_given_to_others() && successValidation) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          return;
        } else {
          this.financialLoansArray.forEach((element, index) => {
            if (element.financialLoansBorrowerTIN != "" && element.financialLoansBorrowerTIN != null) {
              if (element.financialLoansBorrowerTIN.length != 12) {
                this.toastr.warning('Incorrect TIN of the Borrower! Please try again with valid TIN!', '', {
                  timeOut: 2000,
                });
                successValidation = false;
                return;
              }
            }
          });
        }
      }
    }

    if(this.isCheckedOtherFinancial) {
      if (this.financialOtherArray.length > 0 && !this.validation_checking_other_financial_assets() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedMotorCar) {
      if (this.motorCarArray.length > 0 && !this.validation_checking_motor_car() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedGoldDiamond) {
      if (this.jewelleryArray.length > 0 && !this.validation_checking_gold_diamond_gems_and_other_items() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedFurnitureEquipment) {
      if (this.furnitureArray.length > 0 && !this.validation_checking_furniture_equipments_and_electronic_items() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedOtherAssets) {
      if (this.otherAssetsArray.length > 0 && !this.validation_checking_other_assets_of_significant_value() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedNotesCurrencies) {
      if (this.notesCurrenciesArray.length > 0 && !this.validation_checking_notes_and_currencies() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedProvidentFund) {
      if (this.fundArray.length > 0 && !this.validation_checking_provident_fund_and_other_fund() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedOtherDepositBalance) {
      if (this.outsideDepositsArray.length > 0 && !this.validation_checking_other_deposits_balance_and_advance() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedBorrowingFromBank) {
      if (this.liabilitiesBorrowArray.length > 0 && !this.validation_checking_borrowing_from_bank_or_other_fi() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if (this.isCheckedUnsecuredLoan) {
      if (successValidation) {
        if (this.liabilitiesUnsecuredLoanArray.length > 0 && !this.validation_checking_unsecured_loan() && successValidation) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          return;
        } else {
          this.liabilitiesUnsecuredLoanArray.forEach((element, index) => {
            if (element.liabilitiesUnsecuredLoanTIN != "" && element.liabilitiesUnsecuredLoanTIN != null) {
              if (element.liabilitiesUnsecuredLoanTIN.length != 12) {
                this.toastr.warning('Incorrect TIN of the Lender! Please try again with valid TIN!', '', {
                  timeOut: 2000,
                });
                successValidation = false;
                return;
              }
            }
          });
        }
      }
    }

    if(this.isCheckedOtherLoanOrOverdraft) {
      if (this.liabilitiesOtherArray.length > 0 && !this.validation_checking_other_loan_or_overdraft() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if(this.isCheckedLossDeductionOtherExpense) {
      if (this.outflowLossArray.length > 0 && !this.validation_checking_loss_deduction_other_expense() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }

    if (this.isCheckedGiftDonationContribution) {
      if (successValidation) {
        if (this.outflowGiftArray.length > 0 && !this.validation_checking_gift_donation_and_contribution()) {
          this.toastr.warning('Please fill all the required fields!', '', {
            timeOut: 2000,
          });
          successValidation = false;
          return;
        } else {
          this.outflowGiftArray.forEach((element, index) => {
            if (element.outflowGiftTIN != "" && element.outflowGiftTIN != null) {
              if (element.outflowGiftTIN.length != 12) {
                this.toastr.warning('Incorrect TIN of the Receiver! Please try again with valid TIN!', '', {
                  timeOut: 2000,
                });
                successValidation = false;
                return;
              }
            }
          });
        }
      }
    }

    if(this.isCheckedOtherReceipts) {
      if (this.sourceFundReceiptsArray.length > 0 && !this.validation_checking_other_receipts() && successValidation) {
        this.toastr.warning('Please fill all the required fields!', '', {
          timeOut: 2000,
        });
        successValidation = false;
        return;
      }
    }


    if(!successValidation) return;

    //#region businessDirectorArray
    let businessDirectorArrayData = [];
    let businessDirectorArrayOBJ: any;

    this.businessDirectorArray.forEach((element, index) => {
      
      businessDirectorArrayOBJ = {
        "name": element.businessDirectorCompany ? element.businessDirectorCompany : '',
        "type": element.businessDirectorAcquisition ? element.businessDirectorAcquisition : '',
        "description": '',
        "value": element.businessDirectorValue ? this.commaSeparator.extractComma(element.businessDirectorValue) : 0,
        "otherInfo": element.businessDirectorShares ?  this.commaSeparator.extractComma(element.businessDirectorShares) : '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      businessDirectorArrayData.push(businessDirectorArrayOBJ);
    });
    //#endregion

    //#region businessOtherArray
    let businessOtherArrayData = [];
    let businessOtherArrayOBJ: any;

    this.businessOtherArray.forEach((element, index) => {

      businessOtherArrayOBJ = {
        "name": element.businessOtherProfession ? element.businessOtherProfession : '',
        "type": '',
        "description": '',
        "value": element.businessOtherCapital ?  this.commaSeparator.extractComma(element.businessOtherCapital) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      businessOtherArrayData.push(businessOtherArrayOBJ);
    });
    //#endregion

    //#region nonAgriPropertyArray
    let nonAgriPropertyArrayData = [];
    let nonAgriPropertyArrayOBJ: any;

    this.nonAgriPropertyArray.forEach((element, index) => {

      nonAgriPropertyArrayOBJ = {
        "name": element.unitOfArea ? element.unitOfArea : '',
        "type": element.nonAgriPropertyAcquisition ? element.nonAgriPropertyAcquisition : '',
        "description": element.nonAgriPropertyLocation ? element.nonAgriPropertyLocation : '',
        "value": 0,
        "otherInfo": element.nonAgriPropertyArea ? this.commaSeparator.extractComma(element.nonAgriPropertyArea) : '',
        "startYrAmount": element.nonAgriPropertyValueStart ? this.commaSeparator.extractComma(element.nonAgriPropertyValueStart) : 0,
        "endYrAmount": element.nonAgriPropertyValueEnd ? this.commaSeparator.extractComma(element.nonAgriPropertyValueEnd) : 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      nonAgriPropertyArrayData.push(nonAgriPropertyArrayOBJ);
    });
    //#endregion

    //#region advanceNonAgriPropertyArray
    let advanceNonAgriPropertyArrayData = [];
    let advanceNonAgriPropertyArrayOBJ: any;

    this.advanceNonAgriPropertyArray.forEach((element, index) => {

      advanceNonAgriPropertyArrayOBJ = {
        "name": '',
        "type": element.advanceNonAgriPropertyAcquisition ? element.advanceNonAgriPropertyAcquisition : '',
        "description": element.advanceNonAgriPropertyLocation ? element.advanceNonAgriPropertyLocation : '',
        "value": 0,
        "otherInfo": '',
        "startYrAmount": element.advanceNonAgriPropertyValueStart ? this.commaSeparator.extractComma(element.advanceNonAgriPropertyValueStart): 0,
        "endYrAmount": element.advanceNonAgriPropertyValueEnd ? this.commaSeparator.extractComma(element.advanceNonAgriPropertyValueEnd) : 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      advanceNonAgriPropertyArrayData.push(advanceNonAgriPropertyArrayOBJ);
    });
    //#endregion

    //#region agriPropertyArray
    let agriPropertyArrayData = [];
    let agriPropertyArrayOBJ: any;

    this.agriPropertyArray.forEach((element, index) => {
      agriPropertyArrayOBJ = {
        "name": element.unitOfAgriArea ? element.unitOfAgriArea : '',
        "type": element.agriPropertyAcquisition ? element.agriPropertyAcquisition : '',
        "description": element.agriPropertyLocation ? element.agriPropertyLocation : '',
        "value": 0,
        "otherInfo": element.agriPropertyArea ? this.commaSeparator.extractComma(element.agriPropertyArea) : '',
        "startYrAmount": element.agriPropertyValueStart ? this.commaSeparator.extractComma(element.agriPropertyValueStart) : 0,
        "endYrAmount": element.agriPropertyValueEnd ? this.commaSeparator.extractComma(element.agriPropertyValueEnd) : 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      agriPropertyArrayData.push(agriPropertyArrayOBJ);
    });
    //#endregion

    //#region Financial Share
    let financialShareArrayData = [];
    let financialShareArrayOBJ: any;

    this.financialShareArray.forEach((element, index) => {

      financialShareArrayOBJ = {
        "name": element.financialShareBrokerage ? element.financialShareBrokerage : '',
        "type": element.financialShareAcquisition ? element.financialShareAcquisition : '',
        "description": '',
        "value": element.financialShareValue ? this.commaSeparator.extractComma(element.financialShareValue) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.financialShareBO ? element.financialShareBO : ''
      }
      financialShareArrayData.push(financialShareArrayOBJ);
    });
    //#endregion

    //#region Financial Savings
    let financialSavingsArrayData = [];
    let financialSavingsArrayOBJ: any;

    this.financialSavingsArray.forEach((element, index) => {

      let dateOfIssue = element.financialSavingsIssueDate ? moment(element.financialSavingsIssueDate, 'DD-MM-YYYY') : '';
      financialSavingsArrayOBJ = {
        "name": '',
        "type": element.financialSavingsSecurity ? element.financialSavingsSecurity : '',
        "description": '',
        "value": element.financialSavingsValue ? this.commaSeparator.extractComma(element.financialSavingsValue) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": dateOfIssue ? this.datepipe.transform(dateOfIssue, 'dd-MM-yyyy') : '',
        "relatedIN": element.financialSavingsIssueNo ? element.financialSavingsIssueNo : ''
      }
      financialSavingsArrayData.push(financialSavingsArrayOBJ);
    });
    //#endregion

    //#region Financial Deposit
    let financialDepositsArrayData = [];
    let financialDepositsArrayOBJ: any;

    this.financialDepositsArray.forEach((element, index) => {

      financialDepositsArrayOBJ = {
        "name": element.financialDepositsBankName ? element.financialDepositsBankName : '',
        "type": element.financialDepositsAcquisition ? element.financialDepositsAcquisition : '',
        "description": element.financialDepositsParticulars ? element.financialDepositsParticulars : '',
        "value": element.financialDepositsBalance ? this.commaSeparator.extractComma(element.financialDepositsBalance) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.financialDepositsAccount ? element.financialDepositsAccount : ''
      }
      financialDepositsArrayData.push(financialDepositsArrayOBJ);
    });
    //#endregion

    //#region Financial loans
    let financialLoansArrayData = [];
    let financialLoansArrayOBJ: any;

    this.financialLoansArray.forEach((element, index) => {

      financialLoansArrayOBJ = {
        "name": element.financialLoansBorrowerName ? element.financialLoansBorrowerName : '',
        "type": '',
        "description": element.financialLoansParticulars ? element.financialLoansParticulars : '',
        "value": element.financialLoansAmount ? this.commaSeparator.extractComma(element.financialLoansAmount) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.financialLoansBorrowerTIN ? element.financialLoansBorrowerTIN : ''
      }
      financialLoansArrayData.push(financialLoansArrayOBJ);
    });
    //#endregion

    //#region Financial Other Assets
    let financialOtherArrayData = [];
    let financialOtherArrayOBJ: any;

    this.financialOtherArray.forEach((element, index) => {

      financialOtherArrayOBJ = {
        "name": '',
        "type": element.financialOtherAcquisition ? element.financialOtherAcquisition : '',
        "description": element.financialOtherParticulars ? element.financialOtherParticulars : '',
        "value": element.financialOtherAmount ? this.commaSeparator.extractComma(element.financialOtherAmount) : 0,
        "otherInfo": element.financialOtherDetails ? element.financialOtherDetails : '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      financialOtherArrayData.push(financialOtherArrayOBJ);
    });
    //#endregion

    //#region Motor Car
    let motorCarArrayData = [];
    let motorCarArrayOBJ: any;

    this.motorCarArray.forEach((element, index) => {

      motorCarArrayOBJ = {
        "name": element.engineType ? element.engineType : '',
        "type": element.motorCarAcquisition ? element.motorCarAcquisition : '',
        "description": element.motorCarParticulars ? element.motorCarParticulars : '',
        "value": element.motorCarAmount ? this.commaSeparator.extractComma(element.motorCarAmount) : 0,
        "otherInfo": element.motorCarEngine ? element.motorCarEngine : '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.motorCarRegistration ? element.motorCarRegistration : ''
      }
      motorCarArrayData.push(motorCarArrayOBJ);
    });
    //#endregion

    //#region Gold, Diamond, Gems and Other Items
    let jewelleryArrayData = [];
    let jewelleryArrayOBJ: any;

    this.jewelleryArray.forEach((element, index) => {

      jewelleryArrayOBJ = {
        "name": element.unitOfJewellery ? element.unitOfJewellery : '',
        "type": element.jewelleryAcquisition ? element.jewelleryAcquisition : '',
        "description": element.jewelleryParticulars ? element.jewelleryParticulars : '',
        "value": this.commaSeparator.extractComma(element.jewelleryValue),
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": element.jewelleryQuantityEnd ? this.commaSeparator.extractComma(element.jewelleryQuantityEnd) : 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      jewelleryArrayData.push(jewelleryArrayOBJ);
    });
    //#endregion

    //#region Furniture
    let furnitureArrayData = [];
    let furnitureArrayOBJ: any;

    this.furnitureArray.forEach((element, index) => {

      //Validation start
      if((element.FurnitureParticulars ? 
        !element.FurnitureParticulars.trim() : !element.FurnitureParticulars) && 
        this.isCheckedFurnitureEquipment && !this.isMandatoryFieldEmpty) {

        this.isMandatoryFieldEmpty = true;
        this.renderer.selectRootElement('#FurnitureParticulars_'+index).focus();
        this.toastr.warning('Particulars is Empty! Please Fill It.', '', {
          timeOut: 2000,
        });

      } else if((!element.FurnitureAcquisition) && this.isCheckedFurnitureEquipment && !this.isMandatoryFieldEmpty) {
        
        this.isMandatoryFieldEmpty = true;
        document.getElementById('FurnitureAcquisition_'+index).focus();
        this.toastr.warning('Type of Acquisition is not Selected! Please Select It.', '', {
          timeOut: 2000,
        });

      } else if((element.FurnitureValue ? 
        !element.FurnitureValue.trim() : !element.FurnitureValue) && 
        this.isCheckedFurnitureEquipment && !this.isMandatoryFieldEmpty) {

        this.isMandatoryFieldEmpty = true;
        this.renderer.selectRootElement('#FurnitureValue_'+index).focus();
        this.toastr.warning('Value is Empty! Please Fill It.', '', {
          timeOut: 2000,
        });

      }

      //validation end

      furnitureArrayOBJ = {
        "name": '',
        "type": element.FurnitureAcquisition ? element.FurnitureAcquisition : '',
        "description": element.FurnitureParticulars ? element.FurnitureParticulars : '',
        "value": element.FurnitureValue ? this.commaSeparator.extractComma(element.FurnitureValue) : 0,
        "otherInfo": element.FurnitureQuantity ? element.FurnitureQuantity : '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      furnitureArrayData.push(furnitureArrayOBJ);
    });
    //#endregion

    //#region Other Asset
    let otherAssetsArrayData = [];
    let otherAssetsArrayOBJ: any;

    this.otherAssetsArray.forEach((element, index) => {

      otherAssetsArrayOBJ = {
        "name": '',
        "type": element.otherAssetsAcquisition ? element.otherAssetsAcquisition : '',
        "description": element.otherAssetsParticulars ? element.otherAssetsParticulars : '',
        "value": element.otherAssetsValue ? this.commaSeparator.extractComma(element.otherAssetsValue) : 0,
        "otherInfo": element.otherAssetsDetail ? element.otherAssetsDetail : '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      otherAssetsArrayData.push(otherAssetsArrayOBJ);
    });
    //#endregion

    //#region Notes Currency
    let notesCurrenciesArrayData = [];
    let notesCurrenciesArrayOBJ: any;

    this.notesCurrenciesArray.forEach((element, index) => {

      notesCurrenciesArrayOBJ = {
        "name": '',
        "type": '',
        "description": '',
        "value": element.notesCurrenciesAmount ? this.commaSeparator.extractComma(element.notesCurrenciesAmount) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      notesCurrenciesArrayData.push(notesCurrenciesArrayOBJ);
    });
    //#endregion

    //#region Electronic Cash
    let electronicCashArrayData = [];
    let electronicCashArrayOBJ: any;

    this.electronicCashArray.forEach((element, index) => {
      electronicCashArrayOBJ = {
        "name": element.electronicCashFIName ? element.electronicCashFIName : '',
        "type": element.electronicCashFI ? element.electronicCashFI : '',
        "description": '',
        "value": element.electronicCashBalance ? this.commaSeparator.extractComma(element.electronicCashBalance) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.electronicCashAccountCardNo ? element.electronicCashAccountCardNo : ''
      }
      electronicCashArrayData.push(electronicCashArrayOBJ);
    });
    //#endregion

    //#region provident fund
    let fundArrayData = [];
    let fundArrayOBJ: any;

    this.fundArray.forEach((element, index) => {

      fundArrayOBJ = {
        "name": '',
        "type": '',
        "description": element.fundParticulars ? element.fundParticulars : '',
        "value": element.fundBalance ? this.commaSeparator.extractComma(element.fundBalance) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.fundAccount ? element.fundAccount : ''
      }
      fundArrayData.push(fundArrayOBJ);
    });
    //#endregion

    //#region Other Deposits, Balance and Advance
    let outsideDepositsArrayData = [];
    let outsideDepositsArrayOBJ: any;

    this.outsideDepositsArray.forEach((element, index) => {

      outsideDepositsArrayOBJ = {
        "name": '',
        "type": '',
        "description": element.outsideDepositsParticulars ? element.outsideDepositsParticulars : '',
        "value": element.outsideDepositsBalance ? this.commaSeparator.extractComma(element.outsideDepositsBalance) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      outsideDepositsArrayData.push(outsideDepositsArrayOBJ);
    });
    //#endregion

    //#region Borrowing from Bank or other FI
    let liabilitiesBorrowArrayData = [];
    let liabilitiesBorrowArrayOBJ: any;

    this.liabilitiesBorrowArray.forEach((element, index) => {

      liabilitiesBorrowArrayOBJ = {
        "name": element.liabilitiesBorrowBankName ? element.liabilitiesBorrowBankName : '',
        "type": '',
        "description": element.liabilitiesBorrowPurpose ? element.liabilitiesBorrowPurpose : '',
        "value": element.liabilitiesBorrowBalance ? this.commaSeparator.extractComma(element.liabilitiesBorrowBalance) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.liabilitiesBorrowAccount ? element.liabilitiesBorrowAccount : ''
      }
      liabilitiesBorrowArrayData.push(liabilitiesBorrowArrayOBJ);
    });
    //#endregion

    //#region Unsecured Loan
    let liabilitiesUnsecuredLoanArrayData = [];
    let liabilitiesUnsecuredLoanArrayOBJ: any;

    this.liabilitiesUnsecuredLoanArray.forEach((element, index) => {

      liabilitiesUnsecuredLoanArrayOBJ = {
        "name": element.liabilitiesUnsecuredLoanName ? element.liabilitiesUnsecuredLoanName : '',
        "type": '',
        "description": element.liabilitiesUnsecuredLoanPurpose ? element.liabilitiesUnsecuredLoanPurpose : '',
        "value": element.liabilitiesUnsecuredLoanBalance ? this.commaSeparator.extractComma(element.liabilitiesUnsecuredLoanBalance) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.liabilitiesUnsecuredLoanTIN ? element.liabilitiesUnsecuredLoanTIN : ''
      }
      liabilitiesUnsecuredLoanArrayData.push(liabilitiesUnsecuredLoanArrayOBJ);
    });
    //#endregion

    //#region Other Loan or Overdraft
    let liabilitiesOtherArrayData = [];
    let liabilitiesOtherArrayOBJ: any;

    this.liabilitiesOtherArray.forEach((element, index) => {

      liabilitiesOtherArrayOBJ = {
        "name": '',
        "type": element.liabilitiesOtherLoan ? element.liabilitiesOtherLoan : '',
        "description": element.liabilitiesOtherParticulars ? element.liabilitiesOtherParticulars : '',
        "value": element.liabilitiesOtherBalance ? this.commaSeparator.extractComma(element.liabilitiesOtherBalance) : 0,
        "otherInfo": element.liabilitiesOtherDetail ? element.liabilitiesOtherDetail : '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      liabilitiesOtherArrayData.push(liabilitiesOtherArrayOBJ);
    });
    //#endregion

    //#region Annual Living Expense
    let annualLivingExpenseArrayData = [];
    let annualLivingExpenseArrayOBJ: any;

    this.formArray.controls.forEach((element, index) => {
      annualLivingExpenseArrayOBJ = {
        "name": '',
        "type": '',
        "description": '',
        "value": element.value.outflowLivingExpense ? this.commaSeparator.extractComma(element.value.outflowLivingExpense) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      annualLivingExpenseArrayData.push(annualLivingExpenseArrayOBJ);
    });
    //#endregion

    //#region Loss, Deduction, Other Expense
    let outflowLossArrayData = [];
    let outflowLossArrayOBJ: any;

    this.outflowLossArray.forEach((element, index) => {

      outflowLossArrayOBJ = {
        "name": element.outflowLossLocation ? element.outflowLossLocation : '',
        "type": '',
        "description": '',
        "value": element.outflowLossAmount ? this.commaSeparator.extractComma(element.outflowLossAmount) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      outflowLossArrayData.push(outflowLossArrayOBJ);
    });
    //#endregion

    //#region Gift, Donation and Contribution
    let outflowGiftArrayData = [];
    let outflowGiftArrayOBJ: any;

    this.outflowGiftArray.forEach((element, index) => {

      outflowGiftArrayOBJ = {
        "name": element.outflowGiftName ? element.outflowGiftName : '',
        "type": '',
        "description": element.outflowGiftParticulars ? element.outflowGiftParticulars : '',
        "value": element.outflowGiftAmount ? this.commaSeparator.extractComma(element.outflowGiftAmount) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.outflowGiftTIN ? element.outflowGiftTIN : ''
      }
      outflowGiftArrayData.push(outflowGiftArrayOBJ);
    });
    //#endregion

    //#region Income Shown In The Return
    let incomeShownArrayData = [];
    let incomeShownArrayOBJ: any;

    this.formArray.controls.forEach((element, index) => {
      incomeShownArrayOBJ = {
        "name": '',
        "type": '',
        "description": '',
        "value": element.value.sourceFundIncome ? this.commaSeparator.extractComma(element.value.sourceFundIncome) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      incomeShownArrayData.push(incomeShownArrayOBJ);
    });
    //#endregion

    //#region Tax Exempted Income and Allowances
    let exemptedIncomeShownArrayData = [];
    let exemptedIncomeShownArrayOBJ: any;

    this.formArray.controls.forEach((element, index) => {
      exemptedIncomeShownArrayOBJ = {
        "name": '',
        "type": '',
        "description": '',
        "value": element.value.taxExemptedIncomeAndAllowances ? this.commaSeparator.extractComma(element.value.taxExemptedIncomeAndAllowances) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      exemptedIncomeShownArrayData.push(exemptedIncomeShownArrayOBJ);
    });
    //#endregion

    //#region Other Receipts
    let sourceFundReceiptsArrayData = [];
    let sourceFundReceiptsArrayOBJ: any;

    this.sourceFundReceiptsArray.forEach((element, index) => {

      sourceFundReceiptsArrayOBJ = {
        "name": '',
        "type": '',
        "description": element.sourceFundReceiptsParticulars ? element.sourceFundReceiptsParticulars : '',
        "value": element.sourceFundReceiptsAmount ? this.commaSeparator.extractComma(element.sourceFundReceiptsAmount) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": element.sourceFundReceiptsReference ? element.sourceFundReceiptsReference : ''
      }
      sourceFundReceiptsArrayData.push(sourceFundReceiptsArrayOBJ);
    });
    //#endregion

    //#region previous Net Wealth
    let previousNetWealthArrayData = [];
    let previousNetWealthArrayOBJ: any;

    this.formArray.controls.forEach((element, index) => {
      previousNetWealthArrayOBJ = {
        "name": '',
        "type": '',
        "description": '',
        "value": element.value.PreviousIncomeYearNetWealth ?  this.commaSeparator.extractComma(element.value.PreviousIncomeYearNetWealth) : 0,
        "otherInfo": '',
        "startYrAmount": 0,
        "endYrAmount": 0,
        "dateOfIssue": '',
        "relatedIN": ''
      }
      previousNetWealthArrayData.push(previousNetWealthArrayOBJ);
    });
    //#endregion

    if(!this.isMandatoryFieldEmpty) {
      //#region Request Body

      this.postRequestBody = {
        "tinNo": this.userTin,
        "assessmentYear": "2021-2022",
        "alParticularsDtos": [
          //Assets director_shareholdings
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "business_capital",
            "firstSubTypeValue": this.isCheckedBusinessCapital,
            "secondSubTypeKey": "director_shareholdings_in_limited_companies",
            "secondSubTypeValue": this.isCheckedDirectorShareholdings,
            "alDetailsDtos": businessDirectorArrayData
          },
          //Assets other_than_director_shareholdings
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "business_capital",
            "firstSubTypeValue": this.isCheckedBusinessCapital,
            "secondSubTypeKey": "business_capital_other_than_director's_shareholdings_in_limited_companies",
            "secondSubTypeValue": this.isCheckedBusinessCapitalOtherThanDirectorShareholdings,
            "alDetailsDtos": businessOtherArrayData
          },
          //Assets non-agri_property_child
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "non_agricultural_property_parent",
            "firstSubTypeValue": this.isCheckedNonAgriPropertyParent,
            "secondSubTypeKey": "non_agricultural_property_child",
            "secondSubTypeValue": this.isCheckedNonAgriPropertyChild,
            "alDetailsDtos": nonAgriPropertyArrayData
          },
          //Assets advance_made_for_non_agricultural_property
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "non_agricultural_property_parent",
            "firstSubTypeValue": this.isCheckedNonAgriPropertyParent,
            "secondSubTypeKey": "advance_made_for_non_agricultural_property",
            "secondSubTypeValue": this.ischeckedAdvanceMadeNonAgriProperty,
            "alDetailsDtos": advanceNonAgriPropertyArrayData
          },
          //Assets agricultural_property
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "agricultural_property",
            "firstSubTypeValue": this.isCheckedAgriProperty,
            "secondSubTypeKey": '',
            "secondSubTypeValue": '',
            "alDetailsDtos": agriPropertyArrayData
          },
          //Assets share_debenture_etc
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "financial_assets",
            "firstSubTypeValue": this.isCheckedFinancialAssets,
            "secondSubTypeKey": "share_debenture_etc",
            "secondSubTypeValue": this.isCheckedShareDebentureEtc,
            "alDetailsDtos": financialShareArrayData
          },
          //Assets savings_certificate
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "financial_assets",
            "firstSubTypeValue": this.isCheckedFinancialAssets,
            "secondSubTypeKey": "savings_certificate_bonds_and_other_government_securities",
            "secondSubTypeValue": this.isCheckedSavingsCertificate,
            "alDetailsDtos": financialSavingsArrayData
          },
          //Assets fix_deposits_term_deposits_and_dps
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "financial_assets",
            "firstSubTypeValue": this.isCheckedFinancialAssets,
            "secondSubTypeKey": "fix_deposits_term_deposits_and_dps",
            "secondSubTypeValue": this.isCheckedFixDepositTermDeposit,
            "alDetailsDtos": financialDepositsArrayData
          },
          //Assets loans_given_to_others
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "financial_assets",
            "firstSubTypeValue": this.isCheckedFinancialAssets,
            "secondSubTypeKey": "loans_given_to_others",
            "secondSubTypeValue": this.isCheckedLoanGiven,
            "alDetailsDtos": financialLoansArrayData
          },
          //Assets other_financial_assets
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "financial_assets",
            "firstSubTypeValue": this.isCheckedFinancialAssets,
            "secondSubTypeKey": "other_financial_assets",
            "secondSubTypeValue": this.isCheckedOtherFinancial,
            "alDetailsDtos": financialOtherArrayData
          },
          //Assets motor_car
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "motor_car",
            "firstSubTypeValue": this.isCheckedMotorCar,
            "secondSubTypeKey": '',
            "secondSubTypeValue": '',
            "alDetailsDtos": motorCarArrayData
          },
          //Assets Gold_Diamond_Gems_and_Other_Items
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "gold_diamond_gems_and_other_items",
            "firstSubTypeValue": this.isCheckedGoldDiamond,
            "secondSubTypeKey": '',
            "secondSubTypeValue": '',
            "alDetailsDtos": jewelleryArrayData
          },
          //Assets furniture_equipments_and_electronic_items
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "furniture_equipments_and_electronic_items",
            "firstSubTypeValue": this.isCheckedFurnitureEquipment,
            "secondSubTypeKey": '',
            "secondSubTypeValue": '',
            "alDetailsDtos": furnitureArrayData
          },
          //Assets other_assets_of_significant_value
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "other_assets_of_significant_value",
            "firstSubTypeValue": this.isCheckedOtherAssets,
            "secondSubTypeKey": '',
            "secondSubTypeValue": '',
            "alDetailsDtos": otherAssetsArrayData
          },
          //Assets notes_currency
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "cash_and_fund_outside_business",
            "firstSubTypeValue": this.isCheckedCashFundOutsideBusiness,
            "secondSubTypeKey": "notes_and_currencies",
            "secondSubTypeValue": this.isCheckedNotesCurrencies,
            "alDetailsDtos": notesCurrenciesArrayData
          },
          //Assets Electronic Cash
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "cash_and_fund_outside_business",
            "firstSubTypeValue": this.isCheckedCashFundOutsideBusiness,
            "secondSubTypeKey": "banks_cards_and_other_electronic_cash",
            "secondSubTypeValue": this.isCheckedBankCard,
            "alDetailsDtos": electronicCashArrayData
          },
          //Assets Provident Fund
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "cash_and_fund_outside_business",
            "firstSubTypeValue": this.isCheckedCashFundOutsideBusiness,
            "secondSubTypeKey": "provident_fund_and_other_fund",
            "secondSubTypeValue": this.isCheckedProvidentFund,
            "alDetailsDtos": fundArrayData
          },
          //Assets Other Deposits, Balance and Advance
          {
            "typeKey": "assets",
            "typeValue": this.isAssetsCollapsed,
            "firstSubTypeKey": "cash_and_fund_outside_business",
            "firstSubTypeValue": this.isCheckedCashFundOutsideBusiness,
            "secondSubTypeKey": "other_deposits_balance_and_advance",
            "secondSubTypeValue": this.isCheckedOtherDepositBalance,
            "alDetailsDtos": outsideDepositsArrayData
          },
          //liabilities Borrowing from Bank or other FI
          {
            "typeKey": "liabilities",
            "typeValue": this.isLiabilitiesCollapsed,
            "firstSubTypeKey": "borrowing_from_bank_or_other_fi",
            "firstSubTypeValue": this.isCheckedBorrowingFromBank,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": liabilitiesBorrowArrayData
          },
          //liabilities Unsecured Loan
          {
            "typeKey": "liabilities",
            "typeValue": this.isLiabilitiesCollapsed,
            "firstSubTypeKey": "unsecured_loan",
            "firstSubTypeValue": this.isCheckedUnsecuredLoan,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": liabilitiesUnsecuredLoanArrayData
          },

          //liabilities Other Loan or Overdraft
          {
            "typeKey": "liabilities",
            "typeValue": this.isLiabilitiesCollapsed,
            "firstSubTypeKey": "other_loan_or_overdraft",
            "firstSubTypeValue": this.isCheckedOtherLoanOrOverdraft,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": liabilitiesOtherArrayData
          },
          //Other Outflow Annual Living Expense
          {
            "typeKey": "0ther_outflow",
            "typeValue": this.isOutflowCollapsed,
            "firstSubTypeKey": "annual_living_expense",
            "firstSubTypeValue": this.isCheckedAnnualLivingExpense,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": annualLivingExpenseArrayData
          },
          //Other Loss, Deduction, Other Expense
          {
            "typeKey": "0ther_outflow",
            "typeValue": this.isOutflowCollapsed,
            "firstSubTypeKey": "loss_deduction_other_expense",
            "firstSubTypeValue": this.isCheckedLossDeductionOtherExpense,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": outflowLossArrayData
          },
          //Other Gift, Donation and Contribution
          {
            "typeKey": "0ther_outflow",
            "typeValue": this.isOutflowCollapsed,
            "firstSubTypeKey": "gift_donation_and_contribution",
            "firstSubTypeValue": this.isCheckedGiftDonationContribution,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": outflowGiftArrayData
          },
          //Sources of Fund---> Income Shown in the Return
          {
            "typeKey": "sources_of_fund",
            "typeValue": this.isSourceFundCollapsed,
            "firstSubTypeKey": "income_shown_in_the_return",
            "firstSubTypeValue": this.isCheckedIncomeShownInTheTown,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": incomeShownArrayData
          },
          //Sources of Fund--> Tax Exempted Income and Allowances
          {
            "typeKey": "sources_of_fund",
            "typeValue": this.isSourceFundCollapsed,
            "firstSubTypeKey": "tax_exempted_income_and_allowances",
            "firstSubTypeValue": this.isCheckedTaxExemptedIncome,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": exemptedIncomeShownArrayData
          },
          //Sources of Fund--> Other Receipts
          {
            "typeKey": "sources_of_fund",
            "typeValue": this.isSourceFundCollapsed,
            "firstSubTypeKey": "other_receipts",
            "firstSubTypeValue": this.isCheckedOtherReceipts,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": sourceFundReceiptsArrayData
          },
          //Previous Net Wealth--> Previous Income Year Net Wealth
          {
            "typeKey": "previous_net_wealth",
            // "typeValue": this.isPreviousYearNetWealthCollapsed,
            "typeValue": true,
            "firstSubTypeKey": "previous_income_year_net_wealth",
            // "firstSubTypeValue": this.isCheckedPreviousYearNetWealth,
            "firstSubTypeValue": true,
            "secondSubTypeKey": "",
            "secondSubTypeValue": "",
            "alDetailsDtos": previousNetWealthArrayData
          },
        ]
      }

      //#endregion

      this.apiService.post(this.serviceUrl + 'api/user-panel/create_al', this.postRequestBody)
        .subscribe(result => {
          if (result != null && this.isSaveDraft == false) {

            this.toastr.success('Data Saved Successfully.', '', {
              timeOut: 1000,
            });

            this.selectedNavbar.forEach((Value, i) => {
              if (Value['link'] == '/user-panel/assets-and-liabilities') {
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
    //        console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
  }


  continueWithNegativeDifferenceSaveDraft(differenceNegative: TemplateRef<any>) {
    this.isSaveDraft = true;
    if(Number(this.commaSeparator.extractComma(this.difference)) < 0) {
      this.modalRef = this.modalService.show(differenceNegative, this.config);
    }
    else this.submittedData();
  }

  continueWithNegativeDifference(differenceNegative: TemplateRef<any>) {
    this.isSaveDraft = false;
    if(Number(this.commaSeparator.extractComma(this.difference)) < 0) {
      this.modalRef = this.modalService.show(differenceNegative, this.config);
    }
    else this.submittedData();
  }

  stopSaving() {
    this.modalRef.hide();
  }

  doSaving() {
    this.modalRef.hide();
    this.submittedData();
  }

  

  onBackPage() {
    this.selectedNavbar.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/assets-and-liabilities') {
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

  // saveDraft() {
  //   this.isSaveDraft = true;
  //   this.submittedData();
  // }

  calPreviousIncomeYearNetWealth() {
   // debugger;
    this.group.get("PreviousIncomeYearNetWealth").setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.group.get("PreviousIncomeYearNetWealth").value)));
    this.previousIncomeYearNetWealth = this.group.get("PreviousIncomeYearNetWealth").value != '' ? this.commaSeparator.extractComma(this.group.get("PreviousIncomeYearNetWealth").value) : 0;
    this.previousIncomeYearNetWealth = this.commaSeparator.currencySeparatorBD(this.previousIncomeYearNetWealth);
    this.calChangeInNetWealth();
  }

  validateElectronCashBalance(i)
  {
    // debugger;
    let totalnotesCurrenciesArray = 0;  let totalElectronicCashBalance = 0;
    this.notesCurrenciesArray.forEach(element => {
        totalnotesCurrenciesArray +=  parseInt(this.commaSeparator.extractComma(element.notesCurrenciesAmount));
    });

    this.electronicCashArray.forEach(element => {
      totalElectronicCashBalance +=  parseInt(this.commaSeparator.extractComma(element.electronicCashBalance));
    });

    if(totalElectronicCashBalance>totalnotesCurrenciesArray)
    {
      this.toastr.warning('Total Account Balance will less or equal to ' +this.commaSeparator.currencySeparatorBD(totalnotesCurrenciesArray));
      this.electronicCashArray[i].electronicCashBalance = '';
      // this.totalGrossWealth();
    }


    this.calGrossWealth();
  }

  calGrossWealth() {
    //debugger;
    let temp_totalGrossWealth : any;let businessDirectorNetWealth = 0;let tmp_businessDirectorValue:any;
    this.businessDirectorArray.forEach(element => {
      tmp_businessDirectorValue = element.businessDirectorValue ? parseInt(this.commaSeparator.extractComma(element.businessDirectorValue)) : 0;
      businessDirectorNetWealth = businessDirectorNetWealth + tmp_businessDirectorValue;
    });
    this.bc_directors_shareholdings_tg = businessDirectorNetWealth ? businessDirectorNetWealth :0;

    let otherThanBusinessDirectorNetWealth = 0;let tmp_businessOtherCapital:any;
    this.businessOtherArray.forEach(element => {
      tmp_businessOtherCapital = element.businessOtherCapital? parseInt(this.commaSeparator.extractComma(element.businessOtherCapital)) : 0;
      otherThanBusinessDirectorNetWealth = otherThanBusinessDirectorNetWealth + tmp_businessOtherCapital;
    });
    this.bc_other_than_directors_shareholdings_tg = otherThanBusinessDirectorNetWealth ? otherThanBusinessDirectorNetWealth :0;

    let nonAgriNetWealth = 0; let tmp_nonAgriPropertyValueEnd:any;
    this.nonAgriPropertyArray.forEach(element => {
      tmp_nonAgriPropertyValueEnd = element.nonAgriPropertyValueEnd ? parseInt(this.commaSeparator.extractComma(element.nonAgriPropertyValueEnd)) : 0;
      nonAgriNetWealth = nonAgriNetWealth + tmp_nonAgriPropertyValueEnd;
    });
    this.non_agri_property_tg = nonAgriNetWealth ? nonAgriNetWealth:0;

    let advanceNonAgriNetWealth = 0; let tmp_advanceNonAgriPropertyValueEnd:any;
    this.advanceNonAgriPropertyArray.forEach(element => {
      tmp_advanceNonAgriPropertyValueEnd = element.advanceNonAgriPropertyValueEnd ? parseInt(this.commaSeparator.extractComma(element.advanceNonAgriPropertyValueEnd)) : 0;
      advanceNonAgriNetWealth = advanceNonAgriNetWealth + tmp_advanceNonAgriPropertyValueEnd;
    });
    this.advance_made_non_agri_property_tg = advanceNonAgriNetWealth ? advanceNonAgriNetWealth:0;

    let agriPropertyNetWealth = 0; let tmp_agriPropertyValueEnd:any;
    this.agriPropertyArray.forEach(element => {
      tmp_agriPropertyValueEnd = element.agriPropertyValueEnd ? parseInt(this.commaSeparator.extractComma(element.agriPropertyValueEnd)) : 0;
      agriPropertyNetWealth = agriPropertyNetWealth + tmp_agriPropertyValueEnd;
    });
    this.agri_property_tg = agriPropertyNetWealth ? agriPropertyNetWealth :0;

    let financialShareNetWealth = 0; let tmp_financialShareValue:any;
    this.financialShareArray.forEach(element => {
      tmp_financialShareValue = element.financialShareValue ? parseInt(this.commaSeparator.extractComma(element.financialShareValue)) : 0;
      financialShareNetWealth = financialShareNetWealth + tmp_financialShareValue;
    });
    this.fa_share_debenture_etc_tg = financialShareNetWealth ? financialShareNetWealth:0;

    let financialSavingsNetWealth = 0; let tmp_financialSavingsValue:any;
    this.financialSavingsArray.forEach(element => {
      tmp_financialSavingsValue = element.financialSavingsValue ? parseInt(this.commaSeparator.extractComma(element.financialSavingsValue)) : 0;
      financialSavingsNetWealth = financialSavingsNetWealth + tmp_financialSavingsValue;
    });
    this.fa_savings_certificate_tg = financialSavingsNetWealth ? financialSavingsNetWealth :0;

    let financialDepositNetWealth = 0; let tmp_financialDepositsBalance:any;
    this.financialDepositsArray.forEach(element => {
      tmp_financialDepositsBalance = element.financialDepositsBalance ? parseInt(this.commaSeparator.extractComma(element.financialDepositsBalance)) : 0;
      financialDepositNetWealth = financialDepositNetWealth + tmp_financialDepositsBalance;
    });
    this.fa_fix_deposit_tg = financialDepositNetWealth ? financialDepositNetWealth :0;

    let financialLoansNetWealth = 0; let tmp_financialLoansAmount:any;
    this.financialLoansArray.forEach(element => {
      tmp_financialLoansAmount = element.financialLoansAmount ? parseInt(this.commaSeparator.extractComma(element.financialLoansAmount)) : 0;
      financialLoansNetWealth = financialLoansNetWealth + tmp_financialLoansAmount;
    });
    this.fa_loans_given_tg = financialLoansNetWealth ? financialLoansNetWealth:0;

    let financialOtherAssetsNetWealth = 0; let tmp_financialOtherAmount:any;
    this.financialOtherArray.forEach(element => {
      tmp_financialOtherAmount= element.financialOtherAmount ? parseInt(this.commaSeparator.extractComma(element.financialOtherAmount)) : 0;
      financialOtherAssetsNetWealth = financialOtherAssetsNetWealth + tmp_financialOtherAmount;
    });
    this.fa_other_financial_assets_tg = financialOtherAssetsNetWealth ? financialOtherAssetsNetWealth:0;

    let motorCarNetWealth = 0; let tmp_motorCarAmount:any;
    this.motorCarArray.forEach(element => {
      tmp_motorCarAmount= element.motorCarAmount ? parseInt(this.commaSeparator.extractComma(element.motorCarAmount)) : 0;
      motorCarNetWealth = motorCarNetWealth + tmp_motorCarAmount;
    });
    this.motor_car_tg = motorCarNetWealth ? motorCarNetWealth:0;

    let goldDiamondNetWealth = 0; let  tmp_jewelleryValue:any;
    this.jewelleryArray.forEach(element => {
      tmp_motorCarAmount = element.jewelleryValue ? parseInt(this.commaSeparator.extractComma(element.jewelleryValue)) : 0;
      goldDiamondNetWealth = goldDiamondNetWealth + tmp_motorCarAmount;
    });
    this.gold_Diamond_tg = goldDiamondNetWealth ? goldDiamondNetWealth:0;

    let furnitureNetWealth = 0; let tmp_FurnitureValue:any;
    this.furnitureArray.forEach(element => {
      tmp_FurnitureValue = element.FurnitureValue ? parseInt(this.commaSeparator.extractComma(element.FurnitureValue)) : 0;
      furnitureNetWealth = furnitureNetWealth + tmp_FurnitureValue;
    });
    this.furniture_equipments_tg = furnitureNetWealth ? furnitureNetWealth :0;

    let otherAssetsNetWealth = 0; let tmp_otherAssetsValue:any;
    this.otherAssetsArray.forEach(element => {
      tmp_otherAssetsValue = element.otherAssetsValue ? parseInt(this.commaSeparator.extractComma(element.otherAssetsValue)) : 0;
      otherAssetsNetWealth = otherAssetsNetWealth + tmp_otherAssetsValue;
    });
    this.other_assets_tg = otherAssetsNetWealth ? otherAssetsNetWealth:0;

    let notesCurrenciesNetWealth = 0; let tmp_notesCurrenciesAmount:any;
    this.notesCurrenciesArray.forEach(element => {
      tmp_notesCurrenciesAmount = element.notesCurrenciesAmount ? parseInt(this.commaSeparator.extractComma(element.notesCurrenciesAmount)) : 0;
      notesCurrenciesNetWealth = notesCurrenciesNetWealth + tmp_notesCurrenciesAmount;
    });
    this.cfob_notes_currencies_tg = notesCurrenciesNetWealth ? notesCurrenciesNetWealth:0;

    // let elestronicCashNetWealth = 0; let tmp_electronicCashBalance:any;
    // this.electronicCashArray.forEach(element => {
    //   tmp_electronicCashBalance = element.electronicCashBalance ? parseInt(this.commaSeparator.extractComma(element.electronicCashBalance)) : 0;
    //   elestronicCashNetWealth = elestronicCashNetWealth + tmp_electronicCashBalance;
    // });
    // this.cfob_electronic_cash_tg = elestronicCashNetWealth ? elestronicCashNetWealth :0;

    let providentFundNetWealth = 0; let tmp_fundBalance:any;
    this.fundArray.forEach(element => {
      tmp_fundBalance = element.fundBalance ? parseInt(this.commaSeparator.extractComma(element.fundBalance)) : 0;
      providentFundNetWealth = providentFundNetWealth + tmp_fundBalance;
    });
    this.cfob_provident_fund_tg = providentFundNetWealth ? providentFundNetWealth :0;


    let otherDepositNetWealth = 0; let tmp_outsideDepositsBalance:any;
    this.outsideDepositsArray.forEach(element => {
      tmp_outsideDepositsBalance = element.outsideDepositsBalance ? parseInt(this.commaSeparator.extractComma(element.outsideDepositsBalance)) : 0;
      otherDepositNetWealth = otherDepositNetWealth + tmp_outsideDepositsBalance;
    });
    this.cfob_other_deposits_tg = otherDepositNetWealth ? otherDepositNetWealth:0;

    //debugger;
    temp_totalGrossWealth =  Math.round(this.bc_directors_shareholdings_tg) + Math.round(this.bc_other_than_directors_shareholdings_tg)
    + Math.round(this.non_agri_property_tg) + Math.round(this.advance_made_non_agri_property_tg) + Math.round(this.agri_property_tg)
    + Math.round(this.fa_share_debenture_etc_tg) + Math.round(this.fa_savings_certificate_tg) + Math.round(this.fa_fix_deposit_tg)
    + Math.round(this.fa_loans_given_tg) + Math.round(this.fa_other_financial_assets_tg) + Math.round(this.motor_car_tg)
    + Math.round(this.gold_Diamond_tg) + Math.round(this.furniture_equipments_tg) + Math.round(this.other_assets_tg) + Math.round(this.cfob_notes_currencies_tg)
    + Math.round(this.cfob_provident_fund_tg) + Math.round(this.cfob_other_deposits_tg);

    this.totalGrossWealth = this.commaSeparator.currencySeparatorBD(temp_totalGrossWealth);
    this.calNetWealth();
  }

  calTotalLiabilities() {
    let borrowingFromBankTotalLiabilities = 0; let tmp_totalLiabilities:any; let tmp_liabilitiesBorrowBalance:any;
    this.liabilitiesBorrowArray.forEach(element => {
      tmp_liabilitiesBorrowBalance = element.liabilitiesBorrowBalance ? parseInt(this.commaSeparator.extractComma(element.liabilitiesBorrowBalance)) : 0;
      borrowingFromBankTotalLiabilities = borrowingFromBankTotalLiabilities + tmp_liabilitiesBorrowBalance;
    });
    this.borrowing_from_bank_tl = borrowingFromBankTotalLiabilities ? borrowingFromBankTotalLiabilities :0;

    let unsecuredLoanTotalLiabilities = 0; let tmp_liabilitiesUnsecuredLoanBalance:any;
    this.liabilitiesUnsecuredLoanArray.forEach(element => {
      tmp_liabilitiesUnsecuredLoanBalance = element.liabilitiesUnsecuredLoanBalance ? parseInt(this.commaSeparator.extractComma(element.liabilitiesUnsecuredLoanBalance)) : 0;
      unsecuredLoanTotalLiabilities = unsecuredLoanTotalLiabilities + tmp_liabilitiesUnsecuredLoanBalance;
    });
    this.unsecured_loan_tl = unsecuredLoanTotalLiabilities ? unsecuredLoanTotalLiabilities:0;

    let otherLoanTotalLiabilities = 0; let tmp_liabilitiesOtherBalance:any;
    this.liabilitiesOtherArray.forEach(element => {
      tmp_liabilitiesOtherBalance = element.liabilitiesOtherBalance ? parseInt(this.commaSeparator.extractComma(element.liabilitiesOtherBalance)) : 0;
      otherLoanTotalLiabilities = otherLoanTotalLiabilities + tmp_liabilitiesOtherBalance;
    });
    this.other_loan_tl = otherLoanTotalLiabilities ? otherLoanTotalLiabilities :0;

    tmp_totalLiabilities= Math.round(this.borrowing_from_bank_tl) + Math.round(this.unsecured_loan_tl) + Math.round(this.other_loan_tl);
    this.totalLiabilities  = this.commaSeparator.currencySeparatorBD(tmp_totalLiabilities);

    this.calNetWealth();
  }

  calNetWealth() {
    //debugger;
    let tmp_totalNetWealth :any; let tmp_totalGrossWealth:any; let tmp_totalLiabilities:any;
    tmp_totalGrossWealth = this.totalGrossWealth ? this.commaSeparator.extractComma(this.totalGrossWealth) : 0;
    tmp_totalLiabilities = this.totalLiabilities ? this.commaSeparator.extractComma(this.totalLiabilities) : 0;
    tmp_totalNetWealth =  parseInt(tmp_totalGrossWealth) - parseInt(tmp_totalLiabilities);
    this.totalNetWealth = this.commaSeparator.currencySeparatorBD(tmp_totalNetWealth);
    this.calChangeInNetWealth();
  }

  calChangeInNetWealth() {
    let temp_Change_in_net_wealth:any; let tmp_totalNetWealth:any; let tmp_previousIncomeYearNetWealth:any;
    tmp_totalNetWealth = this.totalNetWealth ? parseInt(this.commaSeparator.extractComma(this.totalNetWealth)) : 0;
    tmp_previousIncomeYearNetWealth = this.previousIncomeYearNetWealth ? parseInt(this.commaSeparator.extractComma(this.previousIncomeYearNetWealth)): 0;
    temp_Change_in_net_wealth = (tmp_totalNetWealth - tmp_previousIncomeYearNetWealth);
    this.Change_in_net_wealth = this.commaSeparator.currencySeparatorBD(temp_Change_in_net_wealth);
    this.calTotalFundOutFlow();
  }

  calOtherFundOutflow() {
    //debugger;
    this.group.get("outflowLivingExpense").setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.group.get("outflowLivingExpense").value)));

    this.annual_living_expense_other_outflow = this.group.get("outflowLivingExpense").value ? this.group.get("outflowLivingExpense").value : 0;
    this.annual_living_expense_other_outflow = parseInt(this.commaSeparator.extractComma(this.annual_living_expense_other_outflow));

    let lossDeductionOtherOutflow = 0; let tmp_outflowLossAmount:any; let tmp_totalOtherFundoutFlow:any;
    this.outflowLossArray.forEach(element => {
      tmp_outflowLossAmount = element.outflowLossAmount ? parseInt(this.commaSeparator.extractComma(element.outflowLossAmount)) : 0;
      lossDeductionOtherOutflow = lossDeductionOtherOutflow + tmp_outflowLossAmount;
    });
    this.loss_deduction_other_expense_other_outflow = lossDeductionOtherOutflow ? lossDeductionOtherOutflow:0;

    let giftDonationOtherOutflow = 0; let tmp_outflowGiftAmount:any;
    this.outflowGiftArray.forEach(element => {
      tmp_outflowGiftAmount = element.outflowGiftAmount ? parseInt(this.commaSeparator.extractComma(element.outflowGiftAmount)) : 0;
      giftDonationOtherOutflow = giftDonationOtherOutflow + tmp_outflowGiftAmount;
    });
    this.gift_donation_and_contribution_other_outflow = giftDonationOtherOutflow ? giftDonationOtherOutflow :0;

    tmp_totalOtherFundoutFlow = this.annual_living_expense_other_outflow + Math.round(this.loss_deduction_other_expense_other_outflow)
    + Math.round(this.gift_donation_and_contribution_other_outflow);

    this.other_fund_outflow = this.commaSeparator.currencySeparatorBD(tmp_totalOtherFundoutFlow);

    this.calTotalFundOutFlow();
  }

  calTotalFundOutFlow() {
    //debugger;
    let tmp_Change_in_net_wealth:any; let tmp_other_fund_outflow:any;
    tmp_Change_in_net_wealth = this.Change_in_net_wealth ? parseInt(this.commaSeparator.extractComma(this.Change_in_net_wealth)):0;
    tmp_other_fund_outflow = this.other_fund_outflow ? parseInt(this.commaSeparator.extractComma(this.other_fund_outflow)) : 0;
    this.total_fund_outflow = this.commaSeparator.currencySeparatorBD(tmp_Change_in_net_wealth + tmp_other_fund_outflow);

    this.calDifference();
  }

  calSourcesofFund() {
    this.group.get("sourceFundIncome").setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.group.get("sourceFundIncome").value)));

    this.income_shown_in_return_sources_of_fund = this.group.get("sourceFundIncome").value ? this.commaSeparator.extractComma(this.group.get("sourceFundIncome").value) : 0;
    this.income_shown_in_return_sources_of_fund = Math.round(this.income_shown_in_return_sources_of_fund);


    this.group.get("taxExemptedIncomeAndAllowances").setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.group.get("taxExemptedIncomeAndAllowances").value)));

    this.tax_exempted_income_and_allowances_sources_of_fund = this.group.get("taxExemptedIncomeAndAllowances").value ? this.commaSeparator.extractComma(this.group.get("taxExemptedIncomeAndAllowances").value) : 0;
    this.tax_exempted_income_and_allowances_sources_of_fund = Math.round(this.tax_exempted_income_and_allowances_sources_of_fund);

    let tmp_totalSrcOfFund:any;
    let tmp_sourceFundTaxAmount:any;

    let otherReceiptsSourcesofFund = 0; let tmp_sourceFundReceiptsAmount:any;
    this.sourceFundReceiptsArray.forEach(element => {
      tmp_sourceFundTaxAmount = element.sourceFundReceiptsAmount ? parseInt(this.commaSeparator.extractComma(element.sourceFundReceiptsAmount)) : 0;
      otherReceiptsSourcesofFund = otherReceiptsSourcesofFund + tmp_sourceFundTaxAmount;
    });
    this.other_receipts_sources_of_fund = otherReceiptsSourcesofFund ? otherReceiptsSourcesofFund :0;

    tmp_totalSrcOfFund= this.income_shown_in_return_sources_of_fund + this.tax_exempted_income_and_allowances_sources_of_fund
    + Math.round(this.other_receipts_sources_of_fund);
    this.sources_of_fund  = this.commaSeparator.currencySeparatorBD(tmp_totalSrcOfFund);

    this.calDifference();
  }

  calDifference() {
    let tmp_sources_of_fund:any; let tmp_total_fund_outflow:any; let tmp_difference:any;
    tmp_sources_of_fund = parseInt(this.commaSeparator.extractComma(this.sources_of_fund));
    tmp_total_fund_outflow = parseInt(this.commaSeparator.extractComma(this.total_fund_outflow));
    tmp_difference = (tmp_sources_of_fund - tmp_total_fund_outflow);
    this.difference = this.commaSeparator.currencySeparatorBD(tmp_difference);
  }


  //director_shareholdings_in_limited_companies validation start

  validate_director_shareholdings_in_limited_companies = [];
  initialize_director_shareholdings_in_limited_companies_validation() {
    this.validate_director_shareholdings_in_limited_companies = [];
    this.businessDirectorArray.forEach(element => {
      let data = {
        "businessDirectorCompany_showError": false,
        "businessDirectorAcquisition_showError": false,
        "businessDirectorShares_showError": false,
        "businessDirectorValue_showError": false
      }
      this.validate_director_shareholdings_in_limited_companies.push(data);
    });
  }

  initialize_director_shareholdings_in_limited_companies_validation_error(i) {
    this.validate_director_shareholdings_in_limited_companies[i].businessDirectorCompany_showError = false;
    this.validate_director_shareholdings_in_limited_companies[i].businessDirectorAcquisition_showError = false;
    this.validate_director_shareholdings_in_limited_companies[i].businessDirectorShares_showError = false;
    this.validate_director_shareholdings_in_limited_companies[i].businessDirectorValue_showError = false;
  }

  validation_checking_director_shareholdings_in_limited_companies(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.businessDirectorArray.forEach((element, index) => {
      this.initialize_director_shareholdings_in_limited_companies_validation_error(index);
      if (element.businessDirectorCompany == null || element.businessDirectorCompany == '') {
        this.validate_director_shareholdings_in_limited_companies[index].businessDirectorCompany_showError = true;
        validationSuccess = false;
      }
      if (element.businessDirectorAcquisition == null || element.businessDirectorAcquisition == '') {
        this.validate_director_shareholdings_in_limited_companies[index].businessDirectorAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.businessDirectorShares == null || element.businessDirectorShares == '' || element.businessDirectorShares <= 0) {
        this.validate_director_shareholdings_in_limited_companies[index].businessDirectorShares_showError = true;
        validationSuccess = false;
      }
      if (element.businessDirectorValue == null || element.businessDirectorValue == '') {
        this.validate_director_shareholdings_in_limited_companies[index].businessDirectorValue_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_director_shareholdings_in_limited_companies(i, formControlName) {
    if (formControlName === 'businessDirectorCompany')
      this.validate_director_shareholdings_in_limited_companies[i].businessDirectorCompany_showError = false;
    if (formControlName === 'businessDirectorAcquisition')
      this.validate_director_shareholdings_in_limited_companies[i].businessDirectorAcquisition_showError = false;
    if (formControlName === 'businessDirectorShares')
      this.validate_director_shareholdings_in_limited_companies[i].businessDirectorShares_showError = false;
    if (formControlName === 'businessDirectorValue')
    this.validate_director_shareholdings_in_limited_companies[i].businessDirectorValue_showError = false;
  }
  //director_shareholdings_in_limited_companies validation end


  //business_capital_other_than_director_shareholdings_in_limited_companies validation start

  validate_business_capital_other_than_director_shareholdings_in_limited_companies = [];
  initialize_business_capital_other_than_director_shareholdings_in_limited_companies_validation() {
    this.validate_business_capital_other_than_director_shareholdings_in_limited_companies = [];
    this.businessOtherArray.forEach(element => {
      let data = {
        "businessOtherProfession_showError": false,
        "businessOtherCapital_showError": false
      }
      this.validate_business_capital_other_than_director_shareholdings_in_limited_companies.push(data);
    });
  }

  initialize_business_capital_other_than_director_shareholdings_in_limited_companies_validation_error(i) {
    this.validate_business_capital_other_than_director_shareholdings_in_limited_companies[i].businessOtherProfession_showError = false;
    this.validate_business_capital_other_than_director_shareholdings_in_limited_companies[i].businessOtherCapital_showError = false;
  }

  validation_checking_business_capital_other_than_director_shareholdings_in_limited_companies(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.businessOtherArray.forEach((element, index) => {
      this.initialize_business_capital_other_than_director_shareholdings_in_limited_companies_validation_error(index);
      if (element.businessOtherProfession == null || element.businessOtherProfession == '') {
        this.validate_business_capital_other_than_director_shareholdings_in_limited_companies[index].businessOtherProfession_showError = true;
        validationSuccess = false;
      }
      if (element.businessOtherCapital == null || element.businessOtherCapital == '') {
        this.validate_business_capital_other_than_director_shareholdings_in_limited_companies[index].businessOtherCapital_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_business_capital_other_than_director_shareholdings_in_limited_companies(i, formControlName) {
    if (formControlName === 'businessOtherProfession')
      this.validate_business_capital_other_than_director_shareholdings_in_limited_companies[i].businessOtherProfession_showError = false;
    if (formControlName === 'businessOtherCapital')
      this.validate_business_capital_other_than_director_shareholdings_in_limited_companies[i].businessOtherCapital_showError = false;
  }
  //business_capital_other_than_director_shareholdings_in_limited_companies validation end


  //non_agricultural_property_parent validation start

  validate_non_agricultural_property_parent = [];
  initialize_non_agricultural_property_parent_validation() {
    this.validate_non_agricultural_property_parent = [];
    this.nonAgriPropertyArray.forEach(element => {
      let data = {
        "nonAgriPropertyLocation_showError": false,
        "nonAgriPropertyAcquisition_showError": false,
        "nonAgriPropertyArea_showError": false,
        "unitOfArea_showError": false,
        "nonAgriPropertyValueEnd_showError": false
      }
      this.validate_non_agricultural_property_parent.push(data);
    });
  }

  initialize_non_agricultural_property_parent_validation_error(i) {
    this.validate_non_agricultural_property_parent[i].nonAgriPropertyLocation_showError = false;
    this.validate_non_agricultural_property_parent[i].nonAgriPropertyAcquisition_showError = false;
    this.validate_non_agricultural_property_parent[i].nonAgriPropertyArea_showError = false;
    this.validate_non_agricultural_property_parent[i].unitOfArea_showError = false;
    this.validate_non_agricultural_property_parent[i].nonAgriPropertyValueEnd_showError = false;
  }

  validation_checking_non_agricultural_property_parent(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.nonAgriPropertyArray.forEach((element, index) => {
      this.initialize_non_agricultural_property_parent_validation_error(index);
      if (element.nonAgriPropertyLocation == null || element.nonAgriPropertyLocation == '') {
        this.validate_non_agricultural_property_parent[index].nonAgriPropertyLocation_showError = true;
        validationSuccess = false;
      }
      if (element.nonAgriPropertyAcquisition == null || element.nonAgriPropertyAcquisition == '') {
        this.validate_non_agricultural_property_parent[index].nonAgriPropertyAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.nonAgriPropertyArea == null || element.nonAgriPropertyArea == '' || element.nonAgriPropertyArea == 0) {
        this.validate_non_agricultural_property_parent[index].nonAgriPropertyArea_showError = true;
        validationSuccess = false;
      }
      if (element.unitOfArea == null || element.unitOfArea == '') {
        this.validate_non_agricultural_property_parent[index].unitOfArea_showError = true;
        validationSuccess = false;
      }
      if (element.nonAgriPropertyValueEnd == null || element.nonAgriPropertyValueEnd == '') {
        this.validate_non_agricultural_property_parent[index].nonAgriPropertyValueEnd_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_non_agricultural_property_parent(i, formControlName) {
    if (formControlName === 'nonAgriPropertyLocation')
      this.validate_non_agricultural_property_parent[i].nonAgriPropertyLocation_showError = false;
    if (formControlName === 'nonAgriPropertyAcquisition')
      this.validate_non_agricultural_property_parent[i].nonAgriPropertyAcquisition_showError = false;
    if (formControlName === 'nonAgriPropertyArea')
      this.validate_non_agricultural_property_parent[i].nonAgriPropertyArea_showError = false;
    if (formControlName === 'unitOfArea')
    this.validate_non_agricultural_property_parent[i].unitOfArea_showError = false;
    if (formControlName === 'nonAgriPropertyValueEnd')
    this.validate_non_agricultural_property_parent[i].nonAgriPropertyValueEnd_showError = false;
  }
  //non_agricultural_property_parent validation end


  //advance_made_for_non_agricultural_property validation start

  validate_advance_made_for_non_agricultural_property = [];
  initialize_advance_made_for_non_agricultural_property_validation() {
    this.validate_advance_made_for_non_agricultural_property = [];
    this.advanceNonAgriPropertyArray.forEach(element => {
      let data = {
        "advanceNonAgriPropertyLocation_showError": false,
        "advanceNonAgriPropertyAcquisition_showError": false,
        "advanceNonAgriPropertyValueEnd_showError": false
      }
      this.validate_advance_made_for_non_agricultural_property.push(data);
    });
  }

  initialize_advance_made_for_non_agricultural_property_validation_error(i) {
    this.validate_advance_made_for_non_agricultural_property[i].advanceNonAgriPropertyLocation_showError = false;
    this.validate_advance_made_for_non_agricultural_property[i].advanceNonAgriPropertyAcquisition_showError = false;
    this.validate_advance_made_for_non_agricultural_property[i].advanceNonAgriPropertyValueEnd_showError = false;
  }

  validation_checking_advance_made_for_non_agricultural_property(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.advanceNonAgriPropertyArray.forEach((element, index) => {
      this.initialize_advance_made_for_non_agricultural_property_validation_error(index);
      if (element.advanceNonAgriPropertyLocation == null || element.advanceNonAgriPropertyLocation == '') {
        this.validate_advance_made_for_non_agricultural_property[index].advanceNonAgriPropertyLocation_showError = true;
        validationSuccess = false;
      }
      if (element.advanceNonAgriPropertyAcquisition == null || element.advanceNonAgriPropertyAcquisition == '') {
        this.validate_advance_made_for_non_agricultural_property[index].advanceNonAgriPropertyAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.advanceNonAgriPropertyValueEnd == null || element.advanceNonAgriPropertyValueEnd == '') {
        this.validate_advance_made_for_non_agricultural_property[index].advanceNonAgriPropertyValueEnd_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_advance_made_for_non_agricultural_property(i, formControlName) {
    if (formControlName === 'advanceNonAgriPropertyLocation')
      this.validate_advance_made_for_non_agricultural_property[i].advanceNonAgriPropertyLocation_showError = false;
    if (formControlName === 'advanceNonAgriPropertyAcquisition')
      this.validate_advance_made_for_non_agricultural_property[i].advanceNonAgriPropertyAcquisition_showError = false;
    if (formControlName === 'advanceNonAgriPropertyValueEnd')
    this.validate_advance_made_for_non_agricultural_property[i].advanceNonAgriPropertyValueEnd_showError = false;
  }
  //advance_made_for_non_agricultural_property validation end


  //agricultural_property validation start

  validate_agricultural_property = [];
  initialize_agricultural_property_validation() {
    this.validate_agricultural_property = [];
    this.agriPropertyArray.forEach(element => {
      let data = {
        "agriPropertyLocation_showError": false,
        "agriPropertyAcquisition_showError": false,
        "agriPropertyArea_showError": false,
        "unitOfAgriArea_showError": false,
        "agriPropertyValueEnd_showError": false
      }
      this.validate_agricultural_property.push(data);
    });
  }

  initialize_agricultural_property_validation_error(i) {
    this.validate_agricultural_property[i].agriPropertyLocation_showError = false;
    this.validate_agricultural_property[i].agriPropertyAcquisition_showError = false;
    this.validate_agricultural_property[i].agriPropertyArea_showError = false;
    this.validate_agricultural_property[i].unitOfAgriArea_showError = false;
    this.validate_agricultural_property[i].agriPropertyValueEnd_showError = false;
  }

  validation_checking_agricultural_property(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.agriPropertyArray.forEach((element, index) => {
      this.initialize_agricultural_property_validation_error(index);
      if (element.agriPropertyLocation == null || element.agriPropertyLocation == '') {
        this.validate_agricultural_property[index].agriPropertyLocation_showError = true;
        validationSuccess = false;
      }
      if (element.agriPropertyAcquisition == null || element.agriPropertyAcquisition == '') {
        this.validate_agricultural_property[index].agriPropertyAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.agriPropertyArea == null || element.agriPropertyArea == '' || element.agriPropertyArea == 0) {
        this.validate_agricultural_property[index].agriPropertyArea_showError = true;
        validationSuccess = false;
      }
      if (element.unitOfAgriArea == null || element.unitOfAgriArea == '') {
        this.validate_agricultural_property[index].unitOfAgriArea_showError = true;
        validationSuccess = false;
      }
      if (element.agriPropertyValueEnd == null || element.agriPropertyValueEnd == '') {
        this.validate_agricultural_property[index].agriPropertyValueEnd_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_agricultural_property(i, formControlName) {
    if (formControlName === 'agriPropertyLocation')
      this.validate_agricultural_property[i].agriPropertyLocation_showError = false;
    if (formControlName === 'agriPropertyAcquisition')
      this.validate_agricultural_property[i].agriPropertyAcquisition_showError = false;
    if (formControlName === 'agriPropertyArea')
      this.validate_agricultural_property[i].agriPropertyArea_showError = false;
    if (formControlName === 'unitOfAgriArea')
    this.validate_agricultural_property[i].unitOfAgriArea_showError = false;
    if (formControlName === 'agriPropertyValueEnd')
    this.validate_agricultural_property[i].agriPropertyValueEnd_showError = false;
  }
  //agricultural_property validation end


  //share_debenture_etc validation start

  validate_share_debenture_etc = [];
  initialize_share_debenture_etc_validation() {
    this.validate_share_debenture_etc = [];
    this.financialShareArray.forEach(element => {
      let data = {
        "financialShareBO_showError": false,
        "financialShareAcquisition_showError": false,
        "financialShareBrokerage_showError": false,
        "financialShareValue_showError": false
      }
      this.validate_share_debenture_etc.push(data);
    });
  }

  initialize_share_debenture_etc_validation_error(i) {
    this.validate_share_debenture_etc[i].financialShareBO_showError = false;
    this.validate_share_debenture_etc[i].financialShareAcquisition_showError = false;
    this.validate_share_debenture_etc[i].financialShareBrokerage_showError = false;
    this.validate_share_debenture_etc[i].financialShareValue_showError = false;
  }

  validation_checking_share_debenture_etc(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.financialShareArray.forEach((element, index) => {
      this.initialize_share_debenture_etc_validation_error(index);
      if (element.financialShareBO == null || element.financialShareBO == '') {
        this.validate_share_debenture_etc[index].financialShareBO_showError = true;
        validationSuccess = false;
      }
      if (element.financialShareAcquisition == null || element.financialShareAcquisition == '') {
        this.validate_share_debenture_etc[index].financialShareAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.financialShareBrokerage == null || element.financialShareBrokerage == '') {
        this.validate_share_debenture_etc[index].financialShareBrokerage_showError = true;
        validationSuccess = false;
      }
      if (element.financialShareValue == null || element.financialShareValue == '') {
        this.validate_share_debenture_etc[index].financialShareValue_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_share_debenture_etc(i, formControlName) {
    if (formControlName === 'financialShareBO')
      this.validate_share_debenture_etc[i].financialShareBO_showError = false;
    if (formControlName === 'financialShareAcquisition')
      this.validate_share_debenture_etc[i].financialShareAcquisition_showError = false;
    if (formControlName === 'financialShareBrokerage')
      this.validate_share_debenture_etc[i].financialShareBrokerage_showError = false;
    if (formControlName === 'financialShareValue')
    this.validate_share_debenture_etc[i].financialShareValue_showError = false;
  }
  //share_debenture_etc validation end


  //savings_certificate_bonds_and_other_government_securities validation start

  validate_savings_certificate_bonds_and_other_government_securities = [];
  initialize_savings_certificate_bonds_and_other_government_securities_validation() {
    this.validate_savings_certificate_bonds_and_other_government_securities = [];
    this.financialSavingsArray.forEach(element => {
      let data = {
        "financialSavingsSecurity_showError": false,
        "financialSavingsIssueNo_showError": false,
        "financialSavingsIssueDate_showError": false,
        "financialSavingsValue_showError": false
      }
      this.validate_savings_certificate_bonds_and_other_government_securities.push(data);
    });
  }

  initialize_savings_certificate_bonds_and_other_government_securities_validation_error(i) {
    this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsSecurity_showError = false;
    this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsIssueNo_showError = false;
    this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsIssueDate_showError = false;
    this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsValue_showError = false;
  }

  validation_checking_savings_certificate_bonds_and_other_government_securities(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.financialSavingsArray.forEach((element, index) => {
      this.initialize_savings_certificate_bonds_and_other_government_securities_validation_error(index);
      if (element.financialSavingsSecurity == null || element.financialSavingsSecurity == '') {
        this.validate_savings_certificate_bonds_and_other_government_securities[index].financialSavingsSecurity_showError = true;
        validationSuccess = false;
      }
      if (element.financialSavingsIssueNo == null || element.financialSavingsIssueNo == '') {
        this.validate_savings_certificate_bonds_and_other_government_securities[index].financialSavingsIssueNo_showError = true;
        validationSuccess = false;
      }
      if (element.financialSavingsIssueDate == null || element.financialSavingsIssueDate == '') {
        this.validate_savings_certificate_bonds_and_other_government_securities[index].financialSavingsIssueDate_showError = true;
        validationSuccess = false;
      }
      if (element.financialSavingsValue == null || element.financialSavingsValue == '') {
        this.validate_savings_certificate_bonds_and_other_government_securities[index].financialSavingsValue_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_savings_certificate_bonds_and_other_government_securities(i, formControlName) {
    if (formControlName === 'financialSavingsSecurity')
      this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsSecurity_showError = false;
    if (formControlName === 'financialSavingsIssueNo')
      this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsIssueNo_showError = false;
    if (formControlName === 'financialSavingsIssueDate')
      this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsIssueDate_showError = false;
    if (formControlName === 'financialSavingsValue')
    this.validate_savings_certificate_bonds_and_other_government_securities[i].financialSavingsValue_showError = false;
  }

  //savings_certificate_bonds_and_other_government_securities validation end


  //fix_deposits_term_deposits_and_dps validation start

  validate_fix_deposits_term_deposits_and_dps = [];
  initialize_fix_deposits_term_deposits_and_dps_validation() {
    this.validate_fix_deposits_term_deposits_and_dps = [];
    this.financialDepositsArray.forEach(element => {
      let data = {
        "financialDepositsParticulars_showError": false,
        "financialDepositsAcquisition_showError": false,
        "financialDepositsBalance_showError": false
      }
      this.validate_fix_deposits_term_deposits_and_dps.push(data);
    });
  }

  initialize_fix_deposits_term_deposits_and_dps_validation_error(i) {
    this.validate_fix_deposits_term_deposits_and_dps[i].financialDepositsParticulars_showError = false;
    this.validate_fix_deposits_term_deposits_and_dps[i].financialDepositsAcquisition_showError = false;
    this.validate_fix_deposits_term_deposits_and_dps[i].financialDepositsBalance_showError = false;
  }

  validation_checking_fix_deposits_term_deposits_and_dps(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.financialDepositsArray.forEach((element, index) => {
      this.initialize_fix_deposits_term_deposits_and_dps_validation_error(index);
      if (element.financialDepositsParticulars == null || element.financialDepositsParticulars == '') {
        this.validate_fix_deposits_term_deposits_and_dps[index].financialDepositsParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.financialDepositsAcquisition == null || element.financialDepositsAcquisition == '') {
        this.validate_fix_deposits_term_deposits_and_dps[index].financialDepositsAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.financialDepositsBalance == null || element.financialDepositsBalance == '') {
        this.validate_fix_deposits_term_deposits_and_dps[index].financialDepositsBalance_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_fix_deposits_term_deposits_and_dps(i, formControlName) {
    if (formControlName === 'financialDepositsParticulars')
      this.validate_fix_deposits_term_deposits_and_dps[i].financialDepositsParticulars_showError = false;
    if (formControlName === 'financialDepositsAcquisition')
      this.validate_fix_deposits_term_deposits_and_dps[i].financialDepositsAcquisition_showError = false;
    if (formControlName === 'financialDepositsBalance')
    this.validate_fix_deposits_term_deposits_and_dps[i].financialDepositsBalance_showError = false;
  }
  
  //fix_deposits_term_deposits_and_dps validation end


  //loans_given_to_others validation start

  validate_loans_given_to_others = [];
  initialize_loans_given_to_others_validation() {
    this.validate_loans_given_to_others = [];
    this.financialLoansArray.forEach(element => {
      let data = {
        "financialLoansParticulars_showError": false,
        "financialLoansAmount_showError": false
      }
      this.validate_loans_given_to_others.push(data);
    });
  }

  initialize_loans_given_to_others_validation_error(i) {
    this.validate_loans_given_to_others[i].financialLoansParticulars_showError = false;
    this.validate_loans_given_to_others[i].financialLoansAmount_showError = false;
  }

  validation_checking_loans_given_to_others(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.financialLoansArray.forEach((element, index) => {
      this.initialize_loans_given_to_others_validation_error(index);
      if (element.financialLoansParticulars == null || element.financialLoansParticulars == '') {
        this.validate_loans_given_to_others[index].financialLoansParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.financialLoansAmount == null || element.financialLoansAmount == '') {
        this.validate_loans_given_to_others[index].financialLoansAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_loans_given_to_others(i, formControlName) {
    if (formControlName === 'financialLoansParticulars')
      this.validate_loans_given_to_others[i].financialLoansParticulars_showError = false;
    if (formControlName === 'financialLoansAmount')
    this.validate_loans_given_to_others[i].financialLoansAmount_showError = false;
  }
  
  //loans_given_to_others validation end


  //other_financial_assets validation start

  validate_other_financial_assets = [];
  initialize_other_financial_assets_validation() {
    this.validate_other_financial_assets = [];
    this.financialOtherArray.forEach(element => {
      let data = {
        "financialOtherParticulars_showError": false,
        "financialOtherAcquisition_showError": false,
        "financialOtherAmount_showError": false
      }
      this.validate_other_financial_assets.push(data);
    });
  }

  initialize_other_financial_assets_validation_error(i) {
    this.validate_other_financial_assets[i].financialOtherParticulars_showError = false;
    this.validate_other_financial_assets[i].financialOtherAcquisition_showError = false;
    this.validate_other_financial_assets[i].financialOtherAmount_showError = false;
  }

  validation_checking_other_financial_assets(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.financialOtherArray.forEach((element, index) => {
      this.initialize_other_financial_assets_validation_error(index);
      if (element.financialOtherParticulars == null || element.financialOtherParticulars == '') {
        this.validate_other_financial_assets[index].financialOtherParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.financialOtherAcquisition == null || element.financialOtherAcquisition == '') {
        this.validate_other_financial_assets[index].financialOtherAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.financialOtherAmount == null || element.financialOtherAmount == '') {
        this.validate_other_financial_assets[index].financialOtherAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_other_financial_assets(i, formControlName) {
    if (formControlName === 'financialOtherParticulars')
      this.validate_other_financial_assets[i].financialOtherParticulars_showError = false;
    if (formControlName === 'financialOtherAcquisition')
      this.validate_other_financial_assets[i].financialOtherAcquisition_showError = false;
    if (formControlName === 'financialOtherAmount')
    this.validate_other_financial_assets[i].financialOtherAmount_showError = false;
  }
  
  //other_financial_assets validation end

  //motor_car validation start

  validate_motor_car = [];
  initialize_motor_car_validation() {
    this.validate_motor_car = [];
    this.motorCarArray.forEach(element => {
      let data = {
        "motorCarRegistration_showError": false,
        "motorCarParticulars_showError": false,
        "motorCarAcquisition_showError": false,
        "motorCarEngine_showError": false,
        "engineType_showError": false,
        "motorCarAmount_showError": false
      }
      this.validate_motor_car.push(data);
    });
  }

  initialize_motor_car_validation_error(i) {
    this.validate_motor_car[i].motorCarRegistration_showError = false;
    this.validate_motor_car[i].motorCarParticulars_showError = false;
    this.validate_motor_car[i].motorCarAcquisition_showError = false;
    this.validate_motor_car[i].motorCarEngine_showError = false;
    this.validate_motor_car[i].engineType_showError = false;
    this.validate_motor_car[i].motorCarAmount_showError = false;
  }

  validation_checking_motor_car(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.motorCarArray.forEach((element, index) => {
      this.initialize_motor_car_validation_error(index);
      if (element.motorCarRegistration == null || element.motorCarRegistration == '') {
        this.validate_motor_car[index].motorCarRegistration_showError = true;
        validationSuccess = false;
      }
      if (element.motorCarParticulars == null || element.motorCarParticulars == '') {
        this.validate_motor_car[index].motorCarParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.motorCarAcquisition == null || element.motorCarAcquisition == '') {
        this.validate_motor_car[index].motorCarAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.motorCarEngine == null || element.motorCarEngine == '') {
        this.validate_motor_car[index].motorCarEngine_showError = true;
        validationSuccess = false;
      }
      if (element.engineType == null || element.engineType == '') {
        this.validate_motor_car[index].engineType_showError = true;
        validationSuccess = false;
      }
      if (element.motorCarAmount == null || element.motorCarAmount == '') {
        this.validate_motor_car[index].motorCarAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_motor_car(i, formControlName) {
    if (formControlName === 'motorCarRegistration')
      this.validate_motor_car[i].motorCarRegistration_showError = false;
    if (formControlName === 'motorCarParticulars')
      this.validate_motor_car[i].motorCarParticulars_showError = false;
    if (formControlName === 'motorCarAcquisition')
      this.validate_motor_car[i].motorCarAcquisition_showError = false;
    if (formControlName === 'motorCarEngine')
      this.validate_motor_car[i].motorCarEngine_showError = false;
    if (formControlName === 'engineType')
      this.validate_motor_car[i].engineType_showError = false;
    if (formControlName === 'motorCarAmount')
      this.validate_motor_car[i].motorCarAmount_showError = false;
  }
  
  //motor_car validation end


  //gold_diamond_gems_and_other_items validation start

  validate_gold_diamond_gems_and_other_items = [];
  initialize_gold_diamond_gems_and_other_items_validation() {
    this.validate_gold_diamond_gems_and_other_items = [];
    this.jewelleryArray.forEach(element => {
      let data = {
        "jewelleryParticulars_showError": false,
        "jewelleryAcquisition_showError": false,
        "jewelleryQuantityEnd_showError": false,
        "unitOfJewellery_showError": false,
      }
      this.validate_gold_diamond_gems_and_other_items.push(data);
    });
  }

  initialize_gold_diamond_gems_and_other_items_validation_error(i) {
    this.validate_gold_diamond_gems_and_other_items[i].jewelleryParticulars_showError = false;
    this.validate_gold_diamond_gems_and_other_items[i].jewelleryAcquisition_showError = false;
    this.validate_gold_diamond_gems_and_other_items[i].jewelleryQuantityEnd_showError = false;
    this.validate_gold_diamond_gems_and_other_items[i].unitOfJewellery_showError = false;
  }

  validation_checking_gold_diamond_gems_and_other_items(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.jewelleryArray.forEach((element, index) => {
      this.initialize_gold_diamond_gems_and_other_items_validation_error(index);
      if (element.jewelleryParticulars == null || element.jewelleryParticulars == '') {
        this.validate_gold_diamond_gems_and_other_items[index].jewelleryParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.jewelleryAcquisition == null || element.jewelleryAcquisition == '') {
        this.validate_gold_diamond_gems_and_other_items[index].jewelleryAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.jewelleryQuantityEnd == null || element.jewelleryQuantityEnd == '') {
        this.validate_gold_diamond_gems_and_other_items[index].jewelleryQuantityEnd_showError = true;
        validationSuccess = false;
      }
      if (element.unitOfJewellery == null || element.unitOfJewellery == '') {
        this.validate_gold_diamond_gems_and_other_items[index].unitOfJewellery_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_gold_diamond_gems_and_other_items(i, formControlName) {
    if (formControlName === 'jewelleryParticulars')
      this.validate_gold_diamond_gems_and_other_items[i].jewelleryParticulars_showError = false;
    if (formControlName === 'jewelleryAcquisition')
      this.validate_gold_diamond_gems_and_other_items[i].jewelleryAcquisition_showError = false;
    if (formControlName === 'jewelleryQuantityEnd')
      this.validate_gold_diamond_gems_and_other_items[i].jewelleryQuantityEnd_showError = false;
    if (formControlName === 'unitOfJewellery')
      this.validate_gold_diamond_gems_and_other_items[i].unitOfJewellery_showError = false;
  }
  
  //gold_diamond_gems_and_other_items validation end

  //furniture_equipments_and_electronic_items validation start

  validate_furniture_equipments_and_electronic_items = [];
  initialize_furniture_equipments_and_electronic_items_validation() {
    this.validate_furniture_equipments_and_electronic_items = [];
    this.furnitureArray.forEach(element => {
      let data = {
        "FurnitureParticulars_showError": false,
        "FurnitureAcquisition_showError": false,
        "FurnitureValue_showError": false
      }
      this.validate_furniture_equipments_and_electronic_items.push(data);
    });
  }

  initialize_furniture_equipments_and_electronic_items_validation_error(i) {
    this.validate_furniture_equipments_and_electronic_items[i].FurnitureParticulars_showError = false;
    this.validate_furniture_equipments_and_electronic_items[i].FurnitureAcquisition_showError = false;
    this.validate_furniture_equipments_and_electronic_items[i].FurnitureValue_showError = false;
  }

  validation_checking_furniture_equipments_and_electronic_items(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.furnitureArray.forEach((element, index) => {
      this.initialize_furniture_equipments_and_electronic_items_validation_error(index);
      if (element.FurnitureParticulars == null || element.FurnitureParticulars == '') {
        this.validate_furniture_equipments_and_electronic_items[index].FurnitureParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.FurnitureAcquisition == null || element.FurnitureAcquisition == '') {
        this.validate_furniture_equipments_and_electronic_items[index].FurnitureAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.FurnitureValue == null || element.FurnitureValue == '') {
        this.validate_furniture_equipments_and_electronic_items[index].FurnitureValue_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_furniture_equipments_and_electronic_items(i, formControlName) {
    if (formControlName === 'FurnitureParticulars')
      this.validate_furniture_equipments_and_electronic_items[i].FurnitureParticulars_showError = false;
    if (formControlName === 'FurnitureAcquisition')
      this.validate_furniture_equipments_and_electronic_items[i].FurnitureAcquisition_showError = false;
    if (formControlName === 'FurnitureValue')
      this.validate_furniture_equipments_and_electronic_items[i].FurnitureValue_showError = false;
  }
  
  //furniture_equipments_and_electronic_items validation end


  //other_assets_of_significant_value validation start

  validate_other_assets_of_significant_value = [];
  initialize_other_assets_of_significant_value_validation() {
    this.validate_other_assets_of_significant_value = [];
    this.otherAssetsArray.forEach(element => {
      let data = {
        "otherAssetsParticulars_showError": false,
        "otherAssetsAcquisition_showError": false,
        "otherAssetsValue_showError": false
      }
      this.validate_other_assets_of_significant_value.push(data);
    });
  }

  initialize_other_assets_of_significant_value_validation_error(i) {
    this.validate_other_assets_of_significant_value[i].otherAssetsParticulars_showError = false;
    this.validate_other_assets_of_significant_value[i].otherAssetsAcquisition_showError = false;
    this.validate_other_assets_of_significant_value[i].otherAssetsValue_showError = false;
  }

  validation_checking_other_assets_of_significant_value(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.otherAssetsArray.forEach((element, index) => {
      this.initialize_other_assets_of_significant_value_validation_error(index);
      if (element.otherAssetsParticulars == null || element.otherAssetsParticulars == '') {
        this.validate_other_assets_of_significant_value[index].otherAssetsParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.otherAssetsAcquisition == null || element.otherAssetsAcquisition == '') {
        this.validate_other_assets_of_significant_value[index].otherAssetsAcquisition_showError = true;
        validationSuccess = false;
      }
      if (element.otherAssetsValue == null || element.otherAssetsValue == '') {
        this.validate_other_assets_of_significant_value[index].otherAssetsValue_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_other_assets_of_significant_value(i, formControlName) {
    if (formControlName === 'otherAssetsParticulars')
      this.validate_other_assets_of_significant_value[i].otherAssetsParticulars_showError = false;
    if (formControlName === 'otherAssetsAcquisition')
      this.validate_other_assets_of_significant_value[i].otherAssetsAcquisition_showError = false;
    if (formControlName === 'otherAssetsValue')
      this.validate_other_assets_of_significant_value[i].otherAssetsValue_showError = false;
  }
  
  //other_assets_of_significant_value validation end

  //notes_and_currencies validation start

  validate_notes_and_currencies = [];
  initialize_notes_and_currencies_validation() {
    this.validate_notes_and_currencies = [];
    this.notesCurrenciesArray.forEach(element => {
      let data = {
        "notesCurrenciesAmount_showError": false
      }
      this.validate_notes_and_currencies.push(data);
    });
  }

  initialize_notes_and_currencies_validation_error(i) {
    this.validate_notes_and_currencies[i].notesCurrenciesAmount_showError = false;
  }

  validation_checking_notes_and_currencies(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.notesCurrenciesArray.forEach((element, index) => {
      this.initialize_notes_and_currencies_validation_error(index);
      if (element.notesCurrenciesAmount == null || element.notesCurrenciesAmount == '') {
        this.validate_notes_and_currencies[index].notesCurrenciesAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_notes_and_currencies(i, formControlName) {
    if (formControlName === 'notesCurrenciesAmount')
      this.validate_notes_and_currencies[i].notesCurrenciesAmount_showError = false;
  }
  
  //notes_and_currencies validation end

  //provident_fund_and_other_fund validation start

  validate_provident_fund_and_other_fund = [];
  initialize_provident_fund_and_other_fund_validation() {
    this.validate_provident_fund_and_other_fund = [];
    this.fundArray.forEach(element => {
      let data = {
        "fundParticulars_showError": false,
        "fundBalance_showError": false
      }
      this.validate_provident_fund_and_other_fund.push(data);
    });
  }

  initialize_provident_fund_and_other_fund_validation_error(i) {
    this.validate_provident_fund_and_other_fund[i].fundParticulars_showError = false;
    this.validate_provident_fund_and_other_fund[i].fundBalance_showError = false;
  }

  validation_checking_provident_fund_and_other_fund(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.fundArray.forEach((element, index) => {
      this.initialize_provident_fund_and_other_fund_validation_error(index);
      if (element.fundParticulars == null || element.fundParticulars == '') {
        this.validate_provident_fund_and_other_fund[index].fundParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.fundBalance == null || element.fundBalance == '') {
        this.validate_provident_fund_and_other_fund[index].fundBalance_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_provident_fund_and_other_fund(i, formControlName) {
    if (formControlName === 'fundParticulars')
      this.validate_provident_fund_and_other_fund[i].fundParticulars_showError = false;
    if (formControlName === 'fundBalance')
      this.validate_provident_fund_and_other_fund[i].fundBalance_showError = false;
  }
  
  //provident_fund_and_other_fund validation end

  //other_deposits_balance_and_advance validation start

  validate_other_deposits_balance_and_advance = [];
  initialize_other_deposits_balance_and_advance_validation() {
    this.validate_other_deposits_balance_and_advance = [];
    this.outsideDepositsArray.forEach(element => {
      let data = {
        "outsideDepositsParticulars_showError": false,
        "outsideDepositsBalance_showError": false
      }
      this.validate_other_deposits_balance_and_advance.push(data);
    });
  }

  initialize_other_deposits_balance_and_advance_validation_error(i) {
    this.validate_other_deposits_balance_and_advance[i].outsideDepositsParticulars_showError = false;
    this.validate_other_deposits_balance_and_advance[i].outsideDepositsBalance_showError = false;
  }

  validation_checking_other_deposits_balance_and_advance(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.outsideDepositsArray.forEach((element, index) => {
      this.initialize_other_deposits_balance_and_advance_validation_error(index);
      if (element.outsideDepositsParticulars == null || element.outsideDepositsParticulars == '') {
        this.validate_other_deposits_balance_and_advance[index].outsideDepositsParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.outsideDepositsBalance == null || element.outsideDepositsBalance == '') {
        this.validate_other_deposits_balance_and_advance[index].outsideDepositsBalance_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_other_deposits_balance_and_advance(i, formControlName) {
    if (formControlName === 'outsideDepositsParticulars')
      this.validate_other_deposits_balance_and_advance[i].outsideDepositsParticulars_showError = false;
    if (formControlName === 'outsideDepositsBalance')
      this.validate_other_deposits_balance_and_advance[i].outsideDepositsBalance_showError = false;
  }
  
  //other_deposits_balance_and_advance validation end


  //borrowing_from_bank_or_other_fi validation start

  validate_borrowing_from_bank_or_other_fi = [];
  initialize_borrowing_from_bank_or_other_fi_validation() {
    this.validate_borrowing_from_bank_or_other_fi = [];
    this.liabilitiesBorrowArray.forEach(element => {
      let data = {
        "liabilitiesBorrowBankName_showError": false,
        "liabilitiesBorrowAccount_showError": false,
        "liabilitiesBorrowPurpose_showError": false,
        "liabilitiesBorrowBalance_showError": false
      }
      this.validate_borrowing_from_bank_or_other_fi.push(data);
    });
  }

  initialize_borrowing_from_bank_or_other_fi_validation_error(i) {
    this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowBankName_showError = false;
    this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowAccount_showError = false;
    this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowPurpose_showError = false;
    this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowBalance_showError = false;
  }

  validation_checking_borrowing_from_bank_or_other_fi(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.liabilitiesBorrowArray.forEach((element, index) => {
      this.initialize_borrowing_from_bank_or_other_fi_validation_error(index);
      if (element.liabilitiesBorrowBankName == null || element.liabilitiesBorrowBankName == '') {
        this.validate_borrowing_from_bank_or_other_fi[index].liabilitiesBorrowBankName_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesBorrowAccount == null || element.liabilitiesBorrowAccount == '') {
        this.validate_borrowing_from_bank_or_other_fi[index].liabilitiesBorrowAccount_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesBorrowPurpose == null || element.liabilitiesBorrowPurpose == '') {
        this.validate_borrowing_from_bank_or_other_fi[index].liabilitiesBorrowPurpose_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesBorrowBalance == null || element.liabilitiesBorrowBalance == '') {
        this.validate_borrowing_from_bank_or_other_fi[index].liabilitiesBorrowBalance_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_borrowing_from_bank_or_other_fi(i, formControlName) {
    if (formControlName === 'liabilitiesBorrowBankName')
      this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowBankName_showError = false;
    if (formControlName === 'liabilitiesBorrowAccount')
      this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowAccount_showError = false;
    if (formControlName === 'liabilitiesBorrowPurpose')
      this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowPurpose_showError = false;
    if (formControlName === 'liabilitiesBorrowBalance')
      this.validate_borrowing_from_bank_or_other_fi[i].liabilitiesBorrowBalance_showError = false;
  }
  
  //borrowing_from_bank_or_other_fi validation end


  //unsecured_loan validation start

  validate_unsecured_loan = [];
  initialize_unsecured_loan_validation() {
    this.validate_unsecured_loan = [];
    this.liabilitiesUnsecuredLoanArray.forEach(element => {
      let data = {
        "liabilitiesUnsecuredLoanName_showError": false,
        "liabilitiesUnsecuredLoanTIN_showError": false,
        "liabilitiesUnsecuredLoanPurpose_showError": false,
        "liabilitiesUnsecuredLoanBalance_showError": false
      }
      this.validate_unsecured_loan.push(data);
    });
  }

  initialize_unsecured_loan_validation_error(i) {
    this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanName_showError = false;
    this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanTIN_showError = false;
    this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanPurpose_showError = false;
    this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanBalance_showError = false;
  }

  validation_checking_unsecured_loan(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.liabilitiesUnsecuredLoanArray.forEach((element, index) => {
      this.initialize_unsecured_loan_validation_error(index);
      if (element.liabilitiesUnsecuredLoanName == null || element.liabilitiesUnsecuredLoanName == '') {
        this.validate_unsecured_loan[index].liabilitiesUnsecuredLoanName_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesUnsecuredLoanTIN == null || element.liabilitiesUnsecuredLoanTIN == '') {
        this.validate_unsecured_loan[index].liabilitiesUnsecuredLoanTIN_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesUnsecuredLoanPurpose == null || element.liabilitiesUnsecuredLoanPurpose == '') {
        this.validate_unsecured_loan[index].liabilitiesUnsecuredLoanPurpose_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesUnsecuredLoanBalance == null || element.liabilitiesUnsecuredLoanBalance == '') {
        this.validate_unsecured_loan[index].liabilitiesUnsecuredLoanBalance_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_unsecured_loan(i, formControlName) {
    if (formControlName === 'liabilitiesUnsecuredLoanName')
      this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanName_showError = false;
    if (formControlName === 'liabilitiesUnsecuredLoanTIN')
      this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanTIN_showError = false;
    if (formControlName === 'liabilitiesUnsecuredLoanPurpose')
      this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanPurpose_showError = false;
    if (formControlName === 'liabilitiesUnsecuredLoanBalance')
      this.validate_unsecured_loan[i].liabilitiesUnsecuredLoanBalance_showError = false;
  }
  
  //unsecured_loan validation end

  //other_loan_or_overdraft validation start

  validate_other_loan_or_overdraft = [];
  initialize_other_loan_or_overdraft_validation() {
    this.validate_other_loan_or_overdraft = [];
    this.liabilitiesOtherArray.forEach(element => {
      let data = {
        "liabilitiesOtherParticulars_showError": false,
        "liabilitiesOtherLoan_showError": false,
        "liabilitiesOtherBalance_showError": false
      }
      this.validate_other_loan_or_overdraft.push(data);
    });
  }

  initialize_other_loan_or_overdraft_validation_error(i) {
    this.validate_other_loan_or_overdraft[i].liabilitiesOtherParticulars_showError = false;
    this.validate_other_loan_or_overdraft[i].liabilitiesOtherLoan_showError = false;
    this.validate_other_loan_or_overdraft[i].liabilitiesOtherBalance_showError = false;
  }

  validation_checking_other_loan_or_overdraft(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.liabilitiesOtherArray.forEach((element, index) => {
      this.initialize_other_loan_or_overdraft_validation_error(index);
      if (element.liabilitiesOtherParticulars == null || element.liabilitiesOtherParticulars == '') {
        this.validate_other_loan_or_overdraft[index].liabilitiesOtherParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesOtherLoan == null || element.liabilitiesOtherLoan == '') {
        this.validate_other_loan_or_overdraft[index].liabilitiesOtherLoan_showError = true;
        validationSuccess = false;
      }
      if (element.liabilitiesOtherBalance == null || element.liabilitiesOtherBalance == '') {
        this.validate_other_loan_or_overdraft[index].liabilitiesOtherBalance_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_other_loan_or_overdraft(i, formControlName) {
    if (formControlName === 'liabilitiesOtherParticulars')
      this.validate_other_loan_or_overdraft[i].liabilitiesOtherParticulars_showError = false;
    if (formControlName === 'liabilitiesOtherLoan')
      this.validate_other_loan_or_overdraft[i].liabilitiesOtherLoan_showError = false;
    if (formControlName === 'liabilitiesOtherBalance')
      this.validate_other_loan_or_overdraft[i].liabilitiesOtherBalance_showError = false;
  }
  
  //other_loan_or_overdraft validation end


  //loss_deduction_other_expense validation start

  validate_loss_deduction_other_expense = [];
  initialize_loss_deduction_other_expense_validation() {
    this.validate_loss_deduction_other_expense = [];
    this.outflowLossArray.forEach(element => {
      let data = {
        "outflowLossLocation_showError": false,
        "outflowLossAmount_showError": false
      }
      this.validate_loss_deduction_other_expense.push(data);
    });
  }

  initialize_loss_deduction_other_expense_validation_error(i) {
    this.validate_loss_deduction_other_expense[i].outflowLossLocation_showError = false;
    this.validate_loss_deduction_other_expense[i].outflowLossAmount_showError = false;
  }

  validation_checking_loss_deduction_other_expense(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.outflowLossArray.forEach((element, index) => {
      this.initialize_loss_deduction_other_expense_validation_error(index);
      if (element.outflowLossLocation == null || element.outflowLossLocation == '') {
        this.validate_loss_deduction_other_expense[index].outflowLossLocation_showError = true;
        validationSuccess = false;
      }
      if (element.outflowLossAmount == null || element.outflowLossAmount == '') {
        this.validate_loss_deduction_other_expense[index].outflowLossAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_loss_deduction_other_expense(i, formControlName) {
    if (formControlName === 'outflowLossLocation')
      this.validate_loss_deduction_other_expense[i].outflowLossLocation_showError = false;
    if (formControlName === 'outflowLossAmount')
      this.validate_loss_deduction_other_expense[i].outflowLossAmount_showError = false;
  }
  
  //loss_deduction_other_expense validation end

  //gift_donation_and_contribution validation start

  validate_gift_donation_and_contribution = [];
  initialize_gift_donation_and_contribution_validation() {
    this.validate_gift_donation_and_contribution = [];
    this.outflowGiftArray.forEach(element => {
      let data = {
        "outflowGiftParticulars_showError": false,
        "outflowGiftName_showError": false,
        "outflowGiftAmount_showError": false
      }
      this.validate_gift_donation_and_contribution.push(data);
    });
  }

  initialize_gift_donation_and_contribution_validation_error(i) {
    this.validate_gift_donation_and_contribution[i].outflowGiftParticulars_showError = false;
    this.validate_gift_donation_and_contribution[i].outflowGiftName_showError = false;
    this.validate_gift_donation_and_contribution[i].outflowGiftAmount_showError = false;
  }

  validation_checking_gift_donation_and_contribution(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.outflowGiftArray.forEach((element, index) => {
      this.initialize_gift_donation_and_contribution_validation_error(index);
      if (element.outflowGiftParticulars == null || element.outflowGiftParticulars == '') {
        this.validate_gift_donation_and_contribution[index].outflowGiftParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.outflowGiftName == null || element.outflowGiftName == '') {
        this.validate_gift_donation_and_contribution[index].outflowGiftName_showError = true;
        validationSuccess = false;
      }
      if (element.outflowGiftAmount == null || element.outflowGiftAmount == '') {
        this.validate_gift_donation_and_contribution[index].outflowGiftAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_gift_donation_and_contribution(i, formControlName) {
    if (formControlName === 'outflowGiftParticulars')
      this.validate_gift_donation_and_contribution[i].outflowGiftParticulars_showError = false;
    if (formControlName === 'outflowGiftName')
      this.validate_gift_donation_and_contribution[i].outflowGiftName_showError = false;
      if (formControlName === 'outflowGiftAmount')
      this.validate_gift_donation_and_contribution[i].outflowGiftAmount_showError = false;
  }
  
  //gift_donation_and_contribution validation end


  //other_receipts validation start

  validate_other_receipts = [];
  initialize_other_receipts_validation() {
    this.validate_other_receipts = [];
    this.sourceFundReceiptsArray.forEach(element => {
      let data = {
        "sourceFundReceiptsParticulars_showError": false,
        "sourceFundReceiptsReference_showError": false,
        "sourceFundReceiptsAmount_showError": false
      }
      this.validate_other_receipts.push(data);
    });
  }

  initialize_other_receipts_validation_error(i) {
    this.validate_other_receipts[i].sourceFundReceiptsParticulars_showError = false;
    this.validate_other_receipts[i].sourceFundReceiptsReference_showError = false;
    this.validate_other_receipts[i].sourceFundReceiptsAmount_showError = false;
  }

  validation_checking_other_receipts(): boolean {
    let validationSuccess: boolean = true;
    validationSuccess = true;
    this.sourceFundReceiptsArray.forEach((element, index) => {
      this.initialize_other_receipts_validation_error(index);
      if (element.sourceFundReceiptsParticulars == null || element.sourceFundReceiptsParticulars == '') {
        this.validate_other_receipts[index].sourceFundReceiptsParticulars_showError = true;
        validationSuccess = false;
      }
      if (element.sourceFundReceiptsReference == null || element.sourceFundReceiptsReference == '') {
        this.validate_other_receipts[index].sourceFundReceiptsReference_showError = true;
        validationSuccess = false;
      }
      if (element.sourceFundReceiptsAmount == null || element.sourceFundReceiptsAmount == '') {
        this.validate_other_receipts[index].sourceFundReceiptsAmount_showError = true;
        validationSuccess = false;
      }
    })

    if (validationSuccess)
      return true;
    else
      return false;
  }

  change_other_receipts(i, formControlName) {
    if (formControlName === 'sourceFundReceiptsParticulars')
      this.validate_other_receipts[i].sourceFundReceiptsParticulars_showError = false;
    if (formControlName === 'sourceFundReceiptsReference')
      this.validate_other_receipts[i].sourceFundReceiptsReference_showError = false;
      if (formControlName === 'sourceFundReceiptsAmount')
      this.validate_other_receipts[i].sourceFundReceiptsAmount_showError = false;
  }
  
  //other_receipts validation end
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
     //       console.log(error['error'].errorMessage);
          });
    });
  }

}
