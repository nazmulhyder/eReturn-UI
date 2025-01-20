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
  selector: 'app-saving-certificate',
  templateUrl: './saving-certificate.component.html',
  styleUrls: ['./saving-certificate.component.scss']
})
export class SavingCertificateComponent implements OnInit {

  public savingCertificateForm: FormGroup;
  certificateTDSForm: FormGroup;
  certificateGetData: any;
  certificateConfirmCheck = [];

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  isHidden: boolean = true;
  winOrTinNo: any;

  savingCertificateGetDataLen = 0;

  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;
  securitiesTypeTooltip = `<span class="btn-block well-sm";">Select the security from which you received interest income.</span>`;
  regNoTooltip = `<span class="btn-block well-sm";">Enter the registration number of the security.</span>`;
  claimAmountTooltip = `<span class="btn-block well-sm";">Enter the amount of source tax that was deducted.</span>`;
  searchBtnTooltip = `<span class="btn-block well-sm";">Get info from the relevant office’s database.</span>`;
  resetBtnTooltip = `<span class="btn-block well-sm";">Use RESET button for another security or for a new entry.</span>`;

  certificateVerificationGetData: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    public commonUtilService: CommonUtilService) {
    this.savingCertificateForm = fb.group({
      // tin: ['', Validators.required],
      // assessmentYear: ['2021-2022', Validators.required],
      securitiesType: ['0', Validators.required],
      regNo: ['', Validators.required],
      // issueDate: ['', Validators.required],
      // section: ['0', Validators.required],
      // amount: ['', Validators.required],
      claimAmount: ['', Validators.required],
      // haveClaim:['2'],
    });

    this.certificateTDSForm = fb.group({
      assessmentYear: [''],
      securitiesType: [''],
      regNo: [''],
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

    //temporary comment
    // this.getCertificateData();

    //temporary added
    this.spinner.start();
    this.spinner.stop();
  }

  getCertificateData() {
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/saving_certificate/get_tds_by_tin_assessment_year/' + this.winOrTinNo + '/2021-2022')
      .subscribe(result => {
        // console.log('bankGetData:', result);
        if ((result.replyMessage).length > 0) {
          this.certificateGetData = result['replyMessage'];;
          this.savingCertificateGetDataLen = (result.replyMessage).length;
          console.log('saving_certificate_GetData:', this.certificateGetData);
        }
        else {
          this.savingCertificateGetDataLen = 0;
        }
        this.spinner.stop();
      },
        error => {
          this.spinner.stop();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

  }

  // getVerifyCertificateData(): Promise<void> {
  //   let requestData = {
  //     "tinNo": this.winOrTinNo,
  //     "assessmentYear": "2021-2022",
  //     "securityType": this.savingCertificateForm.value.securitiesType,
  //     "registrationNumber": this.savingCertificateForm.value.regNo,
  //   }
  //   this.spinner.start();
  //   return new Promise((resolve, reject) => {
  //     this.apiService.post(this.serviceUrl + 'api/verification/saving_certificate', requestData)
  //       .subscribe(result => {
  //         if (JSON.stringify(result.replyMessage) != '{}') {
  //           this.certificateVerificationGetData = result['replyMessage'];
  //           console.log('data', this.certificateVerificationGetData);
  //           this.patchCertificateData();
  //         }
  //         resolve();
  //         this.spinner.stop();
  //       },
  //         error => {
  //           reject();
  //           this.spinner.stop();
  //           console.log(error['error'].errorMessage);
  //           this.toastr.error(error['error'].errorMessage, '', {
  //             timeOut: 3000,
  //           });
  //         });
  //   });
  // }

  getVerifyCertificateData(event: any, searchModalShow): Promise<void> {
    this.spinner.start();
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/saving_certificate/search/nsd/tds/' + this.winOrTinNo + '/2021-2022/' + this.savingCertificateForm.value.regNo)
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {
            this.certificateVerificationGetData = result['replyMessage'];
            console.log('data', this.certificateVerificationGetData);
            this.patchCertificateData();
            this.search(event, searchModalShow);
          }
          resolve();
          this.spinner.stop();
        },
          error => {
            reject();
            this.spinner.stop();
            // this.checkCondition();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    });
  }

  patchCertificateData() {
    this.certificateTDSForm.get('assessmentYear').setValue('2021-2022');
    this.certificateTDSForm.get('securitiesType').setValue(this.savingCertificateForm.value.securitiesType);
    this.certificateTDSForm.get('regNo').setValue(this.certificateVerificationGetData['REGISTRATION']);
    this.certificateTDSForm.get('tdsAmount').setValue(this.commonUtilService.commaSeperator(this.certificateVerificationGetData['TAX_DEDUCTED_AT_SOURCE']));
    // this.savingCertificateForm.get('claimAmount').setValue(this.commonUtilService.commaSeperator(this.certificateVerificationGetData['TAX_DEDUCTED_AT_SOURCE']));
  }

  keyUpClaimAmt(event: any) {
    if (event.target.value > 880) {
      this.toastr.warning('Claim amount can not be greater than TDS on interest amount', '', {
        timeOut: 3000,
      });
      this.savingCertificateForm.patchValue({
        claimAmount: 0,
      })
    }
  }

  search(event: any, searchModalShow) {
    if (this.certificateVerificationGetData != "") {
      this.changeSearch(searchModalShow);
    }
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

  reset() {
    this.isHidden = true;
    this.savingCertificateForm.reset();
    this.savingCertificateForm.patchValue(
      {
        // section: '0',
        // assessmentYear: '2021-2022',
        securitiesType: '0'
      }
    )

  }

  onChangeSecuritiesType() {
    this.savingCertificateForm.patchValue({
      regNo: '',
    })
  }

  submittedData(event: any, searchModalShow) {
    // debugger;
    // this.getVerifyCertificateData(event, searchModalShow)
    //   .then(() => this.checkCondition());

    this.checkCondition();

  }

  checkCondition() {
    // debugger;
    if (this.certificateVerificationGetData == null || this.certificateVerificationGetData == undefined) {
      // var claimAmount = Number.parseInt(this.commonUtilService.commaRemover(this.savingCertificateForm.value.claimAmount));

      // if (claimAmount > Number.parseInt(this.commonUtilService.commaRemover(this.certificateTDSForm.get('tdsAmount').value))) {
      //   this.savingCertificateForm.patchValue(
      //     {
      //       claimAmount: 0,
      //     });
      //   this.toastr.warning("TDS Claim amount should be smaller than TDS on interest amount", '', {
      //     timeOut: 3000,
      //   });
      //   return;
      // }

      // else {
      //   this.postData();
      // }

      this.postData();
    }
    else {
      var claimAmount = Number.parseInt(this.commonUtilService.commaRemover(this.savingCertificateForm.value.claimAmount));

      if (claimAmount > Number.parseInt(this.commonUtilService.commaRemover(this.certificateTDSForm.get('tdsAmount').value))) {
        this.savingCertificateForm.patchValue(
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

  postData() {
    // debugger;
    let requestPostData = {
      "tinNo": this.winOrTinNo,
      "assessmentYear": "2021-2022",
      "securityType": this.savingCertificateForm.value.securitiesType,
      "registrationNo": this.savingCertificateForm.value.regNo,
      "tdsAvailable": this.certificateVerificationGetData ? this.certificateVerificationGetData['TAX_DEDUCTED_AT_SOURCE'] : 0,
      "tdsClaim": parseInt(this.commonUtilService.commaRemover(this.savingCertificateForm.value.claimAmount))
    }
    this.spinner.start();
    this.apiService.post(this.serviceUrl + 'api/saving_certificate/save_tds', requestPostData)
      .subscribe(result => {
        // console.log('getVerifyIbasData:', result);
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.toastr.success('Data saved successfully', '', {
            timeOut: 1000,
          });
          this.reset();
          this.getCertificateData();
        }
        this.spinner.stop();
      },
        error => {
          this.spinner.stop();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onDelete(id) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.spinner.start();
      this.apiService.delete(this.serviceUrl + 'api/saving_certificate/delete_tds_by_id/' + id)
        .subscribe(result => {
          this.toastr.success('Successfully deleted', '', {
            timeOut: 1000,
          });
          this.getCertificateData();
          this.spinner.stop();
        },
          error => {
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
  }

}
