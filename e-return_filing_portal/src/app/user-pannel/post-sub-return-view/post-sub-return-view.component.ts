import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import { TaxpayerProfileDetailsService } from '../taxpayer-profile-details.service';
import { BasicInfoService } from './basic-info.service';

@Component({
  selector: 'app-post-sub-return-view',
  templateUrl: './post-sub-return-view.component.html',
  styleUrls: ['./post-sub-return-view.component.css']
})
export class PostSubReturnViewComponent implements OnInit {
  isShowSubmitButton: any;
  hasAnyIncome: boolean = false;
  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};
  headsOfIncome = [];
  lengthOfheads: any;

  userTin: any;
  requestNavbarGetData: any;
  additionalInformationForm: FormGroup;
  requestIncomeHeadGetData: any;
  formGroup: FormGroup;

  getAdditional_info_data: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  taxpayerProfileDetail: any;

  singleReturnViewVisible: boolean = false; //single
  commonReturnView_941Visible: boolean = false; //Part 1 ,2,3 & Ack
  salaryReturnView_922Visible: boolean = false; //salary
  housePropertyView_903Visible: boolean = false; //house property
  businessReturnView_884Visible: boolean = false; //business
  rebateReturnView_865Visible: boolean = false; //rebate
  assetsReturnView_846Visible: boolean = false; //assets
  it10bb20167ReturnViewVisible: boolean = false; //it 10bb20167

  // this boolean is checking for data exist or not!
  isHPDataExists: boolean = false;
  isBusinessDataExists: boolean = false;
  verificaionChecked: boolean = false;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  taxPayerName: any;
  isReturnSubmissionSuccessful: boolean = false;
  isPaymentComplete: boolean = false;
  isExpenditureExists: boolean = false;
  isShow: boolean = true;
  isCompletePatchValue: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private headService: HeadsOfIncomeService,
    private taxpayerProfiledetailService: TaxpayerProfileDetailsService,
    private mainNavbarList: mainNavbarListService,
    private eReturnSpinner: NgxUiLoaderService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private basicInfo: BasicInfoService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  mainNavActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.mainNavActive = x;
  }
  ngOnInit(): void {
    this.eReturnSpinner.start();

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.taxPayerName = localStorage.getItem('name');
    this.userTin = localStorage.getItem('tin');
    this.getExpenditure();
    this.getMainNavbar();
    // this.mainNavActiveSelect('8');
    this.mainNavActiveSelect('7');
    // this.hasAnyIncome = localStorage.getItem('hasAnyIncome');
    this.isIncomeExists();
    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    // this.loadAll_navbar_on_Page_reload();
    //#endregion
    this.checkSubmissionStatus();
    this.checkDuePaymentStatus();
    this.eReturnSpinner.stop();

    // if (this.hasAnyIncome == 'false') {
    //   this.singleReturnViewVisible = true; //single
    // }

  }

  isIncomeExists() {
    //#endregion  check house property data exists
    let storeHpData: any;
    
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-house-property-data')
      .subscribe(result => {
        storeHpData = result;
        this.isHPDataExists = storeHpData.length > 0 ? true : false;

      },
        error => {
          // console.log(error['error'].errorMessage);
          this.isHPDataExists = false;
        });

    //#endregion
    //#endregion  check business data exists
    let storeBusinessData: any;
    this.apiService.get(this.serviceUrl + 'api/user-panel/income-head/business')
      .subscribe(result => {
        storeBusinessData = result.data;
        this.isBusinessDataExists = storeBusinessData.length > 0 ? true : false;

      },
        error => {
          //   console.log(error['error'].errorMessage);
          this.isBusinessDataExists = false;
        });

    //#endregion

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
    // let getAdditional_info_data: any;
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
        this.getAdditional_info_data = result;
        //    console.log('addi info data', this.getAdditional_info_data);
        if (this.getAdditional_info_data != null) {
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue(this.getAdditional_info_data.anyTaxRebate == true ? '1' : '0');
          this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue(this.getAdditional_info_data.incomeExceedFourLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue(this.getAdditional_info_data.shareholder == true ? '1' : '0');
          this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue(this.getAdditional_info_data.grossWealthOverFortyLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isOwnmotorCar.setValue(this.getAdditional_info_data.ownMotorCar == true ? '1' : '0');
          this.additionalInformationForm.controls.isHaveHouseProperty.setValue(this.getAdditional_info_data.houseProperty == true ? '1' : '0');
          this.additionalInformationForm.controls.isIT10BNotMandatory.setValue(this.getAdditional_info_data.mandatoryITTenB == true ? '1' : '0');

          this.hasAnyIncome = this.getAdditional_info_data.anyIncome;
          this.getIncomeHead();

        }

        if (!this.hasAnyIncome) {
          this.mainNavbarList.addSelectedMainNavbar(this.additionalInformationForm.value);
        }
        else {
          this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Return View');
        }
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }

  getIncomeHead() {
    // get all selected income heads
    let allIncomeHeadsData: any;
    let getOnlyIncomeHeads = [];

    let getIncomeHeadReqData: any;
    getIncomeHeadReqData =
    {
      "tinNo": this.userTin
    };
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-selected-income-heads')
      .subscribe(result => {

        allIncomeHeadsData = result;

        // console.log('result', allIncomeHeadsData);

        allIncomeHeadsData.forEach(element => {
          // console.log('@@@', element);
          getOnlyIncomeHeads.push(element.incomeSourceType);
        });

        // console.log('total result',getOnlyIncomeHeads);

        getOnlyIncomeHeads.forEach(element => {

          if (element.incomeSourceTypeId === 1 && element.active) {
            this.salaryReturnView_922Visible = true;
          }
          if (element.incomeSourceTypeId === 3 && element.active) {
            this.housePropertyView_903Visible = true;
          }
          if (element.incomeSourceTypeId === 5 && element.active) {
            this.businessReturnView_884Visible = true;
          }

        });

        if (!this.hasAnyIncome) {
          this.commonReturnView_941Visible = false;
          this.singleReturnViewVisible = true; //single return view
        }
        if (this.hasAnyIncome) {
          this.commonReturnView_941Visible = true; //main return part1,2,3
        }

        //   console.log('getAdditional_info_data', this.getAdditional_info_data);
        this.rebateReturnView_865Visible = (this.getAdditional_info_data.anyTaxRebate == true) ? true : false;
        this.assetsReturnView_846Visible = (this.getAdditional_info_data.grossWealthOverFortyLakhs == true || this.getAdditional_info_data.ownMotorCar == true
          || this.getAdditional_info_data.houseProperty == true || this.getAdditional_info_data.mandatoryITTenB == true) ? true : false;
        this.it10bb20167ReturnViewVisible = (this.getAdditional_info_data.incomeExceedFourLakhs == true || this.getAdditional_info_data.shareholder == true) ? true : false;

      })
  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }

  checkSubmissionStatus() {
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get_submission')
      .subscribe(result => {
        if (result.replyMessage != null) {
          // this.verificaionChecked = true;
          // this.isReturnSubmissionSuccessful = true;
          // this.isShowSubmitButton = true;
          if ((result.replyMessage).returnSubmissionType == "ONLINE") {
            this.isReturnSubmissionSuccessful = true;
            this.isShow = false;
          }
          else {
            this.isShowSubmitButton = false;
            this.isReturnSubmissionSuccessful = false;
            this.isShow = true;
          }
        }
        else {
          // this.verificaionChecked = false;
          this.isShowSubmitButton = false;
          this.isReturnSubmissionSuccessful = false;
          this.isShow = true;
        }
        //   console.log('Submission Status:', this.isReturnSubmissionSuccessful);
      },
        error => {
          //   console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  checkDuePaymentStatus() {
    // debugger;
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/due_payment_status')
      .subscribe(result => {
        if (result.success == true) {
          if (result.replyMessage['eligibilityForSubmission'] == true) {
            this.isPaymentComplete = true;
          }
        }
        //   console.log('Payment Status:', this.isPaymentComplete);
      },
        error => {
          //  console.log(error['error'].errorMessage);
          if (error['error'].errorMessage == "You have already submitted your Return! You are not allowed to make any changes now.") {
            this.isPaymentComplete = true;
          }
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  gotoThanksGivingPage(returnSubmissionPopup) {
    // this.router.navigate(["/thanks-giving"]);
    // this.router.navigate(["/user-panel/thanks-giving"]);
    // debugger;
    this.eReturnSpinner.start();
    if (this.verificaionChecked == true) {
      this.eReturnSpinner.stop();
      if (this.isPaymentComplete == false) {
        this.eReturnSpinner.stop();
        this.toastr.warning('Payment incomplete. Clear your payable amount first.', '', {
          timeOut: 2500,
        });
      }
      else if (this.isReturnSubmissionSuccessful == true) {
        this.toastr.error('You have already submitted your return in online.', '', {
          timeOut: 2500,
        });
      }
      else {
        this.eReturnSpinner.stop();
        this.returnSubmissionPopup(returnSubmissionPopup);
      }
    }
    else {
      this.eReturnSpinner.stop();
      this.toastr.warning('Please, check the verification checkbox first.', '', {
        timeOut: 2500,
      });
    }

  }

  onVerificationChange(event: any) {
    //  console.log('test verfification check', event.target.checked);
    if (event.target.checked) {
      this.verificaionChecked = true;
      // this.isShowSubmitButton = true;
    }
    else {
      this.verificaionChecked = false;
      // this.isShowSubmitButton = false;
    }
  }

  returnSubmissionPopup(removeTEI: TemplateRef<any>) {
    this.modalRef = this.modalService.show(removeTEI, this.config);
  }

  No_Submission() {
    this.modalRef.hide();
  }
  Submission_Yes() {
    this.modalRef.hide();
    let reqData = {
      "assessmentYear": "2021-2022",
      "submissionStatus": true,
      "returnSubmissionType": "ONLINE",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/save_submission', reqData)
      .subscribe(result => {
        if (result.success) {
          this.toastr.success('Return Submitted Successfully', '', {
            timeOut: 1000,
          });
          this.router.navigate(["/user-panel/thanks-giving"]);
        }
        else {
          this.toastr.error('Return Submission Failed!', '', {
            timeOut: 2000,
          });
        }
      },
        error => {
          //   console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 5000,
          });
        });

  }

  async getExpenditure() {
    // debugger;
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    await this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.isExpenditureExists = result.replyMessage.IT10BB_Mandatory;
          this.basicInfo.patchValue(result.replyMessage);
          this.isCompletePatchValue = true;
        }
      })
  }
}
