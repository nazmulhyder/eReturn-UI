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
  selector: 'app-tds-on-salary',
  templateUrl: './tds-on-salary.component.html',
  styleUrls: ['./tds-on-salary.component.scss']
})
export class TdsOnSalaryComponent implements OnInit {

  public salaryTdsForm: FormGroup;
  ibasTDSForm: FormGroup;

  winOrTinNo: any;

  iBasGetData: any;
  iBasVerificationGetData: any;
  // iBasDataConfirmation=[];

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  isListSectionHidden: boolean = true;

  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;
  tdsClaimTooltip = `<span class="btn-block well-sm";">Enter the amount of source tax you paid through IBAS++ salary bill.</span>`;
  searchBtnTooltip = `<span class="btn-block well-sm";">Get info from IBAS++</span>`;
  resetBtnTooltip = `<span class="btn-block well-sm";">Use RESET button for another source or for a new entry.</span>`;

  constructor(private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    public commonUtilService: CommonUtilService) {
    this.salaryTdsForm = fb.group({
      id: [''],
      claimAmount: ['', Validators.required],
    });

    this.ibasTDSForm = fb.group({
      assessmentYear: [''],
      incomeYear: [''],
      employerName: [''],
      designation: [''],
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
    this.iBasVerificationGetData = "";
    this.spinner.start();
    this.getIbasData();
    this.spinner.stop();
  }

  search(event: any, searchModalShow) {
    // debugger;
    if (this.salaryTdsForm.value.id) {
      this.getVerifyIbasData(searchModalShow);
    } else {
      if (this.iBasVerificationGetData != "") {
        this.patchIbasData();
        this.changeSearch(searchModalShow);
      } else {
        this.getVerifyIbasData(searchModalShow);
      }
    }
  }

  changeSearch(searchModalShow: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(searchModalShow,{class: 'modal-lg'});
    this.modalRef = this.modalService.show(searchModalShow, this.config);
  }

  close_Search() {
    this.modalRef.hide();
  }

  getIbasData() {
    this.apiService.get(this.serviceUrl + 'api/ibass/get_tds_by_tin_assessment_year')
      .subscribe(result => {
        // console.log('ibasGetData:', result);
        if ((result.replyMessage).length > 0) {
          this.isListSectionHidden = false;
          this.iBasGetData = result['replyMessage'];
          // console.log('ibasGetData:', this.iBasGetData);
        }
        else {
          this.isListSectionHidden = true;
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  getVerifyIbasData(searchModalShow): Promise<void> {
    this.spinner.start();
    return new Promise((resolve, reject) => {

      let requestData = {
        "tinNo": this.winOrTinNo,
      }


      //previous

      // this.apiService.post(this.serviceUrl + 'api/verification/ibass', requestData)

      //new
      this.apiService.get(this.serviceUrl + 'api/ibass/search/salary/tds')
        .subscribe(result => {
          // console.log('getVerifyIbasData:', result);
          if (JSON.stringify(result.replyMessage) != '{}') {
            this.iBasVerificationGetData = result['replyMessage'];
            // console.log('getVerifyIbasData:', this.iBasVerificationGetData);
            this.patchIbasData();
            this.changeSearch(searchModalShow);
            resolve();
            this.spinner.stop();
          }
          else {
            resolve();
            this.spinner.stop();
          }
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

  patchIbasData() {
    this.ibasTDSForm.get('assessmentYear').setValue(this.iBasVerificationGetData['ASSESSMENT_YEAR']);
    this.ibasTDSForm.get('incomeYear').setValue(this.iBasVerificationGetData['INCOME_YEAR']);
    this.ibasTDSForm.get('employerName').setValue(this.iBasVerificationGetData['IS_OFC_NAME']);
    this.ibasTDSForm.get('designation').setValue(this.iBasVerificationGetData['IS_EMP_DESIGNATION']);
    this.ibasTDSForm.get('tdsAmount').setValue(this.commonUtilService.commaSeperator(this.iBasVerificationGetData['IBASS_SALARY_TDS']));
    // this.salaryTdsForm.get('claimAmount').setValue(this.commonUtilService.commaSeperator(this.iBasVerificationGetData['IBASS_SALARY_TDS']));
  }

  patchGetData() {
    this.salaryTdsForm.get('id').setValue(this.iBasVerificationGetData['id']);
    this.salaryTdsForm.get('claimAmount').setValue(this.commonUtilService.commaSeperator(this.iBasVerificationGetData['tdsClaim']));
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

  keyUpClaimAmt(event: any) {

    let claimAmt = this.commonUtilService.commaRemover(event.target.value);

    if (this.iBasVerificationGetData != "") {
      if (Number.parseInt(claimAmt) > this.iBasVerificationGetData['IBASS_SALARY_TDS']) {
        this.toastr.warning('Provided Claim Amount is greater than your actual TDS!', '', {
          timeOut: 3000,
        });
        this.salaryTdsForm.patchValue({
          claimAmount: 0,
        })
      }
    }

    event.target.value = this.commonUtilService.commaSeperator(event.target.value);
  }

  ibasConfirmation(i) {
    //  this.iBasGetData.splice(i,1);
    this.toastr.success('Confirmed!', '', {
      timeOut: 2000,
    });
    // this.iBasDataConfirmation[i]=true;
  }

  reset() {
    this.salaryTdsForm.reset();
    this.salaryTdsForm.patchValue(
      {
        id: ''
      }
    )

  }

  submittedData() {

    if (this.salaryTdsForm.value.id) {
      this.submittedEditData();
    }

    else {
      let requestPostData = {
        "tinNo": this.winOrTinNo,
        "assessmentYear": "2021-2022",
        "office": this.iBasVerificationGetData['IS_OFC_NAME'] ? this.iBasVerificationGetData['IS_OFC_NAME'] : "",
        "designation": this.iBasVerificationGetData['IS_EMP_DESIGNATION'] ? this.iBasVerificationGetData['IS_EMP_DESIGNATION'] : "",
        "tdsAvailable": this.iBasVerificationGetData['IBASS_SALARY_TDS'] ? this.iBasVerificationGetData['IBASS_SALARY_TDS'] : 0,
        "tdsClaim": this.commonUtilService.commaRemover(this.salaryTdsForm.value.claimAmount)
      }

      this.spinner.start();
      this.apiService.post(this.serviceUrl + 'api/ibass/save_tds', requestPostData)
        .subscribe(result => {
          // console.log('getVerifyIbasData:', result);
          if (JSON.stringify(result.replyMessage) != '{}') {
            this.toastr.success('Data saved successfully', '', {
              timeOut: 1000,
            });
            this.reset();
            this.iBasVerificationGetData = "";
            this.getIbasData();
          }
          this.spinner.stop();
        },
          error => {
            this.spinner.stop();
            this.salaryTdsForm.reset();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }

  }

  submittedEditData() {

    let requestPostData = {
      "tinNo": this.winOrTinNo,
      "assessmentYear": "2021-2022",
      "office": this.iBasVerificationGetData['office'] ? this.iBasVerificationGetData['office'] : "",
      "designation": this.iBasVerificationGetData['designation'] ? this.iBasVerificationGetData['designation'] : "",
      "tdsAvailable": this.iBasVerificationGetData['tdsAvailable'] ? this.iBasVerificationGetData['tdsAvailable'] : 0,
      "tdsClaim": this.commonUtilService.commaRemover(this.salaryTdsForm.value.claimAmount)
    }

    this.spinner.start();
    this.apiService.put(this.serviceUrl + 'api/ibass/update_tds', requestPostData)
      .subscribe(result => {
        // console.log('getVerifyIbasData:', result);
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.toastr.success('Data updated successfully', '', {
            timeOut: 1000,
          });
          this.reset();
          this.iBasVerificationGetData = "";
          this.getIbasData();
        }
        this.spinner.stop();
      },
        error => {
          this.spinner.stop();
          this.salaryTdsForm.reset();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

  }

  onDelete(id) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.spinner.start();
      this.apiService.delete(this.serviceUrl + 'api/ibass/delete_tds_by_id/' + id)
        .subscribe(result => {
          this.toastr.success('Successfully deleted', '', {
            timeOut: 1000,
          });
          this.getIbasData();
          this.reset();
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

  onEdit(id) {
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/ibass/get_tds_by_id/' + id)
      .subscribe(result => {
        // console.log('rerr', result);
        this.iBasVerificationGetData = "";
        this.iBasVerificationGetData = result['replyMessage'];
        this.patchGetData();
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
