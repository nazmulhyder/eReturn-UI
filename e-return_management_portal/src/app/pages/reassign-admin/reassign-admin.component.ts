import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommonService } from '../../custom-services/common.service';

@Component({
  selector: 'app-reassign-admin',
  templateUrl: './reassign-admin.component.html',
  styleUrls: ['./reassign-admin.component.scss']
})
export class ReassignAdminComponent implements OnInit {
  reAssignAdminForm: FormGroup;
  getInactiveAdminData = [];
  private serviceUrl: string;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    private fb: FormBuilder,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService) {
    this.reAssignAdminForm = fb.group({
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      mobileNo: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target != document.getElementById("mobileNo")) {
      if (this.reAssignAdminForm.get("mobileNo").value) {
        this.reAssignAdminForm.get("mobileNo").setValue(CommonService.removeZero(this.reAssignAdminForm.value.mobileNo));
      }
    }
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.loadInactiveAdminList();
  }

  numberOnly(event): boolean {
    return CommonService.numberOnly(event);
  }

  loadInactiveAdminList() {
    this.getInactiveAdminData = [];
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/super-admin/inactive-admins')
      .subscribe(result => {
        console.log('InactiveAdminList response', result);
        if (result.replyMessage.length > 0) {
          this.getInactiveAdminData = result.replyMessage;
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onReassign(assignModal, userIdentification) {
    this.reAssignAdminForm.patchValue({
      userId: userIdentification,
    })
    this.openAssignModal(assignModal);
  }

  openAssignModal(assignModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(assignModal, this.config);
  }

  close_assign() {
    this.modalRef.hide();
  }

  onAssign(){
    this.spinner.start();
    let reqjson = {
      "userIdentification": this.reAssignAdminForm.value.userId,
      "userName": this.reAssignAdminForm.value.userName,
      "phone": CommonService.addZero(this.reAssignAdminForm.value.mobileNo),
    }
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/super-admin/assign-admin', reqjson)
    .subscribe(result => {
      console.log('AssignAdmins response', result);
      this.toastr.success("Assigned successfully.", '', {
        timeOut: 2000,
      });
      this.reset();
      this.modalRef.hide();
      this.loadInactiveAdminList();
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
  reset(){
    this.reAssignAdminForm.reset();
  }

}
