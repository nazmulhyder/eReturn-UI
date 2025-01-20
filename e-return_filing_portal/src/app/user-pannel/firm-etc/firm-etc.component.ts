import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { FirmEtcValidationService } from '../../service/firm-etc-validation.service';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';

@Component({
  selector: 'app-firm-etc',
  templateUrl: './firm-etc.component.html',
  styleUrls: ['./firm-etc.component.css']
})
export class FirmEtcComponent implements OnInit {
  html = `<span class="btn-block well-sm">No Tooltip Found!</span>`;

  //firm or aop
  nameFA: any; tinFA: any; totalIncomeFA: any; TaxPaidTotalIncFA: any; shareOfIncomeTaxpayerFA: any; remunRecvTaxpayerFA: any; remunRecvPartnersFA: any;
  shareOfIncomeFA: any; shareofFirmIncomeNT: any; shareofFirmIncomeT: any;
  //foreign
  grossFI: any; sourceofIncome: any; countryOfOrigin: any; nameOfEMP: any; amountOfForeignTaxPaid: any; foreignIncome: any;
  //spouse income
  spouseIncome: any;

  isSavedSuccess: boolean = false;
  isSaveDraft: boolean = false;
  formGroup: FormGroup;
  firmetcForm: FormGroup;
  firmInnerTab: boolean = false;
  aOPInnerTab: boolean = false;
  foreignIncomeInnerTab: boolean = false;
  spouseInnerTab: boolean = false;
  checkIsLoggedIn: any;
  selectedNavbar = [];
  selectedIncomeHeads = [];
  mainNavActive = {};
  assessmentApiData: any;

  headsOfIncome = [];
  lengthOfheads: any;
  firmItems = [];
  navActive = {};
  activeProperty = {};
  isVisibleForm: any;
  isVisibleFormAop: any;
  isVisibleFormForeignIncome: any;
  isVisibleFormSpouseIncome: any;

  modalRef: BsModalRef;
  formArray: FormArray;

  firmArray: FormArray;
  aoPArray: FormArray;
  foreignIncomeArray: FormArray;
  spouseIncomeArray: FormArray;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  responseData: any;
  // formGroup : FormGroup;
  additionalInformationForm: FormGroup;
  requestGetData: any;

  firmName = [];
  aopName = [];
  foreignIncomeName = [];
  isAmountRemittedToBD = [];
  selectedParent: any;
  isValidedFirmData: boolean = false;
  isValidedAoPData: boolean = false;
  isValidedForeignIncomeData: boolean = false;
  isValidedSpouseData: boolean = false;
  incomeYearTo: any;
  maxDateLen: any;

  //validation arrays
  //firm
  nameOfFirm_showError = [];
  tinOfFirm_showError = [];
  totalIncomeFirm_showError = [];
  taxpayerShareIncomeFirm_showError = [];
  //AoP
  nameOfAop_showError = [];
  tinOfAoP_showError = [];
  totalIncomeAoP_showError = [];
  taxpayerShareIncomeAoP_showError = [];
  //FOREIGN Income
  grossIncomeforeign_showError = [];
  srcIncomeForeign_showError = [];
  countryOriginForeign_showError = [];
  //spouse income
  netIncomeOfSpouse_showError = [];
  nameOfSpouse_showError = [];
  relationshipOfSpouse_showError = [];
  srcIncomeOfSpouse_showError = [];
  isShow: boolean = true;

  constructor(private headService: HeadsOfIncomeService,
    private modalService: BsModalService,
    private router: Router,
    private mainNavbarList: mainNavbarListService,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private fb: FormBuilder,
    private rReturnSpinner: NgxUiLoaderService,
    private commaSeparator: CommaSeparatorService,
    private firmEtcValidationService: FirmEtcValidationService,
    private datepipe: DatePipe,
  ) {
    this.formArray = new FormArray([]);
    this.firmArray = new FormArray([]);
    this.aoPArray = new FormArray([]);
    this.foreignIncomeArray = new FormArray([]);
    this.spouseIncomeArray = new FormArray([]);
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

    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.isVisibleFormAop = 0;
    this.isVisibleFormForeignIncome = 0;
    this.isVisibleFormSpouseIncome = 0;

    this.navActiveSelect('8');
    this.getHeadsOfIncome();

    // this.initializeAllSelectedForms();
    this.activeProperty[this.headService.firstSelectedFirm] = true;
    this.getMainNavbar();
    this.mainNavActiveSelect('2');

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion

    this.getSelectedFirmItems();
    this.selectedInnerTabsOnPageLoad();

    this.rReturnSpinner.start();
    this.getFirmETCData();
    this.checkSubmissionStatus();
    this.rReturnSpinner.stop();

  }

  getFirmETCData() {
    //debugger;
    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/firm-etc')
      .subscribe(result => {
        this.responseData = result;
    //    console.log('firm etc save data', this.responseData);
        if (this.responseData.length > 0) {
          // console.log('inside get api', this.firmItems);
          let firmChildTab = 0; let aopChildTab = 0; let foreignChildTab = 0; let firmInc = 0; let aopInc = 0; let foreignInc = 0;
          this.responseData.forEach((element, index) => {

            if (element.IS_FE_ETC_TYPE == '8') {

              if (element.IS_FE_NAME) {
                this.firmName[firmInc] = element.IS_FE_NAME;
              }
              else {
                this.firmName[firmInc] = 'Firm' + ' ' + ++firmChildTab;
              }
              firmInc++;
              this.firmetcForm = new FormGroup({
                FirmEtcID: new FormControl(1),
                //firm
                ParticularID: new FormControl(element.IS_FE_PARTICULAR_ID),
                FirmName: new FormControl(element.IS_FE_NAME),
                tinOfFirm: new FormControl(element.IS_FE_TIN_OF_FIRM_AOP),
                FirmTotalIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_TOTAL_INCM)),
                isTaxPaidOnTotalIncByFirm: new FormControl(element.IS_FE_CHK_TAX_PAID_TOTAL_INCM_BY_FIRM_AOP === 'T' ? '1' : '0'),
                FirmTaxpayerSharedIncome: new FormControl(element.IS_FE_TAXPAYER_SHARE_OF_INCM),
                FirmRemunerationTaxpayer: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SAL_REM_RECEIVED_TAXPAYER)),
                FirmRemunerationPartners: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SAL_REM_RECEIVED_OTHER)),
                FirmSharedIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SHARE_OF_INCM)),
                FirmSharedIncomeNotTaxed: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SHARE_OF_INCM_NT)),
                FirmSharedIncomeTaxed: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SHARE_OF_INCM_T)),
              });
              this.firmArray.push(this.firmetcForm);

              this.selectedFirmEtc(this.firmArray.length - 1);
              // console.log('firm array', this.firmArray);
            }

            else if (element.IS_FE_ETC_TYPE == '9') {

              if (element.IS_FE_NAME) {
                this.aopName[aopInc] = element.IS_FE_NAME;
              }
              else {
                this.aopName[aopInc] = 'AoP' + ' ' + ++aopChildTab;
              }
              aopInc++;

              this.firmetcForm = new FormGroup({
                FirmEtcID: new FormControl(2),
                //Aop
                ParticularID: new FormControl(element.IS_FE_PARTICULAR_ID),
                AoPName: new FormControl(element.IS_FE_NAME),
                tinOfAoP: new FormControl(element.IS_FE_TIN_OF_FIRM_AOP),
                AoPTotalIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_TOTAL_INCM)),
                isTaxPaidOnTotalIncByAoP: new FormControl(element.IS_FE_CHK_TAX_PAID_TOTAL_INCM_BY_FIRM_AOP === 'T' ? '1' : '0'),
                AoPTaxpayerSharedIncome: new FormControl(element.IS_FE_TAXPAYER_SHARE_OF_INCM),
                AoPRemunerationTaxpayer: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SAL_REM_RECEIVED_TAXPAYER)),
                AoPRemunerationPartners: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SAL_REM_RECEIVED_OTHER)),
                AoPSharedIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SHARE_OF_INCM)),
                AoPSharedIncomeNotTaxed: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SHARE_OF_INCM_NT)),
                AoPSharedIncomeTaxed: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_SHARE_OF_INCM_T)),
              });
              this.aoPArray.push(this.firmetcForm);

              this.selectedFirmEtc(this.aoPArray.length - 1);
              // console.log('aop array', this.aoPArray);
            }

            else if (element.IS_FE_ETC_TYPE == '10') {
              if (element.IS_FE_NAME) {
                this.foreignIncomeName[foreignInc] = element.IS_FE_NAME;
              }
              else {
                this.foreignIncomeName[foreignInc] = 'Foreign Income' + ' ' + ++foreignChildTab;
              }
              foreignInc++;

              //enabling bank input field by checking condition
              if (parseInt(element.IS_FE_AMT_REMITTED) > 0) {
                this.isAmountRemittedToBD.push(true);
              }

              this.firmetcForm = new FormGroup({
                FirmEtcID: new FormControl(3),
                //Foreign
                ParticularID: new FormControl(element.IS_FE_PARTICULAR_ID),
                TotalForeignIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_TOTAL_INCM)),
                ForeignSourceIncome: new FormControl(element.IS_FE_SOURCE_OF_INCM),
                CountryOrigin: new FormControl(element.IS_FE_COUNTRY_OF_ORIGIN),
                ForeignCompanyName: new FormControl(element.IS_FE_NAME),
                ForeignIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_FOREIGN_INCM)),
                amtOfForeignTaxPaid: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_AMT_FOREIGN_TAX_PAID)),
              });
              this.foreignIncomeArray.push(this.firmetcForm);

              this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
              // console.log('foreign array', this.foreignIncomeArray);
            }

            else if (element.IS_FE_ETC_TYPE == '11') {
              this.firmetcForm = new FormGroup({
                FirmEtcID: new FormControl(4),
                //Spouse or minor income
                ParticularID: new FormControl(element.IS_FE_PARTICULAR_ID),
                SpouseChildIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.IS_FE_NET_INCM)),
                SpouseChildName: new FormControl(element.IS_FE_NAME_OF_SPOUSE),
                SpouseChildDOB: new FormControl(element.IS_FE_DOB_OF_SPOUSE),
                SpouseChildRelationShip: new FormControl(element.IS_FE_RELATION_OF_SPOUSE),
                SpouseChildSrcOfIncome: new FormControl(element.IS_FE_SRC_INCOME_OF_SPOUSE),

              });
              this.spouseIncomeArray.push(this.firmetcForm);
              this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
            }
          });

          // this is for inialized form for new selected firms
          this.initializeFirmEtcByHead();
        }
        else {
          // debugger;
          this.initializeAllSelectedForms();
          this.initializeFirmEtcByHead();
        }
      },
        error => {
        //  console.log(error['error'].errorMessage);
        });
  }

  getSelectedFirmItems() {
    //debugger;
    this.firmItems = this.headService.getFirmItems();

    // #region when user refresh/reload this page, this code will works for keep the existing saved data
    if (this.firmItems.length <= 0) {
      let eTin: any;
      eTin = {
        "tinNo": this.userTin
      }

      this.apiService.post(this.serviceUrl + 'api/user-panel/get-selected-income-heads', eTin)
        .subscribe(result => {
          // console.log('firm etc selected heads', result);
          this.assessmentApiData = result;
          this.assessmentApiData.forEach(element => {
            this.selectedIncomeHeads.push(element.incomeSourceType);
          });

          this.selectedIncomeHeads.forEach(element => {
            if (element.incomeSourceName === 'Firm') {
              this.formGroup.controls.firm.setValue(true);
              this.headService.addSelectedItems(this.formGroup.controls);
              this.firmItems = this.headService.getFirmItems();
              // this.selectedProperty(0, '1');
            }
            else if (element.incomeSourceName === 'AoP') {
              this.formGroup.controls.aop.setValue(true);
              this.headService.addSelectedItems(this.formGroup.controls);
              this.firmItems = this.headService.getFirmItems();
              // this.selectedProperty(0, '2');
            }
            else if (element.incomeSourceName === 'Foreign Income') {
              this.formGroup.controls.outsideIncome.setValue(true);
              this.headService.addSelectedItems(this.formGroup.controls);
              this.firmItems = this.headService.getFirmItems();
              // this.selectedProperty(0, '3');
            }
            else if (element.incomeSourceName === 'Spouse/Minor Income') {
              // debugger;
              this.formGroup.controls.spouseChild.setValue(true);
              this.headService.addSelectedItems(this.formGroup.controls);
              this.firmItems = this.headService.getFirmItems();
              // this.selectedProperty(0, '4');
            }
          });

        },
          error => {
        //    console.log(error['error'].errorMessage);
          });
    }
    //#endregion
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
            this.firmItems = this.headService.getFirmItems();
            // this.selectedProperty(0, '1');

          }
          else if (element.incomeSourceTypeId === 9 && element.active) {
            this.formGroup.controls.aop.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
            this.firmItems = this.headService.getFirmItems();
            // this.selectedProperty(0, '2');
          }
          else if (element.incomeSourceTypeId === 10 && element.active) {
            this.formGroup.controls.outsideIncome.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
            this.firmItems = this.headService.getFirmItems();
            // this.selectedProperty(0, '3');
          }
          else if (element.incomeSourceTypeId === 11 && element.active) {
            this.formGroup.controls.spouseChild.setValue(true);
            this.headService.addSelectedItems(this.formGroup.controls);
            this.firmItems = this.headService.getFirmItems();
            // this.selectedProperty(0, '4');
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
          this.incomeYearTo = getAdditional_info_data.endOfIncomeYr;
          this.maxDateLen = new Date(this.incomeYearTo.substring(6, 12), parseInt(this.incomeYearTo.substring(3, 5)) - 1, this.incomeYearTo.substring(0, 2));
        }

        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Firm Etc');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();

      })

  }

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

  initializeAllSelectedForms() {
    // debugger
    // console.log('firm etc selected', this.firmItems);
    this.firmItems.forEach(element => {
      if (element.id == 1) {
        this.insertFormGroupToArray(1);
      }
      if (element.id == 2) {
        this.insertFormGroupToArray(2);
      }
      if (element.id == 3) {
        this.insertFormGroupToArray(3);
      }
      if (element.id == 4) {
        this.insertFormGroupToArray(4);
      }
    });
  }

  initSrcOfIncome(i) {
    this.srcIncomeForeign_showError[i] = false;
  }

  changeCountryOfOrigin(i) {
    this.countryOriginForeign_showError[i] = false;
  }

  insertFormGroupToArray(id: any) {

    if (parseInt(id) == 1) {
      this.firmetcForm = new FormGroup({
        FirmEtcID: new FormControl(1),
        //firm
        ParticularID: new FormControl(),
        FirmName: new FormControl(''),
        tinOfFirm: new FormControl(),
        FirmTotalIncome: new FormControl(),
        isTaxPaidOnTotalIncByFirm: new FormControl('0'),
        FirmTaxpayerSharedIncome: new FormControl(),
        FirmRemunerationTaxpayer: new FormControl(),
        FirmRemunerationPartners: new FormControl(),
        FirmSharedIncome: new FormControl(),
        FirmSharedIncomeNotTaxed: new FormControl(),
        FirmSharedIncomeTaxed: new FormControl(),
      });
      this.firmArray.push(this.firmetcForm);
      this.selectedFirmEtc(this.firmArray.length - 1);
      this.firmName[this.firmName.length] = 'Firm ' + (this.firmName.length + 1);
      // this.selectedProperty(this.firmArray.length - 1,'1');
    }

    if (parseInt(id) == 2) {
      this.firmetcForm = new FormGroup({
        FirmEtcID: new FormControl(2),
        //Aop
        ParticularID: new FormControl(),
        AoPName: new FormControl(''),
        tinOfAoP: new FormControl(),
        AoPTotalIncome: new FormControl(),
        isTaxPaidOnTotalIncByAoP: new FormControl('0'),
        AoPTaxpayerSharedIncome: new FormControl(),
        AoPRemunerationTaxpayer: new FormControl(),
        AoPRemunerationPartners: new FormControl(),
        AoPSharedIncome: new FormControl(),
        AoPSharedIncomeNotTaxed: new FormControl(),
        AoPSharedIncomeTaxed: new FormControl(),
      });
      this.aoPArray.push(this.firmetcForm);
      this.selectedFirmEtc(this.aoPArray.length - 1);
      this.aopName[this.aopName.length] = 'AoP ' + (this.aopName.length + 1);
      // this.selectedProperty(this.aoPArray.length - 1,'2');
    }

    if (parseInt(id) == 3) {
      this.firmetcForm = new FormGroup({
        FirmEtcID: new FormControl(3),
        //Foreign
        ParticularID: new FormControl(),
        TotalForeignIncome: new FormControl(),
        ForeignSourceIncome: new FormControl(''),
        CountryOrigin: new FormControl(0),
        ForeignCompanyName: new FormControl(''),
        ForeignIncome: new FormControl(),
        amtOfForeignTaxPaid: new FormControl(),
      });
      this.foreignIncomeArray.push(this.firmetcForm);
      this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
      this.foreignIncomeName[this.foreignIncomeName.length] = 'Foreign Income ' + (this.foreignIncomeName.length + 1);
      // this.selectedProperty(this.foreignIncomeArray.length - 1,'3');
    }
    if (parseInt(id) == 4) {
      this.firmetcForm = new FormGroup({
        FirmEtcID: new FormControl(4),
        //Spouse or minor income
        ParticularID: new FormControl(),
        SpouseChildIncome: new FormControl(),
        SpouseChildName: new FormControl(),
        SpouseChildDOB: new FormControl(),
        SpouseChildRelationShip: new FormControl('0'),
        SpouseChildSrcOfIncome: new FormControl(),
      });
      this.spouseIncomeArray.push(this.firmetcForm);
      this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
      // this.selectedProperty(this.spouseIncomeArray.length - 1,'4');
    }
  }

  selectedInnerTabsOnPageLoad() {

    let bool: boolean = true;
    this.firmItems.forEach((element) => {
      if (bool) {
        if (element.id == 1) {
          this.firmInnerTab = true;
          this.selectedFirmEtc(this.firmArray.length - 1);
        }
        if (element.id == 2) {
          this.aOPInnerTab = true;
          this.selectedFirmEtc(this.aoPArray.length - 1);
        }
        if (element.id == 3) {
          this.foreignIncomeInnerTab = true;
          this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
        }
        if (element.id == 4) {
          this.spouseInnerTab = true;
          this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
        }
        bool = false;
      }
    });
  }

  selectedPropertyForSave(i: number, value: string) {
    this.selectedParent = value;
    this.firmInnerTab = (parseInt(value) == 1) ? true : false;
    if (this.firmInnerTab) {
      this.isVisibleForm = i;
      this.getFirmTooltips();
      this.selectedFirmEtc(this.isVisibleForm);
    }
    this.aOPInnerTab = (parseInt(value) == 2) ? true : false;
    if (this.aOPInnerTab) {
      this.isVisibleFormAop = i;
      this.getAoPTooltips();
      this.selectedFirmEtc(this.isVisibleFormAop);
    }
    this.foreignIncomeInnerTab = (parseInt(value) == 3) ? true : false;
    {
      if (this.foreignIncomeInnerTab) {
        this.isVisibleFormForeignIncome = i;
        this.getForeignIncomeTooltips();
        this.selectedFirmEtc(this.isVisibleFormForeignIncome);
      }
    }
    this.spouseInnerTab = (parseInt(value) == 4) ? true : false;
    if (this.spouseInnerTab) {
      this.isVisibleFormSpouseIncome = i;
      this.getSpouseIncomeTooltips();
      this.selectedFirmEtc(this.isVisibleFormSpouseIncome);
    }

    const x = {};
    x[value] = true;
    this.activeProperty = x;
  }


  selectedHeadFromGUI(i: number, value: string) {
    this.selectedParent = value;
    //console.log(value);
    this.firmInnerTab = (parseInt(value) == 1) ? true : false;
    if (this.firmInnerTab) {
      this.isVisibleForm = i;
      this.getFirmTooltips();
      this.selectedFirmEtc(this.firmArray.length - 1);
    }
    this.aOPInnerTab = (parseInt(value) == 2) ? true : false;
    if (this.aOPInnerTab) {
      this.isVisibleFormAop = i;
      this.getAoPTooltips();
      this.selectedFirmEtc(this.aoPArray.length - 1);
    }
    this.foreignIncomeInnerTab = (parseInt(value) == 3) ? true : false;
    {
      if (this.foreignIncomeInnerTab) {
        this.isVisibleFormForeignIncome = i;
        this.getForeignIncomeTooltips();
        this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
      }
    }
    this.spouseInnerTab = (parseInt(value) == 4) ? true : false;
    if (this.spouseInnerTab) {
      this.isVisibleFormSpouseIncome = i;
      this.getSpouseIncomeTooltips();
      this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
    }

    const x = {};
    x[value] = true;
    this.activeProperty = x;
  //  console.log('firm items', this.firmItems);
  //  console.log('this.active poperty', this.activeProperty);
  }

  selectedProperty(i: number, value: string) {
    // debugger;
    this.selectedParent = value;
    //console.log(value);
    this.firmInnerTab = (parseInt(value) == 1) ? true : false;
    if (this.firmInnerTab) {
      this.isVisibleForm = i;
      this.getFirmTooltips();
      this.selectedFirmEtc(this.firmArray.length - 1);
    }
    this.aOPInnerTab = (parseInt(value) == 2) ? true : false;
    if (this.aOPInnerTab) {
      this.isVisibleFormAop = i;
      this.getAoPTooltips();
      this.selectedFirmEtc(this.aoPArray.length - 1);
    }
    this.foreignIncomeInnerTab = (parseInt(value) == 3) ? true : false;
    {
      if (this.foreignIncomeInnerTab) {
        this.isVisibleFormForeignIncome = i;
        this.getForeignIncomeTooltips();
        this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
      }
    }
    this.spouseInnerTab = (parseInt(value) == 4) ? true : false;
    if (this.spouseInnerTab) {
      this.isVisibleFormSpouseIncome = i;
      this.getSpouseIncomeTooltips();
      this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
    }


   // console.log('spouseInnerTab', this.spouseInnerTab);
    // value = this.firmItems[this.firmItems.length-1].id;
    const x = {};
    x[value] = true;
    this.activeProperty = x;
   // console.log('firm items', this.firmItems);
  //  console.log('this.active poperty', this.activeProperty);
  }

  selectedFirmEtc(i: number) {
    this.isVisibleForm = i;
    this.isVisibleFormAop = i;
    this.isVisibleFormForeignIncome = i;
    this.isVisibleFormSpouseIncome = i;
   // console.log('last visible form', i);
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }

  getFirmEtcParentHeadId(headName: string) {
    if (headName == 'Firm') {
      this.firmArray.clear();
      return 8;
    }
    else if (headName == 'AoP') {
      this.aoPArray.clear();
      return 9;
    }
    else if (headName == 'Foreign Income') {
      this.foreignIncomeArray.clear();
      return 10;
    }
    else if (headName == 'Spouse/Minor Income') {
      this.spouseIncomeArray.clear();
      return 11;
    }
  }

  spouseIncomeChange(i, formControlName) {
    if (formControlName === 'SpouseChildName')
      this.nameOfSpouse_showError[i] = false;
    if (formControlName === 'SpouseChildRelationShip')
      this.relationshipOfSpouse_showError[i] = false;
    if (formControlName === 'SpouseChildSrcOfIncome')
      this.srcIncomeOfSpouse_showError[i] = false;
  }

  getFirmTooltips() {
    this.nameFA = `<span class="btn-block well-sm">Name of the Firm from which you received the share of income as a partner.</span>`;
    this.tinFA = `<span class="btn-block well-sm">TIN of the Firm from which you received the share of income as a partner.</span>`;
    this.totalIncomeFA = `<span class="btn-block well-sm">Total income of the firm in the relevant income year. </span>`;
    this.TaxPaidTotalIncFA = `<span class="btn-block well-sm">Select “Yes” if the tax applicable on the Firm’s total income has been paid. Otherwise, select “No”. </span>`;
    this.shareOfIncomeTaxpayerFA = `<span class="btn-block well-sm">Your share of income in the Firm. For example, if the Firm has 2 equal partners including you, then your share of income will be 50%.</span>`;
    this.remunRecvTaxpayerFA = `<span class="btn-block well-sm">The amount of Salary or Remuneration you received from the firm during the income year.</span>`;
    this.remunRecvPartnersFA = `<span class="btn-block well-sm">The amount of Salary or Remuneration other partners received from the firm during the income year.</span>`;
    this.shareOfIncomeFA = `<span class="btn-block well-sm">The amount you received as your share of income from the Firm.</span>`;
    this.shareofFirmIncomeNT = `<span class="btn-block well-sm">Fill in this box when you received a share of Firm’s income but the Firm has not paid tax (either partly or fully) on its total income. Enter here the amount you received as any such share of Firm’s income.
    Any share of Firm’s income shall not be considered for rebate (taxed income rebate) if the Firm has not paid tax on its total income from which your share of income originated.
    </span>`;
    this.shareofFirmIncomeT = `<span class="btn-block well-sm">The amount you received as the share of Firm’s income and the Firm has paid tax on its total income. You are entitled to get tax rebate on such taxed income (at the average rate).</span>`;
  }
  getAoPTooltips() {
    this.nameFA = `<span class="btn-block well-sm">Name of the AoP from which you received the share of income as a member.</span>`;
    this.tinFA = `<span class="btn-block well-sm">TIN of the AoP from which you received the share of income as a member.</span>`;
    this.totalIncomeFA = `<span class="btn-block well-sm">Total income of the AoP in the relevant income year.</span>`;
    this.TaxPaidTotalIncFA = `<span class="btn-block well-sm">Select “Yes” if the tax applicable on the AoP’s total income has been paid. Otherwise, select “No”.</span>`;
    this.shareOfIncomeTaxpayerFA = `<span class="btn-block well-sm">Your share of income in the AoP. For example, if the AoP has 2 equal members including you, then your share of income will be 50%.</span>`;
    this.remunRecvTaxpayerFA = `<span class="btn-block well-sm">The amount of Salary or Remuneration you received from the AoP during the income year.</span>`;
    this.remunRecvPartnersFA = `<span class="btn-block well-sm">The amount of Salary or Remuneration other members received from the AoP during the income year</span>`;
    this.shareOfIncomeFA = `<span class="btn-block well-sm">The amount you received as your share of income from the Firm.</span>`;
    this.shareofFirmIncomeNT = `<span class="btn-block well-sm">Fill in this box when you received a share of Firm’s income but the Firm has not paid tax (either partly or fully) on its total income. Enter here the amount you received as any such share of Firm’s income.
    Any share of Firm’s income shall not be considered for rebate (taxed income rebate) if the Firm has not paid tax on its total income from which your share of income originated.
    </span>`;
    this.shareofFirmIncomeT = `<span class="btn-block well-sm">The amount you received as the share of AoP’s income and the AoP has paid tax on its total income. You are entitled to get tax rebate on such taxed income (at the average rate).</span>`;
  }
  getForeignIncomeTooltips() {
    this.grossFI = `<span class="btn-block well-sm">Total income received from any source outside Bangladesh jurisdiction.</span>`;
    this.sourceofIncome = `<span class="btn-block well-sm">The sources from which the total foreign income was earned.</span>`;
    this.countryOfOrigin = `<span class="btn-block well-sm">Select from the dropdown list the source country/jurisdiction of your foreign income.</span>`;
    this.nameOfEMP = `<span class="btn-block well-sm">The name of the party (in the foreign jurisdiction) from which you received your foreign income. This part may be applicable if you earned foreign income as an employee, a contractor, a service provider, or under any other relationship.</span>`;
    this.amountOfForeignTaxPaid = `<span class="btn-block well-sm">The amount of tax you paid in foreign jurisdiction against your income from that jurisdiction.</span>`;
    this.foreignIncome = `<span class="btn-block well-sm">The amount of foreign that will be included in computing your total income.</span>`;
  }
  getSpouseIncomeTooltips() {
    this.spouseIncome = `<span class="btn-block well-sm">The amount of net income of your spouse or any minor child, if any of them has income but not hold separate TIN or tax file.  </span>`;
  }

  close(i) {
    //delete parent api
    // debugger;
    let firmEtcParentId: any = this.getFirmEtcParentHeadId(this.firmItems[i].name);

    if (this.firmItems.length <= 0) {
      this.toastr.warning('Firm Etc is empty! Unable to Delete', '', {
        timeOut: 1000,
      });
      return;
    }
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/master/' + firmEtcParentId)
      .subscribe(result => {
        if (result == 'S') {
          this.toastr.success('Data Successfully Deleted!', '', {
            timeOut: 1000,
          });
          this.firmItems.splice(i, 1);
          this.modalRef.hide();
          this.selectedProperty(this.firmItems.length - 1, this.firmItems[this.firmItems.length - 1]['id']);
        }
        else {
          this.toastr.warning('Failed to Delete!', '', {
            timeOut: 1000,
          });
          return;
        }
      });
  }
  closeFirmInnerTab(i) {
    if (this.firmArray.length > 1) {
      this.firmArray.controls.forEach((element, index) => {
        if (index == i && element.value.ParticularID > 0) {
          this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/child/' + element.value.ParticularID)
            .subscribe(result => {
              if (result == 'S') {
                this.toastr.success('Data Successfully Deleted!', '', {
                  timeOut: 1000,
                });
                this.modalRef.hide();
                this.firmArray.controls.splice(i, 1);
                this.closeFirmErrorIndexes(i);
                this.selectedFirmEtc(this.firmArray.length - 1);
              }
              else {
                this.toastr.warning('Failed to Delete!', '', {
                  timeOut: 1000,
                });
                return;
              }
            });
        }
        else if (index == i && (element.value.ParticularID == '' || element.value.ParticularID == null)) {
          this.modalRef.hide();
          this.firmArray.controls.splice(i, 1);
          this.closeFirmErrorIndexes(i);
          this.selectedFirmEtc(this.firmArray.length - 1);
        }
      });

    }
    else {
      this.toastr.warning('unable to delete!', '', {
        timeOut: 1000,
      });
      return;
    }

  }
  closeAopInnerTab(i) {
    if (this.aoPArray.length > 1) {
      this.aoPArray.controls.forEach((element, index) => {
        if (index == i && element.value.ParticularID > 0) {
          this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/child/' + element.value.ParticularID)
            .subscribe(result => {
              if (result == 'S') {
                this.toastr.success('Data Successfully Deleted!', '', {
                  timeOut: 1000,
                });
                this.modalRef.hide();
                this.aoPArray.controls.splice(i, 1);
                this.closeAoPErrorIndexes(i);
                this.selectedFirmEtc(this.aoPArray.length - 1);
              }
              else {
                this.toastr.warning('Failed to Delete!', '', {
                  timeOut: 1000,
                });
                return;
              }
            });
        }
        else if (index == i && (element.value.ParticularID == '' || element.value.ParticularID == null)) {
          this.modalRef.hide();
          this.aoPArray.controls.splice(i, 1);
          this.closeAoPErrorIndexes(i);
          this.selectedFirmEtc(this.aoPArray.length - 1);
        }
      });
    }
    else {
      this.toastr.warning('unable to delete!', '', {
        timeOut: 1000,
      });
      return;
    }

  }
  closeForeignInnerTab(i) {
    if (this.foreignIncomeArray.length > 1) {
      this.foreignIncomeArray.controls.forEach((element, index) => {
        if (index == i && element.value.ParticularID > 0) {
          this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/child/' + element.value.ParticularID)
            .subscribe(result => {
              if (result == 'S') {
                this.toastr.success('Data Successfully Deleted!', '', {
                  timeOut: 1000,
                });
                this.modalRef.hide();
                this.foreignIncomeArray.controls.splice(i, 1);
                this.closeForeignIncomeErrorIndexes(i);
                this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
              }
              else {
                this.toastr.warning('Failed to Delete!', '', {
                  timeOut: 1000,
                });
                return;
              }
            });
        }
        else if (index == i && (element.value.ParticularID == '' || element.value.ParticularID == null)) {
          this.modalRef.hide();
          this.foreignIncomeArray.controls.splice(i, 1);
          this.closeForeignIncomeErrorIndexes(i);
          this.selectedFirmEtc(this.foreignIncomeArray.length - 1);
        }
      });

    }
    else {
      this.toastr.warning('unable to delete!', '', {
        timeOut: 1000,
      });
      return;
    }
  }
  closeSpouseInnerTab(i) {
    if (this.spouseIncomeArray.length > 1) {
      this.spouseIncomeArray.controls.forEach((element, index) => {
        if (index == i && element.value.ParticularID > 0) {
          this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/child/' + element.value.ParticularID)
            .subscribe(result => {
              if (result == 'S') {
                this.toastr.success('Data Successfully Deleted!', '', {
                  timeOut: 1000,
                });
                this.modalRef.hide();
                this.spouseIncomeArray.controls.splice(i, 1);
                this.closeSpouseIncomeErrorIndexes(i);
                this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
              }
              else {
                this.toastr.warning('Failed to Delete!', '', {
                  timeOut: 1000,
                });
                return;
              }
            });
        }
        else if (index == i && (element.value.ParticularID == '' || element.value.ParticularID == null)) {
          this.modalRef.hide();
          this.spouseIncomeArray.controls.splice(i, 1);
          this.closeSpouseIncomeErrorIndexes(i);
          this.selectedFirmEtc(this.spouseIncomeArray.length - 1);
        }
      });
    }
    else {
      this.toastr.warning('unable to delete!', '', {
        timeOut: 1000,
      });
      return;
    }
  }

  initializeFirmErrorIndexes(i) {
    this.nameOfFirm_showError[i] = false;
    this.tinOfFirm_showError[i] = false;
    this.totalIncomeFirm_showError[i] = false;
    this.taxpayerShareIncomeFirm_showError[i] = false;
  }

  closeFirmErrorIndexes(i) {
    this.nameOfFirm_showError.splice(i, 1);
    this.tinOfFirm_showError.splice(i, 1);
    this.totalIncomeFirm_showError.splice(i, 1);
    this.taxpayerShareIncomeFirm_showError.splice(i, 1);
  }

  initializeAoPErrorIndexes(i) {
    this.nameOfAop_showError[i] = false;
    this.tinOfAoP_showError[i] = false;
    this.totalIncomeAoP_showError[i] = false;
    this.taxpayerShareIncomeAoP_showError[i] = false;
  }

  closeAoPErrorIndexes(i) {
    this.nameOfAop_showError.splice(i, 1);
    this.tinOfAoP_showError.splice(i, 1);
    this.totalIncomeAoP_showError.splice(i, 1);
    this.taxpayerShareIncomeAoP_showError.splice(i, 1);
  }

  initializeForeignIncomeErrorIndexes(i) {
    this.grossIncomeforeign_showError[i] = false;
    this.srcIncomeForeign_showError[i] = false;
    this.countryOriginForeign_showError[i] = false;
  }

  closeForeignIncomeErrorIndexes(i) {
    this.grossIncomeforeign_showError.splice(i, 1);
    this.srcIncomeForeign_showError.splice(i, 1);
    this.countryOriginForeign_showError.splice(i, 1);
  }

  initializeSpouseIncomeErrorIndexes(i) {
    this.netIncomeOfSpouse_showError[i] = false;
    this.nameOfSpouse_showError[i] = false;
    this.relationshipOfSpouse_showError[i] = false;
    this.srcIncomeOfSpouse_showError[i] = false;
  }
  closeSpouseIncomeErrorIndexes(i) {
    this.netIncomeOfSpouse_showError.splice(i, 1);
    this.nameOfSpouse_showError.splice(i, 1);
    this.relationshipOfSpouse_showError.splice(i, 1);
    this.srcIncomeOfSpouse_showError.splice(i, 1);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  floatingNumbersOnly_firm(event: any, i) {
    //debugger;
    let str = event.target.value;
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(str).toLowerCase());
    //console.log(result);
    if (!result) {
      this.firmArray.controls[i].patchValue({
        FirmTaxpayerSharedIncome: ''
      });
    }
    else {
    }
  }

  floatingNumbersOnly_aop(event: any, i) {
    //debugger;
    let str = event.target.value;
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(str).toLowerCase());
    //console.log(result);
    if (!result) {
      this.aoPArray.controls[i].patchValue({
        AoPTaxpayerSharedIncome: ''
      });
    }
    else {
    }
  }

  // floatingNumberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 46 || charCode == 47 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  initializeAmtOfForeignTaxPaid(event, i) {
    this.foreignIncomeArray.controls[i].patchValue({
      amtOfForeignTaxPaid: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }
  initializeSpouseChildIncome(event, i) {
    this.netIncomeOfSpouse_showError[i] = false;
    this.spouseIncomeArray.controls[i].patchValue({
      SpouseChildIncome: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }


  //#region Firm All Calculation

  calShareOfIncome(i, formControlName) {
    let totalIncomeOfFirm: any; let taxpayerShareOfInc: any;
    let salRemRecvdByTaxpayer: any; let salRemRecvdByOther: any;
    let tmpFirmSharedIncome: any;
    this.firmArray.controls.forEach((element, index) => {
      if (index == i) {
        if (parseInt(element.value.FirmTaxpayerSharedIncome) > 100) {
          this.toastr.warning('Taxpayers Share of Income will less or equal to 100!');
          this.firmArray.controls[i].patchValue({
            FirmTaxpayerSharedIncome: 0
          });
        }
        if (parseInt(this.commaSeparator.removeComma(element.value.FirmRemunerationTaxpayer, 0)) > parseInt(this.commaSeparator.removeComma(element.value.FirmTotalIncome, 0))) {
          this.toastr.warning('Salary/Remuneration Received by the Taxpayer will less or equal Total Income of Firm!');
          this.firmArray.controls[i].patchValue({
            FirmRemunerationTaxpayer: 0
          });
        }

        if (parseInt(this.commaSeparator.removeComma(element.value.FirmRemunerationPartners, 0)) > parseInt(this.commaSeparator.removeComma(element.value.FirmTotalIncome, 0))) {
          this.toastr.warning('Salary/Remuneration Received by Other Partners will less or equal Total Income of Firm!');
          this.firmArray.controls[i].patchValue({
            FirmRemunerationPartners: 0
          });
        }

        if (formControlName === 'FirmTaxpayerSharedIncome') {
          this.taxpayerShareIncomeFirm_showError[i] = false;
        }

        if (formControlName === 'FirmTotalIncome') {
          this.totalIncomeFirm_showError[i] = false;
          this.firmArray.controls[i].patchValue({
            FirmTotalIncome: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmTotalIncome, 0)),
          });
        }

        this.firmArray.controls[i].patchValue({
          FirmRemunerationTaxpayer: parseInt(element.value.FirmRemunerationTaxpayer) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmRemunerationTaxpayer, 0)) : '',
          FirmRemunerationPartners: parseInt(element.value.FirmRemunerationPartners) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmRemunerationPartners, 0)) : '',
        });

        totalIncomeOfFirm = element.value.FirmTotalIncome ? this.commaSeparator.removeComma(element.value.FirmTotalIncome, 0) : 0; //C8
        taxpayerShareOfInc = element.value.FirmTaxpayerSharedIncome ? parseFloat(element.value.FirmTaxpayerSharedIncome) / 100 : 0; //C10
        salRemRecvdByTaxpayer = element.value.FirmRemunerationTaxpayer ? this.commaSeparator.removeComma(element.value.FirmRemunerationTaxpayer, 0) : 0; //C11
        salRemRecvdByOther = element.value.FirmRemunerationPartners ? this.commaSeparator.removeComma(element.value.FirmRemunerationPartners, 0) : 0; //C12

        tmpFirmSharedIncome = Math.round((parseFloat(totalIncomeOfFirm) - parseFloat(salRemRecvdByTaxpayer) - parseFloat(salRemRecvdByOther)) * parseFloat(taxpayerShareOfInc) + parseFloat(salRemRecvdByTaxpayer));
        this.firmArray.controls[i].patchValue({
          // (C8-C11-C12)*C10+C11
          FirmSharedIncome: parseInt(tmpFirmSharedIncome) ? this.commaSeparator.currencySeparatorBD(tmpFirmSharedIncome) : ''
        });
      }
    });
  }

  calShareOfFirmIncomeNotTaxed(i) {
    this.firmArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.isTaxPaidOnTotalIncByFirm === '0') {
          this.firmArray.controls[i].patchValue({
            FirmSharedIncomeNotTaxed: parseInt(element.value.FirmSharedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmSharedIncome, 0)) : ''
          });
        }
        else {
          this.firmArray.controls[i].patchValue({
            FirmSharedIncomeNotTaxed: 0,
          });
        }
      }

    });
  }
  calShareOfFirmIncomeTaxed(i) {
    this.firmArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.isTaxPaidOnTotalIncByFirm === '0') {
          this.firmArray.controls[i].patchValue({
            FirmSharedIncomeTaxed: '',
          });
        }
        else {
          this.firmArray.controls[i].patchValue({
            FirmSharedIncomeTaxed: parseInt(element.value.FirmSharedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmSharedIncome, 0)) : '',
          });
        }

      }
    });
  }

  isTaxPaidOnTotalIncByFirmTrue(event: any, i) {
    if (event.target.checked) {
      this.firmArray.controls.forEach((element, index) => {
        if (index == i) {
          this.firmArray.controls[i].patchValue({
            isTaxPaidOnTotalIncByFirm: '1',
            FirmSharedIncomeNotTaxed: '',
            FirmSharedIncomeTaxed: parseInt(element.value.FirmSharedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmSharedIncome, 0)) : ''
          });
        }
      });
    }
  }
  isTaxPaidOnTotalIncByFirmFalse(event: any, i) {
    if (event.target.checked) {
      this.firmArray.controls.forEach((element, index) => {
        if (index == i) {
          this.firmArray.controls[i].patchValue({
            isTaxPaidOnTotalIncByFirm: '0',
            FirmSharedIncomeNotTaxed: parseInt(element.value.FirmSharedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.FirmSharedIncome, 0)) : '',
            FirmSharedIncomeTaxed: ''
          });
        }
      });
    }
  }
  //#endregion

  //#region Aop All Calculation
  calShareOfIncomeAoP(i, formControlName) {
    let totalIncomeOfFirm: any; let taxpayerShareOfInc: any;
    let salRemRecvdByTaxpayer: any; let salRemRecvdByOther: any;
    let tmpAoPSharedIncome: any;
    this.aoPArray.controls.forEach((element, index) => {
      if (index == i) {
        if (parseInt(element.value.AoPTaxpayerSharedIncome) > 100) {
          this.aoPArray.controls[i].patchValue({
            AoPTaxpayerSharedIncome: 0
          });
          this.toastr.warning('Taxpayers Share of Income will less or equal to 100!');
        }
        if (parseInt(this.commaSeparator.removeComma(element.value.AoPRemunerationTaxpayer, 0)) > parseInt(this.commaSeparator.removeComma(element.value.AoPTotalIncome, 0))) {
          this.toastr.warning('Salary/Remuneration Received by the Taxpayer will less or equal Total Income of AoP!');
          this.aoPArray.controls[i].patchValue({
            AoPRemunerationTaxpayer: 0
          });
        }

        if (parseInt(this.commaSeparator.removeComma(element.value.AoPRemunerationPartners, 0)) > parseInt(this.commaSeparator.removeComma(element.value.AoPTotalIncome, 0))) {
          this.toastr.warning('Salary/Remuneration Received by Other Members will less or equal Total Income of AoP!');
          this.aoPArray.controls[i].patchValue({
            AoPRemunerationPartners: 0
          });
        }
        if (formControlName === 'AoPTaxpayerSharedIncome') {
          this.taxpayerShareIncomeAoP_showError[i] = false;
        }
        if (formControlName === 'AoPTotalIncome') {
          this.totalIncomeAoP_showError[i] = false;
          this.aoPArray.controls[i].patchValue({
            AoPTotalIncome: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.AoPTotalIncome, 0)),
          });
        }

        this.aoPArray.controls[i].patchValue({
          AoPRemunerationTaxpayer: parseInt(element.value.AoPRemunerationTaxpayer) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.AoPRemunerationTaxpayer, 0)) : '',
          AoPRemunerationPartners: parseInt(element.value.AoPRemunerationPartners) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.AoPRemunerationPartners, 0)) : '',
        });

        totalIncomeOfFirm = element.value.AoPTotalIncome ? this.commaSeparator.removeComma(element.value.AoPTotalIncome, 0) : 0; //C8
        taxpayerShareOfInc = element.value.AoPTaxpayerSharedIncome ? parseFloat(element.value.AoPTaxpayerSharedIncome) / 100 : 0; //C10
        salRemRecvdByTaxpayer = element.value.AoPRemunerationTaxpayer ? this.commaSeparator.removeComma(element.value.AoPRemunerationTaxpayer, 0) : 0; //C11
        salRemRecvdByOther = element.value.AoPRemunerationPartners ? this.commaSeparator.removeComma(element.value.AoPRemunerationPartners, 0) : 0; //C12

        tmpAoPSharedIncome = Math.round((parseFloat(totalIncomeOfFirm) - parseFloat(salRemRecvdByTaxpayer) - parseFloat(salRemRecvdByOther)) * parseFloat(taxpayerShareOfInc) + parseFloat(salRemRecvdByTaxpayer));
        this.aoPArray.controls[i].patchValue({
          // (C8-C11-C12)*C10+C11
          AoPSharedIncome: parseInt(tmpAoPSharedIncome) ? this.commaSeparator.currencySeparatorBD(tmpAoPSharedIncome) : ''
        });
      }
    });
  }
  calShareOfFirmIncomeNotTaxedAoP(i) {
    this.aoPArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.isTaxPaidOnTotalIncByAoP === '0') {
          this.aoPArray.controls[i].patchValue({
            AoPSharedIncomeNotTaxed: parseInt(element.value.AoPSharedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.AoPSharedIncome, 0)) : ''
          });
        }
        else {
          this.aoPArray.controls[i].patchValue({
            AoPSharedIncomeNotTaxed: 0,
          });
        }
      }

    });
  }
  calShareOfFirmIncomeTaxedAoP(i) {

    this.aoPArray.controls.forEach((element, index) => {
      if (index == i) {
        if (element.value.isTaxPaidOnTotalIncByAoP === '0') {
          this.aoPArray.controls[i].patchValue({
            AoPSharedIncomeTaxed: ''
          });
        }
        else {
          this.aoPArray.controls[i].patchValue({
            AoPSharedIncomeTaxed: parseInt(element.value.AoPSharedIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.AoPSharedIncome, 0)) : '',
          });
        }
      }

    });
  }

  isTaxPaidOnTotalIncByAoPTrue(event: any, i) {
    if (event.target.checked) {
      this.aoPArray.controls.forEach((element, index) => {
        if (index == i) {
          this.aoPArray.controls[i].patchValue({
            isTaxPaidOnTotalIncByAoP: '1',
            AoPSharedIncomeNotTaxed: '',
            AoPSharedIncomeTaxed: parseInt(element.value.AoPSharedIncome) ? element.value.AoPSharedIncome : ''
          });
        }
      });
    }
  }
  isTaxPaidOnTotalIncByAoPFalse(event: any, i) {
    if (event.target.checked) {
      this.aoPArray.controls.forEach((element, index) => {
        if (index == i) {
          this.aoPArray.controls[i].patchValue({
            isTaxPaidOnTotalIncByAoP: '0',
            AoPSharedIncomeNotTaxed: parseInt(element.value.AoPSharedIncome) ? element.value.AoPSharedIncome : '',
            AoPSharedIncomeTaxed: ''
          });
        }
      });
    }
  }

  //#endregion

  //#region Calculation Foreign Income
  calculateForeignIncome(i) {
    let totalForeignIncome: any;
    let amtRemittedToBD: any; let tmpTaxExemptedIncome: any;
    this.foreignIncomeArray.controls.forEach((element, index) => {
      if (index == i) {
        this.grossIncomeforeign_showError[i] = false;
        this.foreignIncomeArray.controls[i].patchValue({
          TotalForeignIncome: parseInt(element.value.TotalForeignIncome) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.TotalForeignIncome, 0)) : '',
        });
        totalForeignIncome = element.value.TotalForeignIncome ? this.commaSeparator.removeComma(element.value.TotalForeignIncome, 0) : 0; //G7
        tmpTaxExemptedIncome = Math.round(parseFloat(totalForeignIncome));
        this.foreignIncomeArray.controls[i].patchValue({
          // G7-G13
          ForeignIncome: parseInt(tmpTaxExemptedIncome) ? this.commaSeparator.currencySeparatorBD(tmpTaxExemptedIncome) : '',
          TaxExemptedIncome: parseInt(amtRemittedToBD) ? this.commaSeparator.currencySeparatorBD(Math.round(parseFloat(amtRemittedToBD))) : '',
        });
      }
    });
  }
  //#endregion

  initializeTINFirmAop(i, formControlName) {
    if (formControlName === 'tinOfFirm')
      this.tinOfFirm_showError[i] = false;
    if (formControlName === 'tinOfAoP')
      this.tinOfAoP_showError[i] = false;
  }


  firmNameChangeOnKeyUp(i) {
    this.firmName[i] = "";
    this.firmName[i] = this.firmArray.controls[i].value.FirmName;
    this.firmArray.controls[i].value.FirmName = this.firmName[i];
    this.nameOfFirm_showError[i] = false;
  }
  aopNameChangeOnKeyUp(i) {
    this.aopName[i] = "";
    this.aopName[i] = this.aoPArray.controls[i].value.AoPName;
    this.aoPArray.controls[i].value.AoPName = this.aopName[i];
    this.nameOfAop_showError[i] = false;
  }
  foreignIncomeNameChangeOnKeyUp(i) {
    this.foreignIncomeName[i] = "";
    this.foreignIncomeName[i] = this.foreignIncomeArray.controls[i].value.ForeignCompanyName;
    this.foreignIncomeArray.controls[i].value.ForeignCompanyName = this.foreignIncomeName[i];
  }

  amountRemittedBD(event, i) {
    this.isAmountRemittedToBD[i] = false;
    let amountRemittedBD = Math.round(event.target.value);
    if (amountRemittedBD > 0) {
      this.isAmountRemittedToBD[i] = true;
    }
  }

  validateFirm(): any {
    let successValidation: boolean = true;
    this.firmArray.controls.forEach((element, index) => {
      this.initializeFirmErrorIndexes(index);
      if (element.value.FirmName == null || element.value.FirmName == '') {
        this.nameOfFirm_showError[index] = true;
        successValidation = false;
      }
      if (element.value.tinOfFirm == null || element.value.tinOfFirm.length != 12) {
        this.tinOfFirm_showError[index] = true;
        successValidation = false;
      }
      if (element.value.FirmTotalIncome == null || element.value.FirmTotalIncome == '') {
        this.totalIncomeFirm_showError[index] = true;
        successValidation = false;
      }
      if (element.value.FirmTaxpayerSharedIncome == null || element.value.FirmTaxpayerSharedIncome == '') {
        this.taxpayerShareIncomeFirm_showError[index] = true;
        successValidation = false;
      }
    })

    if (!successValidation)
      return { "validate": false, "indexNo": this.funcSelectedFirmFirstIndexError() };
    else
      return { "validate": true, "indexNo": "" };
  }

  validateAoP(): any {
    let successValidation: boolean = true;
    this.aoPArray.controls.forEach((element, index) => {
      this.initializeAoPErrorIndexes(index);
      if (element.value.AoPName == null || element.value.AoPName == '') {
        this.nameOfAop_showError[index] = true;
        successValidation = false;
      }
      if (element.value.tinOfAoP == null || element.value.tinOfAoP.length != 12) {
        this.tinOfAoP_showError[index] = true;
        successValidation = false;
      }
      if (element.value.AoPTotalIncome == null || element.value.AoPTotalIncome == '') {
        this.totalIncomeAoP_showError[index] = true;
        successValidation = false;
      }
      if (element.value.AoPTaxpayerSharedIncome == null || element.value.AoPTaxpayerSharedIncome == '') {
        this.taxpayerShareIncomeAoP_showError[index] = true;
        successValidation = false;
      }
    })

    if (!successValidation)
      return { "validate": false, "indexNo": this.funcSelectedAoPFirstIndexError() };
    else
      return { "validate": true, "indexNo": "" };
  }

  validateForeignIncome(): any {
    let successValidation: boolean = true;
    this.foreignIncomeArray.controls.forEach((element, index) => {
      this.initializeForeignIncomeErrorIndexes(index);
      if (element.value.ForeignIncome == null || element.value.ForeignIncome == '') {
        this.grossIncomeforeign_showError[index] = true;
        successValidation = false;
      }
      if (element.value.ForeignSourceIncome == null || element.value.ForeignSourceIncome == '') {
        this.srcIncomeForeign_showError[index] = true;
        successValidation = false;
      }
      if (element.value.CountryOrigin == null || element.value.CountryOrigin == '' || element.value.CountryOrigin == '0') {
        this.countryOriginForeign_showError[index] = true;
        successValidation = false;
      }
    })

    if (!successValidation)
      return { "validate": false, "indexNo": this.funcSelectedForeignIncomeFirstIndexError() };
    else
      return { "validate": true, "indexNo": "" };
  }

  validateSpouseIncome(): any {
    let successValidation: boolean = true;
    this.spouseIncomeArray.controls.forEach((element, index) => {
      this.initializeSpouseIncomeErrorIndexes(index);
      if (element.value.SpouseChildIncome == null || element.value.SpouseChildIncome == '') {
        this.netIncomeOfSpouse_showError[index] = true;
        successValidation = false;
      }
      if (element.value.SpouseChildName == null || element.value.SpouseChildName == '') {
        this.nameOfSpouse_showError[index] = true;
        successValidation = false;
      }
      if (element.value.SpouseChildRelationShip == null || element.value.SpouseChildRelationShip == '0') {
        this.relationshipOfSpouse_showError[index] = true;
        successValidation = false;
      }
      if (element.value.SpouseChildSrcOfIncome == null || element.value.SpouseChildSrcOfIncome == '') {
        this.srcIncomeOfSpouse_showError[index] = true;
        successValidation = false;
      }
    })

    if (!successValidation)
      return { "validate": false, "indexNo": this.funcSelectedSpouseIncomeFirstIndexError() };
    else
      return { "validate": true, "indexNo": "" };
  }



  funcSelectedFirmFirstIndexError(): any {
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.firmArray.controls.forEach((element, index) => {
      if (!isFoundErrorIndex && (this.nameOfFirm_showError[index] || this.tinOfFirm_showError[index] || this.totalIncomeFirm_showError[index] || this.taxpayerShareIncomeFirm_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
    })

    return errorIndex;
  }

  funcSelectedAoPFirstIndexError(): any {
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.aoPArray.controls.forEach((element, index) => {
      if (!isFoundErrorIndex && (this.nameOfAop_showError[index] || this.tinOfAoP_showError[index] || this.totalIncomeAoP_showError[index] || this.taxpayerShareIncomeAoP_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
    })
    return errorIndex;
  }

  funcSelectedForeignIncomeFirstIndexError(): any {
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.foreignIncomeArray.controls.forEach((element, index) => {
      if (!isFoundErrorIndex && (this.grossIncomeforeign_showError[index] || this.srcIncomeForeign_showError[index] || this.countryOriginForeign_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
    })
    return errorIndex;
  }

  funcSelectedSpouseIncomeFirstIndexError(): any {
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.spouseIncomeArray.controls.forEach((element, index) => {
      if (!isFoundErrorIndex && (this.netIncomeOfSpouse_showError[index] || this.nameOfSpouse_showError[index] || this.relationshipOfSpouse_showError[index] || this.srcIncomeOfSpouse_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
    })
    return errorIndex;
  }

  saveDraftNew(selectedParent: any) {
    let validateFirmIncome: any, validateAoPIncome: any, validateForeignIncome: any, validateSpouseIncome: any;
    // validateFirmIncome = this.firmEtcValidationService.firmValidate(this.firmArray);
    validateFirmIncome = this.validateFirm();
    this.isSaveDraft = true;
    let requestJson = [];
    if (parseInt(selectedParent) === 1) {
      if (!validateFirmIncome.validate) {
       // console.log('firm error index', validateFirmIncome.indexNo);
        this.selectedPropertyForSave(validateFirmIncome.indexNo, '1');
        this.toastr.warning('Please fill all the required fields of Firm!', '', {
          timeOut: 1000,
        });
        return;
      }
      requestJson = [];
      this.firmArray.controls.forEach(element => {
        let firmObj =
        {
          "IS_FE_ETC_TYPE": "8",
          "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
          "IS_FE_NAME": element.value.FirmName ? element.value.FirmName : '',
          "IS_FE_TIN_OF_FIRM_AOP": element.value.tinOfFirm ? element.value.tinOfFirm : '',
          "IS_FE_TOTAL_INCM": element.value.FirmTotalIncome ? this.commaSeparator.removeComma(element.value.FirmTotalIncome, 0) : 0,
          "IS_FE_CHK_TAX_PAID_TOTAL_INCM_BY_FIRM_AOP": element.value.isTaxPaidOnTotalIncByFirm === '0' ? 'F' : 'T',

          "IS_FE_TAXPAYER_SHARE_OF_INCM": element.value.FirmTaxpayerSharedIncome ? element.value.FirmTaxpayerSharedIncome : 0,
          "IS_FE_SAL_REM_RECEIVED_TAXPAYER": element.value.FirmRemunerationTaxpayer ? this.commaSeparator.removeComma(element.value.FirmRemunerationTaxpayer, 0) : 0,
          "IS_FE_SAL_REM_RECEIVED_OTHER": element.value.FirmRemunerationPartners ? this.commaSeparator.removeComma(element.value.FirmRemunerationPartners, 0) : 0,
          "IS_FE_SHARE_OF_INCM": element.value.FirmSharedIncome ? this.commaSeparator.removeComma(element.value.FirmSharedIncome, 0) : 0,
          "IS_FE_SHARE_OF_INCM_NT": element.value.FirmSharedIncomeNotTaxed ? this.commaSeparator.removeComma(element.value.FirmSharedIncomeNotTaxed, 0) : 0,
          "IS_FE_SHARE_OF_INCM_T": element.value.FirmSharedIncomeTaxed ? this.commaSeparator.removeComma(element.value.FirmSharedIncomeTaxed, 0) : 0,
        }
        requestJson.push(firmObj);
      });
    }
    if (parseInt(selectedParent) === 2) {
      // validateAoPIncome = this.firmEtcValidationService.aopValidate(this.aoPArray);
      validateAoPIncome = this.validateAoP();
      if (!validateAoPIncome.validate) {
        this.selectedPropertyForSave(validateAoPIncome.indexNo, '2');
        this.toastr.warning('Please fill all the required fields of AoP!', '', {
          timeOut: 1000,
        });
        return;
      }
      requestJson = [];
      this.aoPArray.controls.forEach(element => {
        let aoPObj =
        {
          "IS_FE_ETC_TYPE": "9",
          "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
          "IS_FE_NAME": element.value.AoPName ? element.value.AoPName : '',
          "IS_FE_TIN_OF_FIRM_AOP": element.value.tinOfAoP ? element.value.tinOfAoP : '',
          "IS_FE_TOTAL_INCM": element.value.AoPTotalIncome ? this.commaSeparator.removeComma(element.value.AoPTotalIncome, 0) : 0,
          "IS_FE_CHK_TAX_PAID_TOTAL_INCM_BY_FIRM_AOP": element.value.isTaxPaidOnTotalIncByAoP === '0' ? 'F' : 'T',
          "IS_FE_TAXPAYER_SHARE_OF_INCM": element.value.AoPTaxpayerSharedIncome ? element.value.AoPTaxpayerSharedIncome : 0,
          "IS_FE_SAL_REM_RECEIVED_TAXPAYER": element.value.AoPRemunerationTaxpayer ? this.commaSeparator.removeComma(element.value.AoPRemunerationTaxpayer, 0) : 0,
          "IS_FE_SAL_REM_RECEIVED_OTHER": element.value.AoPRemunerationPartners ? this.commaSeparator.removeComma(element.value.AoPRemunerationPartners, 0) : 0,
          "IS_FE_SHARE_OF_INCM": element.value.AoPSharedIncome ? this.commaSeparator.removeComma(element.value.AoPSharedIncome, 0) : 0,
          "IS_FE_SHARE_OF_INCM_NT": element.value.AoPSharedIncomeNotTaxed ? this.commaSeparator.removeComma(element.value.AoPSharedIncomeNotTaxed, 0) : 0,
          "IS_FE_SHARE_OF_INCM_T": element.value.AoPSharedIncomeTaxed ? this.commaSeparator.removeComma(element.value.AoPSharedIncomeTaxed, 0) : 0,
        }
        requestJson.push(aoPObj);
      });
    }
    if (parseInt(selectedParent) === 3) {
      //console.log('you want to save FI!');
      // validateForeignIncome = this.firmEtcValidationService.foreignIncomeValidate(this.foreignIncomeArray);
      validateForeignIncome = this.validateForeignIncome();
      if (!validateForeignIncome.validate) {
        this.selectedPropertyForSave(validateForeignIncome.indexNo, '3');
        this.toastr.warning('Please fill all the required fields of Foreign Income!', '', {
          timeOut: 1000,
        });
        return;
      }
      requestJson = [];
      this.foreignIncomeArray.controls.forEach(element => {
        let fIncomeObj =
        {
          "IS_FE_ETC_TYPE": "10",
          "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
          "IS_FE_TOTAL_INCM": element.value.TotalForeignIncome ? this.commaSeparator.removeComma(element.value.TotalForeignIncome, 0) : 0,
          "IS_FE_SOURCE_OF_INCM": element.value.ForeignSourceIncome ? element.value.ForeignSourceIncome : '',
          "IS_FE_COUNTRY_OF_ORIGIN": element.value.CountryOrigin ? element.value.CountryOrigin : '',
          "IS_FE_NAME": element.value.ForeignCompanyName ? element.value.ForeignCompanyName : '',
          "IS_FE_AMT_FOREIGN_TAX_PAID": element.value.amtOfForeignTaxPaid ? this.commaSeparator.removeComma(element.value.amtOfForeignTaxPaid, 0) : 0,
          "IS_FE_FOREIGN_INCM": element.value.ForeignIncome ? this.commaSeparator.removeComma(element.value.ForeignIncome, 0) : 0,
        }
        requestJson.push(fIncomeObj);
      });
    }
    if (parseInt(selectedParent) === 4) {
      // validateSpouseIncome = this.firmEtcValidationService.spouseIncomeValidate(this.spouseIncomeArray);
      validateSpouseIncome = this.validateSpouseIncome();
      if (!validateSpouseIncome.validate) {
        this.selectedPropertyForSave(validateSpouseIncome.indexNo, '4');
        this.toastr.warning('Please fill all the required fields of Spouse/Minor Income!', '', {
          timeOut: 1000,
        });
        return;
      }
      requestJson = [];
      this.spouseIncomeArray.controls.forEach(element => {
        let spouseDOB = element.value.SpouseChildDOB ? moment(element.value.SpouseChildDOB, 'DD-MM-YYYY') : '';
        let spouseIncomeObj =
        {
          "IS_FE_ETC_TYPE": "11",
          "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
          "IS_FE_NET_INCM": element.value.SpouseChildIncome ? this.commaSeparator.removeComma(element.value.SpouseChildIncome, 0) : 0,
          "IS_FE_NAME_OF_SPOUSE": element.value.SpouseChildName ? element.value.SpouseChildName : '',
          "IS_FE_DOB_OF_SPOUSE": spouseDOB ? this.datepipe.transform(spouseDOB, 'dd-MM-yyyy') : '',
          "IS_FE_RELATION_OF_SPOUSE": element.value.SpouseChildRelationShip ? element.value.SpouseChildRelationShip : '',
          "IS_FE_SRC_INCOME_OF_SPOUSE": element.value.SpouseChildSrcOfIncome ? element.value.SpouseChildSrcOfIncome : '',
        }
        requestJson.push(spouseIncomeObj);
      });
    }

    //save data
    this.apiService.post(this.serviceUrl + 'api/user-panel/income-head/firm-etc', requestJson)
      .subscribe(result => {
        if (result != null && this.isSaveDraft == false) {
          this.toastr.success('Data Saved Successfully!', '', {
            timeOut: 1000,
          });
          this.headsOfIncome.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/firm-etc') {

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
        //  console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }


  submittedData() {
    let validateFirmIncome: any, validateAoPIncome: any, validateForeignIncome: any, validateSpouseIncome: any;
    // validateFirmIncome = this.firmEtcValidationService.firmValidate(this.firmArray);
    // if (!validateFirmIncome.validate) {
    //   this.selectedProperty(parseInt(validateFirmIncome.indexNo), '1');
    //   return;
    // }
    validateFirmIncome = this.validateFirm();
    if (!validateFirmIncome.validate) {
      this.selectedPropertyForSave(parseInt(validateFirmIncome.indexNo), '1');
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      return;
    }
    let requestJson = [];
    this.firmArray.controls.forEach(element => {
      let firmObj =
      {
        "IS_FE_ETC_TYPE": "8",
        "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
        "IS_FE_NAME": element.value.FirmName ? element.value.FirmName : '',
        "IS_FE_TIN_OF_FIRM_AOP": element.value.tinOfFirm ? element.value.tinOfFirm : '',
        "IS_FE_TOTAL_INCM": element.value.FirmTotalIncome ? this.commaSeparator.removeComma(element.value.FirmTotalIncome, 0) : 0,
        "IS_FE_CHK_TAX_PAID_TOTAL_INCM_BY_FIRM_AOP": element.value.isTaxPaidOnTotalIncByFirm === '0' ? 'F' : 'T',

        "IS_FE_TAXPAYER_SHARE_OF_INCM": element.value.FirmTaxpayerSharedIncome ? element.value.FirmTaxpayerSharedIncome : 0,
        "IS_FE_SAL_REM_RECEIVED_TAXPAYER": element.value.FirmRemunerationTaxpayer ? this.commaSeparator.removeComma(element.value.FirmRemunerationTaxpayer, 0) : 0,
        "IS_FE_SAL_REM_RECEIVED_OTHER": element.value.FirmRemunerationPartners ? this.commaSeparator.removeComma(element.value.FirmRemunerationPartners, 0) : 0,
        "IS_FE_SHARE_OF_INCM": element.value.FirmSharedIncome ? this.commaSeparator.removeComma(element.value.FirmSharedIncome, 0) : 0,
        "IS_FE_SHARE_OF_INCM_NT": element.value.FirmSharedIncomeNotTaxed ? this.commaSeparator.removeComma(element.value.FirmSharedIncomeNotTaxed, 0) : 0,
        "IS_FE_SHARE_OF_INCM_T": element.value.FirmSharedIncomeTaxed ? this.commaSeparator.removeComma(element.value.FirmSharedIncomeTaxed, 0) : 0,
      }
      requestJson.push(firmObj);
    });

    // validateAoPIncome = this.firmEtcValidationService.aopValidate(this.aoPArray);
    validateAoPIncome = this.validateAoP();
    if (!validateAoPIncome.validate) {
      this.selectedPropertyForSave(validateAoPIncome.indexNo, '2');
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      return;
    }
    this.aoPArray.controls.forEach(element => {
      let aoPObj =
      {
        "IS_FE_ETC_TYPE": "9",
        "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
        "IS_FE_NAME": element.value.AoPName ? element.value.AoPName : '',
        "IS_FE_TIN_OF_FIRM_AOP": element.value.tinOfAoP ? element.value.tinOfAoP : '',
        "IS_FE_TOTAL_INCM": element.value.AoPTotalIncome ? this.commaSeparator.removeComma(element.value.AoPTotalIncome, 0) : 0,
        "IS_FE_CHK_TAX_PAID_TOTAL_INCM_BY_FIRM_AOP": element.value.isTaxPaidOnTotalIncByAoP === '0' ? 'F' : 'T',
        "IS_FE_TAXPAYER_SHARE_OF_INCM": element.value.AoPTaxpayerSharedIncome ? element.value.AoPTaxpayerSharedIncome : 0,
        "IS_FE_SAL_REM_RECEIVED_TAXPAYER": element.value.AoPRemunerationTaxpayer ? this.commaSeparator.removeComma(element.value.AoPRemunerationTaxpayer, 0) : 0,
        "IS_FE_SAL_REM_RECEIVED_OTHER": element.value.AoPRemunerationPartners ? this.commaSeparator.removeComma(element.value.AoPRemunerationPartners, 0) : 0,
        "IS_FE_SHARE_OF_INCM": element.value.AoPSharedIncome ? this.commaSeparator.removeComma(element.value.AoPSharedIncome, 0) : 0,
        "IS_FE_SHARE_OF_INCM_NT": element.value.AoPSharedIncomeNotTaxed ? this.commaSeparator.removeComma(element.value.AoPSharedIncomeNotTaxed, 0) : 0,
        "IS_FE_SHARE_OF_INCM_T": element.value.AoPSharedIncomeTaxed ? this.commaSeparator.removeComma(element.value.AoPSharedIncomeTaxed, 0) : 0,
      }
      requestJson.push(aoPObj);
    });

    // validateForeignIncome = this.firmEtcValidationService.foreignIncomeValidate(this.foreignIncomeArray);
    validateForeignIncome = this.validateForeignIncome();
    if (!validateForeignIncome.validate) {
      this.selectedPropertyForSave(parseInt(validateForeignIncome.indexNo), '3');
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      return;
    }

    this.foreignIncomeArray.controls.forEach(element => {
      let fIncomeObj =
      {
        "IS_FE_ETC_TYPE": "10",
        "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
        "IS_FE_TOTAL_INCM": element.value.TotalForeignIncome ? this.commaSeparator.removeComma(element.value.TotalForeignIncome, 0) : 0,
        "IS_FE_SOURCE_OF_INCM": element.value.ForeignSourceIncome ? element.value.ForeignSourceIncome : '',
        "IS_FE_COUNTRY_OF_ORIGIN": element.value.CountryOrigin ? element.value.CountryOrigin : '',
        "IS_FE_NAME": element.value.ForeignCompanyName ? element.value.ForeignCompanyName : '',
        "IS_FE_AMT_FOREIGN_TAX_PAID": element.value.amtOfForeignTaxPaid ? this.commaSeparator.removeComma(element.value.amtOfForeignTaxPaid, 0) : 0,
        "IS_FE_FOREIGN_INCM": element.value.ForeignIncome ? this.commaSeparator.removeComma(element.value.ForeignIncome, 0) : 0,
      }
      requestJson.push(fIncomeObj);
    });

    validateSpouseIncome = this.firmEtcValidationService.spouseIncomeValidate(this.spouseIncomeArray);
    validateSpouseIncome = this.validateSpouseIncome();
    if (!validateSpouseIncome.validate) {
      this.selectedPropertyForSave(parseInt(validateSpouseIncome.indexNo), '4');
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      return;
    }

    this.spouseIncomeArray.controls.forEach(element => {
      let spouseDOB = element.value.SpouseChildDOB ? moment(element.value.SpouseChildDOB, 'DD-MM-YYYY') : '';
      let spouseIncomeObj =
      {
        "IS_FE_ETC_TYPE": "11",
        "IS_FE_PARTICULAR_ID": element.value.ParticularID ? element.value.ParticularID : '',
        "IS_FE_NET_INCM": element.value.SpouseChildIncome ? this.commaSeparator.removeComma(element.value.SpouseChildIncome, 0) : 0,
        "IS_FE_NAME_OF_SPOUSE": element.value.SpouseChildName ? element.value.SpouseChildName : '',
        "IS_FE_DOB_OF_SPOUSE": spouseDOB ? this.datepipe.transform(spouseDOB, 'dd-MM-yyyy') : '',
        "IS_FE_RELATION_OF_SPOUSE": element.value.SpouseChildRelationShip ? element.value.SpouseChildRelationShip : '',
        "IS_FE_SRC_INCOME_OF_SPOUSE": element.value.SpouseChildSrcOfIncome ? element.value.SpouseChildSrcOfIncome : '',
      }
      requestJson.push(spouseIncomeObj);
    });


    this.apiService.post(this.serviceUrl + 'api/user-panel/income-head/firm-etc', requestJson)
      .subscribe(result => {
        this.isSavedSuccess = true;
        if (result != null && this.isSaveDraft == false) {
          this.toastr.success('Data Saved Successfully!', '', {
            timeOut: 1000,
          });
          this.headsOfIncome.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/firm-etc') {

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
          this.isSaveDraft = false;
        }
      },
      error => {
      //  console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage, '', {
          timeOut: 3000,
        });
      });
  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/firm-etc') {
        if (i - 1 < 0) {
          this.router.navigate(["/user-panel/additional-information"]);
        }
        if (i - 1 >= 0) {
          this.router.navigate([this.headsOfIncome[i - 1]['link']]);
        }
      }
    });
  }

  initializeFirmEtcByHead() {
    this.firmItems.forEach((element, index) => {
      if (element.id === 1) {

        this.firmName[0] = 'Firm' + ' ' + '1';
        if (this.firmArray.length <= 0) {
          this.insertFormGroupToArray(1);
        }

        this.selectedProperty(0, '1');
      }
      else if (element.id === 2) {
        this.aopName[0] = 'AoP' + ' ' + '1';

        if (this.aoPArray.length <= 0) {
          this.insertFormGroupToArray(2);
        }
        this.selectedProperty(0, '2');
      }
      else if (element.id === 3) {
        this.foreignIncomeName[0] = 'Foreign Income' + ' ' + '1';
        if (this.foreignIncomeArray.length <= 0) {
          this.insertFormGroupToArray(3);
        }

        this.selectedProperty(0, '3');
      }
      else if (element.id === 4) {
        if (this.spouseIncomeArray.length <= 0) {
          this.insertFormGroupToArray(4);
        }
        this.selectedProperty(0, '4');
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
          //  console.log(error['error'].errorMessage);
          });
    });
  }

}
