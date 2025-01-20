import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { TimeExtensionService } from '../service/time-extension.service';

@Component({
  selector: 'app-time-extension',
  templateUrl: './time-extension.component.html',
  styleUrls: ['./time-extension.component.css']
})
export class TimeExtensionComponent implements OnInit {

  html: any = `<span class="btn-block well-sm ">No Tooltip Found!</span>`;
  TE_Zone : any = `<span class="btn-block well-sm ">This is your tax zone according to TIN registration data.</span>`;
  TE_Circle : any = `<span class="btn-block well-sm ">This is your tax circle according to TIN registration data.</span>`;
  TE_Upto : any = `<span class="btn-block well-sm ">Select your requested extension date by clicking the calendar icon at the right of the input field.</span>`;
  TE_Reason : any = `<span class="btn-block well-sm ">Briefly mention a good reason why you need time extension.</span>`;



  timeExtensionForm = new FormGroup({
    dateOfTimeExtension: new FormControl("", Validators.required),
    timeExtensionRemarks: new FormControl("", Validators.required),
    taxZone : new FormControl(),
    taxCircle : new FormControl(),
    // countExtensionDays: new FormControl(),
  });

  minDateOfTimeExtension = new Date;
  maxTimeExtensionLimit: any;
  dateofExtensionStart:any;

  getAllTimeExtensionDetails : any;
  timeExtensionDetails  = [];

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin:any;
  tableLen:any = 0;
  availableForRequest : boolean = true;
  timeExtensionTrackingNumber : any;
  taxpayerFirstApprovalSuccess : boolean = false;

  isShow: boolean = true;
 
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };


  timeExtenstion_SD : any;
  timeExtenstion_ED : any;


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private datepipe : DatePipe,
    private timeExtensionService : TimeExtensionService,
    private modalService: BsModalService,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.userTin = localStorage.getItem('tin');
    this.checkSubmissionStatus();
    this.getTaxpayerZoneCircleInfo();
    this.getDateRange();
    this.generateTimeExtensionDate();
    this.getTimeExtensionDetails();

    //console.log('table len',this.tableLen);

  }

  checkSubmissionStatus(): Promise<void> {
    this.spinner.start();
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(this.serviceUrl + 'api/get_submission')
        .subscribe(result => {
          if (result.replyMessage != null) {
            this.spinner.stop();
            if ((result.replyMessage).returnSubmissionType == "ONLINE") {
              this.isShow = false;
              this.toastr.error('You already submitted your return in online.', '', {
                timeOut: 3000,
              });
            } else if ((result.replyMessage).returnSubmissionType == "OFFLINE") {
              // this.toastr.error('You already prepared your offline (paper) return.', '', {
              //   timeOut: 3000,
              // });
              this.isShow = true;
            }
            resolve();
          }
          else {
            this.spinner.stop();
            this.isShow = true;
            resolve();
          }
        },
          error => {
            reject();
            this.spinner.stop();
           // console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });
    });
  }

  getDateRange()
  {
    let reqParam = {
      "tinNo" : this.userTin,
      "assessmentYear": "2021-2022"
    }
    this.apiService.get(this.serviceUrl + 'api/get-list-req-time-extn-details')
    .subscribe(result => {
        this.timeExtenstion_SD = result.START_DATE ? result.START_DATE : null;
        this.timeExtenstion_ED = result.END_DATE ? result.END_DATE : null;
    },
    error => {
      //console.log(error['error'].errorMessage);
      this.toastr.error(error['error'].message,'',{
        timeOut: 1000,
      });
    });
  }

  getTimeExtensionDetails()
  {
    let reqParam = {
      "tinNo" : this.userTin,
      "assessmentYear": "2021-2022"
    }
    this.apiService.get(this.serviceUrl + 'api/get-list-req-time-extn-details')
      .subscribe(result => {
        this.timeExtensionDetails = result.replyMessage;
        //console.log('time extension data',this.timeExtensionDetails);
        this.tableLen = this.timeExtensionDetails.length;
        if(this.timeExtensionDetails.length>0)
        {
          this.timeExtensionDetails.forEach(element => {
               if(element.timeExtnStatus == 'Rejected' || element.timeExtnStatus == 'Approved')
               {
                 this.availableForRequest = true;
                 
               }
               else
               {
                 this.availableForRequest = false;
               }
          });
        }
        else{
          this.availableForRequest = true;
        }

      })
  }

  getTaxpayerZoneCircleInfo(){
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/zone-circle-info')
      .subscribe(result => {
        if (result != null) {
           //console.log(result);
          this.timeExtensionForm.patchValue(
            {
              taxZone: result.zoneName ? result.zoneName : '',
              taxCircle : result.circleName ? result.circleName : '',
            }
          )
        }
      })
  }

  generateTimeExtensionDate()
  {
    this.dateofExtensionStart = moment(new Date, 'DD-MM-YYYY');
    this.dateofExtensionStart = this.datepipe.transform(this.dateofExtensionStart, 'dd-MM-yyyy');
    this.dateofExtensionStart = new Date(this.dateofExtensionStart.substring(6, 12),0,3);
    //console.log('time extension start date ',this.dateofExtensionStart);
    // var timeExtensionEnd :any = new Date(this.dateofExtensionStart.setMonth(this.dateofExtensionStart.getMonth()+6));
    var getYear = this.dateofExtensionStart.getFullYear();
    this.maxTimeExtensionLimit = new Date(getYear,1,28);
    //console.log('first time approval request upto',this.maxTimeExtensionLimit);
    // if(this.taxpayerFirstApprovalSuccess)
    // {
    //   this.maxTimeExtensionLimit = new Date(getYear+1,2,31);
    //  //console.log('2nd time approval request ',this.maxTimeExtensionLimit);
    // }
  }

  setupDateOfAlienation(value: Date) {
    if(value!=null)
    {
      var diff = Math.abs(value.getTime() - this.dateofExtensionStart.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      this.timeExtensionForm.patchValue({
        countExtensionDays : (diffDays+1)
      })
      //console.log(diffDays+' days');
    }
  }
  timeExtensionPreview(ExtensionTrackingNumber,timeExtensionAppDate)
  {
    // debugger;
      this.timeExtensionService.extensionTrackingNumber = ExtensionTrackingNumber;
      this.timeExtensionService.dateOfTimeExtension = timeExtensionAppDate;
      this.router.navigate(["/user-panel/time-extension-print-view"]);
  }

  timeExtensionReceiptPreview(ExtensionTrackingNumber,timeExtensionAppDate)
  {
    // debugger;
      this.timeExtensionService.extensionTrackingNumber = ExtensionTrackingNumber;
      this.timeExtensionService.dateOfTimeExtension = timeExtensionAppDate;
      this.router.navigate(["/user-panel/time-extension-receipt"]);
  }

  timeExtensionSubmit(isConfirmTE: TemplateRef<any>)
  {
    this.modalRef = this.modalService.show(isConfirmTE, this.config);
  }

  submit_TE() {
    if(!this.availableForRequest){
      this.modalRef.hide();
      this.toastr.warning('You already have a pending request!');
      return;
    }
    let todaysDate = this.datepipe.transform(Date(), 'dd MMMM yyyy');
    let extensionDate = moment(this.timeExtensionForm.value.dateOfTimeExtension, 'DD-MM-YYYY');
    let requestObj = {
      "tinNo" : this.userTin,
      "assessmentYear" : "2021-2022",
      // "reqForExtension" : this.timeExtensionForm.value.countExtensionDays,
      "dateOfExtension" : extensionDate ? this.datepipe.transform(extensionDate, 'dd-MM-yyyy') : '',
      "remarks" : this.timeExtensionForm.value.timeExtensionRemarks,
    }

    this.apiService.post(this.serviceUrl + 'api/save-time-extension-data', requestObj)
    .subscribe(result => {
		  //console.log('time extension success', result);
      if(result.success){
        this.getTimeExtensionDetails();
        this.toastr.success('Request Submitted Successfully', '', {
          timeOut: 1000,
        });
        // this.timeExtensionForm.reset();
        this.timeExtensionForm.patchValue(
          {
            dateOfTimeExtension: '',
             timeExtensionRemarks: '',
          }
        )
      }
    },
      error => {
        //console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage,'',{
          timeOut: 3000,
        });
      });

      this.modalRef.hide();
  }

  unchange_TE() {
    this.modalRef.hide();
  }

  dateInputValidate() : boolean
  {
       return false;
  }

}
