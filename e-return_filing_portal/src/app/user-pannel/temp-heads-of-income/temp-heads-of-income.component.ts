import { Component, OnInit, ɵConsole } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable, of } from "rxjs";
import { HeadsOfIncomeService } from "../heads-of-income.service";

@Component({
  selector: "app-temp-heads-of-income",
  templateUrl: "./temp-heads-of-income.component.html",
  styleUrls: ["./temp-heads-of-income.component.css"],
})
export class TempHeadsOfIncomeComponent implements OnInit {
  showInput1: boolean = true;
  showInput2: boolean = true;
  showInput3: boolean = true;
  navActive = {};
  formArray: FormArray;
  incomeType: Observable<boolean>;
  html: any = `<span class="btn-block well-sm" style="margin-left: 20px">Never trust not sanitized HTML!!!</span>`;
  salaryFormGrp: FormGroup;
  showOtherCalc: Observable<boolean>;
  isVisibleIncomeTab: boolean = true;
  organizationTitle: string = "";
  isVisibleAddSalBtn: boolean = false;
  group: any = [];

  salaryExempted = [
    {
      label: "Yes",
      value: 1,
    },
    {
      label: "No",
      value: 2,
    },
  ];
  isVisibleForm: any;
  headsOfIncome = [];

  constructor(
    private fb: FormBuilder,
    private headService: HeadsOfIncomeService
  ) {
    /*this.formArray = this.fb.array([
      this.fb.group({
        employmentType: [],
        basicPay: [],
        houseRentAllowance: [],
        medicalAllowance: [],
        banglaNewYearAllowance: [],
        festivalBonus: [],
        recreationAllowance: [],
        educationAllowance: [],
        gpfInterest: [],
      })
    ])*/

    this.formArray = new FormArray([]);
  }

  insertFormGroupToArray() {
    this.group = new FormGroup({
      employmentType: new FormControl(0),
      organizationName: new FormControl(),
      basicPay: new FormControl(),
      houseRentAllowance: new FormControl(),
      medicalAllowance: new FormControl(),
      banglaNewYearAllowance: new FormControl(),
      festivalBonus: new FormControl(),
      recreationAllowance: new FormControl(),
      educationAllowance: new FormControl(),
      gpfInterest: new FormControl(),

      salaryExempte: new FormControl("2"),
      year: new FormControl("1"),
      ibas: new FormControl(),
      noCashBenefit: new FormControl(),
      rentFreeAcc: new FormControl(),
      concessionalRate: new FormControl(),
      facilityProvided: new FormControl(),
    });

    debugger;
    this.formArray.push(this.group);
    // this.formArray.controls.forEach((element, index) => {
    //    console.log(index,element);
    //    console.log(this.formArray.value[index].organizationName)
    // });

    // if(this.formArray.length>0)
    // {
    //   this.organizationTitle = this.formArray.value[this.formArray.length-2].organizationName;
    // }
    // else
    // {
    //   this.organizationTitle = this.formArray.value[this.formArray.length-1].organizationName;
    // }

    // console.log(this.organizationTitle);
    // console.log(this.formArray.length);
    // console.log(this.formArray.length - 1);
    // console.log(this.organizationTitle);
    // console.log(this.formArray.value[this.formArray.length - 1].organizationName);
    // this.organizationTitle = this.formArray.value[len].organizationName;
  }

  // changeOrganizationTab(event: any) {
  //   debugger;
  //   this.organizationTitle = event.target.value;
  //   console.log(this.organizationTitle);
  // }

  ngOnInit(): void {
    this.isVisibleForm = 0;
    this.navActiveSelect("1");
    this.insertFormGroupToArray();
    this.incomeType = of(true);
    this.getHeadsOfIncome();
    this.isVisibleAddSalBtn = true;
  }

  showInputFun(value: number) {
    switch (value) {
      case 1:
        this.showInput1 = !this.showInput1;
        break;
      case 2:
        this.showInput2 = !this.showInput2;
        break;
      case 3:
        this.showInput3 = !this.showInput3;
        break;
      default:
        break;
    }
  }

  navActiveSelect(value: string) {
    const x = {};
    x[value] = true;
    this.navActive = x;
  }

  scroll(e1: HTMLElement) {
    e1.scrollIntoView({ behavior: "smooth" });
  }

  removeOption() {
    this.formArray.removeAt(this.formArray.length - 1);
    if (this.formArray.length === this.isVisibleForm) {
      this.isVisibleForm = this.formArray.controls.length - 1;
    }
  }

  employmentTypeChange(event: any) {
    if (event.target.value === "1") {
      this.incomeType = of(true);
      this.isVisibleIncomeTab = false;
      this.isVisibleAddSalBtn = false;
    } else {
      this.incomeType = of(false);
      this.isVisibleIncomeTab = false;
      this.isVisibleAddSalBtn = false;
    }
  }

  salaryTypeChange(evt: any) {
    const target = evt.target;
    if (target.checked && evt.target.value === "1") {
      this.showOtherCalc = of(true);
    } else {
      this.showOtherCalc = of(false);
    }
  }

  selectedSalary(i: number) {
    this.isVisibleForm = i;
  }

  getHeadsOfIncome() {
    this.headsOfIncome = this.headService.getHeads();
  }
}
