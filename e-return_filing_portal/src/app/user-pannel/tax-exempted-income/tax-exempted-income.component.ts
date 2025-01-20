import { CommonUtilService } from './../../service/utils/common-utils';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tax-exempted-income',
  templateUrl: './tax-exempted-income.component.html',
  styleUrls: ['./tax-exempted-income.component.css']
})
export class TaxExemptedIncomeComponent implements OnInit {

  taxExemptedIncomeType: any = `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;

  // taxExemptedForm: FormGroup;
  group: FormGroup;
  formArray: FormArray;
  userTin: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  requestIncomeHeadGetData: any;
  requestNavbarGetData: any;

  isVisibleForm: any;
  headsOfIncome = [];
  lengthOfheads: any;
  isSaveDraft: boolean = false;

  isVisibleIncomeTab: boolean = true;
  isVisibleAddAnotherTypeBtn: boolean = false;

  html: any = `<span class="btn-block well-sm " style="margin-left: 20px">No Tooltip Found!</span>`;

  modalRef: BsModalRef;

  navActive = {};

  formGroup: FormGroup;
  additionalInformationForm: FormGroup;

  incomeTypeName = [];
  getResponseData: any;

  minDate: any;
  maxDate: any;

  minYear: any;
  maxYear: any;

  isAlertSectionShow: boolean = false;
  alertMessage: any;

  //salary
  isInterestonGPFHidden: boolean = false;
  isPensionHidden: boolean = false;
  isGratuityHidden: boolean = false;
  isInterestonRPFHidden: boolean = false;

  //ifos
  isDividendfromListedCompanyHidden: boolean = false;
  isIncomefromMutualUnitFundHidden: boolean = false;

  //Agriculture
  isExemptedLimitfromAgricultureHidden: boolean = false;

  //validation arrays
  taxExemptedIncomeType_showError = [];
  totalRemittedAmt_showError = [];
  countryOfEarning_showError = [];
  srcOfIncome_showError = [];
  nameOfEmployer_showError = [];
  modeOfRemittance_showError = [];
  bankMoneyTransferAgency_showError = [];
  acName_showError = [];
  acNumber_showError = [];
  customsAuthority_showError = [];
  fmgFormSertial_showError = [];
  decDate_showError = [];
  passportNo_showError = [];
  //
  BOIDNo_showError = [];
  brogerageHouseName_showError = [];
  portfolioStatementRef_showError = [];
  refDate_showError = [];
  grossRealizedGain_showError = [];
  relatedExpenses_showError = [];
  //
  typeOfHandicrafts_showError = [];
  businessTypeName_showError = [];
  businessName_showError = [];
  BusinessAddress_showError = [];
  salesTurnoverReceipt_showError = [];
  grossProfit_showError = [];
  generalAdminisSell_showError = [];
  cashInHand_showError = [];
  inventories_showError = [];
  fixedAsset_showError = [];
  otherAsset_showError = [];
  openingCapital_showError = [];
  withdrawals_showError = [];
  liabilities_showError = [];
  //
  nameOfBond_showError = [];
  issueNo_showError = [];
  issueDate_showError = [];
  issuingOffice_showError = [];
  value_showError = [];
  dateOfMaturity_showError = [];
  grossInterest_showError = [];
  //
  particulars_showError = [];
  nameOfOrg_showError = [];
  rewardRefNo_showError = [];
  // refDate_showError= [];
  RewardAmount_showError = [];
  //
  paragraphNo_showError = [];
  // particulars_showError= [];
  receiptRefNo_showError = [];
  amtOfIncome_showError = [];
  //
  sroNo_showError = [];
  year_showError = [];
  DescriptionNo_showError = [];
  dateOfMaturityFrom  = [];
  dateValidation =[];
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

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.spinner.start();
    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.navActiveSelect("9");
    this.getHeadsOfIncome();
    this.isVisibleAddAnotherTypeBtn = true;
    this.getMainNavbar();
    this.mainNavActiveSelect("2");

    this.minDate = new Date(2020, 6, 1);
    this.maxDate = new Date(2021, 5, 30);

    this.minYear = new Date(1972, 0, 1);
    this.maxYear = new Date();
    this.maxYear.setDate(this.maxYear.getDate());

    this.insertFormGroupToArray();

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion


    this.salaryFieldChecking();
    this.IFOS_Checking();
    this.hasAnyIncomeChecking();
    this.getExemptedData();
    this.checkSubmissionStatus();
    this.spinner.stop();
  }



  insertFormGroupToArray() {
    this.group = new FormGroup({
      PARTICULAR_ID: new FormControl(0),
      taxExemptedIncomeType: new FormControl(0),
      incomeTypeName: new FormControl(""),

      // Transfer of Share of Listed Company
      boIdNo: new FormControl(),
      brokerageHouseName: new FormControl(),
      portfolioStatementReferenceNo: new FormControl(),
      transferShareReferenceDate: new FormControl(),
      grossRealizedGain: new FormControl(),
      relatedExpenses: new FormControl(),
      netRealizedGain: new FormControl(),

      //Foreign Remittance
      totalRemittedAmount: new FormControl(),
      sourceofIncome: new FormControl(),
      countryofEarning: new FormControl(),
      nameoftheEmployer: new FormControl(),
      modeofRemittance: new FormControl(0),
      bankMoneyTransferAgencyName: new FormControl(),
      accountNumber: new FormControl(),
      accountName: new FormControl(),
      customAuthority: new FormControl(),
      formSerialNo: new FormControl(),
      declarationDate: new FormControl(),
      passportNo: new FormControl(),
      taxExemptedIncome: new FormControl(),

      //Rewards from the Government
      particulars: new FormControl(),
      nameoftheOrganization: new FormControl(),
      rewardReferenceNo: new FormControl(),
      rewardReferenceDate: new FormControl(),
      rewardAmount: new FormControl(),

      //Tax Exempted Bond or Securities
      nameoftheBondSecurity: new FormControl(),
      issueNo: new FormControl(),
      issueDate: new FormControl(),
      issuingOffice: new FormControl(),
      value: new FormControl(),
      dateofMaturity: new FormControl(),
      grossInterest: new FormControl(),
      bondRelatedExpense: new FormControl(),
      bondTaxExemptedIncome: new FormControl(),

      //Software and IT Business
      typeofBusiness: new FormControl(0),

      //Other Exemption under 6th Schedule Part A
      paragraphNo: new FormControl(0),
      otherExemptionParticulars: new FormControl(),
      receiptReferenceNo: new FormControl(),
      otherExemptionReferenceDate: new FormControl(),
      amountofIncome: new FormControl(),
      otherExemptionRelatedExpense: new FormControl(),
      otherExemptionBondTaxExemptedIncome: new FormControl(),

      //Export of Handicrafts
      typeofHandicrafts: new FormControl(),

      //Other Exemption by SRO
      sroNo: new FormControl(),
      year: new FormControl(),
      sroDescription: new FormControl(),
      sroReceiptReferenceNo: new FormControl(),
      sroReferenceDate: new FormControl(),
      sroAmountofIncome: new FormControl(),
      sroRelatedExpense: new FormControl(),
      sroTaxExemptedIncome: new FormControl(),


      //business

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
    this.selectedTaxExemptedIncome(this.formArray.length - 1);
  }

  addNewHead() {
    this.isMandatoryFieldEmpty = false;
    // this.ValidationChecker();
    if (!this.isMandatoryFieldEmpty) {
      this.insertFormGroupToArray();
    }
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
      transferShareReferenceDate: new FormControl(""),
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

  salaryFieldChecking() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/salaries/tax-exempted-income-head-validation')
      .subscribe(result => {
        // console.log('salaryCheck', result);
        if (result.length > 0) {
          result.forEach(element => {
            if (element === 'IS_GRATUITY') {
              this.isGratuityHidden = true;
            }
            else if (element === 'IS_GPF_INTEREST') {
              this.isInterestonGPFHidden = true;
            }
            else if (element === 'IS_PENSION') {
              this.isPensionHidden = true;
            }
            else if (element === 'IS_INTEREST_ACCRUED_RPF') {
              this.isInterestonRPFHidden = true;
            }
          });
        }
      },
        error => {
          this.spinner.stop();
         // console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  IFOS_Checking() {
    let ifosRequestGetData: any;
    ifosRequestGetData =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-ifos-data')
      .subscribe(result => {
        if (result.length > 0) {
          result.forEach(element => {
            if (element.ifosTypeName === "dividend_from_listed_company") {
              this.isDividendfromListedCompanyHidden = true;
            }
            else if (element.ifosTypeName === "income_from_mutual_unit_fund") {
              this.isIncomefromMutualUnitFundHidden = true;
            }
          });

        }
      },
        error => {
          this.spinner.stop();
       //   console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  hasAnyIncomeChecking() {
    if (localStorage.getItem('hasAnyIncome') == 'true') {
      this.isExemptedLimitfromAgricultureHidden = true;
    }
    else if (localStorage.getItem('hasAnyIncome') == 'false') {
      this.isExemptedLimitfromAgricultureHidden = false;
    }
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

  navActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.navActive = x;
  }

  selectedTaxExemptedIncome(i: number) {
    this.isVisibleForm = i;
    this.getTEITooltips(this.formArray.controls[i].value.taxExemptedIncomeType)
  }

  clearValueOnTypeChange(i) {

    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        this.formArray.controls[i].patchValue({
          PARTICULAR_ID: this.formArray.controls[i].value.PARTICULAR_ID ? this.formArray.controls[i].value.PARTICULAR_ID : 0,
          taxExemptedIncome: '',
          netRealizedGain: '',
          netProfit_1: '',
          bondTaxExemptedIncome: '',
          rewardAmount: '',
          otherExemptionBondTaxExemptedIncome: '',
          sroTaxExemptedIncome: '',


          //2 - foreign_remittance
          totalRemittedAmount: '',
          countryofEarning: '',
          sourceofIncome: '',
          nameoftheEmployer: '',
          modeofRemittance: 0,
          bankMoneyTransferAgencyName: '',
          accountName: '',
          accountNumber: '',
          customAuthority: '',
          formSerialNo: '',
          declarationDate: '',
          passportNo: '',

          //2 - transfer_of_share_of_listed_company
          boIdNo: '',
          brokerageHouseName: '',
          portfolioStatementReferenceNo: '',
          transferShareReferenceDate: '',
          grossRealizedGain: '',
          relatedExpenses: '',

          //3 -software_and_it_business && 4 - export_of_handicrafts
          typeofBusiness: 0,
          typeofHandicrafts: '',
          businessName: '',
          businessAddress: '',
          salesTurnoverReceipts: '',
          grossProfit: '',
          generalAdminisSellingAndOther: '',
          isMaintainedBookOfAC: '1',
          cashInHandandAtBank: '',
          inventories: '',
          fixedAssets: '',
          otherAssets: '',
          totalAssets: '',
          openingCapital: '',
          netProfit_2: '',
          withdrawalIncomeYear: '',
          closingCapital: '',
          liabilities: '',
          totalCapitalandLiabilities: '',

          //5 - tax_exempted_bond_or_securities
          nameoftheBondSecurity: '',
          issueNo: '',
          issueDate: '',
          issuingOffice: '',
          dateofMaturity: '',
          value: '',
          grossInterest: '',
          bondRelatedExpense: '',

          //6 - government_welfare_allowance
          particulars: '',
          nameoftheOrganization: '',
          rewardReferenceNo: '',
          rewardReferenceDate: '',

          //7 - other_exemption_under_sixth_schedule_part_a
          paragraphNo: 0,
          otherExemptionParticulars: '',
          receiptReferenceNo: '',
          otherExemptionReferenceDate: '',
          amountofIncome: '',
          otherExemptionRelatedExpense: '',

          //8 - sro
          sroNo: '',
          year: '',
          sroDescription: '',
          sroReceiptReferenceNo: '',
          sroReferenceDate: '',
          sroAmountofIncome: '',
          sroRelatedExpense: '',
        });
      }
    })
  }

  taxExemptedIncomeTypeChange(event, i) {
    this.getTEITooltips(event.target.value);
    this.clearValueOnTypeChange(i);
    this.initializeErrorIndexes(i);
    if (event.target.value != '0') {
      this.isVisibleIncomeTab = false;
      this.isVisibleAddAnotherTypeBtn = false;
      this.incomeTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
    } else {
      this.incomeTypeName[i] = '';
      this.isVisibleForm = false;
    }
    this.formArray.controls[i].patchValue({
      incomeTypeName: this.incomeTypeName,
    });
  }

  onChangeParagraphNo(event: any, i) {
    this.paragraphNo_showError[i] = false;
    // if (event.target.value ==='4') {
    //   this.isAlertSectionShow=true;
    //   this.alertMessage='Please do not input here, if already included in Salaries/Income from Other Sources';
    // }
    // else
    if (event.target.value === '7') {
      this.isAlertSectionShow = true;
      this.alertMessage = 'Please do not input here, if already included in Salaries head';
    }
    // else if (event.target.value === '8') {
    //   this.isAlertSectionShow = true;
    //   this.alertMessage = 'Please do not input here, if already included in Salaries head';
    // }
    // else if (event.target.value === '11A') {
    //   this.isAlertSectionShow = true;
    //   this.alertMessage = "Please do not input here, if already included in 'Income from Other Sources' head";
    // }
    else if (event.target.value === '18') {
      this.isAlertSectionShow = true;
      this.alertMessage = "Please do not input here, if already included in Firm income page";
    }
    else if (event.target.value === '19') {
      this.isAlertSectionShow = false;
      this.alertMessage = '';
    }
    // else if (event.target.value ==='20') {
    //   this.isAlertSectionShow=true;
    //   this.alertMessage='Please do not input here, if already included in Salaries head';
    // }
    else if (event.target.value === '21') {
      this.isAlertSectionShow = true;
      this.alertMessage = "Please do not input here, if already included in Salaries/Income from Other Sources";
    }
    // else if (event.target.value === '22A') {
    //   this.isAlertSectionShow = true;
    //   this.alertMessage = "Please do not input here, if already included in 'Income from Other Sources' head";
    // }
    // else if (event.target.value ==='25') {
    //   this.isAlertSectionShow=true;
    //   this.alertMessage="Please do not input here, if already included in Salaries head";
    // }
    else if (event.target.value === '26') {
      this.isAlertSectionShow = true;
      this.alertMessage = "Please do not input here, if already included in Salaries head";
    }
    else if (event.target.value === '27') {
      this.isAlertSectionShow = true;
      this.alertMessage = "Please ensure that the necessary conditions are met";
    }
    // else if (event.target.value === '29') {
    //   this.isAlertSectionShow = true;
    //   this.alertMessage = "Please do not input here, if already included in 'Agriculture' head";
    // }
    else if (event.target.value === '44') {
      this.isAlertSectionShow = true;
      this.alertMessage = "Please ensure that the necessary conditions are met";
    }
    else if (event.target.value === '45') {
      this.isAlertSectionShow = true;
      this.alertMessage = "Please ensure that the necessary conditions are met";
    }
    // else if (event.target.value ==='56') {
    //   this.isAlertSectionShow=true;
    //   this.alertMessage="Please merge as 'Rewards/Welfare Allowance from the Government'";
    // }
    else if (event.target.value === '58') {
      this.isAlertSectionShow = false;
      this.alertMessage = '';
    }
    else if (event.target.value === 'Other') {
      this.isAlertSectionShow = false;
      this.alertMessage = '';
    }
    else {
      this.isAlertSectionShow = false;
      this.alertMessage = '';
    }

    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        this.formArray.controls[i].patchValue({
          amountofIncome: '',
          otherExemptionRelatedExpense: '',
          otherExemptionBondTaxExemptedIncome: '',
        });
      }
    })
  }

  // close(i) {
  //   this.formArray.removeAt(i);
  //   this.incomeTypeName.splice(i, 1);
  //   if (this.formArray.length >= 1) {
  //     this.isVisibleForm = this.formArray.controls.length - 1;
  //     this.modalRef.hide();
  //   }
  //   else if (this.formArray.length < 1) {
  //     this.isVisibleForm = 0;
  //     this.insertFormGroupToArray();
  //     this.modalRef.hide();
  //     this.isVisibleIncomeTab = true;
  //     this.isVisibleAddAnotherTypeBtn = true;
  //   }
  //   else {

  //   }
  // }

  close(i) {
    this.formArray.controls.forEach((element, index) => {
      if (i == index && element.value.PARTICULAR_ID > 0) {
        let reqObj =
        {
          "tinNo": this.userTin,
          "assessmentYear": "2021-2022",
          "particularId": element.value.PARTICULAR_ID
        }
        this.apiService.post(this.serviceUrl + 'api/user-panel/tax-exempted-income-deleteItem', reqObj)
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
      else if (i == index && element.value.PARTICULAR_ID == 0) {
        this.afterTabClose(i);
      }
    });
    //end
  }

  afterTabClose(i) {
    this.formArray.removeAt(i);
    this.incomeTypeName.splice(i, 1);
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
    this.taxExemptedIncomeType_showError[i] = false;
    this.totalRemittedAmt_showError[i] = false;
    this.countryOfEarning_showError[i] = false;
    this.srcOfIncome_showError[i] = false;
    this.nameOfEmployer_showError[i] = false;
    this.modeOfRemittance_showError[i] = false;
    this.bankMoneyTransferAgency_showError[i] = false;
    this.acName_showError[i] = false;
    this.acNumber_showError[i] = false;
    this.customsAuthority_showError[i] = false;
    this.fmgFormSertial_showError[i] = false;
    this.decDate_showError[i] = false;
    this.passportNo_showError[i] = false;
    //
    this.BOIDNo_showError[i] = false;
    this.brogerageHouseName_showError[i] = false;
    this.portfolioStatementRef_showError[i] = false;
    this.refDate_showError[i] = false;
    this.grossRealizedGain_showError[i] = false;
    this.relatedExpenses_showError[i] = false;
    //
    this.typeOfHandicrafts_showError[i] = false;
    this.businessTypeName_showError[i] = false;
    this.businessName_showError[i] = false;
    this.BusinessAddress_showError[i] = false;
    this.salesTurnoverReceipt_showError[i] = false;
    this.grossProfit_showError[i] = false;
    this.generalAdminisSell_showError[i] = false;
    this.cashInHand_showError[i] = false;
    this.inventories_showError[i] = false;
    this.fixedAsset_showError[i] = false;
    this.otherAsset_showError[i] = false;
    this.openingCapital_showError[i] = false;
    this.withdrawals_showError[i] = false;
    this.liabilities_showError[i] = false;
    //
    this.nameOfBond_showError[i] = false;
    this.issueNo_showError[i] = false;
    this.issueDate_showError[i] = false;
    this.issuingOffice_showError[i] = false;
    this.value_showError[i] = false;
    this.dateOfMaturity_showError[i] = false;
    this.grossInterest_showError[i] = false;
    //
    this.particulars_showError[i] = false;
    this.nameOfOrg_showError[i] = false;
    this.rewardRefNo_showError[i] = false;
    // refDate_showError[i] = false;
    this.RewardAmount_showError[i] = false;
    //
    this.paragraphNo_showError[i] = false;
    // particulars_showError[i] = false;
    this.receiptRefNo_showError[i] = false;
    this.amtOfIncome_showError[i] = false;
    //
    this.sroNo_showError[i] = false;
    this.year_showError[i] = false;
    this.DescriptionNo_showError[i] = false;

    //
    this.dateValidation[i] = false;
  }

  closeErrorIndexes(i) {
    this.taxExemptedIncomeType_showError.splice(i, 1);
    this.totalRemittedAmt_showError.splice(i, 1);
    this.countryOfEarning_showError.splice(i, 1);
    this.srcOfIncome_showError.splice(i, 1);
    this.nameOfEmployer_showError.splice(i, 1);
    this.modeOfRemittance_showError.splice(i, 1);
    this.bankMoneyTransferAgency_showError.splice(i, 1);
    this.acName_showError.splice(i, 1);
    this.acNumber_showError.splice(i, 1);
    this.customsAuthority_showError.splice(i, 1);
    this.fmgFormSertial_showError.splice(i, 1);
    this.decDate_showError.splice(i, 1);
    this.passportNo_showError.splice(i, 1);
    //
    this.BOIDNo_showError.splice(i, 1);
    this.brogerageHouseName_showError.splice(i, 1);
    this.portfolioStatementRef_showError.splice(i, 1);
    this.refDate_showError.splice(i, 1);
    this.grossRealizedGain_showError.splice(i, 1);
    this.relatedExpenses_showError.splice(i, 1);
    //
    this.typeOfHandicrafts_showError.splice(i, 1);
    this.businessTypeName_showError.splice(i, 1);
    this.businessName_showError.splice(i, 1);
    this.BusinessAddress_showError.splice(i, 1);
    this.salesTurnoverReceipt_showError.splice(i, 1);
    this.grossProfit_showError.splice(i, 1);
    this.generalAdminisSell_showError.splice(i, 1);
    this.cashInHand_showError.splice(i, 1);
    this.inventories_showError.splice(i, 1);
    this.fixedAsset_showError.splice(i, 1);
    this.otherAsset_showError.splice(i, 1);
    this.openingCapital_showError.splice(i, 1);
    this.withdrawals_showError.splice(i, 1);
    this.liabilities_showError.splice(i, 1);
    //
    this.nameOfBond_showError.splice(i, 1);
    this.issueNo_showError.splice(i, 1);
    this.issueDate_showError.splice(i, 1);
    this.issuingOffice_showError.splice(i, 1);
    this.value_showError.splice(i, 1);
    this.dateOfMaturity_showError.splice(i, 1);
    this.grossInterest_showError.splice(i, 1);
    //
    this.particulars_showError.splice(i, 1);
    this.nameOfOrg_showError.splice(i, 1);
    this.rewardRefNo_showError.splice(i, 1);
    // refDate_showError.splice(i, 1);
    this.RewardAmount_showError.splice(i, 1);
    //
    this.paragraphNo_showError.splice(i, 1);
    // particulars_showError.splice(i, 1);
    this.receiptRefNo_showError.splice(i, 1);
    this.amtOfIncome_showError.splice(i, 1);
    //
    this.sroNo_showError.splice(i, 1);
    this.year_showError.splice(i, 1);
    this.DescriptionNo_showError.splice(i, 1);

    //
    this.dateValidation.splice(i, 1);
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }


  ValidationChecker() {

    this.formArray.controls.forEach((element, index) => {

      //foreign_remittance

      if ((element.value.totalRemittedAmount ?
        !element.value.totalRemittedAmount.trim() : !element.value.totalRemittedAmount) &&
        element.value.taxExemptedIncomeType === 'foreign_remittance' && !this.isMandatoryFieldEmpty) {

        this.isMandatoryFieldEmpty = true;
        document.getElementById('totalRemittedAmount').focus();
        this.toastr.warning('Total Remitted Amount is Empty! Please Fill It.', '', {
          timeOut: 2000,
        });

      } else if ((element.value.countryofEarning ?
        !element.value.countryofEarning.trim() : !element.value.countryofEarning) &&
        element.value.taxExemptedIncomeType === 'foreign_remittance' && !this.isMandatoryFieldEmpty) {

        this.isMandatoryFieldEmpty = true;
        document.getElementById('countryofEarning').focus();
        this.toastr.warning('Country of Earning is Empty! Please Fill It.', '', {
          timeOut: 2000,
        });

      }
      else if ((element.value.sourceofIncome ?
        !element.value.sourceofIncome.trim() : !element.value.sourceofIncome) &&
        element.value.taxExemptedIncomeType === 'foreign_remittance' && !this.isMandatoryFieldEmpty) {

        this.isMandatoryFieldEmpty = true;
        document.getElementById('sourceofIncome').focus();
        this.toastr.warning('Source of Income is Empty! Please Fill It.', '', {
          timeOut: 2000,
        });

      }

      else if ((element.value.modeofRemittance !== "0") &&
        element.value.taxExemptedIncomeType === 'foreign_remittance' && !this.isMandatoryFieldEmpty) {

        if (element.value.modeofRemittance === "Banking_Channel") {

          if (element.value.bankMoneyTransferAgencyName ?
            !element.value.bankMoneyTransferAgencyName.trim() : !element.value.bankMoneyTransferAgencyName) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('bankMoneyTransferAgencyName').focus();
            this.toastr.warning('Bank/Money Transfer Agency Name is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }
          else if (element.value.accountName ?
            !element.value.accountName.trim() : !element.value.accountName) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('accountName').focus();
            this.toastr.warning('Account Name is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }
          else if (element.value.accountNumber ?
            !element.value.accountNumber.trim() : !element.value.accountNumber) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('accountNumber').focus();
            this.toastr.warning('Account Number is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }

        }
        else if (element.value.modeofRemittance === "Foreign_Currency_Declaration_at_Customs_Point") {

          if (element.value.customAuthority ?
            !element.value.customAuthority.trim() : !element.value.customAuthority) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('customAuthority').focus();
            this.toastr.warning('Bank/Money Transfer Agency Name is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }
          else if (element.value.customAuthority ?
            !element.value.customAuthority.trim() : !element.value.customAuthority) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('customAuthority').focus();
            this.toastr.warning('Custom Authority is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }
          else if (element.value.formSerialNo ?
            !element.value.formSerialNo.trim() : !element.value.formSerialNo) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('formSerialNo').focus();
            this.toastr.warning('FMJ Form Serial No. is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }
          else if (element.value.declarationDate) {

            CommonUtilService.dateValidator('06-08-2021'); //complete this function

            // if(!CommonUtilService.dateValidator(element.value.declarationDate))
            //   this.toastr.warning('Declaration Date is Empty! Please Fill It.', '', {
            //     timeOut: 2000,
            //   });

            // this.isMandatoryFieldEmpty = true;
            // console.log(element.value.declarationDate);
            // console.log(this.datepipe.transform(element.value.declarationDate, 'dd-MM-yyyy'));
            // document.getElementById('declarationDate').focus();
            // this.toastr.warning('Declaration Date is Empty! Please Fill It.', '', {
            //   timeOut: 2000,
            // });

          }
          else if (element.value.passportNo ?
            !element.value.passportNo.trim() : !element.value.passportNo) {

            this.isMandatoryFieldEmpty = true;
            document.getElementById('passportNo').focus();
            this.toastr.warning('Passport No. is Empty! Please Fill It.', '', {
              timeOut: 2000,
            });

          }

        }

      }

    });

  }

  isMandatoryFieldEmpty: boolean = false;


  validateTaxExemptedIncome(): any {
    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if (element.value.taxExemptedIncomeType === 0) {
        this.taxExemptedIncomeType_showError[index] = true;
        successValidation = false;
      }
      if (element.value.taxExemptedIncomeType === 'foreign_remittance') {
        if (element.value.totalRemittedAmount == null || element.value.totalRemittedAmount == '') {
          this.totalRemittedAmt_showError[index] = true;
          successValidation = false;
        }
        if (element.value.countryofEarning == null || element.value.countryofEarning == '') {
          this.countryOfEarning_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sourceofIncome == null || element.value.sourceofIncome == '') {
          this.srcOfIncome_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance == null || element.value.modeofRemittance === 0) {
          this.modeOfRemittance_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Banking_Channel' && (element.value.bankMoneyTransferAgencyName == null || element.value.bankMoneyTransferAgencyName == '')) {
          this.bankMoneyTransferAgency_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Banking_Channel' && (element.value.accountName == null || element.value.accountName == '')) {
          this.acName_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Banking_Channel' && (element.value.accountNumber == null || element.value.accountNumber == '')) {
          this.acNumber_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Foreign_Currency_Declaration_at_Customs_Point' && (element.value.customAuthority == null || element.value.customAuthority == '')) {
          this.customsAuthority_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Foreign_Currency_Declaration_at_Customs_Point' && (element.value.formSerialNo == null || element.value.formSerialNo == '')) {
          this.fmgFormSertial_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Foreign_Currency_Declaration_at_Customs_Point' && (element.value.declarationDate == null || element.value.declarationDate == '')) {
          this.decDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.modeofRemittance === 'Foreign_Currency_Declaration_at_Customs_Point' && (element.value.passportNo == null || element.value.passportNo == '')) {
          this.passportNo_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.taxExemptedIncomeType === 'transfer_of_share_of_listed_company') {
        if (element.value.boIdNo == null || element.value.boIdNo == '') {
          this.BOIDNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.brokerageHouseName == null || element.value.brokerageHouseName == '') {
          this.brogerageHouseName_showError[index] = true;
          successValidation = false;
        }
        if (element.value.portfolioStatementReferenceNo == null || element.value.portfolioStatementReferenceNo == '') {
          this.portfolioStatementRef_showError[index] = true;
          successValidation = false;
        }
        if (element.value.transferShareReferenceDate == null || element.value.transferShareReferenceDate == '') {
          this.refDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.grossRealizedGain == null || element.value.grossRealizedGain === '') {
          this.grossRealizedGain_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.taxExemptedIncomeType === 'tax_exempted_bond_or_securities') {

        if(element.value.issueDate != "" && element.value.dateofMaturity != "" && !this.checkMaturityDateIsGreaterThnIssueDate(element.value.issueDate,element.value.dateofMaturity))
        {
          //  this.toastr.warning('Date of maturity will always be greater than the issue date!');
           successValidation = false;
           this.dateValidation[index] = true;
        }

        if (element.value.nameoftheBondSecurity == null || element.value.nameoftheBondSecurity == '') {
          this.nameOfBond_showError[index] = true;
          successValidation = false;
        }
        if (element.value.issueNo == null || element.value.issueNo == '') {
          this.issueNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.issueDate == null || element.value.issueDate == '') {
          this.issueDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.issuingOffice == null || element.value.issuingOffice == '') {
          this.issuingOffice_showError[index] = true;
          successValidation = false;
        }
        if (element.value.value == null || element.value.value === '') {
          this.value_showError[index] = true;
          successValidation = false;
        }
        if (element.value.dateofMaturity == null || element.value.dateofMaturity === '') {
          this.dateOfMaturity_showError[index] = true;
          successValidation = false;
        }
        if (element.value.grossInterest == null || element.value.grossInterest === '') {
          this.grossInterest_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.taxExemptedIncomeType === 'government_welfare_allowance') {
        if (element.value.particulars == null || element.value.particulars == '') {
          this.particulars_showError[index] = true;
          successValidation = false;
        }
        if (element.value.nameoftheOrganization == null || element.value.nameoftheOrganization == '') {
          this.nameOfOrg_showError[index] = true;
          successValidation = false;
        }
        if (element.value.rewardReferenceNo == null || element.value.rewardReferenceNo == '') {
          this.rewardRefNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.rewardReferenceDate == null || element.value.rewardReferenceDate == '') {
          this.refDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.rewardAmount == null || element.value.rewardAmount === '') {
          this.RewardAmount_showError[index] = true;
          successValidation = false;
        }
      }

      if (element.value.taxExemptedIncomeType === 'other_exemption_under_sixth_schedule_part_a') {
        if (element.value.paragraphNo == null || element.value.paragraphNo == '') {
          this.paragraphNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.otherExemptionParticulars == null || element.value.otherExemptionParticulars == '') {
          this.particulars_showError[index] = true;
          successValidation = false;
        }
        if (element.value.receiptReferenceNo == null || element.value.receiptReferenceNo == '') {
          this.receiptRefNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.otherExemptionReferenceDate == null || element.value.otherExemptionReferenceDate == '') {
          this.refDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.amountofIncome == null || element.value.amountofIncome === '') {
          this.amtOfIncome_showError[index] = true;
          successValidation = false;
        }
      }

      if (element.value.taxExemptedIncomeType === 'other_exemption_by_sro') {
        if (element.value.sroNo == null || element.value.sroNo == '') {
          this.sroNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.year == null || element.value.year == '') {
          this.year_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sroDescription == null || element.value.sroDescription == '') {
          this.DescriptionNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sroReceiptReferenceNo == null || element.value.sroReceiptReferenceNo == '') {
          this.receiptRefNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sroReferenceDate == null || element.value.sroReferenceDate === '') {
          this.refDate_showError[index] = true;
          successValidation = false;
        }
        if (element.value.sroAmountofIncome == null || element.value.sroAmountofIncome === '') {
          this.amtOfIncome_showError[index] = true;
          successValidation = false;
        }
      }


      if (element.value.taxExemptedIncomeType === 'software_and_it_business' || element.value.taxExemptedIncomeType === 'export_of_handicrafts') {
        if (element.value.taxExemptedIncomeType === 'export_of_handicrafts' && (element.value.typeofHandicrafts == '' || element.value.typeofHandicrafts == null)) {
          this.typeOfHandicrafts_showError[index] = true;
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
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.cashInHandandAtBank == '' || element.value.cashInHandandAtBank == null)) {
          this.cashInHand_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.inventories == '' || element.value.inventories == null)) {
          this.inventories_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.fixedAssets == '' || element.value.fixedAssets == null)) {
          this.fixedAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.otherAssets == '' || element.value.otherAssets == null)) {
          this.otherAsset_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.openingCapital == '' || element.value.openingCapital == null)) {
          this.openingCapital_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.withdrawalIncomeYear == '' || element.value.withdrawalIncomeYear == null)) {
          this.withdrawals_showError[index] = true;
          successValidation = false;
        }
        if (element.value.isMaintainedBookOfAC === '1' && (element.value.liabilities == '' || element.value.liabilities == null)) {
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
   // debugger;
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.formArray.controls.forEach((element, index) => {
      if (element.value.taxExemptedIncomeType == 0 && !isFoundErrorIndex && this.taxExemptedIncomeType_showError[index]) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.taxExemptedIncomeType == 'foreign_remittance' && !isFoundErrorIndex && (this.totalRemittedAmt_showError[index] || this.countryOfEarning_showError[index]
        || this.srcOfIncome_showError[index] || this.modeOfRemittance_showError[index] || this.bankMoneyTransferAgency_showError[index] || this.acNumber_showError[index] || this.acName_showError[index]
        || this.customsAuthority_showError[index] || this.fmgFormSertial_showError[index] || this.decDate_showError[index] || this.passportNo_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.taxExemptedIncomeType == 'transfer_of_share_of_listed_company' && !isFoundErrorIndex && (this.BOIDNo_showError[index] || this.brogerageHouseName_showError[index]
        || this.portfolioStatementRef_showError[index] || this.refDate_showError[index] || this.grossRealizedGain_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

      if (element.value.taxExemptedIncomeType == 'tax_exempted_bond_or_securities' && !isFoundErrorIndex && (this.dateValidation[index] || this.nameOfBond_showError[index] || this.issueNo_showError[index]  || this.issueDate_showError[index]
        || this.issuingOffice_showError[index] || this.value_showError[index] || this.dateOfMaturity_showError[index] || this.grossInterest_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

      if (element.value.taxExemptedIncomeType == 'government_welfare_allowance' && !isFoundErrorIndex && (this.particulars_showError[index] || this.nameOfOrg_showError[index]  || this.rewardRefNo_showError[index]
        || this.refDate_showError[index] || this.RewardAmount_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

      if (element.value.taxExemptedIncomeType == 'other_exemption_under_sixth_schedule_part_a' && !isFoundErrorIndex && (this.paragraphNo_showError[index] || this.particulars_showError[index]  || this.receiptRefNo_showError[index]
        || this.refDate_showError[index] || this.amtOfIncome_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

      if (element.value.taxExemptedIncomeType == 'other_exemption_by_sro' && !isFoundErrorIndex && (this.sroNo_showError[index] || this.year_showError[index]  || this.receiptRefNo_showError[index] || this.DescriptionNo_showError[index]
        || this.refDate_showError[index] || this.amtOfIncome_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }

        if(element.value.taxExemptedIncomeType === 'software_and_it_business'  &&  element.value.isMaintainedBookOfAC === '0' && !isFoundErrorIndex &&  (this.businessTypeName_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index] || this.salesTurnoverReceipt_showError[index]
          || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index]))
        {
          errorIndex = index;
          isFoundErrorIndex = true;
        }
        if(element.value.taxExemptedIncomeType === 'software_and_it_business' &&  element.value.isMaintainedBookOfAC === '1' && !isFoundErrorIndex &&  (this.businessTypeName_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index] || this.salesTurnoverReceipt_showError[index]
          || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index] || this.cashInHand_showError[index] || this.inventories_showError[index] || this.fixedAsset_showError[index] || this.otherAsset_showError[index] || this.openingCapital_showError[index] || this.withdrawals_showError[index] || this.liabilities_showError[index]))
        {
          errorIndex = index;
          isFoundErrorIndex = true;
        }

        if(element.value.taxExemptedIncomeType === 'export_of_handicrafts'  &&  element.value.isMaintainedBookOfAC === '0' && !isFoundErrorIndex &&  (this.typeOfHandicrafts_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index] || this.salesTurnoverReceipt_showError[index]
          || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index]))
        {
          errorIndex = index;
          isFoundErrorIndex = true;
        }
        if(element.value.taxExemptedIncomeType === 'export_of_handicrafts' &&  element.value.isMaintainedBookOfAC === '1' && !isFoundErrorIndex &&  (this.typeOfHandicrafts_showError[index] || this.businessName_showError[index] || this.BusinessAddress_showError[index] || this.salesTurnoverReceipt_showError[index]
          || this.grossProfit_showError[index] || this.generalAdminisSell_showError[index] || this.cashInHand_showError[index] || this.inventories_showError[index] || this.fixedAsset_showError[index] || this.otherAsset_showError[index] || this.openingCapital_showError[index] || this.withdrawals_showError[index] || this.liabilities_showError[index]))
        {
          errorIndex = index;
          isFoundErrorIndex = true;
        }
 
    })
    return errorIndex;
  }
  submittedData() {
    // this.isMandatoryFieldEmpty = false;
    // this.ValidationChecker();
    //if(!this.isMandatoryFieldEmpty) {

    let validateTaxExemptedIncome: any;
    validateTaxExemptedIncome = this.validateTaxExemptedIncome();
    if (!validateTaxExemptedIncome.validate) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 2000,
      });
    //  console.log('test exempted visible form', validateTaxExemptedIncome.indexNo);
      this.isVisibleForm = validateTaxExemptedIncome.indexNo;
      return;
    }
    //post api
    let requestJson = [];
    let isSuccess: boolean = true;
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach((element, index) => {
        if (element.value.taxExemptedIncomeType === 0 && isSuccess) {
          this.toastr.warning('This type is empty! Please select or remove this.', '', {
            timeOut: 3000,
          });
          this.isVisibleForm = index;
          isSuccess = false;
          return;
        }
      });
      if (!isSuccess) return;

      this.formArray.controls.forEach((element, index) => {

        let sroYr = element.value.year ? moment(element.value.year, 'YYYY') : '';
        let declarationDate = element.value.declarationDate ? moment(element.value.declarationDate, 'DD-MM-YYYY') : '';
        let transferShareReferenceDate = element.value.transferShareReferenceDate ? moment(element.value.transferShareReferenceDate, 'DD-MM-YYYY') : '';
        let issueDate = element.value.issueDate ? moment(element.value.issueDate, 'DD-MM-YYYY') : '';
        let dateofMaturity = element.value.dateofMaturity ? moment(element.value.dateofMaturity, 'DD-MM-YYYY') : '';
        let rewardReferenceDate = element.value.rewardReferenceDate ? moment(element.value.rewardReferenceDate, 'DD-MM-YYYY') : '';
        let otherExemptionReferenceDate = element.value.otherExemptionReferenceDate ? moment(element.value.otherExemptionReferenceDate, 'DD-MM-YYYY') : '';
        let sroReferenceDate = element.value.sroReferenceDate ? moment(element.value.sroReferenceDate, 'DD-MM-YYYY') : '';

        let exemptedIncome = 0;
        if (element.value.taxExemptedIncomeType === 'foreign_remittance') exemptedIncome = element.value.taxExemptedIncome ? Number(this.commaSeparator.extractComma(element.value.taxExemptedIncome)) : 0;
        else if (element.value.taxExemptedIncomeType === 'transfer_of_share_of_listed_company') exemptedIncome = element.value.netRealizedGain ? Number(this.commaSeparator.extractComma(element.value.netRealizedGain)) : 0;
        else if (element.value.taxExemptedIncomeType === 'software_and_it_business') exemptedIncome = element.value.netProfit_1 ? Number(this.commaSeparator.extractComma(element.value.netProfit_1)) : 0;
        else if (element.value.taxExemptedIncomeType === 'export_of_handicrafts') exemptedIncome = element.value.netProfit_1 ? Number(this.commaSeparator.extractComma(element.value.netProfit_1)) : 0;
        else if (element.value.taxExemptedIncomeType === 'tax_exempted_bond_or_securities') exemptedIncome = element.value.bondTaxExemptedIncome ? Number(this.commaSeparator.extractComma(element.value.bondTaxExemptedIncome)) : 0;
        else if (element.value.taxExemptedIncomeType === 'government_welfare_allowance') exemptedIncome = element.value.rewardAmount ? Number(this.commaSeparator.extractComma(element.value.rewardAmount)) : 0;
        else if (element.value.taxExemptedIncomeType === 'other_exemption_under_sixth_schedule_part_a') exemptedIncome = element.value.otherExemptionBondTaxExemptedIncome ? Number(this.commaSeparator.extractComma(element.value.otherExemptionBondTaxExemptedIncome)) : 0;
        else if (element.value.taxExemptedIncomeType === 'other_exemption_by_sro') exemptedIncome = element.value.sroTaxExemptedIncome ? Number(this.commaSeparator.extractComma(element.value.sroTaxExemptedIncome)) : 0;



        //debugger;
        let obj = {
          //0 - common
          "TEI_TYPE": element.value.taxExemptedIncomeType ? element.value.taxExemptedIncomeType : '',
          "TEI_TAX_EXEMPTED_INCOME": exemptedIncome,

          //1 - foreign_remittance
          "TEI_TOTAL_REMITTED_AMOUNT": element.value.totalRemittedAmount ? this.commaSeparator.extractComma(element.value.totalRemittedAmount) : 0,
          "TEI_COUNTRY_OF_EARNING": element.value.countryofEarning ? element.value.countryofEarning : '',
          "TEI_SOURCE_OF_INCOME": element.value.sourceofIncome ? element.value.sourceofIncome : '',
          "TEI_NAME_OF_THE_EMPLOYER": element.value.nameoftheEmployer ? element.value.nameoftheEmployer : '',
          "TEI_MODE_OF_REMITTANCE": element.value.modeofRemittance ? element.value.modeofRemittance : '0',
          "TEI_BANK_MONEY_TRANSFER_AGENCY_NAME": element.value.bankMoneyTransferAgencyName ? element.value.bankMoneyTransferAgencyName : '',
          "TEI_ACCOUNT_NAME": element.value.accountName ? element.value.accountName : '',
          "TEI_ACCOUNT_NUMBER": element.value.accountNumber ? element.value.accountNumber : '',
          "TEI_CUSTOM_AUTHORITY": element.value.customAuthority ? element.value.customAuthority : '',
          "TEI_FORM_SERIAL_NO": element.value.formSerialNo ? element.value.formSerialNo : '',
          "TEI_DECLARATION_DATE": declarationDate ? this.datepipe.transform(declarationDate, 'dd-MM-yyyy') : '',
          "TEI_PASSPORT_NO": element.value.passportNo ? element.value.passportNo : '',

          //2 - transfer_of_share_of_listed_company
          "TEI_BO_ID_NO": element.value.boIdNo ? element.value.boIdNo : '',
          "TEI_BROKERAGE_HOUSE_NAME": element.value.brokerageHouseName ? element.value.brokerageHouseName : '',
          "TEI_PORTFOLIO_STATEMENT_REFERENCE_NO": element.value.portfolioStatementReferenceNo ? element.value.portfolioStatementReferenceNo : '',
          "TEI_TRANSFER_SHARE_REFERENCE_DATE": transferShareReferenceDate ? this.datepipe.transform(transferShareReferenceDate, 'dd-MM-yyyy') : '',
          "TEI_GROSS_REALIZED_GAIN": element.value.grossRealizedGain ? this.commaSeparator.extractComma(element.value.grossRealizedGain) : 0,
          "TEI_RELATED_EXPENSES": element.value.relatedExpenses ? this.commaSeparator.extractComma(element.value.relatedExpenses) : 0,


          //3 -software_and_it_business && 4 - export_of_handicrafts
          "TEI_TYPE_OF_BUSINESS": element.value.typeofBusiness ? element.value.typeofBusiness : '0',
          "TEI_TYPE_OF_HANDICRAFTS": element.value.typeofHandicrafts ? element.value.typeofHandicrafts : '',
          "TEI_BUSINESS_NAME": element.value.businessName ? element.value.businessName : '',
          "TEI_BUSINESS_ADDRESS": element.value.businessAddress ? element.value.businessAddress : '',

          "TEI_SALES_TURNOVER_RECEIPTS": element.value.salesTurnoverReceipts ? this.commaSeparator.extractComma(element.value.salesTurnoverReceipts) : 0,
          "TEI_GROSS_PROFIT": element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0,
          "TEI_GENERAL_ADMIN_IS_SELLING_AND_OTHER": element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0,
          "TEI_IS_MAINTAINED_BOOK_OF_AC": element.value.isMaintainedBookOfAC ? element.value.isMaintainedBookOfAC : '1',
          "TEI_CASH_IN_HAND_AND_AT_BANK": element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : 0,
          "TEI_INVENTORIES": element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : 0,
          "TEI_FIXED_ASSETS": element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : 0,
          "TEI_OTHER_ASSETS": element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : 0,
          "TEI_TOTAL_ASSETS": element.value.totalAssets ? this.commaSeparator.extractComma(element.value.totalAssets) : 0,
          "TEI_OPENING_CAPITAL": element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0,
          "TEI_NET_PROFIT_2": element.value.netProfit_2 ? this.commaSeparator.extractComma(element.value.netProfit_2) : 0,
          "TEI_WITHDRAWAL_INCOME_YEAR": element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0,
          "TEI_CLOSING_CAPITAL": element.value.closingCapital ? this.commaSeparator.extractComma(element.value.closingCapital) : 0,
          "TEI_LIABILITIES": element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0,
          "TEI_TOTAL_CAPITAL_AND_LIABILITIES": element.value.totalCapitalandLiabilities ? this.commaSeparator.extractComma(element.value.totalCapitalandLiabilities) : 0,

          //5 - tax_exempted_bond_or_securities
          "TEI_NAME_OF_THE_BOND_SECURITY": element.value.nameoftheBondSecurity ? element.value.nameoftheBondSecurity : '',
          "TEI_ISSUE_NO": element.value.issueNo ? element.value.issueNo : '',
          "TEI_ISSUE_DATE": issueDate ? this.datepipe.transform(issueDate, 'dd-MM-yyyy') : '',
          "TEI_ISSUING_OFFICE": element.value.issuingOffice ? element.value.issuingOffice : '',
          "TEI_VALUE": element.value.value ? this.commaSeparator.extractComma(element.value.value) : 0,
          "TEI_DATE_OF_MATURITY": dateofMaturity ? this.datepipe.transform(dateofMaturity, 'dd-MM-yyyy') : '',
          "TEI_GROSS_INTEREST": element.value.grossInterest ? this.commaSeparator.extractComma(element.value.grossInterest) : 0,
          "TEI_RELATED_EXPENSE": element.value.bondRelatedExpense ? this.commaSeparator.extractComma(element.value.bondRelatedExpense) : 0,

          //6 - government_welfare_allowance
          "TEI_PARTICULARS": element.value.particulars ? element.value.particulars : '',
          "TEI_NAME_OF_THE_ORGANIZATION": element.value.nameoftheOrganization ? element.value.nameoftheOrganization : '',
          "TEI_REWARD_REFERENCE_NO": element.value.rewardReferenceNo ? element.value.rewardReferenceNo : '',
          "TEI_REWARD_REFERENCE_DATE": rewardReferenceDate ? this.datepipe.transform(rewardReferenceDate, 'dd-MM-yyyy') : '',

          //7 - other_exemption_under_sixth_schedule_part_a
          "TEI_PARAGRAPH_NO": element.value.paragraphNo ? element.value.paragraphNo : '0',
          "TEI_OTHER_EXEMPTION_PARTICULARS": element.value.otherExemptionParticulars ? element.value.otherExemptionParticulars : '',
          "TEI_RECEIPT_REFERENCE_NO": element.value.receiptReferenceNo ? element.value.receiptReferenceNo : '',
          "TEI_OTHER_EXEMPTION_REFERENCE_DATE": otherExemptionReferenceDate ? this.datepipe.transform(otherExemptionReferenceDate, 'dd-MM-yyyy') : '',
          "TEI_AMOUNT_OF_INCOME": element.value.amountofIncome ? this.commaSeparator.extractComma(element.value.amountofIncome) : 0,
          "TEI_OTHER_EXEMPTION_RELATED_EXPENSE": element.value.otherExemptionRelatedExpense ? this.commaSeparator.extractComma(element.value.otherExemptionRelatedExpense) : 0,

          //8 - sro
          "TEI_SRO_NO": element.value.sroNo ? element.value.sroNo : '',
          "TEI_YEAR": sroYr ? this.datepipe.transform(sroYr, 'yyyy') : '',
          "TEI_SRO_DESCRIPTION": element.value.sroDescription ? element.value.sroDescription : '',
          "TEI_SRO_RECEIPT_REFERENCE_NO": element.value.sroReceiptReferenceNo ? element.value.sroReceiptReferenceNo : '',
          "TEI_SRO_REFERENCE_DATE": sroReferenceDate ? this.datepipe.transform(sroReferenceDate, 'dd-MM-yyyy') : '',
          "TEI_SRO_AMOUNT_OF_INCOME": element.value.sroAmountofIncome ? this.commaSeparator.extractComma(element.value.sroAmountofIncome) : 0,
          "TEI_SRO_RELATED_EXPENSE": element.value.sroRelatedExpense ? this.commaSeparator.extractComma(element.value.sroRelatedExpense) : 0,

        }
        requestJson.push(obj);
      });
   //   console.log('exempted req json ', requestJson);
      this.spinner.start();
      this.apiService.post(this.serviceUrl + 'api/user-panel/save-tax-exempted-income', requestJson)
        .subscribe(result => {
          if (result.body.success && !this.isSaveDraft) {
            this.spinner.stop();
            this.toastr.success('Saved Successfully!', '', {
              timeOut: 1000,
            });
            this.headsOfIncome.forEach((Value, i) => {
              if (Value['link'] == '/user-panel/tax-exempted-income') {
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
            this.spinner.stop();
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
          //  console.log(error['error'].errorMessage);
            this.spinner.stop();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
    //post end
    // }  
  }

  getExemptedData() {
    //get api
    this.formArray.clear();
    let reqObj =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    }
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-tax-exempted-income')
      .subscribe(result => {
      //  console.log(result);

        this.getResponseData = result.Data;
        if (this.getResponseData.length > 0) {
          this.isVisibleAddAnotherTypeBtn = false
          this.isVisibleIncomeTab = false;

          this.getResponseData.forEach((element, index) => {
            this.getTEITooltips(element.TEI_TYPE);
            this.incomeTypeName.push(this.getTaxExemptedIncomeTypeName(element.TEI_TYPE));
            this.group = new FormGroup({
              PARTICULAR_ID: new FormControl(element.PARTICULAR_ID),
              taxExemptedIncomeType: new FormControl(element.TEI_TYPE),
              incomeTypeName: new FormControl(this.getTaxExemptedIncomeTypeName(element.TEI_TYPE)),
              taxExemptedIncome: element.TEI_TYPE === 'foreign_remittance' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),
              netRealizedGain: element.TEI_TYPE === 'transfer_of_share_of_listed_company' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),
              netProfit_1: element.TEI_TYPE === 'software_and_it_business' || element.TEI_TYPE === 'export_of_handicrafts' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),
              bondTaxExemptedIncome: element.TEI_TYPE === 'tax_exempted_bond_or_securities' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),
              rewardAmount: element.TEI_TYPE === 'government_welfare_allowance' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),
              otherExemptionBondTaxExemptedIncome: element.TEI_TYPE === 'other_exemption_under_sixth_schedule_part_a' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),
              sroTaxExemptedIncome: element.TEI_TYPE === 'other_exemption_by_sro' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TAX_EXEMPTED_INCOME)) : new FormControl(''),


              //2 - foreign_remittance
              totalRemittedAmount: new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TOTAL_REMITTED_AMOUNT)),
              countryofEarning: new FormControl(element.TEI_COUNTRY_OF_EARNING),
              sourceofIncome: new FormControl(element.TEI_SOURCE_OF_INCOME),
              nameoftheEmployer: new FormControl(element.TEI_NAME_OF_THE_EMPLOYER),
              modeofRemittance: new FormControl(element.TEI_MODE_OF_REMITTANCE),
              bankMoneyTransferAgencyName: new FormControl(element.TEI_BANK_MONEY_TRANSFER_AGENCY_NAME),
              accountName: new FormControl(element.TEI_ACCOUNT_NAME),
              accountNumber: new FormControl(element.TEI_ACCOUNT_NUMBER),
              customAuthority: new FormControl(element.TEI_CUSTOM_AUTHORITY),
              formSerialNo: new FormControl(element.TEI_FORM_SERIAL_NO),
              declarationDate: new FormControl(element.TEI_DECLARATION_DATE),
              passportNo: new FormControl(element.TEI_PASSPORT_NO),

              //2 - transfer_of_share_of_listed_company
              boIdNo: new FormControl(element.TEI_BO_ID_NO),
              brokerageHouseName: new FormControl(element.TEI_BROKERAGE_HOUSE_NAME),
              portfolioStatementReferenceNo: new FormControl(element.TEI_PORTFOLIO_STATEMENT_REFERENCE_NO),
              transferShareReferenceDate: new FormControl(element.TEI_TRANSFER_SHARE_REFERENCE_DATE),
              grossRealizedGain: element.TEI_GROSS_REALIZED_GAIN !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_GROSS_REALIZED_GAIN)) : new FormControl(''),
              relatedExpenses: element.TEI_RELATED_EXPENSES !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_RELATED_EXPENSES)) : new FormControl(''),

              //3 -software_and_it_business && 4 - export_of_handicrafts
              typeofBusiness: new FormControl(element.TEI_TYPE_OF_BUSINESS),
              typeofHandicrafts: new FormControl(element.TEI_TYPE_OF_HANDICRAFTS),
              businessName: new FormControl(element.TEI_BUSINESS_NAME),
              businessAddress: new FormControl(element.TEI_BUSINESS_ADDRESS),
              salesTurnoverReceipts: element.TEI_SALES_TURNOVER_RECEIPTS !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_SALES_TURNOVER_RECEIPTS)) : new FormControl(''),
              grossProfit: element.TEI_GROSS_PROFIT !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_GROSS_PROFIT)) : new FormControl(''),
              generalAdminisSellingAndOther: element.TEI_GENERAL_ADMIN_IS_SELLING_AND_OTHER !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_GENERAL_ADMIN_IS_SELLING_AND_OTHER)) : new FormControl(''),
              isMaintainedBookOfAC: new FormControl(element.TEI_IS_MAINTAINED_BOOK_OF_AC),
              cashInHandandAtBank: element.TEI_CASH_IN_HAND_AND_AT_BANK !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_CASH_IN_HAND_AND_AT_BANK)) : new FormControl(''),
              inventories: element.TEI_INVENTORIES !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_INVENTORIES)) : new FormControl(''),
              fixedAssets: element.TEI_FIXED_ASSETS !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_FIXED_ASSETS)) : new FormControl(''),
              otherAssets: element.TEI_OTHER_ASSETS !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_OTHER_ASSETS)) : new FormControl(''),
              totalAssets: element.TEI_TOTAL_ASSETS !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TOTAL_ASSETS)) : new FormControl(''),
              openingCapital: element.TEI_OPENING_CAPITAL !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_OPENING_CAPITAL)) : new FormControl(''),
              netProfit_2: element.TEI_NET_PROFIT_2 !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_NET_PROFIT_2)) : new FormControl(''),
              withdrawalIncomeYear: element.TEI_WITHDRAWAL_INCOME_YEAR !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_WITHDRAWAL_INCOME_YEAR)) : new FormControl(''),
              closingCapital: element.TEI_CLOSING_CAPITAL !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_CLOSING_CAPITAL)) : new FormControl(''),
              liabilities: element.TEI_LIABILITIES !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_LIABILITIES)) : new FormControl(''),
              totalCapitalandLiabilities: element.TEI_TOTAL_CAPITAL_AND_LIABILITIES !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_TOTAL_CAPITAL_AND_LIABILITIES)) : new FormControl(''),

              //5 - tax_exempted_bond_or_securities
              nameoftheBondSecurity: new FormControl(element.TEI_NAME_OF_THE_BOND_SECURITY),
              issueNo: new FormControl(element.TEI_ISSUE_NO),
              issueDate: new FormControl(element.TEI_ISSUE_DATE),
              issuingOffice: new FormControl(element.TEI_ISSUING_OFFICE),
              dateofMaturity: new FormControl(element.TEI_DATE_OF_MATURITY),
              value: element.TEI_VALUE !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_VALUE)) : new FormControl(''),
              grossInterest: element.TEI_GROSS_INTEREST !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_GROSS_INTEREST)) : new FormControl(''),
              bondRelatedExpense: element.TEI_RELATED_EXPENSE !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_RELATED_EXPENSE)) : new FormControl(''),

              //6 - government_welfare_allowance
              particulars: new FormControl(element.TEI_PARTICULARS),
              nameoftheOrganization: new FormControl(element.TEI_NAME_OF_THE_ORGANIZATION),
              rewardReferenceNo: new FormControl(element.TEI_REWARD_REFERENCE_NO),
              rewardReferenceDate: new FormControl(element.TEI_REWARD_REFERENCE_DATE),

              //7 - other_exemption_under_sixth_schedule_part_a
              paragraphNo: new FormControl(element.TEI_PARAGRAPH_NO),
              otherExemptionParticulars: new FormControl(element.TEI_OTHER_EXEMPTION_PARTICULARS),
              receiptReferenceNo: new FormControl(element.TEI_RECEIPT_REFERENCE_NO),
              otherExemptionReferenceDate: new FormControl(element.TEI_OTHER_EXEMPTION_REFERENCE_DATE),
              amountofIncome: element.TEI_AMOUNT_OF_INCOME !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_AMOUNT_OF_INCOME)) : new FormControl(''),
              otherExemptionRelatedExpense: element.TEI_OTHER_EXEMPTION_RELATED_EXPENSE !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_OTHER_EXEMPTION_RELATED_EXPENSE)) : new FormControl(''),

              //8 - sro
              sroNo: new FormControl(element.TEI_SRO_NO),
              year: new FormControl(element.TEI_YEAR),
              sroDescription: new FormControl(element.TEI_SRO_DESCRIPTION),
              sroReceiptReferenceNo: new FormControl(element.TEI_SRO_RECEIPT_REFERENCE_NO),
              sroReferenceDate: new FormControl(element.TEI_SRO_REFERENCE_DATE),
              sroAmountofIncome: element.TEI_SRO_AMOUNT_OF_INCOME !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_SRO_AMOUNT_OF_INCOME)) : new FormControl(''),
              sroRelatedExpense: element.TEI_SRO_RELATED_EXPENSE !== '0' ? new FormControl(this.commaSeparator.currencySeparatorBD(element.TEI_SRO_RELATED_EXPENSE)) : new FormControl(''),

            });

            this.formArray.push(this.group);
      //      console.log('test', this.formArray.controls);
            this.selectedTaxExemptedIncome(this.formArray.length - 1);
          });
        }
        else {
          this.insertFormGroupToArray();
        }
      })
  }

  getTaxExemptedIncomeTypeName(taxExemptedIncomeType: any) {
    if (taxExemptedIncomeType === 'foreign_remittance') return 'Foreign Remittance';
    else if (taxExemptedIncomeType === 'transfer_of_share_of_listed_company') return 'Transfer of Share of Listed Company';
    else if (taxExemptedIncomeType === 'software_and_it_business') return 'Software and IT Business';
    else if (taxExemptedIncomeType === 'export_of_handicrafts') return 'Export of Handicrafts';
    else if (taxExemptedIncomeType === 'tax_exempted_bond_or_securities') return 'Tax Exempted Bond or Securities';
    else if (taxExemptedIncomeType === 'government_welfare_allowance') return 'Government Welfare Allowance/Rewards from the Government';
    else if (taxExemptedIncomeType === 'other_exemption_under_sixth_schedule_part_a') return 'Other Exemption under 6th Schedule Part A';
    else if (taxExemptedIncomeType === 'other_exemption_by_sro') return 'Other Exemption by SRO';
  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/tax-exempted-income') {
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

  isMaintainedBookOfACFalse(event: any, i) {
    if (event.target.checked) {
      this.formArray.controls[i].patchValue({
        cashInHandandAtBank: '',
        inventories: '',
        fixedAssets: '',
        otherAssets: '',
        totalAssets: '',
        openingCapital: '',
        withdrawalIncomeYear: '',
        closingCapital: '',
        liabilities: '',
        totalCapitalandLiabilities: '',
      });
    }
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

  placeCommaSeparator(i: number, e: any) {

    if (e.target.getAttribute('formControlName') === 'totalRemittedAmount') {
      this.totalRemittedAmt_showError[i] = false;
      this.formArray.at(i).get('totalRemittedAmount').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('totalRemittedAmount').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            taxExemptedIncome: parseInt(element.value.totalRemittedAmount) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(element.value.totalRemittedAmount)) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'grossRealizedGain') {
      this.grossRealizedGain_showError[i] = false;
      this.formArray.at(i).get('grossRealizedGain').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('grossRealizedGain').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossRealizedGain ? this.commaSeparator.extractComma(element.value.grossRealizedGain) : 0;
          let expenses = element.value.relatedExpenses ? this.commaSeparator.extractComma(element.value.relatedExpenses) : 0;
          let gain = Number(gross) - Number(expenses);
          this.formArray.controls[i].patchValue({
            netRealizedGain: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'relatedExpenses') {
      this.relatedExpenses_showError[i] = false;
      this.formArray.at(i).get('relatedExpenses').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('relatedExpenses').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossRealizedGain ? this.commaSeparator.extractComma(element.value.grossRealizedGain) : 0;
          let expenses = element.value.relatedExpenses ? this.commaSeparator.extractComma(element.value.relatedExpenses) : 0;
          let gain = Number(gross) - Number(expenses);
          this.formArray.controls[i].patchValue({
            netRealizedGain: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'value') {
      this.value_showError[i] = false;
      this.formArray.at(i).get('value').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('value').value)));
    }
    else if (e.target.getAttribute('formControlName') === 'grossInterest') {
      this.grossInterest_showError[i] = false;
      this.formArray.at(i).get('grossInterest').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('grossInterest').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossInterest ? this.commaSeparator.extractComma(element.value.grossInterest) : 0;
          let expenses = element.value.bondRelatedExpense ? this.commaSeparator.extractComma(element.value.bondRelatedExpense) : 0;
          let gain = Number(gross) - Number(expenses);
          this.formArray.controls[i].patchValue({
            bondTaxExemptedIncome: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
          });
        }
      });

    }
    else if (e.target.getAttribute('formControlName') === 'bondRelatedExpense') {
      this.formArray.at(i).get('bondRelatedExpense').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('bondRelatedExpense').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossInterest ? this.commaSeparator.extractComma(element.value.grossInterest) : 0;
          let expenses = element.value.bondRelatedExpense ? this.commaSeparator.extractComma(element.value.bondRelatedExpense) : 0;
          let gain = Number(gross) - Number(expenses);
          this.formArray.controls[i].patchValue({
            bondTaxExemptedIncome: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'rewardAmount') {
      this.RewardAmount_showError[i] = false;
      this.formArray.at(i).get('rewardAmount').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('rewardAmount').value)));
    }
    else if (e.target.getAttribute('formControlName') === 'amountofIncome') {
      this.amtOfIncome_showError[i] = false;
      this.formArray.at(i).get('amountofIncome').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('amountofIncome').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.amountofIncome ? this.commaSeparator.extractComma(element.value.amountofIncome) : 0;
          let expenses = element.value.otherExemptionRelatedExpense ? this.commaSeparator.extractComma(element.value.otherExemptionRelatedExpense) : 0;
          let gain = Number(gross) - Number(expenses);

          //check some exceptions
          if (element.value.paragraphNo === "11A" && Number(gain) > 50000) {
            this.toastr.success('Tax exempted income exceed 50,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              amountofIncome: '',
            });
          } else if (element.value.paragraphNo === "20" && Number(gain) > 25000000) {
            this.toastr.success('Tax exempted income exceed 2,50,00,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              amountofIncome: '',
            });
          } else if (element.value.paragraphNo === "22A" && Number(gain) > 25000) {
            this.toastr.success('Tax exempted income exceed 25,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              amountofIncome: '',
            });
          } else if (element.value.paragraphNo === "29" && Number(gain) > 200000) {
            this.toastr.success('Tax exempted income exceed 2,00,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              amountofIncome: '',
            });
          } else {
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            });
          }

        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'otherExemptionRelatedExpense') {
      this.formArray.at(i).get('otherExemptionRelatedExpense').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('otherExemptionRelatedExpense').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.amountofIncome ? this.commaSeparator.extractComma(element.value.amountofIncome) : 0;
          let expenses = element.value.otherExemptionRelatedExpense ? this.commaSeparator.extractComma(element.value.otherExemptionRelatedExpense) : 0;
          let gain = Number(gross) - Number(expenses);

          //check some exceptions
          if (element.value.paragraphNo === "11A" && Number(gain) > 50000) {
            this.toastr.success('Tax exempted income exceed 50,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              otherExemptionRelatedExpense: '',
            });
          } else if (element.value.paragraphNo === "20" && Number(gain) > 25000000) {
            this.toastr.success('Tax exempted income exceed 2,50,00,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              otherExemptionRelatedExpense: '',
            });
          } else if (element.value.paragraphNo === "22A" && Number(gain) > 25000) {
            this.toastr.success('Tax exempted income exceed 25,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              otherExemptionRelatedExpense: '',
            });
          } else if (element.value.paragraphNo === "29" && Number(gain) > 200000) {
            this.toastr.success('Tax exempted income exceed 2,00,000!', '', {
              timeOut: 1500,
            });
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: '',
              otherExemptionRelatedExpense: '',
            });
          } else {
            this.formArray.controls[i].patchValue({
              otherExemptionBondTaxExemptedIncome: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            });
          }
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'salesTurnoverReceipts') {
      this.salesTurnoverReceipt_showError[i] = false;
      this.formArray.at(i).get('salesTurnoverReceipts').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('salesTurnoverReceipts').value)));
    }
    else if (e.target.getAttribute('formControlName') === 'grossProfit') {
      this.grossProfit_showError[i] = false;
      let tmpSalesTurnOver = this.formArray.at(i).get('salesTurnoverReceipts').value ? parseInt(this.commaSeparator.extractComma(this.formArray.at(i).get('salesTurnoverReceipts').value)) : 0;
      let tmpGrossProfit = this.formArray.at(i).get('grossProfit').value ? parseInt(this.commaSeparator.extractComma(this.formArray.at(i).get('grossProfit').value)) : 0;
      if(tmpSalesTurnOver < tmpGrossProfit)
      {
         this.toastr.warning('Gross profit will not be more than Sales/Turnover/Receipts', '', {
          timeOut: 2000,
        });
         this.formArray.at(i).get('grossProfit').setValue('');
      }
      else
      this.formArray.at(i).get('grossProfit').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('grossProfit').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0;
          let expenses = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0;
          let capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          let withdraw = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
          let liability = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          let gain = Number(gross) - Number(expenses);
          let closingCapital = Number(gain) + Number(capital) - Number(withdraw);
          let total = Number(closingCapital) + Number(liability);
          this.formArray.controls[i].patchValue({
            netProfit_1: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            netProfit_2: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            closingCapital: closingCapital ? this.commaSeparator.currencySeparatorBD(closingCapital) : '',
            totalCapitalandLiabilities: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });

    }
    else if (e.target.getAttribute('formControlName') === 'generalAdminisSellingAndOther') {
      this.generalAdminisSell_showError[i] = false;
      this.formArray.at(i).get('generalAdminisSellingAndOther').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('generalAdminisSellingAndOther').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0;
          let expenses = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0;
          let capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          let withdraw = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
          let liability = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          let gain = Number(gross) - Number(expenses);
          let closingCapital = Number(gain) + Number(capital) - Number(withdraw);
          let total = Number(closingCapital) + Number(liability);
          this.formArray.controls[i].patchValue({
            netProfit_1: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            netProfit_2: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            closingCapital: closingCapital ? this.commaSeparator.currencySeparatorBD(closingCapital) : '',
            totalCapitalandLiabilities: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'cashInHandandAtBank') {
      this.cashInHand_showError[i] = false;
      this.formArray.at(i).get('cashInHandandAtBank').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('cashInHandandAtBank').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let cash = element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : 0;
          let inventory = element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : 0;
          let fixedAsset = element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : 0;
          let otherAsset = element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : 0;

          let total = Number(cash) + Number(inventory) + Number(fixedAsset) + Number(otherAsset);
          this.formArray.controls[i].patchValue({
            totalAssets: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'inventories') {
      this.inventories_showError[i] = false;
      this.formArray.at(i).get('inventories').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('inventories').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let cash = element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : 0;
          let inventory = element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : 0;
          let fixedAsset = element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : 0;
          let otherAsset = element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : 0;

          let total = Number(cash) + Number(inventory) + Number(fixedAsset) + Number(otherAsset);
          this.formArray.controls[i].patchValue({
            totalAssets: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'fixedAssets') {
      this.fixedAsset_showError[i] = false;
      this.formArray.at(i).get('fixedAssets').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('fixedAssets').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let cash = element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : 0;
          let inventory = element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : 0;
          let fixedAsset = element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : 0;
          let otherAsset = element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : 0;

          let total = Number(cash) + Number(inventory) + Number(fixedAsset) + Number(otherAsset);
          this.formArray.controls[i].patchValue({
            totalAssets: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'otherAssets') {
      this.otherAsset_showError[i] = false;
      this.formArray.at(i).get('otherAssets').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('otherAssets').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let cash = element.value.cashInHandandAtBank ? this.commaSeparator.extractComma(element.value.cashInHandandAtBank) : 0;
          let inventory = element.value.inventories ? this.commaSeparator.extractComma(element.value.inventories) : 0;
          let fixedAsset = element.value.fixedAssets ? this.commaSeparator.extractComma(element.value.fixedAssets) : 0;
          let otherAsset = element.value.otherAssets ? this.commaSeparator.extractComma(element.value.otherAssets) : 0;

          let total = Number(cash) + Number(inventory) + Number(fixedAsset) + Number(otherAsset);
          this.formArray.controls[i].patchValue({
            totalAssets: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'openingCapital') {
      this.openingCapital_showError[i] = false;
      this.formArray.at(i).get('openingCapital').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('openingCapital').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0;
          let expenses = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0;
          let capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          let withdraw = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
          let liability = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          let gain = Number(gross) - Number(expenses);
          let closingCapital = Number(gain) + Number(capital) - Number(withdraw);
          let total = Number(closingCapital) + Number(liability);
          this.formArray.controls[i].patchValue({
            netProfit_1: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            netProfit_2: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            closingCapital: closingCapital ? this.commaSeparator.currencySeparatorBD(closingCapital) : '',
            totalCapitalandLiabilities: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'withdrawalIncomeYear') {
      this.withdrawals_showError[i] = false;
      this.formArray.at(i).get('withdrawalIncomeYear').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('withdrawalIncomeYear').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0;
          let expenses = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0;
          let capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          let withdraw = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
          let liability = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          let gain = Number(gross) - Number(expenses);
          let closingCapital = Number(gain) + Number(capital) - Number(withdraw);
          let total = Number(closingCapital) + Number(liability);
          this.formArray.controls[i].patchValue({
            netProfit_1: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            netProfit_2: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            closingCapital: closingCapital ? this.commaSeparator.currencySeparatorBD(closingCapital) : '',
            totalCapitalandLiabilities: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'liabilities') {
      this.liabilities_showError[i] = false;
      this.formArray.at(i).get('liabilities').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('liabilities').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.grossProfit ? this.commaSeparator.extractComma(element.value.grossProfit) : 0;
          let expenses = element.value.generalAdminisSellingAndOther ? this.commaSeparator.extractComma(element.value.generalAdminisSellingAndOther) : 0;
          let capital = element.value.openingCapital ? this.commaSeparator.extractComma(element.value.openingCapital) : 0;
          let withdraw = element.value.withdrawalIncomeYear ? this.commaSeparator.extractComma(element.value.withdrawalIncomeYear) : 0;
          let liability = element.value.liabilities ? this.commaSeparator.extractComma(element.value.liabilities) : 0;
          let gain = Number(gross) - Number(expenses);
          let closingCapital = Number(gain) + Number(capital) - Number(withdraw);
          let total = Number(closingCapital) + Number(liability);
          this.formArray.controls[i].patchValue({
            netProfit_1: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            netProfit_2: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
            closingCapital: closingCapital ? this.commaSeparator.currencySeparatorBD(closingCapital) : '',
            totalCapitalandLiabilities: total ? this.commaSeparator.currencySeparatorBD(total) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'sroAmountofIncome') {
      this.amtOfIncome_showError[i] = false;
      this.formArray.at(i).get('sroAmountofIncome').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('sroAmountofIncome').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.sroAmountofIncome ? this.commaSeparator.extractComma(element.value.sroAmountofIncome) : 0;
          let expenses = element.value.sroRelatedExpense ? this.commaSeparator.extractComma(element.value.sroRelatedExpense) : 0;
          let gain = Number(gross) - Number(expenses);
          this.formArray.controls[i].patchValue({
            sroTaxExemptedIncome: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
          });
        }
      });
    }
    else if (e.target.getAttribute('formControlName') === 'sroRelatedExpense') {
      this.formArray.at(i).get('sroRelatedExpense').setValue(this.commaSeparator.currencySeparatorBD(this.commaSeparator.extractComma(this.formArray.at(i).get('sroRelatedExpense').value)));
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          let gross = element.value.sroAmountofIncome ? this.commaSeparator.extractComma(element.value.sroAmountofIncome) : 0;
          let expenses = element.value.sroRelatedExpense ? this.commaSeparator.extractComma(element.value.sroRelatedExpense) : 0;
          let gain = Number(gross) - Number(expenses);
          this.formArray.controls[i].patchValue({
            sroTaxExemptedIncome: gain ? this.commaSeparator.currencySeparatorBD(gain) : '',
          });
        }
      });
    }

  }

  falseErrorIndexes(i,formControlName)
  {
    if(formControlName === 'sroReferenceDate')
    {
      this.refDate_showError[i] = false;
    }
    if(formControlName === 'sroReceiptReferenceNo')
    {
      this.receiptRefNo_showError[i] = false;
    }
    if(formControlName === 'sroDescription')
    {
      this.DescriptionNo_showError[i] = false;
    }
    if(formControlName === 'year')
    {
      this.year_showError[i] = false;
    }
    if(formControlName === 'sroNo')
    {
      this.sroNo_showError[i] = false;
    }
    if(formControlName === 'otherExemptionReferenceDate')
    {
      this.refDate_showError[i] = false;
    }
    if(formControlName === 'receiptReferenceNo')
    {
      this.receiptRefNo_showError[i] = false;
    }
    if(formControlName === 'otherExemptionParticulars')
    {
      this.particulars_showError[i] = false;
    }
    if(formControlName === 'rewardReferenceDate')
    {
      this.refDate_showError[i] = false;
    }
    if(formControlName === 'rewardReferenceNo')
    {
      this.rewardRefNo_showError[i] = false;
    }
    if(formControlName === 'particulars')
    {
      this.particulars_showError[i] = false;
    }
    if(formControlName === 'nameoftheOrganization')
    {
      this.nameOfOrg_showError[i] = false;
    }
    if(formControlName === 'issuingOffice')
    {
      this.issuingOffice_showError[i] = false;
    }
    if(formControlName === 'issueDate')
    {
      this.issueDate_showError[i] = false;
    }
    if(formControlName === 'dateofMaturity')
    {
      this.dateValidation[i] = false;
      this.dateOfMaturity_showError[i] = false;
    }
    if(formControlName === 'issueNo')
    {
      this.issueNo_showError[i] = false;
    }
    if(formControlName === 'nameoftheBondSecurity')
    {
      this.nameOfBond_showError[i] = false;
    }
    if(formControlName === 'typeofHandicrafts')
    {
      this.typeOfHandicrafts_showError[i] = false;
    }
    if(formControlName === 'businessAddress')
    {
      this.BusinessAddress_showError[i] = false;
    }
    if(formControlName === 'businessName')
    {
      this.businessName_showError[i] = false;
    }
    if(formControlName === 'countryofEarning')
    {
       this.countryOfEarning_showError[i] = false;
    }
    if(formControlName === 'sourceofIncome')
    {
       this.srcOfIncome_showError[i] = false;
    }
    if(formControlName === 'boIdNo')
    {
      this.BOIDNo_showError[i] = false;
    }
    if(formControlName === 'brokerageHouseName')
    {
      this.brogerageHouseName_showError[i] = false;
    }
    if(formControlName === 'portfolioStatementReferenceNo')
    {
      this.portfolioStatementRef_showError[i] = false;
    }
    if(formControlName === 'transferShareReferenceDate')
    {
      this.refDate_showError[i] = false;
    }
    if(formControlName==='typeofBusiness')
    {
      this.businessTypeName_showError[i] = false;
    }
    if(formControlName === 'modeofRemittance')
     {
       this.modeOfRemittance_showError[i] = false;
     }
  }

  getTEITooltips(teiType: any) {
    if (teiType === 'foreign_remittance') {
      this.getForeignRemittance_Tooltips();
    }
    else if (teiType === 'transfer_of_share_of_listed_company') {
      this.getTransferShare_Tooltips();
    }
    else if (teiType === 'software_and_it_business') {
      this.getSoftwareAndITBusiness_Tooltips();
    }
    else if (teiType === 'export_of_handicrafts') {
      this.getHandicrafts_Tooltips();
    }
    else if (teiType === 'tax_exempted_bond_or_securities') {
      this.getBondSecurities_Tooltips();
    }
    else if (teiType === 'government_welfare_allowance') {
      this.getGovtWelfareReward_Tooltips();
    }
    else if (teiType === 'other_exemption_under_sixth_schedule_part_a') {
      this.getOtherExemptionUnderSixthSchedule_Tooltips();
    }
    else if (teiType === 'other_exemption_by_sro') {
      this.getOtherExemptionSRO_Tooltips();
    }
  }


  //Foreign Remittance tooltips

  totalRemittedAmount_t: any; countryofEarning_t: any; sourceofIncome_t: any; nameoftheEmployer_t: any; modeofRemittance_t: any; taxExemptedIncome_t: any;
  bankMoneyTransferAgencyName_t: any; accountName_t: any; accountNumber_t: any;
  customAuthority_t: any; formSerialNo_t: any; declarationDate_t: any; passportNo_t: any;
  getForeignRemittance_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.totalRemittedAmount_t = `<span class="btn-block well-sm ">Total amount you remitted into the country.</span>`;
    this.countryofEarning_t = `<span class="btn-block well-sm ">Name of country in which income was earned.</span>`;

    this.sourceofIncome_t = `<span class="btn-block well-sm ">The source in foreign country from which the income that you remitted was earned.</span>`;

    this.nameoftheEmployer_t = `<span class="btn-block well-sm ">The employer who paid you the money that you have remitted.</span>`;

    this.modeofRemittance_t = `<span class="btn-block well-sm ">The channel used in remitting the money.</span>`;
    this.taxExemptedIncome_t = `<span class="btn-block well-sm ">The amount that you show in your tax return as tax exempted income.</span>`;

    this.bankMoneyTransferAgencyName_t = `<span class="btn-block well-sm ">Name of the bank/money transfer agency in Bangladesh that remitted the income.</span>`;
    this.accountName_t = `<span class="btn-block well-sm ">Name of account through which the remittance was made.</span>`;
    this.accountNumber_t = `<span class="btn-block well-sm ">The account number through which the remittance was made.</span>`;
    this.customAuthority_t = `<span class="btn-block well-sm ">Name of the customs port where you declared your remittance.</span>`;
    this.formSerialNo_t = `<span class="btn-block well-sm ">The serial number mentioned in the form in which your remittance was declared.</span>`;
    this.declarationDate_t = `<span class="btn-block well-sm ">The date on which the remittance was declared.</span>`;
    this.passportNo_t = `<span class="btn-block well-sm ">The number of passport you hold on the date of declaration.</span>`;

  }


  //Transfer share tooltips
  boIdNo_t: any; brokerageHouseName_t: any; portfolioStatementReferenceNo_t: any; transferShareReferenceDate_t: any; grossRealizedGain_t: any; netRealizedGain_t: any; transferRelatedExpenses_t: any;

  getTransferShare_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.boIdNo_t = `<span class="btn-block well-sm ">Your ID/account number as shown in your BO Account against which you earned tax exempted capital gain from the transfer of share.</span>`;
    this.brokerageHouseName_t = `<span class="btn-block well-sm ">Name of the agency where your BO ID is maintained.</span>`;
    this.portfolioStatementReferenceNo_t = `<span class="btn-block well-sm ">The reference number mentioned in the portfolio statement issued against your BO account.</span>`;
    this.transferShareReferenceDate_t = `<span class="btn-block well-sm ">The date on which the portfolio statement was issued.</span>`;
    this.grossRealizedGain_t = `<span class="btn-block well-sm ">The gross amount of realized gain before any fee or charges, etc.</span>`;
    this.netRealizedGain_t = `<span class="btn-block well-sm ">The net amount after deducting fee or charges from the gross realized gain.</span>`;
    this.transferRelatedExpenses_t = `<span class="btn-block well-sm ">The amount of expenses incurred (if any) for realization of tax exempted capital gains.  [Ignore expenses that are not allowed under the Income Tax Ordinance for computing income under this head].</span>`;
  }



  //software and IT business
  typeofBusiness_t: any;

  businessName_t: any; businessAddress_t: any; salesTurnoverReceipts_t: any;
  grossProfit_t: any; generalAdminisSellingAndOther_t: any; netProfit_1_t: any;

  maintainBooksOfAccounts_t: any;

  cashInHandandAtBank_t: any; inventories_t: any; fixedAssets_t: any;
  otherAssets_t: any; totalAssets_t: any; openingCapital_t: any;
  netProfit_2_t: any; withdrawalIncomeYear_t: any; closingCapital_t: any;
  liabilities_t: any; totalCapitalandLiabilities_t: any;
  getSoftwareAndITBusiness_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.typeofBusiness_t = `<span class="btn-block well-sm ">Select the type of your software/IT business from the drop down list.</span>`;

    this.businessName_t = `<span class="btn-block well-sm ">Name of your business entity.</span>`;
    this.businessAddress_t = `<span class="btn-block well-sm ">Address of your business entity.</span>`;
    this.salesTurnoverReceipts_t = `<span class="btn-block well-sm ">Amount of revenues earned from this business.</span>`;
    this.grossProfit_t = `<span class="btn-block well-sm ">Calculated by deducting sales or services from the amount of Sales/Turnover/ Receipts.</span>`;
    this.generalAdminisSellingAndOther_t = `<span class="btn-block well-sm ">All allowable expenses incurred for this business other than those considered in calculating Gross Profit.</span>`;
    this.netProfit_1_t = `<span class="btn-block well-sm ">Calculated by deducting General, Administrative, Selling and other expenses from the amount of Gross profit.</span>`;

    this.maintainBooksOfAccounts_t = `<span class="btn-block well-sm ">Select “Yes” if you maintain books of accounts for your software/IT business. Otherwise, select “No”.</span>`;

    this.cashInHandandAtBank_t = `<span class="btn-block well-sm ">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories_t = `<span class="btn-block well-sm ">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAssets_t = `<span class="btn-block well-sm ">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAssets_t = `<span class="btn-block well-sm ">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAssets_t = `<span class="btn-block well-sm ">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital_t = `<span class="btn-block well-sm ">The amount of capital at the beginning of income year.</span>`;
    this.netProfit_2_t = `<span class="btn-block well-sm ">Net profit amount as shown in the income statement.</span>`;

    this.withdrawalIncomeYear_t = `<span class="btn-block well-sm ">The amount taken out by you from your software/IT business.</span>`;


    this.closingCapital_t = `<span class="btn-block well-sm ">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;

    this.liabilities_t = `<span class="btn-block well-sm ">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your software/IT business.</span>`;

    this.totalCapitalandLiabilities_t = `<span class="btn-block well-sm ">The sum of capital and liabilities. Please note that total capital & liabilities of your business must equal its total assets.</span>`;
  }

  typeofHandicrafts_t: any;
  getHandicrafts_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.typeofHandicrafts_t = `<span class="btn-block well-sm ">Type of your handicrafts you produced in your business.</span>`;

    this.businessName_t = `<span class="btn-block well-sm ">Name of your business entity.</span>`;
    this.businessAddress_t = `<span class="btn-block well-sm ">Address of your business entity.</span>`;
    this.salesTurnoverReceipts_t = `<span class="btn-block well-sm ">Amount of revenues earned from this business.</span>`;
    this.grossProfit_t = `<span class="btn-block well-sm ">Calculated by deducting sales or services from the amount of Sales/Turnover/ Receipts.</span>`;
    this.generalAdminisSellingAndOther_t = `<span class="btn-block well-sm ">All allowable expenses incurred for this business other than those considered in calculating Gross Profit.</span>`;
    this.netProfit_1_t = `<span class="btn-block well-sm ">Calculated by deducting General, Administrative, Selling and other expenses from the amount of Gross profit.</span>`;

    this.maintainBooksOfAccounts_t = `<span class="btn-block well-sm ">Select “Yes” if you maintain books of accounts for your handicrafts business. Otherwise, select “No”.</span>`;

    this.cashInHandandAtBank_t = `<span class="btn-block well-sm ">The aggregate amount of cash available in hand and balances at all bank accounts.</span>`;
    this.inventories_t = `<span class="btn-block well-sm ">The amount of raw-materials, work-in-progress, finished goods or stock-in-trade.</span>`;
    this.fixedAssets_t = `<span class="btn-block well-sm ">The written down value of property, plant, equipment and all other tangible, intangible assets.</span>`;
    this.otherAssets_t = `<span class="btn-block well-sm ">Assets other than cash, inventories and fixed asset.</span>`;
    this.totalAssets_t = `<span class="btn-block well-sm ">The aggregate of cash, inventories, fixed assets and other assets.</span>`;
    this.openingCapital_t = `<span class="btn-block well-sm ">The amount of capital at the beginning of income year.</span>`;
    this.netProfit_2_t = `<span class="btn-block well-sm ">Net profit amount as shown in the income statement.</span>`;

    this.withdrawalIncomeYear_t = `<span class="btn-block well-sm ">The amount taken out by you from your handicrafts business.</span>`;


    this.closingCapital_t = `<span class="btn-block well-sm ">The amount of capital at the closing day of income year. You may calculate this as: opening capital + net profit – withdrawals.</span>`;

    this.liabilities_t = `<span class="btn-block well-sm ">The aggregates of loans, creditors, accounts payables, trade liabilities, arrears and all other external financial obligations of your handicrafts business.</span>`;

    this.totalCapitalandLiabilities_t = `<span class="btn-block well-sm ">The sum of capital and liabilities. Please note that total capital & liabilities of your business must equal its total assets.</span>`;
  }


  //BondSecurities
  nameoftheBondSecurity_t: any;
  issueNo_t: any;
  issueDate_t: any;
  issuingOffice_t: any;
  dateofMaturity_t: any;
  grossInterest_t: any;
  bondRelatedExpense_t: any;
  bondTaxExemptedIncome_t: any;
  value_t: any;
  getBondSecurities_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.nameoftheBondSecurity_t = `<span class="btn-block well-sm ">The name of the bond or other securities from which you received tax exempted interest/ profit.</span>`;
    this.issueNo_t = `<span class="btn-block well-sm ">Issue number mentioned in your securities.</span>`;
    this.issueDate_t = `<span class="btn-block well-sm ">Issue date mentioned in your securities.</span>`;
    this.issuingOffice_t = `<span class="btn-block well-sm ">The name of the office that issued your securities. You may find this in your securities.</span>`;
    this.dateofMaturity_t = `<span class="btn-block well-sm ">The date of maturity mentioned in your securities.</span>`;
    this.grossInterest_t = `<span class="btn-block well-sm ">The amount of interest/profit earned on your securities before deducting tax or charging expenses.</span>`;
    this.bondRelatedExpense_t = `<span class="btn-block well-sm ">The amount of expenses incurred (if any) for realization of interest income.  [Ignore expenses that are not allowed under the Income Tax Ordinance for computing income under this head].</span>`;
    this.bondTaxExemptedIncome_t = `<span class="btn-block well-sm ">The amount of income computed after deducting allowable expenses from gross interest.</span>`;
    this.value_t = `<span class="btn-block well-sm ">The face value of the securities.</span>`;
  }

  //GovtWelfareReward
  particulars_t: any;
  nameoftheOrganization_t: any;
  rewardReferenceNo_t: any;
  rewardReferenceDate_t: any;
  rewardAmount_t: any;
  getGovtWelfareReward_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.particulars_t = `<span class="btn-block well-sm ">The name/type of allowance/reward.</span>`;
    this.nameoftheOrganization_t = `<span class="btn-block well-sm ">The government organization by which allowance/reward has been granted.</span>`;
    this.rewardReferenceNo_t = `<span class="btn-block well-sm ">The reference number mentioned in the granting letter of the allowance/reward.</span>`;
    this.rewardReferenceDate_t = `<span class="btn-block well-sm ">The date on which the granting letter of the allowance/ reward was issued.</span>`;
    this.rewardAmount_t = `<span class="btn-block well-sm ">The amount tax exempted allowance/reward.</span>`;
  }


  //other_exemption_under_sixth_schedule
  paragraphNo_t: any;
  otherExemptionParticulars_t: any;
  receiptReferenceNo_t: any;
  otherExemptionReferenceDate_t: any;
  amountofIncome_t: any;
  otherExemptionRelatedExpense_t: any;
  otherExemptionBondTaxExemptedIncome_t: any;
  getOtherExemptionUnderSixthSchedule_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.paragraphNo_t = `<span class="btn-block well-sm ">The paragraph number of the 6th Schedule under which the income is exempted from tax.</span>`;
    this.otherExemptionParticulars_t = `<span class="btn-block well-sm ">Brief particular of the tax exempted income.</span>`;
    this.receiptReferenceNo_t = `<span class="btn-block well-sm ">The reference number (if any) of the receipt of income.</span>`;
    this.otherExemptionReferenceDate_t = `<span class="btn-block well-sm ">The date mentioned in the reference number.</span>`;
    this.amountofIncome_t = `<span class="btn-block well-sm ">The amount of income before charging any allowable expenses.</span>`;
    this.otherExemptionRelatedExpense_t = `<span class="btn-block well-sm ">The amount of expenses incurred (if any) for realization of the income.  [Ignore expenses that are not allowed under the Income Tax Ordinance for computing income under this head].</span>`;
    this.otherExemptionBondTaxExemptedIncome_t = `<span class="btn-block well-sm ">The amount of income computed after deducting allowable expenses from the amount of income.</span>`;
  }


  //Other Exemption by SRO
  sroNo_t: any;
  year_t: any;
  sroDescription_t: any;
  sroReceiptReferenceNo_t: any;
  sroReferenceDate_t: any;
  sroAmountofIncome_t: any;
  sroRelatedExpense_t: any;
  sroTaxExemptedIncome_t: any;
  getOtherExemptionSRO_Tooltips() {
    //this.taxExemptedIncomeType= `<span class="btn-block well-sm ">Select the source of tax exempted income from the drop down list.</span>`;
    this.sroNo_t = `<span class="btn-block well-sm ">The number of SRO under which your income is exempted from tax.</span>`;
    this.year_t = `<span class="btn-block well-sm ">The year which the SRO is issued.</span>`;
    this.sroDescription_t = `<span class="btn-block well-sm ">Brief description of the tax exempted income.</span>`;
    this.sroReceiptReferenceNo_t = `<span class="btn-block well-sm ">The reference number (if any) of the receipt of income.</span>`;
    this.sroReferenceDate_t = `<span class="btn-block well-sm ">The date mentioned in the reference number.</span>`;
    this.sroAmountofIncome_t = `<span class="btn-block well-sm ">The amount of income before charging any allowable expenses.</span>`;
    this.sroRelatedExpense_t = `<span class="btn-block well-sm ">The amount of expenses incurred (if any) for realization of the income.  [Ignore expenses that are not allowed under the Income Tax Ordinance for computing income under this head].</span>`;
    this.sroTaxExemptedIncome_t = `<span class="btn-block well-sm ">The amount of income computed after deducting allowable expenses from the amount of income.</span>`;
  }

  setupDateOfMaturity(value: Date,i) {
    this.issueDate_showError[i] = false;
    this.dateValidation[i] = false;
    let issueDate: any;
    // this.dateOfAcqCounter++;
    if (value != null) {
      issueDate = value ? moment(value, 'DD-MM-YYYY') : '';
      issueDate = this.datepipe.transform(issueDate, 'dd-MM-yyyy');
      this.dateOfMaturityFrom[i] = new Date(issueDate.substring(6, 12), parseInt(issueDate.substring(3, 5)) - 1, parseInt(issueDate.substring(0, 2)) + 1);
      //console.log(dateofAcquisition);
    }
  }

  checkMaturityDateIsGreaterThnIssueDate(issueDate, dateOfMaturity): boolean {
    let convIssueDate = issueDate ? moment(issueDate, 'DD-MM-YYYY') : null;
    let tmpIssueDate = convIssueDate ? this.datepipe.transform(convIssueDate, 'dd-MM-yyyy') : null;
    let convDateOfMaturity = dateOfMaturity ? moment(dateOfMaturity, 'DD-MM-YYYY') : null;
    let tmpdateOfMaturity = convDateOfMaturity ? this.datepipe.transform(convDateOfMaturity, 'dd-MM-yyyy') : null;
   // console.log(tmpIssueDate);
   // console.log(tmpdateOfMaturity);
    let result = convIssueDate.toISOString() < convDateOfMaturity.toISOString() ? true : false;   
    return result;
  }

  formattingDate(inputDate: string): Date {
    let _day: any, _month: any, _year: any, formatDate: any;
    _day = inputDate.toString().substring(0, 2);
    _month = inputDate.toString().substring(3, 5);
    _year = inputDate.toString().substring(6, 12);
    formatDate = _month + '/' + _day + '/' + _year;
    return new Date(formatDate);
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
         //   console.log(error['error'].errorMessage);
          });
    });
  }


}
