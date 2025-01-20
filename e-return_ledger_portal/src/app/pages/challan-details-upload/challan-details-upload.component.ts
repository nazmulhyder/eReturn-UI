import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

type AOA = any[][];

@Component({
  selector: 'app-challan-details-upload',
  templateUrl: './challan-details-upload.component.html',
  styleUrls: ['./challan-details-upload.component.scss']
})
export class ChallanDetailsUploadComponent implements OnInit {

  totalValueUploaded: number;
  totalRowUploaded: number;
  totalValueExisting: number;
  totalRowExisting: number;
  challanDetails: Array<any> = [];

  isHidden: boolean = true;

  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  challanUploadForm: FormGroup;
  private serviceUrl: string;

  ChallanInfoData: any;
  detailsData: any;
  isShow: boolean = false;
  companyName: any;
  entryRef: any;

  constructor(private router: Router, private fb: FormBuilder,
    private toastr: ToastrService,
    private activeRoutes: ActivatedRoute,
    private httpClient: HttpClient,
    public spinner: NgxUiLoaderService,
    public apiService: ApiService,
    public apiUrl: ApiUrl) {
    this.challanUploadForm = fb.group({
      assessmentYear: ['', Validators.required],
      win: ['', Validators.required],
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      section: ['', Validators.required],
      codeNo: ['', Validators.required],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      challanUploadFile: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.challanDetails=[];
    this.totalValueUploaded = 0;
    this.totalRowUploaded = 0;
    this.totalValueExisting = 0;
    this.totalRowExisting = 0;

    this.companyName = localStorage.getItem('companyName');
    this.entryRef = this.activeRoutes.snapshot.paramMap.get("entryRef");

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });

    this.getChallanInfo();
    this.getChallanDetails();

  }

  getChallanInfo(): Promise<void> {

    return new Promise((resolve, reject) => {

      this.spinner.start();
      this.apiService.get(this.serviceUrl + 'api/company/challan/' + this.entryRef)
        .subscribe(result => {

          result = result.replyMessage;

          this.challanUploadForm.patchValue({
            assessmentYear: result.assessmentYr,
            win: result.winNo,
            challanNo: result.challanNo,
            name: this.companyName,
            section: result.section,
            amount: result.totalChallanAmount,
            challanDate: result.challanDate,
            codeNo: result.code,
          });

          resolve();
          this.spinner.stop();
          
        },
          error => {

            this.spinner.stop();
            reject();
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });

          });

    });
  }

  getChallanDetails() {

    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/company/challan-details/' + this.entryRef)
      .subscribe(result => {

          this.detailsData = result.replyMessage;

          if(this.detailsData.length > 0) {

              this.detailsData.forEach((element, index) => {
                  this.totalRowExisting = this.totalRowUploaded + 1;
                  this.totalValueExisting += element['challanAmount'];
              });

            this.isShow = true;

          }

          this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

  onFileChange(evt: any) {
    this.isHidden = false;
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      //console.log(this.data);

      //#region value Sum section

      this.totalValueUploaded = 0;
      this.totalRowUploaded = 0;
      let challanDetail;
      this.data.forEach((element, index) => {
        if (index > 0) {
          this.totalRowUploaded = this.totalRowUploaded + 1;
          this.totalValueUploaded += parseInt(element[2]);
          challanDetail = {
            "personName": element[0],
            "personTin": element[1],
            "challanAmount": parseInt(element[2])
          };
          this.challanDetails.push(challanDetail);
        }
      });
      // console.log('Total Value:', this.totalValue);
      // console.log('Total Row:', this.totalRow);
      // console.log('Total Data:', this.challanDetails);

      //#endregion

    };
    reader.readAsBinaryString(target.files[0]);
  }

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    //console.log(file);
    // var reader = new FileReader();

    // reader.readAsText(file);
    // reader.onload = (event: any) => {
    //   var csv = event.target.result; // Content of CSV file
    //   console.log(csv);
    // }
  }

  submittedData() {

    if (this.totalValueUploaded != this.challanUploadForm.value.amount) {
      this.toastr.warning('Value mismatch. Amount & total amount should be equal.', '', {
        timeOut: 3000,
      });

      // this.reset();

      //#region navigate current url without reloading
      // let currentUrl = this.router.url;
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate([currentUrl]);
      // });
      //#endregion
    }
    else {

      this.spinner.start();

      this.apiService.post(this.serviceUrl + 'api/company/challan-details/' + this.entryRef, this.challanDetails)
        .subscribe(result => {

          this.isHidden = true;

          this.toastr.success(result.replyMessage, '', {
            timeOut: 1000
          });

          this.reset();

          this.router.navigateByUrl("/pages/challan-list");

          this.spinner.stop();

        },
          error => {

            this.spinner.stop();

            this.toastr.error(error['error'].errorMessage, 'Error', {
              timeOut: 3000
            });

          });

    }

    // this.isHidden = true;
    // this.toastr.success(this.totalRow +' '+ 'row saved successfully', '', {
    //   timeOut: 1000,
    // });
    // this.reset();

    // this.router.navigateByUrl("/pages/challan-list");

  }

  reset() {
    this.challanUploadForm.reset();
    this.getChallanInfo();
    this.isHidden = true;
    this.totalValueUploaded = 0;
    this.totalRowUploaded = 0;
  }

  goToUploadPage() {
    this.router.navigate(["/pages/challan-details-upload"]);
  }

}
