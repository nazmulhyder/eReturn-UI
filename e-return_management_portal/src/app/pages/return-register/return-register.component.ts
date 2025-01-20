import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';

@Component({
  selector: 'app-return-register',
  templateUrl: './return-register.component.html',
  styleUrls: ['./return-register.component.scss']
})
export class ReturnRegisterComponent implements OnInit {
  returnRegisterForm: FormGroup;
  circleData = [];
  returnData = [];
  private serviceUrl: string;
  // totalOnlineSubmission:any;
  sumData: any;
  circleName: string;

  data: any;
  options: any = {
    multiple: false
  };
  constructor(private fb: FormBuilder,
    private router: Router,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private commaSeparator : CommaSeparatorService) {
    this.returnRegisterForm = fb.group({
      circleNo: ['0', Validators.required],
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.loadCircle();
    this.spinner.stop();
  }

  loadCircle() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/circles/user-specific-circles')
      .subscribe(result => {
        // console.log('circleData response', result);
        this.circleData = result;
        this.data = [];
        let obj = { text: 'Select', id: 99999 }
        this.data.push(obj);

        this.circleData.forEach(element => {
          let obj = { text: element.circleName, id: element.circleNo }
          this.data.push(obj);
        })
      },
        error => {
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onChangeCircle(event: any) {
    this.returnData = [];
    if (event.id != 99999) {
      //console.log(event.text);
      this.circleName = event.text;
      this.spinner.start();
      this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/dashboard/reports/return-register/' + event.id)
        .subscribe(result => {
          this.returnData = result.replyMessage['data'];
          this.sumData = result.replyMessage['sum'];
          this.spinner.stop();
        },
          error => {
            this.spinner.stop();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });
    }
    else {
      this.circleName = "";
    }

  }

  addCommaSeparator(value : string) : string
  {
     return this.commaSeparator.currencySeparatorBD(value);
  }
}
