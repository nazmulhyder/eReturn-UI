import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-income-tax-certificate',
  templateUrl: './income-tax-certificate.component.html',
  styleUrls: ['./income-tax-certificate.component.css']
})
export class IncomeTaxCertificateComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  checkIsLoggedIn: any;
  userTin: any;
  taxpayerProfileImg: any;
  getReturnViewPart2Data: any;
  storeSplittedTin: any;
  storeOfficeRegisterNo: any;

  defaultTodaysDate = new Date();
  defaultDateInString: any;

  isShow: any;

  //#region Rtrurn View Part |
  assessmentYr: any;
  return_submit_under_82bb: boolean = false;
  nameOfAssessee: any;
  isMgender: boolean = false;
  twelveDigitTIN: any;
  oldTIN: any;
  circle: any;
  zone: any;
  isResident: boolean = false;
  residentStatusInString: any;
  gazzetedWarWondedFF: boolean = false;
  personWithDisablilty: boolean = false;
  age65OrMore: boolean = false;
  parent_legal_of_person_with_disability: boolean = false;
  dateOfBirth: any;
  startingIncYr: any;
  endingIncYr: any;
  employerName: any;
  spouseName: any;
  spouseTIN: any;
  fatherName: any;
  motherName: any;
  presentAdd: any;
  permanentAdd: any;
  contact: any;
  email: any;
  telephone: any;
  nid: any;
  bid: any;
  m1: any; m2: any; d1: any; d2: any;
  y1: any; y2: any; y3: any; y4: any;

  //default date
  mm1: any; mm2: any; dd1: any; dd2: any;
  yy1: any; yy2: any; yy3: any; yy4: any;
  //#endregion
  reference_no: any;
  todaysDate: any;
  taxpayerQRData: string = null;
  constructor(
    private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
    private eReturnSpinner: NgxUiLoaderService,
    private httpClient: HttpClient,
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });
    this.eReturnSpinner.start();
    this.checkIsLoggedIn = localStorage.getItem('isLogged');
    if (this.checkIsLoggedIn === 'not logged in') {
      this.router.navigate(["/auth/sign-in"]);
    }
    if (this.checkIsLoggedIn === 'logged in') {
      this.userTin = localStorage.getItem('tin');
      // let max = 999999;
      // let randomNumber = Math.floor(Math.random() * max) + 1;
      // this.reference_no = randomNumber;
      // localStorage.setItem('randomNumber', this.reference_no);
      // console.log('tax office no',this.reference_no);

      // console.log('todays date',this.defaultTodaysDate);
      this.todaysDate = this.datepipe.transform(this.defaultTodaysDate, 'dd MMMM yyyy');
      this.defaultDateInString = this.datepipe.transform(this.defaultTodaysDate, 'dd/MM/yyyy');
      // console.log('text date', this.defaultDateInString);

      this.getIncomeTaxCertificate();
      this.checkSubmissionStatus();
    }
    this.eReturnSpinner.stop();
  }

  getIncomeTaxCertificate() {
    let reqBody: any;
    reqBody = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get-basic-return-info')
      .subscribe(result => {
        // console.log('part 1',result);
        this.getReturnViewPart2Data = result;
        if (JSON.stringify(result.replyMessage) != '{}') {
          // debugger;
          this.return_submit_under_82bb = result.replyMessage.return_under_82BB;
          this.nameOfAssessee = result.replyMessage.assesName;
          this.isMgender = result.replyMessage.gender === '1' ? true : false;
          this.twelveDigitTIN = result.replyMessage.tin;
          this.oldTIN = result.replyMessage.oldTin;
          this.circle = result.replyMessage.circle;
          this.zone = result.replyMessage.zone;
          this.isResident = result.replyMessage.residentStatus === 'Resident' ? true : false;
          this.residentStatusInString = result.replyMessage.residentStatus;
          this.gazzetedWarWondedFF = result.replyMessage.warWoundedFreedomFighter;
          this.personWithDisablilty = result.replyMessage.personWithDisability;
          this.age65OrMore = false;
          this.parent_legal_of_person_with_disability = result.replyMessage.guardianOfDisablePerson;
          this.startingIncYr = result.replyMessage.startOfIncomeYr;
          this.endingIncYr = result.replyMessage.endOfIncomeYr;
          this.employerName = result.replyMessage.totalEmployerAndOffice;
          this.spouseName = result.replyMessage.spouseName;
          this.spouseTIN = result.replyMessage.spouseTin;
          this.fatherName = result.replyMessage.fathersName;
          this.motherName = result.replyMessage.mothersName;
          this.presentAdd = result.replyMessage.presentAddress;
          this.permanentAdd = result.replyMessage.permanentAddress;
          this.contact = result.replyMessage.phone;
          this.email = result.replyMessage.email;
          this.nid = result.replyMessage.nid;
          this.bid = result.replyMessage.businessIdNumber;
          this.dateOfBirth = result.replyMessage.dob;
          this.assessmentYr = result.replyMessage.assessmentYear;
          this.reference_no = result.replyMessage.referenceNo;

          //day
          this.m1 = this.dateOfBirth.substring(0, 1);
          this.m2 = this.dateOfBirth.substring(1, 2);
          //month
          this.d1 = this.dateOfBirth.substring(3, 4);
          this.d2 = this.dateOfBirth.substring(4, 5);
          //year
          this.y1 = this.dateOfBirth.substring(6, 7);
          this.y2 = this.dateOfBirth.substring(7, 8);
          this.y3 = this.dateOfBirth.substring(8, 9);
          this.y4 = this.dateOfBirth.substring(9, 10);

          //default date
          //day
          this.dd1 = this.defaultDateInString.substring(0, 1);
          this.dd2 = this.defaultDateInString.substring(1, 2);
          //month
          this.mm1 = this.defaultDateInString.substring(3, 4);
          this.mm2 = this.defaultDateInString.substring(4, 5);
          //year
          this.yy1 = this.defaultDateInString.substring(6, 7);
          this.yy2 = this.defaultDateInString.substring(7, 8);
          this.yy3 = this.defaultDateInString.substring(8, 9);
          this.yy4 = this.defaultDateInString.substring(9, 10);
          
          this.taxpayerQRData = 'TIN:' + this.userTin + ',Reference No:' + this.reference_no;
        }
      })

  }

  checkSubmissionStatus() {
    let reqData = {
      "assessmentYear": "2021-2022",
      "tinNo": this.userTin
    }
    this.apiService.get(this.serviceUrl + 'api/get_submission')
      .subscribe(result => {
        if (result.replyMessage != null) {
          if ((result.replyMessage).returnSubmissionType=='OFFLINE') {
            this.isShow = false;
            // this.toastr.error('You already prepared your offline (paper) return.', '', {
            //   timeOut: 3000,
            // });
            this.toastr.error('Submit your return in online first.', '', {
              timeOut: 3000,
            });
          } else {
            this.isShow = true;
          }
        }
        else {
          this.isShow = false;
          this.toastr.error('Submit your return in online first.', '', {
            timeOut: 3000,
          });
        }
      },
        error => {
         // console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  taxCertificateDownload() {
    let DATA = document.getElementById('income-tax-certificate');

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      //this.addWaterMark(PDF);
      let position = 0;

      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('Tax-Certificate-' + this.userTin);
    });
  }

  addWaterMark(doc) {
    var totalPages = doc.internal.getNumberOfPages();
    for (var i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(150);
      doc.setFontSize(20);
      doc.text(75, doc.internal.pageSize.height - 70, 'Dummy Version', null, 30);
    }
    return doc;
  }
}
