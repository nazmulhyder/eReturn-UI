import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { promise } from 'protractor';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommonUtilService } from '../../custom-services/utils/common.utils';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isSourceTaxCollapsed = false;
  isAdvanceTaxCollapsed = false;

  winOrTinNo: any;
  apiService: ApiService;
  private serviceUrl: string;
  private eReturnUrl: string;
  apiUrl: ApiUrl;
  eReturnPortalBaseUrl: string;

  IBassData: any;
  total_Salary = 0;
  BankData: any;
  total_Bank_amt = 0;
  CertificateData: any;
  total_Certificate_amt = 0;
  OthersData: any;
  total_Others_amt = 0;
  total_Source_tax = 0;

  CarAitData: any;
  total_car_ait_amt = 0;

  US64AitData: any;
  total_us64_ait_amt = 0;
  total_ait_amt = 0;

  US74AitData: any;
  total_us74_ait_amt = 0;

  total_regular_payment = 0;

  total_amt = 0;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  public salaryTdsForm: FormGroup;
  public bankForm: FormGroup;
  public savingCertificateForm: FormGroup;
  public paidCarOwnershipForm: FormGroup;

  allRegularPayments = [];
  totalRegularPaymentForList: any;

  token: any;
  isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';
  // yourIFrameUrl = 'http://103.92.84.210/#/eLedger-login';
  yourIFrameUrl: any;
  requestSessionID : any;
  refresh_Token : any;

  get_all_tds = [];
  constructor(private modalService: BsModalService,
    private fb: FormBuilder,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private spinner: NgxUiLoaderService,
    private router: Router,
    public sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    public commonUtilService: CommonUtilService) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
      this.eReturnUrl = res['eReturn'].url;
      this.eReturnPortalBaseUrl = res['eReturnPortalUrl'].url;
    });
    this.yourIFrameUrl = this.eReturnPortalBaseUrl + '/#/eLedger-login';
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
    this.token = localStorage.getItem('access_token');
    this.refresh_Token = localStorage.getItem('refresh_token');

    // this.getAllSourceTaxData();
    // this.getAIT_and_RegularTaxData();
    // this.getTotalAmt();


    //#region previously worked

    // this.getAllSourceTaxData()
    //   .then(() => this.getAIT_and_RegularTaxData());

    //#endregion

    this.getAllTdsData()
      .then(() => this.getTotalRegularPayment());

    this.regularPaymentList();

  }

  getAllTdsData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.spinner.start();
      this.apiService.get(this.serviceUrl + 'api/tds')
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {

            console.log('BankData:', result['replyMessage']['BankTDS']);
            this.BankData = result['replyMessage']['BankTDS'];
            this.BankData.forEach(element => {
              this.total_Bank_amt = this.total_Bank_amt + element.tdsClaim;
            });

            console.log('CertificateData:', result['replyMessage']['SavingCertificateTDS']);
            this.CertificateData = result['replyMessage']['SavingCertificateTDS'];
            this.CertificateData.forEach(element => {
              this.total_Certificate_amt = this.total_Certificate_amt + element.tdsClaim;
            });

            // console.log('IBassData:', result['replyMessage']['IBassTDS']);
            // this.IBassData = result['replyMessage']['IBassTDS'];
            // this.IBassData.forEach(element => {
            //   this.total_Salary = this.total_Salary + element.tdsClaim;
            // });

            let temp_total_tds  = 0;
            this.get_all_tds = result['replyMessage']['CompanyTDS'];
            this.get_all_tds.forEach(element => {
              temp_total_tds+= element.tdsClaim;
            });

            this.total_Salary = temp_total_tds;
            console.log('get_all_tds',this.get_all_tds);

            console.log('OtherData:', result['replyMessage']['OtherTDS']);
            this.OthersData = result['replyMessage']['OtherTDS'];
            this.OthersData.forEach(element => {
              this.total_Others_amt = this.total_Others_amt + element.tdsClaim;
            });

            this.total_Source_tax = (this.total_Bank_amt + this.total_Salary + this.total_Certificate_amt + this.total_Others_amt);

            console.log('CarAitData:', result['replyMessage']['CarTDS']);
            this.CarAitData = result['replyMessage']['CarTDS'];
            this.CarAitData.forEach(element => {
              this.total_car_ait_amt = this.total_car_ait_amt + element.tdsClaimAmount;
            });

            console.log('US64AitData:', result['replyMessage']['US64TDS']);
            this.US64AitData = result['replyMessage']['US64TDS'];
            this.US64AitData.forEach(element => {
              this.total_us64_ait_amt = this.total_us64_ait_amt + element.challanAmount;
            });
            this.total_ait_amt = (this.total_car_ait_amt + this.total_us64_ait_amt);

            console.log('US74AitData:', result['replyMessage']['US74TDS']);
            this.US74AitData = result['replyMessage']['US74TDS'];
            this.US74AitData.forEach(element => {
              this.total_us74_ait_amt = this.total_us74_ait_amt + element.challanAmount;
            });

            this.total_amt = (this.total_Source_tax + this.total_ait_amt + this.total_us74_ait_amt);

          }
          resolve();
          this.spinner.stop();
        },
          error => {
            reject();
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });

    });
  }

  getTotalRegularPayment(): Promise<void> {
    
    return new Promise((resolve, reject) => {
      this.apiService.get(this.eReturnUrl + 'api/payment/get_client_payment_summary')
        .subscribe(result => {
          console.log('totalPayment', result);
          if (JSON.stringify(result) != '{}') {
            this.total_regular_payment = result["replyMessage"]["totalPayment"];
          }
          this.total_amt = (this.total_amt + this.total_regular_payment);
          resolve();
        },
          error => {
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
            this.total_amt = (this.total_amt + this.total_regular_payment);
          });
    });
  }


  getAllSourceTaxData(): Promise<void> {
    return new Promise((resolve, reject) => {
      let requestPostData = {
        "tinNo": this.winOrTinNo,
        "assessmentYear": "2021-2022",
      }
      this.spinner.start();
      this.apiService.post(this.serviceUrl + 'api/source_tax/get_all_tds', requestPostData)
        .subscribe(result => {
          if (JSON.stringify(result.replyMessage) != '{}') {

            console.log('BankData:', result['replyMessage']['BankTDS']);
            this.BankData = result['replyMessage']['BankTDS'];
            this.BankData.forEach(element => {
              this.total_Bank_amt = this.total_Bank_amt + element.tdsClaim;
            });

            console.log('CertificateData:', result['replyMessage']['SavingCertificateTDS']);
            this.CertificateData = result['replyMessage']['SavingCertificateTDS'];
            this.CertificateData.forEach(element => {
              this.total_Certificate_amt = this.total_Certificate_amt + element.tdsClaim;
            });

            console.log('IBassData:', result['replyMessage']['IBassTDS']);
            this.IBassData = result['replyMessage']['IBassTDS'];
            this.IBassData.forEach(element => {
              this.total_Salary = this.total_Salary + element.tdsClaim;
            });

            console.log('OtherData:', result['replyMessage']['OtherTDS']);
            this.OthersData = result['replyMessage']['OtherTDS'];
            this.OthersData.forEach(element => {
              this.total_Others_amt = this.total_Others_amt + element.tdsClaim;
            });

            this.total_Source_tax = (this.total_Bank_amt + this.total_Salary + this.total_Certificate_amt + this.total_Others_amt);
          }
          resolve();
          this.spinner.stop();
        },
          error => {
            reject();
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
          });

    });
  }

  getAIT_and_RegularTaxData(): Promise<void> {
    return new Promise((resolve) => {
      this.spinner.start();
      this.apiService.get(this.serviceUrl + 'api/ait/car')
        .subscribe(result => {
          console.log('aitData', result);
          if (result.length > 0) {
            this.CarAitData = result;
            this.CarAitData.forEach(element => {
              this.total_car_ait_amt = this.total_car_ait_amt + element.tdsClaimAmount;
            });
          }
          resolve();
          this.spinner.stop();
          this.getUS64Data();
        },
          error => {
            this.spinner.stop();
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
            this.getUS64Data();
          });
    });
  }

  getUS64Data(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.get(this.serviceUrl + 'api/ait/US64-US74/' + this.winOrTinNo + '/' + '2021-2022' + '/' + 'US_64')
        .subscribe(result => {
          console.log('us64Data', result);
          if (result.length > 0) {
            this.US64AitData = result;
            this.US64AitData.forEach(element => {
              this.total_us64_ait_amt = this.total_us64_ait_amt + element.challanAmount;
            });
            this.total_ait_amt = (this.total_car_ait_amt + this.total_us64_ait_amt);
          }
          resolve();
          this.getUS74Data();
        },
          error => {
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
            this.getUS74Data();
          });
    });
  }

  getUS74Data(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.get(this.serviceUrl + 'api/ait/US64-US74/' + this.winOrTinNo + '/' + '2021-2022' + '/' + 'US_74')
        .subscribe(result => {
          console.log('us74Data', result);
          if (result.length > 0) {
            this.US74AitData = result;
            this.US74AitData.forEach(element => {
              this.total_us74_ait_amt = this.total_us74_ait_amt + element.challanAmount;
            });
          }
          resolve();
          this.getTotalAmt();
        },
          error => {
            console.log(error['error'].errorMessage);
            this.toastr.error(error['error'].errorMessage, '', {
              timeOut: 3000,
            });
            this.getTotalAmt();
          });
    });
  }

  getTotalAit() {
    this.total_ait_amt = (this.total_car_ait_amt + this.total_us64_ait_amt);
  }

  getTotalAmt() {
    this.total_amt = (this.total_Source_tax + this.total_ait_amt + this.total_us74_ait_amt);
  }

  regularPaymentList() {
    this.totalRegularPaymentForList = 0;

    this.spinner.start();
    this.apiService.get(this.eReturnUrl + 'api/payment/get_client_payment')
      .subscribe(result => {
        // debugger;
        if (JSON.stringify(result) != '{}') {
          // console.log('payment status result', result);
          let paymentData = result["replyMessage"]["paymentDataList"];
          // console.log('paymentData', paymentData);
          if (result.success) {

            let PayAmount = 0; let dateOfPayment: any;
            paymentData.forEach(element => {
              PayAmount = PayAmount + element.amount;
              dateOfPayment = moment(element.dateTime, 'DD-MM-YYYY');
              let oRegularPayment = {
                "dateOfPayment": this.datepipe.transform(dateOfPayment, 'dd-MM-yyyy'),
                "paymentRef": element.transactionId,
                "amount": element.amount
              }
              this.allRegularPayments.push(oRegularPayment);
            });
            this.totalRegularPaymentForList = PayAmount;
          }
          this.spinner.stop();
        }
      },
        error => {
          this.spinner.stop();
          console.log(error['error'].errorMessage);
          // this.toastr.error(error['error'].errorMessage, '', {
          //   timeOut: 3000,
          // });
        });
  }

  onTdsClick(event: any, tdsModalShow) {
    this.changeTds(tdsModalShow);
  }

  changeTds(tdsModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(tdsModalShow, { class: 'modal-lg' });
  }

  close_Tds() {
    this.modalRef.hide();
  }

  verify_Tds() {
    this.toastr.success('Data verified successfully', '', {
      timeOut: 1000,
    });

    //#region navigate current url without reloading
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
    //#endregion

    this.close_Tds();
  }

  onBankClick(event: any, bankModalShow) {
    this.changeBank(bankModalShow);
  }

  changeBank(bankModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(bankModalShow, { class: 'modal-lg' });
  }

  close_Bank() {
    this.modalRef.hide();
  }

  verify_Bank() {
    this.toastr.success('Data verified successfully', '', {
      timeOut: 1000,
    });

    //#region navigate current url without reloading
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
    //#endregion

    this.close_Bank();
  }


  onSavingCertificateClick(event: any, SCModalShow) {
    this.changeSC(SCModalShow);
  }

  changeSC(SCModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(SCModalShow, { class: 'modal-lg' });
  }

  close_SC() {
    this.modalRef.hide();
  }

  verify_SC() {
    this.toastr.success('Data verified successfully', '', {
      timeOut: 1000,
    });

    //#region navigate current url without reloading
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
    //#endregion

    this.close_SC();
  }

  onOthersClick(event: any, othersModalShow) {
    this.changeOthers(othersModalShow);
  }

  changeOthers(othersModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(othersModalShow, { class: 'modal-lg' });
  }

  close_Others() {
    this.modalRef.hide();
  }

  onPCOClick(event: any, pcoModalShow) {
    this.changePCO(pcoModalShow);
  }

  changePCO(pcoModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(pcoModalShow, { class: 'modal-lg' });
  }

  close_PCO() {
    this.modalRef.hide();
  }

  verify_PCO() {
    this.toastr.success('Data verified successfully', '', {
      timeOut: 1000,
    });

    //#region navigate current url without reloading
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
    //#endregion

    this.close_PCO();
  }

  onUS_64Click(event: any, us64ModalShow) {
    this.changeUS_64(us64ModalShow);
  }

  changeUS_64(us64ModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(us64ModalShow, { class: 'modal-lg' });
  }

  close_US_64() {
    this.modalRef.hide();
  }

  onUS_74Click(event: any, us74ModalShow) {
    this.changeUS_74(us74ModalShow);
  }

  changeUS_74(us74ModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(us74ModalShow, { class: 'modal-lg' });
  }

  close_US_74() {
    this.modalRef.hide();
  }

  onRegularPaymentClick(event: any, regularPaymentModalShow) {
    this.changeRegularPayment(regularPaymentModalShow);
  }

  changeRegularPayment(regularPaymentModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(regularPaymentModalShow, { class: 'modal-lg' });
  }

  close_RegularPayment() {
    this.modalRef.hide();
  }


  goToEReturn() {
    // this.toastr.success('Worked', '', {
    //   timeOut: 3000,
    // });

    // const frame = document.getElementById('ifr');
    // if (this.isIFrame(frame) && frame.contentWindow) {
    //   frame.contentWindow.postMessage(this.token, this.eReturnPortalBaseUrl);
    // }

    // debugger;
    // let sourceUrl = localStorage.getItem('sourceUrl') ? localStorage.getItem('sourceUrl') : null;

    // if (sourceUrl != null) {
    //   if (sourceUrl === '/user-panel/basic-query-taxpayer') {
    //     window.location.href = this.eReturnPortalBaseUrl + '/#/user-panel/assessment';
    //   } else {
    //     let destUrl = this.eReturnPortalBaseUrl + '/#' + sourceUrl;
    //     window.location.href = destUrl;
    //   }

    // } else {
    //   window.location.href = this.eReturnPortalBaseUrl + '/#/user-panel/home';
    // }


    //temporary added
    // window.location.href = this.eReturnPortalBaseUrl + '/#/user-panel/tax-and-payment';

    //newly added
   // window.location.href = this.eReturnPortalBaseUrl + '/#/eLedger-login' + '?' + 'session_id=' + btoa(this.token);
   this.getRequestSessionID();
  }

  getRequestSessionID()
  {
    this.spinner.start();
    this.apiService.get(this.serviceUrl + 'api/session-guid/'+this.refresh_Token)
      .subscribe(result => {
        if(result.success)
           this.requestSessionID = result.replyMessage;
           window.location.href = this.eReturnPortalBaseUrl + '/#/eLedger-login' + '?' + 'session_id=' + result.replyMessage;

           this.spinner.stop();
      },
        error => {
          this.spinner.stop();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 1000,
          });
        });
  }

  // goToSource() {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.yourIFrameUrl);
  // }


}
