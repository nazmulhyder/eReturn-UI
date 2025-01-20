import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public searchForm: FormGroup;
  isShow: boolean = false;
  returnGetData: any;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  data: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService) {
    this.searchForm = fb.group({
      searchTIN: [''],
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.returnGetData = [];
  }

  getTaxpayerReturnData(tin) {
    this.spinner.start();
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/search/' + tin)
      .subscribe(result => {
        if ((result.replyMessage).length > 0) {
          this.spinner.stop();
          this.isShow = true;
          this.returnGetData = result.replyMessage;
        }
        else {
          this.spinner.stop();
          this.toastr.error("Data not found.", '', {
            timeOut: 3000,
          });
        }
      },
        error => {
          this.spinner.stop();
          this.isShow = false;
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  searchTIN(tin: any) {
    this.getTaxpayerReturnData(tin);
  }

  onChangeSearch() {
    this.isShow = false;
  }

}
