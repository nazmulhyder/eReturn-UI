import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approval-request-list',
  templateUrl: './approval-request-list.component.html',
  styleUrls: ['./approval-request-list.component.scss']
})
export class ApprovalRequestListComponent implements OnInit {

  approvalRequestGetData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.getApprovalRequestData();
  }

  getApprovalRequestData() {
    this.approvalRequestGetData = [
      {
        "userId":'IC001DHK01',
        "designation": 'Inspector',
        "tinNo": '234678378252',
        "taxpayerName": 'Saurav Saha',
      },
      {
        "userId":'IC002DHK01',
        "designation": 'Inspector',
        "tinNo": '196890847278',
        "taxpayerName": 'Md. Khademul Islam Chowdhury',
      },
      {
        "userId":'IC003DHK01',
        "designation": 'Inspector',
        "tinNo": '654345424977',
        "taxpayerName": 'Md. Sazidur Rahman',
      }
    ]
  }

  approveRequest(i) {
    this.approvalRequestGetData.splice(i, 1);
    this.toastr.success('Approved!', '', {
      timeOut: 2000,
    });
  }

}
