import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {

  alertListForm: FormGroup;
  alertGetData:any;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
  ) {
    this.alertListForm = fb.group({
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.getAlertData();
  }

  getAlertData()
  {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/alerts')
    .subscribe(result => {
       console.log(result);
       this.alertGetData = result.replyMessage;
    },
      error => {
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage, '', {
          timeOut: 3000,
        });
      });  
  }
}
