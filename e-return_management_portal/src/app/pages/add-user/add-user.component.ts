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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  userGetData = [];
  userTypesData = [];
  zoneData = [];
  circleData = [];
  rangeData = [];
  detailsMappingData = [];
  private serviceUrl: string;
  isShowCircle: boolean = false;
  isShowRange: boolean = false;
  reqJson: any;
  data: any;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  reLeaseReqjson: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private modalService: BsModalService,
    private toastr: ToastrService) {
    this.addUserForm = fb.group({
      id: [''],
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      userType: ['0', Validators.required],
      zoneNo: ['0', Validators.required],
      circleNo: ['0'],
      rangeName: ['0'],
      mobileNo: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target != document.getElementById("mobileNo")) {
      if (this.addUserForm.get("mobileNo").value) {
        this.addUserForm.get("mobileNo").setValue(CommonService.removeZero(this.addUserForm.value.mobileNo));
      }
    }
  }

  ngOnInit(): void {
    this.spinner.start();
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.loadUserTypes();
    this.loadZone();
    this.spinner.stop();
  }

  numberOnly(event): boolean {
    return CommonService.numberOnly(event);
  }

  reset(userType) {
    this.addUserForm.reset();
    this.addUserForm.patchValue({
      userId: '',
      userName: '',
      userType: userType,
      zoneNo: '0',
      circleNo: '0',
      rangeName: '0',
      mobileNo: '',
    })
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
    if (event.target.value != 0) {
      if (event.target.value == "CIRCLE_INSPECTOR" || event.target.value == "CIRCLE_OFFICER") {
        this.isShowCircle = true;
        this.isShowRange = false;
      } else if (event.target.value == "RANGE_OFFICER") {
        this.isShowCircle = false;
        this.isShowRange = true;
      }
      else if (event.target.value == "ZONAL_HEAD") {
        this.isShowCircle = false;
        this.isShowRange = false;
      }
      this.loadUserData();
    }
    else {
      this.isShowCircle = false;
      this.isShowRange = false;
    }
    this.spinner.stop();
  }

  loadUserData() {
    this.userGetData = [];
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/active-users/details/' + this.addUserForm.value.userType)
      .subscribe(result => {
        console.log('getUserData response', result);
        if (result.replyMessage.length > 0) {
          this.userGetData = result.replyMessage;
          this.data = this.userGetData;
        }
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  loadZone() {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/zones-under-admin')
      .subscribe(result => {
        console.log('zoneData response', result);
        this.zoneData = result.replyMessage;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  onChangeZone(event: any) {
    this.spinner.start();
    this.loadCircle(event);
    this.loadRange(event);
    this.spinner.stop();
  }

  loadCircle(event: any) {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/circles/' + event.target.value)
      .subscribe(result => {
        console.log('circleData response', result);
        this.circleData = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  loadRange(event: any) {
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/ranges/' + event.target.value)
      .subscribe(result => {
        console.log('rangeData response', result);
        this.rangeData = result;
      },
        error => {
          console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage, '', {
            timeOut: 3000,
          });
        });
  }

  submittedData(userType) {
    this.spinner.start();
    if (this.addUserForm.value.userType == "CIRCLE_INSPECTOR" || this.addUserForm.value.userType == "CIRCLE_OFFICER") {
      this.reqJson = {
        "userIdentification": this.addUserForm.value.userId,
        "userName": this.addUserForm.value.userName,
        "phone": CommonService.addZero(this.addUserForm.value.mobileNo),
        "roles": [
          {
            "roleName": this.addUserForm.value.userType
          }
        ],
        "zoneNo": this.addUserForm.value.zoneNo,
        "circleNo": this.addUserForm.value.circleNo
      }
    }
    else if (this.addUserForm.value.userType == "RANGE_OFFICER") {
      this.reqJson = {
        "userIdentification": this.addUserForm.value.userId,
        "userName": this.addUserForm.value.userName,
        "phone": CommonService.addZero(this.addUserForm.value.mobileNo),
        "roles": [
          {
            "roleName": this.addUserForm.value.userType
          }
        ],
        "zoneNo": this.addUserForm.value.zoneNo,
        "rangeName": this.addUserForm.value.rangeName
      }
    }
    else if (this.addUserForm.value.userType == "ZONAL_HEAD") {
      this.reqJson = {
        "userIdentification": this.addUserForm.value.userId,
        "userName": this.addUserForm.value.userName,
        "phone": CommonService.addZero(this.addUserForm.value.mobileNo),
        "roles": [
          {
            "roleName": this.addUserForm.value.userType
          }
        ],
        "zoneNo": this.addUserForm.value.zoneNo,
      }
    }

    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/add-user', this.reqJson)
      .subscribe(result => {
        console.log('addUser response', result);
        this.toastr.success("Added successfully.", '', {
          timeOut: 3000,
        });
        this.loadUserData();
        this.reset(userType);
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


  onRelease(confirmationPopup, userIdentification) {
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

  Confirmation_Yes() {
    this.modalRef.hide();
    this.spinner.start();
    this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/admin-panel/admin/release-user', this.reLeaseReqjson)
      .subscribe(result => {
        console.log('reLeaseUser response', result);
        this.toastr.success("Released successfully.", '', {
          timeOut: 3000,
        });
        this.loadUserData();
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

  search(text: string) {
    if (this.userGetData.length > 0) {
      if (!text) {
        this.userGetData = this.data;
      } else {
        this.userGetData = this.data;
        this.userGetData = this.userGetData.filter((x) =>
          x.userIdentification.trim().toLowerCase().includes(text.trim().toLowerCase())
        );
      }
    }
  }

}
