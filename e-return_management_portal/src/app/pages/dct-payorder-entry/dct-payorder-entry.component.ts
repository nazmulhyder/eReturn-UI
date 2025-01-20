import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dct-payorder-entry',
  templateUrl: './dct-payorder-entry.component.html',
  styleUrls: ['./dct-payorder-entry.component.scss']
})
export class DctPayorderEntryComponent implements OnInit {

  payOrderEntryForm: FormGroup;

  payOrderEntryGetData: any;
  isHidden: boolean = false;
  isShow: boolean = true;

  constructor(private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService) {
    this.payOrderEntryForm = fb.group({
      searchTIN: [''],
      taxpayerName: ['', Validators.required],
      pobank: ['0', Validators.required],
      pobranch: ['0', Validators.required],
      podate: ['', Validators.required],
      poNo: ['', Validators.required],
      poamount: ['', Validators.required],
      challandate: ['', Validators.required],
      depositedin: ['CASH'],
      challanbank: ['0', Validators.required],
      challandistrict: ['0'],
      challanbranch: ['0', Validators.required],
      challanNo: [''],
    });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.getPayOrderEntryData();
    this.spinner.stop();
  }

  getPayOrderEntryData() {
    this.payOrderEntryGetData = [
      {
        "tinNo": '452682472561',
        "taxpayerName": 'Md. Nazmul Alom',
        "poNo": '185036672',
        "challanNo": "235667132",
        "amount": '200000'
      },
    ]
  }

  submittedData() {

    let obj = {
      "tinNo": this.payOrderEntryForm.value.searchTIN,
      "taxpayerName": this.payOrderEntryForm.value.taxpayerName,
      "poNo": this.payOrderEntryForm.value.poNo,
      "challanNo": this.payOrderEntryForm.value.challanNo,
      "amount": this.payOrderEntryForm.value.poamount
    }

    this.payOrderEntryGetData.push(obj);

    this.toastr.success('Data saved successfully', '', {
      timeOut: 1000,
    });

    this.reset();

  }

  reset() {
    this.payOrderEntryForm.reset();
    this.payOrderEntryForm.patchValue(
      {
        pobank: '0',
        pobranch: '0',
        challanbank: '0',
        challandistrict: '0',
        challanbranch: '0',
        depositedin: 'CASH',
      }
    )
  }

  onSearch(tin: any) {
    if (tin.length == 12) {
      if (tin == '234678378252') {
        this.payOrderEntryForm.patchValue({ taxpayerName: 'Saurav Saha' })
      } else if (tin == '196890847278') {
        this.payOrderEntryForm.patchValue({ taxpayerName: 'Md. Khademul Islam Chowdhury' })
      }
      else if (tin == '654345424977') {
        this.payOrderEntryForm.patchValue({ taxpayerName: 'Md. Sazidur Rahman' })
      }
    }
    else {
      this.payOrderEntryForm.patchValue({ taxpayerName: '' })
    }
  }

  bankChange(event: any) {
    if (event.target.value == 'Sonali Bank') {
      this.isHidden = true;
      this.isShow = false;
    }
    else {
      this.isHidden = false;
      this.isShow = true;
    }
  }

}
