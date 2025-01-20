import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-challan-list',
  templateUrl: './challan-list.component.html',
  styleUrls: ['./challan-list.component.scss']
})
export class ChallanListComponent implements OnInit {

  challanListForm:FormGroup;

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  winOrTinNo: any;
  companyName: any;
  ChallanListData:any;

  constructor(private fb: FormBuilder,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private router: Router,) {
    this.challanListForm = fb.group({
    });
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
    this.companyName = localStorage.getItem('companyName');
    this.getChallanList();
  }

  getChallanList(): Promise<void>{

    return new Promise((resolve, reject) => {

      this.spinner.start();
      this.apiService.get(this.serviceUrl + 'api/company/challans')
        .subscribe(result => {
          this.ChallanListData=result.replyMessage;
          resolve();
          this.spinner.stop();
        },
          error => {

            this.spinner.stop();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });

          });

    });

  }

  deleteEntry(entryRef: any): Promise<void>{

    return new Promise((resolve, reject) => {

      this.spinner.start();
      this.apiService.delete(this.serviceUrl + 'api/company/challan/' + entryRef)
        .subscribe(result => {

          const index = this.ChallanListData.indexOf(entryRef);
          this.ChallanListData.splice(index, 1);

          this.toastr.success(result.replyMessage, '', {
            timeOut: 1000
          });

          resolve();
          this.spinner.stop();

        },
          error => {

            this.spinner.stop();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });

          });

    });

  }

  gotoChallanEntryPage(){
    this.router.navigateByUrl("/pages/challan-entry");
  }

  gotoUploadPage(entryRef:any){
    this.router.navigateByUrl("/pages/challan-details-upload/" + entryRef);
  }

}
