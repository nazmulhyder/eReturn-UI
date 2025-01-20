import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";
import { BasicInformationDTO } from "../../model/dto/basic-information-dto";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { HeadsOfIncomeService } from "../heads-of-income.service";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TemplateRef } from "@angular/core";
import { CommaSeparatorService } from "../../service/comma-separator.service";

@Component({
  selector: "app-additional-information",
  templateUrl: "./additional-information.component.html",
  styleUrls: ["./additional-information.component.css"],
})
export class AdditionalInformationComponent implements OnInit {
  html = `<span>No Tooltip Found!</span>`;
  locationTooltip = `<span class="btn-block well-sm ";">Registered address of your business, or your living or work place, or the location of your tax jurisdiction during the income year.</span>`;
  war_wonded_GazettedFF = `<span class="btn-block well-sm ";">Select if you are a War-wounded Gazetted Freedom Fighter and wish to enjoy special tax benefit available for this class of persons. You may need to provide necessary information in support of your claim.</span>`;
  WWGFF_gazetted_No = `<span class="btn-block well-sm ";">The serial number of the Gazette in which your name is listed as a war-wounded freedom fighter.</span>`;
  personWithDisability = `<span class="btn-block well-sm ";">Select if you are a person with disability and wish to enjoy special tax benefit available for this class of persons. You may need to provide necessary information in support of your claim.</span>`;
  PWD_RefNo = `<span class="btn-block well-sm ";">The issue number of the certificate issued by appropriate authority.</span>`;
  PWD_Date = `<span class="btn-block well-sm ";">The date mentioned in the aforesaid certificate.</span>`;
  claimBenefit_PWD = `<span class="btn-block well-sm ";">Select if you are a parent/legal guardian of any person with disability who is dependent on you, and wish to enjoy special tax benefit available for this class of persons. Only one taxpayer (either parent, or legal guardian) can claim tax benefit for each dependent person with disability.</span>`;
  CB_PWD_ChildName = `<span class="btn-block well-sm ";">Provide name of the dependent child for whom the tax benefit is claimed. </span>`;
  CB_PWD_DisabilityRef = `<span class="btn-block well-sm ";">The issue number of the certificate issued by appropriate authority.</span>`;
  CB_PWD_Date = `<span class="btn-block well-sm ";">The date mentioned in the aforesaid certificate.</span>`;
  CTR_Investment = `<span class="btn-block well-sm ";">Select “Yes” if you made any rebatable investment in the income year, and want to claim tax rebate for such investment. Otherwise, select “No”.  If your total income exceeds tax exemption threshold, you have to pay a minimum tax despite tax rebate.</span>`;
  incomeExceed4Lakhs = `<span class="btn-block well-sm ";">Select “Yes” if your total income was more than 4 lakh taka. Otherwise, select “No”.</span>`;
  shareholderDirector = `<span class="btn-block well-sm ";">Select “Yes” if you are a shareholder director of a company. Otherwise, select “No”.</span>`;
  grossWealthOver40Lakhs = `<span class="btn-block well-sm ";">Select “Yes” if your gross wealth (aggregate amount of cost value of assets) on the last day of income year was more than 40 lakh taka. Otherwise, select “No”.</span>`;
  ownedMotorCar = `<span class="btn-block well-sm ";">Select “Yes” if you were the owner of a motor car during the income year. Otherwise, select “No”.</span>`;
  housePropertyAnyCC = `<span class="btn-block well-sm ";">Select “Yes” if you were the owner of a house property in a city corporation or made an advance or an investment for the purchase of any apartment or other house property in a city corporation. Otherwise, select “No”.</span>`;
  areaOfHPAnyCC = `<span class="btn-block well-sm ";">Provide the area of house property you have in any of the city corporation areas. In case more than house property, provide aggregate area of all such house properties.</span>`;
  it10b_mandatory = `<span class="btn-block well-sm ";">Select “Yes” if IT10B is not mandatory for you but you still want to submit it for future convenience. (Submission of IT10B is often a good idea. You may need the statement of your Asset, Liability and Expense for various purposes).</span>`;
  amountGrossWealth = `<span class="btn-block well-sm ";">Enter the amount of gross wealth as on the last day of income year. Gross wealth is generally the aggregate of the cost value of assets, face value of investments, advance made for an asset and positive balances of all your accounts (including BO accounts and mobile financial services accounts).</span>`;

  formGroup: FormGroup;
  requestData: any;
  requestGetData: any;
  storeResponseData = [];
  userTin: any;
  addiInformationGetApiData: any;
  isChkWarWondedFF: boolean = false;
  isChkPersonWithDisablity: boolean = false;
  isChkGuardianPersonWithDisability: boolean = false;
  isIT1OBChecked: boolean = true;
  isGrossWealthOver40Lakh: boolean = true;
  isExceedFortyLakh: boolean = false
  isOwnMotorCar: boolean = false;
  isHaveHouseProperty: boolean = false;
  isInvestmentforTaxRebate: boolean;
  isSaveDraft: boolean = false;
  headsOfIncome = [];
  checkIsLoggedIn: any;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  isDisableRebate: boolean = false;
  isDisableIncomeExc4Lks: boolean = false;
  isHouseInCC: boolean = false;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  isDisableSecondCld: boolean = false;
  disableChildCount = 1;
  incomeYearFrom: any;
  incomeYearTo: any;
  minDateLen: any;
  maxDateLen: any;
  hasAnyIncome: Boolean = false;
  selectedIncomeHeadData = [];
  haveTaxExemptedIncHead: boolean = false;
  newHead: any;
  isShow: boolean = true;

  dhakaNorthCity : string;
  dhakaSouthCity : string;
  chattogramCity  : string;
  otherCity : string;
  anyOther : string;
  
  grossWealth : string;
  constructor(
    private fb: FormBuilder,
    private headService: HeadsOfIncomeService,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private router: Router,
    private mainNavbarListService: mainNavbarListService,
    private datepipe: DatePipe,
    private rReturnSpinner: NgxUiLoaderService,
    private modalService: BsModalService,
    private commaSeparator: CommaSeparatorService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;

  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    // this.hasAnyIncome = (localStorage.getItem('assessAnyIncome') === '1')? true : false;
    //get api data 1
    this.rReturnSpinner.start();
    this.getCurrentBasicConfigInfo();
    this.getAssessmentAdditionalInfoData();
    this.loadAll_incomeHeads_on_Page_reload();
    this.checkSubmissionStatus();
    this.rReturnSpinner.stop();


  }

  getCurrentBasicConfigInfo()
  {
    
    this.apiService.get(this.serviceUrl + 'api/getBasicConfigData')
      .subscribe(result => {
        
        var incomeSrcLocFromRedis = result.INCOME_SOURCE_LOCATION.split("|", 5);
        this.dhakaNorthCity = incomeSrcLocFromRedis[0];
        this.dhakaSouthCity = incomeSrcLocFromRedis[1];
        this.chattogramCity = incomeSrcLocFromRedis[2];
        this.otherCity = incomeSrcLocFromRedis[3];
        this.anyOther = incomeSrcLocFromRedis[4];

        this.grossWealth = result.GROSS_WEALTH;
      });
  }

  resetAdditionalInfoData() {
    // debugger;
    if (!this.hasAnyIncome) {
      this.additionalInformationForm.patchValue(
        {
          returnSchemeType: "0",
          gazetteNo: "",

          referenceNo: "",
          referenceDate: "",

          firstDisableChildName: "",
          firstChildDisabilityReference: "",
          firstChildDisabilityDate: "",

          secondDisableChildName: "",
          secondChildDisabilityReference: "",
          secondChildDisabilityDate: ""
        });
    }
    else {

    }
  }

  getAssessmentAdditionalInfoData() {
    this.requestGetData =
    {
      "tinNo": this.userTin
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-assessment-additional-info')
      .subscribe(result => {
        this.addiInformationGetApiData = result;
        //console.log('additional-info', this.addiInformationGetApiData);
        if (this.addiInformationGetApiData != null) {
          this.incomeYearFrom = this.addiInformationGetApiData.startOfIncomeYr;
          this.minDateLen = new Date(this.incomeYearFrom.substring(6, 12), parseInt(this.incomeYearFrom.substring(3, 5)) - 1, this.incomeYearFrom.substring(0, 2));
          this.incomeYearTo = this.addiInformationGetApiData.endOfIncomeYr;
          this.maxDateLen = new Date(this.incomeYearTo.substring(6, 12), parseInt(this.incomeYearTo.substring(3, 5)) - 1, this.incomeYearTo.substring(0, 2));

          //debugger;
          this.additionalInformationForm.controls.returnSchemeType.setValue(this.addiInformationGetApiData.incomeLocation);
          localStorage.removeItem('hasAnyIncome');
          localStorage.setItem('hasAnyIncome', this.addiInformationGetApiData.anyIncome);
          // this.hasAnyIncome = this.addiInformationGetApiData.anyIncome;
          if (!this.addiInformationGetApiData.anyIncome) {
            this.isDisableRebate = true;
            this.isDisableIncomeExc4Lks = true;
            this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue('0');
            // this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue('0');
          }

          if (this.addiInformationGetApiData.anyIncome) {
            this.hasAnyIncome = true;
            this.isDisableRebate = false;
            this.isDisableIncomeExc4Lks = false;
            this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue(this.addiInformationGetApiData.anyTaxRebate == true ? '1' : '0');
            // this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue(this.addiInformationGetApiData.incomeExceedFourLakhs == true ? '1' : '0');
          }

          if (this.addiInformationGetApiData.gazetteNo !== "") {
            this.additionalInformationForm.controls.isWarWoundedGazettedFreedomFighter.setValue(true);
            this.isChkWarWondedFF = true;
            this.additionalInformationForm.controls.gazetteNo.setValue(this.addiInformationGetApiData.gazetteNo);
          }
          if (this.addiInformationGetApiData.personDisabilityReference != "") {
            this.additionalInformationForm.controls.isPersonWithDisability.setValue(true);
            this.isChkPersonWithDisablity = true;
            this.additionalInformationForm.controls.referenceNo.setValue(this.addiInformationGetApiData.personDisabilityReference);
            this.additionalInformationForm.controls.referenceDate.setValue(this.addiInformationGetApiData.personDisabilityDate);
          }
          if (this.addiInformationGetApiData.firstDisableChildName != "") {
            this.additionalInformationForm.controls.isClaimBenefitAsAParent.setValue(true);
            this.isChkGuardianPersonWithDisability = true;

            //child -1
            this.additionalInformationForm.controls.firstDisableChildName.setValue(this.addiInformationGetApiData.firstDisableChildName);
            this.additionalInformationForm.controls.firstChildDisabilityReference.setValue(this.addiInformationGetApiData.firstChildDisabilityReference);
            this.additionalInformationForm.controls.firstChildDisabilityDate.setValue(this.addiInformationGetApiData.firstChildDisabilityDate);

            //child -2
            if (this.addiInformationGetApiData.secondDisableChildName != "") {
              this.isDisableSecondCld = true;
            }

            this.additionalInformationForm.controls.secondDisableChildName.setValue(this.addiInformationGetApiData.secondDisableChildName);
            this.additionalInformationForm.controls.secondChildDisabilityReference.setValue(this.addiInformationGetApiData.secondChildDisabilityReference);
            this.additionalInformationForm.controls.secondChildDisabilityDate.setValue(this.addiInformationGetApiData.secondChildDisabilityDate);

          }

          //debugger;
          this.additionalInformationForm.controls.haveTaxExemptedInc.setValue(this.addiInformationGetApiData.taxExemptedIncomeStatus == true ? '1' : '0');
          this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue(this.addiInformationGetApiData.shareholder == true ? '1' : '0');
          this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue(this.addiInformationGetApiData.grossWealthOverFortyLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isOwnmotorCar.setValue(this.addiInformationGetApiData.ownMotorCar == true ? '1' : '0');
          this.additionalInformationForm.controls.isHaveHouseProperty.setValue(this.addiInformationGetApiData.houseProperty == true ? '1' : '0');

          if (this.addiInformationGetApiData.grossWealthOverFortyLakhs) {
            this.isGrossWealthOver40Lakh = true;
          }
          else {
            this.isGrossWealthOver40Lakh = false;
          }
          if (this.addiInformationGetApiData.ownMotorCar) {
            this.isOwnMotorCar = true;
          }
          else {
            this.isOwnMotorCar = false;
          }
          if (this.addiInformationGetApiData.houseProperty) {
            this.isHaveHouseProperty = true;
            this.isHouseInCC = true;
            this.additionalInformationForm.controls.areaOfCityCorporation.setValue(this.commaSeparator.currencySeparatorBD(this.addiInformationGetApiData.housePropertyArea));

          }
          else {
            this.isHaveHouseProperty = false;
          }
          this.additionalInformationForm.controls.isIT10BNotMandatory.setValue(this.addiInformationGetApiData.mandatoryITTenB == true ? '1' : '0');
          if (this.addiInformationGetApiData.mandatoryITTenB) {
            this.isIT1OBChecked = true;
          }
          else {
            this.isIT1OBChecked = false;
          }
          this.additionalInformationForm.controls.amountOfGrossWealth.setValue(this.commaSeparator.currencySeparatorBD(this.addiInformationGetApiData.grossWealth));
        }

      },
       error => {
        //  console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }

  loadAll_incomeHeads_on_Page_reload() {
    let allIncomeHeadsData: any;
    let getOnlyIncomeHeads = [];
    this.formGroup = this.fb.group({
      anyIncome: new FormControl('1'),
      residentStatus: new FormControl('1'),
      countryResidence: new FormControl(0),
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
        // console.log('all income heads on additional info', allIncomeHeadsData);
        allIncomeHeadsData.forEach(element => {
          getOnlyIncomeHeads.push(element.incomeSourceType);

          //#region get selectedIncomeHeadData with proper formatting same as save-selected-income-head
          let obj = {
            "tinNo": element.tinNo,
            "assessmentYear": element.assessmentYear,
            "incomeSourceName": element.incomeSourceType['incomeSourceName']
          }
          this.selectedIncomeHeadData.push(obj);
          //#endregion
        });

        //console.log('selectedIncomeHeadData', this.selectedIncomeHeadData);

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
        });
      },
      error => {
        //  console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }
  additionalInformationForm = new FormGroup({
    returnSchemeType: new FormControl('0'),
    isWarWoundedGazettedFreedomFighter: new FormControl(false),
    gazetteNo: new FormControl(""),
    isPersonWithDisability: new FormControl(false),
    referenceNo: new FormControl(""),
    referenceDate: new FormControl(""),
    isClaimBenefitAsAParent: new FormControl(false),

    firstDisableChildName: new FormControl(""),
    firstChildDisabilityReference: new FormControl(""),
    firstChildDisabilityDate: new FormControl(""),
    secondDisableChildName: new FormControl(""),
    secondChildDisabilityReference: new FormControl(""),
    secondChildDisabilityDate: new FormControl(""),

    haveTaxExemptedInc: new FormControl('0'),
    isInvestmentforTaxRebate: new FormControl("0"),
    // isIncomeExceeding4Lakhs: new FormControl("1"),
    isShareholderDirectorofCompany: new FormControl("0"),
    isGrossWealthOver4Lakhs: new FormControl("1"),
    isOwnmotorCar: new FormControl("0"),
    isHaveHouseProperty: new FormControl("0"),
    isIT10BNotMandatory: new FormControl("1"),
    amountOfGrossWealth: new FormControl(""),
    areaOfCityCorporation: new FormControl()
  });

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

  initializeGrossWealth(event, i) {
    this.additionalInformationForm.patchValue({
      amountOfGrossWealth: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }
  initializeAreaOfHP(event, i) {
    this.additionalInformationForm.patchValue({
      areaOfCityCorporation: this.commaSeparator.currencySeparatorBD(this.commaSeparator.removeComma(event.target.value, 0))
    });
  }


  enableSecondChild() {
    if (this.isDisableSecondCld) {
      this.toastr.warning('Max Disabled child you have entered!');
      return;
    }
    this.isDisableSecondCld = true;
  }

  disableSecondChild() {
    this.isDisableSecondCld = false;
    this.additionalInformationForm.controls.secondDisableChildName.setValue('');
    this.additionalInformationForm.controls.secondChildDisabilityReference.setValue('');
    this.additionalInformationForm.controls.secondChildDisabilityDate.setValue('');
  }

  onCheckboxLeft1(event: any) {
    if (event.target.checked) {
      this.isChkWarWondedFF = true;
    } else {
      this.isChkWarWondedFF = false;
      this.additionalInformationForm.controls.gazetteNo.setValue('');
    }
  }
  onCheckboxLeft2(event: any) {
    if (event.target.checked) {
      this.isChkPersonWithDisablity = true;
    } else {
      this.isChkPersonWithDisablity = false;
      this.additionalInformationForm.controls.referenceNo.setValue('');
      this.additionalInformationForm.controls.referenceDate.setValue('');
    }
  }
  onCheckboxLeft3(event: any) {
    if (event.target.checked) {
      this.isChkGuardianPersonWithDisability = true;
      this.isDisableSecondCld = false
    } else {
      this.isDisableSecondCld = false
      this.isChkGuardianPersonWithDisability = false;
      this.additionalInformationForm.controls.firstDisableChildName.setValue('');
      this.additionalInformationForm.controls.firstChildDisabilityReference.setValue('');
      this.additionalInformationForm.controls.firstChildDisabilityDate.setValue('');
      this.additionalInformationForm.controls.secondDisableChildName.setValue('');
      this.additionalInformationForm.controls.secondChildDisabilityReference.setValue('');
      this.additionalInformationForm.controls.secondChildDisabilityDate.setValue('');

    }
  }

  onRadioChangeIT10B1(event: any) {
    if (event.target.checked) {
      this.isIT1OBChecked = true;
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
    }
  }
  onRadioChangeIT10B2(event: any, removeAssetLiabilities_IT10B) {
    if (event.target.checked) {
      this.isIT1OBChecked = false;
      this.isExceedFortyLakh = false;
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
      if (this.isExistsAssetsAndLiabilities()) {
        this.changeAssetAndLiabilities(removeAssetLiabilities_IT10B);
      }
    }
  }

  grossWealthOver40LakhTrue(event: any) {
    if (event.target.checked) {
      this.isGrossWealthOver40Lakh = true;
      this.isIT1OBChecked = true;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");

    } else {
      this.isGrossWealthOver40Lakh = false;
    }
  }
  GrossWealthOver40LakhFalse(event: any, removeAssetLiabilities_GW_40Lkhs) {
    if (event.target.checked) {
      this.isGrossWealthOver40Lakh = false;
      this.isIT1OBChecked = true;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");

      if (this.isExistsAssetsAndLiabilities()) {
        this.changeAssetAndLiabilities(removeAssetLiabilities_GW_40Lkhs);
      }

    } else {
      this.isGrossWealthOver40Lakh = true;
    }
  }

  onInvestmentforTaxRebateChange(event: any) {
    if (event.target.checked) {
      this.isInvestmentforTaxRebate = true;
    } else {
      this.isInvestmentforTaxRebate = false;
    }
  }

  noRebate(event: any, removeRebate) {
    this.changeRebate(removeRebate);
  }

  ownMotorCarTrue(event: any) {

    if (event.target.checked) {
      this.isOwnMotorCar = true;
      this.isIT1OBChecked = true;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
    } else {
      this.isOwnMotorCar = false;
    }
  }
  ownMotorCarFalse(event: any, removeAssetLiabilities_Own_motor_car) {

    if (event.target.checked) {
      this.isOwnMotorCar = false;
      this.isIT1OBChecked = true;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
      if (this.isExistsAssetsAndLiabilities()) {
        this.changeAssetAndLiabilities(removeAssetLiabilities_Own_motor_car);
      }

    } else {
      this.isOwnMotorCar = true;
    }
  }

  haveHousePropertyTrue(event: any) {
    if (event.target.checked) {
      this.isHaveHouseProperty = true;
      this.isIT1OBChecked = true;
      this.isHouseInCC = true;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
    } else {
      this.isHaveHouseProperty = false;
    }
  }
  haveHousePropertyFalse(event: any, removeAssetLiabilities_HP) {
    if (event.target.checked) {
      this.isHaveHouseProperty = false;
      this.isIT1OBChecked = true;
      this.isHouseInCC = false;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
      this.additionalInformationForm.controls.areaOfCityCorporation.setValue('');
      if (this.isExistsAssetsAndLiabilities()) {
        this.changeAssetAndLiabilities(removeAssetLiabilities_HP);
      }

    } else {
      this.isHaveHouseProperty = true;
    }
  }


  // incomeExceed_four_lakhs_yes(event: any) {
  //   if (event.target.checked) {
  //     this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue('1');
  //   }
  // }

  // incomeExceed_four_lakhs_no(event: any, removeExpenditure_1) {
  //   // debugger;
  //   if (event.target.checked) {
  //     if (this.additionalInformationForm.value.isShareholderDirectorofCompany === '0') {
  //       this.changeExpenditure_1(removeExpenditure_1);
  //     }
  //   }
  // }

  shareholder_director_of_company_yes(event: any) {
    if (event.target.checked) {
      this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue('1');
    }
  }
  shareholder_director_of_company_no(event: any) {
    if (event.target.checked) {
      this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue('0');
      // if (this.additionalInformationForm.value.isIncomeExceeding4Lakhs === '0') {
      //   this.changeExpenditure_2(removeExpenditure_2);
      // }
    }
  }



  //#region Delete All Expenditure

  changeExpenditure_1(removeExpenditure_1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeExpenditure_1, this.config);
  }

  changeExpenditure_2(removeExpenditure_2: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeExpenditure_2, this.config);
  }

  unchange_Expenditure(check1: any, check2: any) {
    this.modalRef.hide();
    if (check1 === '1') {
      this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue('1');
    }
    if (check2 === '1') {
      this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue('1');
    }
  }

  removeExpenditure(ie4lakhs: any, shreholderDirector: any) {
    if (this.additionalInformationForm.value.isIncomeExceeding4Lakhs === '0' && this.additionalInformationForm.value.isShareholderDirectorofCompany === '0') {
      this.modalRef.hide();
      let dlt_all_expenditure = {
        "assessmentYear": "2021-2022",
        "tinNo": this.userTin
      }
      this.apiService.post(this.serviceUrl + 'api/delete_expendsummary', "")
        .subscribe(result => {
          //console.log(result);
          if (result.success) {
            this.toastr.success('Successfully Deleted!', '', {
              timeOut: 1000,
            });
            return;
          }
        },
          error => {
            //console.log(error['error'].errorMessage);
            this.unchange_Expenditure(ie4lakhs, shreholderDirector);
            this.toastr.warning('Failed to remove expenditure!', '', {
              timeOut: 3000,
            });
          });
    }
  }

  //#endregion

  //#region  Delete all Asset and Liabilities

  unchange_AssetAndLiabilities(grossWealth: any, ownMotorCar: any, hpAnyCC: any, it10b: any) {
    this.modalRef.hide();
    if (grossWealth === '1') {
      this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue('1');
      this.isGrossWealthOver40Lakh = true;
    }
    else if (ownMotorCar === '1') {
      this.additionalInformationForm.controls.isOwnmotorCar.setValue('1');
      this.isOwnMotorCar = true;
    }
    else if (hpAnyCC === '1') {
      this.additionalInformationForm.controls.isHaveHouseProperty.setValue('1');
      this.isHaveHouseProperty = true;

    }
    else if (it10b === '1') {
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue('1');
      this.isIT1OBChecked = true;
    }
  }

  isExistsAssetsAndLiabilities(): boolean {
    let removeAssetAndLiabilities: boolean = false;
    if (this.additionalInformationForm.value.isGrossWealthOver4Lakhs === '0'
      && this.additionalInformationForm.value.isOwnmotorCar === '0'
      && this.additionalInformationForm.value.isHaveHouseProperty === '0'
      && this.additionalInformationForm.value.isIT10BNotMandatory === '0'
    ) {
      return true;
    }
    else {
      return false;
    }

  }

  changeAssetAndLiabilities(removeAssetAndLiabilities: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeAssetAndLiabilities, this.config);
  }

  removeAssetAndLiabilities(grossWealth: any, ownMotorCar: any, hpAnyCC: any, it10b: any) {
    if (this.isExistsAssetsAndLiabilities()) {
      this.modalRef.hide();
      let dlt_all_asset_liabilities_json = {
        "assessmentYear": "2021-2022",
        "tinNo": this.userTin
      }
      this.apiService.post(this.serviceUrl + 'api/user-panel/delete_all', "")
        .subscribe(result => {
          if (result.success) {
            this.toastr.success('Successfully Deleted!', '', {
              timeOut: 1000,
            });
            return;
          }
        },
          error => {
            //console.log(error['error'].errorMessage);
            this.unchange_AssetAndLiabilities(grossWealth, ownMotorCar, hpAnyCC, it10b);
            this.toastr.warning('Failed to Remove Assets and Liabilities!', '', {
              timeOut: 3000,
            });
          });
    }
  }

  //#endregion

  mainNavbar = [];

  areaOfHouseProperty() {
    let areaOfHouseProperty = this.additionalInformationForm.value.areaOfCityCorporation;
    if (this.isHaveHouseProperty && this.isHouseInCC && (parseFloat(areaOfHouseProperty) <= 0 || areaOfHouseProperty == '' || areaOfHouseProperty == null)) {
      this.toastr.warning('Area of House Property Can Not 0 or Empty!', '', {
        timeOut: 1000,
      });
      return false;
    }
    return true;
  }

  grossWealthValidation() {
    // debugger;
    let tmpGrossWealth = this.commaSeparator.removeComma(this.additionalInformationForm.value.amountOfGrossWealth, 0);
    //console.log('test', tmpGrossWealth);
    if (!this.isGrossWealthOver40Lakh && !this.isOwnMotorCar && !this.isHaveHouseProperty && !this.isIT1OBChecked && (parseFloat(tmpGrossWealth) > 4000000 || tmpGrossWealth == '' || tmpGrossWealth == null || isNaN(parseInt(tmpGrossWealth)))) {
      this.toastr.warning('Gross Wealth will be in between or Equal 0 and 40,00,000!');
      return false;
    }
    return true;
  }

  chkedWarWondedFFValided() {
    if (this.isChkWarWondedFF && this.additionalInformationForm.value.gazetteNo === "") {
      this.toastr.warning('Gazette No is Required!', '', {
        timeOut: 3000,
      });
      return false;
    }
    else
      return true;
  }

  chkedPersonWithDisabilityValided() {
    if (this.isChkPersonWithDisablity && (this.additionalInformationForm.value.referenceNo === "" || this.additionalInformationForm.value.referenceDate === "")) {
      this.toastr.warning('Person with Disability Reference and Date is Required!', '', {
        timeOut: 3000,
      });
      return false;
    }
    else
      return true;
  }

  chkedGuardianPersonWithDisabilityValided() {
    if (this.isChkGuardianPersonWithDisability && (this.additionalInformationForm.value.firstDisableChildName === "" || this.additionalInformationForm.value.firstChildDisabilityReference === "" || this.additionalInformationForm.value.firstChildDisabilityDate === "")) {
      this.toastr.warning('Guardian of a Person with Disability Name, Reference and Date is Required!', '', {
        timeOut: 3000,
      });
      return false;
    }
    else
      return true;
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.onNextPage();
  }


  onNextPage() {
    //debugger;
    this.resetAdditionalInfoData();
    if (this.additionalInformationForm.value.returnSchemeType === '0' && this.hasAnyIncome) {
      this.toastr.warning('Please, Select Location of Main Source of Income.', '', {
        timeOut: 3000,
      });
      return;
    }
    else {
      if (!this.chkedWarWondedFFValided()) { return; }
      if (!this.chkedPersonWithDisabilityValided()) { return; }
      if (!this.chkedGuardianPersonWithDisabilityValided()) { return; }

      if (!this.areaOfHouseProperty()) { return; }
      if (!this.grossWealthValidation()) { return; }
      this.mainNavbarListService.addSelectedMainNavbar(this.additionalInformationForm.value);
      this.mainNavbar = this.mainNavbarListService.getMainNavbarList();
      this.headsOfIncome = this.headService.getHeads();
      let personWithDisabilityDate = this.additionalInformationForm.value.referenceDate ? moment(this.additionalInformationForm.value.referenceDate, 'DD-MM-YYYY') : '';
      let firstChildDisabilityDate = this.additionalInformationForm.value.firstChildDisabilityDate ? moment(this.additionalInformationForm.value.firstChildDisabilityDate, 'DD-MM-YYYY') : '';
      let secondChildDisabilityDate = this.additionalInformationForm.value.secondChildDisabilityDate ? moment(this.additionalInformationForm.value.secondChildDisabilityDate, 'DD-MM-YYYY') : '';

      this.requestData =
      {
        "returnScheme": this.addiInformationGetApiData.returnScheme,
        "tinNo": this.addiInformationGetApiData.tinNo,
        "assessmentYear": this.addiInformationGetApiData.assessmentYear,
        "startOfIncomeYr": this.addiInformationGetApiData.startOfIncomeYr,
        "endOfIncomeYr": this.addiInformationGetApiData.endOfIncomeYr,
        "anyIncome": this.addiInformationGetApiData.anyIncome,
        "residentStatus": this.addiInformationGetApiData.residentStatus,
        "countryResidence": this.addiInformationGetApiData.countryResidence,
        "incomeLocation": this.additionalInformationForm.value.returnSchemeType,
        "gazetteNo": this.additionalInformationForm.value.gazetteNo,
        "personDisabilityReference": this.additionalInformationForm.value.referenceNo,
        "personDisabilityDate": personWithDisabilityDate ? this.datepipe.transform(personWithDisabilityDate, 'dd-MM-yyyy') : '',
        //child -1
        "firstDisableChildName": this.additionalInformationForm.value.firstDisableChildName,
        "firstChildDisabilityReference": this.additionalInformationForm.value.firstChildDisabilityReference,
        "firstChildDisabilityDate": firstChildDisabilityDate ? this.datepipe.transform(firstChildDisabilityDate, 'dd-MM-yyyy') : '',
        //child -2
        "secondDisableChildName": this.additionalInformationForm.value.secondDisableChildName,
        "secondChildDisabilityReference": this.additionalInformationForm.value.secondChildDisabilityReference,
        "secondChildDisabilityDate": secondChildDisabilityDate ? this.datepipe.transform(secondChildDisabilityDate, 'dd-MM-yyyy') : '',

        "taxExemptedIncomeStatus": (this.additionalInformationForm.value.haveTaxExemptedInc == 1) ? true : false,
        "anyTaxRebate": (this.additionalInformationForm.value.isInvestmentforTaxRebate == 1) ? true : false,
        // "incomeExceedFourLakhs": (this.additionalInformationForm.value.isIncomeExceeding4Lakhs == 1) ? true : false,
        "shareholder": (this.additionalInformationForm.value.isShareholderDirectorofCompany == 1) ? true : false,
        "grossWealthOverFortyLakhs": (this.additionalInformationForm.value.isGrossWealthOver4Lakhs == 1) ? true : false,
        "ownMotorCar": (this.additionalInformationForm.value.isOwnmotorCar == 1) ? true : false,
        "houseProperty": (this.additionalInformationForm.value.isHaveHouseProperty == 1) ? true : false,
        "housePropertyArea": this.additionalInformationForm.value.areaOfCityCorporation ? this.commaSeparator.removeComma(this.additionalInformationForm.value.areaOfCityCorporation, 0) : 0,
        "mandatoryITTenB": (this.additionalInformationForm.value.isIT10BNotMandatory == 1) ? true : false,
        "grossWealth": this.additionalInformationForm.value.amountOfGrossWealth ? this.commaSeparator.removeComma(this.additionalInformationForm.value.amountOfGrossWealth, 0) : 0

      };

      //console.log(this.requestData);
      this.apiService.post(this.serviceUrl + 'api/user-panel/save-assessment-additional-info', this.requestData)
        .subscribe(result => {
          //console.log('additional Data', result);
          if (result != null && !this.isSaveDraft) {
            this.toastr.success('Saved Successfully.', '', {
              timeOut: 1000,
            });
            this.router.navigate([this.mainNavbar[1]["link"]]);
          }
          if (result != null && this.isSaveDraft) {
            this.toastr.success('Item Saved as a Draft!', '', {
              timeOut: 1000,
            });
            this.isSaveDraft = false;
          }
          // this.isSaveDraft = false;
        },
          error => {
            //console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
  }

  //addRemoveTaxExemptedIncomeHead
  onChange_Have_Tax_Exempted_Income(event: any) {

    if (event.target.value === '1') {
      this.selectedIncomeHeadData.forEach((element, i) => {
        if (element.incomeSourceName === 'Tax Exempted Income') {
          this.haveTaxExemptedIncHead = true;
        }
        else {
          this.haveTaxExemptedIncHead = false;
        }
      });

      if (!this.haveTaxExemptedIncHead) {
        this.newHead = {
          "tinNo": this.addiInformationGetApiData.tinNo,
          "assessmentYear": this.addiInformationGetApiData.assessmentYear,
          "incomeSourceName": 'Tax Exempted Income',
        }
        this.selectedIncomeHeadData.push(this.newHead);
        //console.log('UpdatedSelectedIncomeHeadData=', this.selectedIncomeHeadData);
      }
    }

    else {
      this.selectedIncomeHeadData.forEach((element, index) => {
        if (element.incomeSourceName === 'Tax Exempted Income') {
          this.selectedIncomeHeadData.splice(index, 1);
          //console.log('UpdatedSelectedIncomeHeadData=', this.selectedIncomeHeadData);
        }
      });
    }

    this.apiService.post(this.serviceUrl + 'api/user-panel/save-selected-income-heads', this.selectedIncomeHeadData)
    .subscribe(result => {
    },
      error => {
        //console.log(error['error'].errorMessage);
      });

  }

  onBackPage() {
    this.router.navigate(["/user-panel/assessment"]);
  }

  //#region remove Rebate
  changeRebate(removeRebate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeRebate, this.config);
  }
  unchangeRebate() {
    this.modalRef.hide();
    this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue('1');
  }
  remove_All_Rebate() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/rebate')
      .subscribe(result => {
        // console.log(result);
        if (result === 'S') {
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue('0');
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue('1');
          this.toastr.warning('Failed to remove rebate!', '', {
            timeOut: 3000,
          });
          return;

        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue('1');
          this.toastr.warning('Failed to remove rebate!', '', {
            timeOut: 3000,
          });
        });
  }
  //#endregion


  checkForGrossWealth(event: any, exceedFortyLakh) {
    if (Number(this.commaSeparator.removeComma(event.target.value, 0)) > 4000000) {
      this.changeAssetAndLiabilities(exceedFortyLakh);
    }
  }

  changeGrossWealthAboveForty(status: any) {
    if (status == "1") {
      this.isGrossWealthOver40Lakh = true;
      this.isIT1OBChecked = true;
      this.isExceedFortyLakh = true;
      this.additionalInformationForm.controls.isIT10BNotMandatory.setValue("1");
      this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue("1");
      this.additionalInformationForm.controls.amountOfGrossWealth.setValue("");
      this.modalRef.hide();
    } else {
      this.modalRef.hide();
      this.isExceedFortyLakh = false;
    }
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
            this.toastr.error(error['error'].errorMessage,'', {
              timeOut: 3000,
            });
          });
    });
  }

}
