import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-challan-approval',
  templateUrl: './challan-approval.component.html',
  styleUrls: ['./challan-approval.component.scss']
})
export class ChallanApprovalComponent implements OnInit {

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  challanApproveList = [];
  challanPendingList = [];
  challanRejectList = [];

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private router: Router,
  ) 
  { 
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.challanPendingList = [
      {
         "com_name": "Synesis IT Limited",
         "win_no": "5199191227",
         "challan_date" : "04-09-2020",
         "challan_code" : "CRER390",
         "amount" : 11500,
         "challan_details":"",
         "challan_approve_id":9
      },
      {
        "com_name": "Brain Station 23 Limtied",
        "win_no": "5199191228",
        "challan_date" : "15-10-2020",
        "challan_code" : "CRER391",
        "amount" : 7500,
        "challan_details":"",
        "challan_approve_id":10
     },
     {
      "com_name": "Square InformatiX Ltd.",
      "win_no": "5199191231",
      "challan_date" : "22-10-2020",
      "challan_code" : "CRER399",
      "amount" : 2200,
      "challan_details":"",
      "challan_approve_id":15
   },
   {
    "com_name": "BJIT Limited",
    "win_no": "5199191232",
    "challan_date" : "24-10-2020",
    "challan_code" : "CRER3100",
    "amount" : 3500,
    "challan_details":"",
    "challan_approve_id":16
  }
    ];

    this.challanApproveList = [
     {
      "com_name": "Cefalo",
      "win_no": "5199191229",
      "challan_date" : "10-11-2020",
      "challan_code" : "CRER392",
      "amount" : 2500,
      "challan_details":"",
      "challan_approve_id":11
     }
    ];

    this.challanRejectList = [
     {
      "com_name": "Orion Informatics Ltd",
      "win_no": "5199191230",
      "challan_date" : "21-12-2020",
      "challan_code" : "CRER395",
      "amount" : 5500,
      "challan_details":"",
      "challan_approve_id":12
     }
    ]
  }


  approveChallan(index)
  {
    this.challanPendingList.forEach((element,i) => {
         if(index == i)
         {
           this.challanApproveList.push(element);
           this.challanPendingList.splice(index,1);
         }
    });
     
  }

  rejectChallan(index)
  {
    this.challanPendingList.forEach((element,i) => {
      if(index == i)
      {
        this.challanRejectList.push(element);
        this.challanPendingList.splice(index,1);
      }
 });
  }

}
