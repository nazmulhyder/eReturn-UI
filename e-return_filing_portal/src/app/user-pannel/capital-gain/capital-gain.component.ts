import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../custom-services/ApiService';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { CapitalGainValidationService } from '../../service/capital-gain-validation.service';
import { parse } from 'path';

@Component({
  selector: 'app-capital-gain',
  templateUrl: './capital-gain.component.html',
  styleUrls: ['./capital-gain.component.css']
})
export class CapitalGainComponent implements OnInit {
  html: any = `<span class="btn-block well-sm " style="margin-left: 20px">No Tooltip Found!</span>`;
  cgType: any = `<span class="btn-block well-sm " style="margin-left: 20px">Select from dropdown list the source of your capital gain.</span>`;
  propertyDes: any; totalArea: any; buyerTIN: any; deedNumber: any; subregisterOfc: any; saleDeedVal: any; costOfAcq: any; capitalGain: any; orderNo: any;
  TDS: any; landArea: any; flatBuildingArea: any; realEstateDev: any; agreementNumber: any; agreementDate: any; grossAmount: any; acqAuthority: any;
  compensionDate: any; companyName: any; transferNo: any; transferDate: any; shareTransfered: any; saleValue: any; costValue: any; relatedExp: any; realizedGain: any;
  desOfAsset: any; nameOfBuyer: any; TINorNID: any; invoiceNo: any; dateOfAcq: any; dateOfAli: any; saleValueMarketValue: any; sroNo: any; sroYear: any; particularSRO: any;
  taxExemptedIncome: any; taxableIncome: any; applicableTax: any;
  dateOfDeed: any;
  requestGetData: any;
  storeCGApiResponseData: any;
  userTin: any;
  group: FormGroup;
  selectedNavbar = [];
  mainNavActive = {};
  shareHolderDirector = [];
  sponsoredShareholder = [];
  had10pShare = [];

  navActive = {};
  item: any;
  headsOfIncome = [];
  lengthOfheads: any;

  formArray: FormArray;
  isVisibleForm: any;
  capitalGainTypeName = [];

  isVisibleTab = [];
  isDisableAddSalBtn: boolean = true;
  modalRef: BsModalRef;

  checkIsLoggedIn: any;

  minDate: any;
  maxDate: any;
  incomeYrFrom: any;
  incomeYearTo: any;
  dateofAcquisitionTo: any;
  minDateLen: any;
  maxDateLen: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getResponseData: any;
  formGroup: FormGroup;
  additionalInformationForm: FormGroup;
  isSaveDraft: boolean = false;
  draftSuccess: boolean = false;
  maxAlienationFrom = [];
  dateOfAcqCounter = 0;
  dateOfAliCounter = 0;
  isValidationSuccess: boolean = true;

  //validation arrays
  typeOfGains_showError = [];
  desOfProperty_showError = [];
  nameOfCompany_showError = [];
  transferNo_showError = [];
  dateOfTransfer_showError = [];
  noOfShareTransfered_showError = [];
  saleValueOfShare_showError = [];
  costValueOfShare_showError = [];
  invoiceNo_showError = [];
  dateOfAcq_showError = [];
  dateOfAli_showError = [];
  saleMarketValue_showError = [];
  sroNo_showError = [];
  year_showError = [];
  particularSRO_showError = [];
  incomeExemptedTax_showError = [];
  applicableTax_showError = [];
  totalArea_showError = [];
  landArea_showError = [];
  flatArea_showError = [];
  acqAuthority_showError = [];
  orderNo_showError = [];
  date_showError = [];
  nameOfRealEstateDev_showError = [];
  tinOfBuyer_showError = [];
  deedNo_showError = [];
  dateOfDeed_showError = [];
  subRegisterOfc_showError = [];
  saleDeedVal_showError = [];
  grossAmount_showError = [];
  tds_showError = [];
  dateValidation_showError = [];
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
    private capitalGainValidationService: CapitalGainValidationService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
    this.formArray = new FormArray([]);
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
      summaryId: new FormControl(0),
      gainType: new FormControl(0),
      capitalGainTypeName: new FormControl(""),
      descriptionofProperty: new FormControl(),
      totalArea: new FormControl(),
      unitOfTotalArea: new FormControl('Decimal'),
      tinofBuyer: new FormControl(),
      deedNo: new FormControl(),
      dateofDeed: new FormControl(),
      subRegisterOffice: new FormControl(),
      saleDeedValue: new FormControl(),
      costofAcquisition: new FormControl(),
      capitalGain: new FormControl(),
      taxDeductatSource: new FormControl(),
      taxApplicable: new FormControl(),
      landArea: new FormControl(),
      unitOfLandArea: new FormControl('Decimal'),
      flatArea: new FormControl(),
      unitOfFlatBuildingArea: new FormControl('Square Feet'),
      nameofDeveloper: new FormControl(),
      agreementNo: new FormControl(),
      agreementDate: new FormControl(),
      grossAmount: new FormControl(),
      acquisitionAuthority: new FormControl(),
      orderNo: new FormControl(),
      date: new FormControl(),
      nameOfCompany: new FormControl(),
      boAccount: new FormControl(),
      tinorNid: new FormControl(),
      numberofShares: new FormControl(),
      dateofTransfer: new FormControl(),
      costValueofShare: new FormControl(),
      saleValueofShare: new FormControl(),
      realizedGain: new FormControl(),
      shareholderDirector: new FormControl('0'),
      sponsoredShareholder: new FormControl('0'),
      shareofPaidUp: new FormControl('0'),
      descriptionofAsset: new FormControl(),
      nameofBuyer: new FormControl(),
      invoiceNo: new FormControl(),
      dateofAcquisition: new FormControl(),
      dateofAlienation: new FormControl(),
      salesValue: new FormControl(),
      transferRelatedExpenses: new FormControl(),
      sroNo: new FormControl(),
      year: new FormControl(0),
      particularofSro: new FormControl(),
      incomeExemptedfromTax: new FormControl(),
      applicableTaxasperSro: new FormControl(),
      relatedExpenses: new FormControl(),
      transferNo: new FormControl(),
      taxableIncome: new FormControl()

    });
    this.formArray.push(this.group);
    this.selectedCapitalGain(this.formArray.length - 1);
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.navActiveSelect("6");
    // this.insertFormGroupToArray();
    this.getHeadsOfIncome();
    this.getMainNavbar();
    this.mainNavActiveSelect('2');
    this.isVisibleTab[0] = true;

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion

    this.minDate = new Date(1972, 0, 1);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    this.eReturnSpinner.start();
    this.getCapitalGainData();
    this.checkSubmissionStatus();
    this.eReturnSpinner.stop();

  }

  getCapitalGainData() {
    // debugger;
    this.requestGetData =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };

    this.apiService.get(this.serviceUrl + 'api/get_capital_gains')
      .subscribe(result => {
        this.storeCGApiResponseData = result;
        // console.log('get CG', this.storeCGApiResponseData);
        if (this.storeCGApiResponseData.replyMessage.length > 0) {
          this.isDisableAddSalBtn = false;
          this.isVisibleTab[0] = false;

          this.storeCGApiResponseData.replyMessage.forEach((element, i) => {
            //for validate tds
            this.getCapitalGainTooltips(element.detailsEntities.ICG_TYPE_OF_GAINS);
            this.capitalGainTypeName.push(element.detailsEntities.ICG_TYPE_OF_GAIN_NAME);
            this.group = new FormGroup({
              summaryId: new FormControl(element.summeryEntities.id),
              gainType: new FormControl(element.detailsEntities.ICG_TYPE_OF_GAINS),
              capitalGainTypeName: new FormControl(element.detailsEntities.ICG_TYPE_OF_GAIN_NAME),
              descriptionofProperty: new FormControl(element.detailsEntities.ICG_DES_OF_PROPERTY),
              totalArea: new FormControl(element.detailsEntities.ICG_TOTAL_AREA),
              tinofBuyer: new FormControl(element.detailsEntities.ICG_TIN_OF_BUYER),
              deedNo: new FormControl(element.detailsEntities.ICG_DEED_NO),
              dateofDeed: new FormControl(element.detailsEntities.ICG_DATE_OF_DEED),
              subRegisterOffice: new FormControl(element.detailsEntities.ICG_SUB_REGISTER_OFC),
              saleDeedValue: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_SALE_DEED_VALUE)),
              costofAcquisition: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_COST_OF_ACQUISITION)),
              capitalGain: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_CAPITAL_GAIN)),
              // taxDeductatSource: new FormControl(element.detailsEntities.ICG_TAX_DED_OR_COL_AT_SRC),
              taxDeductatSource: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_TAX_APPLICABLE)),
              landArea: new FormControl(element.detailsEntities.ICG_LAND_AREA),
              flatArea: new FormControl(element.detailsEntities.ICG_FLAT_BUILDING_AREA),
              nameofDeveloper: new FormControl(element.detailsEntities.ICG_NAME_OF_REAL_ESTATE_DEV),
              agreementNo: new FormControl(element.detailsEntities.ICG_AGREEMENT_NO),
              agreementDate: new FormControl(element.detailsEntities.ICG_AGREEMENT_DATE),
              grossAmount: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_GROSS_AMOUNT)),
              acquisitionAuthority: new FormControl(element.detailsEntities.ICG_ACQUISITION_AUTHORITY),
              orderNo: new FormControl(element.detailsEntities.ICG_ORDER_NO),
              date: new FormControl(element.detailsEntities.ICG_ORDER_DATE),
              nameOfCompany: new FormControl(element.detailsEntities.ICG_NAME_OF_COMPANY),
              boAccount: new FormControl(element.detailsEntities.ICG_BO_ACCOUNT),
              tinorNid: new FormControl(element.detailsEntities.ICG_TIN_OR_NID),
              numberofShares: new FormControl(element.detailsEntities.ICG_NUM_OF_SHARES),
              dateofTransfer: new FormControl(element.detailsEntities.ICG_DATE_OF_TRANSFER),
              costValueofShare: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_COST_VAL_OF_SHARE)),
              saleValueofShare: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_SALE_VAL_OF_SHARE)),
              realizedGain: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_REALIZED_GAIN)),
              shareholderDirector: new FormControl(element.detailsEntities.ICG_CHK_SHAREHOLDER_DIR == 'T' ? '1' : '0'),
              sponsoredShareholder: new FormControl(element.detailsEntities.ICG_CHK_SPONSORED_SHAREHOLDER == 'T' ? '1' : '0'),
              shareofPaidUp: new FormControl(element.detailsEntities.ICG_CHK_HAD_TENP_SHARE_CAPITAL == 'T' ? '1' : '0'),
              descriptionofAsset: new FormControl(element.detailsEntities.ICG_DES_OF_ASSET),
              nameofBuyer: new FormControl(element.detailsEntities.ICG_NAME_OF_BUYER),
              invoiceNo: new FormControl(element.detailsEntities.ICG_INVOICE_NO),
              dateofAcquisition: new FormControl(element.detailsEntities.ICG_DATE_OF_ACQUISITION),
              dateofAlienation: new FormControl(element.detailsEntities.ICG_DATE_OF_ALIENATION),
              salesValue: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_SALES_VAL_MARKET_VAL)),
              transferRelatedExpenses: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_TRANSFER_RELATED_EXP)),
              sroNo: new FormControl(element.detailsEntities.ICG_SRO_NO),
              year: new FormControl(element.detailsEntities.ICG_SRO_YEAR),
              particularofSro: new FormControl(element.detailsEntities.ICG_PARTICULAR_OF_SRO),
              incomeExemptedfromTax: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_INCOME_EXEMPTED_FROM_TAX)),
              applicableTaxasperSro: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_APP_TAX_AS_SRO)),
              relatedExpenses: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_RELATED_EXP)),
              transferNo: new FormControl(element.detailsEntities.ICG_TRANSFER_NO),
              taxableIncome: new FormControl(this.commaSeparator.currencySeparatorBD(element.detailsEntities.ICG_TAXABLE_INCOME)),
              unitOfTotalArea: new FormControl(element.detailsEntities.ICG_UNIT_TOTALAREA),
              unitOfLandArea: new FormControl(element.detailsEntities.ICG_UNIT_LANDAREA),
              unitOfFlatBuildingArea: new FormControl(element.detailsEntities.ICG_UNIT_FLATAREA),

            });
            this.formArray.push(this.group);

          });
          this.selectedCapitalGain(this.formArray.length - 1);
        }
        else {
          this.isVisibleForm = 0;
          this.navActiveSelect("6");
          this.insertFormGroupToArray();
          this.getHeadsOfIncome();
          this.getMainNavbar();
          this.mainNavActiveSelect('2');
        }
      })
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
    this.requestGetData =
    {
      "tinNo": this.userTin
    };

    this.apiService.get(this.serviceUrl + 'api/user-panel/get-assessment-additional-info')
      .subscribe(result => {
        getAdditional_info_data = result;
        if (getAdditional_info_data != null) {
          this.incomeYrFrom = getAdditional_info_data.startOfIncomeYr;
          this.minDateLen = new Date(this.incomeYrFrom.substring(6, 12), parseInt(this.incomeYrFrom.substring(3, 5)) - 1, this.incomeYrFrom.substring(0, 2));
          this.incomeYearTo = getAdditional_info_data.endOfIncomeYr;
          this.maxDateLen = new Date(this.incomeYearTo.substring(6, 12), parseInt(this.incomeYearTo.substring(3, 5)) - 1, this.incomeYearTo.substring(0, 2));
          this.dateofAcquisitionTo = new Date(this.incomeYearTo.substring(6, 12), parseInt(this.incomeYearTo.substring(3, 5)) - 1, this.incomeYearTo.substring(0, 2));
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue(getAdditional_info_data.anyTaxRebate == true ? '1' : '0');
          this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue(getAdditional_info_data.incomeExceedFourLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue(getAdditional_info_data.shareholder == true ? '1' : '0');
          this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue(getAdditional_info_data.grossWealthOverFortyLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isOwnmotorCar.setValue(getAdditional_info_data.ownMotorCar == true ? '1' : '0');
          this.additionalInformationForm.controls.isHaveHouseProperty.setValue(getAdditional_info_data.houseProperty == true ? '1' : '0');
          this.additionalInformationForm.controls.isIT10BNotMandatory.setValue(getAdditional_info_data.mandatoryITTenB == true ? '1' : '0');
        }
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Capital Gain');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
      })

  }

  getCapitalGainTooltips(cgType: any) {
    if (cgType === 'Transfer_of_Property_Land') {
      this.getTransOfPerpertyLand_Tooltips();
    }
    else if (cgType === 'Transfer_of_Property_House_Apartment') {
      this.getTransOfPerpertyHouseApt_Tooltips();
    }
    else if (cgType === 'Signing_Money_from_Developer') {
      this.getSigningMoneyFromDev_Tooltips();
    }
    else if (cgType === 'Compensation_Against_Property_Acquisition') {
      this.getCompensionAgainstPropertyAcq_Tooltips();
    }
    else if (cgType === 'Transfer_of_Share_Securities_of_Listed_Company') {
      this.getTransferShareListedCompany_Tooltips();
    }
    else if (cgType === 'Other_Capital_Gain') {
      this.getOtherCG_Tooltips();
    }
    else if (cgType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO') {
      this.getSRO_Tooltips();
    }
  }
  //cg tooltips
  getTransOfPerpertyLand_Tooltips() {
    this.propertyDes = `<span class="btn-block well-sm ">Address, measurement and other relevant information of the land property that you transferred.Transfer includes sale, exchange, or relinquishment, etc.</span>`;
    this.totalArea = `<span class="btn-block well-sm ">Total area of land that has been transferred (You may follow the transfer deed).</span>`;
    this.buyerTIN = `<span class="btn-block well-sm ">Tax Identification Number of the buyer of the land.</span>`;
    this.dateOfDeed = `<span class="btn-block well-sm ">The date on which the transfer deed was registered.</span>`;
    this.deedNumber = `<span class="btn-block well-sm ">The serial number mentioned in transfer deed.</span>`;
    this.subregisterOfc = `<span class="btn-block well-sm ">Name of the Sub Registrar Office where the transfer was registered.</span>`;
    this.saleDeedVal = `<span class="btn-block well-sm ">Value of the transferred land (as mentioned in transfer deed).</span>`;
    this.costOfAcq = `<span class="btn-block well-sm ">Expense incurred to you for the acquisition of the land you transferred.  If the property was earlier reported inyour tax records, enter the value of the land as reported in tax records.</span>`;
    this.capitalGain = `<span class="btn-block well-sm ">The difference between the deed value and the value of the transferred land as reported in any earlier tax records (if any). If no value was reported earlier, enter the deed value.</span>`;
    this.TDS = `<span class="btn-block well-sm ">Amount of Tax deducted / collected at source at the time of registration of the transfer.</span>`;

  }
  getTransOfPerpertyHouseApt_Tooltips() {
    this.propertyDes = `<span class="btn-block well-sm ">Address, measurement and other relevant information of the house property that you transferred.Transfer includes sale, exchange, or relinquishment, etc.</span>`;
    this.landArea = `<span class="btn-block well-sm ">Area of land that has been transferred along with the house property.(You may follow the transfer deed).</span>`;
    this.flatBuildingArea = `<span class="btn-block well-sm ">Total area of house property that has been transferred (You may follow the transfer deed).</span>`;
    this.buyerTIN = `<span class="btn-block well-sm ">Tax Identification Number of the buyer of the land.</span>`;
    this.dateOfDeed = `<span class="btn-block well-sm ">The date on which the transfer deed was registered.</span>`;
    this.deedNumber = `<span class="btn-block well-sm ">The serial number mentioned in transfer deed.</span>`;
    this.subregisterOfc = `<span class="btn-block well-sm ">Name of the Sub Registrar Office where the transfer was registered.</span>`;
    this.saleDeedVal = `<span class="btn-block well-sm ">Value of the transferred land (as mentioned in transfer deed).</span>`;
    this.costOfAcq = `<span class="btn-block well-sm ">Expense incurred to you for the acquisition of the land you transferred.  If the property was earlier reported inyour tax records, enter the value of the land as reported in tax records.</span>`;
    this.capitalGain = `<span class="btn-block well-sm ">The difference between the deed value and the value of the transferred land as reported in any earlier tax records (if any). If no value was reported earlier, enter the deed value.</span>`;
    this.TDS = `<span class="btn-block well-sm ">Amount of Tax deducted / collected at source at the time of registration of the transfer.</span>`;
  }
  getSigningMoneyFromDev_Tooltips() {
    this.propertyDes = `<span class="btn-block well-sm ">Address, measurement and other relevant information of the real estate for which the signing money is received.</span>`;
    this.totalArea = `<span class="btn-block well-sm ">Measurement of land for which the signing money is received.</span>`;
    this.realEstateDev = `<span class="btn-block well-sm ">Name of the real estate developer from whom you received the signing money.</span>`;
    this.agreementNumber = `<span class="btn-block well-sm ">The registration number (if any) of deed signed between you and the developer.</span>`;
    this.agreementDate = `<span class="btn-block well-sm ">The date of signing of the deed between you and the developer.</span>`;
    this.grossAmount = `<span class="btn-block well-sm ">Gross amount of signing money before the deduction of tax at source.</span>`;
    this.TDS = `<span class="btn-block well-sm ">Amount of tax deducted / collected from you at the time of paying the signing money by the Developer.</span>`;
  }

  getCompensionAgainstPropertyAcq_Tooltips() {
    this.propertyDes = `<span class="btn-block well-sm ">Location, address, measurement and other relevant information of your property that was acquired.</span>`;
    this.totalArea = `<span class="btn-block well-sm ">Measurement of the acquired property. You may find the information in the notice of acquisition.</span>`;
    this.acqAuthority = `<span class="btn-block well-sm ">Name of the office or authority that issued the notice of acquisition.</span>`;
    this.orderNo = `<span class="btn-block well-sm ">The issue number/acquisition number mentioned in acquisition order.</span>`;
    this.compensionDate = `<span class="btn-block well-sm ">The date of issuing acquisition order.</span>`;
    this.grossAmount = `<span class="btn-block well-sm ">Gross amount of compensation before the deduction of tax at source.</span>`;
    this.TDS = `<span class="btn-block well-sm ">Amount of tax deducted / collected from you at the time of paying the compensation money the relevant authority.</span>`;
  }

  getTransferShareListedCompany_Tooltips() {
    this.companyName = `<span class="btn-block well-sm ">Name the company whose share you transferred.Transfer includes sale, exchange, or relinquishment, etc.</span>`;
    this.transferNo = `<span class="btn-block well-sm ">Transfer reference number provided by your brokerage house.</span>`;
    this.transferDate = `<span class="btn-block well-sm ">Date in which your shares were transferred.</span>`;
    this.shareTransfered = `<span class="btn-block well-sm ">Number of shares you have transferred .</span>`;
    this.saleValue = `<span class="btn-block well-sm ">Total amount received by you from the transfer.</span>`;
    this.costValue = `<span class="btn-block well-sm ">Cost value of shares that have been transferred.</span>`;
    this.relatedExp = `<span class="btn-block well-sm ">Allowable expenses incurred for transfer.</span>`;
    this.realizedGain = `<span class="btn-block well-sm ">Amount of gain realized from the transfer of shares. You may find the information in the statement provided by your brokerage house.</span>`;
    this.TDS = `<span class="btn-block well-sm ">The amount of tax deducted or collected at source on capital gain from sale of shares. </span>`;
  }

  getOtherCG_Tooltips() {
    this.desOfAsset = `<span class="btn-block well-sm ">Type, location, ownership, measurement and other necessary description of capital asset that was transferred.Transfer includes sale, exchange, or relinquishment, etc.</span>`;
    this.nameOfBuyer = `<span class="btn-block well-sm ">Name of the person in favor of whom the capital asset was transferred.</span>`;
    this.TINorNID = `<span class="btn-block well-sm ">TIN or NID of the buyer/transferee.</span>`;
    this.invoiceNo = `<span class="btn-block well-sm ">Number mentioned in the transfer invoice.</span>`;
    this.dateOfAcq = `<span class="btn-block well-sm ">Date of acquisition of the capital assets that was transferred.</span>`;
    this.dateOfAli = `<span class="btn-block well-sm ">Date in which the ownership of the capital asset was alienated from you. Applicable in certain type of transfer.</span>`;
    this.saleValueMarketValue = `<span class="btn-block well-sm ">The value at which asset was transferred (or the fair market value of transfer, if such value was applied). </span>`;
    this.costOfAcq = `<span class="btn-block well-sm ">Amount spent for the acquisition of the house property you transferred.  If the property was earlier reported in your tax records, enter the value of the house property as reported in tax records.</span>`;
    this.relatedExp = `<span class="btn-block well-sm ">The amount of allowable expense incurred solely for the purpose of this transfer.</span>`;
    this.capitalGain = `<span class="btn-block well-sm ">Calculated by deducting Cost of Acquisition and Transfer Related Expenses from Sale Value/Fair Market Value (whichever is applicable)</span>`;
  }

  getSRO_Tooltips() {
    this.desOfAsset = `<span class="btn-block well-sm ">Type, location, ownership, measurement and other necessary description of capital asset that was transferred. Transfer includes sale, exchange, or relinquishment, etc.</span>`;
    this.nameOfBuyer = `<span class="btn-block well-sm ">Name of the person in favor of whom the capital asset was transferred.</span>`;
    this.TINorNID = `<span class="btn-block well-sm ">TIN or NID of the buyer/transferee.</span>`;
    this.invoiceNo = `<span class="btn-block well-sm ">Number mentioned in the transfer invoice.</span>`;
    this.dateOfAcq = `<span class="btn-block well-sm ">Date of acquisition of the capital assets that was transferred.</span>`;
    this.dateOfAli = `<span class="btn-block well-sm ">Date in which the ownership of the capital asset was alienated from you. Applicable in certain type of transfer.</span>`;
    this.saleValueMarketValue = `<span class="btn-block well-sm ">The value at which asset was transferred (or the fair market value of transfer, if such value was applied). </span>`;
    this.costOfAcq = `<span class="btn-block well-sm ">Amount spent for the acquisition of the house property you transferred.  If the property was earlier reported in your tax records, enter the value of the house property as reported in tax records.</span>`;
    this.relatedExp = `<span class="btn-block well-sm ">The amount of allowable expense incurred solely for the purpose of this transfer.</span>`;
    this.capitalGain = `<span class="btn-block well-sm ">Calculated by deducting Cost of Acquisition and Transfer Related Expenses from Sale Value/Fair Market Value (whichever is applicable)</span>`;
    this.sroNo = `<span class="btn-block well-sm ">The number of SRO under which your capital gain income enjoys special tax treatment.</span>`;
    this.sroYear = `<span class="btn-block well-sm ">The year which the SRO is issued.</span>`;
    this.particularSRO = `<span class="btn-block well-sm ">Any necessary description of SRO (such as its subject matter).</span>`;
    this.taxExemptedIncome = `<span class="btn-block well-sm ">The amount of income tax that is exempted from tax.</span>`;
    this.taxableIncome = `<span class="btn-block well-sm ">The amount of income tax that is taxable.</span>`;
    this.applicableTax = `<span class="btn-block well-sm ">The tax rate as mentioned in SRO and applicable for your transfer.</span>`;
  }

  dateValidation(dateOfAcq, dateOfAli,): boolean {
    let acquisitionDate = +(new Date()) - +(this.formattingDate(dateOfAcq));
    let alienationDate = +(new Date()) - +(this.formattingDate(dateOfAli));

    if (acquisitionDate > alienationDate)
      return true;
    else
      return false;

  }

  acceptPositiveIntegerOnly(event:any,i)
  {
    this.formArray.controls[i].patchValue({
      numberofShares: parseInt(event.target.value) ? event.target.value : ''
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

  makeTaxExemptedIncReadOnly(salesProceed: any): boolean {
    // debugger;
    if (parseInt(salesProceed) < 0)
      return true;
    else
      return false;
  }

  initializeTotalArea(event, i) {
    this.totalArea_showError[i] = false;
    if (parseFloat(event.target.value) <= 0) {
      this.toastr.warning('Total Area will be More than 0!');
      this.formArray.controls[i].patchValue({
        totalArea: ''
      });
      return;
    }
  }

  initializeLandArea(event, i) {
    this.landArea_showError[i] = false;
    if (parseFloat(event.target.value) === 0) {
      this.toastr.warning('Land Area will be More than 0!');
      this.formArray.controls[i].patchValue({
        landArea: ''
      });
      return;
    }
  }
  initializeFlatArea(event, i) {
    this.flatArea_showError[i] = false;
    if (parseFloat(event.target.value) === 0) {
      this.toastr.warning('Flat/Building Area will be More than 0!');
      this.formArray.controls[i].patchValue({
        flatArea: ''
      });
      return;
    }
  }


  initializeTDS(event, i) {
    this.tds_showError[i] = false;
    this.formArray.controls[i].patchValue({
      taxDeductatSource: parseInt(event.target.value) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0)) : ''
    });
  }

  initializeGrossAmount(event, i) {
    this.grossAmount_showError[i] = false;
    if (parseInt(event.target.value) === 0) {
      this.toastr.warning('Gross Amount will be More than 0!');
      this.formArray.controls[i].patchValue({
        grossAmount: ''
      });
      return;
    }
    else {
      this.formArray.controls[i].patchValue({
        grossAmount: parseInt(event.target.value) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0)) : ''
      });
    }
  }

  initializeSaleValMarketVal(value, i) {
    this.saleMarketValue_showError[i] = false;
    if (parseInt(value) === 0) {
      this.toastr.warning('Sales Value/Fair Market Value will be More than 0!');
      this.formArray.controls[i].patchValue({
        salesValue: ''
      });
      return;
    }
    else {
      this.formArray.controls[i].patchValue({
        salesValue: parseInt(value) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(value, 0)) : ''
      });
    }
  }

  initializeaAppTax(event, i) {
    this.applicableTax_showError[i] = false;
    this.formArray.controls[i].patchValue({
      applicableTaxasperSro: parseInt(event.target.value) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0)) : ''
    });
  }

  acceptAreasFloatingPoints(event: any, i, formControlName) {
    let str = event.target.value;
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(str).toLowerCase());
    //console.log(result);
    if (!result) {
      if (formControlName === 'totalArea')
        this.formArray.controls[i].patchValue({
          totalArea: str.substring(0, str.length - 1)
        });
      else if (formControlName === 'landArea')
        this.formArray.controls[i].patchValue({
          landArea: str.substring(0, str.length - 1)
        });
      else if (formControlName === 'flatArea')
        this.formArray.controls[i].patchValue({
          flatArea: str.substring(0, str.length - 1)
        });
    }
    else {
    }
  }

  initializeDateOfAlienation(i)
  {
    this.dateValidation_showError[i] = false;
    this.dateOfAli_showError[i] = false;
  }

  setupDateOfAlienation(value: Date,i) {
    this.dateValidation_showError[i] = false;
    this.dateOfAcq_showError[i] = false;
    let dateofAcquisition: any;
    // this.dateOfAcqCounter++;
    if (value != null) {
      dateofAcquisition = value ? moment(value, 'DD-MM-YYYY') : '';
      dateofAcquisition = this.datepipe.transform(dateofAcquisition, 'dd-MM-yyyy');
      this.maxAlienationFrom[i] = new Date(dateofAcquisition.substring(6, 12), parseInt(dateofAcquisition.substring(3, 5)) - 1, parseInt(dateofAcquisition.substring(0, 2)) + 1);
      //console.log(dateofAcquisition);
    }
  }

  chkDateofAcquisitionExists(i): void {
    this.dateOfAliCounter++;
    if (this.dateOfAliCounter > 1 && this.formArray.controls[i].value.dateofAcquisition === '') {
      this.toastr.warning('Select Date of Acquisition First!');
      this.formArray.controls.forEach((element, index) => {
        if (index == i) {
          this.formArray.controls[i].patchValue({
            dateofAcquisition: '',
            dateofAlienation: ''
          });
        }
      })
    }
  }

  isShareHolderDirector($event, i) {
    if ($event.target.value) {
      let isBool = false;
      isBool = $event.target.value == 1 ? true : false;
      if (isBool) {
        this.shareHolderDirector[i] = true;
      }
      else {
        this.shareHolderDirector[i] = false;
      }
    }

  }
  isNotShareHolderDirector($event, i) {
    let isBool = false;
    isBool = $event.target.value == 0 ? true : false;
    if (isBool) {
      this.shareHolderDirector[i] = false;
    }
    else {
      this.shareHolderDirector[i] = true;
    }
  }
  isSponsoredShareholder($event, i) {
    let isBool = false;
    isBool = $event.target.value == 1 ? true : false;
    if (isBool) {
      this.sponsoredShareholder[i] = true;
    }
    else {
      this.sponsoredShareholder[i] = false;
    }
  }
  isNotSponsoredShareholder($event, i) {
    let isBool = false;
    isBool = $event.target.value == 0 ? true : false;
    if (isBool) {
      this.sponsoredShareholder[i] = false;
    }
    else {
      this.sponsoredShareholder[i] = true;
    }
  }

  isHad10pShare($event, i) {
    let isBool = false;
    isBool = $event.target.value == 1 ? true : false;
    if (isBool) {
      this.had10pShare[i] = true;
    }
    else {
      this.had10pShare[i] = false;
    }
  }
  isNotHad10pShare($event, i) {
    let isBool = false;
    isBool = $event.target.value == 0 ? true : false;
    if (isBool) {
      this.had10pShare[i] = false;
    }
    else {
      this.had10pShare[i] = true;
    }

  }

  initializeNoShareTransfered(i)
  {
    this.noOfShareTransfered_showError[i] = false;
  }
  initializeTransferDate(i)
  {
    this.dateOfTransfer_showError[i] = false;
  }

  initializeTransferNo(i)
  {
    this.transferNo_showError[i] = false;
  }

  initializeDesOfProperty(i)
  {
     this.desOfProperty_showError[i] = false;
     this.nameOfCompany_showError[i] = false;
  }
  initializeTinOfBuyer(i)
  {
     this.tinOfBuyer_showError[i] = false;
  }
  initializeDeedNo(i)
  {
     this.deedNo_showError[i] = false;
  }
  initializeDateOfDeed(i)
  {
    this.dateOfDeed_showError[i] = false;
  }
  initializeSubRegisterOfc(i)
  {
    this.subRegisterOfc_showError[i] = false;
  }
  initializeRealEstateDev(i)
  {
    this.nameOfRealEstateDev_showError[i] = false;
  }
  initializeAcqAuthority(i)
  {
    this.acqAuthority_showError[i] = false;
  }
  initializeOrderNo(i)
  {
    this.orderNo_showError[i] = false;
  }
  initializeDate(i)
  {
    this.date_showError[i] = false;
  }
  initializeInvoiceNo(i)
  {
    this.invoiceNo_showError[i] = false;
  }
  initializeSRO(i)
  {
    this.sroNo_showError[i] = false;
  }
  initializeYear(i)
  {
    this.year_showError[i] = false;
  }
  initializeParticularSRO(i)
  {
    this.particularSRO_showError[i] = false;
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }

  capitalGainTypeChange(event, i) {

    this.clearExistingFormData(i);
    this.getCapitalGainTooltips(event.target.value);
    this.initializeErrorIndexes(i);
    if (event.target.value === "Transfer_of_Property_Land") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
    }
    else if (event.target.value === "Transfer_of_Property_House_Apartment") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

    } else if (event.target.value === "Signing_Money_from_Developer") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;

    } else if (event.target.value === "Compensation_Against_Property_Acquisition") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
    } else if (event.target.value === "Transfer_of_Share_Securities_of_Listed_Company") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
    } else if (event.target.value === "Other_Capital_Gain") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
    } else if (event.target.value === "Gain_Exempted_or_Reduced_Tax_Rate_by_SRO") {
      this.capitalGainTypeName[i] = event.target.options[event.target.options.selectedIndex].text;
      this.isVisibleTab[i] = false;
      this.isDisableAddSalBtn = false;
    }

    else {
      this.capitalGainTypeName[i] = '';
      this.isVisibleTab[i] = false;
    }

    this.formArray.controls[this.formArray.length - 1].patchValue({
      capitalGainTypeName: this.capitalGainTypeName,
    });

  }

  clearExistingFormData(i) {
    // debugger;
    //console.log(this.formArray.controls[i].value.summaryId);
    //reset forms
    this.formArray.controls[i].patchValue({
      summaryId: this.formArray.controls[i].value.summaryId ? this.formArray.controls[i].value.summaryId : null,
      // gainType: new FormControl(0),
      // capitalGainTypeName: new FormControl(""),
      descriptionofProperty: '',
      totalArea: '',
      tinofBuyer: '',
      deedNo: '',
      dateofDeed: '',
      subRegisterOffice: '',
      saleDeedValue: '',
      costofAcquisition: '',
      capitalGain: '',
      taxDeductatSource: '',
      landArea: '',
      flatArea: '',
      nameofDeveloper: '',
      agreementNo: '',
      agreementDate: '',
      grossAmount: '',
      acquisitionAuthority: '',
      orderNo: '',
      date: '',
      nameOfCompany: '',
      boAccount: '',
      tinorNid: '',
      numberofShares: '',
      dateofTransfer: '',
      costValueofShare: '',
      saleValueofShare: '',
      realizedGain: '',
      shareholderDirector: '0',
      sponsoredShareholder: '0',
      shareofPaidUp: '0',
      descriptionofAsset: '',
      nameofBuyer: '',
      invoiceNo: '',
      dateofAcquisition: '',
      dateofAlienation: '',
      salesValue: '',
      transferRelatedExpenses: '',
      sroNo: '',
      year: '',
      particularofSro: '',
      incomeExemptedfromTax: '',
      applicableTaxasperSro: '',
      relatedExpenses: '',
      transferNo: '',
      unitOfLandArea: 'Decimal',
      unitOfFlatBuildingArea: 'Square Feet',
      unitOfTotalArea: 'Decimal',
    });
  }


  //#region CG Calculation
  capital_gain_Calc(i, formControlName) {
    //
    let deed_value: any; let cost_of_acq: any; let tmpCapitalGain: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (formControlName === 'saleDeedValue')
         {
          this.saleDeedVal_showError[i] = false;
          this.formArray.controls[i].patchValue({
            saleDeedValue: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.saleDeedValue, 0)),
          });
         }
        if (formControlName === 'costofAcquisition')
        {
          this.formArray.controls[i].patchValue({
            costofAcquisition: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costofAcquisition, 0)),
          });
        }

        deed_value = element.value.saleDeedValue ? this.commaSeparator.removeComma(element.value.saleDeedValue, 0) : 0;
        cost_of_acq = element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0;

        tmpCapitalGain = parseFloat(deed_value) - parseFloat(cost_of_acq);
        this.formArray.controls[i].patchValue({
          capitalGain: this.commaSeparator.currencySeparatorBD(tmpCapitalGain)
        });
      }
    });
  }

  sro_capital_gain_Calc(i,formControlName) {
    //
    // this.initializeSaleValMarketVal(this.commaSeparator.removeComma(this.formArray.controls[i].value.salesValue,0),i);
    let sale_market_value: any; let cost_of_acq: any; let transfer_related_exp: any; let tmpCapitalGain: any;
    this.formArray.controls.forEach((element, index) => {
      this.saleMarketValue_showError[index] = false;
      if (index == i) {
        if(formControlName === 'salesValue')
        {
          if (element.value.salesValue == 0) {
              this.toastr.warning('Sales Value/Fair Market Value will be More than 0!');
              this.formArray.controls[i].patchValue({
                salesValue: '',
              });
            }
            else
            {
              this.formArray.controls[i].patchValue({
                salesValue: parseInt(element.value.salesValue) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.salesValue, 0)) : '',
              });
            }
        }
        if(formControlName === 'costofAcquisition')
        {
          this.formArray.controls[i].patchValue({
            costofAcquisition: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costofAcquisition, 0)),
          });
        }
        if(formControlName === 'transferRelatedExpenses')
        {
          this.formArray.controls[i].patchValue({
            transferRelatedExpenses: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.transferRelatedExpenses, 0)),
          });
        }

          sale_market_value = element.value.salesValue ? this.commaSeparator.removeComma(element.value.salesValue, 0) : 0;
          cost_of_acq = element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0;
          transfer_related_exp = element.value.transferRelatedExpenses ? this.commaSeparator.removeComma(element.value.transferRelatedExpenses, 0) : 0;

          tmpCapitalGain = parseFloat(sale_market_value) - (parseFloat(cost_of_acq) + parseFloat(transfer_related_exp));
          this.formArray.controls[i].patchValue({
            capitalGain: parseInt(tmpCapitalGain) ? this.commaSeparator.currencySeparatorBD(tmpCapitalGain) : ''
          });    
      }
    });

    // this.initializeSaleValMarketVal(this.commaSeparator.removeComma(this.formArray.controls[i].value.salesValue,0),i);
    this.formArray.controls.forEach((element, index) => {
      let tmpTaxableIncome: any;
      if (index == i) {
        this.formArray.controls[i].patchValue({
          incomeExemptedfromTax: parseInt(element.value.incomeExemptedfromTax) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0)) : '',
        });

        let taxExemptedIncome = element.value.incomeExemptedfromTax ? this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0) : 0;
        if (parseInt(this.commaSeparator.removeComma(element.value.capitalGain, 0)) < 0) {
          this.formArray.controls[i].patchValue({
            incomeExemptedfromTax: 0,
            taxableIncome: 0
          });
        }
        else {
          tmpTaxableIncome = parseFloat(this.commaSeparator.removeComma(element.value.capitalGain, 0)) - parseFloat(taxExemptedIncome.toString());
          //console.log(tmpTaxableIncome);
          this.formArray.controls[i].patchValue({
            taxableIncome: parseInt(tmpTaxableIncome) ? this.commaSeparator.currencySeparatorBD(tmpTaxableIncome) : ''
          });
        }

      }
    });
  }

  shared_company_reliazed_gain_calc(i, formControlName) {
    let cost_val_share: any; let sale_val_share: any; let related_expense: any; let tmpRealizedGain: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {

        if (this.commaSeparator.removeComma(element.value.saleValueofShare, 0) === '0') {
          this.toastr.warning('Sale Value of Share will be More than 0!');
          this.formArray.controls[i].patchValue({
            saleValueofShare: ''
          });

          if (formControlName === 'costValueofShare')
           {
             this.costValueOfShare_showError[i] = false;
            this.formArray.controls[i].patchValue({
              costValueofShare: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costValueofShare, 0)),
            });
           }
          if (formControlName === 'relatedExpenses')
            this.formArray.controls[i].patchValue({
              relatedExpenses: parseInt(element.value.relatedExpenses) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.relatedExpenses, 0)) : '',
            });

          this.formArray.controls[i].patchValue({
            saleValueofShare: '',
          });

          cost_val_share = element.value.costValueofShare ? this.commaSeparator.removeComma(element.value.costValueofShare, 0) : 0;
          sale_val_share = element.value.saleValueofShare ? this.commaSeparator.removeComma(element.value.saleValueofShare, 0) : 0;
          related_expense = element.value.relatedExpenses ? this.commaSeparator.removeComma(element.value.relatedExpenses, 0) : 0;

          tmpRealizedGain = parseFloat(sale_val_share) - parseFloat(cost_val_share) - parseFloat(related_expense);

          this.formArray.controls[i].patchValue({
            realizedGain: this.commaSeparator.currencySeparatorBD(tmpRealizedGain),
          });

        }
        else {
          if (formControlName === 'costValueofShare')
           {
            this.costValueOfShare_showError[i] = false;
            this.formArray.controls[i].patchValue({
              costValueofShare: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.costValueofShare, 0)),
            });
           }
          if (formControlName === 'saleValueofShare')
           {
            this.saleValueOfShare_showError[i] = false;
            this.formArray.controls[i].patchValue({
              saleValueofShare: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.saleValueofShare, 0)),
            });
           }
          if (formControlName === 'relatedExpenses')
           {
            this.formArray.controls[i].patchValue({
              relatedExpenses: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.relatedExpenses, 0)),
            });
           }

          cost_val_share = element.value.costValueofShare ? this.commaSeparator.removeComma(element.value.costValueofShare, 0) : 0;
          sale_val_share = element.value.saleValueofShare ? this.commaSeparator.removeComma(element.value.saleValueofShare, 0) : 0;
          related_expense = element.value.relatedExpenses ? this.commaSeparator.removeComma(element.value.relatedExpenses, 0) : 0;

          tmpRealizedGain = parseFloat(sale_val_share) - parseFloat(cost_val_share) - parseFloat(related_expense);
          this.formArray.controls[i].patchValue({
            realizedGain: this.commaSeparator.currencySeparatorBD(tmpRealizedGain),
          });
        }
      }
    });
  }
  //#endregion

  selectedCapitalGain(i: number) {
    this.isVisibleForm = i;
    this.getCapitalGainTooltips(this.formArray.controls[i].value.gainType);
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
      if (index == i && element.value.summaryId > 0) {
        let obj = {
          "assessmentYear": "2021-2022",
          "summaryId": element.value.summaryId,
          "tinNo": this.userTin
        }
        this.apiService.post(this.serviceUrl + 'api/delete_capital_gain', obj)
          .subscribe(result => {
            if (result.success) {
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
      else if (index == i && element.value.summaryId <= 0) {
        this.afterTabClose(i);
      }
    });
  }

  afterTabClose(i) {
    this.formArray.removeAt(i);
    this.capitalGainTypeName.splice(i, 1);
    this.closeErrorIndexes(i);
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
    this.typeOfGains_showError[i] = false;
    this.desOfProperty_showError[i] = false;
    this.nameOfCompany_showError[i] = false;
    this.transferNo_showError[i] = false;
    this.dateOfTransfer_showError[i] = false;
    this.noOfShareTransfered_showError[i] = false;
    this.saleValueOfShare_showError[i] = false;
    this.costValueOfShare_showError[i] = false;
    this.invoiceNo_showError[i] = false;
    this.dateOfAcq_showError[i] = false;
    this.dateOfAli_showError[i] = false;
    this.saleMarketValue_showError[i] = false;
    this.sroNo_showError[i] = false;
    this.year_showError[i] = false;
    this.particularSRO_showError[i] = false;
    this.incomeExemptedTax_showError[i] = false;
    this.applicableTax_showError[i] = false;
    this.totalArea_showError[i] = false;
    this.landArea_showError[i] = false;
    this.flatArea_showError[i] = false;
    this.acqAuthority_showError[i] = false;
    this.orderNo_showError[i] = false;
    this.date_showError[i] = false;
    this.nameOfRealEstateDev_showError[i] = false;;
    this.tinOfBuyer_showError[i] = false;
    this.deedNo_showError[i] = false;
    this.dateOfDeed_showError[i] = false;
    this.subRegisterOfc_showError[i] = false;
    this.saleDeedVal_showError[i] = false;
    this.grossAmount_showError[i] = false;
    this.tds_showError[i] = false;
    this.dateValidation_showError[i] = false;
  }

  closeErrorIndexes(i) {
    this.typeOfGains_showError.splice(i, 1);
    this.desOfProperty_showError.splice(i, 1);
    this.nameOfCompany_showError.splice(i, 1);
    this.transferNo_showError.splice(i, 1);
    this.dateOfTransfer_showError.splice(i, 1);
    this.noOfShareTransfered_showError.splice(i, 1);
    this.saleValueOfShare_showError.splice(i, 1);
    this.costValueOfShare_showError.splice(i, 1);
    this.invoiceNo_showError.splice(i, 1);
    this.dateOfAcq_showError.splice(i, 1);
    this.dateOfAli_showError.splice(i, 1);
    this.saleMarketValue_showError.splice(i, 1);
    this.sroNo_showError.splice(i, 1);
    this.year_showError.splice(i, 1);
    this.particularSRO_showError.splice(i, 1);
    this.incomeExemptedTax_showError.splice(i, 1);
    this.applicableTax_showError.splice(i, 1);
    this.totalArea_showError.splice(i, 1);
    this.landArea_showError.splice(i, 1);
    this.flatArea_showError.splice(i, 1);
    this.acqAuthority_showError.splice(i, 1);
    this.orderNo_showError.splice(i, 1);
    this.date_showError.splice(i, 1);
    this.nameOfRealEstateDev_showError.splice(i, 1);;
    this.tinOfBuyer_showError.splice(i, 1);
    this.deedNo_showError.splice(i, 1);
    this.dateOfDeed_showError.splice(i, 1);
    this.subRegisterOfc_showError.splice(i, 1);
    this.saleDeedVal_showError.splice(i, 1);
    this.grossAmount_showError.splice(i, 1);
    this.tds_showError.splice(i, 1);
    this.dateValidation_showError.splice(i, 1);
  }


  calculateTDS_SMoney(i) {
    //tds will be 15% of gross amount
    let calTDS: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        if (this.commaSeparator.removeComma(element.value.grossAmount, 0) === '0') {
          this.toastr.warning('Gross Amount will be More than 0!');
          this.formArray.controls[i].patchValue({
            grossAmount: ''
          });
          return;
        }
        else {
          this.formArray.controls[i].patchValue({
            grossAmount: parseInt(element.value.grossAmount) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.grossAmount, 0)) : '',
          });

          calTDS = element.value.grossAmount ? parseInt(this.commaSeparator.removeComma(element.value.grossAmount, 0)) * 0.15 : 0;

          this.formArray.controls[i].patchValue({
            // taxDeductatSource: calTDS,
            taxApplicable: parseInt(calTDS) ? this.commaSeparator.currencySeparatorBD(calTDS) : '',
          });
        }
      }
    })
  }

  calculateTDS_Shareholder(i) {
    //tds will be 5% of gross amount
    let calTDS: any;
    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        calTDS = element.value.realizedGain ? Math.round(element.value.realizedGain) * 0.05 : 0;
      }
      this.formArray.controls[i].patchValue({
        // taxDeductatSource: calTDS,
        taxApplicable: parseInt(calTDS) ? calTDS : '',
      });
    })
  }

  calc_taxable_incm(i) {
    let taxableIncome: any;
    let taxExemptedIncome: any; let tmpCapitalGain: any;
    this.formArray.controls.forEach((element, index) => {
      this.incomeExemptedTax_showError[i] = false;
      if (index == i) {
        this.formArray.controls[i].patchValue({
          incomeExemptedfromTax: parseInt(element.value.incomeExemptedfromTax) ? this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0)) : '',
        });

        taxExemptedIncome = element.value.incomeExemptedfromTax ? parseFloat(this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0)) : 0;
        tmpCapitalGain = parseFloat(this.commaSeparator.removeComma(element.value.capitalGain, 0));


        taxableIncome = tmpCapitalGain - taxExemptedIncome;
        if (taxExemptedIncome > tmpCapitalGain) {
          this.toastr.warning('Tax Exempted Income cannot more than Sales Value/Fair Market Value!', '', {
            timeOut: 3000,
          });

          this.formArray.controls[i].patchValue({
            incomeExemptedfromTax: 0
          });


          this.formArray.controls[i].patchValue({
            taxableIncome: parseInt(taxableIncome) ? this.commaSeparator.currencySeparatorBD(taxableIncome) : ''
          });
          return;
        }
        else {
          this.formArray.controls[i].patchValue({
            taxableIncome: parseInt(this.commaSeparator.removeComma(taxableIncome, 0)) <= 0 ? 0 : this.commaSeparator.currencySeparatorBD(taxableIncome),
          });
        }

      }
    });
  }

  validateCG(): any {
    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if (element.value.gainType === 0) {
        this.typeOfGains_showError[index] = true;
        successValidation = false;
      }

      if (element.value.gainType === 'Transfer_of_Property_Land' || element.value.gainType === 'Transfer_of_Property_House_Apartment') {
        if (element.value.descriptionofProperty == '' || element.value.descriptionofProperty == null) {
          this.desOfProperty_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Transfer_of_Property_Land' && (element.value.totalArea == '' || element.value.totalArea == null || element.value.totalArea == 0)) {
          this.totalArea_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Transfer_of_Property_House_Apartment' && (element.value.landArea == '' || element.value.landArea == null || element.value.landArea == 0)) {
          this.landArea_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Transfer_of_Property_House_Apartment' && (element.value.flatArea == '' || element.value.flatArea == null || element.value.flatArea == 0)) {
          this.flatArea_showError[index] = true;
          successValidation = false;
        }
        if (element.value.tinofBuyer == '' || element.value.tinofBuyer == null || element.value.tinofBuyer.length != 12) {
          this.tinOfBuyer_showError[index] = true;
          successValidation = false;
        }
        if (element.value.deedNo == '' || element.value.deedNo == null) {
          this.deedNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.dateofDeed == '' || element.value.dateofDeed == null) {
          this.dateOfDeed_showError[index] = true;
          successValidation = false;
        }
        if (element.value.subRegisterOffice == '' || element.value.subRegisterOffice == null) {
          this.subRegisterOfc_showError[index] = true;
          successValidation = false;
        }
        if (element.value.saleDeedValue == '' || element.value.saleDeedValue == null) {
          this.saleDeedVal_showError[index] = true;
          successValidation = false;
        }
        if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.tds_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.gainType === 'Signing_Money_from_Developer' || element.value.gainType === 'Compensation_Against_Property_Acquisition') {
        if (element.value.descriptionofProperty == '' || element.value.descriptionofProperty == null) {
          this.desOfProperty_showError[index] = true;
          successValidation = false;
        }
        if (element.value.totalArea == '' || element.value.totalArea == null) {
          this.totalArea_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Signing_Money_from_Developer' && (element.value.nameofDeveloper == '' || element.value.nameofDeveloper == null)) {
          this.nameOfRealEstateDev_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Compensation_Against_Property_Acquisition' && (element.value.acquisitionAuthority == '' || element.value.acquisitionAuthority == null)) {
          this.acqAuthority_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Compensation_Against_Property_Acquisition' && (element.value.orderNo == '' || element.value.orderNo == null)) {
          this.orderNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Compensation_Against_Property_Acquisition' && (element.value.date == '' || element.value.date == null)) {
          this.date_showError[index] = true;
          successValidation = false;
        }
        if (element.value.grossAmount == '' || element.value.grossAmount == null) {
          this.grossAmount_showError[index] = true;
          successValidation = false;
        }
        if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.tds_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.gainType === 'Transfer_of_Share_Securities_of_Listed_Company') {
        if (element.value.nameOfCompany == '' || element.value.nameOfCompany == null) {
          this.nameOfCompany_showError[index] = true;
          successValidation = false;
        }
        if (element.value.transferNo == '' || element.value.transferNo == null) {
          this.transferNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.dateofTransfer == '' || element.value.dateofTransfer == null) {
          this.dateOfTransfer_showError[index] = true;
          successValidation = false;
        }
        if (element.value.numberofShares == '' || element.value.numberofShares == null) {
          this.noOfShareTransfered_showError[index] = true;
          successValidation = false;
        }
        if (element.value.saleValueofShare == '' || element.value.saleValueofShare == null) {
          this.saleValueOfShare_showError[index] = true;
          successValidation = false;
        }
        if (element.value.costValueofShare == '' || element.value.costValueofShare == null) {
          this.costValueOfShare_showError[index] = true;
          successValidation = false;
        }
        if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.tds_showError[index] = true;
          successValidation = false;
        }
      }
      if (element.value.gainType === 'Other_Capital_Gain' || element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO') {
        let acquisitionDate: any, convertedAcqDate: any, alienationDate: any, convertedAliDate: any; let isAliDateGreateThnAcqDate: boolean;
        acquisitionDate = element.value.dateofAcquisition ? moment(element.value.dateofAcquisition, 'DD-MM-YYYY') : '';
        convertedAcqDate = this.datepipe.transform(acquisitionDate, 'dd-MM-yyyy');

        alienationDate = element.value.dateofAlienation ? moment(element.value.dateofAlienation, 'DD-MM-YYYY') : '';
        convertedAliDate = this.datepipe.transform(alienationDate, 'dd-MM-yyyy');
        isAliDateGreateThnAcqDate = (convertedAcqDate == null || convertedAliDate == null) ? false : this.dateValidation(convertedAcqDate, convertedAliDate);

        if (element.value.descriptionofAsset == '' || element.value.descriptionofAsset == null) {
          this.desOfProperty_showError[index] = true;
          successValidation = false;
        }
        if ((element.value.tinorNid != null && element.value.tinorNid != "") && (element.value.tinorNid.length != 10 && element.value.tinorNid.length != 12 && element.value.tinorNid.length != 13 && element.value.tinorNid.length != 17)) {
          this.tinOfBuyer_showError[index] = true;
          successValidation = false;
        }
        if (element.value.dateofAcquisition == '' || element.value.dateofAcquisition == null) {
          this.dateOfAcq_showError[index] = true;
          successValidation = false;
        }
        if (element.value.dateofAlienation == '' || element.value.dateofAlienation == null) {
          this.dateOfAli_showError[index] = true;
          successValidation = false;
        }
        if (!isAliDateGreateThnAcqDate) {
          this.dateValidation_showError[index] = true;
          successValidation = false;
        }
        if (element.value.salesValue == '' || element.value.salesValue == null) {
          this.saleMarketValue_showError[index] = true;
          successValidation = false;
        }

        if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.sroNo == '' || element.value.sroNo == null)) {
          this.sroNo_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.year == '' || element.value.year == null)) {
          this.year_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.particularofSro == '' || element.value.particularofSro == null)) {
          this.particularSRO_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.incomeExemptedfromTax == '' || element.value.incomeExemptedfromTax == null)) {
          this.incomeExemptedTax_showError[index] = true;
          successValidation = false;
        }
        if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.applicableTaxasperSro == '' || element.value.applicableTaxasperSro == null)) {
          this.applicableTax_showError[index] = true;
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
      if (element.value.gainType === 0 && !isFoundErrorIndex && this.typeOfGains_showError[index]) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Transfer_of_Property_Land' && !isFoundErrorIndex && (
        this.typeOfGains_showError[index] || this.desOfProperty_showError[index] || this.totalArea_showError[index] || this.tinOfBuyer_showError[index] || this.deedNo_showError[index] ||
        this.dateOfDeed_showError[index] || this.subRegisterOfc_showError[index] || this.saleDeedVal_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Transfer_of_Property_House_Apartment' && !isFoundErrorIndex && (
        this.typeOfGains_showError[index] || this.desOfProperty_showError[index] || this.landArea_showError[index] || this.flatArea_showError[index] || this.tinOfBuyer_showError[index] || this.deedNo_showError[index] ||
        this.dateOfDeed_showError[index] || this.subRegisterOfc_showError[index] || this.saleDeedVal_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Signing_Money_from_Developer' && !isFoundErrorIndex && (this.typeOfGains_showError[index] || this.desOfProperty_showError[index] || this.totalArea_showError[index]
        || this.nameOfRealEstateDev_showError[index] || this.grossAmount_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Compensation_Against_Property_Acquisition' && !isFoundErrorIndex && (this.typeOfGains_showError[index] || this.desOfProperty_showError[index] || this.totalArea_showError[index]
        || this.acqAuthority_showError[index] || this.orderNo_showError[index] || this.date_showError[index] || this.grossAmount_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Transfer_of_Share_Securities_of_Listed_Company' && !isFoundErrorIndex && (this.typeOfGains_showError[index] || this.nameOfCompany_showError[index] || this.transferNo_showError[index]
        || this.dateOfTransfer_showError[index] || this.noOfShareTransfered_showError[index] || this.saleValueOfShare_showError[index] || this.costValueOfShare_showError[index] || this.tds_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Other_Capital_Gain' && !isFoundErrorIndex && (this.dateValidation_showError[index] || this.typeOfGains_showError[index] || this.desOfProperty_showError[index] || this.tinOfBuyer_showError[index] || this.invoiceNo_showError[index]
        || this.dateOfAcq_showError[index] || this.dateOfAli_showError[index] || this.saleMarketValue_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
      if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && !isFoundErrorIndex && (this.dateValidation_showError[index] || this.typeOfGains_showError[index] || this.desOfProperty_showError[index] || this.tinOfBuyer_showError[index] || this.invoiceNo_showError[index]
        || this.dateOfAcq_showError[index] || this.dateOfAli_showError[index] || this.saleMarketValue_showError[index] || this.sroNo_showError[index] || this.year_showError[index] || this.particularSRO_showError[index] || this.incomeExemptedTax_showError[index] || this.applicableTax_showError[index])) {
        errorIndex = index;
        isFoundErrorIndex = true;
      }
    })

    return errorIndex;
  }
  saveDraft() {
    this.draftSuccess = false;
    this.isSaveDraft = true;
    this.submittedData();
  }

  submittedData() {
    // let validateCapitalGain : any;
    // validateCapitalGain = this.capitalGainValidationService.capitalGainValidate(this.formArray);
    // if(!validateCapitalGain.validate)
    // {
    //   this.isVisibleForm = validateCapitalGain.indexNo;
    //   return;
    // }

    let validateCapitalGain: any;
    validateCapitalGain = this.validateCG();
    if (!validateCapitalGain.validate) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      this.isVisibleForm = validateCapitalGain.indexNo;
      return;
    }

    let requestData = [];
    let obj: any = {};
    //#region  save capital gain
    this.formArray.controls.forEach(element => {
      if (element.value.gainType == 'Transfer_of_Property_Land') {
        let dateOfDeed = element.value.dateofDeed ? moment(element.value.dateofDeed, 'DD-MM-YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Transfer of Property (Land Only)",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_TOTAL_AREA": element.value.totalArea ? element.value.totalArea : null,
            "ICG_UNIT_TOTALAREA": element.value.unitOfTotalArea ? element.value.unitOfTotalArea : '',
            "ICG_TIN_OF_BUYER": element.value.tinofBuyer ? element.value.tinofBuyer : '',
            "ICG_DEED_NO": element.value.deedNo ? element.value.deedNo : '',
            "ICG_DATE_OF_DEED": dateOfDeed ? this.datepipe.transform(dateOfDeed, 'dd-MM-yyyy') : '',
            "ICG_SUB_REGISTER_OFC": element.value.subRegisterOffice ? element.value.subRegisterOffice : '',
            "ICG_SALE_DEED_VALUE": element.value.saleDeedValue ? this.commaSeparator.removeComma(element.value.saleDeedValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Transfer of Property (Land Only)",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_TOTAL_AREA": element.value.totalArea ? this.commaSeparator.removeComma(element.value.totalArea, 0) : null,
            "ICG_UNIT_TOTALAREA": element.value.unitOfTotalArea ? element.value.unitOfTotalArea : '',
            "ICG_TIN_OF_BUYER": element.value.tinofBuyer ? element.value.tinofBuyer : '',
            "ICG_DEED_NO": element.value.deedNo ? element.value.deedNo : '',
            "ICG_DATE_OF_DEED": dateOfDeed ? this.datepipe.transform(dateOfDeed, 'dd-MM-yyyy') : '',
            "ICG_SUB_REGISTER_OFC": element.value.subRegisterOffice ? element.value.subRegisterOffice : '',
            "ICG_SALE_DEED_VALUE": element.value.saleDeedValue ? this.commaSeparator.removeComma(element.value.saleDeedValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
          }
        }
      }
      else if (element.value.gainType == 'Transfer_of_Property_House_Apartment') {
        let dateOfDeed = element.value.dateofDeed ? moment(element.value.dateofDeed, 'DD-MM-YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Transfer of Property (House/Apartment)",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_LAND_AREA": element.value.landArea ? element.value.landArea : null,
            "ICG_UNIT_LANDAREA": element.value.unitOfLandArea ? element.value.unitOfLandArea : '',
            "ICG_FLAT_BUILDING_AREA": element.value.flatArea ? element.value.flatArea : null,
            "ICG_UNIT_FLATAREA": element.value.unitOfFlatBuildingArea ? element.value.unitOfFlatBuildingArea : '',
            // "ICG_TOTAL_AREA": element.value.totalArea ? element.value.totalArea : null,
            "ICG_TIN_OF_BUYER": element.value.tinofBuyer ? element.value.tinofBuyer : '',
            "ICG_DEED_NO": element.value.deedNo ? element.value.deedNo : '',
            "ICG_DATE_OF_DEED": dateOfDeed ? this.datepipe.transform(dateOfDeed, 'dd-MM-yyyy') : '',
            "ICG_SUB_REGISTER_OFC": element.value.subRegisterOffice ? element.value.subRegisterOffice : '',
            "ICG_SALE_DEED_VALUE": element.value.saleDeedValue ? this.commaSeparator.removeComma(element.value.saleDeedValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Transfer of Property (House/Apartment)",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_LAND_AREA": element.value.landArea ? element.value.landArea : null,
            "ICG_UNIT_LANDAREA": element.value.unitOfLandArea ? element.value.unitOfLandArea : '',
            "ICG_FLAT_BUILDING_AREA": element.value.flatArea ? element.value.flatArea : null,
            "ICG_UNIT_FLATAREA": element.value.unitOfFlatBuildingArea ? element.value.unitOfFlatBuildingArea : '',
            // "ICG_TOTAL_AREA": element.value.totalArea ? element.value.totalArea : null,
            "ICG_TIN_OF_BUYER": element.value.tinofBuyer ? element.value.tinofBuyer : '',
            "ICG_DEED_NO": element.value.deedNo ? element.value.deedNo : '',
            "ICG_DATE_OF_DEED": dateOfDeed ? this.datepipe.transform(dateOfDeed, 'dd-MM-yyyy') : '',
            "ICG_SUB_REGISTER_OFC": element.value.subRegisterOffice ? element.value.subRegisterOffice : '',
            "ICG_SALE_DEED_VALUE": element.value.saleDeedValue ? this.commaSeparator.removeComma(element.value.saleDeedValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
          }
        }

      }
      else if (element.value.gainType == 'Signing_Money_from_Developer') {
        let dateOfAgreement = element.value.agreementDate ? moment(element.value.agreementDate, 'DD-MM-YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Signing money from the developer",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_TOTAL_AREA": element.value.totalArea ? this.commaSeparator.removeComma(element.value.totalArea, 0) : null,
            "ICG_UNIT_TOTALAREA": element.value.unitOfTotalArea ? element.value.unitOfTotalArea : '',
            "ICG_NAME_OF_REAL_ESTATE_DEV": element.value.nameofDeveloper ? element.value.nameofDeveloper : '',
            "ICG_AGREEMENT_NO": element.value.agreementNo ? element.value.agreementNo : '',
            "ICG_AGREEMENT_DATE": dateOfAgreement ? this.datepipe.transform(dateOfAgreement, 'dd-MM-yyyy') : '',
            "ICG_GROSS_AMOUNT": element.value.grossAmount ? this.commaSeparator.removeComma(element.value.grossAmount, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxApplicable ? this.commaSeparator.removeComma(element.value.taxApplicable, 0) : 0,
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Signing money from the developer",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_TOTAL_AREA": element.value.totalArea ? this.commaSeparator.removeComma(element.value.totalArea, 0) : null,
            "ICG_UNIT_TOTALAREA": element.value.unitOfTotalArea ? element.value.unitOfTotalArea : '',
            "ICG_NAME_OF_REAL_ESTATE_DEV": element.value.nameofDeveloper ? element.value.nameofDeveloper : '',
            "ICG_AGREEMENT_NO": element.value.agreementNo ? element.value.agreementNo : '',
            "ICG_AGREEMENT_DATE": dateOfAgreement ? this.datepipe.transform(dateOfAgreement, 'dd-MM-yyyy') : '',
            "ICG_GROSS_AMOUNT": element.value.grossAmount ? this.commaSeparator.removeComma(element.value.grossAmount, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxApplicable ? this.commaSeparator.removeComma(element.value.taxApplicable, 0) : 0,
          }
        }
      }
      else if (element.value.gainType == 'Compensation_Against_Property_Acquisition') {
        let orderDate = element.value.date ? moment(element.value.date, 'DD-MM-YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Compensation Against Property Acquisition",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_TOTAL_AREA": element.value.totalArea ? this.commaSeparator.removeComma(element.value.totalArea, 0) : null,
            "ICG_UNIT_TOTALAREA": element.value.unitOfTotalArea ? element.value.unitOfTotalArea : '',
            "ICG_ACQUISITION_AUTHORITY": element.value.acquisitionAuthority ? element.value.acquisitionAuthority : '',
            "ICG_ORDER_DATE": orderDate ? this.datepipe.transform(orderDate, 'dd-MM-yyyy') : '',
            "ICG_ORDER_NO": element.value.orderNo ? element.value.orderNo : '',
            "ICG_GROSS_AMOUNT": element.value.grossAmount ? this.commaSeparator.removeComma(element.value.grossAmount, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Compensation Against Property Acquisition",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_PROPERTY": element.value.descriptionofProperty ? element.value.descriptionofProperty : '',
            "ICG_TOTAL_AREA": element.value.totalArea ? this.commaSeparator.removeComma(element.value.totalArea, 0) : null,
            "ICG_UNIT_TOTALAREA": element.value.unitOfTotalArea ? element.value.unitOfTotalArea : '',
            "ICG_ACQUISITION_AUTHORITY": element.value.acquisitionAuthority ? element.value.acquisitionAuthority : '',
            "ICG_ORDER_DATE": orderDate ? this.datepipe.transform(orderDate, 'dd-MM-yyyy') : '',
            "ICG_ORDER_NO": element.value.orderNo ? element.value.orderNo : '',
            "ICG_GROSS_AMOUNT": element.value.grossAmount ? this.commaSeparator.removeComma(element.value.grossAmount, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
          }
        }
      }
      else if (element.value.gainType == 'Transfer_of_Share_Securities_of_Listed_Company') {
        let dateOfTransfer = element.value.dateofTransfer ? moment(element.value.dateofTransfer, 'DD-MM-YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Transfer of share of listed Co. (Director/Sponsor)",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_NAME_OF_COMPANY": element.value.nameOfCompany ? element.value.nameOfCompany : '',
            "ICG_TRANSFER_NO": element.value.transferNo ? element.value.transferNo : '',
            "ICG_BO_ACCOUNT": element.value.boAccount ? element.value.boAccount : '',
            "ICG_TIN_OR_NID": element.value.tinorNid ? element.value.tinorNid : '',
            "ICG_NUM_OF_SHARES": element.value.numberofShares ? element.value.numberofShares : null,
            "ICG_DATE_OF_TRANSFER": dateOfTransfer ? this.datepipe.transform(dateOfTransfer, 'dd-MM-yyyy') : '',
            "ICG_COST_VAL_OF_SHARE": element.value.costValueofShare ? this.commaSeparator.removeComma(element.value.costValueofShare, 0) : null,
            "ICG_SALE_VAL_OF_SHARE": element.value.saleValueofShare ? this.commaSeparator.removeComma(element.value.saleValueofShare, 0) : null,
            "ICG_RELATED_EXP": element.value.relatedExpenses ? this.commaSeparator.removeComma(element.value.relatedExpenses, 0) : 0,
            "ICG_REALIZED_GAIN": element.value.realizedGain ? this.commaSeparator.removeComma(element.value.realizedGain, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxApplicable ? this.commaSeparator.removeComma(element.value.taxApplicable, 0) : 0,
            "ICG_CHK_SHAREHOLDER_DIR": element.value.shareholderDirector == '1' ? "T" : "F",
            "ICG_CHK_SPONSORED_SHAREHOLDER": element.value.sponsoredShareholder == '1' ? "T" : "F",
            "ICG_CHK_HAD_TENP_SHARE_CAPITAL": element.value.shareofPaidUp == '1' ? "T" : "F",
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Transfer of share of listed Co. (Director/Sponsor)",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_NAME_OF_COMPANY": element.value.nameOfCompany ? element.value.nameOfCompany : '',
            "ICG_TRANSFER_NO": element.value.transferNo ? element.value.transferNo : '',
            "ICG_BO_ACCOUNT": element.value.boAccount ? element.value.boAccount : '',
            "ICG_TIN_OR_NID": element.value.tinorNid ? element.value.tinorNid : '',
            "ICG_NUM_OF_SHARES": element.value.numberofShares ? element.value.numberofShares : null,
            "ICG_DATE_OF_TRANSFER": dateOfTransfer ? this.datepipe.transform(dateOfTransfer, 'dd-MM-yyyy') : '',
            "ICG_COST_VAL_OF_SHARE": element.value.costValueofShare ? this.commaSeparator.removeComma(element.value.costValueofShare, 0) : null,
            "ICG_SALE_VAL_OF_SHARE": element.value.saleValueofShare ? this.commaSeparator.removeComma(element.value.saleValueofShare, 0) : null,
            "ICG_RELATED_EXP": element.value.relatedExpenses ? this.commaSeparator.removeComma(element.value.relatedExpenses, 0) : 0,
            "ICG_REALIZED_GAIN": element.value.realizedGain ? this.commaSeparator.removeComma(element.value.realizedGain, 0) : 0,
            "ICG_TAX_APPLICABLE": element.value.taxDeductatSource ? this.commaSeparator.removeComma(element.value.taxDeductatSource, 0) : 0,
            "ICG_TAX_DED_OR_COL_AT_SRC": element.value.taxApplicable ? this.commaSeparator.removeComma(element.value.taxApplicable, 0) : 0,
            "ICG_CHK_SHAREHOLDER_DIR": element.value.shareholderDirector == '1' ? "T" : "F",
            "ICG_CHK_SPONSORED_SHAREHOLDER": element.value.sponsoredShareholder == '1' ? "T" : "F",
            "ICG_CHK_HAD_TENP_SHARE_CAPITAL": element.value.shareofPaidUp == '1' ? "T" : "F",
          }
        }
      }
      else if (element.value.gainType == 'Other_Capital_Gain') {
        let alienationDate = element.value.dateofAlienation ? moment(element.value.dateofAlienation, 'DD-MM-YYYY') : '';
        let acquisitionDate = element.value.dateofAcquisition ? moment(element.value.dateofAcquisition, 'DD-MM-YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Other Capital Gain",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_ASSET": element.value.descriptionofAsset ? element.value.descriptionofAsset : '',
            "ICG_NAME_OF_BUYER": element.value.nameofBuyer ? element.value.nameofBuyer : '',
            "ICG_TIN_OR_NID": element.value.tinorNid ? element.value.tinorNid : '',
            "ICG_INVOICE_NO": element.value.invoiceNo ? element.value.invoiceNo : '',
            "ICG_DATE_OF_ACQUISITION": acquisitionDate ? this.datepipe.transform(acquisitionDate, 'dd-MM-yyyy') : '',
            "ICG_DATE_OF_ALIENATION": alienationDate ? this.datepipe.transform(alienationDate, 'dd-MM-yyyy') : '',
            "ICG_SALES_VAL_MARKET_VAL": element.value.salesValue ? this.commaSeparator.removeComma(element.value.salesValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_TRANSFER_RELATED_EXP": element.value.transferRelatedExpenses ? this.commaSeparator.removeComma(element.value.transferRelatedExpenses, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Other Capital Gain",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_ASSET": element.value.descriptionofAsset ? element.value.descriptionofAsset : '',
            "ICG_NAME_OF_BUYER": element.value.nameofBuyer ? element.value.nameofBuyer : '',
            "ICG_TIN_OR_NID": element.value.tinorNid ? element.value.tinorNid : '',
            "ICG_INVOICE_NO": element.value.invoiceNo ? element.value.invoiceNo : '',
            "ICG_DATE_OF_ACQUISITION": acquisitionDate ? this.datepipe.transform(acquisitionDate, 'dd-MM-yyyy') : '',
            "ICG_DATE_OF_ALIENATION": alienationDate ? this.datepipe.transform(alienationDate, 'dd-MM-yyyy') : '',
            "ICG_SALES_VAL_MARKET_VAL": element.value.salesValue ? this.commaSeparator.removeComma(element.value.salesValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_TRANSFER_RELATED_EXP": element.value.transferRelatedExpenses ? this.commaSeparator.removeComma(element.value.transferRelatedExpenses, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
          }
        }

      }
      else if (element.value.gainType == 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO') {
        let alienationDate = element.value.dateofAlienation ? moment(element.value.dateofAlienation, 'DD-MM-YYYY') : '';
        let acquisitionDate = element.value.dateofAcquisition ? moment(element.value.dateofAcquisition, 'DD-MM-YYYY') : '';
        let sroYr = element.value.year ? moment(element.value.year, 'YYYY') : '';
        if (element.value.summaryId > 0) {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Gain Subject to Reduced Tax Rate",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_ASSET": element.value.descriptionofAsset ? element.value.descriptionofAsset : '',
            "ICG_NAME_OF_BUYER": element.value.nameofBuyer ? element.value.nameofBuyer : '',
            "ICG_TIN_OR_NID": element.value.tinorNid ? element.value.tinorNid : '',
            "ICG_INVOICE_NO": element.value.invoiceNo ? element.value.invoiceNo : '',
            "ICG_DATE_OF_ACQUISITION": acquisitionDate ? this.datepipe.transform(acquisitionDate, 'dd-MM-yyyy') : '',
            "ICG_DATE_OF_ALIENATION": alienationDate ? this.datepipe.transform(alienationDate, 'dd-MM-yyyy') : '',
            "ICG_SALES_VAL_MARKET_VAL": element.value.salesValue ? this.commaSeparator.removeComma(element.value.salesValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_TRANSFER_RELATED_EXP": element.value.transferRelatedExpenses ? this.commaSeparator.removeComma(element.value.transferRelatedExpenses, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "ICG_SRO_NO": element.value.sroNo ? element.value.sroNo : '',
            "ICG_SRO_YEAR": sroYr ? this.datepipe.transform(sroYr, 'yyyy') : '',
            "ICG_PARTICULAR_OF_SRO": element.value.particularofSro ? element.value.particularofSro : '',
            "ICG_INCOME_EXEMPTED_FROM_TAX": element.value.incomeExemptedfromTax ? this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0) : 0,
            "ICG_APP_TAX_AS_SRO": element.value.applicableTaxasperSro ? this.commaSeparator.removeComma(element.value.applicableTaxasperSro, 0) : null,
            "ICG_TAXABLE_INCOME": element.value.taxableIncome ? this.commaSeparator.removeComma(element.value.taxableIncome, 0) : null,
            "summaryId": element.value.summaryId
          }
        }
        else {
          obj = {
            "tinNo": this.userTin,
            "tinNid": null,
            "assessmentYear": "2021-2022",
            "incomeStartDate": null,
            "incomeEndDate": null,
            "ICG_TYPE_OF_GAIN_NAME": "Gain Subject to Reduced Tax Rate",
            "ICG_TYPE_OF_GAINS": element.value.gainType,
            "ICG_DES_OF_ASSET": element.value.descriptionofAsset ? element.value.descriptionofAsset : '',
            "ICG_NAME_OF_BUYER": element.value.nameofBuyer ? element.value.nameofBuyer : '',
            "ICG_TIN_OR_NID": element.value.tinorNid ? element.value.tinorNid : '',
            "ICG_INVOICE_NO": element.value.invoiceNo ? element.value.invoiceNo : '',
            "ICG_DATE_OF_ACQUISITION": acquisitionDate ? this.datepipe.transform(acquisitionDate, 'dd-MM-yyyy') : '',
            "ICG_DATE_OF_ALIENATION": alienationDate ? this.datepipe.transform(alienationDate, 'dd-MM-yyyy') : '',
            "ICG_SALES_VAL_MARKET_VAL": element.value.salesValue ? this.commaSeparator.removeComma(element.value.salesValue, 0) : null,
            "ICG_COST_OF_ACQUISITION": element.value.costofAcquisition ? this.commaSeparator.removeComma(element.value.costofAcquisition, 0) : 0,
            "ICG_TRANSFER_RELATED_EXP": element.value.transferRelatedExpenses ? this.commaSeparator.removeComma(element.value.transferRelatedExpenses, 0) : 0,
            "ICG_CAPITAL_GAIN": element.value.capitalGain ? this.commaSeparator.removeComma(element.value.capitalGain, 0) : 0,
            "ICG_SRO_NO": element.value.sroNo ? element.value.sroNo : '',
            "ICG_SRO_YEAR": sroYr ? this.datepipe.transform(sroYr, 'yyyy') : '',
            "ICG_PARTICULAR_OF_SRO": element.value.particularofSro ? element.value.particularofSro : '',
            "ICG_INCOME_EXEMPTED_FROM_TAX": element.value.incomeExemptedfromTax ? this.commaSeparator.removeComma(element.value.incomeExemptedfromTax, 0) : 0,
            "ICG_APP_TAX_AS_SRO": element.value.applicableTaxasperSro ? this.commaSeparator.removeComma(element.value.applicableTaxasperSro, 0) : null,
            "ICG_TAXABLE_INCOME": element.value.taxableIncome ? this.commaSeparator.removeComma(element.value.taxableIncome, 0) : null,
          }
        }

      }
      requestData.push(obj);
    });

    if (this.isValidationSuccess)
      this.apiService.post(this.serviceUrl + 'api/save_capital_gain', requestData)
        .subscribe(result => {
          this.draftSuccess = true;
          if (result != null && !this.isSaveDraft) {
            this.toastr.success("Data Saved Successfully!", '', {
              timeOut: 1000,
            });
            this.headsOfIncome.forEach((Value, i) => {
              if (Value['link'] == '/user-panel/capital-gain') {
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
    //#endregion
  }

  formattingDate(inputDate: string): Date {
    let _day: any, _month: any, _year: any, formatDate: any;
    _day = inputDate.substring(0, 2);
    _month = inputDate.substring(3, 5);
    _year = inputDate.substring(6, 12);
    formatDate = _month + '/' + _day + '/' + _year;
    return new Date(formatDate);
  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/capital-gain') {
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
      //      console.log(error['error'].errorMessage);
          });
    });
  }

}
