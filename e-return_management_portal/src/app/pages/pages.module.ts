import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ParentAddComponent } from './access-control/parent/parent-add/parent-add.component';
import { ParentEditComponent } from './access-control/parent/parent-edit/parent-edit.component';
import { ParentListComponent } from './access-control/parent/parent-list/parent-list.component';
import { PermissionAddComponent } from './access-control/permission/permission-add/permission-add.component';
import { PermissionEditComponent } from './access-control/permission/permission-edit/permission-edit.component';
import { PermissionListComponent } from './access-control/permission/permission-list/permission-list.component';
import { ActionAddComponent } from './access-control/action/action-add/action-add.component';
import { ActionEditComponent } from './access-control/action/action-edit/action-edit.component';
import { ActionListComponent } from './access-control/action/action-list/action-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyChallanRequestComponent } from './company-challan-request/company-challan-request.component';
import { CompanyChallanDetailsComponent } from './company-challan-details/company-challan-details.component';
import { DctPayorderEntryComponent } from './dct-payorder-entry/dct-payorder-entry.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ChartsModule } from 'ng2-charts';
import { ReturnListComponent } from './return-list/return-list.component';
import { OthersRequestComponent } from './others-request/others-request.component';
import { TimeExtensionPendingListComponent } from './time-extension-pending-list/time-extension-pending-list.component';
import { FinalReturnViewComponent } from './final-return-view/final-return-view.component';
import { Acknowledgement941Component } from './final-return-view/acknowledgement941/acknowledgement941.component';
import { ReturnViewIT10BB20167Component } from './final-return-view/return-view-it10-bb20167/return-view-it10-bb20167.component';
import { ReturnView846Component } from './final-return-view/return-view846/return-view846.component';
import { ReturnView865Component } from './final-return-view/return-view865/return-view865.component';
import { ReturnView884Component } from './final-return-view/return-view884/return-view884.component';
import { ReturnView903Component } from './final-return-view/return-view903/return-view903.component';
import { ReturnView922Component } from './final-return-view/return-view922/return-view922.component';
import { ReturnView941Component } from './final-return-view/return-view941/return-view941.component';
import { SingleReturnViewComponent } from './final-return-view/single-return-view/single-return-view.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxPrintModule } from 'ngx-print';
import { ReportComponent } from './report/report.component';
import { SearchComponent } from './search/search.component';
import { AitUs64Component } from './ait-us64/ait-us64.component';
import { RegularTaxUs74Component } from './regular-tax-us74/regular-tax-us74.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { UserListComponent } from './user-control/user-list/user-list.component';
import { UserEditComponent } from './user-control/user-edit/user-edit.component';
import { UserRoleAssignComponent } from './user-control/user-role-assign/user-role-assign.component';
import { UserRoleAddComponent } from './user-roles/user-role-add/user-role-add.component';
import { UserRoleEditComponent } from './user-roles/user-role-edit/user-role-edit.component';
import { UserRoleListComponent } from './user-roles/user-role-list/user-role-list.component';
import { ApprovalRequestListComponent } from './approval-request-list/approval-request-list.component';
import { ApprovedReturnsComponent } from './approved-returns/approved-returns.component';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';
import { RequestApprovalComponent } from './request-approval/request-approval.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ReassignAdminComponent } from './reassign-admin/reassign-admin.component';
import { ReassignUserComponent } from './reassign-user/reassign-user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ReturnReportComponent } from './return-report/return-report.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReturnRegisterComponent } from './return-register/return-register.component';
import { LSelect2Module } from 'ngx-select2';
import { TimeExtensionApprovalStatusComponent } from './time-extension-approval-status/time-extension-approval-status.component';
import { ExtensionReportComponent } from './extension-report/extension-report.component';
import { FilingConfigurationComponent } from './filing-configuration/filing-configuration.component';
import { NonFilerTaxpayerListComponent } from './non-filer-taxpayer-list/non-filer-taxpayer-list.component';
import { TopIndividualTaxpayersByGrossWealthComponent } from './top-individual-taxpayers-by-gross-wealth/top-individual-taxpayers-by-gross-wealth.component';
import { TopIndividualTaxpayersByNetWealthComponent } from './top-individual-taxpayers-by-net-wealth/top-individual-taxpayers-by-net-wealth.component';
import { TopTaxpayersByGrossWealthLiabilityComponent } from './top-taxpayers-by-gross-wealth-liability/top-taxpayers-by-gross-wealth-liability.component';
import { TopFemaleTaxpayersByTaxPaidComponent } from './top-female-taxpayers-by-tax-paid/top-female-taxpayers-by-tax-paid.component';
import { TopMaleTaxpayersByTaxPaidComponent } from './top-male-taxpayers-by-tax-paid/top-male-taxpayers-by-tax-paid.component';
import { ReturnSummaryComponent } from './return-summary/return-summary.component';
import { NonFilerTaxpayerNoComponent } from './non-filer-taxpayer-no/non-filer-taxpayer-no.component';
import { TopIndividualTaxpayersByTaxPaidComponent } from './top-individual-taxpayers-by-tax-paid/top-individual-taxpayers-by-tax-paid.component';
import { TopCompanyTaxpayersByTaxPaidComponent } from './top-company-taxpayers-by-tax-paid/top-company-taxpayers-by-tax-paid.component';
import { TopSeniorCitizenTaxpayersByTaxPaidComponent } from './top-senior-citizen-taxpayers-by-tax-paid/top-senior-citizen-taxpayers-by-tax-paid.component';
import { TopTaxpayersBySurchargeComponent } from './top-taxpayers-by-surcharge/top-taxpayers-by-surcharge.component';
import { SurchargePayingTaxpayersNoComponent } from './surcharge-paying-taxpayers-no/surcharge-paying-taxpayers-no.component';
import { PaidTaxUs19AAAAANoComponent } from './paid-tax-us19-aaaaa-no/paid-tax-us19-aaaaa-no.component';
import { PaidTaxUs19AAAAAListComponent } from './paid-tax-us19-aaaaa-list/paid-tax-us19-aaaaa-list.component';
import { UploadOfflineDataComponent } from './upload-offline-data/upload-offline-data.component';
import { DataTablesModule } from 'angular-datatables';
import { LedgerConfigurationComponent } from './ledger-configuration/ledger-configuration.component';
import { UserManagementConfigurationComponent } from './user-management-configuration/user-management-configuration.component';
import { ManagementConfigurationComponent } from './management-configuration/management-configuration.component';
import { AuthenticationConfigurationComponent } from './authentication-configuration/authentication-configuration.component';
import { BasicConfigurationComponent } from './basic-configuration/basic-configuration.component';
import { ChallanApprovalComponent } from './challan-approval/challan-approval.component';
import { ChallanDetailsComponent } from './challan-details/challan-details.component';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ParentAddComponent,
    ParentEditComponent,
    ParentListComponent,
    PermissionAddComponent,
    PermissionEditComponent,
    PermissionListComponent,    
    ActionAddComponent,
    ActionEditComponent,
    ActionListComponent,
    CompanyChallanRequestComponent,
    CompanyChallanDetailsComponent,
    DctPayorderEntryComponent,
    ReturnListComponent,
    OthersRequestComponent,
    TimeExtensionPendingListComponent,
    FinalReturnViewComponent,
    Acknowledgement941Component,
    ReturnViewIT10BB20167Component,
    ReturnView846Component,
    ReturnView865Component,
    ReturnView884Component,
    ReturnView903Component,
    ReturnView922Component,
    ReturnView941Component,
    SingleReturnViewComponent,
    ReportComponent,
    SearchComponent,
    AitUs64Component,
    RegularTaxUs74Component,
    AlertListComponent,
    UserListComponent,
    UserEditComponent,
    UserRoleAssignComponent,
    UserRoleAddComponent,
    UserRoleEditComponent,
    UserRoleListComponent,
    ApprovalRequestListComponent,
    ApprovedReturnsComponent,
    PendingApprovalComponent,
    ApproveRequestComponent,
    RequestApprovalComponent,
    AddAdminComponent,
    AddUserComponent,
    ReassignAdminComponent,
    ReassignUserComponent,
    UserDashboardComponent,
    ReturnReportComponent,
    ChangePasswordComponent,
    ReturnRegisterComponent,
    TimeExtensionApprovalStatusComponent,
    ExtensionReportComponent,
    FilingConfigurationComponent,
    NonFilerTaxpayerListComponent,
    TopIndividualTaxpayersByGrossWealthComponent,
    TopIndividualTaxpayersByNetWealthComponent,
    TopTaxpayersByGrossWealthLiabilityComponent,
    TopFemaleTaxpayersByTaxPaidComponent,
    TopMaleTaxpayersByTaxPaidComponent,
    ReturnSummaryComponent,
    NonFilerTaxpayerNoComponent,
    TopIndividualTaxpayersByTaxPaidComponent,
    TopCompanyTaxpayersByTaxPaidComponent,
    TopSeniorCitizenTaxpayersByTaxPaidComponent,
    TopTaxpayersBySurchargeComponent,
    SurchargePayingTaxpayersNoComponent,
    PaidTaxUs19AAAAANoComponent,
    PaidTaxUs19AAAAAListComponent,
    UploadOfflineDataComponent,
    LedgerConfigurationComponent,
    UserManagementConfigurationComponent,
    ManagementConfigurationComponent,
    AuthenticationConfigurationComponent,
    BasicConfigurationComponent,
    ChallanApprovalComponent,
    ChallanDetailsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PagesRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    NgxUiLoaderModule,
    NgxPrintModule,
    LSelect2Module,
    DataTablesModule
  ]
})
export class PagesModule { }
