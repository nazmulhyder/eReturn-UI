import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-final-return-view',
  templateUrl: './final-return-view.component.html',
  styleUrls: ['./final-return-view.component.css']
})
export class FinalReturnViewComponent implements OnInit {
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
  taxPayerName: any;

  isShow: any;

  isExpenditureExists: boolean = false;

  isPrintBtnClick: boolean = false;
  userRoles: any;
  submissionDate:any;
  
  constructor(
    private activeRoutes: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private eReturnSpinner: NgxUiLoaderService
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
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
    });
    this.userRoles = localStorage.getItem('userRoles');
    this.userTin = this.activeRoutes.snapshot.paramMap.get("tin");
    localStorage.removeItem('tin');
    localStorage.setItem('tin', this.userTin);
    this.eReturnSpinner.start();

    this.isIncomeExists();
    this.loadAll_incomeHeads_on_Page_reload();
    // this.checkSubmissionStatus();

    this.getExpenditure();

    // if (this.hasAnyIncome == false) {
    //   this.singleReturnViewVisible = true; //single
    // }
    if (localStorage.getItem('isPrintClick') == 'true') {
      this.isPrintBtnClick = true;
    }
    this.eReturnSpinner.stop();
  }

  isIncomeExists() {
    //#endregion  check house property data exists
    let storeHpData: any;
    let oHp =
    {
      "tinNo": this.userTin,
      "assessmentYear": "2021-2022"
    };
    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-house-property-data', oHp)
      .subscribe(result => {
        storeHpData = result;
        this.isHPDataExists = storeHpData.length > 0 ? true : false;

      },
        error => {
          console.log(error['error'].errorMessage);
          this.isHPDataExists = false;
        });

    //#endregion
    //#endregion  check business data exists
    let storeBusinessData: any;
    this.apiService.get(this.serviceUrl + 'api/management/return-view/business/' + this.userTin + '/2021-2022')
      .subscribe(result => {
        storeBusinessData = result.data;
        this.isBusinessDataExists = storeBusinessData.length > 0 ? true : false;

      },
        error => {
          console.log(error['error'].errorMessage);
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
    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-selected-income-heads', this.requestIncomeHeadGetData)
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
          }
          else if (element.incomeSourceTypeId === 2 && element.active) {
            this.formGroup.controls.security.setValue(true);
          }
          else if (element.incomeSourceTypeId === 3 && element.active) {
            this.formGroup.controls.houseProperty.setValue(true);
          }
          else if (element.incomeSourceTypeId === 4 && element.active) {
            this.formGroup.controls.agriculture.setValue(true);
          }
          else if (element.incomeSourceTypeId === 5 && element.active) {
            this.formGroup.controls.businessProfession.setValue(true);
          }
          else if (element.incomeSourceTypeId === 6 && element.active) {
            this.formGroup.controls.capital.setValue(true);
          }
          else if (element.incomeSourceTypeId === 7 && element.active) {
            this.formGroup.controls.others.setValue(true);
          }
          else if (element.incomeSourceTypeId === 8 && element.active) {
            this.formGroup.controls.firm.setValue(true);
          }
          else if (element.incomeSourceTypeId === 9 && element.active) {
            this.formGroup.controls.aop.setValue(true);
          }
          else if (element.incomeSourceTypeId === 10 && element.active) {
            this.formGroup.controls.outsideIncome.setValue(true);
          }
          else if (element.incomeSourceTypeId === 11 && element.active) {
            this.formGroup.controls.spouseChild.setValue(true);

          }
          else if (element.incomeSourceTypeId === 12 && element.active) {
            this.formGroup.controls.taxExemptedIncome.setValue(true);
          }
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

    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-assessment-additional-info', this.requestNavbarGetData)
      .subscribe(result => {
        this.getAdditional_info_data = result;
        console.log('addi info data', this.getAdditional_info_data);
        if (this.getAdditional_info_data != null) {
          this.additionalInformationForm.controls.isInvestmentforTaxRebate.setValue(this.getAdditional_info_data.anyTaxRebate == true ? '1' : '0');
          this.additionalInformationForm.controls.isIncomeExceeding4Lakhs.setValue(this.getAdditional_info_data.incomeExceedFourLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isShareholderDirectorofCompany.setValue(this.getAdditional_info_data.shareholder == true ? '1' : '0');
          this.additionalInformationForm.controls.isGrossWealthOver4Lakhs.setValue(this.getAdditional_info_data.grossWealthOverFortyLakhs == true ? '1' : '0');
          this.additionalInformationForm.controls.isOwnmotorCar.setValue(this.getAdditional_info_data.ownMotorCar == true ? '1' : '0');
          this.additionalInformationForm.controls.isHaveHouseProperty.setValue(this.getAdditional_info_data.houseProperty == true ? '1' : '0');
          this.additionalInformationForm.controls.isIT10BNotMandatory.setValue(this.getAdditional_info_data.mandatoryITTenB == true ? '1' : '0');
          this.hasAnyIncome = (this.getAdditional_info_data.anyIncome == true) ? true : false;
          this.getIncomeHead();

        }
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
    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-selected-income-heads', getIncomeHeadReqData)
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

        // if (this.hasAnyIncome == false) {
        //   this.commonReturnView_941Visible = false; //single
        // }
        // if (this.hasAnyIncome == true) {
        //   this.commonReturnView_941Visible = true; //single
        // }

        if (!this.hasAnyIncome) {
          this.commonReturnView_941Visible = false;
          this.singleReturnViewVisible = true; //single return view
        }
        if (this.hasAnyIncome) {
          this.commonReturnView_941Visible = true; //main return part1,2,3
        }

        console.log('getAdditional_info_data', this.getAdditional_info_data);
        this.rebateReturnView_865Visible = (this.getAdditional_info_data.anyTaxRebate == true) ? true : false;
        this.assetsReturnView_846Visible = (this.getAdditional_info_data.grossWealthOverFortyLakhs == true || this.getAdditional_info_data.ownMotorCar == true
          || this.getAdditional_info_data.houseProperty == true || this.getAdditional_info_data.mandatoryITTenB == true) ? true : false;
        this.it10bb20167ReturnViewVisible = (this.getAdditional_info_data.incomeExceedFourLakhs == true || this.getAdditional_info_data.shareholder == true) ? true : false;

      })
  }

  checkSubmissionStatus() {
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.post(this.serviceUrl + 'api/management/return-view/get_submission', reqData)
      .subscribe(result => {
        if (result.replyMessage != null) {
          this.isShowSubmitButton = true;
          this.isShow = true;
        }
        else {
          this.isShowSubmitButton = false;
          this.isShow = false;
          this.toastr.error('Submit Your Return First', '', {
            timeOut: 3000,
          });
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  getExpenditure() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    this.apiService.post(this.serviceUrl + 'api/management/return-view/get-basic-return-info', reqBody)
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.isExpenditureExists = result.replyMessage.IT10BB_Mandatory;
          this.taxPayerName = result.replyMessage.assesName;
          this.submissionDate = result.replyMessage.submissionDate;
          localStorage.removeItem('name')
          localStorage.setItem('name', this.taxPayerName);
        }
      })
  }

  onBackPage() {
    if (this.userRoles == 'CIRCLE_INSPECTOR') {
      this.router.navigateByUrl("/pages/approved-return");
    }
    else {
      this.router.navigateByUrl("/pages/return-list");
    }
  }

}
