import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommaSeparatorService } from '../../service/comma-separator.service';

@Component({
  selector: 'app-top-individual-taxpayers-by-tax-paid',
  templateUrl: './top-individual-taxpayers-by-tax-paid.component.html',
  styleUrls: ['./top-individual-taxpayers-by-tax-paid.component.scss']
})
export class TopIndividualTaxpayersByTaxPaidComponent implements OnInit {

  private serviceUrl: string;
  data: any;
  dtOptions: any = {};

  constructor(
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private commaSeparator: CommaSeparatorService
  ) { }

  ngOnInit(): void {
    this.spinner.start();
    this.serviceUrl = 'http://localhost:8084/v2/';
    this.loadData();
    this.spinner.stop();
  }

  loadData() {
    this.data=[];
    this.apiService.get(this.serviceUrl + 'api/data-entry/offline-data-json')
      .subscribe(result => {
        this.data = result;
        console.log('dataa=', this.data);
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          // dom: 'Bfrtip',
          // buttons: [
          //   'copy', 'csv', 'excel', 'print'
          // ]
        };
      },
        error => {
          // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  addCommaSeparator(value : string) : string
  {
     return this.commaSeparator.currencySeparatorBD(value);
  }

}
