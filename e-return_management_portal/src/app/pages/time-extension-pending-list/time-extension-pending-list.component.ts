import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-time-extension-pending-list',
  templateUrl: './time-extension-pending-list.component.html',
  styleUrls: ['./time-extension-pending-list.component.scss']
})
export class TimeExtensionPendingListComponent implements OnInit {

  timeExtensionListForm: FormGroup;

  extensionApproveForm: FormGroup;
  extendedExtensionApproveForm: FormGroup;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  timeExtensionGetData: any;
  timeExtensionExtendedGetData: any;
  timeExtensionVerify = [];

  isExtendedShow: boolean = false;
  isCircleOfficer: boolean = false;
  isForwardShow: boolean = false;

  private serviceUrl: string;
  maxApprovedDate: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private modalService: BsModalService,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private datepipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.timeExtensionListForm = fb.group({
    });
    this.extensionApproveForm = fb.group({
      ticket_no: [''],
      tinNo: [''],
      remarks: [''],
      requestedUpto: [''],
      approvedUpto: ['']
    });
    this.extendedExtensionApproveForm = fb.group({
      extId: [''],
      extTinNo: [''],
      extRequestedUpto: [''],
      extApprovedUpto: ['']
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.maxApprovedDate = new Date(2022, 0, 31);

    this.getTimeExtensionData();
    if (localStorage.getItem('userRoles') == "CIRCLE_INSPECTOR") {
      this.isExtendedShow = false;
    }
    else if (localStorage.getItem('userRoles') == "CIRCLE_OFFICER") {
      this.isExtendedShow = true;
      this.isForwardShow = true;
    }
    else if (localStorage.getItem('userRoles') == "RANGE_OFFICER") {
      this.isExtendedShow = true;
      this.isForwardShow = false;
      this.isCircleOfficer = true;
    }
    this.spinner.stop();
  }

  getTimeExtensionData() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/time-extension/dct/pending-list')
      .subscribe(result => {
        // console.log('response', result);
        this.timeExtensionGetData = "";
        this.timeExtensionGetData = result.replyMessage;
      },
        error => {
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
    this.timeExtensionExtendedGetData = [
      {
        "assessmentYear": '2021-2022',
        "tin": "196890847278",
        "taxpayerName": "Md. Khademul Islam Chowdhury",
        "trackingNumber": 'E-196890847278-0-0-20',
        "extensionUpto": '01-02-2022',
        "reason": 'Covid-19 Impact on Business'
      },
      {
        "assessmentYear": '2021-2022',
        "tin": "654345424977",
        "taxpayerName": "Md. Sazidur Rahman",
        "trackingNumber": 'E-654345424977-0-0-20',
        "extensionUpto": '20-02-2022',
        "reason": 'Covid-19 Impact on Business'
      },
    ]
  }


  timeExtensionConfirmation(approved_upto, ticket_no) {

    const regularExpression = /^\d{2}-\d{2}-\d{4}$/;
    // console.log(regularExpression.test(String(approved_upto).toLowerCase()));
    if (regularExpression.test(String(approved_upto).toLowerCase())) {

    } else {
      approved_upto = this.datepipe.transform(approved_upto, 'dd-MM-yyyy');
    }

    this.spinner.start();
    let reqBody = {
      "TICKET_NO": ticket_no,
      "EXTN_APV_DATE": approved_upto
    }

    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/time-extension/dct/approve-request', reqBody)
      .subscribe(result => {
        // console.log('response', result);
        this.toastr.success("Approved!", '', {
          timeOut: 2000,
        });
        this.getTimeExtensionData();
        this.modalRef.hide();
        this.spinner.stop();
      },
        error => {
          // console.log(error['error'].errorMessage);
          this.modalRef.hide();
          this.spinner.stop();
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 4000,
          });
        });
  }

  timeExtensionReject(ticket_no) {
    if(confirm("Do you want to reject?")){
      this.spinner.start();
      let reqBody = {
        "TICKET_NO": ticket_no,
      }
  
      this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/time-extension/dct/reject-request', reqBody)
        .subscribe(result => {
          // console.log('response', result);
          this.toastr.success("Rejected!", '', {
            timeOut: 2000,
          });
          this.getTimeExtensionData();
          this.spinner.stop();
        },
          error => {
            // console.log(error['error'].errorMessage);
            this.spinner.stop();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 4000,
            });
          });
    }

  }

  timeExtensionExtendedForward(i) {
    if (localStorage.getItem('userRoles') == "CIRCLE_INSPECTOR") {
      this.toastr.error('Access denied', '', {
        timeOut: 2500,
      });

    } else {
      this.timeExtensionExtendedGetData.splice(i, 1);
      this.toastr.success('Forwarded!', '', {
        timeOut: 2000,
      });
    }
  }

  timeExtensionExtendedConfirmation(i) {
    if (localStorage.getItem('userRoles') == "CIRCLE_INSPECTOR") {
      this.toastr.error('Access denied', '', {
        timeOut: 2500,
      });

    } else {
      this.timeExtensionExtendedGetData.splice(i, 1);
      this.toastr.success('Approved!', '', {
        timeOut: 2000,
      });
      this.modalRef.hide();
    }
  }

  timeExtensionExtendedReject(i) {
    if (localStorage.getItem('userRoles') == "CIRCLE_INSPECTOR") {
      this.toastr.error('Access denied', '', {
        timeOut: 2500,
      });

    } else {
      this.timeExtensionExtendedGetData.splice(i, 1);
      this.toastr.success('Rejected!', '', {
        timeOut: 2000,
      });
    }
  }

  ontimeExtensionApproveClick(event: any, ticketNo, tin, extensionUpto, remarks, extensionModalShow) {
    if (localStorage.getItem('userRoles') == "CIRCLE_INSPECTOR") {
      this.toastr.error('Access denied', '', {
        timeOut: 2500,
      });
    }
    else {
      this.extensionApproveForm.patchValue({
        ticket_no: [''],
        tinNo: [''],
        remarks: [''],
        requestedUpto: [''],
        approvedUpto: ['']
      })
      this.extensionApproveForm.get("ticket_no").setValue(ticketNo);
      this.extensionApproveForm.get("tinNo").setValue(tin);
      this.extensionApproveForm.get("remarks").setValue(remarks);
      this.extensionApproveForm.get("requestedUpto").setValue(extensionUpto);
      this.extensionApproveForm.get("approvedUpto").setValue(extensionUpto);
      this.changeExtension(extensionModalShow);
    }
  }

  changeExtension(extensionModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(extensionModalShow, this.config);
  }

  close_extension() {
    this.modalRef.hide();
  }

  ontimeExtendedExtensionApproveClick(event: any, id, tin, extensionUpto, extendedExtensionModalShow) {
    this.extendedExtensionApproveForm.patchValue({
      extId: [''],
      extTinNo: [''],
      extRequestedUpto: [''],
      extApprovedUpto: ['']
    })
    this.extendedExtensionApproveForm.get("extId").setValue(id);
    this.extendedExtensionApproveForm.get("extTinNo").setValue(tin);
    this.extendedExtensionApproveForm.get("extRequestedUpto").setValue(extensionUpto);
    this.extendedExtensionApproveForm.get("extApprovedUpto").setValue(extensionUpto);
    this.changeExtendedExtension(extendedExtensionModalShow);
  }

  changeExtendedExtension(extendedExtensionModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(extendedExtensionModalShow, this.config);
  }

  close_extended_extension() {
    this.modalRef.hide();
  }

}
