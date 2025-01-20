import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-extension-report',
  templateUrl: './extension-report.component.html',
  styleUrls: ['./extension-report.component.scss']
})
export class ExtensionReportComponent implements OnInit {

  extensionReportForm: FormGroup;
  zoneData = [];
  extensionData = [];
  private serviceUrl: string;
  sumData: any;
  zoneName: string;
  currentDateTime: any;
  total: any;
  totalPending: any;
  totalRejected: any;
  totalApproved: any;

  //newly added
  isZonalReport: boolean = false;
  userRoles: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private datepipe: DatePipe,) {
    this.extensionReportForm = fb.group({
      zoneNo: ['0', Validators.required],
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.userRoles = localStorage.getItem('userRoles');
    this.loadZone();

    this.currentDateTime = this.datepipe.transform(new Date(), 'dd-MM-yyyy h:mm a')

    this.spinner.stop();
  }

  loadZone() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/zones/user-specific-zones')
      .subscribe(result => {
        // console.log('zoneData response', result);
        this.zoneData = result;
      },
        error => {
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onChangeZone(event: any) {
    if (event.target.value != 0 && this.userRoles == 'SS_ICT_SUPER_ADMIN') {
      this.zoneName = event.target.options[event.target.options.selectedIndex].text;
      if (event.target.value == -999) {
        this.isZonalReport = true;
      }
      else {
        this.isZonalReport = false;
      }
      this.extensionData = [];
      this.spinner.start();
      this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/reports/time-extension/' + event.target.value)
        .subscribe(result => {
          //console.log('returnData response', result);
          this.extensionData = result.replyMessage;
          // this.sumData = result.replyMessage['sum'];
          this.total = 0;
          this.totalPending = 0;
          this.totalRejected = 0;
          this.totalApproved = 0;
          this.extensionData.forEach(element => {
            this.total += element.total;
            this.totalPending += element.pending;
            this.totalRejected += element.rejected;
            this.totalApproved += element.approved;
          });
          this.spinner.stop();
        },
          error => {
            this.spinner.stop();
            //console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
    else {
      this.zoneName = "";
      this.extensionData = [];
    }
  }

}
