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
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  public bankForm: FormGroup;
  bankTDSForm: FormGroup;
  winOrTinNo: any;
  bankgetData: any;
  bankGetDataLen = 0;
  bankListChk = [];
  banks: any;

  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;
  bankNameTooltip = `<span class="btn-block well-sm";">Enter the name of the bank or any other financial institution that deducted source tax on your interest/profit.</span>`;
  accNoTooltip = `<span class="btn-block well-sm";">Enter the account number against which source tax was deducted.</span>`;
  claimAmountTooltip = `<span class="btn-block well-sm";">Enter the amount of source tax that was deducted.</span>`;
  searchBtnTooltip = `<span class="btn-block well-sm";">Get info from your bank.</span>`;
  resetBtnTooltip = `<span class="btn-block well-sm";">Use RESET button for another account or for a new entry.</span>`;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  isHidden: boolean = false;
  bankVerificationGetData: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    public commonUtilService: CommonUtilService) {
    this.bankForm = fb.group({
      // assessmentYear: ['2021-2022', Validators.required],
      accNo: ['', Validators.required],
      // accType: ['0', Validators.required],
      bankName: ['0', Validators.required],
      // amount: ['', Validators.required],
      // hadClaim : ['0', Validators.required],
      claimAmount: ['', Validators.required],

    });

    this.bankTDSForm = fb.group({
      assessmentYear: [''],
      accNo: [''],
      accName: [''],
      bankName: [''],
      branchName: [''],
      tdsAmount: [''],
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
    this.bankGetDataLen = 0;

    //temporary comment
    // this.loadBankList();
    // this.getBankList();

    //temporary added
    this.spinner.start();
    this.spinner.stop();
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

  loadBankList(): Promise<void> {
    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/bank/get_tds_by_tin/' + this.winOrTinNo)
        .subscribe(result => {
          // console.log('bankGetData:', result);
          if ((result.replyMessage).length > 0) {
            this.bankgetData = result['replyMessage'];;
            this.bankGetDataLen = (result.replyMessage).length;
            console.log('bankGetData:', this.bankgetData);
          }
          resolve();
          this.spinner.stop();
        },
          error => {
            reject();
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });
  }

  getVerifyBankData(): Promise<void> {
    let requestData = {
      "tinNo": this.winOrTinNo,
      "assessmentYear": "2021-2022",
      "accountNumber": this.bankForm.value.accNo,
      "bankName": this.bankForm.value.bankName,
    }
    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.post(this.serviceUrl + 'api/verification/bank', requestData)
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {
            this.bankVerificationGetData = result['replyMessage'];
            console.log('data', this.bankVerificationGetData);
            this.patchBankData();
          }
          resolve();
          this.spinner.stop();
        },
          error => {
            reject();
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });
  }

  patchBankData() {
    this.bankTDSForm.get('assessmentYear').setValue('2021-2022');
    this.bankTDSForm.get('accNo').setValue(this.bankVerificationGetData['accountNo']);
    this.bankTDSForm.get('accName').setValue(this.bankVerificationGetData['accountName']);
    this.bankTDSForm.get('bankName').setValue(this.bankVerificationGetData['bankName']);
    this.bankTDSForm.get('branchName').setValue(this.bankVerificationGetData['branchName']);
    this.bankTDSForm.get('tdsAmount').setValue(this.commonUtilService.commaSeperator(this.bankVerificationGetData['tds']));
  }

  reset() {
    this.bankForm.reset();
    this.bankForm.patchValue(
      {
        // amount : "",
        accNo: "",
        claimAmount: "",
        bankName: '0',
        // accType: '0',
        // assessmentYear: '2021-2022'
      }
    )
  }

  noClaim() {
    this.bankForm.patchValue(
      {
        claimAmount: "",
      });
  }

  search(event: any, searchModalShow) {
    this.changeSearch(searchModalShow);
  }

  changeSearch(searchModalShow: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(searchModalShow,{class: 'modal-lg'});
    this.modalRef = this.modalService.show(searchModalShow, this.config);
  }

  close_Search() {
    this.modalRef.hide();
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
    event.target.value = this.commonUtilService.commaSeperator(event.target.value);
  }

  TaxVerification(i) {
    this.bankListChk[i] = true;
    this.bankGetDataLen = this.bankgetData.length;
    this.toastr.success('Confirmed!', '', {
      timeOut: 1000,
    });
  }

  getAmount() {
    this.bankForm.patchValue(
      {
        amount: Math.floor(Math.random() * 999) + 100,
      });
  }

  submittedData() {
    this.getVerifyBankData()
      .then(() => this.checkCondition());
  }

  checkCondition() {
    if (this.bankVerificationGetData == null) {
      var claimAmount = Number.parseInt(this.commonUtilService.commaRemover(this.bankForm.value.claimAmount));
      if (claimAmount > Number.parseInt(this.commonUtilService.commaRemover(this.bankTDSForm.get('tdsAmount').value))) {
        this.bankForm.patchValue(
          {
            claimAmount: 0,
          });
        this.toastr.warning("TDS Claim amount should be smaller than TDS on interest amount", '', {
          timeOut: 3000,
        });
        return;
      }

      else {
        this.postData();
      }
    }
    else {
      var claimAmount = Number.parseInt(this.commonUtilService.commaRemover(this.bankForm.value.claimAmount));

      if (claimAmount > Number.parseInt(this.commonUtilService.commaRemover(this.bankTDSForm.get('tdsAmount').value))) {
        this.bankForm.patchValue(
          {
            claimAmount: 0,
          });
        this.toastr.warning("TDS Claim amount should be smaller than TDS on interest amount", '', {
          timeOut: 3000,
        });
        return;
      }

      else {
        this.postData();
      }
    }
  }

  postData(): Promise<void> {
    let requestPostData = {
      "tinNo": this.winOrTinNo,
      "assessmentYear": "2021-2022",
      "accountNo": this.bankVerificationGetData['accountNo'],
      "accountName": this.bankVerificationGetData['accountName'],
      "bankName": this.bankVerificationGetData['bankName'],
      "bankBranch": this.bankVerificationGetData['branchName'],
      "tdsAvailable": this.bankVerificationGetData['tds'],
      "tdsClaim": this.commonUtilService.commaRemover(this.bankForm.value.claimAmount)
    }
    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.post(this.serviceUrl + 'api/bank/save_tds', requestPostData)
        .subscribe(result => {
          // console.log('getVerifyIbasData:', result);
          if (JSON.stringify(result.replyMessage) != '{}') {
            this.toastr.success('Data saved successfully', '', {
              timeOut: 1000,
            });
            this.reset();
            this.loadBankList();
          }
          this.spinner.stop();
          resolve();
        },
          error => {
            reject();
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });
  }

}
