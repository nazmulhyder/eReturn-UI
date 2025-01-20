import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TaxpayerProfileDetailsService {
  constructor() {}

  public taxpayerDetailList = [
    {
      id: 1,
      office_register_no: "1085-21-12-000001",
      tin: "243149308855",
      nid: "19742691650133406",
      name: "Shah Mohammad Itteda Hasan",
      spouse_name: "",
      father_name: "M.A Jalil",
      mother_name: "",
      circle: "085 (Salary)",
      zone: "04,Dhaka",
      resident: "",
      Assessment_year: "2021-2022",
      mobile: "01712006227",
      present_address:
        "Assroy-1, 14 North Road,New Market,Dhanmondi, Dhaka,PO-1205",
      permanent_address:
        "Holding # 8,Sadar Road,Notun Bazar Potuakhali Potualhali,PO-8600,Bangladesh",
      imgUrl: "assets/img/temp-profile-img/nbr-person.jpeg",
      taxable_income: "000.00",
      gross_wealth: "000.00",
      amount_of_tax: "000.00",
      source_of_income: "----",
      bank_and_challan_no: "----",
    },
    {
      id: 2,
      office_register_no: "1085-21-12-000002",
      tin: "243149308856",
      nid: "19742691650133407",
      name: "Nazmul Hyder",
      spouse_name: "",
      father_name: "Md. Nizam Uddin",
      mother_name: "Minara Begum",
      circle: "085 (Salary)",
      zone: "04,Dhaka",
      resident: "",
      Assessment_year: "2021-2022",
      mobile: "018300055496",
      present_address:
        "C/24,Block-E,Zakir Hossain Road,Lalmatia,Mohammadpur, Dhaka,PO-1215",
      permanent_address: "999,D/1,Muhuri Para,Agrabad,Chittagong",
      imgUrl: "assets/img/temp-profile-img/nazmul.JPG",
      taxable_income: "000.00",
      gross_wealth: "000.00",
      amount_of_tax: "000.00",
      source_of_income: "----",
      bank_and_challan_no: "----",
    },
  ];
}
