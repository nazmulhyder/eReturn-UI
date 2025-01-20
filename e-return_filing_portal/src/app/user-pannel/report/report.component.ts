import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  navActive = {};
  checkIsLoggedIn: any;
  incomeTypeList: object[] = [
    { name: 'Basic Pay', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Special Pay', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Arrear Pay', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Dearness Allowance', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'House Rent Allowance', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Medical Allowance', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Conveyance Allowance', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Festival Allowance', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Allowance for Support Stuff', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Honourium/Reward/Fee', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
    { name: 'Overtime Allowance', editable: false, exempted: 700000, taxable: 700000, saveBtn: true },
  ];

  constructor(private fb: FormBuilder,
    private router: Router,) {

  }

  ngOnInit(): void {
    this.navActiveSelect('one');
  }

  navActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.navActive = x;
  }

  editReport(value: string) {
    // find the required object index from array of objects
    const requiredObjIndx = this.incomeTypeList.findIndex((income, index) => income['name'] === value);

    // set the value in the index
    let newArray = this.incomeTypeList;
    newArray[requiredObjIndx] = { ...newArray[requiredObjIndx], editable: !newArray[requiredObjIndx]['editable'], saveBtn: !newArray[requiredObjIndx]['saveBtn'] }
    this.incomeTypeList = newArray;
  }

  confirmReport(value: object) {
    this.updateReport(value['ex'].value, value['name'], 'ex');
    this.updateReport(value['tx'].value, value['name'], 'tx');
    this.editReport(value['name']);
  }

  updateReport(value: string, incomeType: string, type: string) {
    // find the required object index from array of objects
    const requiredObjIndx = this.incomeTypeList.findIndex((income, index) => income['name'] === incomeType);

    // set the value in the index
    let newArray = this.incomeTypeList;
    if (type === 'ex') {
      newArray[requiredObjIndx] = { ...newArray[requiredObjIndx], exempted: value }
    } else {
      newArray[requiredObjIndx] = { ...newArray[requiredObjIndx], taxable: value }
    }
    this.incomeTypeList = newArray;
  }

  onBackPage(){
    
  }

  onNextPage(){

  }
}
