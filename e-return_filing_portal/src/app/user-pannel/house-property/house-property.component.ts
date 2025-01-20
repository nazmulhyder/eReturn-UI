import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mainNavbarListService } from '../../service/main-navbar.service';
import { HeadsOfIncomeService } from '../heads-of-income.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../custom-services/ApiService';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-house-property',
  templateUrl: './house-property.component.html',
  styleUrls: ['./house-property.component.css'],
})
export class HousePropertyComponent implements OnInit {
  html = `<span class="btn-block well-sm">Help!</span>`;
  addressOfProperty = `<span class="btn-block well-sm">Address in accordance with your ownership documents or official records.</span>`;
  chkAnyCC = `<span class="btn-block well-sm">Select “Yes” if your property is located in any city corporation.  Otherwise, select “No”.</span>`;
  areaTooltip = `<span class="btn-block well-sm">Enter cumulative area for each particular. For example, if you have rented out two units for residential use each having 1200 sq ft, enter 2400.</span>`;


  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};
  group: FormGroup;
  userTin: any;

  navActive = {};
  noSelected = [];
  item: any;
  headsOfIncome = [];
  lengthOfheads: any;
  formArray: FormArray;
  isVisibleForm: any;
  tmpVar1: any; tmpVar2: any;
  isSaveDraft: boolean = false;

  totalArea = [];
  totalAnnualRent = [];
  totalDeductAmt = [];
  totalIncome = [];
  storeTotalIncome = [];
  percentTitle = [];
  requestGetData: any;
  storeGetData: any;

  repairDeductAmount = [];
  temp_repairCollecEtc = [];

  modalRef: BsModalRef;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  formGroup: FormGroup;
  additionalInformationForm: FormGroup;

  nameOftheOwner_Array = [];
  otherOwnerNameObj: any;
  validateHPData : boolean = false;

  //validation arrays
  addressOfProperty_showError = [];
  ResAnnualRent_showError = [];
  commAnnualRent_showError = [];
  repCollEtc_showError = [];
  shareOfOwnership_showError = [];
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
    private commaSeperator: CommaSeparatorService,
  ) {

    this.apiService = apiService;
    this.apiUrl = apiUrl;
    this.formArray = new FormArray([]);
  }

  insertFormGroupToArray() {
    this.group = new FormGroup({
      id: new FormControl(0),
      propertyAddress: new FormControl(''),
      IsAnyCC: new FormControl('1'),
      residentialArea: new FormControl(),
      unitOfResidentialArea: new FormControl(),
      residentialAnnualRent: new FormControl(),
      commercialArea: new FormControl(),
      unitOfCommercialArea: new FormControl(),
      commertialAnnualRent: new FormControl(),
      selfOccupiedArea: new FormControl(),
      totalArea: new FormControl(),
      totalAnnualRent: new FormControl(),
      ownershipRadio: new FormControl("1"),
      shareOfOwnership: new FormControl('100'),
      nameOfOtherOwner: new FormControl(''),
      repairDeductAmt: new FormControl(),
      municipalDeductAmt: new FormControl(),
      landRevenueDeductAmt: new FormControl(),
      interestDeductAmt: new FormControl(),
      insuranceDeductAmt: new FormControl(),
      vacancyDeductAmt: new FormControl(),
      otherDeductAmt: new FormControl(),
      totalDeductAmt: new FormControl(),
      totalIncome: new FormControl(),
      // ShareOwnerNames: this.fb.array([this.fb.group({
      //   additional_share_owner: new FormControl(),
      // })]),
    });
    this.formArray.push(this.group);
    this.selectedProperty(this.formArray.length - 1);
    this.percentTitle[this.percentTitle.length] = '100% of ';
    // this.initializeErrorIndexes(this.formArray.length - 1);
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

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.isVisibleForm = 0;
    this.navActiveSelect("3");
    // this.insertFormGroupToArray();
    this.getHeadsOfIncome();
    this.getMainNavbar();
    this.mainNavActiveSelect('2');

    //#region Page On Relaod
    this.loadAll_incomeHeads_on_Page_reload();
    this.loadAll_navbar_on_Page_reload();
    //#endregion
    // console.log('@@@@@ all navbar', this.selectedNavbar);
    this.getHousePropertyData();
    this.checkSubmissionStatus();

  }



  getHousePropertyData() {
   
    this.eReturnSpinner.start();
    this.apiService.get(this.serviceUrl + 'api/user-panel/get-house-property-data')
      .subscribe(result => {
        this.storeGetData = result;
        this.eReturnSpinner.stop();
        //console.log('get response ', this.storeGetData);
        let temp_repairDed: any;
        //debugger;
        if (this.storeGetData.length > 0) {
          this.storeGetData.forEach((element, index) => {
            this.totalArea.push(this.commaSeperator.currencySeparatorBD(element.totalArea));
            this.totalAnnualRent.push(this.commaSeperator.currencySeparatorBD(element.totalAnnualRent));
            this.repairDeductAmount.push(this.commaSeperator.currencySeparatorBD(element.repairCollection));
            this.totalIncome.push(this.commaSeperator.currencySeparatorBD(element.finalTotal));
            this.totalDeductAmt.push(this.commaSeperator.currencySeparatorBD(element.totalDeduction));
            this.percentTitle.push(element.shareOfOwnership + '% of ');
            // this.temp_repairCollecEtc.push(element.repairCollection);

            temp_repairDed = (((element.residentialAnnualRent * 25) / 100) + (element.commercialAmount * 30) / 100);
            this.temp_repairCollecEtc[index] = temp_repairDed;


          });
          let i = 0;

          this.storeGetData.forEach(element => {

            //get all other owners
            this.values[i] = [];
            this.tempOtherOwners = [];
            if (element.otherOwnersName != '' && element.otherOwnersName != null) {
              this.tempOtherOwners = element.otherOwnersName.split(',');
              this.tempOtherOwners.forEach((element, index) => {
                this.values[i].push({ value: element });
              })
            }



            // #region is the only owner? totalAnnualRent totalDeduction
            this.tmpVar1 = Math.round(element.totalAnnualRent ? element.totalAnnualRent : 0); this.tmpVar2 = Math.round(element.totalDeduction ? element.totalDeduction : 0);
            this.storeTotalIncome[i] = (this.tmpVar1 - this.tmpVar2);
            let isTheOnlyOwner: any;
            isTheOnlyOwner = (Math.round(element.shareOfOwnership) > 0 && Math.round(element.shareOfOwnership) < 100) ? '0' : '1';
            if (isTheOnlyOwner.match(0)) {
              this.noSelected[i] = true;
            }
            else {
              this.noSelected[i] = false;
            }
            i++;
            //#endregion
            this.group = new FormGroup({
              id: new FormControl(element.housePropertyId),
              propertyAddress: new FormControl(element.housePropertyAddress),
              IsAnyCC: new FormControl(element.anyCC === true ? '1' : '0'),
              residentialArea: new FormControl(element.residentialArea),
              unitOfResidentialArea: new FormControl(element.unitOfResidentialArea),
              residentialAnnualRent: new FormControl(this.commaSeperator.currencySeparatorBD(element.residentialAnnualRent)),
              commercialArea: new FormControl(element.commercialArea),
              unitOfCommercialArea: new FormControl(element.unitOfCommercialArea),
              commertialAnnualRent: new FormControl(this.commaSeperator.currencySeparatorBD(element.commercialAmount)),
              selfOccupiedArea: new FormControl(element.selfOccupiedArea),
              totalArea: new FormControl(element.totalArea),
              totalAnnualRent: new FormControl(this.commaSeperator.currencySeparatorBD(element.totalAnnualRent)),
              ownershipRadio: new FormControl(isTheOnlyOwner),
              shareOfOwnership: new FormControl(element.shareOfOwnership),
              nameOfOtherOwner: new FormControl(element.otherOwnersName),
              repairDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.repairCollection)),
              municipalDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.municipalLocalTax)),
              landRevenueDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.landRevenue)),
              interestDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.interestOnLoanMortgage)),
              insuranceDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.insurancePremium)),
              vacancyDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.vacancyAllowance)),
              otherDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.other)),
              totalDeductAmt: new FormControl(this.commaSeperator.currencySeparatorBD(element.totalDeduction)),
              totalIncome: new FormControl(this.commaSeperator.currencySeparatorBD(element.finalTotal)),
            })
            this.formArray.push(this.group);
            this.selectedProperty(this.formArray.length - 1);
          });
          // console.log('no selected', this.noSelected);
        }
        else {
          this.eReturnSpinner.stop();
          this.isVisibleForm = 0;
          this.navActiveSelect("3");
          this.insertFormGroupToArray();
          this.getHeadsOfIncome();
          this.getMainNavbar();
          this.mainNavActiveSelect('2');
        }
      });
    //end
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
          //  console.log('income of heads', this.lengthOfheads);
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
        }

        // this.mainNavbarList.addSelectedMainNavbar(this.additionalInformationForm.value);
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'House Property');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }
  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }

  selectedProperty(i: number) {
    this.isVisibleForm = i;
  }

  initializeAddressOfProp(event, i) {
    this.addressOfProperty_showError[i] = false;
  }

  onClick(e, i) {
    //debugger;
    if (e.target.value == 1) {
      this.noSelected[i] = false;
      this.formArray.controls[i].patchValue({
        shareOfOwnership: 100,
        nameOfOtherOwner: '',
      });
      this.percentTitle[i] = '100' + '% of ';
      let result: any;
      result = this.storeTotalIncome[i] ? (100 / 100) * this.storeTotalIncome[i] : 0;
      this.totalIncome[i] = this.commaSeperator.currencySeparatorBD(Math.round(result));
    }
    else {
      this.noSelected[i] = true;
      this.formArray.controls[i].patchValue({
        shareOfOwnership: '',
        nameOfOtherOwner: '',
      });
    }
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
    this.lengthOfheads = this.headsOfIncome.length;
  }

  onCloseTabClick(closetabpopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(closetabpopup);
  }

  close(i) {
    this.formArray.controls.forEach((element, index) => {
      if (index == i && element.value.id > 0) {
        this.apiService.delete(this.serviceUrl + 'api/user-panel/house-property-deleteItem?id=' + element.value.id)
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
      else if (index == i && element.value.id <= 0) {
        this.afterTabClose(i);
      }
    });

  }

  initializeErrorIndexes(i) {
    this.addressOfProperty_showError [i] = false;
    this.ResAnnualRent_showError[i] = false;
    this.commAnnualRent_showError[i] = false;
    this.repCollEtc_showError[i] = false;
    this.shareOfOwnership_showError[i] = false;
  }

  closeErrorIndexes(i) {
    this.addressOfProperty_showError.splice(i, 1);
    this.ResAnnualRent_showError.splice(i, 1);
    this.commAnnualRent_showError.splice(i, 1);
    this.repCollEtc_showError.splice(i, 1);
    this.shareOfOwnership_showError.splice(i, 1);
  }

  afterTabClose(i: any) {
    this.noSelected[i] = false;
    this.formArray.removeAt(i);
    this.totalArea.splice(i, 1);
    this.totalAnnualRent.splice(i, 1);
    this.totalDeductAmt.splice(i, 1);
    this.totalIncome.splice(i, 1);
    this.repairDeductAmount.splice(i, 1);
    this.temp_repairCollecEtc.splice(i, 1);
    this.percentTitle.splice(i, 1);
    this.closeErrorIndexes(i);
    if (this.formArray.length >= 1) {
      this.isVisibleForm = this.formArray.controls.length - 1;
      this.modalRef.hide();
    }
    else if (this.formArray.length < 1) {
      this.isVisibleForm = 0;
      this.insertFormGroupToArray();
      this.modalRef.hide();
    }
    else {

    }
  }

  calcTotalIncome($event: any, i) {
    // debugger;
    // if (isNaN($event.target.value)) {
    //   this.toastr.warning($event.target.value + " this is not a numeric number", '', {
    //     timeOut: 1000,
    //   });
    //   this.group.controls.totalIncome.setValue(0);
    //   return;
    // }
    if ((parseFloat($event.target.value)) <= 0) {
      this.toastr.warning("Share of your ownership will be more than 0 or Less than 100", '', {
        timeOut: 1000,
      });
      this.formArray.controls[i].patchValue({
        shareOfOwnership: 1,
      });
      // return;
    }
    if ((parseFloat($event.target.value)) > 100) {
      this.toastr.warning("Share of your ownership will be more than 0 or Less than 100", '', {
        timeOut: 1000,
      });
      this.formArray.controls[i].patchValue({
        shareOfOwnership: 100,
      });
      // return;
    }
    let percentageValue = parseFloat($event.target.value);
    this.percentTitle[i] = percentageValue + '% of ';
    let result: any;
    result = this.storeTotalIncome[i] ? (this.formArray.controls[i].value.shareOfOwnership / 100) * this.storeTotalIncome[i] : 0;
    this.totalIncome[i] = this.commaSeperator.currencySeparatorBD(Math.round(result));

    // set or patch value to Total Annual Rent - Deductions
    this.formArray.controls[i].patchValue({
      totalIncome: this.totalIncome[i]
    });
  }

  sumArea(i) {
    let residentialArea: any, commercialArea: any, selfOccupiedArea: any, totalArea: any;

    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        residentialArea = element.value.residentialArea ? element.value.residentialArea: 0;
        commercialArea = element.value.commercialArea ? element.value.commercialArea : 0;
        selfOccupiedArea = element.value.selfOccupiedArea ? element.value.selfOccupiedArea : 0;
        this.formArray.controls[i].patchValue({
          residentialArea: residentialArea ? residentialArea : '',
          commercialArea: commercialArea ? commercialArea : '',
          selfOccupiedArea: selfOccupiedArea ? selfOccupiedArea : '',
        });
      }
    });

    //  let residentialArea: any;
    residentialArea = (<HTMLInputElement>document.getElementById('residentialArea' + i)).value;
    // residentialArea = this.commaSeperator.removeComma(residentialArea, 0);
    residentialArea = residentialArea ? parseFloat(residentialArea) : 0;

    // let commercialArea: any;
    commercialArea = (<HTMLInputElement>document.getElementById('commercialArea' + i)).value;
    // commercialArea = this.commaSeperator.removeComma(commercialArea, 0);
    commercialArea = commercialArea ? parseFloat(commercialArea): 0;

    // let selfOccupiedArea: any;
    selfOccupiedArea = (<HTMLInputElement>document.getElementById('selfOccupiedArea' + i)).value;
    // selfOccupiedArea = this.commaSeperator.removeComma(selfOccupiedArea, 0);
    selfOccupiedArea = selfOccupiedArea ? parseFloat(selfOccupiedArea) : 0;

    totalArea = parseFloat(residentialArea + commercialArea + selfOccupiedArea);
    this.totalArea[i] = totalArea;

    this.formArray.controls[i].patchValue({
      totalArea: this.totalArea[i]
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

  
  acceptAreasFloatingPoints(event: any, i,formControlName) {
    let str = event.target.value;
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(str).toLowerCase());
    //console.log(result);
    if (!result) {
      if(formControlName=='residentialArea')
      {
        this.formArray.controls[i].patchValue({
          residentialArea: str === "0" || str.includes(",") ? "0" : str.substring(0,str.length-1)
        });
      }
      else if(formControlName=='commercialArea'){
        this.formArray.controls[i].patchValue({
          commercialArea:  str === "0" || str.includes(",") ? "0" : str.substring(0,str.length-1)
        });
      }
      else if(formControlName=='selfOccupiedArea'){
        this.formArray.controls[i].patchValue({
          selfOccupiedArea:  str === "0" || str.includes(",") ? "0" : str.substring(0,str.length-1)
        });
      }
    }
  }


  floatingNumbersOnly(event: any, i) {
    let str = event.target.value;
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(str).toLowerCase());
    //console.log(result);
    if (!result) {
      this.formArray.controls[i].patchValue({
        shareOfOwnership: str.substring(0,str.length-1)
      });
    }
    else {
    }
  }

  validateFloatingNumbers(inputNumber) {
    let result: boolean = false;
    const regularExpression = /^[1-9][0-9]*[.]?[0-9]{0,2}$/;
    result = regularExpression.test(String(inputNumber).toLowerCase());
    //console.log(result);
    if (!result)      
       return inputNumber.substring(0,inputNumber.length-1);   
    else  
      return  inputNumber;  
  }

  getCursorPosition(element) {
    // if (element.selectionStart) return element.selectionStart;
    // else if (window.getSelection)
    // {
    //     element.focus();
    //     var r = document.createRange();
    //     if (r == null) return 0;

    //     var re = element.createTextRange(),
    //         rc = re.duplicate();
    //     re.moveToBookmark(r.getBookmark());
    //     rc.setEndPoint('EndToStart', re);
    //     return rc.text.length;
    // }
    // return 0;
  }

  sumAnnualRent(i,formControlName) {

    let residentialAnnualRent: any, commertialAnnualRent: any, result: any, totalAnnualRent: any;
    let tmpRepairDeductAmt: any; let totalDeduction: any; let tmpMunicipalLocalTax: any;
    let landRevenueDeductAmt: any; let interestDeductAmt: any; let insuranceDeductAmt: any;
    let vacancyDeductAmt: any; let otherDeductAmt: any;

    if(formControlName === 'residentialAnnualRent' || formControlName === 'commertialAnnualRent') {
      this.ResAnnualRent_showError[i] = false;
      this.commAnnualRent_showError[i] = false;
      this.repCollEtc_showError[i] = false;
    }

    this.formArray.controls.forEach((element, index) => {
      if (index == i) {

        residentialAnnualRent = element.value.residentialAnnualRent ? this.commaSeperator.removeComma(element.value.residentialAnnualRent, 0) : 0;
        commertialAnnualRent = element.value.commertialAnnualRent ? this.commaSeperator.removeComma(element.value.commertialAnnualRent, 0) : 0;
        totalAnnualRent = (parseInt(this.commaSeperator.removeComma(element.value.residentialAnnualRent, 0)) + parseInt(this.commaSeperator.removeComma(element.value.commertialAnnualRent, 0)));
        tmpRepairDeductAmt = element.value.repairDeductAmt ? this.commaSeperator.removeComma(element.value.repairDeductAmt, 0) : 0;

        this.formArray.controls[i].patchValue({
          residentialAnnualRent: residentialAnnualRent ? this.commaSeperator.currencySeparatorBD(residentialAnnualRent) : '',
          commertialAnnualRent: commertialAnnualRent ? this.commaSeperator.currencySeparatorBD(commertialAnnualRent) : '',
          totalAnnualRent: totalAnnualRent ? this.commaSeperator.currencySeparatorBD(totalAnnualRent) : '',
          repairDeductAmt: tmpRepairDeductAmt ? this.commaSeperator.currencySeparatorBD(tmpRepairDeductAmt) : '',
        });
      }
    });

    residentialAnnualRent = (<HTMLInputElement>document.getElementById('residentialAnnualRent' + i)).value;
    residentialAnnualRent = this.commaSeperator.removeComma(residentialAnnualRent, 0);
    residentialAnnualRent = residentialAnnualRent ? Math.round(residentialAnnualRent) : 0;


    commertialAnnualRent = (<HTMLInputElement>document.getElementById('commertialAnnualRent' + i)).value;
    commertialAnnualRent = this.commaSeperator.removeComma(commertialAnnualRent, 0);
    commertialAnnualRent = commertialAnnualRent ? Math.round(commertialAnnualRent) : 0;

    totalAnnualRent = residentialAnnualRent + commertialAnnualRent;
    this.totalAnnualRent[i] =  this.commaSeperator.currencySeparatorBD(totalAnnualRent);

    this.formArray.controls[i].patchValue({
      totalAnnualRent: this.totalAnnualRent[i]
    });
    
    //calculate repair deduct amount
    tmpRepairDeductAmt = ((residentialAnnualRent * 25) / 100) + ((commertialAnnualRent * 30) / 100);
    tmpRepairDeductAmt = Math.round(tmpRepairDeductAmt);
    this.repairDeductAmount[i] = this.commaSeperator.currencySeparatorBD(tmpRepairDeductAmt);
    this.temp_repairCollecEtc[i] = tmpRepairDeductAmt;

    // set or patch value to repair deduct amount
    if(parseInt(this.repairDeductAmount[i])>0) this.repCollEtc_showError[i] = false;;
    this.formArray.controls[i].patchValue({
      repairDeductAmt: this.repairDeductAmount[i]
    });

    tmpRepairDeductAmt = (<HTMLInputElement>document.getElementById('repairDeductAmt' + i)).value;
    tmpRepairDeductAmt = this.commaSeperator.removeComma(tmpRepairDeductAmt, 0);
    tmpRepairDeductAmt = tmpRepairDeductAmt ? Math.round(tmpRepairDeductAmt) : 0;

    tmpMunicipalLocalTax = (<HTMLInputElement>document.getElementById('municipalDeductAmt' + i)).value;
    tmpMunicipalLocalTax = this.commaSeperator.removeComma(tmpMunicipalLocalTax, 0);
    tmpMunicipalLocalTax = tmpMunicipalLocalTax ? Math.round(tmpMunicipalLocalTax) : 0;

    // get land revenue data
    landRevenueDeductAmt = (<HTMLInputElement>document.getElementById('landRevenueDeductAmt' + i)).value;
    landRevenueDeductAmt = this.commaSeperator.removeComma(landRevenueDeductAmt, 0);
    landRevenueDeductAmt = landRevenueDeductAmt ? Math.round(landRevenueDeductAmt) : 0;

    //get Interest on Loan/Mortgage/Capital Charge
    interestDeductAmt = (<HTMLInputElement>document.getElementById('interestDeductAmt' + i)).value;
    interestDeductAmt = this.commaSeperator.removeComma(interestDeductAmt, 0);
    interestDeductAmt = interestDeductAmt ? Math.round(interestDeductAmt) : 0;

    //get Insurance Premium
    insuranceDeductAmt = (<HTMLInputElement>document.getElementById('insuranceDeductAmt' + i)).value;
    insuranceDeductAmt = this.commaSeperator.removeComma(insuranceDeductAmt, 0);
    insuranceDeductAmt = insuranceDeductAmt ? Math.round(insuranceDeductAmt) : 0;

    //get Vacancy Allowance
    vacancyDeductAmt = (<HTMLInputElement>document.getElementById('vacancyDeductAmt' + i)).value;
    vacancyDeductAmt = this.commaSeperator.removeComma(vacancyDeductAmt, 0);
    vacancyDeductAmt = vacancyDeductAmt ? Math.round(vacancyDeductAmt) : 0;

    //get Other
    otherDeductAmt = (<HTMLInputElement>document.getElementById('otherDeductAmt' + i)).value;
    otherDeductAmt = this.commaSeperator.removeComma(otherDeductAmt, 0);
    otherDeductAmt = otherDeductAmt ? Math.round(otherDeductAmt) : 0;

    //  calc Total Deduction and kept in temp veriable
    totalDeduction = (tmpRepairDeductAmt + tmpMunicipalLocalTax + landRevenueDeductAmt
      + interestDeductAmt + insuranceDeductAmt + vacancyDeductAmt + otherDeductAmt);


    // Total Deduction
    this.totalDeductAmt[i] =
      totalDeduction ? this.commaSeperator.currencySeparatorBD(Math.round(totalDeduction)) : 0;

      this.formArray.controls[i].patchValue({
        totalDeductAmt: this.totalDeductAmt[i]
      });


    let totalDeductAmt = parseInt(this.commaSeperator.removeComma(this.totalDeductAmt[i], 0));

    //debugger;
    if (totalDeductAmt > 0) {
      this.totalIncome[i] = Math.round(totalAnnualRent) - totalDeductAmt;
      this.storeTotalIncome[i] = this.totalIncome[i];
    } else {
      this.totalIncome[i] = Math.round(totalAnnualRent);
      this.storeTotalIncome[i] = this.totalIncome[i];
    }

    result = this.storeTotalIncome[i] ? ((this.formArray.controls[i].value.shareOfOwnership) / 100) * this.storeTotalIncome[i] : 0;
    this.totalIncome[i] = this.commaSeperator.currencySeparatorBD(Math.round(result));

    // set or patch value to Total Annual Rent - Deductions
    this.formArray.controls[i].patchValue({
      totalIncome: this.totalIncome[i]
    });

  }

  validateRepairDedAmount(i): boolean {
    //debugger;
    let repairCollection = parseInt(this.commaSeperator.removeComma(this.formArray.controls[i].value.repairDeductAmt, 0));
    let tmp_repairCollecAmt = parseInt(this.temp_repairCollecEtc[i]);
    if (repairCollection > tmp_repairCollecAmt) {
      this.formArray.controls[i].patchValue({
        repairDeductAmt: ''
      });
      this.toastr.warning('Value must be in between 0 to ' + this.commaSeperator.currencySeparatorBD(tmp_repairCollecAmt));
      return false;
    }
    else
      return true
  }

  sumDeductAmt(i,formControlName) {
    //debugger;
    let repairDeductAmt: any; let municipalDeductAmt: any; let landRevenueDeductAmt: any; let interestDeductAmt: any;
    let insuranceDeductAmt: any; let vacancyDeductAmt: any; let otherDeductAmt: any; let tmpTotalDeductAmt: any; let tmpTotalIncome: any;
    let tmpTotalAnnualAmt: any;

    this.validateRepairDedAmount(i);

    this.formArray.controls.forEach((element, index) => {
      if (index == i) {
        //debugger;
        // repairDeductAmt = this.commaSeperator.removeComma( this.repairDeductAmount[i],0) ? this.commaSeperator.removeComma( this.repairDeductAmount[i],0) : 0;
        repairDeductAmt = this.commaSeperator.removeComma(element.value.repairDeductAmt, 0);
        municipalDeductAmt = this.commaSeperator.removeComma(element.value.municipalDeductAmt, 0);
        landRevenueDeductAmt = this.commaSeperator.removeComma(element.value.landRevenueDeductAmt, 0);
        interestDeductAmt = this.commaSeperator.removeComma(element.value.interestDeductAmt, 0);
        insuranceDeductAmt = this.commaSeperator.removeComma(element.value.insuranceDeductAmt, 0);
        vacancyDeductAmt = this.commaSeperator.removeComma(element.value.vacancyDeductAmt, 0);
        otherDeductAmt = this.commaSeperator.removeComma(element.value.otherDeductAmt, 0);

        if(formControlName === 'repairDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            repairDeductAmt:  this.commaSeperator.currencySeparatorBD(repairDeductAmt),
          });
        }
        if(formControlName === 'municipalDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            municipalDeductAmt: this.commaSeperator.currencySeparatorBD(municipalDeductAmt) ,
          });
        }
        if(formControlName === 'landRevenueDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            landRevenueDeductAmt: this.commaSeperator.currencySeparatorBD(landRevenueDeductAmt),
          });
        }
        if(formControlName === 'interestDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            interestDeductAmt: this.commaSeperator.currencySeparatorBD(interestDeductAmt),
          });
        }
        if(formControlName === 'insuranceDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            insuranceDeductAmt: this.commaSeperator.currencySeparatorBD(insuranceDeductAmt),
          });
        }
        if(formControlName === 'vacancyDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            vacancyDeductAmt: this.commaSeperator.currencySeparatorBD(vacancyDeductAmt),
          });
        }
        if(formControlName === 'otherDeductAmt')
        {
          this.formArray.controls[i].patchValue({
            otherDeductAmt: this.commaSeperator.currencySeparatorBD(otherDeductAmt),
          });
        }
        // this.formArray.controls[i].patchValue({
        //   repairDeductAmt:  this.commaSeperator.currencySeparatorBD(repairDeductAmt),
        //   municipalDeductAmt: this.commaSeperator.currencySeparatorBD(municipalDeductAmt) ,
        //   landRevenueDeductAmt: this.commaSeperator.currencySeparatorBD(landRevenueDeductAmt),
        //   interestDeductAmt: this.commaSeperator.currencySeparatorBD(interestDeductAmt),
        //   insuranceDeductAmt: this.commaSeperator.currencySeparatorBD(insuranceDeductAmt),
        //   vacancyDeductAmt: this.commaSeperator.currencySeparatorBD(vacancyDeductAmt),
        //   otherDeductAmt: this.commaSeperator.currencySeparatorBD(otherDeductAmt),
        // });

      }
    });

    repairDeductAmt = (<HTMLInputElement>document.getElementById('repairDeductAmt' + i)).value;
    repairDeductAmt = this.commaSeperator.removeComma(repairDeductAmt, 0);
    repairDeductAmt = repairDeductAmt ? Math.round(repairDeductAmt) : 0;

    municipalDeductAmt = (<HTMLInputElement>document.getElementById('municipalDeductAmt' + i)).value;
    municipalDeductAmt = this.commaSeperator.removeComma(municipalDeductAmt, 0);
    municipalDeductAmt = municipalDeductAmt ? Math.round(municipalDeductAmt) : 0;

    landRevenueDeductAmt = (<HTMLInputElement>document.getElementById('landRevenueDeductAmt' + i)).value;
    landRevenueDeductAmt = this.commaSeperator.removeComma(landRevenueDeductAmt, 0);
    landRevenueDeductAmt = landRevenueDeductAmt ? Math.round(landRevenueDeductAmt) : 0;

    interestDeductAmt = (<HTMLInputElement>document.getElementById('interestDeductAmt' + i)).value;
    interestDeductAmt = this.commaSeperator.removeComma(interestDeductAmt, 0);
    interestDeductAmt = interestDeductAmt ? Math.round(interestDeductAmt) : 0;

    insuranceDeductAmt = (<HTMLInputElement>document.getElementById('insuranceDeductAmt' + i)).value;
    insuranceDeductAmt = this.commaSeperator.removeComma(insuranceDeductAmt, 0);
    insuranceDeductAmt = insuranceDeductAmt ? Math.round(insuranceDeductAmt) : 0;

    vacancyDeductAmt = (<HTMLInputElement>document.getElementById('vacancyDeductAmt' + i)).value;
    vacancyDeductAmt = this.commaSeperator.removeComma(vacancyDeductAmt, 0);
    vacancyDeductAmt = vacancyDeductAmt ? Math.round(vacancyDeductAmt) : 0;

    otherDeductAmt = (<HTMLInputElement>document.getElementById('otherDeductAmt' + i)).value;
    otherDeductAmt = this.commaSeperator.removeComma(otherDeductAmt, 0);
    otherDeductAmt = otherDeductAmt ? Math.round(otherDeductAmt) : 0;

    tmpTotalDeductAmt = repairDeductAmt + municipalDeductAmt + landRevenueDeductAmt + interestDeductAmt + insuranceDeductAmt + vacancyDeductAmt + otherDeductAmt;
    this.totalDeductAmt[i] = this.commaSeperator.currencySeparatorBD(tmpTotalDeductAmt);

    //console.log('total deduct amount', this.totalDeductAmt[i]);
    this.formArray.controls[i].patchValue({
      totalDeductAmt: this.totalDeductAmt[i]
    });


    tmpTotalAnnualAmt = this.commaSeperator.removeComma(this.totalAnnualRent[i], 0);

    if (tmpTotalAnnualAmt >= tmpTotalDeductAmt) {
      tmpTotalIncome = tmpTotalAnnualAmt - tmpTotalDeductAmt;
      this.storeTotalIncome[i] = tmpTotalIncome;
    }

    if (tmpTotalAnnualAmt < tmpTotalDeductAmt) {
      tmpTotalIncome = tmpTotalAnnualAmt - tmpTotalDeductAmt;
      this.storeTotalIncome[i] = tmpTotalIncome;
    }

    this.repairDeductAmount[i] = this.commaSeperator.currencySeparatorBD(repairDeductAmt);
    let result: any;
    result = this.storeTotalIncome[i] ? ((this.formArray.controls[i].value.shareOfOwnership) / 100) * this.storeTotalIncome[i] : 0;
    this.totalIncome[i] = this.commaSeperator.currencySeparatorBD(Math.round(result));

    // set or patch value to Total Annual Rent - Deductions
    this.formArray.controls[i].patchValue({
      totalIncome: this.totalIncome[i]
    });

    //console.log('print form controls',this.formArray.controls);
  }

  IsAnyCCTrue(event: any) {
    if (event.target.checked) {
      this.group.controls.IsAnyCC.setValue("1");
    }
    else {
      this.group.controls.IsAnyCC.setValue("0");
    }
  }
  IsAnyCCFalse(event: any) {
    if (event.target.checked) {
      this.group.controls.IsAnyCC.setValue("0");
    }
    else {
      this.group.controls.IsAnyCC.setValue("1");
    }
  }

  saveDraft() {
    this.isSaveDraft = true;
    this.submittedData();
  }

  validateHP(): any {
    // debugger;
    let successValidation: boolean = true;
    this.formArray.controls.forEach((element, index) => {
       this.initializeErrorIndexes(index);
        if(element.value.propertyAddress === '' || element.value.propertyAddress == null)
        {
          this.addressOfProperty_showError[index] = true;
          successValidation = false;
        }
        if((element.value.residentialAnnualRent == ''  || element.value.residentialAnnualRent == null)
        && (element.value.commertialAnnualRent == '' || element.value.commertialAnnualRent == null))
        {
          this.ResAnnualRent_showError[index] = true;
          this.commAnnualRent_showError[index] = true;
          this.repCollEtc_showError[index] = true;
          successValidation = false;
        }
       if(element.value.shareOfOwnership == ''  || element.value.shareOfOwnership == null)
        {
          this.shareOfOwnership_showError[index] = true;
          successValidation = false;
        }
        if(element.value.repairDeductAmt == ''  || element.value.repairDeductAmt == null)
        {
          this.repCollEtc_showError[index] = true;
          successValidation = false;
        }
    })

    if (!successValidation)
    return { "validate": false, "indexNo": this.funcSelectedFirstIndexError()};
   else
    return { "validate": true, "indexNo": "" };
  }

  funcSelectedFirstIndexError(): any 
  {
    let errorIndex: any; let isFoundErrorIndex: Boolean = false;
    this.formArray.controls.forEach((element, index) => {
      if (((element.value.propertyAddress === '' || element.value.propertyAddress == null) || ((element.value.residentialAnnualRent == ''  || element.value.residentialAnnualRent == null)
      && (element.value.commercialAmount == '' || element.value.commercialAmount == null)) || (element.value.shareOfOwnership == '' || element.value.shareOfOwnership == null) || (element.value.repairDeductAmt == '' || element.value.repairDeductAmt == null)) && !isFoundErrorIndex && 
      (this.addressOfProperty_showError[index] || this.ResAnnualRent_showError[index] || this.commAnnualRent_showError[index] || this.repCollEtc_showError[index] || this.shareOfOwnership_showError[index]))
      {
        errorIndex = index;
        isFoundErrorIndex = true;  
      }
    })
    return errorIndex;
  }

  submittedData() {
    let validateHP : any;
    validateHP = this.validateHP();
    if (!validateHP.validate) {
      this.toastr.warning('Please fill all the required fields!', '', {
        timeOut: 1000,
      });
      //console.log('visible form',validateHP.indexNo);
      this.isVisibleForm = validateHP.indexNo;
      return;
    }

    let requestData = [];
    let obj: any;
    let i = 0;
  
    //all other owners added
    let outerIndex = 0;
    this.values.forEach(elements => {
      this.allOtherOwner = '';
      this.values[outerIndex].forEach(element => {
        if (element.value != '' && element.value != null) this.allOtherOwner += element.value + ",";
      });
      this.allOtherOwner = this.allOtherOwner.slice(0, this.allOtherOwner.length - 1);

      this.formArray.controls.forEach((element, index) => {
        if (index == outerIndex && this.allOtherOwner != null) {
          this.formArray.controls[outerIndex].patchValue({
            nameOfOtherOwner: this.allOtherOwner ? this.allOtherOwner : '',
          });
        }
      });

      outerIndex = outerIndex + 1;
    })

    this.formArray.controls.forEach((element, index) => {
      obj = {
        "housePropertyType": 'Property ' + ++i,
        "housePropertyAddress": element.value.propertyAddress ? element.value.propertyAddress : '',
        "anyCC": element.value.IsAnyCC === "1" ? true : false,
        "residentialArea": element.value.residentialArea ? element.value.residentialArea : 0,
        "unitOfResidentialArea": element.value.unitOfResidentialArea ? element.value.unitOfResidentialArea : '',
        "residentialAnnualRent": element.value.residentialAnnualRent ? this.commaSeperator.removeComma(element.value.residentialAnnualRent, 0) : 0,
        "unitOfCommercialArea": element.value.unitOfCommercialArea ? element.value.unitOfCommercialArea : '',
        "commercialArea": element.value.commercialArea ? element.value.commercialArea : 0,
        "commercialAmount": element.value.commertialAnnualRent ? this.commaSeperator.removeComma(element.value.commertialAnnualRent, 0) : 0,
        "selfOccupiedArea": element.value.selfOccupiedArea ? element.value.selfOccupiedArea : 0,
        "totalArea": element.value.totalArea ? element.value.totalArea : 0,
        // "totalArea": Math.round(element.get('totalArea').value),
        "totalAnnualRent": element.value.totalAnnualRent ? this.commaSeperator.removeComma(element.value.totalAnnualRent, 0) : 0,
        "repairCollection": element.value.repairDeductAmt ? this.commaSeperator.removeComma(element.value.repairDeductAmt, 0) : 0,
        "municipalLocalTax": element.value.municipalDeductAmt ? this.commaSeperator.removeComma(element.value.municipalDeductAmt, 0) : 0,
        "landRevenue": element.value.landRevenueDeductAmt ? this.commaSeperator.removeComma(element.value.landRevenueDeductAmt, 0) : 0,
        "interestOnLoanMortgage": element.value.interestDeductAmt ? this.commaSeperator.removeComma(element.value.interestDeductAmt, 0) : 0,
        "insurancePremium": element.value.insuranceDeductAmt ? this.commaSeperator.removeComma(element.value.insuranceDeductAmt, 0) : 0,
        "vacancyAllowance": element.value.vacancyDeductAmt ? this.commaSeperator.removeComma(element.value.vacancyDeductAmt, 0) : 0,
        "other": element.value.otherDeductAmt ? this.commaSeperator.removeComma(element.value.otherDeductAmt, 0) : 0,
        "totalDeduction": element.value.totalDeductAmt ? this.commaSeperator.removeComma(element.value.totalDeductAmt, 0) : 0,
        "shareOfOwnership": element.value.shareOfOwnership ? parseFloat(element.value.shareOfOwnership) : 0,
        "otherOwnersName": element.value.nameOfOtherOwner ? element.value.nameOfOtherOwner : '',
        "finalTotal": element.value.totalIncome ? this.commaSeperator.removeComma(element.value.totalIncome, 0) : 0,
        "tinNo": this.userTin,
        "assessmentYear": "2021-2022",
      }
      requestData.push(obj);
    });
    // console.log('request data', requestData);
    let postResponse: any;
    this.apiService.post(this.serviceUrl + 'api/user-panel/save-house-property-data', requestData)
      .subscribe(result => {
        if (result.body.success && !this.isSaveDraft) {
          this.toastr.success('Data Saved Successfully', '', {
            timeOut: 1000,
          });
          this.headsOfIncome.forEach((Value, i) => {
            if (Value['link'] == '/user-panel/house-property') {
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
    //end
  }

  onBackPage() {
    this.headsOfIncome.forEach((Value, i) => {
      if (Value['link'] == '/user-panel/house-property') {
        if (i - 1 < 0) {
          this.router.navigate(["/user-panel/additional-information"]);
        }
        if (i - 1 >= 0) {
          this.router.navigate([this.headsOfIncome[i - 1]['link']]);
        }
      }
    });
  }

  //other owners removed
  values: any[][] = [];
  allOtherOwner: String;
  tempOtherOwners = [];
  removeOtherOwner(groupIndex: number, currentInputIndex: number) {
    this.allOtherOwner = '';
    this.values[groupIndex].splice(currentInputIndex, 1);

    this.values[groupIndex].forEach(element => {
      this.allOtherOwner += element.value + ",";
    });

    this.allOtherOwner = this.allOtherOwner.slice(0, this.allOtherOwner.length - 1);
    this.formArray.controls.forEach((element, index) => {
      if (index == groupIndex && this.allOtherOwner != null) {
        this.formArray.controls[groupIndex].patchValue({
          nameOfOtherOwner: this.allOtherOwner ? this.allOtherOwner : '',
        });
      }
    });

  }

  //other owner added
  addOtherOwners(groupIndex: number) {
    if (this.values[groupIndex] == null) {
      this.values[groupIndex] = [];
    }
    this.values[groupIndex].push({ value: "" });
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
       //     console.log(error['error'].errorMessage);
          });
    });
  }

}
