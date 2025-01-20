import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-challan-details',
  templateUrl: './challan-details.component.html',
  styleUrls: ['./challan-details.component.scss']
})
export class ChallanDetailsComponent implements OnInit {

  challanDetails = [];

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  companyWin : any;
  companyName : any;

  constructor(
    private activeRoutes: ActivatedRoute,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.companyWin = this.activeRoutes.snapshot.paramMap.get("win");

    if(this.companyWin == '5199191227')
    {
      this.companyName = "Synesis IT Limited";
      this.challanDetails = [
        {
           "name" : "MD Rasel",
           "tin" :"705432875432",
           "amount" : 2000,
        },
        {
          "name" : "Nazmul Hyder",
          "tin" :"123585235764",
          "amount" : 6000,
       },
       {
        "name" : "MRS Hasna Khatun",
        "tin" :"233832875432",
        "amount" : 3500,
     },
      ];
    }
    if(this.companyWin == '5199191228')
    {
      this.companyName = "Brain Station 23 Limited";
      this.challanDetails = [
        {
           "name" : "MD Shohel",
           "tin" :"675432875432 ",
           "amount" : 1000,
        },
        {
          "name" : "Nazmul Hyder",
          "tin" :"123585235764",
          "amount" : 5000,
       },
       {
        "name" : "MD Hasan",
        "tin" :"234102875432 ",
        "amount" : 1500,
     },
      ];
    }
    if(this.companyWin == '5199191229')
    {

      this.companyName = "Cefalo";
      this.challanDetails = [
        {
           "name" : "Ishtiaque Irteza",
           "tin" :"234678378252 ",
           "amount" : 2500,
        },
      ];
    }
    if(this.companyWin == '5199191230')
    {
      this.companyName = "Orion Informatics Ltd.";
      this.challanDetails = [
        {
           "name" : "Sazid Ahmed",
           "tin" :"234678378456 ",
           "amount" : 5500,
        },
      ];
    }
 
    if(this.companyWin == '5199191231')
    {
      this.companyName = "Square InformatiX Ltd.";
      this.challanDetails = [
        {
           "name" : "Habibur Rahman",
           "tin" :"234678333436 ",
           "amount" : 2200,
        },
      ];
    }

    if(this.companyWin == '5199191232')
    {
      this.companyName = "BJIT Limited";
      this.challanDetails = [
        {
           "name" : "Saifuddin Mohammad Tareq",
           "tin" :"543218333436 ",
           "amount" : 3500,
        },
      ];
    }
 

    console.log('companyWin', this.companyWin);
  }

}
