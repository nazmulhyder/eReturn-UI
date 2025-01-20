import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  private serviceUrl: string;
  totalRegisteredUser: any;
  totalOnlineSubmission: any;
  totalOfflineSubmission: any;
  totalCollectedAmount : any;

  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [50, 53, 56, 59, 63, 67, 71, 75, 79, 84, 89, 94, 99, 105, 110, 120],
      // label: 'Series A',
      barPercentage: 0.6,
    }
  ];
  // public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Labels: Array<any> = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [50, 55, 60, 70, 80, 90, 100],
      // label: 'Series A'
    }
  ];

  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [48, 50, 53, 57, 62, 68, 78],
      // label: 'Series A'
    }
  ];
  // public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Labels: Array<any> = ['', '', '', '', '', '', ''];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';

  constructor(
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    private commaSaparator : CommaSeparatorService) { }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    // this.getTotalRegisteredUser();
    // this.getTotalOnlineSubmission();
    // this.getTotalOfflineSubmission();
    this.getDashboardSummary();
    this.spinner.stop();
  }

  getDashboardSummary() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/summary')
      .subscribe(result => {
        console.log('dashboard summary', result);
        this.totalRegisteredUser = result.replyMessage.registeredTaxpayerCount ? result.replyMessage.registeredTaxpayerCount : 0 ;
        this.totalOfflineSubmission = result.replyMessage.offlineSubmissionCount ? result.replyMessage.offlineSubmissionCount : 0;
        this.totalOnlineSubmission = result.replyMessage.onlineSubmissionCount ? result.replyMessage.onlineSubmissionCount : 0;
        this.totalCollectedAmount = result.replyMessage.totalCollectedAmount ? this.commaSaparator.currencySeparatorBD(result.replyMessage.totalCollectedAmount) : 0;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  getTotalRegisteredUser() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/count/registered-taxpayer')
      .subscribe(result => {
        console.log('totalRegisteredUser response', result);
        this.totalRegisteredUser = result.replyMessage;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }
  getTotalOnlineSubmission() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/count/return-submissions/online/' + '2021-2022')
      .subscribe(result => {
        console.log('totalOnlineSubmission response', result);
        this.totalOnlineSubmission = result.replyMessage;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }
  getTotalOfflineSubmission() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/count/return-submissions/offline/' + '2021-2022')
      .subscribe(result => {
        console.log('totalOfflineSubmission response', result);
        this.totalOfflineSubmission = result.replyMessage;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

}
