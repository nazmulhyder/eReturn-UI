import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommonUtilService } from '../../../custom-services/utils/common.utils';

@Component({
  selector: 'app-regular-tax',
  templateUrl: './regular-tax.component.html',
  styleUrls: ['./regular-tax.component.scss']
})
export class RegularTaxComponent implements OnInit {

  advanceTaxEntryForm: FormGroup;
  searchForm: FormGroup;
  selectedType: string = "0";
  selectedTypeName: string;

  winOrTinNo: any;
  advanceTaxGetData: any;
  zones: any;
  circles: any;
  selectedZoneName: string;
  selectedCircleName: string;
  banks: any;

  private serviceUrl: string;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;
  typeTooltip = `<span class="btn-block well-sm";">Select the instrument through which regular tax under section 74 was paid.</span>`;
  taxesZoneTooltip = `<span class="btn-block well-sm";">Select the tax zone relevant to the circle.</span>`;
  taxesCircleTooltip = `<span class="btn-block well-sm";">Select the circle in which favor the regular tax under section 74 was paid.</span>`;
  resetBtnTooltip = `<span class="btn-block well-sm";">Use RESET button for a regular tax under section 74 or for a new entry.</span>`;

  constructor(private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public spinner: NgxUiLoaderService,
    public apiService: ApiService,
    public apiUrl: ApiUrl,
    private datepipe: DatePipe,
    public commonUtilService: CommonUtilService
  ) {

    this.advanceTaxEntryForm = fb.group({
      challanNo: [''],
      depositType: ['0', Validators.required],
      taxesZone: ['0'],
      taxesCircle: ['0'],
      challanDate: [''],
      paymentType: ['CASH'],
      amount: ['', Validators.required],
      bank: ['0', Validators.required],
      branch: ['0', Validators.required],
      poNo: [null],
      chequeNo: [null],
      assessmentYear: ['2021-2022'],
      aitType: ['US_74']
    });

    this.searchForm = fb.group({
      no: ['6543-232-5677'],
      date: ['13-07-2021'],
      amount: ['1000', Validators.required],
      challanNo: ['546546465423'],
      bank: ['Sonali Bank', Validators.required],
      branch: ['Dhaka', Validators.required],
      taxesZone: ['06, Dhaka'],
      taxesCircle: ['Circle-124, Salary']
    });

  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });

    this.winOrTinNo = localStorage.getItem('winOrTinNo');

    // temporary comment
    // this.getAdvanceSourceTaxData();
    // this.getZones();
    // this.getBankList();

    //temporary added
    this.spinner.start();
    this.spinner.stop();

  }

  getZones() {

    this.spinner.start();

    this.apiService.get(this.serviceUrl + 'api/zones')
      .subscribe(result => {

        this.zones = result;
        this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

  onZoneChange(event: any) {

    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.selectedZoneName = selectedOptions[selectedIndex].text;

    if (this.advanceTaxEntryForm.value.taxesZone == "0") {
      this.circles = [];
      return;
    }

    this.spinner.start();

    this.apiService.get(this.serviceUrl + 'api/circles/' + this.advanceTaxEntryForm.value.taxesZone)
      .subscribe(result => {

        this.advanceTaxEntryForm.get('taxesCircle').setValue("0");
        this.circles = result;
        this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });
  }

  onCircleChange(event: any) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.selectedCircleName = selectedOptions[selectedIndex].text;
  }

  onTypeChange(event: any) {

    this.selectedType = event.target.value;
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.selectedTypeName = selectedOptions[selectedIndex].text;

    this.patchOnTypeChange();
    // this.advanceTaxEntryForm.get("depositType").setValue(this.selectedType);

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    // if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57))
    {
      return false;
    }
    return true;
  }

  onValueChange(event: any) {
    event.target.value = CommonUtilService.commaSeperator(event.target.value);
  }

  getAdvanceSourceTaxData() {

    this.spinner.start();

    this.apiService.get(this.serviceUrl + 'api/ait/US64-US74/' + this.winOrTinNo + "/" + this.advanceTaxEntryForm.value.assessmentYear + "/" +
      this.advanceTaxEntryForm.value.aitType)
      .subscribe(result => {

        this.advanceTaxGetData = result;
        this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

  getBankList() {

    this.spinner.start();

    this.apiService.get(this.serviceUrl + 'api/banks')
      .subscribe(result => {

        this.banks = result;
        this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

  commaSeperator(value: number): string {

    let valueStr: string = value.toString();
    let finalStr: string = "";
    let length = valueStr.length;

    if (length > 3) {

      finalStr = "," + (valueStr[length - 3] + valueStr[length - 2] + valueStr[length - 1]) + finalStr;
      length -= 3; console.log(finalStr); console.log(length);

      while (length > 2) {

        finalStr = "," + (valueStr[length - 2] + valueStr[length - 1]) + finalStr;
        length -= 2;

      } console.log(finalStr); console.log(length);

      length--;

      while (length >= 0) {

        finalStr = valueStr[length] + finalStr;
        length -= 1;

      } console.log(finalStr); console.log(length);


      return finalStr;

    }
    else {
      return valueStr;
    }

  }

  commaRemover(value: string): string {
    return value.replaceAll(",", '');
  }

  check(event: any) {
    this.searchForm.get("challanNo").setValue(this.randomNumberGenerator(111111111, 999999999));
    this.searchForm.get("amount").setValue(this.commaSeperator(this.randomNumberGenerator(1000, 15000)));
  }

  randomNumberGenerator(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + 0);
  }

  search(event: any, searchModalShow) {

    this.spinner.start();

    this.searchForm.get("no").setValue(this.advanceTaxEntryForm.value.poNo == null || this.advanceTaxEntryForm.value.poNo == '' ?
      this.advanceTaxEntryForm.value.chequeNo : this.advanceTaxEntryForm.value.poNo);
    // this.searchForm.get("challanNo").setValue(this.randomNumberGenerator(111111111, 999999999));
    this.searchForm.get("date").setValue(this.datepipe.transform(this.advanceTaxEntryForm.value.challanDate, 'dd-MM-yyyy'));
    this.searchForm.get("bank").setValue(this.advanceTaxEntryForm.value.bank);

    this.spinner.stop();

    this.changeSearch(searchModalShow);

  }

  changeSearch(searchModalShow: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(searchModalShow,{class: 'modal-lg'});
    this.modalRef = this.modalService.show(searchModalShow, this.config);
  }

  close_Search() {
    this.modalRef.hide();
  }

  reset() {

    this.advanceTaxEntryForm.reset();
    //this.searchForm.reset();
    this.selectedType = "0";
    this.circles = [];
    this.advanceTaxEntryForm.patchValue(
      {
        // section: '0',
        depositType: '0',
        assessmentYear: '2021-2022',
        bank: '0',
        branch: '0',
        taxesZone: ['0'],
        taxesCircle: ['0'],
        paymentType: 'CASH',
        aitType: 'US_74'
      }
    )

  }

  patchOnTypeChange() {

    this.advanceTaxEntryForm.reset();
    //this.searchForm.reset();

    this.advanceTaxEntryForm.patchValue(
      {
        // section: '0',
        depositType: this.selectedType,
        assessmentYear: '2021-2022',
        challanNo: '',
        challanDate: '',
        amount: '',
        poNo: '',
        chequeNo: '',
        bank: '0',
        branch: '0',
        taxesZone: ['0'],
        taxesCircle: ['0'],
        paymentType: 'CASH',
        aitType: 'US_74'
      }
    );

  }

  submittedData() {

    let obj = {
      "tin": this.winOrTinNo,
      "assessmentYr": this.advanceTaxEntryForm.value.assessmentYear,
      "aitType": this.advanceTaxEntryForm.value.aitType,
      "depositType": this.advanceTaxEntryForm.value.depositType,
      "depositedTaxZone": this.selectedZoneName,
      "depositedTaxCircle": this.selectedCircleName,
      "challanDate": this.datepipe.transform(this.advanceTaxEntryForm.value.challanDate, 'dd-MM-yyyy'),
      "challanNo": this.advanceTaxEntryForm.value.challanNo,
      "payOrderNo": this.advanceTaxEntryForm.value.poNo,
      "chequeNo": this.advanceTaxEntryForm.value.chequeNo,
      "paymentType": this.advanceTaxEntryForm.value.paymentType,
      "bank": this.advanceTaxEntryForm.value.bank,
      "branch": this.advanceTaxEntryForm.value.branch,
      "challanAmount": CommonUtilService.commaRemover(this.advanceTaxEntryForm.value.amount),
      "verificationStatus": 'PENDING'
    };

    this.spinner.start();

    this.apiService.post(this.serviceUrl + 'api/ait/US64-US74', obj)
      .subscribe(result => {

        this.advanceTaxGetData.push(obj);
        this.reset();

        this.spinner.stop();

        this.toastr.success(result.message, '', {
          timeOut: 1000
        });

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

  submittedOtherData() {

    let payOrderNo: string;
    let chequeNo: string;

    this.selectedType == "PAY_ORDER" ? payOrderNo = this.searchForm.value.no : chequeNo = this.searchForm.value.no;

    let obj = {
      "tin": this.winOrTinNo,
      "assessmentYr": this.advanceTaxEntryForm.value.assessmentYear,
      "aitType": this.advanceTaxEntryForm.value.aitType,
      "depositType": this.advanceTaxEntryForm.value.depositType,
      "depositedTaxZone": this.searchForm.value.taxesZone,
      "depositedTaxCircle": this.searchForm.value.taxesCircle,
      "challanDate": this.datepipe.transform(this.advanceTaxEntryForm.value.challanDate, 'dd-MM-yyyy'),
      "challanNo": this.searchForm.value.challanNo,
      "payOrderNo": payOrderNo,
      "chequeNo": chequeNo,
      "paymentType": this.advanceTaxEntryForm.value.paymentType,
      "bank": this.searchForm.value.bank,
      "branch": this.searchForm.value.branch,
      "challanAmount": CommonUtilService.commaRemover(this.searchForm.value.amount),
      "verificationStatus": 'VERIFIED'
    };

    this.spinner.start();

    this.apiService.post(this.serviceUrl + 'api/ait/US64-US74', obj)
      .subscribe(result => {

        this.advanceTaxGetData.push(obj);
        this.reset();

        this.close_Search();

        this.spinner.stop();

        this.toastr.success(result.message, '', {
          timeOut: 1000
        });

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

}
