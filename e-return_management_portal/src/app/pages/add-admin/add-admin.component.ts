import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { threadId } from 'worker_threads';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommonService } from '../../custom-services/common.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  addAdminForm: FormGroup;
  adminGetData = [];
  getAdminTypes = [];
  zoneData = [];
  private serviceUrl: string;
  reLeaseReqjson:any;

  constructor(private fb: FormBuilder,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private toastr: ToastrService) {
    this.addAdminForm = fb.group({
      id: [''],
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      adminType: ['0', Validators.required],
      zoneNo: ['0', Validators.required],
      mobileNo: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target != document.getElementById("mobileNo")) {
      if (this.addAdminForm.get("mobileNo").value) {
        this.addAdminForm.get("mobileNo").setValue(CommonService.removeZero(this.addAdminForm.value.mobileNo));
      }
    }
  }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
     
    });
    this.loadAdminTypes();
    this.loadZone();
    this.loadActiveAdmin();
    this.spinner.stop();
  }

  numberOnly(event): boolean {
    return CommonService.numberOnly(event);
  }

  reset() {
    this.addAdminForm.reset();
    this.addAdminForm.patchValue({
      adminType: '0',
      zoneNo: '0',
    })
  }

  loadAdminTypes() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/super-admin/admin-types')
      .subscribe(result => {
        console.log('AdminTypes response', result);
        this.getAdminTypes = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  loadZone() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/zones')
      .subscribe(result => {
        console.log('zoneData response', result);
        this.zoneData = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  loadActiveAdmin() {
    this.adminGetData = [];
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/super-admin/active-admins')
      .subscribe(result => {
        console.log('ActiveAdmins response', result);
        if (result.replyMessage.length > 0) {
          this.adminGetData = result.replyMessage;
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  submittedData() {
    this.spinner.start();
    let reqjson = {
      "userIdentification": this.addAdminForm.value.userId,
      "userName": this.addAdminForm.value.userName,
      "phone": CommonService.addZero(this.addAdminForm.value.mobileNo),
      "roles": [
        {
          "roleName": this.addAdminForm.value.adminType
        }
      ],
      "zoneNo": this.addAdminForm.value.zoneNo,
    }
    // console.log('reqJson', reqjson);
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/super-admin/add-admin', reqjson)
      .subscribe(result => {
        console.log('AddAdmins response', result);
        this.toastr.success("Data saved successfully.", '', {
          timeOut: 2000,
        });
        this.reset();
        this.loadActiveAdmin();
        this.spinner.stop();
      },
        error => {
          this.spinner.stop();
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onRelease(confirmationPopup,userIdentification) {
    this.reLeaseReqjson = {
      "userIdentification": userIdentification,
    }
    this.confirmationPopup(confirmationPopup);

  }

  confirmationPopup(confirmationPopup: TemplateRef<any>) {
    this.modalRef = this.modalService.show(confirmationPopup, this.config);
  }

  No_Confirmation() {
    this.modalRef.hide();
  }

  Confirmation_Yes(){
    this.modalRef.hide();
    this.spinner.start();
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/super-admin/release-admin', this.reLeaseReqjson)
    .subscribe(result => {
      console.log('ReleaseAdmins response', result);
      this.toastr.success("Released successfully.", '', {
        timeOut: 2500,
      });
      this.loadActiveAdmin();
      this.spinner.stop();
    },
      error => {
        this.spinner.stop();
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].errorMessage, '', {
          timeOut: 3000,
        });
      });
  }

}
