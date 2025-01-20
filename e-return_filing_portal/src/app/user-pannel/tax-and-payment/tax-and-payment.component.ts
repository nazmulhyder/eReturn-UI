import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { navItems } from '../../side-bar-menu';
import { HeadsOfIncomeService } from '../heads-of-income.service';

@Component({
  selector: 'app-tax-and-payment',
  templateUrl: './tax-and-payment.component.html',
  styleUrls: ['./tax-and-payment.component.css']
})
export class TaxAndPaymentComponent implements OnInit {
  submitForm: FormGroup;
  isContinuePayment: boolean = false;
  hasAnyIncome: boolean = false;
  isChkePayment: boolean = false;
  isChkaChalan: boolean = false;
  isChkotherPayment: boolean = false;
  isPayableAmountEmpty: boolean = false;
  paymentRequestJson: any;

  taxAndPaymentForm: FormGroup;
  headsOfIncome = [];
  modalRef: BsModalRef;
  totalSalaryAmt: any;
  totalInterestSecurityAmt: any;
  totalHousePropertyAmt: any;
  totalIncomeFromOtherSourcesAmt: any;
  totalCapitalGainAmt: any;
  totalAgriculture: any;
  totalBusinessOrProfession: any;
  totalFirm_AoP: any;
  totalSpouse_Income: any;
  totalForeign_Income: any;
  total_Income_Amt: any;
  total_Tax_Exempted_Income_Amt: any;

  //#region set off section variable

  Set_Off_Head_Sal_After_Set_Off: any;
  Set_Off_Head_Sal_Loss_Not_Set_Off: any;

  Set_Off_Head_Ios_After_Set_Off: any;
  Set_Off_Head_Ios_Loss_Not_Set_Off: any;

  Set_Off_Head_Ifhp_After_Set_Off: any;
  Set_Off_Head_Ifhp_Loss_Not_Set_Off: any;

  Set_Off_Head_Ai_After_Set_Off: any;
  Set_Off_Head_Ai_Loss_Not_Set_Off: any;

  Set_Off_Head_Ifbp_After_Set_Off: any;
  Set_Off_Head_Ifbp_Loss_Not_Set_Off: any;

  Set_Off_Head_Cg_After_Set_Off: any;
  Set_Off_Head_Cg_Loss_Not_Set_Off: any;

  Set_Off_Head_Ifos_After_Set_Off: any;
  Set_Off_Head_Ifos_Loss_Not_Set_Off: any;

  Set_Off_Head_Firm_Aop_After_Set_Off: any;
  Set_Off_Head_Firm_Aop_Loss_Not_Set_Off: any;

  Set_Off_Head_Minor_Spouse_After_Set_Off: any;
  Set_Off_Head_Minor_Spouse_Loss_Not_Set_Off: any;

  Set_Off_Head_FI_After_Set_Off: any;
  Set_Off_Head_FI_Loss_Not_Set_Off: any;

  //#endregion

  total_Gross_Tax_Before_Tax_Rebate_Amt: any;
  total_Tax_Rebate_Amt: any;
  total_Net_Tax_After_Tax_Rebate_Amt: any;
  total_Min_Tax_Amt: any;
  total_Net_Wealth_Surcharge_Amt: any;
  total_Interest_or_Any_Other_Amt: any;
  total_Payable_Amt: any;

  TC_GTBTR_Tax_on_Regular_Income: any;
  TC_GTBTR_Tax_on_Income_us_82c: any;
  TC_GTBTR_Tax_on_SRO_Income: any;
  TC_Total_Investment_Rebate: any;
  TC_TR_on_Firm_AoP_Share: any;
  TC_TR_on_Foreign_Tax_Relief: any;
  TC_TR_Other_Rebate: any;
  TC_MT_for_Income_us_82c_2: any;
  TC_MT_for_Income_us_82c_4: any;
  TC_MT_for_Location_of_Income: any;
  TC_S_Net_Wealth_Surcharge: any;
  TC_S_Tobacco_Surcharge: any;

  sourceTax: any;
  advanceIncomeTax: any;
  regularTax: any;
  regularPayment: any;
  refundAdjustment: any;
  totalVerifiedAmt: any;
  refundableAmt: any;
  payableAmtt: any;
  payable: any;

  salaryTDS: any;
  bankTDS: any;
  savingTDS: any;
  othersTDS: any;
  carAitTds: any;
  aitUS64Tds: any;

  ibas50: any;

  grossTaxRebate: any;


  refreshParam: any;

  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};
  lengthOfheads: any;

  isSourceTaxChecked: boolean;
  isSourceTaxShow: boolean;

  isRegularPaymentChecked: boolean;
  isRegularPaymentShow: boolean;

  isRefundAdjustmentChecked: boolean;
  isRefundAdjustmentShow: boolean;

  isAdvanceIncomeTaxChecked: boolean;
  isAdvanceIncomeTaxShow: boolean;

  isPaidCarOwnershipTaxChecked: boolean;
  isPaidCarOwnershipShow: boolean;

  isPaidRegularAITChecked: boolean;
  isRegularAITShow: boolean;

  InterestRequestBody: any;
  HousePropertyrequestBody: any;
  IncomeRequestBody: any;
  CapitalGainRequestBody: any;
  agricultureRequestBody: any;
  businessRequestBody: any;
  userTin: any;

  taxPaymentGetData: any;

  apiService: ApiService;
  private serviceUrl: string;
  private eLedgerUrl: string;
  apiUrl: ApiUrl;

  requestNavbarGetData: any;
  additionalInformationForm: FormGroup;
  requestIncomeHeadGetData: any;
  formGroup: FormGroup;

  isPaymentSuccessForThisTIN: boolean = false;

  isReturnSubmitBtnDisabled: boolean = false;
  isPayNowBtnDisabled: boolean = false;

  allRegularPayments = [];

  //#region cal refundable & payable variable
  A: any; //Minimum tax(82c)
  X: any; //Total amount payable
  B: any; //Regular tax payable
  P: any; //Motor car ait
  Y: any; //Total verified payment
  Q: any; //Net verified payment
  R: any; //Refundable
  T: any; //Payable
  //#endregion

  isSetOffShown: boolean = false;
  isSetOffSalShown: boolean = false;
  isSetOffIosShown: boolean = false;
  isSetOffIfhpShown: boolean = false;
  isSetOffAiShown: boolean = false;
  isSetOffIfbpShown: boolean = false;
  isSetOffCgShown: boolean = false;
  isSetOffIfosShown: boolean = false;
  isSetOffFirm_AopShown: boolean = false;
  isSetOffMinor_SpouseShown: boolean = false;
  isSetOffAIShown: boolean = false;


  isRefundBtnActive: boolean = false;

  isSourceTaxCollapsed = false;
  isAdvanceIncomeTaxCollapsed = false;
  isTaxExemptedIncomeCollapsed: boolean = true;
  taxExemptedBreakdownList = [];
  // for shared log-in
  eLedgerPortalBaseUrl: string;
  token: any;
  isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';
  yourIFrameUrl: any;
  //end

  // modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  //new added by nazmul
  taxComputationForm: FormGroup;
  wantEditCalDetail_grossTaxB4TaxRebate: boolean = false;
  wantEditCalDetail_TaxRebate: boolean = false;
  wantEditCalDetail_MinimumTax: boolean = false;
  wantEditCalDetail_Surcharge: boolean = false;
  wantEditCalDetail_anyOtherAmount: boolean = false;


  //for new bank tds claim section
  BankClaimData: any;
  isShowBankClaimSection: boolean = false;
  totalBankTdsAmt: any;
  bankClaimReqjson: any;
  dataLength: any;
  validation: any;
  hasError = [false];
  deleteIndex: any;


  //tooltip text
  //newly added for initial-basic-query
  haveSrcTaxHtml = `<span class="btn-block well-sm";">Select YES if any source tax or advance tax (such as TDS on salary, TDS on bank interest, AIT on car, etc.) was paid by you for 2021-2022 Assessment Year. Otherwise, select NO.</span>`;
  updateLedgerHtml = `<span class="btn-block well-sm";">Select YES if you need to update your tax payment (including source tax and advance tax).  Select NO if your payment status is already updated and you are ready for return filing.</span>`;
  offlineTooltip = `<span class="btn-block well-sm";">If you find that all of your tax payments are not yet verified, you may want to submit paper return at tax office instead of filing online. Click here to get a system-prepared offline (paper) return.</span>`;
  onlineTooltip = `<span class="btn-block well-sm";">Click here if you are fine with verified payment and other figures, and want to file return online.</span>`;

  basicQuestionForm = new FormGroup({
    haveSrcTax: new FormControl('0'),
    updateLedger: new FormControl('0'),
  });

  isHaveSrcTax: boolean = false;
  isUpdateLedger: boolean = false;
  //end

  // taxpayerName: any;
  isSubmitted: boolean = false;
  isShow: boolean = true;

  refresh_Token : any;
  requestSessionID : any;

  //newly added : 29/5/2022
  isSalaryCollapsed : boolean = false;

  get_all_tds = [];

  constructor(
    private fb: FormBuilder,
    private mainNavbarList: mainNavbarListService,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private headService: HeadsOfIncomeService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private eReturnSpinner: NgxUiLoaderService,
    private httpClient: HttpClient,
    private datepipe: DatePipe,
    private commaseparator: CommaSeparatorService,
    public sanitizer: DomSanitizer,
  ) {
    this.submitForm = fb.group({
      token: ['']
    });
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
      this.eLedgerUrl = res['eLedger'].url;
      this.eLedgerPortalBaseUrl = res['eLedgerPortalUrl'].url;
    });
    this.yourIFrameUrl = this.eLedgerPortalBaseUrl + '/#/eReturn-login';
    this.taxAndPaymentForm = new FormGroup({
      ePaymentGateway: new FormControl(false),
      aChalanGateway: new FormControl(false),
      otherGateway: new FormControl(false),
      payable_Amount: new FormControl()
    });

    this.refresh_Token = localStorage.getItem('refreshToken');
    //added by nazmul
    this.taxComputationForm = new FormGroup({
      //Gross Tax before Tax Rebate
      tax_on_regular_income: new FormControl(),
      isTORI_changes: new FormControl(false),
      tax_on_income_82c: new FormControl(),
      isTOI82c_changes: new FormControl(false),
      tax_on_sro_income: new FormControl(),
      isTOSROI_changes: new FormControl(false),
      summery_GrossTaxbeforeTaxRebate: new FormControl(),

      //Tax Rebate
      on_investment: new FormControl(),
      isOI_changes: new FormControl(false),
      on_firm_aop_share: new FormControl(),
      isFA_changes: new FormControl(false),
      foreign_tax_relief: new FormControl(),
      isFTR_changes: new FormControl(false),
      other_rebate: new FormControl(),
      isOR_changes: new FormControl(false),
      summery_TaxRebate: new FormControl(),

      //Net Tax after Tax Rebate
      netTaxAfterTaxRebate: new FormControl(),

      //Minimum Tax
      for_income_us_82c: new FormControl(),
      isFIUS82C_changes: new FormControl(false),
      on_gross_receipt: new FormControl(),
      isOGR_changes: new FormControl(false),
      for_location_of_income: new FormControl(),
      isFLOI_changes: new FormControl(false),
      summery_MinimumTax: new FormControl(),
      //Surcharge
      net_wealth_surcharge: new FormControl(),
      isNWS_changes: new FormControl(false),
      tobacco_surcharge: new FormControl(),
      isTS_changes: new FormControl(false),
      summery_Surcharge: new FormControl(),
      //Any Other Amount
      summery_any_other_amount: new FormControl(),
      isAOA_changes: new FormControl(false),

      total_amount_payable: new FormControl(),

    });

    this.getHeadsOfIncome();
    this.isSourceTaxChecked = false;
    this.isSourceTaxShow = false;

    this.isRegularPaymentChecked = false;
    this.isRegularPaymentShow = false;

    this.isRefundAdjustmentChecked = false;
    this.isRefundAdjustmentShow = false;

    this.isAdvanceIncomeTaxChecked = false;
    this.isAdvanceIncomeTaxShow = false;

    this.isPaidCarOwnershipTaxChecked = false;
    this.isPaidCarOwnershipShow = false;

    this.isPaidRegularAITChecked = false;
    this.isRegularAITShow = false;
    this.getMainNavbar();
    this.mainNavActiveSelect('6');

    this.userTin = localStorage.getItem('tin');
    // this.hasAnyIncome = localStorage.getItem('hasAnyIncome');

    this.submitForm.get('token').setValue(localStorage.getItem('token'));

    this.totalSalaryAmt = 0;
    this.totalInterestSecurityAmt = 0;
    this.totalHousePropertyAmt = 0;
    this.totalIncomeFromOtherSourcesAmt = 0;
    this.totalCapitalGainAmt = 0;

    this.totalAgriculture = 0;

    this.totalBusinessOrProfession = 0;

    this.totalFirm_AoP = 0;
    this.totalSpouse_Income = 0;
    this.totalForeign_Income = 0;

    //#region set off section variable initialization
    this.Set_Off_Head_Sal_After_Set_Off = 0;
    this.Set_Off_Head_Sal_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Ios_After_Set_Off = 0;
    this.Set_Off_Head_Ios_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Ifhp_After_Set_Off = 0;
    this.Set_Off_Head_Ifhp_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Ai_After_Set_Off = 0;
    this.Set_Off_Head_Ai_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Ifbp_After_Set_Off = 0;
    this.Set_Off_Head_Ifbp_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Cg_After_Set_Off = 0;
    this.Set_Off_Head_Cg_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Ifos_After_Set_Off = 0;
    this.Set_Off_Head_Ifos_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Firm_Aop_After_Set_Off = 0;
    this.Set_Off_Head_Firm_Aop_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_Minor_Spouse_After_Set_Off = 0;
    this.Set_Off_Head_Minor_Spouse_Loss_Not_Set_Off = 0;

    this.Set_Off_Head_FI_After_Set_Off = 0;
    this.Set_Off_Head_FI_Loss_Not_Set_Off = 0;
    //#endregion

    this.grossTaxRebate = 0;

    this.total_Income_Amt = 0;
    this.total_Tax_Exempted_Income_Amt = 0;
    this.total_Gross_Tax_Before_Tax_Rebate_Amt = 0;
    this.total_Tax_Rebate_Amt = 0;
    this.total_Net_Tax_After_Tax_Rebate_Amt = 0;
    this.total_Min_Tax_Amt = 0;
    this.total_Net_Wealth_Surcharge_Amt = 0;
    this.total_Interest_or_Any_Other_Amt = 0;
    this.total_Payable_Amt = 0;

    this.TC_GTBTR_Tax_on_Regular_Income = 0;
    this.TC_GTBTR_Tax_on_Income_us_82c = 0;
    this.TC_GTBTR_Tax_on_SRO_Income = 0;
    this.TC_Total_Investment_Rebate = 0;
    this.TC_TR_on_Firm_AoP_Share = 0;
    this.TC_TR_on_Foreign_Tax_Relief = 0;
    this.TC_TR_Other_Rebate = 0;
    this.TC_MT_for_Income_us_82c_2 = 0;
    this.TC_MT_for_Income_us_82c_4 = 0;
    this.TC_MT_for_Location_of_Income = 0;
    this.TC_S_Net_Wealth_Surcharge = 0;
    this.TC_S_Tobacco_Surcharge = 0;

    this.sourceTax = 0;
    this.advanceIncomeTax = 0;
    this.regularTax = 0;
    this.regularPayment = 0;
    this.refundAdjustment = 0;
    this.totalVerifiedAmt = 0;

    this.refundableAmt = 0;

    this.ibas50 = 0;

    this.salaryTDS = 0;
    this.bankTDS = 0;
    this.savingTDS = 0;
    this.othersTDS = 0;
    this.carAitTds = 0;
    this.aitUS64Tds = 0;

    this.payable = 0;


    this.A = 0;
    this.X = 0;
    this.B = 0;
    this.P = 0;
    this.Y = 0;
    this.Q = 0;
    this.R = 0;
    this.T = 0;

    // if (this.hasAnyIncome == 'false') {
    //   this.isReturnSubmitBtnDisabled = true;
    //   this.isPayNowBtnDisabled = true;
    // }

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    // this.loadAll_navbar_on_Page_reload();
    //#endregion
    this.eReturnSpinner.start();
    // this.getIbasData();

    //newly added for Bank Tds Claim section
    // this.checkIsEnableForBankClaim()
    //   .then(() => this.getEledgerSummary());
    // this.getBankTdsClaimData();
    //end

    this.getEledgerSummary();
    this.paymentSuccessCheck();
    this.getTaxExemptedBreakdownDetails();
    this.checkSubmissionStatus();
    this.eReturnSpinner.stop();

    // debugger;

    localStorage.setItem('RefundableAmount', this.refundableAmt);

    this.get_all_tds = [
      {
        "com_name" : "Synesis IT Limited",
        "amount_tds" : 400
      },
      {
        "com_name" : "Brain Station 23 Limited",
        "amount_tds" : 600
      },
      {
        "com_name" : "Nybsys Pvt. Limited",
        "amount_tds" : 700
      }
    ]

  }

  getBankTdsClaimData(): Promise<void> {
    // debugger;
    return new Promise((resolve, reject) => {
      this.apiService.get(this.eLedgerUrl + 'api/bank/get_tds_by_tin/' + this.userTin)
        .subscribe(result => {
      //    console.log('bankTdsData', result);
          if (result.replyMessage != null) {
            this.isShowBankClaimSection = true;
            this.BankClaimData = result.replyMessage;
            this.BankClaimData.forEach(element => {
              element.tdsAvailable = this.commaseparator.currencySeparatorBD(element.tdsAvailable);
              element.tdsClaim = this.commaseparator.currencySeparatorBD(element.tdsClaim);
            });
            this.calTotalBankTds();
          }
          else {
            this.checkIsEnableForBankClaim();
          }

          resolve();
        },
          error => {
            reject();
        //    console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });

    });
  }

  calTotalBankTds() {
    // debugger;
    this.totalBankTdsAmt = 0;
    this.BankClaimData.forEach(element => {
      this.totalBankTdsAmt += parseInt(this.commaseparator.removeComma(element.tdsClaim, 0)) ? parseInt(this.commaseparator.removeComma(element.tdsClaim, 0)) : 0;
    });
    this.totalBankTdsAmt = this.commaseparator.currencySeparatorBD(this.totalBankTdsAmt);
  }

  onTdsClaim(event: any, index) {
    // debugger;
    let getValuebyIndex: any;
    let value: any;
    value = this.commaseparator.removeComma(event.target.value, 0);
    getValuebyIndex = (this.BankClaimData)[index];
    if (parseInt(value) >= 0) {
      let maxTdsClaim: any;
      this.hasError[index] = false;
      maxTdsClaim = parseInt(this.commaseparator.removeComma(getValuebyIndex.tdsAvailable, 0)) * (10 / 100);
      if (parseInt(value) > maxTdsClaim) {
        this.toastr.warning("Claim amount can't be greater than 10% of Interest amount.", '', {
          timeOut: 3000,
        });
        getValuebyIndex.tdsClaim = this.commaseparator.currencySeparatorBD(maxTdsClaim);
      //  console.log('updateData:', this.BankClaimData);
        this.calTotalBankTds();
      } else {
        getValuebyIndex.tdsClaim = this.commaseparator.currencySeparatorBD((this.commaseparator.removeComma(getValuebyIndex.tdsClaim, 0)));
     //   console.log('updateData:', this.BankClaimData);
        this.calTotalBankTds();
      }
    }
    else {
      getValuebyIndex.tdsClaim = 0;
      this.calTotalBankTds();
    }
  }

  saveBankTdsClaimData(): Promise<void> {
    // debugger;
 //   console.log('BankClaimData:', this.BankClaimData);
    let successValidation: boolean = true;
    this.BankClaimData.forEach((element, i) => {
      if (element.tdsClaim == '' || element.tdsClaim == null || element.tdsClaim == "NaN") {
        successValidation = false;
        this.hasError[i] = true;
      }
    });
    return new Promise((resolve, reject) => {
      if (!successValidation) return;
      this.BankClaimData.forEach((element, i) => {
        element.tdsAvailable = parseInt(this.commaseparator.removeComma(element.tdsAvailable, 0)) ? parseInt(this.commaseparator.removeComma(element.tdsAvailable, 0)) : 0;
        element.tdsClaim = parseInt(this.commaseparator.removeComma(element.tdsClaim, 0)) ? parseInt(this.commaseparator.removeComma(element.tdsClaim, 0)) : 0;
      });
    //  console.log('reqjson:', this.BankClaimData);
      this.eReturnSpinner.start();
      this.apiService.post(this.eLedgerUrl + 'api/bank/tds-claims/' + this.userTin + '/' + '2021-2022', this.BankClaimData)
        .subscribe(result => {
          this.toastr.success("Data saved successfully.", '', {
            timeOut: 3000,
          });
          this.addCommaBankClaimData();
          this.getEledgerSummary();
          resolve();
          this.eReturnSpinner.stop();
        },
          error => {
            reject();
            this.eReturnSpinner.stop();
     //       console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });

    });
  }

  addCommaBankClaimData() {
    this.BankClaimData.forEach(element => {
      element.tdsAvailable = this.commaseparator.currencySeparatorBD(element.tdsAvailable);
      element.tdsClaim = this.commaseparator.currencySeparatorBD(element.tdsClaim);
    });
  }

  checkIsEnableForBankClaim(): Promise<void> {
    // debugger;
    this.dataLength = 1;
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/tds-claim-validity/' + this.userTin + '/' + '2021-2022')
        .subscribe(result => {
     //     console.log('tds-claim-validity', result);
          this.isShowBankClaimSection = result.success;
          if (this.isShowBankClaimSection) {
            this.BankClaimData = result.replyMessage;
            this.BankClaimData.forEach((element, i) => {
              element.tdsAvailable = this.commaseparator.currencySeparatorBD(element.tdsAvailable);
              element.tdsClaim = this.commaseparator.currencySeparatorBD(element.tdsClaim);
              this.dataLength += i;
              this.hasError[i] = false;
            });
            this.calTotalBankTds();
          }
          resolve();
        },
          error => {
            reject();
        //    console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });

    });
  }

  deleteRow(index) {
    this.BankClaimData.splice(index, 1);
    this.toastr.success("Data deleted successfully.", '', {
      timeOut: 2000,
    });
    this.dataLength = 1;
    this.BankClaimData.forEach((element, i) => {
      this.dataLength += i;
    });
    this.calTotalBankTds();
    this.modalRef.hide();
  }


  onDeleteBankTdsClaimData(index, deleteBankTdsPopup) {
    // debugger;
    this.deleteIndex = index;
    this.onChangeBankTdsClaimData(deleteBankTdsPopup);
  }

  onChangeBankTdsClaimData(deleteBankTdsPopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(deleteBankTdsPopup, this.config);
  }

  closeBankTdsClaim() {
    this.modalRef.hide();
  }

  getEledgerSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get(this.eLedgerUrl + 'api/tds_summary')
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {
      //      console.log('eLedgerData', result.replyMessage);

            let totalSourceTax: any;
            // totalSourceTax = (result.replyMessage['IBassTDS']
            //   + result.replyMessage['BankTDS']
            //   + result.replyMessage['SavingCertificateTDS']
            //   + result.replyMessage['OtherTDS']);
      //      console.log('sourceTax', totalSourceTax);

            //this.sourceTax = this.commaseparator.currencySeparatorBD(totalSourceTax);
            this.sourceTax = this.commaseparator.currencySeparatorBD(result.replyMessage['TotalSourceTax']);

            // let salaryTdsData = result.replyMessage['IBassTDS'];
            // this.salaryTDS = this.commaseparator.currencySeparatorBD(salaryTdsData);

            //total salary
            let salaryTdsData = result.replyMessage['CompanyTDS'];
            this.salaryTDS = this.commaseparator.currencySeparatorBD(salaryTdsData);

            //total salary breakdown
            this.get_all_tds = result.replyMessage['CompanyTDSBreakdown'];

            let bankTdsData = result.replyMessage['BankTDS'];
            this.bankTDS = this.commaseparator.currencySeparatorBD(bankTdsData);

            let savingTdsData = result.replyMessage['SavingCertificateTDS'];
            this.savingTDS = this.commaseparator.currencySeparatorBD(savingTdsData);

            let othersTdsData = result.replyMessage['OtherTDS'];
            this.othersTDS = this.commaseparator.currencySeparatorBD(othersTdsData);

            let totalAdvanceIncomeTax: any;
            totalAdvanceIncomeTax = (result.replyMessage['CarTDS']
              + result.replyMessage['US64TDS']);
       //     console.log('advanceIncomeTax', totalAdvanceIncomeTax);
            this.advanceIncomeTax = this.commaseparator.currencySeparatorBD(totalAdvanceIncomeTax);

            let carAitTdsData = result.replyMessage['CarTDS'];
            this.carAitTds = this.commaseparator.currencySeparatorBD(carAitTdsData);

            let aitus64TdsData = result.replyMessage['US64TDS'];
            this.aitUS64Tds = this.commaseparator.currencySeparatorBD(aitus64TdsData);

            let totalRegularTax: any;
            totalRegularTax = (result.replyMessage['US74TDS']);
      //      console.log('regularTax', totalRegularTax);
            this.regularTax = this.commaseparator.currencySeparatorBD(totalRegularTax);

            this.getTotalRegularPayment()
              .then(() => this.getTaxPaymentData());

            // this.getTaxPaymentData();
          }
          resolve();
        },
          error => {
            reject();
            this.getTaxPaymentData();
      //      console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });

    });
  }

  getTotalRegularPayment(): Promise<void> {
    let requestData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/payment/get_client_payment_summary')
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {
      //      console.log('totalPayment', result.replyMessage["totalPayment"]);
            this.regularPayment = result.replyMessage["totalPayment"];
            this.regularPayment = this.commaseparator.currencySeparatorBD(this.regularPayment);
          }
          resolve();
        },
          error => {
            reject();
            this.getTaxPaymentData();
       //     console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });

    });
  }

  getIbasData() {
    this.httpClient.get("assets/IbasSalary/" + this.userTin + ".json").subscribe(data => {
      // console.log('Ibas Data:', data);
      if (data != null) {
        this.isSourceTaxShow = true;
        this.isSourceTaxChecked = true;
        let IbasData: any;
        IbasData = data["tds"]["50"];
        this.ibas50 = this.commaseparator.currencySeparatorBD(IbasData);
        // console.log('ibas 50', this.ibas50);
        this.sourceTax = this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(this.ibas50, 0));
        this.getTaxPaymentData();
      }
      else {
        this.getTaxPaymentData();
      }
    },
      error => {
    //    console.log(error['error'].errorMessage);
        this.getTaxPaymentData();
      });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57))
    if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57)) {
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
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue(getAdditional_info_data.anyTaxRebate == true ? '1' : '0');
          this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue(getAdditional_info_data.incomeExceedFourLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue(getAdditional_info_data.shareholder == true ? '1' : '0');
          this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue(getAdditional_info_data.grossWealthOverFortyLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isOwnmotorCar.setValue(getAdditional_info_data.ownMotorCar == true ? '1' : '0');
          this.additionalInformationForm.controls.isHaveHouseProperty.setValue(getAdditional_info_data.houseProperty == true ? '1' : '0');
          this.additionalInformationForm.controls.isIT10BNotMandatory.setValue(getAdditional_info_data.mandatoryITTenB == true ? '1' : '0');

          this.hasAnyIncome = getAdditional_info_data.anyIncome;

          if (!this.hasAnyIncome) {
            this.isReturnSubmitBtnDisabled = true;
            this.isPayNowBtnDisabled = true;
          }
        }

        if (!getAdditional_info_data.anyIncome) {
          this.mainNavbarList.addSelectedMainNavbar(this.additionalInformationForm.value);
        }
        else {
          this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Tax and Payment');
        }

        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }

  getTaxPaymentData() {

    //#region RequestBody
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    //#endregion
    // console.log('reqbody', reqBody);

    this.apiService.get(this.serviceUrl + 'api/tax_payment')
      .subscribe(result => {
        // console.log(result);
        if (JSON.stringify(result.replyMessage) != '{}') {
          console.log('All TaxPaymentData=', result.replyMessage);
          this.taxPaymentGetData = result.replyMessage;
          // console.log(this.taxPaymentGetData);

          this.totalSalaryAmt = this.taxPaymentGetData.poti_SAL_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_SAL_Amt)) : 0;
          this.totalInterestSecurityAmt = this.taxPaymentGetData.poti_IOS_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_IOS_Amt)) : 0;
          this.totalHousePropertyAmt = this.taxPaymentGetData.poti_IFHP_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_IFHP_Amt)) : 0;
          this.totalIncomeFromOtherSourcesAmt = this.taxPaymentGetData.poti_IFOS_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_IFOS_Amt)) : 0;
          this.totalCapitalGainAmt = this.taxPaymentGetData.poti_CG_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_CG_Amt)) : 0;
          this.totalAgriculture = this.taxPaymentGetData.poti_AI_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_AI_Amt)) : 0;
          this.totalBusinessOrProfession = this.taxPaymentGetData.poti_IFBP_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_IFBP_Amt)) : 0;
          this.totalFirm_AoP = this.taxPaymentGetData.poti_SOIFFAOP_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_SOIFFAOP_Amt)) : 0;
          this.totalSpouse_Income = this.taxPaymentGetData.poti_IFMSUS_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_IFMSUS_Amt)) : 0;
          this.totalForeign_Income = this.taxPaymentGetData.poti_FI_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_FI_Amt)) : 0;
          this.total_Income_Amt = this.taxPaymentGetData.poti_Total_Income_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_Total_Income_Amt)) : 0;
          this.total_Tax_Exempted_Income_Amt = this.taxPaymentGetData.poti_Tax_Exempted_Income_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.poti_Tax_Exempted_Income_Amt)) : 0;
          this.total_Gross_Tax_Before_Tax_Rebate_Amt = this.taxPaymentGetData.tc_Gross_Tax_Before_Tax_Rebate_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Gross_Tax_Before_Tax_Rebate_Amt)) : 0;
          this.total_Tax_Rebate_Amt = this.taxPaymentGetData.tc_Tax_Rebate_Amt != 'NaN' ? (this.taxPaymentGetData.tc_Tax_Rebate_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Tax_Rebate_Amt)) : 0) : 0;
          this.total_Net_Tax_After_Tax_Rebate_Amt = this.taxPaymentGetData.tc_Net_Tax_After_Tax_Rebate_Amt != 'NaN' ? (this.taxPaymentGetData.tc_Net_Tax_After_Tax_Rebate_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Net_Tax_After_Tax_Rebate_Amt)) : 0) : 0;
          this.total_Min_Tax_Amt = this.taxPaymentGetData.tc_Min_Tax_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Min_Tax_Amt)) : 0;
          this.total_Net_Wealth_Surcharge_Amt = this.taxPaymentGetData.tc_Net_Wealth_Surcharge_Amt != 'NaN' ? (this.taxPaymentGetData.tc_Net_Wealth_Surcharge_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Net_Wealth_Surcharge_Amt)) : 0) : 0;
          this.total_Interest_or_Any_Other_Amt = this.taxPaymentGetData.tc_Interest_or_Any_Other_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Interest_or_Any_Other_Amt)) : 0;
          this.total_Payable_Amt = this.taxPaymentGetData.tc_Total_Payable_Amt != 'NaN' ? (this.taxPaymentGetData.tc_Total_Payable_Amt ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Total_Payable_Amt)) : 0) : 0;

          //#region Tax Computation Section
          this.TC_GTBTR_Tax_on_Regular_Income = this.taxPaymentGetData.tc_GTBTR_Tax_on_Regular_Income ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_GTBTR_Tax_on_Regular_Income)) : 0;
          this.TC_GTBTR_Tax_on_Income_us_82c = this.taxPaymentGetData.tc_GTBTR_Tax_on_Income_us_82c ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_GTBTR_Tax_on_Income_us_82c)) : 0;
          this.TC_GTBTR_Tax_on_SRO_Income = this.taxPaymentGetData.tc_GTBTR_Tax_on_SRO_Income ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_GTBTR_Tax_on_SRO_Income)) : 0;

          this.TC_Total_Investment_Rebate = this.taxPaymentGetData.tc_Total_Investment_Rebate ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_Total_Investment_Rebate)) : 0;
          this.TC_TR_on_Firm_AoP_Share = this.taxPaymentGetData.tc_TR_on_Firm_AoP_share != 'NaN' ? (this.taxPaymentGetData.tc_TR_on_Firm_AoP_share ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_TR_on_Firm_AoP_share)) : 0) : 0;
          this.TC_TR_on_Foreign_Tax_Relief = this.taxPaymentGetData.tc_TR_on_Foreign_Tax_Relief != 'NaN' ? (this.taxPaymentGetData.tc_TR_on_Foreign_Tax_Relief ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_TR_on_Foreign_Tax_Relief)) : 0) : 0;
          this.TC_TR_Other_Rebate = this.taxPaymentGetData.tc_TR_Other_Rebate ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_TR_Other_Rebate)) : 0;

          this.TC_MT_for_Income_us_82c_2 = this.taxPaymentGetData.tc_MT_for_Income_us_82c_2 ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_MT_for_Income_us_82c_2)) : 0;
          this.TC_MT_for_Income_us_82c_4 = this.taxPaymentGetData.tc_MT_for_Income_us_82c_4 ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_MT_for_Income_us_82c_4)) : 0;
          this.TC_MT_for_Location_of_Income = this.taxPaymentGetData.tc_MT_for_Location_of_Income ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_MT_for_Location_of_Income)) : 0;

          this.TC_S_Net_Wealth_Surcharge = this.taxPaymentGetData.tc_S_Net_Wealth_Surcharge != 'NaN' ? (this.taxPaymentGetData.tc_S_Net_Wealth_Surcharge ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_S_Net_Wealth_Surcharge)) : 0) : 0;
          this.TC_S_Tobacco_Surcharge = this.taxPaymentGetData.tc_S_Tobacco_Surcharge ? this.commaseparator.currencySeparatorBD(Math.round(this.taxPaymentGetData.tc_S_Tobacco_Surcharge)) : 0;
          //#endregion


          //new added by nazmul
          this.taxComputationForm = new FormGroup({
            tax_on_regular_income: new FormControl(this.TC_GTBTR_Tax_on_Regular_Income),
            isTORI_changes: new FormControl(false),
            tax_on_income_82c: new FormControl(this.TC_GTBTR_Tax_on_Income_us_82c),
            isTOI82c_changes: new FormControl(false),
            tax_on_sro_income: new FormControl(this.TC_GTBTR_Tax_on_SRO_Income),
            isTOSROI_changes: new FormControl(false),
            summery_GrossTaxbeforeTaxRebate: new FormControl(this.total_Gross_Tax_Before_Tax_Rebate_Amt),

            //Tax Rebate
            on_investment: new FormControl(this.TC_Total_Investment_Rebate),
            isOI_changes: new FormControl(false),
            on_firm_aop_share: new FormControl(this.TC_TR_on_Firm_AoP_Share),
            isFA_changes: new FormControl(false),
            foreign_tax_relief: new FormControl(this.TC_TR_on_Foreign_Tax_Relief),
            isFTR_changes: new FormControl(false),
            other_rebate: new FormControl(this.TC_TR_Other_Rebate),
            isOR_changes: new FormControl(false),
            summery_TaxRebate: new FormControl(this.total_Tax_Rebate_Amt),


            //Net Tax after Tax Rebate
            netTaxAfterTaxRebate: new FormControl(this.total_Net_Tax_After_Tax_Rebate_Amt),
            //Minimum Tax
            for_income_us_82c: new FormControl(this.TC_MT_for_Income_us_82c_2),
            isFIUS82C_changes: new FormControl(false),
            on_gross_receipt: new FormControl(this.TC_MT_for_Income_us_82c_4),
            isOGR_changes: new FormControl(false),
            for_location_of_income: new FormControl(this.TC_MT_for_Location_of_Income),
            isFLOI_changes: new FormControl(false),
            summery_MinimumTax: new FormControl(this.total_Min_Tax_Amt),

            //Surcharge
            net_wealth_surcharge: new FormControl(this.TC_S_Net_Wealth_Surcharge),
            isNWS_changes: new FormControl(false),
            tobacco_surcharge: new FormControl(this.TC_S_Tobacco_Surcharge),
            isTS_changes: new FormControl(false),
            summery_Surcharge: new FormControl(this.total_Net_Wealth_Surcharge_Amt),

            //Any Other Amount
            summery_any_other_amount: new FormControl(this.total_Interest_or_Any_Other_Amt),
            isAOA_changes: new FormControl(false),

            total_amount_payable: new FormControl(this.total_Payable_Amt)
          });
          //new added end

          // this.totalSalaryAmt=this.commaseparator.removeComma(this.totalSalaryAmt,0);
          // this.totalInterestSecurityAmt=this.commaseparator.removeComma(this.totalInterestSecurityAmt,0);
          // this.totalHousePropertyAmt=this.commaseparator.removeComma(this.totalHousePropertyAmt,0);
          // this.totalAgriculture=this.commaseparator.removeComma(this.totalAgriculture,0);
          // this.totalBusinessOrProfession=this.commaseparator.removeComma(this.totalBusinessOrProfession,0);
          // this.totalCapitalGainAmt=this.commaseparator.removeComma(this.totalCapitalGainAmt,0);
          // this.totalIncomeFromOtherSourcesAmt=this.commaseparator.removeComma(this.totalIncomeFromOtherSourcesAmt,0);
          // this.totalFirm_AoP=this.commaseparator.removeComma(this.totalFirm_AoP,0);
          // this.totalSpouse_Income=this.commaseparator.removeComma(this.totalSpouse_Income,0);
          // this.totalForeign_Income=this.commaseparator.removeComma(this.totalForeign_Income,0);

          //#region Set OFF
          localStorage.setItem('total_amount_payable', this.total_Payable_Amt);
          if (this.taxPaymentGetData.set_Off_Flag == 1) {
            this.isSetOffShown = true;
          }

          if (this.totalSalaryAmt != 0) {
            this.isSetOffSalShown = true;
          }
          if (this.totalInterestSecurityAmt != 0) {
            this.isSetOffIosShown = true;
          }
          if (this.totalHousePropertyAmt != 0) {
            this.isSetOffIfhpShown = true;
          }
          if (this.totalAgriculture != 0) {
            this.isSetOffAiShown = true;
          }
          if (this.totalBusinessOrProfession != 0) {
            this.isSetOffIfbpShown = true;
          }
          if (this.totalCapitalGainAmt != 0) {
            this.isSetOffCgShown = true;
          }
          if (this.totalIncomeFromOtherSourcesAmt != 0) {
            this.isSetOffIfosShown = true;
          }
          if (this.totalFirm_AoP != 0) {
            this.isSetOffFirm_AopShown = true;
          }
          if (this.totalSpouse_Income != 0) {
            this.isSetOffMinor_SpouseShown = true;
          }
          if (this.totalForeign_Income != 0) {
            this.isSetOffAIShown = true;
          }

          this.Set_Off_Head_Sal_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Sal_After_Set_Off);
          // this.Set_Off_Head_Sal_Loss_Not_Set_Off=(this.Set_Off_Head_Sal_After_Set_Off-this.totalSalaryAmt);
          this.Set_Off_Head_Sal_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Sal_Loss_Not_Set_Off);

          this.Set_Off_Head_Ios_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ios_After_Set_Off);
          // this.Set_Off_Head_Ios_Loss_Not_Set_Off=(this.Set_Off_Head_Ios_After_Set_Off-this.totalInterestSecurityAmt);
          this.Set_Off_Head_Ios_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ios_Loss_Not_Set_Off);

          this.Set_Off_Head_Ifhp_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ifhp_After_Set_Off);
          // this.Set_Off_Head_Ifhp_Loss_Not_Set_Off=(this.Set_Off_Head_Ifhp_After_Set_Off-this.totalHousePropertyAmt);
          this.Set_Off_Head_Ifhp_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ifhp_Loss_Not_Set_Off);

          this.Set_Off_Head_Ai_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ai_After_Set_Off);
          // this.Set_Off_Head_Ai_Loss_Not_Set_Off=(this.Set_Off_Head_Ai_After_Set_Off-this.totalAgriculture);
          this.Set_Off_Head_Ai_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ai_Loss_Not_Set_Off);

          this.Set_Off_Head_Ifbp_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ifbp_After_Set_Off);
          // this.Set_Off_Head_Ifbp_Loss_Not_Set_Off=(this.Set_Off_Head_Ifbp_After_Set_Off-this.totalBusinessOrProfession);
          this.Set_Off_Head_Ifbp_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ifbp_Loss_Not_Set_Off);


          this.Set_Off_Head_Cg_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Cg_After_Set_Off);
          // this.Set_Off_Head_Cg_Loss_Not_Set_Off=(this.Set_Off_Head_Cg_After_Set_Off-this.totalCapitalGainAmt);
          this.Set_Off_Head_Cg_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Cg_Loss_Not_Set_Off);

          this.Set_Off_Head_Ifos_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ifos_After_Set_Off);
          // this.Set_Off_Head_Ifos_Loss_Not_Set_Off=(this.Set_Off_Head_Ifos_After_Set_Off-this.totalIncomeFromOtherSourcesAmt);
          this.Set_Off_Head_Ifos_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Ifos_Loss_Not_Set_Off);

          this.Set_Off_Head_Firm_Aop_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Firm_Aop_After_Set_Off);
          // this.Set_Off_Head_Firm_Aop_Loss_Not_Set_Off=(this.Set_Off_Head_Firm_Aop_After_Set_Off-this.totalFirm_AoP);
          this.Set_Off_Head_Firm_Aop_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Firm_Aop_Loss_Not_Set_Off);

          this.Set_Off_Head_Minor_Spouse_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Minor_Spouse_After_Set_Off);
          // this.Set_Off_Head_Minor_Spouse_Loss_Not_Set_Off=(this.Set_Off_Head_Minor_Spouse_After_Set_Off-this.totalSpouse_Income);
          this.Set_Off_Head_Minor_Spouse_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_Minor_Spouse_Loss_Not_Set_Off);

          this.Set_Off_Head_FI_After_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_FI_After_Set_Off);
          // this.Set_Off_Head_FI_Loss_Not_Set_Off=(this.Set_Off_Head_FI_After_Set_Off-this.totalForeign_Income);
          this.Set_Off_Head_FI_Loss_Not_Set_Off = this.commaseparator.currencySeparatorBD(this.taxPaymentGetData.set_Off_Head_FI_Loss_Not_Set_Off);


          //#endregion

          localStorage.setItem('TaxExemptedIncome', this.total_Tax_Exempted_Income_Amt ? this.commaseparator.removeComma(this.total_Tax_Exempted_Income_Amt, 0) : '0');
          localStorage.setItem('TotalIncome', this.total_Income_Amt ? this.commaseparator.removeComma(this.total_Income_Amt, 0) : '0');

          // this.paymentSuccessCheck();
          this.calculatePayable();

        }
      },
        error => {
      //    console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  calculatePayable() {
    // debugger;
    this.totalVerifiedAmt = 0;
    this.refundableAmt = 0;
    this.payableAmtt = 0;
    this.payable = 0;

    let sTax: any;
    let adTax: any;
    let rTax: any;
    let rPayment: any;

    if (parseInt(this.sourceTax) > 0) {
      sTax = this.commaseparator.removeComma(this.sourceTax, 0);
    }
    else {
      sTax = 0;
    }

    if (parseInt(this.advanceIncomeTax) > 0) {
      adTax = this.commaseparator.removeComma(this.advanceIncomeTax, 0);
    }

    else {
      adTax = 0;
    }

    if (parseInt(this.regularTax) > 0) {
      rTax = this.commaseparator.removeComma(this.regularTax, 0);
    }

    else {
      rTax = 0;
    }

    if (parseInt(this.regularPayment) > 0) {
      rPayment = this.commaseparator.removeComma(this.regularPayment, 0);
    }
    else {
      rPayment = 0;
    }

    this.totalVerifiedAmt = parseInt(sTax) + parseInt(adTax) + parseInt(rTax) + parseInt(rPayment) + this.refundAdjustment;

    this.totalVerifiedAmt = this.commaseparator.currencySeparatorBD(this.totalVerifiedAmt);

    // console.log('total payable amt', this.total_Payable_Amt);
    // console.log('totalVerifiedAmt', this.totalVerifiedAmt);

    //#region new Rule for Refundable & Payable

    if (parseInt(this.TC_MT_for_Income_us_82c_2) > 0) {
      this.A = this.commaseparator.removeComma(this.TC_MT_for_Income_us_82c_2, 0);
    } else {
      this.A = 0;
    }
    // this.A = this.TC_MT_for_Income_us_82c_2;
    this.X = parseInt(this.commaseparator.removeComma(this.total_Payable_Amt, 0)) ? parseInt(this.commaseparator.removeComma(this.total_Payable_Amt, 0)) : 0;
    this.B = (this.X - this.A);
    this.P = 0;
    this.Y = parseInt(this.commaseparator.removeComma(this.totalVerifiedAmt, 0)) ? parseInt(this.commaseparator.removeComma(this.totalVerifiedAmt, 0)) : 0;
    this.Q = (this.Y - this.P);

    // debugger;
    this.calRefundable();

    if (parseInt(this.commaseparator.removeComma(this.R, 0)) > 0) {
      this.T = 0;
    }
    else if (parseInt(this.commaseparator.removeComma(this.R, 0)) == 0 && this.P > this.B) {
      this.T = (this.A - this.Q);
    }
    else {
      this.T = (this.X - this.Y);
    }

    // debugger;
    this.buttonEnableDisableFunction();

    // debugger;
    this.taxAndPaymentForm.get('payable_Amount').setValue(this.commaseparator.currencySeparatorBD(this.T));

    localStorage.setItem('RefundableAmount', this.R ? this.commaseparator.removeComma(this.R, 0) : '0');
    localStorage.setItem('payable', this.T);

    //#endregion

    //#region previous Rule for Refundable & Payable

    // this.payableAmtt = (this.total_Payable_Amt - this.totalVerifiedAmt);
    // if (this.payableAmtt <= 0) {
    //   this.refundableAmt = -1 * this.payableAmtt;
    //   localStorage.setItem('RefundableAmount', this.refundableAmt);
    //   this.isReturnSubmitBtnDisabled = true;
    //   this.isPayNowBtnDisabled = true;
    //   localStorage.setItem('payable', this.payable);
    //   this.taxAndPaymentForm.patchValue({
    //     payable_Amount: 0,
    //   });
    // } else {
    //   this.taxAndPaymentForm.patchValue({
    //     payable_Amount: this.payableAmtt,
    //   });
    //   this.isReturnSubmitBtnDisabled = false;
    //   this.isPayNowBtnDisabled = false;
    //   this.payable = this.payableAmtt;
    //   localStorage.setItem('payable', this.payable);
    // }

    //#endregion

  }

  buttonEnableDisableFunction() {
    //debugger;
    if (this.T === 0) {
      this.isPayNowBtnDisabled = true;
      this.isReturnSubmitBtnDisabled = false;
    }
    else {
      this.isPayNowBtnDisabled = false;
      this.isReturnSubmitBtnDisabled = true;
    }
  }

  calRefundable() {
    //debugger;
    if (this.Y > this.X && this.P <= this.B) {
      this.isRefundBtnActive = true;
      this.R = (this.Y - this.X);
    }
    else if (this.Q > this.A && this.P > this.B) {
      this.isRefundBtnActive = true;
      this.R = (this.Q - this.A);
    }
    else {
      this.R = 0;
    }

    this.R = this.commaseparator.currencySeparatorBD(this.R);
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
    this.lengthOfheads = this.selectedNavbar.length;
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
  }

  onSourceTaxChange(e) {
    if (e.target.checked) {
      this.isSourceTaxChecked = true;
      this.isSourceTaxShow = true;
    }
    else {
      this.isSourceTaxChecked = false;
      this.isSourceTaxShow = false;
    }
  }

  onAdvanceIncomeTaxChange(e) {
    if (e.target.checked) {
      this.isAdvanceIncomeTaxChecked = true;
      this.isAdvanceIncomeTaxShow = true;
    }
    else {
      this.isAdvanceIncomeTaxChecked = false;
      this.isAdvanceIncomeTaxShow = false;

      this.isPaidCarOwnershipTaxChecked = false;
      this.isPaidCarOwnershipShow = false;

      this.isPaidRegularAITChecked = false;
      this.isRegularAITShow = false;
    }
  }

  onRegularPaymentChange(e) {
    if (e.target.checked) {
      this.isRegularPaymentChecked = true;
      this.isRegularPaymentShow = true;
    }
    else {
      this.isRegularPaymentChecked = false;
      this.isRegularPaymentShow = false;
    }
  }

  onRefundAdjustmentChange(e) {
    if (e.target.checked) {
      this.isRefundAdjustmentChecked = true;
      this.isRefundAdjustmentShow = true;
    }
    else {
      this.isRefundAdjustmentChecked = false;
      this.isRefundAdjustmentShow = false;
    }
  }

  onPaidCarOwnershipChange(e) {
    if (e.target.checked) {
      this.isPaidCarOwnershipTaxChecked = true;
      this.isPaidCarOwnershipShow = true;
    }
    else {
      this.isPaidCarOwnershipTaxChecked = false;
      this.isPaidCarOwnershipShow = false;
    }
  }

  onPaidRegularAITChange(e) {
    if (e.target.checked) {
      this.isPaidRegularAITChecked = true;
      this.isRegularAITShow = true;
    }
    else {
      this.isPaidRegularAITChecked = false;
      this.isRegularAITShow = false;
    }
  }

  goToSalaryPage() {
    if (this.formGroup.controls.salaries.value == true) {
      this.router.navigate(["/user-panel/heads-of-income"]);
    }
  }
  goToIOSPage() {
    if (this.formGroup.controls.security.value == true) {
      this.router.navigate(["/user-panel/interest-on-securities"]);
    }
  }
  goToIFHPPage() {
    if (this.formGroup.controls.houseProperty.value == true) {
      this.router.navigate(["/user-panel/house-property"]);
    }
  }
  goToAIPage() {
    if (this.formGroup.controls.agriculture.value == true) {
      this.router.navigate(["/user-panel/agriculture"]);
    }
  }
  goToIFBPPage() {
    if (this.formGroup.controls.businessProfession.value == true) {
      this.router.navigate(["/user-panel/business-or-profession"]);
    }
  }
  goToCGPage() {
    if (this.formGroup.controls.capital.value == true) {
      this.router.navigate(["/user-panel/capital-gain"]);
    }
  }
  goToIFOSPage() {
    if (this.formGroup.controls.others.value == true) {
      this.router.navigate(["/user-panel/income-from-other-sources"]);
    }
  }
  goToFirmEtcPage() {
    if (this.formGroup.controls.firm.value == true || this.formGroup.controls.aop.value == true || this.formGroup.controls.outsideIncome.value == true || this.formGroup.controls.spouseChild.value == true) {
      this.router.navigate(["/user-panel/firm-etc"]);
    }
  }

  //#region  Payment Gateway
  onPayableAmount() {
    if (parseFloat(this.taxAndPaymentForm.value.payable_Amount) > 0) {
      this.isPayableAmountEmpty = false;
    }
    this.taxAndPaymentForm.patchValue({
      payable_Amount: this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(this.taxAndPaymentForm.get('payable_Amount').value, 0)),
    });
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    // if (Math.round(this.taxAndPaymentForm.value.payable_Amount) == 0 || this.taxAndPaymentForm.value.payable_Amount === '' || this.taxAndPaymentForm.value.payable_Amount === null) {
    //   this.isPayableAmountEmpty = true;
    //   this.toastr.warning('Your payable amount is empty!');
    //   return;
    // }
    this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
    this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
    this.taxAndPaymentForm.controls.otherGateway.setValue(false);
    this.modalRef = this.modalService.show(closetabpopup, { class: 'modal-lg modal-dialog-centered' });
  }
  //#endregion

  onCheckePaymentGateway(event: any) {
    if (event.target.checked) {
      this.isChkePayment = true;
      this.taxAndPaymentForm.controls.ePaymentGateway.setValue(true);
      this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
      this.taxAndPaymentForm.controls.otherGateway.setValue(false);

    } else {
      this.isChkePayment = false;
      this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
      this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
      this.taxAndPaymentForm.controls.otherGateway.setValue(false);
    }
  }

  onCheckaChalanGateway(event: any) {
    if (event.target.checked) {
      this.isChkaChalan = true;
      this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
      this.taxAndPaymentForm.controls.aChalanGateway.setValue(true);
      this.taxAndPaymentForm.controls.otherGateway.setValue(false);

    } else {
      this.isChkaChalan = false;
      this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
      this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
      this.taxAndPaymentForm.controls.otherGateway.setValue(false);
    }
  }

  onCheckOtherGateway(event: any) {
    if (event.target.checked) {
      this.isChkotherPayment = true;
      this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
      this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
      this.taxAndPaymentForm.controls.otherGateway.setValue(true);

    } else {
      this.isChkotherPayment = false;
      this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
      this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
      this.taxAndPaymentForm.controls.otherGateway.setValue(false);
    }
  }

  continueToPaymentValidaton() {
    if (!this.taxAndPaymentForm.value.ePaymentGateway && !this.taxAndPaymentForm.value.aChalanGateway && !this.taxAndPaymentForm.value.otherGateway) {
      this.toastr.warning('Please select any payment method!', '', {
        timeOut: 3000,
      });
      return false;
    }
    // if (this.taxAndPaymentForm.value.ePaymentGateway) {
    //   this.toastr.warning('Sonali Chalan Gateway not Integrated Yet.', '', {
    //     timeOut: 3000,
    //   });
    //   return false;
    // }
    // if (this.taxAndPaymentForm.value.aChalanGateway) {
    //   this.toastr.warning('A Chalan Gateway not Integrated Yet', '', {
    //     timeOut: 1000,
    //   });
    //   this.modalRef.hide();
    //   return false;
    // }
    if (this.taxAndPaymentForm.value.otherGateway) {
      this.toastr.warning('Other Payment Gateway not Integrated Yet.', '', {
        timeOut: 3000,
      });
      this.modalRef.hide();
      return false;
    }
    return true;
  }
  continuePayment() {
    this.isContinuePayment = true;
    if (!this.continueToPaymentValidaton()) { return; }
    this.paymentRequestJson = {
      "TIN": this.userTin,
      "AssessmentYear": "2021-2022",
      "Amount": this.taxAndPaymentForm.value.payable_Amount ? parseInt(this.commaseparator.removeComma(this.taxAndPaymentForm.value.payable_Amount, 0)) : 0
    }
    this.eReturnSpinner.start();
    if (this.taxAndPaymentForm.value.ePaymentGateway) {
      this.apiService.post(this.serviceUrl + 'api/generate_request_id_sonali', this.paymentRequestJson)
        .subscribe(result => {
          if (JSON.stringify(result) != '{}') {
            // console.log(result);
            if (result.success) {
              this.eReturnSpinner.stop();
              this.isContinuePayment = false;
              window.open(result.replyMessage, '_blank');
              this.modalRef.hide();
              this.taxAndPaymentForm.controls.ePaymentGateway.setValue(false);
            }

          }
        },
          error => {
            this.eReturnSpinner.stop();
            this.modalRef.hide();
            this.isContinuePayment = false;
         //   console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
    else if (this.taxAndPaymentForm.value.aChalanGateway) {
      this.apiService.post(this.serviceUrl + 'api/generate_request_id_achallan', this.paymentRequestJson)
        .subscribe(result => {
          if (JSON.stringify(result) != '{}') {
            // console.log(result);
            if (result.success) {
              this.eReturnSpinner.stop();
              this.isContinuePayment = false;
              window.open(result.replyMessage, '_blank');
              this.modalRef.hide();
              this.taxAndPaymentForm.controls.aChalanGateway.setValue(false);
            }

          }
        },
          error => {
            this.eReturnSpinner.stop();
            this.modalRef.hide();
            this.isContinuePayment = false;
         //   console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }

  }

  paymentSuccessCheck() {
    this.paymentRequestJson =
    {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    this.apiService.get(this.serviceUrl + 'api/payment/get_client_payment')
      .subscribe(result => {
        // debugger;
        if (JSON.stringify(result) != '{}') {
          // console.log('payment status result', result);
          let paymentData = result["replyMessage"]["paymentDataList"];
          // console.log('paymentData', paymentData);
          if (result.success) {
            // this.isPaymentSuccessForThisTIN = true;
            // this.isReturnSubmitBtnDisabled = true;
            // this.isRegularPaymentChecked = true;
            // this.isRegularPaymentShow = true;

            // this.isPayNowBtnDisabled=true;

            let PayAmount = 0; let dateOfPayment: any;
            paymentData.forEach(element => {
              PayAmount = PayAmount + element.amount;
              dateOfPayment = moment(element.dateTime, 'DD-MM-YYYY');
              let oRegularPayment = {
                "dateOfPayment": this.datepipe.transform(dateOfPayment, 'dd-MM-yyyy'),
                "paymentRef": element.transactionId,
                "amount": element.amount
              }
              this.allRegularPayments.push(oRegularPayment);
            });
            // this.regularPayment = this.commaseparator.currencySeparatorBD(PayAmount);
            // this.calculatePayable();
          }
        }
      },
        error => {
          // debugger;
          if (error['error'].errorMessage === 'Payment not found!') {
            this.isPaymentSuccessForThisTIN = false;
          }
      //    console.log(error['error'].errorMessage);
        });
    // console.log('payment status result++', this.isPaymentSuccessForThisTIN);

  }

  makePayNowTestingPurpose() {
    localStorage.removeItem('amount');
    localStorage.setItem('amount', this.taxAndPaymentForm.value.payable_Amount);
    this.router.navigate(["/user-panel/payment"]);
    // let max = 9999999999999;
    // let accCode = Math.floor(Math.random() * max) + 1;

    // let tt = 999999999;
    // let chalanNo = Math.floor(Math.random() * tt) + 1;
    // let date = new Date();
    // let yyy = moment(date, 'DD-MM-YYYY');
    // let day = this.datepipe.transform(yyy, 'dd-MM-yyyy');
    // let time = date.toLocaleTimeString();

    // let Idd = 9999999999999999;
    // let transactionIdd = Math.floor(Math.random() * Idd) + 1;

    // let paymentRequestData = {
    //   "accountCode": accCode,
    //   "amount": this.taxAndPaymentForm.value.payable_Amount ? this.taxAndPaymentForm.value.payable_Amount : 0,
    //   "assessmentYear": "2021-2022",
    //   "chalanCopyURL": "https: //nbr.sblesheba.com/IncomeTax/Home/Voucher/" + accCode,
    //   "chalanNo": "I" + chalanNo,
    //   "dateTime": day + " " + time,
    //   "paymentInfo": "SBL",
    //   "paymentMethod": "SBL",
    //   "paymentType": "Tax with Return",
    //   "taxpayerOrigin": "eFilling",
    //   "tin": this.userTin,
    //   "transactionId": transactionIdd
    // }

    // console.log('PaymentRequestData', paymentRequestData);

    // this.eReturnSpinner.start();
    // this.apiService.post(this.serviceUrl + 'api/payment/payment_data', paymentRequestData)
    //   .subscribe(result => {
    //     if (JSON.stringify(result.replyMessage) != '{}') {
    //       this.router.navigateByUrl("payment-success/" + this.userTin);
    //     }
    //     this.eReturnSpinner.stop();
    //   },
    //     error => {
    //       this.eReturnSpinner.stop();
    //       console.log(error['error'].errorMessage);
    //       this.toastr.error(error['error'].errorMessage, '', {
    //         timeOut: 1000,
    //       });
    //     });
  }

  onBackPage() {
    this.selectedNavbar.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/tax-and-payment') {
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

  gotoReturnView() {
    this.selectedNavbar.forEach((Value, i) => {
      // debugger;
      if (Value['link'] == '/user-panel/tax-and-payment') {
        this.router.navigate(["/user-panel/post-sub-return-view"]);
      }
    });
  }

  gotoClaimRefundPage() {
    this.router.navigate(["/user-panel/get-refund"]);
  }


  async goToEledger() {
    this.token = localStorage.getItem('token');
    //previous

    // let msg = {
    //   "token": this.token,
    //   "sourceUrl": '/user-panel/tax-and-payment'
    // }
    // const frame = document.getElementById('ifr');
    // if (this.isIFrame(frame) && frame.contentWindow) {
    //   await frame.contentWindow.postMessage(msg, this.eLedgerPortalBaseUrl);
    // }
    // window.location.href = 'http://103.92.84.210:82/#/pages/dashboard';
    // window.location.href = this.eLedgerPortalBaseUrl + '/#/pages/home';

    //newly added
   //window.location.href = this.eLedgerPortalBaseUrl + '/#/eReturn-login' + '?' + 'session_id=' + btoa(this.token);
   this.getRequestSessionID();

   
  }

  getRequestSessionID()
  {
    this.eReturnSpinner.start();
    this.apiService.get(this.serviceUrl + 'api/session-guid/'+this.refresh_Token)
      .subscribe(result => {
           if(result.success)
           {
            this.requestSessionID = result.replyMessage;
            window.location.href = this.eLedgerPortalBaseUrl + '/#/eReturn-login' + '?' + 'session_id=' + result.replyMessage;
           }
          
        this.eReturnSpinner.stop();
      },
        error => {
          this.eReturnSpinner.stop();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 1000,
          });
        });
  }

  // getNewTokenForLedger()
  // {
  //   this.apiService.get(this.eLedgerUrl + 'api/redirect/'+this.requestSessionID)
  //     .subscribe(result => {
  //       if (JSON.stringify(result.replyMessage) != '{}') {
  //          localStorage.removeItem('token');
  //          localStorage.setItem('token',result.replyMessage);
  //          window.location.href = this.eLedgerPortalBaseUrl + '/#/eReturn-login' + '?' + 'session_id=' + result.replyMessage;
  //       }
  //       //this.eReturnSpinner.stop();
  //     },
  //       error => {
  //         //this.eReturnSpinner.stop();
  //         console.log(error['error'].errorMessage);
  //         this.toastr.error(error['error'].errorMessage, '', {
  //           timeOut: 1000,
  //         });
  //       });
  // }

  goToSource() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.yourIFrameUrl);
  }

  onRegularPaymentClick(event: any, regularPaymentModalShow) {
    this.changeRegularPayment(regularPaymentModalShow);
  }

  changeRegularPayment(regularPaymentModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(regularPaymentModalShow, { class: 'modal-lg' });
  }

  close_RegularPayment() {
    this.modalRef.hide();
  }

  getTaxExemptedBreakdownDetails() {
    let requestData =
    {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    this.apiService.get(this.serviceUrl + 'api/user-panel/get_exemption_breakdown')
      .subscribe(result => {
        // debugger;
        if ((result.replyMessage).length > 0) {
          // console.log('exempted breakdown data', result);
          let exemptedBreakdownGetData: any;
          exemptedBreakdownGetData = result.replyMessage;
          // console.log('breakdown', exemptedBreakdownGetData);

          // here, we use multiple foreach loop to serialize data like salary 1st position e thakbe, then IOS second position e thakbe.
          // backend theke data ta serialize kore pathano hoy nai. Thats why we use multiple foreach loop.

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_SAL_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Salary",
                  "amount": element.taxableIncome,
                },
              )
            }
          });
          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_IOS_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Interest on Securities",
                  "amount": element.taxableIncome,
                },
              )
            }
          });

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_IFHP_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Income from House Property",
                  "amount": element.taxableIncome,
                },
              )
            }
          });

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_AI_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Agricultural Income",
                  "amount": element.taxableIncome,
                },
              )
            }
          });

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_IFBP_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Income from Business or Profession",
                  "amount": element.taxableIncome,
                },
              )
            }
          });

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_IFCG_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Capital Gains",
                  "amount": element.taxableIncome,
                },
              )
            }
          });

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_IFOS_EXEMPTED' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Income from Other Sources",
                  "amount": element.taxableIncome,
                },
              )
            }
          });

          exemptedBreakdownGetData.forEach(element => {
            if (element.titleKey === 'CAL_TAX_EXEMPTED_INCOME' && element.taxableIncome > 0) {
              this.taxExemptedBreakdownList.push(
                {
                  "title": "Tax Exempted Income",
                  "amount": element.taxableIncome,
                },
              )
            }
          });
        }
      },
        error => {
        //  console.log(error['error'].errorMessage);
        });

  }

  addComma(input: any): any {
    return this.commaseparator.currencySeparatorBD(input);
  }


  changeGrossTaxBeforeTaxRebate(event: any, formControlName) {
    let taxOnRegularIncome: any, taxOnIncome82c: any, taxOnSROIncome: any, totalGrossTaxBeforeTaxRebate: any;
    if (formControlName === 'tax_on_regular_income')
      this.taxComputationForm.patchValue(
        {
          tax_on_regular_income: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isTORI_changes: true,
        });

    if (formControlName === 'tax_on_income_82c')
      this.taxComputationForm.patchValue(
        {
          tax_on_income_82c: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isTOI82c_changes: true,
        });
    if (formControlName === 'tax_on_sro_income')
      this.taxComputationForm.patchValue(
        {
          tax_on_sro_income: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isTOSROI_changes: true,
        });

    taxOnRegularIncome = this.taxComputationForm.value.tax_on_regular_income ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tax_on_regular_income, 0)) : 0;
    taxOnIncome82c = this.taxComputationForm.value.tax_on_income_82c ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tax_on_income_82c, 0)) : 0;
    taxOnSROIncome = this.taxComputationForm.value.tax_on_sro_income ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tax_on_sro_income, 0)) : 0;
    totalGrossTaxBeforeTaxRebate = taxOnRegularIncome + taxOnIncome82c + taxOnSROIncome;
    this.taxComputationForm.patchValue(
      {
        summery_GrossTaxbeforeTaxRebate: this.commaseparator.currencySeparatorBD(totalGrossTaxBeforeTaxRebate),
      });

    this.calculateNetTaxAfterTaxRebate();
    this.calculateTotalAmountPayable();
  }

  changeTaxRebate(event: any, formControlName) {
    let onInvestment: any, onFirmAOPShare: any, foreignTaxRelief: any, otherRebate: any, totalTaxRebate: any;
    if (formControlName === 'on_investment')
      this.taxComputationForm.patchValue(
        {
          on_investment: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isOI_changes: true,
        });
    if (formControlName === 'on_firm_aop_share')
      this.taxComputationForm.patchValue(
        {
          on_firm_aop_share: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isFA_changes: true,
        });
    if (formControlName === 'foreign_tax_relief')
      this.taxComputationForm.patchValue(
        {
          foreign_tax_relief: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isFTR_changes: true,
        });

    if (formControlName === 'other_rebate')
      this.taxComputationForm.patchValue(
        {
          other_rebate: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isOR_changes: true,
        });

    onInvestment = this.taxComputationForm.value.on_investment ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.on_investment, 0)) : 0;
    onFirmAOPShare = this.taxComputationForm.value.on_firm_aop_share ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.on_firm_aop_share, 0)) : 0;
    foreignTaxRelief = this.taxComputationForm.value.foreign_tax_relief ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.foreign_tax_relief, 0)) : 0;
    otherRebate = this.taxComputationForm.value.other_rebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.other_rebate, 0)) : 0;

    totalTaxRebate = onInvestment + onFirmAOPShare + foreignTaxRelief + otherRebate;
    this.taxComputationForm.patchValue(
      {
        summery_TaxRebate: this.commaseparator.currencySeparatorBD(totalTaxRebate),
      });

    this.calculateNetTaxAfterTaxRebate();
    this.calculateTotalAmountPayable();
  }

  changeMinimumTax(event: any, formControlName) {
    let for82c: any, grossReceipt: any, locationOfIncome: any, totalMinimumTax: any;
    if (formControlName === 'for_income_us_82c')
      this.taxComputationForm.patchValue(
        {
          for_income_us_82c: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isFIUS82C_changes: true,
        });
    if (formControlName === 'on_gross_receipt')
      this.taxComputationForm.patchValue(
        {
          on_gross_receipt: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isOGR_changes: true,
        });

    if (formControlName === 'for_location_of_income')
      this.taxComputationForm.patchValue(
        {
          for_location_of_income: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isFLOI_changes: true,
        });

    for82c = this.taxComputationForm.value.for_income_us_82c ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.for_income_us_82c, 0)) : 0;
    grossReceipt = this.taxComputationForm.value.on_gross_receipt ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.on_gross_receipt, 0)) : 0;
    locationOfIncome = this.taxComputationForm.value.for_location_of_income ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.for_location_of_income, 0)) : 0;
    // totalMinimumTax = for82c + grossReceipt + locationOfIncome;
    totalMinimumTax = Math.max(for82c, grossReceipt, locationOfIncome);

    this.taxComputationForm.patchValue(
      {
        summery_MinimumTax: this.commaseparator.currencySeparatorBD(totalMinimumTax),
      });

    this.calculateNetTaxAfterTaxRebate();
    this.calculateTotalAmountPayable();
  }

  changeSurcharge(event: any, formControlName) {
    let netWealthSur: any, tobaccoSur: any, totalSurcharge: any;
    netWealthSur = this.taxComputationForm.value.net_wealth_surcharge ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.net_wealth_surcharge, 0)) : 0;
    tobaccoSur = this.taxComputationForm.value.tobacco_surcharge ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tobacco_surcharge, 0)) : 0;
    // totalSurcharge = this.taxComputationForm.value.summery_Surcharge ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_Surcharge, 0)) : 0;
    totalSurcharge = netWealthSur + tobaccoSur;

    if (formControlName === 'net_wealth_surcharge') {
      this.taxComputationForm.patchValue(
        {
          net_wealth_surcharge: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isNWS_changes: true,
        });
    }
    if (formControlName === 'tobacco_surcharge') {
      this.taxComputationForm.patchValue(
        {
          tobacco_surcharge: event.target.value ? this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)) : 0,
          isTS_changes: true,
        });
    }

    this.taxComputationForm.patchValue(
      {
        summery_Surcharge: this.commaseparator.currencySeparatorBD(totalSurcharge),
      });

    this.calculateTotalAmountPayable();
  }

  changeAnyOtherAmount(event: any) {
    this.taxComputationForm.patchValue(
      {
        summery_any_other_amount: this.commaseparator.currencySeparatorBD(this.commaseparator.removeComma(event.target.value, 0)),
        isAOA_changes: true,
      });

    this.calculateTotalAmountPayable();
  }

  editGrossTaxBeforeTaxRebate() {
    this.wantEditCalDetail_grossTaxB4TaxRebate = true;
  }
  editDoneGrossTaxBeforeTaxRebate() {
    this.wantEditCalDetail_grossTaxB4TaxRebate = false;
  }
  editTaxRebate() {
    this.wantEditCalDetail_TaxRebate = true;
  }
  editDoneTaxRebate() {
    this.wantEditCalDetail_TaxRebate = false;
  }
  editMinimumTax() {
    this.wantEditCalDetail_MinimumTax = true;
  }
  editDoneMinimumTax() {
    this.wantEditCalDetail_MinimumTax = false;
  }

  editSurcharge() {
    this.wantEditCalDetail_Surcharge = true;
  }
  editDoneSurcharge() {
    this.wantEditCalDetail_Surcharge = false;
  }
  editAnyOtherAmount() {
    this.wantEditCalDetail_anyOtherAmount = true;
  }
  editDoneAnyOtherAmount() {
    this.wantEditCalDetail_anyOtherAmount = false;
  }

  calculateTotalAmountPayable() {
    let grossTaxB4TaxRebate: any, TaxRebate: any, netTax: any, minTax: any, surcharge: any, AnyOtherAmt: any, totalAmountPayable: any;
    // grossTaxB4TaxRebate = this.taxComputationForm.value.summery_GrossTaxbeforeTaxRebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_GrossTaxbeforeTaxRebate, 0)) : 0;
    // TaxRebate = this.taxComputationForm.value.summery_TaxRebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_TaxRebate, 0)) : 0;
    netTax = this.taxComputationForm.value.netTaxAfterTaxRebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.netTaxAfterTaxRebate, 0)) : 0;
    minTax = this.taxComputationForm.value.summery_MinimumTax ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_MinimumTax, 0)) : 0;
    surcharge = this.taxComputationForm.value.summery_Surcharge ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_Surcharge, 0)) : 0;
    AnyOtherAmt = this.taxComputationForm.value.summery_any_other_amount ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_any_other_amount, 0)) : 0;

    totalAmountPayable = Math.max(netTax, minTax) + surcharge + AnyOtherAmt;

    this.taxComputationForm.patchValue(
      {
        total_amount_payable: this.commaseparator.currencySeparatorBD(totalAmountPayable),
      });
  }

  calculateNetTaxAfterTaxRebate() {
    let grossTaxB4TaxRebate: any, TaxRebate: any, netTax: any, minTax: any;
    grossTaxB4TaxRebate = this.taxComputationForm.value.summery_GrossTaxbeforeTaxRebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_GrossTaxbeforeTaxRebate, 0)) : 0;
    TaxRebate = this.taxComputationForm.value.summery_TaxRebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_TaxRebate, 0)) : 0;
    minTax = this.taxComputationForm.value.summery_MinimumTax ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_MinimumTax, 0)) : 0;
    netTax = Math.max((grossTaxB4TaxRebate - TaxRebate), minTax);
    this.taxComputationForm.patchValue(
      {
        netTaxAfterTaxRebate: this.commaseparator.currencySeparatorBD(netTax),
      });

  }

  patchNewChanges() {
    //Gross Tax before Tax Rebate
    if (!this.taxComputationForm.value.isTORI_changes)
      this.taxComputationForm.patchValue(
        {
          tax_on_regular_income: 0,
        });
    if (!this.taxComputationForm.value.isTOI82c_changes)
      this.taxComputationForm.patchValue(
        {
          tax_on_income_82c: 0,
        });

    if (!this.taxComputationForm.value.isTOSROI_changes)
      this.taxComputationForm.patchValue(
        {
          tax_on_sro_income: 0,
        });

    //Tax Rebate
    if (!this.taxComputationForm.value.isOI_changes)
      this.taxComputationForm.patchValue(
        {
          on_investment: 0,
        });
    if (!this.taxComputationForm.value.isFA_changes)
      this.taxComputationForm.patchValue(
        {
          on_firm_aop_share: 0,
        });
    if (!this.taxComputationForm.value.isFTR_changes)
      this.taxComputationForm.patchValue(
        {
          foreign_tax_relief: 0,
        });
    if (!this.taxComputationForm.value.isOR_changes)
      this.taxComputationForm.patchValue(
        {
          other_rebate: 0,
        });

    //Minimum Tax
    if (!this.taxComputationForm.value.isFIUS82C_changes)
      this.taxComputationForm.patchValue(
        {
          for_income_us_82c: 0,
        });
    if (!this.taxComputationForm.value.isOGR_changes)
      this.taxComputationForm.patchValue(
        {
          on_gross_receipt: 0,
        });
    if (!this.taxComputationForm.value.isFLOI_changes)
      this.taxComputationForm.patchValue(
        {
          for_location_of_income: 0,
        });

    //Surcharge
    if (!this.taxComputationForm.value.isNWS_changes)
      this.taxComputationForm.patchValue(
        {
          net_wealth_surcharge: 0,
        });
    if (!this.taxComputationForm.value.isTS_changes)
      this.taxComputationForm.patchValue(
        {
          tobacco_surcharge: 0,
        });

    //Any Other Amount
    if (!this.taxComputationForm.value.isAOA_changes)
      this.taxComputationForm.patchValue(
        {
          summery_any_other_amount: 0,
        });

  }

  saveTaxComputationChanges() {
    this.patchNewChanges();

    let requestJson: any;
    requestJson = {
      "tin": this.userTin,
      "assessment_year": "2021-2022",
      //Gross Tax before Tax Rebate
      "user_tc_GTBTR_Tax_on_Regular_Income": this.taxComputationForm.value.tax_on_regular_income ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tax_on_regular_income, 0)) : 0,
      "user_tc_GTBTR_Tax_on_Income_us_82c": this.taxComputationForm.value.tax_on_income_82c ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tax_on_income_82c, 0)) : 0,
      "user_tc_GTBTR_Tax_on_SRO_Income": this.taxComputationForm.value.tax_on_sro_income ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tax_on_sro_income, 0)) : 0,

      //Rebate
      "user_tc_Total_Investment_Rebate": this.taxComputationForm.value.on_investment ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.on_investment, 0)) : 0,
      "user_tc_TR_on_Firm_AoP_share": this.taxComputationForm.value.on_firm_aop_share ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.on_firm_aop_share, 0)) : 0,
      "user_tc_TR_on_Foreign_Tax_Relief": this.taxComputationForm.value.foreign_tax_relief ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.foreign_tax_relief, 0)) : 0,
      "user_tc_TR_Other_Rebate": this.taxComputationForm.value.other_rebate ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.other_rebate, 0)) : 0,

      //Minimum Tax
      "user_tc_MT_for_Income_us_82c_2": this.taxComputationForm.value.for_income_us_82c ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.for_income_us_82c, 0)) : 0,
      "user_tc_MT_for_Income_us_82c_4": this.taxComputationForm.value.on_gross_receipt ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.on_gross_receipt, 0)) : 0,
      "user_tc_MT_for_Location_of_Income": this.taxComputationForm.value.for_location_of_income ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.for_location_of_income, 0)) : 0,

      //Surcharge
      "user_tc_S_Net_Wealth_Surcharge": this.taxComputationForm.value.net_wealth_surcharge ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.net_wealth_surcharge, 0)) : 0,
      "user_tc_S_Tobacco_Surcharge": this.taxComputationForm.value.tobacco_surcharge ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.tobacco_surcharge, 0)) : 0,

      //Any Other Amount
      "user_tc_Interest_or_Any_Other_Amt": this.taxComputationForm.value.summery_any_other_amount ? parseInt(this.commaseparator.removeComma(this.taxComputationForm.value.summery_any_other_amount, 0)) : 0,
    }

  //  console.log('tax computation request json ', requestJson);
    this.apiService.post(this.serviceUrl + 'api/submit_user_data/', requestJson)
      .subscribe(result => {
        if (result.success) {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          this.toastr.success('Saved Successfully', '', {
            timeOut: 2000,
          });
        }
      },
        error => {
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 1000,
          });
        })
  }

  resetTaxComputation() {
    let requestJson =
    {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/reset_user_data/', "")
      .subscribe(result => {
        if (result.success) {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          this.toastr.success('Reset Successfully', '', {
            timeOut: 2000,
          });
        }
        else {
          this.toastr.warning(result.errorMessage, '', {
            timeOut: 2000,
          });
        }
      },
        error => {
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 1000,
          });
        })
  }

  //newly added for initial-basic-query
  haveSrcTax(event: any) {
    if (event.target.value === '1') {
      this.isHaveSrcTax = true;
    }
    else {
      this.isHaveSrcTax = false;
      this.basicQuestionForm.controls.updateLedger.setValue('0');
    }
  }
  updateLedger(event: any, confirmationPopup) {
    // debugger;
    if (event.target.value === '1') {
      this.isUpdateLedger = true;

      // newly added
      if (this.isHaveSrcTax == true) {
        this.goToEledger();
      }

      //previous
      // this.openConfirmationPopup(confirmationPopup);
    }
    else {
      this.isUpdateLedger = false;
    }
  }

  openConfirmationPopup(confirmationPopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(confirmationPopup, { class: 'modal-lg' });
  }

  closeConfirmation() {
    this.basicQuestionForm.controls.updateLedger.setValue('0');
    this.modalRef.hide();
  }

  onYesConfirmation() {
    this.modalRef.hide();
    this.router.navigate(["/user-panel/thanks-giving-offline"]);
  }

  onClickViewPrintReturn() {
    this.modalRef.hide();
    if (this.isSubmitted == true) {
      this.toastr.error('You already submitted your return in online.', '', {
        timeOut: 3000,
      });
      this.eReturnSpinner.start();
      this.isHaveSrcTax = false;
      this.basicQuestionForm.controls.haveSrcTax.setValue('0');
      this.basicQuestionForm.controls.updateLedger.setValue('0');
      this.eReturnSpinner.stop();
    }
    else {
      this.router.navigate(["/user-panel/thanks-giving-offline"]);
    }
  }

  onClickContinueWithEreturn() {
    this.isHaveSrcTax = false;
    this.basicQuestionForm.controls.haveSrcTax.setValue('0');
    this.basicQuestionForm.controls.updateLedger.setValue('0');
    this.modalRef.hide();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onClickExitEreturn() {
    this.modalRef.hide();
  }

  checkSubmissionStatus() {
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get_submission')
      .subscribe(result => {
        if (result.replyMessage != null) {
          if ((result.replyMessage).returnSubmissionType == "ONLINE") {
            this.isSubmitted = true;
            this.isShow = false;
            this.toastr.error('You already submitted your return in online.', '', {
              timeOut: 3000,
            });
          }
          else {
            this.isSubmitted = false;
            this.isShow = true;
          }
        }
        else {
          this.isShow = true;
        }
      },
        error => {
          this.isSubmitted = false;
       //   console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  //end
}
