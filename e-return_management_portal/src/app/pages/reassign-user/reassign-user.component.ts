import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { CommonService } from '../../custom-services/common.service';

@Component({
  selector: 'app-reassign-user',
  templateUrl: './reassign-user.component.html',
  styleUrls: ['./reassign-user.component.scss']
})
export class ReassignUserComponent implements OnInit {
  inActiveUserForm: FormGroup;
  reAssignUserForm: FormGroup;
  userGetData = [];
  userTypesData = [];
  detailsMappingData = [];
  private serviceUrl: string;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(private fb: FormBuilder,
    private router: Router,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private modalService: BsModalService,
    private toastr: ToastrService) {
    this.inActiveUserForm = fb.group({
      userType: ['0', Validators.required],
    });
    this.reAssignUserForm = fb.group({
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      mobileNo: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target != document.getElementById("mobileNo")) {
      if (this.reAssignUserForm.get("mobileNo").value) {
        this.reAssignUserForm.get("mobileNo").setValue(CommonService.removeZero(this.reAssignUserForm.value.mobileNo));
      }
    }
  }

  ngOnInit(): void {

    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.loadUserTypes();
    this.spinner.stop();
  }

  loadUserTypes() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/roles-under-admin')
      .subscribe(result => {
        console.log('UserTypes response', result);
        this.userTypesData = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onChangeUserType(event: any) {
    this.spinner.start();
    this.loadInactiveUserData();
    this.spinner.stop();
  }

  loadInactiveUserData() {
    this.userGetData=[];
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/inactive-users/details/' + this.inActiveUserForm.value.userType)
      .subscribe(result => {
        console.log('getUserData response', result);
        if (result.replyMessage.length > 0) {
          this.userGetData = result.replyMessage;
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onclickDetails(detailsModal, userIdentification) {
    this.spinner.start();
    this.loadMappingDetails(userIdentification);
    this.openModal(detailsModal);
    this.spinner.stop();
  }

  openModal(detailsModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(detailsModal, { class: 'modal-lg' });
  }

  close_details() {
    this.modalRef.hide();
  }

  loadMappingDetails(userIdentification) {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/user-zone-circle-mappings/' + userIdentification)
      .subscribe(result => {
        console.log('mappingData response', result);
        this.detailsMappingData = result.replyMessage;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onReassign(assignModal, userIdentification) {
    this.reAssignUserForm.patchValue({
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
      "userIdentification": this.reAssignUserForm.value.userId,
      "userName": this.reAssignUserForm.value.userName,
      "phone": CommonService.addZero(this.reAssignUserForm.value.mobileNo),
    }
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/assign-user', reqjson)
    .subscribe(result => {
      console.log('AssignAdmins response', result);
      this.toastr.success("Assigned successfully.", '', {
        timeOut: 2000,
      });
      this.modalRef.hide();
      this.loadInactiveUserData();
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

  numberOnly(event): boolean {
    return CommonService.numberOnly(event);
  }

}
