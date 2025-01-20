import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-return-report',
  templateUrl: './return-report.component.html',
  styleUrls: ['./return-report.component.scss']
})
export class ReturnReportComponent implements OnInit {

  returnReportForm: FormGroup;
  zoneData = [];
  returnData = [];
  private serviceUrl: string;
  // totalOnlineSubmission:any;
  sumData: any;
  zoneName: string;

  //newly added
  isSuperAdmin: boolean = false;
  isZonalReport: boolean = false;
  userRoles: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService) {
    this.returnReportForm = fb.group({
      zoneNo: ['0', Validators.required],
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.userRoles = localStorage.getItem('userRoles');
    if (this.userRoles == 'SS_ICT_SUPER_ADMIN') {
      this.isSuperAdmin = true;
    } else {
      this.isSuperAdmin = false;
    }
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.loadZone();
    this.spinner.stop();
  }

  loadZone() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/zones/user-specific-zones')
      .subscribe(result => {
        console.log('zoneData response', result);
        this.zoneData = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onChangeZone(event: any) {
    this.returnData = [];
    if (event.target.value != 0) {
      this.zoneName = event.target.options[event.target.options.selectedIndex].text;
      if (event.target.value == -999) {
        this.isZonalReport = true;
      }
      else {
        this.isZonalReport = false;
      }
      this.spinner.start();
      this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/reports/return-submissions/circle-wise/' + event.target.value)
        .subscribe(result => {
          //console.log('returnData response', result);
          this.returnData = result.replyMessage['data'];
          this.sumData = result.replyMessage['sum'];
          // this.totalOnlineSubmission = 0;
          // this.returnData.forEach(element => {
          //   this.totalOnlineSubmission += element.onlineSubmission;
          // });
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
    }

  }

}
