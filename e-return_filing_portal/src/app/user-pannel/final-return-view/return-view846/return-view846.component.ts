import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommaSeparatorService } from '../../../service/comma-separator.service';

@Component({
  selector: 'app-return-view846',
  templateUrl: './return-view846.component.html',
  styleUrls: ['./return-view846.component.css']
})
export class ReturnView846Component implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  postRequestBody: any;
  getDataReqBody: any;
  userTin: any;
  taxPayerName: any;

  defaultTodaysDate = new Date();
  defaultDateInString: any;
  //default date
  mm1: any; mm2: any; dd1: any; dd2: any;
  yy1: any; yy2: any; yy3: any; yy4: any;

  //#region Assets

  businessDirectorArray = [];
  businessOtherArray = [];

  nonAgriPropertyArray = [];
  advanceNonAgriPropertyArray = [];

  agriPropertyArray = [];

  financialShareArray = [];
  financialSavingsArray = [];
  financialDepositsArray = [];
  financialLoansArray = [];
  financialOtherArray = [];

  motorCarArray = [];
  furnitureArray = [];
  jewelleryArray = [];
  otherAssetsArray = [];

  notesCurrenciesArray = [];
  //electronicCashArray = [];
  fundArray = [];
  outsideDepositsArray = [];

  //#endregion

  //#region liabilities

  liabilitiesBorrowArray = [];
  liabilitiesUnsecuredLoanArray = [];
  liabilitiesOtherArray = [];

  //#endregion

  //#region Other Outflow
  outflowLivingExpenseValue: any;
  outflowLossArray = [];
  outflowGiftArray = [];
  sourceFundIncomeValue: any;
  sourceFundTaxArray = [];
  sourceFundReceiptsArray = [];

  //#endregion

  //#region Previous Net Wealth

  PreviousIncomeYearNetWealth: any;

  //#endregion

  businessCapitalTotal: any;
  businessDirectorOtherTotal: any;
  businessDirectorTotal: any;

  nonAgriPropertyTotal: any;
  advanceMadeNonAgriPropertyTotal: any;
  agriPropertyTotal: any;

  shareDebenturesTotal: any;
  savingsCertificateTotal: any;
  financialDepositTotal: any;
  financialLoanTotal: any;
  financialOtherAssetsTotal: any;
  totalFinancialAssets: any;

  motorCarTotal: any;
  goldDiamondQtyTotal: any;
  goldDiamondTotal: any;
  furnitureTotal: any;
  otherAssetsTotal: any;

  notesCurrenciesTotal: any;
  //electronicCashTotal: any;
  providentFundTotal: any;
  otherDepositTotal: any;
  totalCashandFundoutsideBusiness: any;

  totalgrossWealth: any;

  borrowingFromBank: any;
  unsecuredLoan: any;
  otherLoans: any;
  totalLiabilities: any;

  totalNetWealth: any;

  totalChangeInNetWealth: any;

  loss_deduction_other_expense: any;
  gift_donation: any;
  totalOtherFundOutFlow: any;

  totalFundOutFlow: any;

  tax_exempted_income_and_allowances: any;
  other_receipts: any;
  totalSourcesOfFund: any;

  shortageOfFund: any;

  is_SCHEDULE25_Present: boolean = false;

  k: any;

  assessmentYear: any;
  staring_income_yr: any;
  ending_income_yr: any;
  //split assessment yr
  assYr1: any; assYr2: any; assYr3: any; assYr4: any;
  assYr5: any; assYr6: any;

  referenceNo: any;

  constructor(
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private commaSeparator: CommaSeparatorService,
    private toastr: ToastrService
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    // this.taxPayerName = localStorage.getItem('name');

    // console.log('todays date',this.defaultTodaysDate);
    this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd-MM-yyyy');
    // console.log('text date', this.defaultDateInString);

    this.getAssetsLiabilitiesData();
    // this.assessmentYear = localStorage.getItem('taxpayer_assess_year');
    // this.staring_income_yr =localStorage.getItem('income_year_start');
    // this.ending_income_yr = localStorage.getItem('income_year_end');
    // this.getStatementOnDate();
    // this.splitAssessmentYr();
    this.getTaxpayerBasicInfo();
  }
  getAssetsLiabilitiesData() {
    let getData: any;
    this.getDataReqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }

    this.apiService.get(this.serviceUrl + 'api/user-panel/get_alsummary')
      .subscribe(result => {
        if (result.replyMessage.alParticularsDtos.length > 0) {
          getData = result.replyMessage;
         // console.log('Get Data:', getData);
          if (getData != null) {
            getData.alParticularsDtos.forEach(element => {
              //#region Assets
              if (element.typeKey === 'assets') {
                //#region Business Capital
                if (element.firstSubTypeKey === 'business_capital') {
                  if (element.secondSubTypeKey === "director_shareholdings_in_limited_companies") {
                    if (element.secondSubTypeValue) this.is_SCHEDULE25_Present = true;

                    let businessDirectorArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        businessDirectorCompany: nesElement.name,
                        businessDirectorAcquisition: nesElement.type,
                        businessDirectorShares: nesElement.otherInfo,
                        businessDirectorValue: nesElement.value
                      }
                      businessDirectorArrayGet.push(obj);
                    });
                    this.businessDirectorArray = businessDirectorArrayGet;
                  }
                  if (element.secondSubTypeKey === "business_capital_other_than_director's_shareholdings_in_limited_companies") {
                    let businessOtherArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        businessOtherProfession: nesElement.name,
                        businessOtherCapital: nesElement.value
                      }
                      businessOtherArrayGet.push(obj);

                    });
                    this.businessOtherArray = businessOtherArrayGet;
                  }
                }
                //#endregion

                //#region Non Agriculture Property
                if (element.firstSubTypeKey === 'non_agricultural_property_parent') {
                  if (element.secondSubTypeKey === "non_agricultural_property_child") {

                    if (element.secondSubTypeValue) this.is_SCHEDULE25_Present = true;

                    let nonAgriPropertyArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        nonAgriPropertyUnit: nesElement.name,
                        nonAgriPropertyLocation: nesElement.description,
                        nonAgriPropertyAcquisition: nesElement.type,
                        nonAgriPropertyArea: nesElement.otherInfo,
                        nonAgriPropertyValueStart: nesElement.startYrAmount,
                        nonAgriPropertyValueEnd: nesElement.endYrAmount
                      }
                      nonAgriPropertyArrayGet.push(obj);
                      this.k = i + 1;
                    });
                    this.nonAgriPropertyArray = nonAgriPropertyArrayGet;
                    // console.log('number', this.k);
                  }
                  if (element.secondSubTypeKey === "advance_made_for_non_agricultural_property") {
                    let advanceNonAgriPropertyArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        advanceNonAgriPropertyLocation: nesElement.description,
                        advanceNonAgriPropertyAcquisition: nesElement.type,
                        advanceNonAgriPropertyValueStart: nesElement.startYrAmount,
                        advanceNonAgriPropertyValueEnd: nesElement.endYrAmount
                      }
                      advanceNonAgriPropertyArrayGet.push(obj);

                    });
                    this.advanceNonAgriPropertyArray = advanceNonAgriPropertyArrayGet;
                    // console.log('dd', this.advanceNonAgriPropertyArray);
                  }
                }
                //#endregion

                //#region Agriculture Property
                if (element.firstSubTypeKey === 'agricultural_property') {

                  if (element.firstSubTypeValue) this.is_SCHEDULE25_Present = true;

                  let agriPropertyArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      agriPropertyUnit: nesElement.name,
                      agriPropertyLocation: nesElement.description,
                      agriPropertyAcquisition: nesElement.type,
                      agriPropertyArea: nesElement.otherInfo,
                      agriPropertyValueStart: nesElement.startYrAmount,
                      agriPropertyValueEnd: nesElement.endYrAmount
                    }
                    agriPropertyArrayGet.push(obj);

                  });
                  this.agriPropertyArray = agriPropertyArrayGet;
                }
                //#endregion

                //#region Financial Assets
                if (element.firstSubTypeKey === 'financial_assets') {
                  if (element.secondSubTypeKey === "share_debenture_etc") {
                    let financialShareArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        financialShareBO: nesElement.relatedIN,
                        financialShareAcquisition: nesElement.type,
                        financialShareBrokerage: nesElement.name,
                        financialShareValue: nesElement.value
                      }
                      financialShareArrayGet.push(obj);
                    });
                    this.financialShareArray = financialShareArrayGet;
                  }
                  if (element.secondSubTypeKey === "savings_certificate_bonds_and_other_government_securities") {
                    let financialSavingsArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        financialSavingsIssueNo: nesElement.relatedIN,
                        financialSavingsSecurity: nesElement.type,
                        financialSavingsIssueDate: nesElement.dateOfIssue,
                        financialSavingsValue: nesElement.value
                      }
                      financialSavingsArrayGet.push(obj);

                    });
                    this.financialSavingsArray = financialSavingsArrayGet;
                  }
                  if (element.secondSubTypeKey === "fix_deposits_term_deposits_and_dps") {
                    let financialDepositsArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        financialDepositsAccount: nesElement.relatedIN,
                        financialDepositsAcquisition: nesElement.type,
                        financialDepositsBalance: nesElement.value,
                        financialDepositsBankName: nesElement.name,
                        financialDepositsParticulars: nesElement.description
                      }
                      financialDepositsArrayGet.push(obj);

                    });
                    this.financialDepositsArray = financialDepositsArrayGet;
                  }
                  if (element.secondSubTypeKey === "loans_given_to_others") {
                    let financialLoansArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        financialLoansBorrowerName: nesElement.name,
                        financialLoansParticulars: nesElement.description,
                        financialLoansAmount: nesElement.value,
                        financialLoansBorrowerTIN: nesElement.relatedIN
                      }
                      financialLoansArrayGet.push(obj);
                    });
                    this.financialLoansArray = financialLoansArrayGet;
                  }
                  if (element.secondSubTypeKey === "other_financial_assets") {
                    let financialOtherArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        financialOtherAcquisition: nesElement.type,
                        financialOtherParticulars: nesElement.description,
                        financialOtherAmount: nesElement.value,
                        financialOtherDetails: nesElement.otherInfo
                      }
                      financialOtherArrayGet.push(obj);
                    });
                    this.financialOtherArray = financialOtherArrayGet;
                  }
                }
                //#endregion

                //#region Motor Car
                if (element.firstSubTypeKey === 'motor_car') {

                  let motorCarArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      motorCarBrand: nesElement.description,
                      motorCarAcquisition: nesElement.type,
                      motorCarEngine: nesElement.otherInfo,
                      motorCarUnit: nesElement.name,
                      motorCarParticulars: nesElement.description,
                      motorCarAmount: nesElement.value,
                      motorCarRegistration: nesElement.relatedIN
                    }
                    motorCarArrayGet.push(obj);

                  });
                  this.motorCarArray = motorCarArrayGet;
                }
                //#endregion

                //#region Furniture
                if (element.firstSubTypeKey === 'furniture_equipments_and_electronic_items') {

                  let furnitureArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      FurnitureParticulars: nesElement.description,
                      FurnitureAcquisition: nesElement.type,
                      FurnitureQuantity: nesElement.otherInfo,
                      FurnitureValue: nesElement.value
                    }
                    furnitureArrayGet.push(obj);
                  });
                  this.furnitureArray = furnitureArrayGet;
                }
                //#endregion

                //#region Gold Diamond
                if (element.firstSubTypeKey === 'gold_diamond_gems_and_other_items') {

                  let jewelleryArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      jewelleryAcquisition: nesElement.type,
                      jewelleryValue: nesElement.value,
                      jewelleryParticulars: nesElement.description,
                      jewelleryUnit: nesElement.name,
                      jewelleryQuantityBegin: nesElement.startYrAmount,
                      jewelleryQuantityEnd: nesElement.endYrAmount
                    }
                    jewelleryArrayGet.push(obj);
                  });
                  this.jewelleryArray = jewelleryArrayGet;
                }
                //#endregion

                //#region Other Assets
                if (element.firstSubTypeKey === 'other_assets_of_significant_value') {

                  let otherAssetsArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      otherAssetsAcquisition: nesElement.type,
                      otherAssetsParticulars: nesElement.description,
                      otherAssetsValue: nesElement.value,
                      otherAssetsDetail: nesElement.otherInfo
                    }
                    otherAssetsArrayGet.push(obj);

                  });
                  this.otherAssetsArray = otherAssetsArrayGet;
                }
                //#endregion

                //#region Cash and Fund outside Business
                if (element.firstSubTypeKey === 'cash_and_fund_outside_business') {
                  if (element.secondSubTypeKey === "notes_and_currencies") {

                    let notesCurrenciesArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        notesCurrenciesName: nesElement.name,
                        notesCurrenciesAmount: nesElement.value
                      }
                      notesCurrenciesArrayGet.push(obj);

                    });
                    this.notesCurrenciesArray = notesCurrenciesArrayGet;
                  }
                  // if (element.secondSubTypeKey === "banks_cards_and_other_electronic_cash") {
                  //   let electronicCashArrayGet = [];
                  //   element.alDetailsDtos.forEach((nesElement, i) => {
                  //     let obj = {
                  //       electronicCashFIName: nesElement.name,
                  //       electronicCashFI: nesElement.type,
                  //       electronicCashBalance: nesElement.value,
                  //       electronicCashAmount: nesElement.relatedIN,
                  //     }
                  //     electronicCashArrayGet.push(obj);
                  //   });
                  //   this.electronicCashArray = electronicCashArrayGet;
                  // }
                  if (element.secondSubTypeKey === "provident_fund_and_other_fund") {
                    let fundArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        fundParticulars: nesElement.description,
                        fundBalance: nesElement.value,
                        fundAccount: nesElement.relatedIN,
                      }
                      fundArrayGet.push(obj);
                    });
                    this.fundArray = fundArrayGet;
                  }
                  if (element.secondSubTypeKey === "other_deposits_balance_and_advance") {
                    let outsideDepositsArrayGet = [];
                    element.alDetailsDtos.forEach((nesElement, i) => {
                      let obj = {
                        outsideDepositsParticulars: nesElement.description,
                        outsideDepositsBalance: nesElement.value
                      }
                      outsideDepositsArrayGet.push(obj);

                    });
                    this.outsideDepositsArray = outsideDepositsArrayGet;
                  }
                }
                //#endregion
              }
              //#endregion

              //#region liabilities
              if (element.typeKey === 'liabilities') {
                //#region borrowing_from_bank_or_other_fi
                if (element.firstSubTypeKey === 'borrowing_from_bank_or_other_fi') {

                  let liabilitiesBorrowArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      liabilitiesBorrowBankName: nesElement.name,
                      liabilitiesBorrowPurpose: nesElement.description,
                      liabilitiesBorrowBalance: nesElement.value,
                      liabilitiesBorrowAccount: nesElement.relatedIN
                    }
                    liabilitiesBorrowArrayGet.push(obj);

                  });
                  this.liabilitiesBorrowArray = liabilitiesBorrowArrayGet;
                }
                //#endregion

                //#region unsecured_loan
                if (element.firstSubTypeKey === 'unsecured_loan') {

                  let liabilitiesUnsecuredLoanArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      liabilitiesUnsecuredLoanName: nesElement.name,
                      liabilitiesUnsecuredLoanPurpose: nesElement.description,
                      liabilitiesUnsecuredLoanBalance: nesElement.value,
                      liabilitiesUnsecuredLoanTIN: nesElement.relatedIN
                    }
                    liabilitiesUnsecuredLoanArrayGet.push(obj);

                  });
                  this.liabilitiesUnsecuredLoanArray = liabilitiesUnsecuredLoanArrayGet;
                }
                //#endregion

                //#region Other Loan or Overdraft
                if (element.firstSubTypeKey === 'other_loan_or_overdraft') {

                  let liabilitiesOtherArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      liabilitiesOtherLoan: nesElement.type,
                      liabilitiesOtherParticulars: nesElement.description,
                      liabilitiesOtherBalance: nesElement.value,
                      liabilitiesOtherDetail: nesElement.otherInfo
                    }
                    liabilitiesOtherArrayGet.push(obj);

                  });
                  this.liabilitiesOtherArray = liabilitiesOtherArrayGet;
                }
                //#endregion
              }
              //#endregion

              //#region Other Outflow
              if (element.typeKey === '0ther_outflow') {

                //#region annual_living_expense
                if (element.firstSubTypeKey === 'annual_living_expense') {

                  element.alDetailsDtos.forEach((nesElement, i) => {
                    this.outflowLivingExpenseValue = nesElement.value;
                  });
                }
                //#endregion

                //#region loss_deduction_other_expense
                if (element.firstSubTypeKey === 'loss_deduction_other_expense') {

                  let outflowLossArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      outflowLossLocation: nesElement.name,
                      outflowLossArea: nesElement.value
                    }
                    outflowLossArrayGet.push(obj);
                  });
                  this.outflowLossArray = outflowLossArrayGet;
                }
                //#endregion

                //#region gift_donation_and_contribution
                if (element.firstSubTypeKey === 'gift_donation_and_contribution') {
                  let outflowGiftArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      outflowGiftName: nesElement.name,
                      outflowGiftParticulars: nesElement.description,
                      outflowGiftAmount: nesElement.value,
                      outflowGiftTIN: nesElement.relatedIN
                    }
                    outflowGiftArrayGet.push(obj);
                  });
                  this.outflowGiftArray = outflowGiftArrayGet;
                }
                //#endregion
              }
              //#endregion

              //#region sources of fund
              if (element.typeKey === 'sources_of_fund') {
                //#region income_shown_in_the_return
                if (element.firstSubTypeKey === 'income_shown_in_the_return') {
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    this.sourceFundIncomeValue = nesElement.value;
                  });
                }
                //#endregion

                //#region loss_deduction_other_expense
                if (element.firstSubTypeKey === 'tax_exempted_income_and_allowances') {

                  let sourceFundTaxArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      sourceFundTaxParticulars: nesElement.description,
                      sourceFundTaxAmount: nesElement.value,
                      sourceFundTaxReference: nesElement.relatedIN
                    }
                    sourceFundTaxArrayGet.push(obj);

                  });
                  this.sourceFundTaxArray = sourceFundTaxArrayGet;
                }
                //#endregion

                //#region other_receipts
                if (element.firstSubTypeKey === 'other_receipts') {

                  let sourceFundReceiptsArrayGet = [];
                  element.alDetailsDtos.forEach((nesElement, i) => {
                    let obj = {
                      sourceFundReceiptsParticulars: nesElement.description,
                      sourceFundReceiptsAmount: nesElement.value,
                      sourceFundReceiptsReference: nesElement.relatedIN
                    }
                    sourceFundReceiptsArrayGet.push(obj);

                  });
                  this.sourceFundReceiptsArray = sourceFundReceiptsArrayGet;
                }
                //#endregion

              }
              //#endregion

              //#region Previous Net Wealth
              if (element.typeKey === 'previous_net_wealth') {
                //#region income_shown_in_the_return
                if (element.firstSubTypeKey === 'previous_income_year_net_wealth') {

                  element.alDetailsDtos.forEach((nesElement, i) => {
                    this.PreviousIncomeYearNetWealth = nesElement.value;
                  });
                }
                //#endregion
              }
              //#endregion

            });
          }

          this.calBusinessDirectorOther();
          this.calBusinessDirector();
          this.calBusinessCapital();

          this.calNonAgriProperty();
          this.calAdvanceMadeNonAgriProperty();

          this.calAgriProperty();

          this.calShareDebentures();
          this.calSavingsCertificate();
          this.calFinancialDeposit();
          this.calFinancialLoan();
          this.calFinancialOtherAssets();
          this.calTotalFinancialAssets();

          this.calMotorCar();
          this.calGoldDiamond();
          this.calFurniture();
          this.calOtherAssets();

          this.calNotesCurrencies();
          // this.calElectronicCash();
          this.calProvidentfund();
          this.calOtherDeposit();
          this.calCashandFundoutsideBusiness();

          this.calGrossWealth();

          this.calBorrowingFromBank();
          this.calUnsecuredLoan();
          this.calOtherLoan();
          this.calLiabilitiesOutsideBusiness();

          this.calNetWealth();

          this.calChangeInNetWealth();

          this.calLossDeductionExpense();
          this.calGiftDonation();
          this.calTotalOtherOutFlow();

          this.calTotalFundOutFlow();

          this.calTaxExemptedIncome();
          this.calOtherReceipts();
          this.calTotalSourcesOfFund();

          this.calShortageOfFund();
        }
      },
        error => {
        //  console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  calBusinessDirectorOther() {
    this.businessDirectorOtherTotal = 0;
    this.businessOtherArray.forEach(element => {
      this.businessDirectorOtherTotal = this.businessDirectorOtherTotal + element.businessOtherCapital;
    });
  }

  calBusinessDirector() {
    this.businessDirectorTotal = 0;
    this.businessDirectorArray.forEach(element => {
      this.businessDirectorTotal = this.businessDirectorTotal + element.businessDirectorValue;
    });
  }

  calBusinessCapital() {
    this.businessCapitalTotal = 0;
    this.businessCapitalTotal = (this.businessDirectorOtherTotal + this.businessDirectorTotal);
  }

  calNonAgriProperty() {
    this.nonAgriPropertyTotal = 0;
    this.nonAgriPropertyArray.forEach(element => {
      this.nonAgriPropertyTotal = this.nonAgriPropertyTotal + element.nonAgriPropertyValueEnd;
    });
  }

  calAdvanceMadeNonAgriProperty() {
    this.advanceMadeNonAgriPropertyTotal = 0;
    this.advanceNonAgriPropertyArray.forEach(element => {
      this.advanceMadeNonAgriPropertyTotal = this.advanceMadeNonAgriPropertyTotal + element.advanceNonAgriPropertyValueEnd;
    });
  }

  calAgriProperty() {
    this.agriPropertyTotal = 0;
    this.agriPropertyArray.forEach(element => {
      this.agriPropertyTotal = this.agriPropertyTotal + element.agriPropertyValueEnd;
    });
  }

  calShareDebentures() {
    this.shareDebenturesTotal = 0;
    this.financialShareArray.forEach(element => {
      this.shareDebenturesTotal = this.shareDebenturesTotal + element.financialShareValue;
    });
  }

  calSavingsCertificate() {
    this.savingsCertificateTotal = 0;
    this.financialSavingsArray.forEach(element => {
      this.savingsCertificateTotal = this.savingsCertificateTotal + element.financialSavingsValue;
    });
  }

  calFinancialDeposit() {
    this.financialDepositTotal = 0;
    this.financialDepositsArray.forEach(element => {
      this.financialDepositTotal = this.financialDepositTotal + element.financialDepositsBalance;
    });
  }

  calFinancialLoan() {
    this.financialLoanTotal = 0;
    this.financialLoansArray.forEach(element => {
      this.financialLoanTotal = this.financialLoanTotal + element.financialLoansAmount;
    });
  }

  calFinancialOtherAssets() {
    this.financialOtherAssetsTotal = 0;
    this.financialOtherArray.forEach(element => {
      this.financialOtherAssetsTotal = this.financialOtherAssetsTotal + element.financialOtherAmount;
    });
  }

  calTotalFinancialAssets() {
    this.totalFinancialAssets = 0;
    this.totalFinancialAssets = (this.shareDebenturesTotal + this.savingsCertificateTotal +
      this.financialDepositTotal + this.financialLoanTotal + this.financialOtherAssetsTotal);
  }

  calMotorCar() {
    this.motorCarTotal = 0;
    this.motorCarArray.forEach(element => {
      this.motorCarTotal = this.motorCarTotal + element.motorCarAmount;
    });
  }
  calGoldDiamond() {
    this.goldDiamondQtyTotal = 0;
    this.goldDiamondTotal = 0;
    this.jewelleryArray.forEach(element => {
      this.goldDiamondQtyTotal = this.goldDiamondQtyTotal + element.jewelleryQuantityEnd;
      this.goldDiamondTotal = this.goldDiamondTotal + element.jewelleryValue;
    });
  }

  calFurniture() {
    this.furnitureTotal = 0;
    this.furnitureArray.forEach(element => {
      this.furnitureTotal = this.furnitureTotal + element.FurnitureValue;
    });
  }

  calOtherAssets() {
    this.otherAssetsTotal = 0;
    this.otherAssetsArray.forEach(element => {
      this.otherAssetsTotal = this.otherAssetsTotal + element.otherAssetsValue;
    });
  }

  calNotesCurrencies() {
    this.notesCurrenciesTotal = 0;
    this.notesCurrenciesArray.forEach(element => {
      this.notesCurrenciesTotal = this.notesCurrenciesTotal + element.notesCurrenciesAmount;
    });
  }

  // calElectronicCash() {
  //   this.electronicCashTotal = 0;
  //   this.electronicCashArray.forEach(element => {
  //     this.electronicCashTotal = this.electronicCashTotal + element.electronicCashBalance;
  //   });
  // }

  calProvidentfund() {
    this.providentFundTotal = 0;
    this.fundArray.forEach(element => {
      this.providentFundTotal = this.providentFundTotal + element.fundBalance;
    });
  }

  calOtherDeposit() {
    this.otherDepositTotal = 0;
    this.outsideDepositsArray.forEach(element => {
      this.otherDepositTotal = this.otherDepositTotal + element.outsideDepositsBalance;
    });
  }

  calCashandFundoutsideBusiness() {
    this.totalCashandFundoutsideBusiness = 0;
    this.totalCashandFundoutsideBusiness = (this.providentFundTotal + this.otherDepositTotal + this.notesCurrenciesTotal);
  }

  calGrossWealth() {
    this.totalgrossWealth = 0;
    this.totalgrossWealth = (this.businessCapitalTotal + this.nonAgriPropertyTotal + this.advanceMadeNonAgriPropertyTotal
      + this.agriPropertyTotal + this.totalFinancialAssets + this.motorCarTotal + this.goldDiamondTotal
      + this.furnitureTotal + this.otherAssetsTotal + this.totalCashandFundoutsideBusiness);
  }

  calBorrowingFromBank() {
    this.borrowingFromBank = 0;
    this.liabilitiesBorrowArray.forEach(element => {
      this.borrowingFromBank = this.borrowingFromBank + element.liabilitiesBorrowBalance;
    });
  }

  calUnsecuredLoan() {
    this.unsecuredLoan = 0;
    this.liabilitiesUnsecuredLoanArray.forEach(element => {
      this.unsecuredLoan = this.unsecuredLoan + element.liabilitiesUnsecuredLoanBalance;
    });
  }

  calOtherLoan() {
    this.otherLoans = 0;
    this.liabilitiesOtherArray.forEach(element => {
      this.otherLoans = this.otherLoans + element.liabilitiesOtherBalance;
    });
  }

  calLiabilitiesOutsideBusiness() {
    this.totalLiabilities = 0;
    this.totalLiabilities = (this.borrowingFromBank + this.unsecuredLoan + this.otherLoans);
  }

  calNetWealth() {
    this.totalNetWealth = 0;
    this.totalNetWealth = (this.totalgrossWealth - this.totalLiabilities);
  }

  calChangeInNetWealth() {
    this.totalChangeInNetWealth = 0;
    this.totalChangeInNetWealth = (this.totalNetWealth - this.PreviousIncomeYearNetWealth);
  }

  calLossDeductionExpense() {
    this.loss_deduction_other_expense = 0;
    this.outflowLossArray.forEach(element => {
      this.loss_deduction_other_expense = this.loss_deduction_other_expense + element.outflowLossArea;
    });
  }

  calGiftDonation() {
    this.gift_donation = 0;
    this.outflowGiftArray.forEach(element => {
      this.gift_donation = this.gift_donation + element.outflowGiftAmount;
    });
  }

  calTotalOtherOutFlow() {
    this.totalOtherFundOutFlow = 0;
    this.totalOtherFundOutFlow = (this.outflowLivingExpenseValue + this.loss_deduction_other_expense
      + this.gift_donation);
  }

  calTotalFundOutFlow() {
    this.totalFundOutFlow = 0;
    this.totalFundOutFlow = (this.totalChangeInNetWealth + this.totalOtherFundOutFlow);
  }

  calTaxExemptedIncome() {
    this.tax_exempted_income_and_allowances = 0;
    this.sourceFundTaxArray.forEach(element => {
      this.tax_exempted_income_and_allowances = this.tax_exempted_income_and_allowances + element.sourceFundTaxAmount;
    });
  }

  calOtherReceipts() {
    this.other_receipts = 0;
    this.sourceFundReceiptsArray.forEach(element => {
      this.other_receipts = this.other_receipts + element.sourceFundReceiptsAmount;
    });
  }

  calTotalSourcesOfFund() {
    this.totalSourcesOfFund = 0;
    this.totalSourcesOfFund = (this.sourceFundIncomeValue + this.tax_exempted_income_and_allowances + this.other_receipts);
  }

  calShortageOfFund() {
    this.shortageOfFund = 0;
    this.shortageOfFund = (this.totalSourcesOfFund - this.totalFundOutFlow);
  }

  addComma(input: any): any {
    return this.commaSeparator.currencySeparatorBD(input);
  }

  getTaxpayerBasicInfo() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.assessmentYear = result.replyMessage.assessmentYear;
          this.taxPayerName = result.replyMessage.assesName;
          this.ending_income_yr = result.replyMessage.endOfIncomeYr;
          this.referenceNo = result.replyMessage.referenceNo;
          this.splitAssessmentYr();
          this.getStatementOnDate();
        }
      })

  }

  splitAssessmentYr() {
    this.assYr1 = this.assessmentYear.substring(0, 1);
    this.assYr2 = this.assessmentYear.substring(1, 2);
    this.assYr3 = this.assessmentYear.substring(2, 3);
    this.assYr4 = this.assessmentYear.substring(3, 4);
    this.assYr5 = this.assessmentYear.substring(7, 8);
    this.assYr6 = this.assessmentYear.substring(8, 9);
  }
  getStatementOnDate() {
    //day
    this.dd1 = this.ending_income_yr.substring(0, 1);
    this.dd2 = this.ending_income_yr.substring(1, 2);
    //month
    this.mm1 = this.ending_income_yr.substring(3, 4);
    this.mm2 = this.ending_income_yr.substring(4, 5);
    //year
    this.yy1 = this.ending_income_yr.substring(6, 7);
    this.yy2 = this.ending_income_yr.substring(7, 8);
    this.yy3 = this.ending_income_yr.substring(8, 9);
    this.yy4 = this.ending_income_yr.substring(9, 10);
  }

}
