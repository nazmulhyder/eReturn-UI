import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { RebateValidationService } from '../../service/rebate-validation.service';

@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.css']
})
export class RebateComponent implements OnInit {
  hasAnyIncome: any;
  isSaveDraft: boolean = false;
  userTin: any;
  rebateForm: FormGroup;
  headsOfIncome = [];
  checkIsLoggedIn: any;
  chklifeInsurance: boolean = false;
  formArray: FormArray;

  selectedNavbar = [];
  mainNavActive = {};
  lengthOfheads: any;

  lifeInsuranceArray = [];
  newLifeInsurance: any = {};
  isLifeInsuranceDeleteActionShow: boolean;

  chkDPS: boolean = false;
  dpsArray = [];
  newDps: any = {};
  isDpsDeleteActionShow: boolean;

  chkApprovedSaving: boolean = false;
  approvedSavingArray = [];
  newApprovedSaving: any = {};
  isApprovedSavingDeleteActionShow: boolean;

  chkGPF: boolean = false;;
  gpfArray = [];
  newGPF: any = {};
  isGPFDeleteActionShow: boolean;

  chkBenevolentFund: boolean = false;;
  benevolentFundArray = [];
  newBenevolentFund: any = {};
  isBenevolentFundDeleteActionShow: boolean;

  chkRPF: boolean = false;
  rpfArray = [];
  newRPF: any = {};
  isRPFDeleteActionShow: boolean;

  chkApprovedStocks: boolean = false;
  approvedStocksArray = [];
  newApprovedStocks: any = {};
  isApprovedStocksDeleteActionShow: boolean;

  chkOthers: boolean = false;
  isShow: boolean;

  chkInvestmentUnder6Schedule: boolean = false;
  investmentUnder6ScheduleArray = [];
  newInvestmentUnder6Schedule: any = {};
  isInvestmentUnder6ScheduleDeleteActionShow: boolean;

  chkInvestmentUnderSRO: boolean = false;
  investmentUnderSROArray = [];
  newInvestmentUnderSRO: any = {};
  isInvestmentUnderSRODeleteActionShow: boolean;

  maxDate: any;

  minYear: any;
  maxYear: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  requestNavbarGetData: any;
  additionalInformationForm: FormGroup;
  requestIncomeHeadGetData: any;
  formGroup: FormGroup;

  // for summary
  totalRebateSum: any = 0;
  totalSummaryLIP: any = 0
  totalOriginalLIP: any = 0;
  totalOriginalDPS: any = 0;
  totalSummaryDPS: any = 0;
  totalSummaryASC: any = 0;
  totalSummaryGPF: any = 0;
  totalSummaryBF_GIP: any = 0;
  totalSummaryRPF: any = 0;
  totalSummaryAS_S: any = 0;
  totalSummary_Other1: any = 0;
  totalSummary_Other2: any = 0;
  getTotalRebateSummary: any = 0;
  totalRebateActualSum: any = 0;
  incomeYearFrom: any;
  incomeYearTo: any;
  minDateLen: any;
  maxDateLen: any;
  isParagraphValidationSuccessful: boolean = true;
  basic_dearness_alw: any;

  //validation arrays
  validateLIP = [];
  validateDPS =[];
  validateASC = [];
  validateGPF = [];
  validateBF_GIP = [];
  validateRPF = [];
  validateASS  = [];
  validateOther_schedule6 =[];
  validateOther_SRO =[];
  isNotReturnSubmit: boolean = true;

  constructor(private fb: FormBuilder,
    private headService: HeadsOfIncomeService,
    private router: Router,
    private mainNavbarList: mainNavbarListService,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private spinner: NgxUiLoaderService,
    private commaSeparator: CommaSeparatorService,
    private rebateValidationService : RebateValidationService
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

  insertIntoRebate() {
    this.rebateForm = this.fb.group({
      title: [],
      // Table - 1 : Life Insurance Premium
      lifeInsurancePremium: new FormControl(false),
      RB_CAT_LIFE_INS_PREM: this.fb.array([this.fb.group({
        policyNumber: new FormControl(),
        insuranceCompany: new FormControl(),
        policyValue: new FormControl(),
        premiumPaid: new FormControl(),
        allowableAmt_lip: new FormControl(),
      })]),
      // Table - 2 : DPS Account No
      dps: new FormControl(false),
      RB_CAT_DPS: this.fb.array([this.fb.group({
        bankorFI: new FormControl(),
        accountNo: new FormControl(),
        depositAmount: new FormControl(),
        allowableAmt_dps: new FormControl(),
      })]),
      // Table - 3 : Approved Savings Certificate
      approvedSavingCertificate: new FormControl(false),
      RB_CAT_APPR_SAVINGS_CERT: this.fb.array([this.fb.group({
        name: new FormControl(),
        issueDate: new FormControl(),
        registrationNo: new FormControl(),
        investment: new FormControl(),
      })]),
      // Table - 4 : General Provident Fund (GPF)
      generalProvidentFund: new FormControl(false),
      RB_CAT_GPF: this.fb.array([this.fb.group({
        gpfAccountNo: new FormControl(),
        contribution: new FormControl(),
      })]),
      // Table - 5 : Benevolent Fund & Group Insurance Premium
      benevolentFund: new FormControl(false),
      benevolentAmount: new FormControl(),
      groupInsurancePremiumAmount: new FormControl(),

      // RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM: this.fb.array([this.fb.group({
      //   benevolentAmount: new FormControl(),
      //   groupInsurancePremiumAmount: new FormControl(),

      // })]),
      // Table - 6 : Recognized Provident Fund (RPF)
      recognizedProvidentFund: new FormControl(false),
      RB_CAT_RPF: this.fb.array([this.fb.group({
        employerName: new FormControl(),
        selfContribution: new FormControl(),
        employerContribution: new FormControl(),
      })]),
      // Table - 7 : Approved Stocks or Shares
      approvedStocks: new FormControl(false),
      RB_CAT_APPR_STOCKS_OR_SHARES: this.fb.array([this.fb.group({
        boAccountNo: new FormControl(),
        brokerageHouseName: new FormControl(),
        investmentDuringtheYear: new FormControl(),
      })]),
      // Table - 8 Others >> Investment Under 6 Schedule Part B
      others: new FormControl(),
      investmentUnder6Schedule: new FormControl(),
      investmentUnderSRO: new FormControl(),
      RB_CAT_OTHERS_INVESTMENT_U_6_B: this.fb.array([this.fb.group({
        paragraphNumber: new FormControl(),
        description: new FormControl(),
        amount: new FormControl(),
      })]),
      // Table - 9 Others >> Investment Under SRO
      RB_CAT_OTHERS_SRO: this.fb.array([this.fb.group({
        sroNo: new FormControl(),
        sroYear: new FormControl(),
        sroDescription: new FormControl(),
        sroAmount: new FormControl(),
      })]),
    })
  }

  get table_1_List() {
    return this.rebateForm.get('RB_CAT_LIFE_INS_PREM') as FormArray;
  }
  get table_2_List() {
    return this.rebateForm.get('RB_CAT_DPS') as FormArray;
  }
  get table_3_List() {
    return this.rebateForm.get('RB_CAT_APPR_SAVINGS_CERT') as FormArray;
  }
  get table_4_List() {
    return this.rebateForm.get('RB_CAT_GPF') as FormArray;
  }
  // get table_5_List() {
  //   return this.rebateForm.get('RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM') as FormArray;
  // }
  get table_6_List() {
    return this.rebateForm.get('RB_CAT_RPF') as FormArray;
  }
  get table_7_List() {
    return this.rebateForm.get('RB_CAT_APPR_STOCKS_OR_SHARES') as FormArray;
  }
  get table_8_List() {
    return this.rebateForm.get('RB_CAT_OTHERS_INVESTMENT_U_6_B') as FormArray;
  }
  get table_9_List() {
    return this.rebateForm.get('RB_CAT_OTHERS_SRO') as FormArray;
  }

  add_row_table_1() {
    if(this.validateLifeInsurancePremium())
    {
      this.table_1_List.push(this.fb.group({
        policyNumber: new FormControl(),
        insuranceCompany: new FormControl(),
        policyValue: new FormControl(),
        premiumPaid: new FormControl(),
        allowableAmt_lip: new FormControl(),
      }));
      this.isLifeInsuranceDeleteActionShow = this.table_1_List.length === 1 ? false : true;
      this.initializeLIPValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
    
  }
  add_row_table_2() {
    if(this.validateDepositPensionScheme())
    {
      this.table_2_List.push(this.fb.group({
        bankorFI: new FormControl(),
        accountNo: new FormControl(),
        depositAmount: new FormControl(),
        allowableAmt_dps: new FormControl(),
      }));
      this.isDpsDeleteActionShow = this.table_2_List.length === 1 ? false : true;
      this.initializeDPSValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }
  add_row_table_3() {
    if(this.validateApprovedSavingsCertificate())
    {
      this.table_3_List.push(this.fb.group({
        name: new FormControl(),
        issueDate: new FormControl(),
        registrationNo: new FormControl(),
        investment: new FormControl(),
      }));
      this.isApprovedSavingDeleteActionShow = this.table_3_List.length === 1 ? false : true;
      this.initializeASCValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
    
  }
  add_row_table_4() {
    if(this.validateGeneralProvidentFund())
    {
      this.table_4_List.push(this.fb.group({
        gpfAccountNo: new FormControl(),
        contribution: new FormControl(),
      }));
      this.isGPFDeleteActionShow = this.table_4_List.length === 1 ? false : true;
      this.initializeGPFValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }
  // add_row_table_5() {
  //   this.table_5_List.push(this.fb.group({
  //     benevolentAmount: new FormControl(),
  //     groupInsurancePremiumAmount: new FormControl(),

  //   }));
  //   this.isBenevolentFundDeleteActionShow = this.table_5_List.length === 1 ? false : true;
  // }
  add_row_table_6() {
    if(this.validateRecognizedProvidentFund())
    {
      this.table_6_List.push(this.fb.group({
        employerName: new FormControl(),
        selfContribution: new FormControl(),
        employerContribution: new FormControl(),
      }));
      this.isRPFDeleteActionShow = this.table_6_List.length === 1 ? false : true;
      this.initializeRPFValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }
  add_row_table_7() {
    if(this.validateApprovedStocksShares())
    {
      this.table_7_List.push(this.fb.group({
        boAccountNo: new FormControl(),
        brokerageHouseName: new FormControl(),
        investmentDuringtheYear: new FormControl(),
      }));
      this.isApprovedStocksDeleteActionShow = this.table_7_List.length === 1 ? false : true;
      this.initializeASSValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }

    

  }
  add_row_table_8() {
    if(this.validateOtherSchedule6())
    {
      this.table_8_List.push(this.fb.group({
        paragraphNumber: new FormControl(),
        description: new FormControl(),
        amount: new FormControl(),
      }));
      this.isInvestmentUnder6ScheduleDeleteActionShow = this.table_8_List.length === 1 ? false : true;
      this.initializeOtherSchedule6ValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }
  }
  add_row_table_9() {
    if(this.validateOtherSRO())
    {
      this.table_9_List.push(this.fb.group({
        sroNo: new FormControl(),
        sroYear: new FormControl(),
        sroDescription: new FormControl(),
        sroAmount: new FormControl(),
      }));
      this.isInvestmentUnderSRODeleteActionShow = this.table_9_List.length === 1 ? false : true;
      this.initializeOtherSROValidatonArrayIndexes();
    }
    else 
    {
      this.toastr.warning('Please fill all the required fields', '', {
        timeOut: 2000,
      });
      return;
    }

  }

  delete_table_1_row(index) {
    this.table_1_List.removeAt(index);
    this.validateLIP.splice(index,1);
    this.summaryLIP();
    this.isLifeInsuranceDeleteActionShow = this.table_1_List.length === 1 ? false : true;
  }
  delete_table_2_row(index) {
    this.table_2_List.removeAt(index);
    this.validateDPS.splice(index,1);
    this.summaryDPS();
    this.isDpsDeleteActionShow = this.table_2_List.length === 1 ? false : true;
    this.finalizeAllowableAmount();

  }
  delete_table_3_row(index) {
    this.table_3_List.removeAt(index);
    this.validateASC.splice(index,1);
    this.summaryASC();
    this.isApprovedSavingDeleteActionShow = this.table_3_List.length === 1 ? false : true;
  }
  delete_table_4_row(index) {
    this.table_4_List.removeAt(index);
    this.validateGPF.splice(index,1);
    this.summaryGPF();
    this.isGPFDeleteActionShow = this.table_4_List.length === 1 ? false : true;

  }
  // delete_table_5_row(index) {
  //   this.table_5_List.removeAt(index);
  //   this.summaryBF_GIP();
  //   this.isBenevolentFundDeleteActionShow = this.table_5_List.length === 1 ? false : true;

  // }
  delete_table_6_row(index) {
    this.table_6_List.removeAt(index);
    this.validateRPF.splice(index,1);
    this.summaryRPF();
    this.isRPFDeleteActionShow = this.table_6_List.length === 1 ? false : true;

  }
  delete_table_7_row(index) {
    this.table_7_List.removeAt(index);
    this.validateASS.splice(index,1);
    this.summaryAS_S();
    this.isApprovedStocksDeleteActionShow = this.table_7_List.length === 1 ? false : true;

  }
  delete_table_8_row(index) {
    this.table_8_List.removeAt(index);
    this.validateOther_schedule6.splice(index,1);
    this.summaryOther1();
    this.isInvestmentUnder6ScheduleDeleteActionShow = this.table_8_List.length === 1 ? false : true;

  }
  delete_table_9_row(index) {
    this.table_9_List.removeAt(index);
    this.validateOther_SRO.splice(index,1);
    this.summaryOther2();
    this.isInvestmentUnderSRODeleteActionShow = this.table_9_List.length === 1 ? false : true;

  }

  summaryLIP() {
    this.totalSummaryLIP = 0; let tmpPolicyVal, tmpPremiumPaid: any; this.totalOriginalLIP = 0;
    this.table_1_List.controls.forEach(element => {
      tmpPolicyVal = this.commaSeparator.removeComma(element.value.policyValue, 0);
      tmpPremiumPaid = this.commaSeparator.removeComma(element.value.premiumPaid, 0);
      this.totalOriginalLIP += Math.round(tmpPremiumPaid);
      this.totalSummaryLIP += Math.min((Math.round(tmpPolicyVal) * 0.1), Math.round(tmpPremiumPaid));
      // console.log(this.totalSummaryLIP);
    });
    this.getRebateSumTotal();
  }

  summaryDPS() {
    let tmpalwableDpsAmount: any;
    this.totalSummaryDPS = 0; this.totalOriginalDPS = 0;
    this.table_2_List.controls.forEach(element => {
      tmpalwableDpsAmount = parseInt(element.value.allowableAmt_dps) ? this.commaSeparator.removeComma(element.value.allowableAmt_dps, 0) : 0;
      this.totalSummaryDPS += Math.round(tmpalwableDpsAmount);
      this.totalOriginalDPS += parseInt(this.commaSeparator.removeComma(element.value.depositAmount, 0));
      // console.log(this.totalSummaryLIP);
    });
    this.getRebateSumTotal();
  }

  summaryASC() {
    let tmpInvsmnt: any;
    this.totalSummaryASC = 0;
    this.table_3_List.controls.forEach(element => {
      tmpInvsmnt = this.commaSeparator.removeComma(element.value.investment, 0);
      this.totalSummaryASC += Math.round(tmpInvsmnt);
    });
    this.getRebateSumTotal();
  }

  summaryGPF() {
    let tmpContribution: any;
    this.totalSummaryGPF = 0;
    this.table_4_List.controls.forEach(element => {
      tmpContribution = this.commaSeparator.removeComma(element.value.contribution, 0);
      this.totalSummaryGPF += Math.round(tmpContribution);
      // console.log(this.totalSummaryLIP);
    });
    this.getRebateSumTotal();
  }

  summaryBF_GIP() {
    let tmpBenevolentAmount: any, tmpGroupInsurancePremiumAmount: any;
    this.totalSummaryBF_GIP = 0;
    // this.table_5_List.controls.forEach(element => {

    //   // console.log(this.totalSummaryLIP);
    // });
    tmpBenevolentAmount = this.commaSeparator.removeComma(this.rebateForm.controls['benevolentAmount'].value, 0);
    tmpGroupInsurancePremiumAmount = this.commaSeparator.removeComma(this.rebateForm.controls['groupInsurancePremiumAmount'].value, 0);
    this.totalSummaryBF_GIP += (Math.round(tmpBenevolentAmount) + Math.round(tmpGroupInsurancePremiumAmount));
    this.getRebateSumTotal();
  }

  summaryRPF() {
    let tmpSelfContribution: any, tmpEmployerContribution: any;
    this.totalSummaryRPF = 0;
    this.table_6_List.controls.forEach(element => {
      tmpSelfContribution = element.value.selfContribution ? this.commaSeparator.removeComma(element.value.selfContribution, 0) : 0;
      tmpEmployerContribution = element.value.employerContribution ? this.commaSeparator.removeComma(element.value.employerContribution, 0) : 0;
      this.totalSummaryRPF += (Math.round(tmpSelfContribution) + Math.round(tmpEmployerContribution));
      //console.log('totalSummaryRPF', this.totalSummaryRPF);
    });
    this.getRebateSumTotal();
  }

  summaryAS_S() {
    let tmpInvestmentDuringtheYear: any;
    this.totalSummaryAS_S = 0;
    this.table_7_List.controls.forEach(element => {
      tmpInvestmentDuringtheYear = this.commaSeparator.removeComma(element.value.investmentDuringtheYear, 0);
      this.totalSummaryAS_S += Math.round(tmpInvestmentDuringtheYear);
      // console.log(this.totalSummaryLIP);
    });
    this.getRebateSumTotal();
  }

  summaryOther1() {
    let tmpAmount: any;
    this.totalSummary_Other1 = 0;
    this.table_8_List.controls.forEach(element => {
      tmpAmount = this.commaSeparator.removeComma(element.value.amount, 0);
      this.totalSummary_Other1 += Math.round(tmpAmount);
      // console.log(this.totalSummaryLIP);
    });
    this.getRebateSumTotal();
  }

  summaryOther2() {
    let tmpsroAmount: any;
    this.totalSummary_Other2 = 0;
    this.table_9_List.controls.forEach(element => {
      tmpsroAmount = this.commaSeparator.removeComma(element.value.sroAmount, 0);
      this.totalSummary_Other2 += Math.round(tmpsroAmount);
      // console.log(this.totalSummaryLIP);
    });
    this.getRebateSumTotal();
  }


  calculateDpsAlwbleAmount(i): number {
    let current_tmp_DpsalwbleAmt = 0;
    this.table_2_List.controls.forEach((element, index) => {
      if (index != i) {
        current_tmp_DpsalwbleAmt += parseInt(this.commaSeparator.removeComma(element.value.allowableAmt_dps, 0));
      }
    });

    return current_tmp_DpsalwbleAmt;
  }

  calculateDpsAmount(): number {
    let current_tmp_DpsAmt = 0;
    this.table_2_List.controls.forEach(element => {
      current_tmp_DpsAmt += parseInt(this.commaSeparator.removeComma(element.value.depositAmount, 0));
    });

    return current_tmp_DpsAmt;
  }

  //#region  Comma Separator Start
  commaSeperateLIP(policyValue, premiumPaid, i) {
    let calc_allwableAmt_lip: any; let tmp_policyVal: any; let tmp_premiumPaid: any; let tmp_alwableAmount: any;

    tmp_policyVal = parseInt(policyValue) ? Math.round(parseInt(this.commaSeparator.removeComma(policyValue, 0)) * 0.1) : '';
    tmp_premiumPaid = parseInt(premiumPaid) ? Math.round(parseInt(this.commaSeparator.removeComma(premiumPaid, 0))) : '';
    tmp_alwableAmount = Math.min(tmp_policyVal, tmp_premiumPaid);

    this.table_1_List.controls[i].patchValue({
      policyValue: parseInt(policyValue) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(policyValue, 0)) : '',
      premiumPaid: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(premiumPaid, 0)),
      allowableAmt_lip: this.commaSeparator.currencySeparatorBD(tmp_alwableAmount),
    });
    this.summaryLIP();
  }

  commaSeperateDPS(depositAmount, i) {
    // debugger;
    let dps_AllowableAmount = 60000;
    let amount: any;
    let needed_Amount: any;
    amount = this.calculateDpsAlwbleAmount(i);
    needed_Amount = dps_AllowableAmount - amount;

    if (needed_Amount > 0) {
      this.table_2_List.controls[i].patchValue({
        depositAmount:  this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(depositAmount, 0)),
        allowableAmt_dps: parseInt(this.commaSeparator.removeComma(depositAmount, 0)) > needed_Amount ? needed_Amount : this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(depositAmount, 0)),
      });
    }
    else {
      this.table_2_List.controls[i].patchValue({
        depositAmount: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(depositAmount, 0)),
        allowableAmt_dps: '',
      });
    }
    if(depositAmount != null && depositAmount !='')
    this.finalizeAllowableAmount();
  }

  finalizeAllowableAmount() {
    let temp_alwAmt = 0;
    this.table_2_List.controls.forEach((element, index) => {
      if (parseInt(this.commaSeparator.removeComma(element.value.depositAmount, 0)) <= (60000 - temp_alwAmt)) {
        temp_alwAmt += parseInt(this.commaSeparator.removeComma(element.value.depositAmount, 0));
        this.table_2_List.controls[index].patchValue({
          allowableAmt_dps: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.depositAmount, 0)),
        });
      }
      else {
        if (temp_alwAmt < 60000) {
          this.table_2_List.controls[index].patchValue({
            allowableAmt_dps: this.commaSeparator.currencySeparatorBD(60000 - temp_alwAmt),
          });
          temp_alwAmt = 60000;
        }
        else {
          this.table_2_List.controls[index].patchValue({
            allowableAmt_dps: '',
          });
        }

      }
    });

  }

  commaSeperateASC(investment, i) {
    this.table_3_List.controls[i].patchValue({
      investment: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(investment, 0)),
    });
  }

  commaSeperateGPF(contribution, i) {
    this.table_4_List.controls[i].patchValue({
      contribution: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(contribution, 0)),
    });
  }

  commaSeperateBF_GIP(event, title: any) {
    // debugger;
    let eventValue = parseInt(this.commaSeparator.removeComma(event.target.value, 0));
    if (title === 'benevolentAmount') {
      this.rebateForm.patchValue(
        {
          benevolentAmount: this.commaSeparator.currencySeparatorBD((eventValue)),
        });
    }
    if (title === 'grpInsurancePremium') {
      this.rebateForm.patchValue(
        {
          groupInsurancePremiumAmount: this.commaSeparator.currencySeparatorBD(eventValue),
        });
    }
  }

  commaSeperateRPF(selfContribution, employerContribution, i) {
    // debugger;
    if (parseInt(this.commaSeparator.removeComma(selfContribution, 0)) > this.basic_dearness_alw) {
      this.toastr.warning('Self contribution will less than or equal to basic and dearness allowance!');
      this.table_6_List.controls[i].patchValue({
        selfContribution: 0,
      });
      this.summaryRPF();
    }
    else {
      if (parseInt(this.commaSeparator.removeComma(employerContribution, 0)) > parseInt(this.commaSeparator.removeComma(selfContribution, 0))) {
        this.toastr.warning('Employee Contribution will be less or equal self contribution!');
        this.table_6_List.controls[i].patchValue({
          employerContribution: 0,
        });
        this.summaryRPF();
      }
      else {
        this.table_6_List.controls[i].patchValue({
          selfContribution: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(selfContribution, 0)),
          employerContribution: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(employerContribution, 0)),
        });
        this.summaryRPF();
      }
    }

  }

  commaSeperateAS_S(investmentDuringtheYear, i) {
    this.table_7_List.controls[i].patchValue({
      investmentDuringtheYear: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(investmentDuringtheYear, 0)),
    });
  }

  commaSeperateOther1(amount, i) {
    this.table_8_List.controls[i].patchValue({
      amount: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(amount, 0)),
    });
  }
  commaSeperateOther2(sroAmount, i) {
    this.table_9_List.controls[i].patchValue({
      sroAmount: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(sroAmount, 0)),
    });
  }

  //#endregion

  getRebateSumTotal() {
    //debugger;
    //Total Actual Investment
    this.totalRebateActualSum = (this.getTotalRebateSummary + this.totalOriginalLIP + this.totalOriginalDPS
      + this.totalSummaryASC + this.totalSummaryGPF + this.totalSummaryBF_GIP
      + this.totalSummaryRPF + this.totalSummaryAS_S + this.totalSummary_Other1
      + this.totalSummary_Other2);

    this.totalRebateActualSum = this.commaSeparator.currencySeparatorBD(this.totalRebateActualSum);

    // Total Allowable Investment
    this.totalRebateSum = (this.getTotalRebateSummary + this.totalSummaryLIP + this.totalSummaryDPS
      + this.totalSummaryASC + this.totalSummaryGPF + this.totalSummaryBF_GIP
      + this.totalSummaryRPF + this.totalSummaryAS_S + this.totalSummary_Other1
      + this.totalSummary_Other2);

    this.totalRebateSum = this.commaSeparator.currencySeparatorBD(this.totalRebateSum);

    // console.log('total rebate allowable summary', this.totalRebateSum);
    // console.log('total rebate actual summary', this.totalRebateActualSum);

  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.getHeadsOfIncome();
    // this.insertFormGroupToArray();
    this.insertIntoRebate();
    this.getMainNavbar();
    this.mainNavActiveSelect('3');
    this.isShow = false;

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

    this.minYear = new Date(1972, 0, 1);
    this.maxYear = new Date();
    this.maxYear.setDate(this.maxYear.getDate());
    this.hasAnyIncome = localStorage.getItem('hasAnyIncome');
    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    //#endregion
    this.getBasicDearnessAlwSalary();
    this.getRebateData();
    this.checkSubmissionStatus();
    // this.getRebateSumTotal();

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
          this.minDateLen = new Date(this.incomeYearFrom.substring(6, 12), parseInt(this.incomeYearFrom.substring(3, 5)) - 1, this.incomeYearFrom.substring(0, 2));
          this.incomeYearTo = getAdditional_info_data.endOfIncomeYr;
          this.maxDateLen = new Date(this.incomeYearTo.substring(6, 12), parseInt(this.incomeYearTo.substring(3, 5)) - 1, this.incomeYearTo.substring(0, 2));

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
          this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Rebate');
        }
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        this.lengthOfheads = this.selectedNavbar.length;
      })

  }

  getRebateData() {
    // debugger;
    let getRebateData: any;
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/user-panel/rebate')
      .subscribe(result => {
        getRebateData = result;
        this.spinner.stop();
        // console.log('get data', getRebateData.RB_CAT_LIFE_INS_PREM);
        if (getRebateData != null) {
          if (getRebateData.RB_CAT_LIFE_INS_PREM) {
            this.rebateForm.controls.lifeInsurancePremium.setValue(true);
            this.chklifeInsurance = true;
            this.isLifeInsuranceDeleteActionShow = getRebateData.RB_CAT_LIFE_INS_PREM.length === 1 ? false : true;
            this.table_1_List.clear();
            getRebateData.RB_CAT_LIFE_INS_PREM.forEach((element) => {
              this.totalOriginalLIP += Math.round(element.RB_PREM_PAID);
              this.totalSummaryLIP += Math.min((Math.round(element.RB_POLICY_VAL) * 0.1), Math.round(element.RB_PREM_PAID));
              this.table_1_List.push(this.fb.group({
                policyNumber: new FormControl(element.RB_POLICY_NUMBER),
                policyValue: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_POLICY_VAL)),
                insuranceCompany: new FormControl(element.RB_INS_COMPANY),
                premiumPaid: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_PREM_PAID)),
                allowableAmt_lip: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_ALLOWABLE_LIP)),
              }));
              this.initializeLIPValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_DPS) {
            this.rebateForm.controls.dps.setValue(true);
            this.chkDPS = true;
            this.isDpsDeleteActionShow = getRebateData.RB_CAT_DPS.length === 1 ? false : true;
            this.table_2_List.clear();
            getRebateData.RB_CAT_DPS.forEach(element => {
              this.totalOriginalDPS += Math.round(element.RB_DEPOSIT_AMT);
              this.totalSummaryDPS += Math.round(element.RB_ALLOWABLE_DPS);
              this.table_2_List.push(this.fb.group({
                bankorFI: new FormControl(element.RB_BANK_FI),
                accountNo: new FormControl(element.RB_ACC_NO),
                depositAmount: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_DEPOSIT_AMT)),
                allowableAmt_dps: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_ALLOWABLE_DPS)),
              }));
              this.initializeDPSValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_APPR_SAVINGS_CERT) {
            this.rebateForm.controls.approvedSavingCertificate.setValue(true);
            this.chkApprovedSaving = true;
            this.isApprovedSavingDeleteActionShow = getRebateData.RB_CAT_APPR_SAVINGS_CERT.length === 1 ? false : true;
            this.table_3_List.clear();
            getRebateData.RB_CAT_APPR_SAVINGS_CERT.forEach(element => {
              this.totalSummaryASC += Math.round(element.RB_INVESTMENT_AMT);
              this.table_3_List.push(this.fb.group({
                name: new FormControl(element.RB_NM),
                issueDate: new FormControl(element.RB_DT),
                registrationNo: new FormControl(element.RB_REG_NO),
                investment: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_INVESTMENT_AMT)),
              }));
              this.initializeASCValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_GPF) {
            this.rebateForm.controls.generalProvidentFund.setValue(true);
            this.chkGPF = true;
            this.isGPFDeleteActionShow = getRebateData.RB_CAT_GPF.length === 1 ? false : true;
            this.table_4_List.clear();
            getRebateData.RB_CAT_GPF.forEach(element => {
              this.totalSummaryGPF += Math.round(element.RB_INVESTMENT_AMT);
              this.table_4_List.push(this.fb.group({
                gpfAccountNo: new FormControl(element.RB_ACC_NO),
                contribution: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_INVESTMENT_AMT)),
              }));
              this.initializeGPFValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM) {
            this.rebateForm.controls.benevolentFund.setValue(true);
            this.chkBenevolentFund = true;
            getRebateData.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM.forEach(element => {
              this.totalSummaryBF_GIP += Math.round(element.RB_BENEVOLENT_AMT) + Math.round(element.RB_INVESTMENT_AMT);
              this.rebateForm.patchValue(
                {
                  benevolentAmount: this.commaSeparator.currencySeparatorBD(element.RB_BENEVOLENT_AMT),
                  groupInsurancePremiumAmount: this.commaSeparator.currencySeparatorBD(element.RB_INVESTMENT_AMT),
                });

                this.initializeBenevolentFundValidatonArrayIndexes();

            })
          }
          if (getRebateData.RB_CAT_RPF) {
            this.rebateForm.controls.recognizedProvidentFund.setValue(true);
            this.chkRPF = true;
            this.isRPFDeleteActionShow = getRebateData.RB_CAT_RPF.length === 1 ? false : true;
            this.table_6_List.clear();
            getRebateData.RB_CAT_RPF.forEach(element => {
              this.totalSummaryRPF += Math.round(element.RB_SELF_CONTRIBUTION) + Math.round(element.RB_EMPLOYER_CONTRIBUTION);
              this.table_6_List.push(this.fb.group({
                employerName: new FormControl(element.RB_EMPLOYER_NM),
                selfContribution: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_SELF_CONTRIBUTION)),
                employerContribution: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_EMPLOYER_CONTRIBUTION)),
              }));
              this.initializeRPFValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_APPR_STOCKS_OR_SHARES) {
            this.rebateForm.controls.approvedStocks.setValue(true);
            this.chkApprovedStocks = true;
            this.isApprovedStocksDeleteActionShow = getRebateData.RB_CAT_APPR_STOCKS_OR_SHARES.length === 1 ? false : true;
            this.table_7_List.clear();
            getRebateData.RB_CAT_APPR_STOCKS_OR_SHARES.forEach(element => {
              this.totalSummaryAS_S += Math.round(element.RB_INVESTMENT_AMT);
              this.table_7_List.push(this.fb.group({
                boAccountNo: new FormControl(element.RB_BO_ACC_NO),
                brokerageHouseName: new FormControl(element.RB_BR_HOUSE_NM),
                investmentDuringtheYear: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_INVESTMENT_AMT)),
              }));
              this.initializeASSValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_OTHERS_INVESTMENT_U_6_B) {
            this.rebateForm.controls.others.setValue(true);
            this.rebateForm.controls.investmentUnder6Schedule.setValue(true);
            this.chkOthers = true;
            this.isShow = true;
            this.chkInvestmentUnder6Schedule = true;
            this.isInvestmentUnder6ScheduleDeleteActionShow = getRebateData.RB_CAT_OTHERS_INVESTMENT_U_6_B.length === 1 ? false : true;
            this.table_8_List.clear();
            getRebateData.RB_CAT_OTHERS_INVESTMENT_U_6_B.forEach(element => {
              this.totalSummary_Other1 += Math.round(element.RB_INVESTMENT_AMT);
              this.table_8_List.push(this.fb.group({
                paragraphNumber: new FormControl(element.RB_PARA_NUM),
                description: new FormControl(element.RB_DESCRIPTION),
                amount: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_INVESTMENT_AMT)),
              }));
              this.initializeOtherSchedule6ValidatonArrayIndexes();
            });
          }
          if (getRebateData.RB_CAT_OTHERS_SRO) {
            this.rebateForm.controls.others.setValue(true);
            this.rebateForm.controls.investmentUnderSRO.setValue(true);
            this.chkOthers = true;
            this.isShow = true;
            this.chkInvestmentUnderSRO = true;
            this.isInvestmentUnderSRODeleteActionShow = getRebateData.RB_CAT_OTHERS_SRO.length === 1 ? false : true;
            this.table_9_List.clear();
            getRebateData.RB_CAT_OTHERS_SRO.forEach(element => {
              this.totalSummary_Other2 += Math.round(element.RB_INVESTMENT_AMT);
              this.table_9_List.push(this.fb.group({
                sroNo: new FormControl(element.RB_SRO_NO),
                sroYear: new FormControl(element.RB_YR),
                sroDescription: new FormControl(element.RB_DESCRIPTION),
                sroAmount: new FormControl(this.commaSeparator.currencySeparatorBD(element.RB_INVESTMENT_AMT)),
              }));
              this.initializeOtherSROValidatonArrayIndexes();
            });
          }
          this.getRebateSumTotal();

        }
        else {
          this.insertIntoRebate();
          this.spinner.stop();
        }
      },
        error => {
          this.spinner.stop();
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
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

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
    this.lengthOfheads = this.selectedNavbar.length;
  }

  onLifeInsuranceChange(e) {
    this.chklifeInsurance = e.target.checked;
    this.isLifeInsuranceDeleteActionShow = false;
    if (!this.chklifeInsurance) 
    {
      this.table_1_List.clear();
      this.validateLIP = [];
      this.table_1_List.push(this.fb.group({
        policyNumber: new FormControl(),
        policyValue: new FormControl(),
        insuranceCompany: new FormControl(),
        premiumPaid: new FormControl(),
        allowableAmt_lip: new FormControl(),
      }));
      
      this.totalSummaryLIP = 0; this.totalOriginalLIP = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeLIPValidatonArrayIndexes();    
    }
  }

  onDpsChange(e) {
    this.chkDPS = e.target.checked;
    this.isDpsDeleteActionShow = false;
    if (!this.chkDPS) {
      this.validateDPS = [];
      this.table_2_List.clear();
      this.table_2_List.push(this.fb.group({
        bankorFI: new FormControl(),
        accountNo: new FormControl(),
        depositAmount: new FormControl(),
        allowableAmt_dps: new FormControl(),
      }));
      this.totalSummaryDPS = 0; this.totalOriginalDPS = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeDPSValidatonArrayIndexes();    
    }
  }

  onApprovedSavingChange(e) {
    this.chkApprovedSaving = e.target.checked;
    this.isApprovedSavingDeleteActionShow = false;
    if (!this.chkApprovedSaving) {
      this.validateASC = [];
      this.table_3_List.clear();
      this.table_3_List.push(this.fb.group({
        name: new FormControl(),
        issueDate: new FormControl(),
        registrationNo: new FormControl(),
        investment: new FormControl(),
      }));
      this.totalSummaryASC = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeASCValidatonArrayIndexes();    
    }
  }

  onGPFChange(e) {
    this.chkGPF = e.target.checked;
    this.isGPFDeleteActionShow = false;
    if (!this.chkGPF) {
      this.validateGPF = [];
      this.table_4_List.clear();
      this.table_4_List.push(this.fb.group({
        gpfAccountNo: new FormControl(),
        contribution: new FormControl(),
      }));
      this.totalSummaryGPF = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeGPFValidatonArrayIndexes();    
    }
  }

  onBenevolentFundChange(e) {
    this.chkBenevolentFund = e.target.checked;
    this.isBenevolentFundDeleteActionShow = false;

    if (!this.chkBenevolentFund) {
      this.validateBF_GIP = [];
      // this.table_5_List.clear();
      // this.table_5_List.push(this.fb.group({
      //   benevolentAmount: new FormControl(),
      //   groupInsurancePremiumAmount: new FormControl(),

      // }));
      this.rebateForm.patchValue(
        {
          benevolentAmount: '',
          groupInsurancePremiumAmount: '',
        });
      this.totalSummaryBF_GIP = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeBenevolentFundValidatonArrayIndexes();
    }
  }

  onRPFChange(e) {
    this.chkRPF = e.target.checked;
    this.isRPFDeleteActionShow = false;
    if (!this.chkRPF) {
      this.validateRPF = [];
      this.table_6_List.clear();
      this.table_6_List.push(this.fb.group({
        employerName: new FormControl(),
        selfContribution: new FormControl(),
        employerContribution: new FormControl(),
      }));
      this.totalSummaryRPF = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeRPFValidatonArrayIndexes();    
    }
  }

  onApprovedStocksChange(e) {
    this.chkApprovedStocks = e.target.checked;
    this.isApprovedStocksDeleteActionShow = false;

    if (!this.chkApprovedStocks) {
      this.validateASS = [];
      this.table_7_List.clear();
      this.table_7_List.push(this.fb.group({
        boAccountNo: new FormControl(),
        brokerageHouseName: new FormControl(),
        investmentDuringtheYear: new FormControl(),
      }));
      this.totalSummaryAS_S = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeASSValidatonArrayIndexes();    
    }
  }

  onOthersChange(e) {
    this.isShow = true;
    this.chkOthers = e.target.checked;

    if (!this.chkOthers) {
      this.rebateForm.controls.investmentUnder6Schedule.setValue(false);
      this.rebateForm.controls.investmentUnderSRO.setValue(false);
      this.chkInvestmentUnder6Schedule = false;
      this.chkInvestmentUnderSRO = false;
      this.isShow = false;
      this.table_8_List.clear();
      this.validateOther_schedule6 =[];
      this.table_8_List.push(this.fb.group({
        paragraphNumber: new FormControl(),
        description: new FormControl(),
        amount: new FormControl(),
      }));

      this.table_9_List.clear();
      this.validateOther_SRO = [];
      this.table_9_List.push(this.fb.group({
        sroNo: new FormControl(),
        sroYear: new FormControl(),
        sroDescription: new FormControl(),
        sroAmount: new FormControl(),
      }));

      this.totalSummary_Other1 = 0;
      this.totalSummary_Other2 = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeOtherSchedule6ValidatonArrayIndexes(); 
      this.initializeOtherSROValidatonArrayIndexes();   
    }
  }
  onInvestmentUnder6ScheduleChange(e) {
    this.chkInvestmentUnder6Schedule = e.target.checked;
    this.isInvestmentUnder6ScheduleDeleteActionShow = false;

    if (!this.chkInvestmentUnder6Schedule) {
      this.table_8_List.clear();
      this.validateOther_schedule6 =[];
      this.table_8_List.push(this.fb.group({
        paragraphNumber: new FormControl(),
        description: new FormControl(),
        amount: new FormControl(),
      }));
      this.totalSummary_Other1 = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeOtherSchedule6ValidatonArrayIndexes();    
    }
  }
  onInvestmentUnderSROChange(e) {
    this.chkInvestmentUnderSRO = e.target.checked;
    this.isInvestmentUnderSRODeleteActionShow = false;

    if (!this.chkInvestmentUnderSRO) {
      this.table_9_List.clear();
      this.validateOther_SRO = [];
      this.table_9_List.push(this.fb.group({
        sroNo: new FormControl(),
        sroYear: new FormControl(),
        sroDescription: new FormControl(),
        sroAmount: new FormControl(),
      }));
      this.totalSummary_Other2 = 0;
      this.getRebateSumTotal();
    }
    else
    {
      this.initializeOtherSROValidatonArrayIndexes();    
    }
  }

  // policyValueValided(event:any,i)
  // {
  //    let number = parseFloat(event.target.value);
  //    {
  //      if (number<0) {
  //       this.table_1_List.controls[i].patchValue({
  //         policyValue: 1,
  //       });

  //         this.toastr.warning('Negative value not accepted');
  //         return;
  //      }
  //    }
  // }

  validedParagraphNo(paragraphNo, i) {
    const regularExpression = /^[0-9][a-zA-Z0-9]*$/;
    // console.log(regularExpression.test(String(paragraphNo).toLowerCase()));
    this.isParagraphValidationSuccessful = regularExpression.test(String(paragraphNo).toLowerCase());
    if (!this.isParagraphValidationSuccessful) {
      this.toastr.warning("Paragraph no will always starts with a number like '11' or '11A'");
      this.table_8_List.controls[i].patchValue({
        paragraphNumber: ''
      })
    }
  }

  // LIP VALIDATION PROGRAM START 

  changeLIP(i, formControlName) {
    if (formControlName === 'policyNumber')
    this.validateLIP[i].policyNumber_showError = false;
    if (formControlName === 'insuranceCompany')
    this.validateLIP[i].insuranceCompany_showError = false;
    if (formControlName === 'policyValue')
    this.validateLIP[i].policyValue_showError = false;
    if (formControlName === 'premiumPaid')
    this.validateLIP[i].premiumPaid_showError = false;
  }

  initializeLIPValidatonArrayIndexes()
  {
    this.table_1_List.controls.forEach((element, index) => {
      let data = 
      {
       "policyNumber_showError" : false,
       "insuranceCompany_showError" : false,
       "policyValue_showError" : false,
       "premiumPaid_showError" : false
     }
     this.validateLIP.push(data);
    });
  }

  initializeLIPValidationError(i)
  {
    this.validateLIP[i].policyNumber_showError = false;
    this.validateLIP[i].insuranceCompany_showError = false;
    this.validateLIP[i].policyValue_showError = false;
    this.validateLIP[i].premiumPaid_showError = false;
  }
  
  validateLifeInsurancePremium() : boolean
  {
      let validationSuccess : boolean = true; 
      validationSuccess = true; 
      this.table_1_List.controls.forEach((element, index) => {
      this.initializeLIPValidationError(index);
      if(element.value.policyNumber == null || element.value.policyNumber == '' || element.value.policyNumber == 0)
      {
          this.validateLIP[index].policyNumber_showError = true;
          validationSuccess = false; 
      }
      if(element.value.insuranceCompany == null || element.value.insuranceCompany == '')
      {
          this.validateLIP[index].insuranceCompany_showError = true;
          validationSuccess = false;
      }
      if(element.value.policyValue == null || element.value.policyValue == '')
      {
          this.validateLIP[index].policyValue_showError = true;
          validationSuccess = false;
      }
      if(element.value.premiumPaid == null || element.value.premiumPaid == '')
      {
          this.validateLIP[index].premiumPaid_showError = true;
          validationSuccess = false;
      }
      })
      
      if(validationSuccess)
      return true;
      else
      return false;
  }

  // LIP VALIDATION PROGRAM END

    // DPS VALIDATION PROGRAM START 
    changeDPS(i, formControlName) 
    {
      if (formControlName === 'bankorFI')
      this.validateDPS[i].bankorFI_showError = false;
      if (formControlName === 'accountNo')
      this.validateDPS[i].accountNo_showError = false;
      if (formControlName === 'depositAmount')
      this.validateDPS[i].depositAmount_showError = false;
    }

    initializeDPSValidatonArrayIndexes()
    {
      this.table_2_List.controls.forEach((element, index) => {
        let data = 
        {
         "bankorFI_showError" : false,
         "accountNo_showError" : false,
         "depositAmount_showError" : false,
       }
       this.validateDPS.push(data);
      });
    }
  
    initializeDPSValidationError(i)
    {
      this.validateDPS[i].bankorFI_showError = false;
      this.validateDPS[i].accountNo_showError = false;
      this.validateDPS[i].depositAmount_showError = false;
    }
    
    validateDepositPensionScheme() : boolean
    {
        let validationSuccess : boolean = true; 
        validationSuccess = true; 
        this.table_2_List.controls.forEach((element, index) => {
        this.initializeDPSValidationError(index);
        if(element.value.bankorFI == null || element.value.bankorFI == '')
        {
            this.validateDPS[index].bankorFI_showError = true;
            validationSuccess = false; 
        }
        if(element.value.accountNo == null || element.value.accountNo == '')
        {
            this.validateDPS[index].accountNo_showError = true;
            validationSuccess = false;
        }
        if(element.value.depositAmount == null || element.value.depositAmount == '')
        {
            this.validateDPS[index].depositAmount_showError = true;
            validationSuccess = false;
        }
        })
        
        if(validationSuccess)
        return true;
        else
        return false;
    }
  
    // DPS VALIDATION PROGRAM END
     // ASC VALIDATION PROGRAM START 
     changeASC(i, formControlName) 
     {
       if (formControlName === 'name')
       this.validateASC[i].name_showError = false;
       if (formControlName === 'registrationNo')
       this.validateASC[i].registrationNo_showError = false;
       if (formControlName === 'issueDate')
       this.validateASC[i].issueDate_showError = false;
       if (formControlName === 'investment')
       this.validateASC[i].investment_showError = false;
     }
     initializeASCValidatonArrayIndexes()
     {
       this.table_3_List.controls.forEach((element, index) => {
         let data = 
         {
          "name_showError" : false,
          "registrationNo_showError" : false,
          "issueDate_showError" : false,
          "investment_showError" : false,
        }
        this.validateASC.push(data);
       });
     }
   
     initializeASCValidationError(i)
     {
       this.validateASC[i].name_showError = false;
       this.validateASC[i].registrationNo_showError = false;
       this.validateASC[i].issueDate_showError = false;
       this.validateASC[i].investment_showError = false;
     }
     
     validateApprovedSavingsCertificate() : boolean
     {
         let validationSuccess : boolean = true; 
         validationSuccess = true; 
         this.table_3_List.controls.forEach((element, index) => {
         this.initializeASCValidationError(index);
         if(element.value.name == null || element.value.name == '')
         {
             this.validateASC[index].name_showError = true;
             validationSuccess = false; 
         }
         if(element.value.registrationNo == null || element.value.registrationNo == '')
         {
             this.validateASC[index].registrationNo_showError = true;
             validationSuccess = false;
         }
         if(element.value.issueDate == null || element.value.issueDate == '')
         {
             this.validateASC[index].issueDate_showError = true;
             validationSuccess = false;
         }
         if(element.value.investment == null || element.value.investment == '')
         {
             this.validateASC[index].investment_showError = true;
             validationSuccess = false;
         }
         })
         
         if(validationSuccess)
         return true;
         else
         return false;
     }
   
     // ASC VALIDATION PROGRAM END
        // GPF VALIDATION PROGRAM START 
        changeGPF(i, formControlName) 
        {
          if (formControlName === 'gpfAccountNo')
          this.validateGPF[i].gpfAccountNo_showError = false;
          if (formControlName === 'contribution')
          this.validateGPF[i].contribution_showError = false;
        }
        initializeGPFValidatonArrayIndexes()
        {
          this.table_4_List.controls.forEach((element, index) => {
            let data = 
            {
             "gpfAccountNo_showError" : false,
             "contribution_showError" : false,
           }
           this.validateGPF.push(data);
          });
        }
      
        initializeGPFValidationError(i)
        {
          this.validateGPF[i].gpfAccountNo_showError = false;
          this.validateGPF[i].contribution_showError = false;
        }
        
        validateGeneralProvidentFund() : boolean
        {
            let validationSuccess : boolean = true; 
            validationSuccess = true; 
            this.table_4_List.controls.forEach((element, index) => {
            this.initializeGPFValidationError(index);
            if(element.value.gpfAccountNo == null || element.value.gpfAccountNo == '')
            {
                this.validateGPF[index].gpfAccountNo_showError = true;
                validationSuccess = false; 
            }
            if(element.value.contribution == null || element.value.contribution == '')
            {
                this.validateGPF[index].contribution_showError = true;
                validationSuccess = false;
            }
            })
            
            if(validationSuccess)
            return true;
            else
            return false;
        }
      
        // GPF VALIDATION PROGRAM END
               // RPF VALIDATION PROGRAM START 
               changeRPF(i, formControlName) 
               {
                 if (formControlName === 'employerName')
                 this.validateRPF[i].employerName_showError = false;
                 if (formControlName === 'selfContribution')
                 this.validateRPF[i].selfContribution_showError = false;
                 if (formControlName === 'employerContribution')
                 this.validateRPF[i].employerContribution_showError = false;
               }
               initializeRPFValidatonArrayIndexes()
               {
                 this.table_6_List.controls.forEach((element, index) => {
                   let data = 
                   {
                    "employerName_showError" : false,
                    "selfContribution_showError" : false,
                    "employerContribution_showError" : false,
                  }
                  this.validateRPF.push(data);
                 });
               }
             
               initializeRPFValidationError(i)
               {
                 this.validateRPF[i].employerName_showError = false;
                 this.validateRPF[i].selfContribution_showError = false;
                 this.validateRPF[i].employerContribution_showError = false;
               }
               
               validateRecognizedProvidentFund() : boolean
               {
                   let validationSuccess : boolean = true; 
                   validationSuccess = true; 
                   this.table_6_List.controls.forEach((element, index) => {
                   this.initializeRPFValidationError(index);
                   if(element.value.employerName == null || element.value.employerName == '')
                   {
                       this.validateRPF[index].employerName_showError = true;
                       validationSuccess = false; 
                   }
                   if(element.value.selfContribution == null || element.value.selfContribution == '')
                   {
                       this.validateRPF[index].selfContribution_showError = true;
                       validationSuccess = false;
                   }
                   if(element.value.employerContribution == null || element.value.employerContribution == '')
                   {
                       this.validateRPF[index].employerContribution_showError = true;
                       validationSuccess = false;
                   }
                   })
                   
                   if(validationSuccess)
                   return true;
                   else
                   return false;
               }
             
               // RPF VALIDATION PROGRAM END
                       // ASS VALIDATION PROGRAM START 
                       changeASS(i, formControlName) 
                       {    
                         if (formControlName === 'boAccountNo')
                         this.validateASS[i].boAccountNo_showError = false;
                         if (formControlName === 'brokerageHouseName')
                         this.validateASS[i].brokerageHouseName_showError = false;
                         if (formControlName === 'investmentDuringtheYear')
                         this.validateASS[i].investmentDuringtheYear_showError = false;
                       }
             initializeASSValidatonArrayIndexes()
             {
               this.table_7_List.controls.forEach((element, index) => {
                 let data = 
                 {
                  "boAccountNo_showError" : false,
                  "brokerageHouseName_showError" : false,
                  "investmentDuringtheYear_showError" : false,
                }
                this.validateASS.push(data);
               });
             }
           
             initializeASSValidationError(i)
             {
               this.validateASS[i].boAccountNo_showError = false;
               this.validateASS[i].brokerageHouseName_showError = false;
               this.validateASS[i].investmentDuringtheYear_showError = false;
             }
             
             validateApprovedStocksShares() : boolean
             {
                 let validationSuccess : boolean = true; 
                 validationSuccess = true; 
                 this.table_7_List.controls.forEach((element, index) => {
                 this.initializeASSValidationError(index);
                 if(element.value.boAccountNo == null || element.value.boAccountNo == '')
                 {
                     this.validateASS[index].boAccountNo_showError = true;
                     validationSuccess = false; 
                 }
                 if(element.value.brokerageHouseName == null || element.value.brokerageHouseName == '')
                 {
                     this.validateASS[index].brokerageHouseName_showError = true;
                     validationSuccess = false;
                 }
                 if(element.value.investmentDuringtheYear == null || element.value.investmentDuringtheYear == '')
                 {
                     this.validateASS[index].investmentDuringtheYear_showError = true;
                     validationSuccess = false;
                 }
                 })
                 
                 if(validationSuccess)
                 return true;
                 else
                 return false;
             }
           
             // ASS VALIDATION PROGRAM END
               // Other Schedule 6 VALIDATION PROGRAM START 
               changeOtherSchedule6(i, formControlName) 
               {    
                 if (formControlName === 'paragraphNumber')
                 this.validateOther_schedule6[i].paragraphNumber_showError = false;
                 if (formControlName === 'description')
                 this.validateOther_schedule6[i].description_showError = false;
                 if (formControlName === 'amount')
                 this.validateOther_schedule6[i].amount_showError = false;
               }
               initializeOtherSchedule6ValidatonArrayIndexes()
               {
                 this.table_8_List.controls.forEach((element, index) => {
                   let data = 
                   {
                    "paragraphNumber_showError" : false,
                    "description_showError" : false,
                    "amount_showError" : false,
                  }
                  this.validateOther_schedule6.push(data);
                 });
               }
             
               initializeOtherSchedule6ValidationError(i)
               {
                 this.validateOther_schedule6[i].paragraphNumber_showError = false;
                 this.validateOther_schedule6[i].description_showError = false;
                 this.validateOther_schedule6[i].amount_showError = false;
               }
               
               validateOtherSchedule6() : boolean
               {
                   let validationSuccess : boolean = true; 
                   validationSuccess = true; 
                   this.table_8_List.controls.forEach((element, index) => {
                   this.initializeOtherSchedule6ValidationError(index);
                   if(element.value.paragraphNumber == null || element.value.paragraphNumber == '')
                   {
                       this.validateOther_schedule6[index].paragraphNumber_showError = true;
                       validationSuccess = false; 
                   }
                   if(element.value.description == null || element.value.description == '')
                   {
                       this.validateOther_schedule6[index].description_showError = true;
                       validationSuccess = false;
                   }
                   if(element.value.amount == null || element.value.amount == '')
                   {
                       this.validateOther_schedule6[index].amount_showError = true;
                       validationSuccess = false;
                   }
                   })
                   
                   if(validationSuccess)
                   return true;
                   else
                   return false;
               }
             
               // Other Schedule VALIDATION PROGRAM END
                // Other SRO VALIDATION PROGRAM START 
                changeOtherSRO(i, formControlName) 
                {    
                  if (formControlName === 'sroNo')
                  this.validateOther_SRO[i].sroNo_showError = false;
                  if (formControlName === 'sroYear')
                  this.validateOther_SRO[i].sroYear_showError = false;
                  if (formControlName === 'sroDescription')
                  this.validateOther_SRO[i].sroDescription_showError = false;
                  if (formControlName === 'sroAmount')
                  this.validateOther_SRO[i].sroAmount_showError = false;
                }
                initializeOtherSROValidatonArrayIndexes()
                {
                  this.table_9_List.controls.forEach((element, index) => {
                    let data = 
                    {
                     "sroNo_showError" : false,
                     "sroYear_showError" : false,
                     "sroDescription_showError" : false,
                     "sroAmount_showError" : false,
                   }
                   this.validateOther_SRO.push(data);
                  });
                }
              
                initializeOtherSROValidationError(i)
                {
                  this.validateOther_SRO[i].sroNo_showError = false;
                  this.validateOther_SRO[i].sroYear_showError = false;
                  this.validateOther_SRO[i].sroDescription_showError = false;
                  this.validateOther_SRO[i].sroAmount_showError = false;
                }
                
                validateOtherSRO() : boolean
                {
                    let validationSuccess : boolean = true; 
                    validationSuccess = true; 
                    this.table_9_List.controls.forEach((element, index) => {
                    this.initializeOtherSROValidationError(index);
                    if(element.value.sroNo == null || element.value.sroNo == '')
                    {
                        this.validateOther_SRO[index].sroNo_showError = true;
                        validationSuccess = false; 
                    }
                    if(element.value.sroYear == null || element.value.sroYear == '')
                    {
                        this.validateOther_SRO[index].sroYear_showError = true;
                        validationSuccess = false;
                    }
                    if(element.value.sroDescription == null || element.value.sroDescription == '')
                    {
                        this.validateOther_SRO[index].sroDescription_showError = true;
                        validationSuccess = false;
                    }
                    if(element.value.sroAmount == null || element.value.sroAmount == '')
                    {
                        this.validateOther_SRO[index].sroAmount_showError = true;
                        validationSuccess = false;
                    }
                    })
                    
                    if(validationSuccess)
                    return true;
                    else
                    return false;
                }
              
                // Other Schedule VALIDATION PROGRAM END
                  // Benevolent Fund & Group Insurance Premium
                  changeBenevolentFund(formControlName) 
                  {    
                    if (formControlName === 'benevolentAmount')
                    this.validateBF_GIP[0].benevolentAmount_showError = false;
                    if (formControlName === 'groupInsurancePremiumAmount')
                    this.validateBF_GIP[0].groupInsurancePremiumAmount_showError = false;
                  }
                  initializeBenevolentFundValidatonArrayIndexes()
                  {
                      let data = 
                      {
                       "benevolentAmount_showError" : false,
                       "groupInsurancePremiumAmount_showError" : false,
                     }
                     this.validateBF_GIP.push(data);
                  }
                  validateBenevolentFund() : boolean
                  {
                    let validationSuccess : boolean = true; 
                    validationSuccess = true; 
                    this.validateBF_GIP[0].benevolentAmount_showError = false; this.validateBF_GIP[0].groupInsurancePremiumAmount_showError = false;
                    if(this.commaSeparator.removeComma(this.rebateForm.controls['benevolentAmount'].value, 0) == null || this.commaSeparator.removeComma(this.rebateForm.controls['benevolentAmount'].value, 0) == '')
                    {
                      this.validateBF_GIP[0].benevolentAmount_showError = true;
                      validationSuccess = false;
                    }
                    if(this.commaSeparator.removeComma(this.rebateForm.controls['groupInsurancePremiumAmount'].value, 0) == null || this.commaSeparator.removeComma(this.rebateForm.controls['groupInsurancePremiumAmount'].value, 0) == '')
                    {
                      this.validateBF_GIP[0].groupInsurancePremiumAmount_showError = true;
                      validationSuccess = false;
                    }
                    if(validationSuccess)
                    return true;
                    else
                    return false;
                  }

  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }

  submittedData() {
    // debugger;
   let validateLifeInsurancePremium : any, validateDepositPensionScheme : any, validateApprovedSavingsCertificate : any, validateGeneralProvidentFund : any;
   let validateBenevolentFund : any,validateRecognizedProvidentFund : any ,validateApprovedStocksShares : any,validateOther_Schedule6 : any ,validateOther_UnderSRO : any; 

    let table_1_Obj = []; let table_2_Obj = []; let table_3_Obj = [];
    let table_4_Obj = []; let table_5_Obj = []; let table_6_Obj = [];
    let table_7_Obj = []; let table_8_Obj = []; let table_9_Obj = [];
    let requestJson: any;

    //select at least one investment categoty
    if(!(this.chklifeInsurance) && !(this.chkDPS) && !(this.chkApprovedSaving) && !(this.chkGPF) && !(this.chkBenevolentFund) && !(this.chkRPF) && !(this.chkApprovedStocks) && !(this.chkOthers && this.chkInvestmentUnder6Schedule) && !(this.chkOthers && this.chkInvestmentUnderSRO))
    {
      this.toastr.warning('Must select at least one investment category.', '', {
            timeOut: 2000,
          });
          return;
    }

    // TABLE-1
    if (!this.chklifeInsurance) this.table_1_List.clear();
    // validateLifeInsurancePremium = this.rebateValidationService.validateLifeInsurancePremium(this.table_1_List);  
    // validateLifeInsurancePremium = this.validateLifeInsurancePremium();
    if(this.chklifeInsurance && this.validateLifeInsurancePremium())
    {
      this.table_1_List.controls.forEach((element, index) => {
        let obj = {
          "RB_POLICY_NUMBER": element.value.policyNumber ? element.value.policyNumber : '',
          "RB_INS_COMPANY": element.value.insuranceCompany ? element.value.insuranceCompany : '',
          "RB_POLICY_VAL": element.value.policyValue ? this.commaSeparator.removeComma(element.value.policyValue, 0) : '',
          "RB_PREM_PAID": element.value.premiumPaid ? this.commaSeparator.removeComma(element.value.premiumPaid, 0) : '',
          "RB_ALLOWABLE_LIP": element.value.allowableAmt_lip ? this.commaSeparator.removeComma(element.value.allowableAmt_lip, 0) : '',
          "RB_PARTICULAR_NO": (index + 1),
        };
        table_1_Obj.push(obj);
      });
    }
    if(this.chklifeInsurance && !this.validateLifeInsurancePremium()) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
      return;
    }

    // TABLE -2
    if (!this.chkDPS) this.table_2_List.clear();
    // validateDepositPensionScheme = this.rebateValidationService.validateDepositPensionScheme(this.table_2_List); 
    if(this.chkDPS && this.validateDepositPensionScheme()){
      this.table_2_List.controls.forEach((element, index) => {
        let obj = {
          "RB_BANK_FI": element.value.bankorFI ? element.value.bankorFI : '',
          "RB_ACC_NO": element.value.accountNo ? element.value.accountNo : '',
          "RB_DEPOSIT_AMT": element.value.depositAmount ? this.commaSeparator.removeComma(element.value.depositAmount, 0) : '',
          "RB_ALLOWABLE_DPS": element.value.allowableAmt_dps ? this.commaSeparator.removeComma(element.value.allowableAmt_dps, 0) : '',
          "RB_PARTICULAR_NO": (index + 1),
        };
        table_2_Obj.push(obj);
      });
    }
    if(this.chkDPS && !this.validateDepositPensionScheme()) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
      return;
    }

    // TABLE -3
    if (!this.chkApprovedSaving) this.table_3_List.clear();
    // validateApprovedSavingsCertificate = this.rebateValidationService.validateSavingCertificate(this.table_3_List); 
    if(this.chkApprovedSaving && this.validateApprovedSavingsCertificate()){
      this.table_3_List.controls.forEach((element, index) => {
        let issueDate = element.value.issueDate ? moment(element.value.issueDate, 'DD-MM-YYYY') : '';
  
        let obj = {
          "RB_NM": element.value.name ? element.value.name : '',
          "RB_REG_NO": element.value.registrationNo ? element.value.registrationNo : '',
          "RB_DT": issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
          "RB_INVESTMENT_AMT": element.value.investment ? this.commaSeparator.removeComma(element.value.investment, 0) : '',
          "RB_PARTICULAR_NO": (index + 1),
        };
        table_3_Obj.push(obj);
      });
    }
    if(this.chkApprovedSaving && !this.validateApprovedSavingsCertificate()) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
      return;
    }

    // TABLE -4
    if (!this.chkGPF) this.table_4_List.clear();
    // validateGeneralProvidentFund = this.rebateValidationService.validateGeneralProvidentFund(this.table_4_List); 
    if(this.chkGPF && this.validateGeneralProvidentFund()){
    this.table_4_List.controls.forEach((element, index) => {
      let obj = {
        "RB_ACC_NO": element.value.gpfAccountNo ? element.value.gpfAccountNo : '',
        "RB_INVESTMENT_AMT": element.value.contribution ? this.commaSeparator.removeComma(element.value.contribution, 0) : '',
        "RB_PARTICULAR_NO": (index + 1),
      };
      table_4_Obj.push(obj);
    });
  }

  if(this.chkGPF && !this.validateGeneralProvidentFund()) {
    this.toastr.warning('Please fill all the required fields!', '', {
      timeOut: 2000,
    });
    return;
  }

    // TABLE -5
    //if (!this.chkBenevolentFund) this.table_5_List.clear();
    // this.table_5_List.controls.forEach((element, index) => {
    //   let obj = {
    //     "RB_BENEVOLENT_AMT": element.value.benevolentAmount ? this.commaSeparator.removeComma(element.value.benevolentAmount,0) : '',
    //     "RB_INVESTMENT_AMT": element.value.groupInsurancePremiumAmount ? this.commaSeparator.removeComma(element.value.groupInsurancePremiumAmount,0) : '',
    //     "RB_PARTICULAR_NO": (index + 1),
    //   };this.expenditureForm.get("expenseFoodClothingAmt").value


    
    let RB_BENEVOLENT = {
      "RB_BENEVOLENT_AMT": this.commaSeparator.removeComma(this.rebateForm.controls['benevolentAmount'].value, 0),
      "RB_INVESTMENT_AMT": this.commaSeparator.removeComma(this.rebateForm.controls['groupInsurancePremiumAmount'].value, 0),
      // "RB_PARTICULAR_NO": (index + 1),
      "RB_PARTICULAR_NO": "",
    };
    if(this.chkBenevolentFund && this.validateBenevolentFund())
    {
      // validateBenevolentFund = this.rebateValidationService.validateBenevolentFund(RB_BENEVOLENT); 
        table_5_Obj.push(RB_BENEVOLENT);
    }
  
    if(this.chkBenevolentFund && !this.validateBenevolentFund()) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
      return;
    }


    // if (parseInt(RB_BENEVOLENT.RB_BENEVOLENT_AMT) > 0 || parseInt(RB_BENEVOLENT.RB_INVESTMENT_AMT) > 0)
      

    // TABLE -6
    if (!this.chkRPF) this.table_6_List.clear();
    //validateRecognizedProvidentFund = this.rebateValidationService.validateRecognizedProvidentFund(this.table_6_List); 
    if(this.chkRPF && this.validateRecognizedProvidentFund()){
    this.table_6_List.controls.forEach((element, index) => {
      let obj = {
        "RB_EMPLOYER_NM": element.value.employerName ? element.value.employerName : '',
        "RB_SELF_CONTRIBUTION": element.value.selfContribution ? this.commaSeparator.removeComma(element.value.selfContribution, 0) : '',
        "RB_EMPLOYER_CONTRIBUTION": element.value.employerContribution ? this.commaSeparator.removeComma(element.value.employerContribution, 0) : '',
        "RB_PARTICULAR_NO": (index + 1),
      };
      table_6_Obj.push(obj);
    });
  }
  if(this.chkRPF && !this.validateRecognizedProvidentFund()) {
    this.toastr.warning('Please fill all the required fields!', '', {
      timeOut: 2000,
    });
    return;
  }
    // TABLE -7
    if (!this.chkApprovedStocks) this.table_7_List.clear();
    // validateApprovedStocksShares = this.rebateValidationService.validateApprovedStocksShares(this.table_7_List); 
    if(this.chkApprovedStocks && this.validateApprovedStocksShares()){
    this.table_7_List.controls.forEach((element, index) => {
      let obj = {
        "RB_BO_ACC_NO": element.value.boAccountNo ? element.value.boAccountNo : '',
        "RB_BR_HOUSE_NM": element.value.brokerageHouseName ? element.value.brokerageHouseName : '',
        "RB_INVESTMENT_AMT": element.value.investmentDuringtheYear ? this.commaSeparator.removeComma(element.value.investmentDuringtheYear, 0) : '',
        "RB_PARTICULAR_NO": (index + 1),
      };
      table_7_Obj.push(obj);
    });
  }
  if(this.chkApprovedStocks && !this.validateApprovedStocksShares()) {
    this.toastr.warning('Please fill all the required fields!', '', {
      timeOut: 2000,
    });
    return;
  }



    // TABLE -8
    // if((!this.chkOthers) || (this.chkOthers && !this.chkInvestmentUnder6Schedule) && (this.chkOthers && !this.chkInvestmentUnderSRO)){
    //   this.toastr.warning('Must select at least one investment category.', '', {
    //     timeOut: 2000,
    //   });
    //   return;
    // }

    if (!this.chkOthers && !this.chkInvestmentUnder6Schedule) this.table_8_List.clear();
    if (this.chkOthers && !this.chkInvestmentUnder6Schedule) this.table_8_List.clear();
    // validateOther_Schedule6 = this.rebateValidationService.validateOther_schedule6(this.table_8_List); 
    if(this.chkOthers && this.chkInvestmentUnder6Schedule && this.validateOtherSchedule6()){
    this.table_8_List.controls.forEach((element, index) => {
      let obj = {
        "RB_PARA_NUM": element.value.paragraphNumber ? element.value.paragraphNumber : '',
        "RB_DESCRIPTION": element.value.description ? element.value.description : '',
        "RB_INVESTMENT_AMT": element.value.amount ? this.commaSeparator.removeComma(element.value.amount, 0) : '',
        "RB_PARTICULAR_NO": (index + 1),
      };
      table_8_Obj.push(obj);
    });
  }

  if(this.chkOthers && this.chkInvestmentUnder6Schedule && !this.validateOtherSchedule6()) {
    this.toastr.warning('Please fill all the required fields!', '', {
      timeOut: 2000,
    });
    return;
  }

    // TABLE -9
    if (!this.chkOthers && !this.chkInvestmentUnderSRO) this.table_9_List.clear();
    if (this.chkOthers && !this.chkInvestmentUnderSRO) this.table_9_List.clear();
    // validateOther_UnderSRO = this.rebateValidationService.validateOther_UnderSRO(this.table_9_List); 
    if(this.chkOthers && this.chkInvestmentUnderSRO && this.validateOtherSRO()){
    this.table_9_List.controls.forEach((element, index) => {
      let sroYr = element.value.sroYear ? moment(element.value.sroYear, 'YYYY') : '';
      let obj = {
        "RB_SRO_NO": element.value.sroNo ? element.value.sroNo : '',
        "RB_YR": sroYr ? this.datepipe.transform(sroYr, 'yyyy') : '',
        "RB_DESCRIPTION": element.value.sroDescription ? element.value.sroDescription : '',
        "RB_INVESTMENT_AMT": element.value.sroAmount ? this.commaSeparator.removeComma(element.value.sroAmount, 0) : '',
        "RB_PARTICULAR_NO": (index + 1),
      };
      table_9_Obj.push(obj);
    });
  }

  if(this.chkOthers && this.chkInvestmentUnderSRO && !this.validateOtherSRO()) {
    this.toastr.warning('Please fill all the required fields!', '', {
      timeOut: 2000,
    });
    return;
  }

    requestJson = {
      "RB_CAT_LIFE_INS_PREM": table_1_Obj ? table_1_Obj : [],
      "RB_CAT_DPS": table_2_Obj ? table_2_Obj : [],
      "RB_CAT_APPR_SAVINGS_CERT": table_3_Obj ? table_3_Obj : [],
      "RB_CAT_GPF": table_4_Obj ? table_4_Obj : [],
      "RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM": table_5_Obj ? table_5_Obj : [],
      "RB_CAT_RPF": table_6_Obj ? table_6_Obj : [],
      "RB_CAT_APPR_STOCKS_OR_SHARES": table_7_Obj ? table_7_Obj : [],
      "RB_CAT_OTHERS_INVESTMENT_U_6_B": table_8_Obj ? table_8_Obj : [],
      "RB_CAT_OTHERS_SRO": table_9_Obj ? table_9_Obj : [],
    }
    // console.log('rebate req json', requestJson);
    //POST API
    this.apiService.post(this.serviceUrl + 'api/user-panel/rebate', requestJson)
      .subscribe(result => {
        if (result != null && !this.isSaveDraft) {
          this.toastr.success('Data Saved Successfully!', '', {
            timeOut: 1000,
          });
          this.selectedNavbar.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/rebate') {
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
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onBackPage() {
    this.selectedNavbar.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/rebate') {
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

  getBasicDearnessAlwSalary() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/salaries/rebate-validation')
      .subscribe(result => {
        // console.log('basic and dareness alw', result.basicAndDearnessAlwSum);
        this.basic_dearness_alw = result.basicAndDearnessAlwSum;
      })
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
              this.isNotReturnSubmit = false;
              this.toastr.error('You already submitted your return in online.', '', {
                timeOut: 3000,
              });
            } else if ((result.replyMessage).returnSubmissionType == "OFFLINE") {
              this.isNotReturnSubmit = true;
            }
            resolve();
          }
          else {
            this.spinner.stop();
            this.isNotReturnSubmit = true;
            resolve();
          }
        },
          error => {
            reject();
            this.spinner.stop();
           // console.log(error['error'].errorMessage);
          });
    });
  }


}
