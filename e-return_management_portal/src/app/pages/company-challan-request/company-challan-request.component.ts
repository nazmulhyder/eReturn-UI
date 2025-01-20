import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-company-challan-request',
  templateUrl: './company-challan-request.component.html',
  styleUrls: ['./company-challan-request.component.scss']
})
export class CompanyChallanRequestComponent implements OnInit {

  challanListForm: FormGroup;
  ApproveForm: FormGroup;

  companyChallanGetData: any;
  companyChallanVerify = [];
  detailsData: any;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {
    this.challanListForm = fb.group({
    });
    this.ApproveForm = fb.group({
      id: [''],
      companyName: [''],
      winNo: [''],
      assessmentYear: [''],
      challanDate: [''],
      challanNo: [''],
      section: [''],
      codeNo: [''],
      amount: [''],
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.getCompanyChallanData();
    this.detailsData = [
      {
        "personName": "Saurav Saha",
        "personTin": "234678378252",
        "challanAmount": "1000000",
      }
    ]
    this.spinner.stop();
  }

  getCompanyChallanData() {
    this.companyChallanGetData = [
      {
        "assessmentYear": '2021-2022',
        "winNo": '5199191227',
        "companyName": "Synesis IT",
        "challanNo": '1130224377',
        "challanDate": '10-06-2021',
        "amount": '1000000',
      },
      {
        "assessmentYear": '2021-2022',
        "winNo": '5199191531',
        "companyName": "Cefalo Bangladesh Ltd.",
        "challanNo": '1130224378',
        "challanDate": '07-05-2021',
        "amount": '500000',
      },
      {
        "assessmentYear": '2021-2022',
        "winNo": '5199178352',
        "companyName": "Ixora Solution Ltd.",
        "challanNo": '1130224379',
        "challanDate": '08-05-2021',
        "amount": '1500000',
      }
    ]
  }

  companyChallanConfirmation(i) {
    this.companyChallanGetData.splice(i, 1);
    this.toastr.success('Verified!', '', {
      timeOut: 2000,
    });
    this.modalRef.hide();
  }

  goToDetailsPage(event: any) {
    this.router.navigateByUrl("/pages/company-challan-details");
  }

  onClickCompanyChallanConfirmation(event: any, index, confirmationModalShow) {
    this.ApproveForm.patchValue({
      id: [''],
      companyName: [''],
      winNo: [''],
      assessmentYear: [''],
      challanDate: [''],
      challanNo: [''],
      section: [''],
      codeNo: [''],
      amount: [''],
    })
    this.ApproveForm.get("id").setValue(index);
    this.ApproveForm.get("companyName").setValue("Synesis IT Ltd.");
    this.ApproveForm.get("winNo").setValue("5199191227");
    this.ApproveForm.get("assessmentYear").setValue("2021-2022");
    this.ApproveForm.get("challanDate").setValue("13-07-2021");
    this.ApproveForm.get("challanNo").setValue("1130224377");
    this.ApproveForm.get("section").setValue("Salary [ Section-50]");
    this.ApproveForm.get("codeNo").setValue("1-1145-0010-0101");
    this.ApproveForm.get("amount").setValue("1000000");
    this.changeConfirmation(confirmationModalShow);
  }

  changeConfirmation(confirmationModalShow: TemplateRef<any>) {
    this.modalRef = this.modalService.show(confirmationModalShow, { class: 'modal-lg' });
  }

  close_confirmation() {
    this.modalRef.hide();
  }

}
