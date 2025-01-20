import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";
import { HeadsOfIncomeService } from "../heads-of-income.service";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TemplateRef } from "@angular/core";


@Component({
  selector: "app-assessment",
  templateUrl: "assessment.component.html",
  styleUrls: ["assessment.component.css"],
})
export class AssessmentComponent {

  requestData: any;
  requestGetData: any;
  storeResponseData = [];
  userTin: any;
  assessmentApiData: any;
  basicInformationGetApi1: any;
  checkIsLoggedIn: any;
  minDate: any;
  maxDate: any;
  assessmentYears = [];
  selectedFirmEtcItems = [];
  isSaveDraft: boolean = false;

  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;

  returnSchemeTooltip = `<span class="btn-block well-sm";">Online filing is open for Self Assessment Return.</span>`;

  assessmentYearTooltip = `<span class="btn-block well-sm";">You are submitting return for 2021-2022 Assessment Year.</span>`;

  salaryTooltip = `<span class="btn-block well-sm";">Select this head if you had income as an employee.</span>`;

  interestOnSecurityTooltip = `<span class="btn-block well-sm">Select this head if you received any interest or profit on savings certificate, debentures or other securities.</span>`;

  housePropertyTooltip = `<span class="btn-block well-sm">Select this head if you had income from the rental of your house property (residential or commercial).</span>`;

  agricultureTooltip = `<span class="btn-block well-sm">Select this head if you had income from agriculture or from the leasing of your agricultural land.</span>`;

  businessOrProfessionTooltip = `<span class="btn-block well-sm">Select this head if you had income from any sole proprietorship business or any profession.</span>`;

  capitalgainTooltip = `<span class="btn-block well-sm">Select this head if you had income from the transfer of capital assets (for example, property sale or share transfer).</span>`;

  incomeFromOtherSourcesTooltip = `<span class="btn-block well-sm">Select this head if you had income from interest or profit on financial assets other than securities (for example, bank interest), dividend, royalties, fees for technical service, or if your income does not fall into any of the specified six heads of income.</span>`;

  anyTaxableIncome = `<span class="btn-block well-sm">Select YES if you have any income in the income year. Otherwise, select NO.</span>`;

  taxExmpIncome = `<span class="btn-block well-sm">Select YES if you have any income in the income year which is fully exempted from tax and is not include in total income. Otherwise, select NO.</span>`;

  firmTooltip = `<span class="btn-block well-sm">
  Select if you had any share of income from a Partnership Firm.
  </span>`;

  aopTooltip = `<span class="btn-block well-sm">
  Select if you had any share of income from an Association of Person.
  </span>`;

  incomeOutsideTooltip = `<span class="btn-block well-sm">
  Select if you had any taxable income from any source outside Bangladesh.
  </span>`;

  spouseOrMinorChildTooltip = `<span class="btn-block well-sm">
  Select if your spouse or minor child has income but not hold separate TIN or tax file.
  </span>`;

  claimBenefirTooltip = `<span class="btn-block well-sm">
  Only one of the parents can claim this benefit. For each child with a disability, the tax-free threshold will be Tk 50,000 higher.
  </span>`;

  formGroup: FormGroup;
  headsOfIncome = [];
  isAnyIncomeInAssessmentYr = true;
  isStatusOfResident = true;

  isSalarychecked: boolean = false;
  isSecuritychecked: boolean = false;
  isHousePropertychecked: boolean = false;
  isAgriculturechecked: boolean = false;
  isBusinessProfessionchecked: boolean = false;
  isCapitalchecked: boolean = false;
  isOtherschecked: boolean = false;
  isFirmchecked: boolean = false;
  isAopchecked: boolean = false;
  isOutsideIncomechecked: boolean = false;
  isSpouseChildchecked: boolean = false;
  lengthOfIncomeHeads: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  isRebateDataExists: boolean = false;

  selectedIncomeHeadData = [];
  haveTaxExemptedIncHead: boolean = false;
  newHead: any;
  isIncomeYearValidate: boolean = false;
  isShow: boolean = true;

  currentAssessmentYrFromRedis : any;
  currentIncomeYearFromRedis : any;
  currentIncomeYearToFromRedis : any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private headService: HeadsOfIncomeService,
    private router: Router,
    private datepipe: DatePipe,
    private rReturnSpinner: NgxUiLoaderService,
    private modalService: BsModalService,
  ) {

    this.apiService = apiService;
    this.apiUrl = apiUrl;
    this.formGroup = fb.group({
      returnScheme: new FormControl('Universal Self'),
      assessmentYear: new FormControl(),
      anyIncome: new FormControl('1'),
      residentStatus: new FormControl('1'),
      countryResidence: new FormControl('0'),
      haveTaxExemptedInc: new FormControl('0'),
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
      fromIncomeYear: new FormControl(),
      toIncomeYear: new FormControl(),
    });
    this.assessmentYears = [
      {
        id: 1,
        value: '2021-2022'
      }
    ]
  }

  ngOnInit(): void {
    this.rReturnSpinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    // this.minDate = new Date(2020, 6, 1);
    // this.maxDate = new Date(2021, 5, 30);
   

    this.initializeForm();

    this.getCurrentBasicConfigInfo();

    //get api data 1
    this.getAssessmentAdditionalInfoData();

    //get api data 2
    this.getSelectedIncomeHeads();

    // this.chkRebateDataExists();
    this.checkSubmissionStatus();
    this.rReturnSpinner.stop();

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
              // this.toastr.error('You already prepared your offline (paper) return.', '', {
              //   timeOut: 3000,
              // });

              //newly added
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
            //console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });
  }

  getSelectedIncomeHeads() {
    this.requestGetData =
    {
      "tinNo": this.userTin
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-selected-income-heads')
      .subscribe(result => {
        this.assessmentApiData = result;
        this.assessmentApiData.forEach(element => {
          this.storeResponseData.push(element.incomeSourceType);
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


        if (this.storeResponseData.length > 0) {
          this.storeResponseData.forEach(element => {
            if (element.incomeSourceTypeId == 1) {
              if (element.active) {
                this.formGroup.controls.salaries.setValue(true);
                this.isSalarychecked = true;
              }
            }
            if (element.incomeSourceTypeId == 2) {
              if (element.active) {
                this.formGroup.controls.security.setValue(true);
                this.isSecuritychecked = true;
              }
            }
            if (element.incomeSourceTypeId == 3) {
              if (element.active) {
                this.formGroup.controls.houseProperty.setValue(true);
                this.isHousePropertychecked = true;
              }
            }
            if (element.incomeSourceTypeId == 4) {
              if (element.active) {
                this.formGroup.controls.agriculture.setValue(true);
                this.isAgriculturechecked = true;
              }
            }
            if (element.incomeSourceTypeId == 5) {
              if (element.active) {
                this.formGroup.controls.businessProfession.setValue(true);
                this.isBusinessProfessionchecked = true;
              }
            }
            if (element.incomeSourceTypeId == 6) {
              if (element.active) {
                this.formGroup.controls.capital.setValue(true);
                this.isCapitalchecked = true;
              }
            }
            if (element.incomeSourceTypeId == 7) {
              if (element.active) {
                this.formGroup.controls.others.setValue(true);
                this.isOtherschecked = true;
              }
            }
            if (element.incomeSourceTypeId == 8) {
              if (element.active) {
                this.formGroup.controls.firm.setValue(true);
                this.isFirmchecked = true;
              }
            }
            if (element.incomeSourceTypeId == 9) {
              if (element.active) {
                this.formGroup.controls.aop.setValue(true);
                this.isAopchecked = true;
              }
            }
            if (element.incomeSourceTypeId == 10) {
              if (element.active) {
                this.formGroup.controls.outsideIncome.setValue(true);
                this.isOutsideIncomechecked = true;
              }
            }
            if (element.incomeSourceTypeId == 11) {
              if (element.active) {
                this.formGroup.controls.spouseChild.setValue(true);
                this.isSpouseChildchecked = true;
              }
            }
            if (element.incomeSourceTypeId == 12) {
              if (element.active) {
                this.formGroup.controls.taxExemptedIncome.setValue(true);
              }
            }
          });

        }
        else {
          // this.initializeForm();
        }

      },

        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 2000,
          });
        });
  }

  chkRebateDataExists() {
    let getRebateData: any;
    this.apiService.get(this.serviceUrl + 'api/user-panel/rebate')
      .subscribe(result => {
        getRebateData = result;
        if (getRebateData.RB_CAT_LIFE_INS_PREM || getRebateData.RB_CAT_DPS || getRebateData.RB_CAT_APPR_SAVINGS_CERT
          || getRebateData.RB_CAT_GPF || getRebateData.RB_CAT_BENEVOLENT_FUND_GRP_INS_PREM || getRebateData.RB_CAT_RPF
          || getRebateData.RB_CAT_APPR_STOCKS_OR_SHARES || getRebateData.RB_CAT_OTHERS_INVESTMENT_U_6_B || getRebateData.RB_CAT_OTHERS_SRO
        ) {
          this.isRebateDataExists = true;
        }
        else {
          this.isRebateDataExists = false;
        }
      })
  }

  getAssessmentAdditionalInfoData() {
    this.requestGetData =
    {
      "tinNo": this.userTin
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-assessment-additional-info')
      .subscribe(result => {
        this.basicInformationGetApi1 = result;
        //console.log('any income', this.basicInformationGetApi1);
        //debugger;
        if (this.basicInformationGetApi1.returnScheme != null) {
          this.formGroup.controls.returnScheme.setValue(this.basicInformationGetApi1.returnScheme);
          this.formGroup.controls.assessmentYear.setValue(this.basicInformationGetApi1.assessmentYear);
          this.formGroup.controls.fromIncomeYear.setValue(this.basicInformationGetApi1.startOfIncomeYr);
          this.formGroup.controls.toIncomeYear.setValue(this.basicInformationGetApi1.endOfIncomeYr);
          if (this.basicInformationGetApi1.anyIncome) {
            this.formGroup.controls.anyIncome.setValue('1');
            this.isAnyIncomeInAssessmentYr = true;
          }
          if (!this.basicInformationGetApi1.anyIncome) {
            this.formGroup.controls.anyIncome.setValue('0');
            this.isAnyIncomeInAssessmentYr = false;
          }
          if (this.basicInformationGetApi1.residentStatus == 'Resident') {
            this.formGroup.controls.residentStatus.setValue('1');
            this.isStatusOfResident = true;
            this.NotResident = false;
          }
          if (this.basicInformationGetApi1.residentStatus == 'Non Resident') {
            this.formGroup.controls.residentStatus.setValue('0');
            this.isStatusOfResident = false;
            this.NotResident = true;
          }
          this.formGroup.controls.haveTaxExemptedInc.setValue(this.basicInformationGetApi1.taxExemptedIncomeStatus == true ? '1' : '0');
          this.formGroup.controls.taxExemptedIncome.setValue(this.basicInformationGetApi1.taxExemptedIncomeStatus == true ? true : false);
          this.formGroup.controls.countryResidence.setValue(this.basicInformationGetApi1.countryResidence);
        }
      },
      error => {
        //  console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage,);
        });
  }

  initializeForm() {

    this.formGroup = this.fb.group({
      returnScheme: new FormControl('Universal Self'),
      assessmentYear: new FormControl(),
      anyIncome: new FormControl('1'),
      residentStatus: new FormControl('1'),
      countryResidence: new FormControl(0),
      haveTaxExemptedInc: new FormControl('0'),
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
      fromIncomeYear: new FormControl(),
      toIncomeYear: new FormControl(),
    });
  }

  onRadioChangeIncomeNotByMentionedYr(event: any, anyIncomeNo) {
    // console.log(event.target.checked);
    if (this.basicInformationGetApi1 != null) {
      // this.basicInformationGetApi1.incomeLocation = '0';
      // this.basicInformationGetApi1.gazetteNo = '';
      // this.basicInformationGetApi1.personDisabilityReference = "";

      // this.basicInformationGetApi1.personDisabilityDate = "";
      // this.basicInformationGetApi1.firstDisableChildName = "";
      // this.basicInformationGetApi1.firstChildDisabilityReference = "";
      // this.basicInformationGetApi1.firstChildDisabilityDate = "";

      // this.basicInformationGetApi1.secondDisableChildName = "";
      // this.basicInformationGetApi1.secondChildDisabilityReference = "";
      // this.basicInformationGetApi1.secondChildDisabilityDate = "";
    }
    this.changeAnyIncome(anyIncomeNo);
  }

  onRadioChangeIncomeYesByMentionedYr(event: any) {
    // console.log(event.target.checked);
    if (event.target.checked) {
      this.isAnyIncomeInAssessmentYr = true;
      this.formGroup.controls.anyIncome.setValue('1');
    } else {
      this.isAnyIncomeInAssessmentYr = false;
      this.formGroup.controls.anyIncome.setValue('0');
    }
  }

  isResidencePerson(event: any) {
    //
    // console.log(event.target.checked);
    if (event.target.checked) {
      this.isStatusOfResident = true;
      this.formGroup.controls.residentStatus.setValue('1');
      this.formGroup.controls.outsideIncome.setValue(false);
      this.NotResident = false;
    } else {
      this.isStatusOfResident = false;
      this.formGroup.controls.residentStatus.setValue('0');
      this.formGroup.controls.outsideIncome.setValue(false);
      this.NotResident = true;
    }
  }
  NotResident: any;
  isNotResidencePerson(event: any) {
    //
    // console.log(event.target.checked);
    if (event.target.checked) {
      this.isStatusOfResident = false;
      this.formGroup.controls.residentStatus.setValue('0');
      this.formGroup.controls.outsideIncome.setValue(false);
      this.NotResident = true;
    } else {
      this.isStatusOfResident = true;
      this.formGroup.controls.residentStatus.setValue('1');
      this.formGroup.controls.outsideIncome.setValue(false);
      this.NotResident = false;
    }
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.onNextPage();
    // this.toastr.success('item saved as a draft!', '', {
    //   timeOut: 1000,
    // });
    // return;
  }

  onNextPage() {
    //debugger;
    //set the assessment year
    localStorage.setItem('taxpayer_assess_year', this.formGroup.value.assessmentYear);
    //set the income year
    //debugger;

    let incomeFromYear = this.formGroup.value.fromIncomeYear ? moment(this.formGroup.value.fromIncomeYear, 'DD-MM-YYYY') : null;
    let incomeFromYearLocal = incomeFromYear ? this.datepipe.transform(incomeFromYear, 'dd-MM-yyyy') : null;
    let incomeToYear = this.formGroup.value.toIncomeYear ? moment(this.formGroup.value.toIncomeYear, 'DD-MM-YYYY') : null;
    let incomeToYearYearLocal = incomeToYear ? this.datepipe.transform(incomeToYear, 'dd-MM-yyyy') : null;
    localStorage.setItem('income_year_start', incomeFromYearLocal);
    localStorage.setItem('income_year_end', incomeToYearYearLocal);

    this.isIncomeYearValidate = (incomeFromYearLocal == null || incomeToYearYearLocal == null) ? false : this.dateValidation(incomeFromYearLocal, incomeToYearYearLocal);

    if (!this.isIncomeYearValidate) {
      this.toastr.warning('Last date of income year’ cannot be an earlier date of ‘first date of the income year');
      return;
    }

    let haveIncomeHeadData: boolean = false;
    if (this.formGroup.value.haveTaxExemptedInc === '1') {
      this.formGroup.get('taxExemptedIncome').setValue(true);
    }

    this.headService.addSelectedItems(this.formGroup.controls);
    this.headsOfIncome = this.headService.getHeads();
    // console.log('totalHead', this.headsOfIncome);

    this.headsOfIncome.forEach(element => {
      if (element.name === 'Salaries' || element.name === 'Interest on Securities' || element.name === 'House Property'
        || element.name === 'Agriculture' || element.name === 'Business or Profession' || element.name === 'Capital Gain'
        || element.name === 'Income from Other Sources' || element.name === 'Firm Etc.') {
        haveIncomeHeadData = true;
      }
    });

    this.lengthOfIncomeHeads = this.headsOfIncome.length;
    localStorage.setItem('assessAnyIncome', this.formGroup.value.anyIncome);

    // if (this.isAnyIncomeInAssessmentYr === true && this.lengthOfIncomeHeads === 0)
    if (this.isAnyIncomeInAssessmentYr === true && haveIncomeHeadData == false) {
      this.toastr.warning('Please, Select Heads of Income.', '', {
        timeOut: 3000,
      });
    }
    else {

      // save assessment left data
      let incomeFrom = moment(this.formGroup.value.fromIncomeYear, 'DD-MM-YYYY');
      let incomeTo = moment(this.formGroup.value.toIncomeYear, 'DD-MM-YYYY');
      if (this.basicInformationGetApi1.returnScheme != null) {
        this.requestData =
        {
          "returnScheme": this.formGroup.value.returnScheme,
          "tinNo": this.userTin,
          "assessmentYear": this.formGroup.value.assessmentYear,
          // this.datepipe.transform(this.formGroup.value.fromIncomeYear, 'dd-MM-yyyy')
          "startOfIncomeYr": incomeFrom ? this.datepipe.transform(incomeFrom, 'dd-MM-yyyy') : '01-07-2020',
          "endOfIncomeYr": incomeTo ? this.datepipe.transform(incomeTo, 'dd-MM-yyyy') : '30-06-2021',
          "anyIncome": (this.formGroup.value.anyIncome == 1 ? true : false),
          "residentStatus": (this.formGroup.value.residentStatus == 1 ? 'Resident' : 'Non Resident'),
          "countryResidence": (this.formGroup.value.residentStatus == 1 ? this.basicInformationGetApi1.countryResidence : this.formGroup.value.countryResidence),
          "incomeLocation": (this.basicInformationGetApi1.incomeLocation ? this.basicInformationGetApi1.incomeLocation : '0'),
          "gazetteNo": this.basicInformationGetApi1.gazetteNo ? this.basicInformationGetApi1.gazetteNo : '',
          "personDisabilityReference": this.basicInformationGetApi1.personDisabilityReference ? this.basicInformationGetApi1.personDisabilityReference : '',
          "personDisabilityDate": this.basicInformationGetApi1.personDisabilityDate,

          //child -1
          "firstDisableChildName": this.basicInformationGetApi1.firstDisableChildName,
          "firstChildDisabilityReference": this.basicInformationGetApi1.firstChildDisabilityReference,
          "firstChildDisabilityDate": this.basicInformationGetApi1.firstChildDisabilityDate,
          //child -2
          "secondDisableChildName": this.basicInformationGetApi1.secondDisableChildName,
          "secondChildDisabilityReference": this.basicInformationGetApi1.secondChildDisabilityReference,
          "secondChildDisabilityDate": this.basicInformationGetApi1.secondChildDisabilityDate,

          // "taxExemptedIncomeStatus": this.basicInformationGetApi1.taxExemptedIncomeStatus,
          "taxExemptedIncomeStatus": (this.formGroup.value.haveTaxExemptedInc == 1 ? true : false),

          "anyTaxRebate": (this.basicInformationGetApi1.anyTaxRebate == 1) ? true : false,
          // "incomeExceedFourLakhs": (this.basicInformationGetApi1.incomeExceedFourLakhs == 1) ? true : false,
          "shareholder": (this.basicInformationGetApi1.shareholder == 1) ? true : false,
          "grossWealthOverFortyLakhs": (this.basicInformationGetApi1.grossWealthOverFortyLakhs == 1) ? true : false,
          "ownMotorCar": (this.basicInformationGetApi1.ownMotorCar == 1) ? true : false,
          "houseProperty": (this.basicInformationGetApi1.houseProperty == 1) ? true : false,
          "mandatoryITTenB": (this.basicInformationGetApi1.mandatoryITTenB == 1) ? true : false,
          "housePropertyArea": this.basicInformationGetApi1.housePropertyArea,
          "grossWealth": this.basicInformationGetApi1.grossWealth
        };

      }
      else {
        this.requestData =
        {
          "returnScheme": this.formGroup.value.returnScheme,
          "tinNo": this.userTin,
          "assessmentYear": this.formGroup.value.assessmentYear,
          "startOfIncomeYr": incomeFrom ? this.datepipe.transform(incomeFrom, 'dd-MM-yyyy') : '01-07-2020',
          "endOfIncomeYr": incomeTo ? this.datepipe.transform(incomeTo, 'dd-MM-yyyy') : '30-06-2021',
          "anyIncome": (this.formGroup.value.anyIncome == 1 ? true : false),
          "residentStatus": (this.formGroup.value.residentStatus == 1 ? 'Resident' : 'Non Resident'),
          "countryResidence": (this.formGroup.value.residentStatus == 1 ? 0 : this.formGroup.value.countryResidence),
          "incomeLocation": '0',
          "gazetteNo": '',
          "personDisabilityReference": '',
          "personDisabilityDate": '',
          //child -1
          "firstDisableChildName": '',
          "firstChildDisabilityReference": '',
          "firstChildDisabilityDate": '',
          //child -2
          "secondDisableChildName": '',
          "secondChildDisabilityReference": '',
          "secondChildDisabilityDate": '',

          "taxExemptedIncomeStatus": true,
          "anyTaxRebate": true,
          // "incomeExceedFourLakhs": true,
          "shareholder": false,
          "grossWealthOverFortyLakhs": true,
          "ownMotorCar": false,
          "houseProperty": false,
          "mandatoryITTenB": true,
          "housePropertyArea": 0,
          "grossWealth": ''
        };
      }

      this.apiService.post(this.serviceUrl + 'api/user-panel/save-assessment-additional-info', this.requestData)
        .subscribe(result => {
        },
          error => {
            //console.log(error['error'].errorMessage);
          });
      // // save assessment right data
      this.requestData = [];
      let obj: any;
      this.headService.selectedItems.forEach(element => {
        if (element.name != 'Firm Etc.') {
          obj =
          {
            "incomeSourceName": element.name,
            "tinNo": this.userTin,
            "assessmentYear": this.formGroup.value.assessmentYear
          }
          this.requestData.push(obj);
        }
      });
      this.headService.selectedFirmItems.forEach(element => {
        obj =
        {
          "incomeSourceName": element.name,
          "tinNo": this.userTin,
          "assessmentYear": this.formGroup.value.assessmentYear
        }
        this.requestData.push(obj);
      });
      if (this.requestData.length <= 0) {
        obj =
        {
          "incomeSourceName": "",
          "tinNo": this.userTin,
          "assessmentYear": this.formGroup.value.assessmentYear
        }
        this.requestData.push(obj);
      }
      //console.log('request data:', this.requestData);
      this.apiService.post(this.serviceUrl + 'api/user-panel/save-selected-income-heads', this.requestData)
        .subscribe(result => {

          if (result != null && !this.isSaveDraft) {
            this.toastr.success('Saved Successfully.', '', {
              timeOut: 1000,
            });
            this.router.navigate(["/user-panel/additional-information"]);
          }
          if (result != null && this.isSaveDraft) {
            this.toastr.success('Item Saved as a Draft!', '', {
              timeOut: 1000,
            });
            this.isSaveDraft = false;
          }

        },
          error => {
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });

    }
  }

  onSalaryChange(event: any, removeSalary) {
    if (event.target.checked) {
      this.formGroup.controls.salaries.setValue(true);
      this.isSalarychecked = true;
    }
    else {
      // this.isSalarychecked = false;
      this.changeSalary(removeSalary);
    }
  }

  onSecurityChange(event: any, removeIOS) {
    if (event.target.checked) {
      this.formGroup.controls.security.setValue(true);
      this.isSecuritychecked = true;
    }
    else {
      // this.isSecuritychecked = false;
      this.changeIOS(removeIOS);
    }
  }

  onHousePropertyChange(event: any, removeHP) {
    if (event.target.checked) {
      this.formGroup.controls.houseProperty.setValue(true);
      this.isHousePropertychecked = true;
    }
    else {
      // this.isHousePropertychecked = false;
      this.changeHP(removeHP);
    }
  }

  onAgricultureChange(event: any, removeAgriculture) {
    if (event.target.checked) {
      this.formGroup.controls.agriculture.setValue(true);
      this.isAgriculturechecked = true;
    }
    else {
      // this.isAgriculturechecked = false;
      this.changeAgriculture(removeAgriculture);
    }
  }

  onBusinessProfessionChange(event: any, removeBusiness) {
    if (event.target.checked) {
      this.formGroup.controls.businessProfession.setValue(true);
      this.isBusinessProfessionchecked = true;
    }
    else {
      // this.isBusinessProfessionchecked = false;
      this.changeBusiness(removeBusiness);
    }
  }

  onCapitalChange(event: any, removeCapitalGain) {
    if (event.target.checked) {
      this.formGroup.controls.capital.setValue(true);
      this.isCapitalchecked = true;
    }
    else {
      // this.isCapitalchecked = false;
      this.changeCG(removeCapitalGain);
    }
  }

  onOthersChange(event: any, removeIFOS) {
    if (event.target.checked) {
      this.formGroup.controls.others.setValue(true);
      this.isOtherschecked = true;
    }
    else {
      // this.isOtherschecked = false;
      this.changeIFOS(removeIFOS);
    }
  }

  onFirmChange(event: any, removeFirm) {
    if (event.target.checked) {
      this.formGroup.controls.firm.setValue(true);
      this.isFirmchecked = true;
    }
    else {
      // this.isFirmchecked = false;
      this.changeFirm(removeFirm);
    }
  }

  onAopChange(event: any, removeAoP) {
    if (event.target.checked) {
      this.formGroup.controls.aop.setValue(true);
      this.isAopchecked = true;
    }
    else {
      // this.isAopchecked = false;
      this.changeAoP(removeAoP);
    }
  }

  onOutsideIncomeChange(event: any, removeFI) {
    if (event.target.checked) {
      this.formGroup.controls.outsideIncome.setValue(true);
      this.isOutsideIncomechecked = true;
    }
    else {
      // this.isOutsideIncomechecked = false;
      this.changeFI(removeFI);
    }
  }

  onSpouseChildChange(event: any, removeSI) {
    if (event.target.checked) {
      this.formGroup.controls.spouseChild.setValue(true);
      this.isSpouseChildchecked = true;
    }
    else {
      // this.isSpouseChildchecked = false;
      this.changeSI(removeSI);
    }
  }

  //#region select any income => no
  changeAnyIncome(anyIncomeNo: TemplateRef<any>) {
    this.modalRef = this.modalService.show(anyIncomeNo, this.config);
  }

  unchangeAnyIncome() {
    this.modalRef.hide();
    this.formGroup.controls.anyIncome.setValue('1');
  }

  no_Income_selected() {
    let haveIncomeHeadData: boolean = false;
    this.headService.addSelectedItems(this.formGroup.controls);
    this.headsOfIncome = this.headService.getHeads();
    this.lengthOfIncomeHeads = this.headsOfIncome.length;
    // console.log('Income head=', this.headsOfIncome);
    // console.log('total head', this.lengthOfIncomeHeads);

    this.headsOfIncome.forEach(element => {
      if (element.name === 'Salaries' || element.name === 'Interest on Securities' || element.name === 'House Property'
        || element.name === 'Agriculture' || element.name === 'Business or Profession' || element.name === 'Capital Gain'
        || element.name === 'Income from Other Sources' || element.name === 'Firm Etc.') {
        haveIncomeHeadData = true;
        // console.log('haveIncomeHeadData', haveIncomeHeadData);
      }
    });

    // if (this.lengthOfIncomeHeads > 0)
    if (haveIncomeHeadData) {
      this.toastr.warning('You have Income Data Already. Please Remove them  First!', '', {
        timeOut: 3000,
      });
      this.modalRef.hide();
      this.formGroup.controls.anyIncome.setValue('1');
      return;
    }
    // if(this.isRebateDataExists)
    // {
    //   this.toastr.warning('Your have rebate data. Please delete them first!');
    //   this.modalRef.hide();
    //   this.formGroup.controls.anyIncome.setValue('1');
    //   return;
    // }
    else if (haveIncomeHeadData == false) {
      this.modalRef.hide();
      this.formGroup.controls.anyIncome.setValue('0');
      this.isOtherschecked = false
      this.formGroup.controls.others.setValue(false);
      this.isCapitalchecked = false;
      this.formGroup.controls.capital.setValue(false);
      this.isBusinessProfessionchecked = false;
      this.formGroup.controls.businessProfession.setValue(false);
      this.isAgriculturechecked = false;
      this.formGroup.controls.agriculture.setValue(false);
      this.isHousePropertychecked = false;
      this.formGroup.controls.houseProperty.setValue(false);
      this.isSecuritychecked = false;
      this.formGroup.controls.security.setValue(false);
      this.isSalarychecked = false;
      this.formGroup.controls.salaries.setValue(false);
      this.isFirmchecked = false;
      this.formGroup.controls.firm.setValue(false);
      this.isAopchecked = false;
      this.formGroup.controls.aop.setValue(false);
      this.isOutsideIncomechecked = false;
      this.formGroup.controls.outsideIncome.setValue(false);
      this.formGroup.controls.spouseChild.setValue(false);
      this.isAnyIncomeInAssessmentYr = false;

      this.resetAdditionalInfoData();
    }
  }

  //#endregion

  //#region reset additional info data

  resetAdditionalInfoData() {
    this.basicInformationGetApi1.incomeLocation = '0';
    this.basicInformationGetApi1.gazetteNo = '';
    this.basicInformationGetApi1.personDisabilityReference = "";

    this.basicInformationGetApi1.personDisabilityDate = "";
    this.basicInformationGetApi1.firstDisableChildName = "";
    this.basicInformationGetApi1.firstChildDisabilityReference = "";
    this.basicInformationGetApi1.firstChildDisabilityDate = "";

    this.basicInformationGetApi1.secondDisableChildName = "";
    this.basicInformationGetApi1.secondChildDisabilityReference = "";
    this.basicInformationGetApi1.secondChildDisabilityDate = "";
  }

  //#endregion

  //#region delete all Salary
  changeSalary(removeSalary: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeSalary, this.config);
  }

  remove_Salary() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/salaries')
      .subscribe(result => {
        //console.log(result);
        if (result.success) {
          this.isSalarychecked = false;
          this.formGroup.controls.salaries.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.isSalarychecked = true;
          this.formGroup.controls.salaries.setValue(true);
          this.toastr.warning('Failed to Remove Salaries!', '', {
            timeOut: 3000,
          });
          return;

        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.isSalarychecked = true;
          this.formGroup.controls.salaries.setValue(true);
          this.toastr.warning('Failed to Remove Salaries!', '', {
            timeOut: 3000,
          });
        });

  }
  unchange_Salary() {
    this.modalRef.hide();
    this.formGroup.controls.salaries.setValue(true);
    this.isSalarychecked = true;
  }
  //#endregion

  //#region delete all IOS
  changeIOS(removeIOS: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeIOS, this.config);
  }

  remove_IOS() {
    this.modalRef.hide();
    let dltAllIOS = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/user-panel/delete-all-ios', "")
      .subscribe(result => {
       // console.log(result);
        if (result.success) {
          this.isSecuritychecked = false;
          this.formGroup.controls.security.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.warning('Failed to Remove Interest on Securities!', '', {
            timeOut: 3000,
          });
          this.formGroup.controls.security.setValue(true);
          this.isSecuritychecked = true;
        });

  }
  unchange_IOS() {
    this.modalRef.hide();
    this.formGroup.controls.security.setValue(true);
    this.isSecuritychecked = true;
  }
  //#endregion

  //#region delete all House property
  changeHP(removeHP: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeHP, this.config);
  }

  remove_HP() {
    this.modalRef.hide();
    let dltAllHP = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/user-panel/delete-all-hp',"")
      .subscribe(result => {
       // console.log(result);
        if (result.success) {
          this.isHousePropertychecked = false;
          this.formGroup.controls.houseProperty.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.formGroup.controls.houseProperty.setValue(true);
          // this.isHousePropertychecked = true;
          // this.toastr.warning('Failed to remove house property!');
          this.isHousePropertychecked = false;
          this.formGroup.controls.houseProperty.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_HP() {
    this.modalRef.hide();
    this.formGroup.controls.houseProperty.setValue(true);
    this.isHousePropertychecked = true;
  }
  //#endregion

  //#region delete all Agriculture
  changeAgriculture(removeAgriculture: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeAgriculture, this.config);
  }

  remove_Agriculture() {
    this.modalRef.hide();
    let dltAllAgriculture = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/user-panel/delete-all-agri', "")
      .subscribe(result => {
        //console.log(result);
        if (result.success) {
          this.isAgriculturechecked = false;
          this.formGroup.controls.agriculture.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.isAgriculturechecked = true;
          // this.formGroup.controls.agriculture.setValue(true);
          // this.toastr.warning('Failed to remove Agriculture!');
          this.isAgriculturechecked = false;
          this.formGroup.controls.agriculture.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_Agriculture() {
    this.modalRef.hide();
    this.formGroup.controls.agriculture.setValue(true);
    this.isAgriculturechecked = true;
  }
  //#endregion

  //#region delete all Business
  changeBusiness(removeBusiness: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeBusiness, this.config);
  }

  remove_Business() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/business')
      .subscribe(result => {
        //console.log(result);
        if (result.body.success) {
          this.isBusinessProfessionchecked = false;
          this.formGroup.controls.businessProfession.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.isBusinessProfessionchecked = true;
          this.formGroup.controls.businessProfession.setValue(true);
          this.toastr.warning('Failed to remove Business or Profession!', '', {
            timeOut: 3000,
          });
        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.warning('Failed to Remove Business or Profession!', '', {
            timeOut: 3000,
          });
        });

  }
  unchange_Business() {
    this.modalRef.hide();
    this.formGroup.controls.businessProfession.setValue(true);
    this.isBusinessProfessionchecked = true;
  }
  //#endregion

  //#region delete all capital gain
  changeCG(removeCapitalGain: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeCapitalGain, this.config);
  }

  remove_CG() {
    this.modalRef.hide();
    let dltAllCG = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/delete_all_capital_gain', "")
      .subscribe(result => {
        //console.log(result);
        if (result.success) {
          this.isCapitalchecked = false;
          this.formGroup.controls.capital.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.toastr.warning('Failed to remove Capital Gain!');
          // this.formGroup.controls.capital.setValue(true);
          this.isCapitalchecked = false;
          this.formGroup.controls.capital.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_CG() {
    this.modalRef.hide();
    this.formGroup.controls.capital.setValue(true);
    this.isCapitalchecked = true;
  }
  //#endregion

  //#region delete all IFOS
  changeIFOS(removeIFOS: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeIFOS, this.config);
  }

  remove_IFOS() {
    this.modalRef.hide();
    let dltAllIFOS = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/user-panel/delete-all-ifos',"")
      .subscribe(result => {
        //console.log(result);
        if (result.success) {
          this.isOtherschecked = false;
          this.formGroup.controls.others.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
      },
        error => {
         // console.log(error['error'].errorMessage);
          this.isOtherschecked = true;
          this.formGroup.controls.others.setValue(true);
          this.toastr.warning('Failed to Remove Income from Other Sources!', '', {
            timeOut: 3000,
          });
        });

  }
  unchange_IFOS() {
    this.modalRef.hide();
    this.isOtherschecked = true;
    this.formGroup.controls.others.setValue(true);
  }
  //#endregion

  //#region delete all Firm
  changeFirm(removeFirm: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeFirm, this.config);
  }

  remove_Firm() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/master/8')
      .subscribe(result => {
        //console.log(result);
        if (result === 'S') {
          this.isFirmchecked = false;
          this.formGroup.controls.firm.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.formGroup.controls.firm.setValue(true);
          this.isFirmchecked = true;
          this.toastr.warning('Failed to Remove Firm!', '', {
            timeOut: 3000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.toastr.warning('Failed to remove firm!');
          this.isFirmchecked = false;
          this.formGroup.controls.firm.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_Firm() {
    this.modalRef.hide();
    this.formGroup.controls.firm.setValue(true);
    this.isFirmchecked = true;
  }
  //#endregion

  //#region delete all AoP
  changeAoP(removeAoP: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeAoP, this.config);
  }

  remove_AoP() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/master/9')
      .subscribe(result => {
     //   console.log(result);
        if (result === 'S') {
          this.isAopchecked = false;
          this.formGroup.controls.aop.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.formGroup.controls.aop.setValue(true);
          this.isAopchecked = true;
          this.toastr.warning('Failed to Remove AoP!', '', {
            timeOut: 3000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.toastr.warning('Failed to remove aop!');
          this.isAopchecked = false;
          this.formGroup.controls.aop.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_AoP() {
    this.modalRef.hide();
    this.formGroup.controls.aop.setValue(true);
    this.isAopchecked = true;
  }
  //#endregion

  //#region delete all foreign income
  changeFI(removeFI: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeFI, this.config);
  }

  remove_FI() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/master/10')
      .subscribe(result => {
       // console.log(result);
        if (result === 'S') {
          this.isOutsideIncomechecked = false;
          this.formGroup.controls.outsideIncome.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.formGroup.controls.outsideIncome.setValue(true);
          this.isOutsideIncomechecked = true;
          this.toastr.warning('Failed to Remove Foreign Income!', '', {
            timeOut: 3000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.toastr.warning('Failed to remove foreign income!');
          this.isOutsideIncomechecked = false;
          this.formGroup.controls.outsideIncome.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_FI() {
    this.modalRef.hide();
    this.formGroup.controls.outsideIncome.setValue(true);
    this.isOutsideIncomechecked = true;
  }
  //#endregion


  //#region delete all spouse income
  changeSI(removeSI: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeSI, this.config);
  }

  remove_SI() {
    this.modalRef.hide();
    this.apiService.delete(this.serviceUrl + 'api/user-panel/income-head/firm-etc/master/11')
      .subscribe(result => {
    //    console.log(result);
        if (result === 'S') {
          this.isSpouseChildchecked = false;
          this.formGroup.controls.spouseChild.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
        else {
          this.formGroup.controls.spouseChild.setValue(true);
          this.isSpouseChildchecked = true;
          this.toastr.warning('Failed to Remove Spouse/Child Income!', '', {
            timeOut: 3000,
          });
          return;
        }
      },
        error => {
          // console.log(error['error'].errorMessage);
          // this.toastr.warning('Failed to remove spouse/child  income!');
          this.isSpouseChildchecked = false;
          this.formGroup.controls.spouseChild.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
        });

  }
  unchange_SI() {
    this.modalRef.hide();
    this.formGroup.controls.spouseChild.setValue(true);
    this.isSpouseChildchecked = true;
  }
  //#endregion


  //addRemoveTaxExemptedIncomeHead
  onChange_Have_Tax_Exempted_Income(event: any, removeTEI) {

    if (event.target.value === '1') {
      this.selectedIncomeHeadData.forEach((element, i) => {
        if (element.incomeSourceName === 'Tax Exempted Income') {
          this.formGroup.controls.taxExemptedIncome.setValue(true);
          this.haveTaxExemptedIncHead = true;
        }
        else {
          this.haveTaxExemptedIncHead = false;
        }
      });

      if (!this.haveTaxExemptedIncHead) {
        this.newHead = {
          "tinNo": this.userTin,
          "assessmentYear": this.formGroup.value.assessmentYear,
          "incomeSourceName": 'Tax Exempted Income',
        }
        this.selectedIncomeHeadData.push(this.newHead);
     //   console.log('UpdatedSelectedIncomeHeadData=', this.selectedIncomeHeadData);
      }
    }

    else {
      this.changeTEI(removeTEI);

    }

    this.apiService.post(this.serviceUrl + 'api/user-panel/save-selected-income-heads', this.selectedIncomeHeadData)
      .subscribe(result => {
      },
        error => {
       //   console.log(error['error'].errorMessage);
        });

  }

  //#region delete all Tax Exempted Income

  changeTEI(removeTEI: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeTEI, this.config);
  }

  remove_TEI() {
    this.modalRef.hide();
    let dltAllTEI = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/user-panel/delete-all-tax-exempted-income', "")
      .subscribe(result => {
        if (result.success) {
          this.selectedIncomeHeadData.forEach((element, index) => {
            if (element.incomeSourceName === 'Tax Exempted Income') {
              this.selectedIncomeHeadData.splice(index, 1);
              this.formGroup.controls.taxExemptedIncome.setValue(false);
           //   console.log('UpdatedSelectedIncomeHeadData=', this.selectedIncomeHeadData);
            }
          });
          // this.isSecuritychecked = false;
          // this.formGroup.controls.taxExemptedIncome.setValue(false);
          this.toastr.success('Successfully Deleted!', '', {
            timeOut: 1000,
          });
          return;
        }
      },
        error => {
      //    console.log(error['error'].errorMessage);
          this.toastr.warning('Failed to Remove Tax Exempted Income!', '', {
            timeOut: 3000,
          });
          this.formGroup.patchValue({
            haveTaxExemptedInc: '1'
          });
        });

  }
  unchange_TEI() {
    this.modalRef.hide();
    this.formGroup.patchValue({
      haveTaxExemptedInc: '1'
    });
    // this.isSecuritychecked = true;
  }

  //#endregion

  onBackPage() {
    this.router.navigate(["/user-panel/basic-query-taxpayer"]);
  }

  dateValidation(incomeYrFrom, incomeYrTo): boolean {
    let _incomeYrFrom = +(new Date()) - +(this.formattingDate(incomeYrFrom));
    let _incomeYrTo = +(new Date()) - +(this.formattingDate(incomeYrTo));

    //validation : income year to must greater or equal to income year from
    if (_incomeYrFrom >= _incomeYrTo)
      return true;
    else
      return false;
  }

  formattingDate(inputDate: string): Date {
    let _day: any, _month: any, _year: any, formatDate: any;
    _day = inputDate.substring(0, 2);
    _month = inputDate.substring(3, 5);
    _year = inputDate.substring(6, 12);
    formatDate = _month + '/' + _day + '/' + _year;
    return new Date(formatDate);
  }

  getCurrentBasicConfigInfo()
  {
    
    this.apiService.get(this.serviceUrl + 'api/getBasicConfigData')
      .subscribe(result => {
        var incomeYearfromRedis = result.CURRENT_INCOME_YEAR.split("|");
        this.currentAssessmentYrFromRedis = result.CURRENT_ASSESSMENT_YEAR_KEY;
        this.currentIncomeYearFromRedis = incomeYearfromRedis[0];
        this.currentIncomeYearToFromRedis = incomeYearfromRedis[1];


        this.formGroup.patchValue({
          assessmentYear : this.currentAssessmentYrFromRedis,
          fromIncomeYear : this.currentIncomeYearFromRedis,
          toIncomeYear : this.currentIncomeYearToFromRedis
        });
      } ,      
      error => {
          this.toastr.error(error['error'].errorMessage,);
        });
  }
}
