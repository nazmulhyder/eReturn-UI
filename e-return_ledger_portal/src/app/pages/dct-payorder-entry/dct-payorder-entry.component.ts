import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dct-payorder-entry',
  templateUrl: './dct-payorder-entry.component.html',
  styleUrls: ['./dct-payorder-entry.component.scss']
})
export class DctPayorderEntryComponent implements OnInit {

  payOrderEntryForm: FormGroup;

  payOrderEntryGetData:any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
    this.payOrderEntryForm = fb.group({
      date: ['', Validators.required],
      bank: ['0', Validators.required],
      branch: ['0', Validators.required],
      poNo: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPayOrderEntryData();
  }

  getPayOrderEntryData(){
    this.payOrderEntryGetData=[
      {
        "bank": 'Dhaka Bank',
        "branch":'Dhaka',
        "date":'21-06-2021',
        "poNo": '185036672',
        "amount": '200000'
      },
    ]
  }

  submittedData() {

    let obj={
      "bank": this.payOrderEntryForm.value.bank ,
      "branch": this.payOrderEntryForm.value.branch,
      "date": '14-07-2021',
      "poNo": this.payOrderEntryForm.value.poNo,
      "amount": this.payOrderEntryForm.value.amount
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
        bank: '0',
        branch: '0',
      }
    )
  }

}
