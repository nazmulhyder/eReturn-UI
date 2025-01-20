import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommonUtilService } from '../../../custom-services/utils/common.utils';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {

  public othersEntryForm: FormGroup;

  othersGetData: any;
  winOrTinNo: any;
  othersgetData: any;
  othersGetDataLen = 0;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  sectionTooltip = `<span class="btn-block well-sm";">Select the section from the dropdown list under which source tax was paid by you.</span>`;
  officeTooltip = `<span class="btn-block well-sm";">Enter the name of withholding office.</span>`;
  challanTooltip = `<span class="btn-block well-sm";">Enter the number of challan by which your source tax  was deposited to the Government.</span>`;
  challanDateTooltip = `<span class="btn-block well-sm";">Enter the date of the challan.</span>`;
  referenceTooltip = `<span class="btn-block well-sm";">Enter the reference number (if any) of the certificate or other documents issued by the withholding office in respect of the source tax paid.</span>`;
  amountTooltip = `<span class="btn-block well-sm";">Enter the amount of source tax relevant to this entry. </span>`;
  resetBtnTooltip = `<span class="btn-block well-sm";">Use RESET button for another source or for a new entry.</span>`;

  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe: DatePipe,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    public commonUtilService: CommonUtilService) {
    this.othersEntryForm = fb.group({
      // assessmentYear: ['2021-2022', Validators.required],
      section: ['0', Validators.required],
      office: ['', Validators.required],
      challanNo: ['', Validators.required],
      date: ['', Validators.required],
      amount: ['', Validators.required],
      referenceNo: ['', Validators.required],
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
    this.othersGetDataLen = 0;

    //temporary comment
    // this.getOthersData();

    //temporary added
    //temporary added
    this.spinner.start();
    this.spinner.stop();
  }

  getOthersData() {
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/other/get_tds_by_tin/' + this.winOrTinNo)
      .subscribe(result => {
        // console.log('bankGetData:', result);
        if ((result.replyMessage).length > 0) {
          this.othersgetData = result['replyMessage'];
          this.othersGetDataLen = (result.replyMessage).length;
          console.log('othersGetData:', this.othersgetData);
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

  reset() {
    this.othersEntryForm.reset();
    this.othersEntryForm.patchValue(
      {
        section: '0',
        // assessmentYear:'2021-2022',
        // bank: '0',
        // branch: '0',
      }
    )
    //#region navigate current url without reloading
    // let currentUrl = this.router.url;
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([currentUrl]);
    // });
    //#endregion
  }

  submittedData() {
    let challanDatee: any;
    challanDatee = this.othersEntryForm.value.date ? moment(this.othersEntryForm.value.date, 'DD-MM-YYYY') : '';
    let requestPostData = {
      "tinNo": this.winOrTinNo,
      "assessmentYear": "2021-2022",
      "section": this.othersEntryForm.value.section,
      "office": this.othersEntryForm.value.office,
      "challanNo": this.othersEntryForm.value.challanNo,
      "challanDate": challanDatee ? this.datepipe.transform(challanDatee, 'dd-MM-yyyy') : '',
      "referenceNo": this.othersEntryForm.value.referenceNo,
      "tdsClaim": this.commonUtilService.commaRemover(this.othersEntryForm.value.amount),
      "verificationStatus": 'Pending'
    }

    this.spinner.start();
    this.apiService.post(this.serviceUrl + 'api/other/save_tds', requestPostData)
      .subscribe(result => {
        // console.log('getVerifyIbasData:', result);
        if (JSON.stringify(result.replyMessage) != '{}') {
          this.toastr.success('Data saved successfully', '', {
            timeOut: 1000,
          });
          this.reset();
          this.getOthersData();
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

}
