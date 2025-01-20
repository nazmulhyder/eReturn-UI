import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { TimeExtensionService } from '../../service/time-extension.service';

@Component({
  selector: 'app-time-extension-applicant-copy',
  templateUrl: './time-extension-applicant-copy.component.html',
  styleUrls: ['./time-extension-applicant-copy.component.css']
})
export class TimeExtensionApplicantCopyComponent implements OnInit {

  taxpayerName: any;
  address: any;
  tin: any;
  circle: any;
  taxZone: any;
  appliedExtentionUpto: any;
  reasonOfExtension: any;
  taxOfficeEntryNumber: any;
  timeExtensionUpto: any;
  timeExtensionAppDate : any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  userTin: any;
  timeExtensionData: any;
  timeExtensionTrackingNumber :any;

  //applied extension upto
  m1: any; m2: any; d1: any; d2: any;
  y1: any; y2: any; y3: any; y4: any;

  //time extended upto
  mm1: any; mm2: any; dd1: any; dd2: any;
  yy1: any; yy2: any; yy3: any; yy4: any;
  todaysDate : any;

  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private timeExtensionService : TimeExtensionService,
    private datepipe: DatePipe,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    // this.todaysDate = this.datepipe.transform(Date(), 'dd MMMM yyyy');
    this.userTin = localStorage.getItem('tin');
    this.getTimeExtensionData();
  }

  getTimeExtensionData() {
    this.apiService.post(this.serviceUrl + 'api/get-time-extn-taxpayer-info?invoiceNumber='+this.timeExtensionService.extensionTrackingNumber,'')
      .subscribe(result => {
        this.timeExtensionData = result.replyMessage;
        //console.log('time extension data', this.timeExtensionData);
        if (this.timeExtensionData != null) {
          this.taxpayerName = this.timeExtensionData.assesName;
          this.address = this.timeExtensionData.presentAddress;
          this.tin = this.timeExtensionData.tin;
          this.circle = this.timeExtensionData.circle;
          this.taxZone = this.timeExtensionData.zone;
          this.appliedExtentionUpto = "";
          this.reasonOfExtension = this.timeExtensionData.remarks;
          this.taxOfficeEntryNumber = "";
          this.timeExtensionUpto = "";
          this.timeExtensionTrackingNumber  = this.timeExtensionService.extensionTrackingNumber;
          
          //applied extension upto
          //day
          this.d1 = this.timeExtensionData.appliedExtensionUpto.substring(0, 1);
          this.d2 = this.timeExtensionData.appliedExtensionUpto.substring(1, 2);
          //month
          this.m1 = this.timeExtensionData.appliedExtensionUpto.substring(3, 4);
          this.m2 = this.timeExtensionData.appliedExtensionUpto.substring(4, 5);
          //year
          this.y1 = this.timeExtensionData.appliedExtensionUpto.substring(6, 7);
          this.y2 = this.timeExtensionData.appliedExtensionUpto.substring(7, 8);
          this.y3 = this.timeExtensionData.appliedExtensionUpto.substring(8, 9);
          this.y4 = this.timeExtensionData.appliedExtensionUpto.substring(9, 10);

          //time extended upto
          //day
          this.dd1 = this.timeExtensionData.approvedExtensionUpto.substring(0, 1);
          this.dd2 = this.timeExtensionData.approvedExtensionUpto.substring(1, 2);
          //month
          this.mm1 = this.timeExtensionData.approvedExtensionUpto.substring(3, 4);
          this.mm2 =  this.timeExtensionData.approvedExtensionUpto.substring(4, 5);
          //year
          this.yy1 = this.timeExtensionData.approvedExtensionUpto.substring(6, 7);
          this.yy2 = this.timeExtensionData.approvedExtensionUpto.substring(7, 8);
          this.yy3 = this.timeExtensionData.approvedExtensionUpto.substring(8, 9);
          this.yy4 = this.timeExtensionData.approvedExtensionUpto.substring(9, 10);
          // this.timeExtensionAppDate  = this.timeExtensionService.dateOfTimeExtension;
          this.timeExtensionAppDate = this.timeExtensionService.dateOfTimeExtension;


        }
      })
  }

}


