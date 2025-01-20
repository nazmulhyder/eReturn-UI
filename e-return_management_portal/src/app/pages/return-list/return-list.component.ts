import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.scss']
})
export class ReturnListComponent implements OnInit {

  returnListForm: FormGroup;

  returnGetData: any;
  returnVerify = [];
  data: any;
  isRequestBtnDisable: boolean = false;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  getAllReturnList: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
  ) {
    this.returnListForm = fb.group({
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    localStorage.removeItem('isPrintClick');
    this.getAllReturnLists();
  }

  downloadReturn(tin: any) {
    console.log(tin);
  }

  returnView(tin: any) {
    this.router.navigateByUrl("/pages/return/" + tin);
  }

  printReturnView(tin: any, isPrintClick: any) {
    localStorage.setItem('isPrintClick', isPrintClick);
    this.router.navigateByUrl("/pages/return/" + tin);
  }

  search(text: string) {
    if (!text) {
      this.getAllReturnList = this.data;
    } else {
      this.getAllReturnList = this.data;
      this.getAllReturnList = this.getAllReturnList.filter((x) =>
        x.tinNo.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
    }
  }
  requestSent(k) {
    this.toastr.success('Request sent successfully.', '', {
      timeOut: 2500,
    });
    this.isRequestBtnDisable = true;
    // this.returnGetData.splice(k,1);
  }

  getAllReturnLists() {
    //http://103.92.84.210:8084/api/returns/list/2021-2022
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/list')
      .subscribe(result => {
        this.getAllReturnList = result.replyMessage;
        this.data = this.getAllReturnList;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }
}
