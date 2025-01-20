import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";
import { mainNavbarListService } from "../../service/main-navbar.service";
import { TaxpayerProfileDetailsService } from "../taxpayer-profile-details.service";

@Component({
  selector: "app-return-view",
  templateUrl: "./return-view.component.html",
  styleUrls: ["./return-view.component.css"],
})
export class ReturnViewComponent implements OnInit {
  checkIsLoggedIn: any;
  selectedNavbar = [];
  mainNavActive = {};

  userTin: any;
  requestNavbarGetData: any;
  additionalInformationForm: FormGroup;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  findTIN: string = "243149308855";
  taxpayerProfileDetail: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private taxpayerProfiledetailService: TaxpayerProfileDetailsService,
    private mainNavbarList: mainNavbarListService
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
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.taxpayerProfileDetail = this.taxpayerProfiledetailService.taxpayerDetailList.find(
      (x) => x.tin == this.findTIN
    );
    this.getMainNavbar();
    this.mainNavActiveSelect('7');
    //#region Page On Relaod
    this.loadAll_navbar_on_Page_reload();
    //#endregion
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
        }

        // this.mainNavbarList.addSelectedMainNavbar(this.additionalInformationForm.value);
        this.mainNavbarList.addSelectedMainNavbarOnPageReload(this.additionalInformationForm.value, 'Return View');
        this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
        // console.log('@@@@@@@@@@',this.selectedNavbar);
      })

  }

  getMainNavbar() {
    this.selectedNavbar = this.mainNavbarList.getMainNavbarList();
  }
}
