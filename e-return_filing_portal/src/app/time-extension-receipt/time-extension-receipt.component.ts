import { Component, OnInit } from '@angular/core';
import { ApiUrl } from '../custom-services/api-url/api-url';
import { ApiService } from '../custom-services/ApiService';
import { TimeExtensionService } from '../service/time-extension.service';

@Component({
  selector: 'app-time-extension-receipt',
  templateUrl: './time-extension-receipt.component.html',
  styleUrls: ['./time-extension-receipt.component.css']
})
export class TimeExtensionReceiptComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  timeExtensionData: any;
  timeExtensionTrackingNumber :any;
  timeExtensionAppDate :any;
  taxpayerName: any;
  address: any;
  tin: any;
  circle: any;
  taxZone: any;
  appliedExtentionUpto: any;
  reasonOfExtension: any;
  taxOfficeEntryNumber: any;
  timeExtensionUpto: any;
  
  constructor(
    apiService: ApiService,
    apiUrl: ApiUrl,
    private timeExtensionService : TimeExtensionService,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
   }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.getTimeExtensionData();
  }

  getTimeExtensionData() {
    this.apiService.post(this.serviceUrl + 'api/get-time-extn-taxpayer-info?invoiceNumber='+this.timeExtensionService.extensionTrackingNumber,'')
      .subscribe(result => {
        this.timeExtensionData = result.replyMessage;
      // console.log('time extension data', this.timeExtensionData);
        if (this.timeExtensionData != null) {
          this.taxpayerName = this.timeExtensionData.assesName;
          this.address = this.timeExtensionData.presentAddress;
          this.tin = this.timeExtensionData.tin;
          this.circle = this.timeExtensionData.circle;
          this.taxZone = this.timeExtensionData.zone;
          this.appliedExtentionUpto = this.timeExtensionData.appliedExtensionUpto;
          this.reasonOfExtension = this.timeExtensionData.remarks;
          this.taxOfficeEntryNumber = "";
          this.timeExtensionUpto = "";
          this.timeExtensionTrackingNumber  = this.timeExtensionService.extensionTrackingNumber;
          this.timeExtensionAppDate  = this.timeExtensionService.dateOfTimeExtension;
        }
      })
  }

}
