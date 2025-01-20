import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';
import { CommonUtilService } from '../../../custom-services/utils/common.utils';

@Component({
  selector: 'app-paid-car-ownership',
  templateUrl: './paid-car-ownership.component.html',
  styleUrls: ['./paid-car-ownership.component.scss']
})
export class PaidCarOwnershipComponent implements OnInit {

  public paidCarOwnershipForm: FormGroup;
  carTDSForm: FormGroup;
  carGetData: any;
  carConfirmCheck = [];
  isHidden: boolean = true;

  winOrTinNo: any;
  userCarInfos: any;

  private serviceUrl: string;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  html = `<span class="btn-block well-sm";">No Tooltip Found!</span>`;
  regNoTooltip = `<span class="btn-block well-sm";">Select the section from the dropdown list under which source tax was paid by you.</span>`;
  claimAmountTooltip = `<span class="btn-block well-sm";">Enter the amount of AIT paid against the car under this entry.</span>`;
  searchBtnTooltip = `<span class="btn-block well-sm";">Get info from the relevant office’s database.</span>`;
  resetBtnTooltip = `<span class="btn-block well-sm";">Use RESET button for another car or for a new entry.</span>`;

  constructor(private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public spinner: NgxUiLoaderService,
    public apiService: ApiService,
    public apiUrl: ApiUrl,
    public commonUtilService: CommonUtilService) {

    this.paidCarOwnershipForm = fb.group({
      // tin: ['', Validators.required],
      assessmentYear: ['2021-2022', Validators.required],
      regNo: ['', Validators.required],
      // carName: ['', Validators.required],
      // licenseNo: ['', Validators.required],
      // section: ['0', Validators.required],
      // amount: ['', Validators.required],
      claimAmount: ['', Validators.required]
    });

    this.carTDSForm = fb.group({
      assessmentYear: ['2021-2022'],
      brandName: ['Toyota Corolla'],
      engine: ['1800'],
      regNo: ['322678811'],
      tdsAmount: ['2000']
    });

  }

  ngOnInit(): void {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });

    this.winOrTinNo = localStorage.getItem('winOrTinNo');

    // temporary comment
    // this.getUserCarInfos();

    //temporary added
    this.spinner.start();
    this.spinner.stop();

  }

  getUserCarInfos() {

    this.spinner.start();

    this.apiService.get(this.serviceUrl + 'api/ait/car')
      .subscribe(result => {

        this.userCarInfos = result;
        this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

  getUserCarInfoByRegistrationNo(event: any, searchModalShow) {

    this.spinner.start();

    this.apiService.get(this.serviceUrl + 'api/ait/car/' + this.paidCarOwnershipForm.value.regNo.trim())
      .subscribe(result => {

        this.carTDSForm.get('assessmentYear').setValue(result.assessmentYr);
        this.carTDSForm.get('brandName').setValue(result.brandName);
        this.carTDSForm.get('engine').setValue(result.engineCapacity);
        this.carTDSForm.get('regNo').setValue(result.registrationNo);
        this.carTDSForm.get('tdsAmount').setValue(result.tdsClaimAmount);

        this.changeSearch(searchModalShow);

        this.spinner.stop();

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        },

        () => {
          //on complete
        }

      );

  }

  commaSeperator(value: number): string {

    let valueStr: string = value.toString();
    let finalStr: string = "";
    let length = valueStr.length;

    if (length > 3) {

      finalStr = "," + (valueStr[length - 3] + valueStr[length - 2] + valueStr[length - 1]) + finalStr;
      length -= 3; console.log(finalStr); console.log(length);

      while (length > 2) {

        finalStr = "," + (valueStr[length - 2] + valueStr[length - 1]) + finalStr;
        length -= 2;

      } console.log(finalStr); console.log(length);

      length--;

      while (length >= 0) {

        finalStr = valueStr[length] + finalStr;
        length -= 1;

      } console.log(finalStr); console.log(length);


      return finalStr;

    }
    else {
      return valueStr;
    }

  }

  commaRemover(value: string): string {
    return value.replaceAll(",", '');
  }

  check(event: any) {
    let value = this.commaSeperator(this.randomNumberGenerator(1000, 15000)); console.log(value);
    this.carTDSForm.get("tdsAmount").setValue(value);
  }

  randomNumberGenerator(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + 0);
  }

  onValueChange(event: any) {
    event.target.value = CommonUtilService.commaSeperator(event.target.value);
  }

  search(event: any, searchModalShow) {

    // let value = this.commaSeperator(500);console.log(value);

    this.spinner.start();

    this.carTDSForm.get("regNo").setValue(this.paidCarOwnershipForm.value.regNo);
    this.changeSearch(searchModalShow);

    this.spinner.stop();

  }

  changeSearch(searchModalShow: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(searchModalShow,{class: 'modal-lg'});
    this.modalRef = this.modalService.show(searchModalShow, this.config);
  }

  close_Search() {
    this.modalRef.hide();
  }


  reset() {
    this.paidCarOwnershipForm.reset();
    this.paidCarOwnershipForm.patchValue(
      {
        // section: '0',
        assessmentYear: '2021-2022'
      }
    )
  }

  // keyUpClaimAmt(event:any){
  //   if (event.target.value>1480) {
  //     this.toastr.warning('Claim amount can not be greater than payment amount', '', {
  //       timeOut: 3000,
  //     });
  //     this.paidCarOwnershipForm.patchValue({
  //       claimAmount: 0,
  //     })
  //   }
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    // if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57))
    {
      return false;
    }
    return true;
  }

  saveData() {

    // let obj={
    //   "tin": this.winOrTinNo,
    //   "assessmentYr": this.paidCarOwnershipForm.value.assessmentYear,
    //   "brandName": this.paidCarOwnershipForm.value.brandName,
    //   "engineCapacity": this.paidCarOwnershipForm.value.engine,
    //   "registrationNo": this.paidCarOwnershipForm.value.regNo,
    //   "tdsClaimAmount": this.paidCarOwnershipForm.value.claimAmount
    // }

    let obj = {
      "tin": this.winOrTinNo,
      "assessmentYr": this.carTDSForm.value.assessmentYear,
      "brandName": this.carTDSForm.value.brandName,
      "engineCapacity": this.carTDSForm.value.engine,
      "registrationNo": this.carTDSForm.value.regNo,
      "tdsClaimAmount": this.commaRemover(this.carTDSForm.value.tdsAmount)
    }; console.log(obj);


    this.spinner.start();

    this.apiService.post(this.serviceUrl + 'api/ait/car', obj)
      .subscribe(result => {

        this.userCarInfos.push(obj);

        this.reset();
        this.isHidden = true;
        this.close_Search();
        this.spinner.stop();

        this.toastr.success(result.message, '', {
          timeOut: 1000
        });

      },
        error => {

          this.spinner.stop();

          this.toastr.error(error['error'].errorMessage, 'Error', {
            timeOut: 1000
          });

        });

  }

}
