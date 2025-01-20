import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-tin-certificate',
  templateUrl: './tin-certificate.component.html',
  styleUrls: ['./tin-certificate.component.css']
})

export class TinCertificateComponent implements OnInit {

  userTin: any;
  tinCertificateImg: any;
  fileName: any;
  private serviceUrl: string;

  constructor(private apiService: ApiService,
    private apiUrl: ApiUrl,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    private http: HttpClient,
    private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.fileName = "Tin_Certificate_" + this.userTin + ".pdf";
    this.getTinCertificateData();
    this.spinner.stop();
  }

  // getTinCertificateData() {
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/pdf');

  //   return this.http.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/tin-certificate/new', {
  //     headers: headers,
  //     responseType: 'blob'
  //   }).subscribe(
  //     res => {
  //       var blob = new Blob([res], { type: 'application/pdf' });
  //       var filename = 'file.pdf';
  //       // saveAs(blob, filename);
  //       var fileURL = URL.createObjectURL(blob)+ '#toolbar=0&navpanes=0&scrollbar=0';
  //       console.log('hdhhwh', fileURL);
  //       // document.title = this.fileName;
  //       window.open(fileURL);

  //     },
  //     error => {
  //       console.log(error['error'].errorMessage);
  //     }
  //   );
  // }

  getTinCertificateData() {
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/tin-certificate')
      .subscribe(result => {
        if (result != null) {
          this.tinCertificateImg = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + result.replyMessage + '#toolbar=0&zoom=100');
        }
      },
        error => {
          //console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage);
        });
  }

  download() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/pdf');

    return this.http.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/tin-certificate/new', {
      headers: headers,
      responseType: 'blob'
    }).subscribe(
      res => {
        var blob = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(blob);

        // create <a> tag dynamically
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        
        // it forces the name of the downloaded file
        fileLink.download = this.fileName;
        
        // triggers the click event
        fileLink.click();
      },
      error => {
        console.log(error['error'].errorMessage);
      }
    );
  }
  
}
