import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-upload-offline-data',
  templateUrl: './upload-offline-data.component.html',
  styleUrls: ['./upload-offline-data.component.scss']
})
export class UploadOfflineDataComponent implements OnInit {

  dataUploadForm: FormGroup;
  private serviceUrl: string;
  public dynamicRes: any;
  public currentFileUpload: File;

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private toastr: ToastrService,
    public spinner: NgxUiLoaderService,
    public apiService: ApiService,
    public apiUrl: ApiUrl,
    private https: HttpClient
  ) { 
    this.dataUploadForm = fb.group({
      // dataUploadFile:['', Validators.required]
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      dataUploadFile: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });

    this.getData();

  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length > 1) throw new Error('Cannot use multiple files');
    else{
      const file = evt.target.files[0];
      // console.log(file);

      // this.dataUploadForm.patchValue({
      //   fileSource: file
      // });

      this.currentFileUpload = file;

    }
  }

  reset() {
    this.dataUploadForm.reset();
  }

  submittedData(){
    // console.log(this.dataUploadForm.value.dataUploadFile);
    //console.log(this.dataUploadForm.get('dataUploadFile').value);
    // this.toastr.success("Uploaded successfully.", '', {
    //   timeOut: 2000,
    // });

    // const formData = new FormData();
    // formData.append('file', this.dataUploadForm.get('fileSource').value);

    // const data: FormData = new FormData();
    // data.append('file', this.currentFileUpload);

    // this.apiService.post(this.serviceUrl + 'api/data-entry/offline-data', data)
    //   .subscribe(result => {
    //     this.dynamicRes = result.replyMessage;
    //   },
    //     error => {
    //       console.log(error['error'].errorMessage);
    //       this.toastr.error(error['error'].errorMessage, '', {
    //         timeOut: 3000,
    //       });
    //     });

    const data: FormData = new FormData();
    data.append('file', this.currentFileUpload);

    const newRequest = new HttpRequest<any>('POST', environment.management_base_url + '/ereturnmanagement/v2/api/data-entry/offline-data', data, {
    reportProgress: true,
    responseType: 'json'
    });

    this.spinner.start();

    this.https.request(newRequest)
    .subscribe(result => {
      console.log(result);
          // this.dynamicRes = result.replyMessage;
          this.dynamicRes = [];
    this.ngOnInit();

        },
          error => {
            console.log(error['error'].errorMessage);
            this.toastr.error('Unhandled Error !!', '', {
              timeOut: 3000,
            });
          });

          this.dynamicRes = [];


    // this.reset();

    // this.getData();

    this.toastr.success("Process Success", '', {
      timeOut: 2000,
    });

    this.spinner.stop();


  }

  getData(){

    this.spinner.start();

    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/data-entry/offline-data')
      .subscribe(result => {
        this.dynamicRes = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });

    this.spinner.stop();

    
  }

}
