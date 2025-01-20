import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { truncate } from 'fs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  isReportCollapsed = true;

  isClickReturnRegister = false;
  isClickReturnSummary = false;
  isClickNonFilerTaxPayersNo = false;
  isClickNonFilerTaxPayersList = false;
  isClickTopIndividualTaxpayersByGrossWealthList = false;
  isClickTopIndividualTaxpayersByNetWealthList = false;
  isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
  isClickTopIndividualTaxpayersByTaxPaidList = false;
  isClickTopCompanyTaxpayersByTaxPaidList = false;
  isClickTopFemaleTaxpayersByTaxPaidList = false;
  isClickTopMaleTaxpayersByTaxPaidList = false;
  isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
  ) {

  }

  ngOnInit(): void {
    this.spinner.start();
    this.spinner.stop();
  }

  clickReturnRegister() {
    this.isClickReturnRegister = true;
    this.isClickReturnSummary = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickNonFilerTaxPayersList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickReturnSummary(){
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = true;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickNonFilerTaxPayersList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList =false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickNonFilerTaxPayersNo(){
    this.isClickNonFilerTaxPayersNo = true;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickNonFilerTaxPayersList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickNonFilerTaxPayersList(){
    this.isClickNonFilerTaxPayersList = true;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopIndividualTaxpayersByGrossWealthList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = true;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopIndividualTaxpayersByNetWealthList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = true;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopIndividualTaxpayersByGrossWealthLiabilityList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = true;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopIndividualTaxpayersByTaxPaidList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = true;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopCompanyTaxpayersByTaxPaidList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = true;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopFemaleTaxpayersByTaxPaidList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = true;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopMaleTaxpayersByTaxPaidList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = true;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = false;
  }

  clickTopSeniorCitizenTaxpayersByTaxPaidList(){
    this.isClickNonFilerTaxPayersList = false;
    this.isClickNonFilerTaxPayersNo = false;
    this.isClickReturnRegister = false;
    this.isClickReturnSummary = false;
    this.isClickTopIndividualTaxpayersByGrossWealthList = false;
    this.isClickTopIndividualTaxpayersByNetWealthList = false;
    this.isClickTopIndividualTaxpayersByGrossWealthLiabilityList = false;
    this.isClickTopIndividualTaxpayersByTaxPaidList = false;
    this.isClickTopCompanyTaxpayersByTaxPaidList = false;
    this.isClickTopFemaleTaxpayersByTaxPaidList = false;
    this.isClickTopMaleTaxpayersByTaxPaidList = false;
    this.isClickTopSeniorCitizenTaxpayersByTaxPaidList = true;
  }

}
