import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionAddComponent } from './access-control/action/action-add/action-add.component';
import { ActionEditComponent } from './access-control/action/action-edit/action-edit.component';
import { ActionListComponent } from './access-control/action/action-list/action-list.component';
import { ParentAddComponent } from './access-control/parent/parent-add/parent-add.component';
import { ParentEditComponent } from './access-control/parent/parent-edit/parent-edit.component';
import { ParentListComponent } from './access-control/parent/parent-list/parent-list.component';
import { PermissionAddComponent } from './access-control/permission/permission-add/permission-add.component';
import { PermissionEditComponent } from './access-control/permission/permission-edit/permission-edit.component';
import { PermissionListComponent } from './access-control/permission/permission-list/permission-list.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AitUs64Component } from './ait-us64/ait-us64.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { ApprovalRequestListComponent } from './approval-request-list/approval-request-list.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';
import { ApprovedReturnsComponent } from './approved-returns/approved-returns.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CompanyChallanDetailsComponent } from './company-challan-details/company-challan-details.component';
import { CompanyChallanRequestComponent } from './company-challan-request/company-challan-request.component';
import { FilingConfigurationComponent } from './filing-configuration/filing-configuration.component';
import { DctPayorderEntryComponent } from './dct-payorder-entry/dct-payorder-entry.component';
import { ExtensionReportComponent } from './extension-report/extension-report.component';
import { FinalReturnViewComponent } from './final-return-view/final-return-view.component';
import { HomeComponent } from './home/home.component';
import { NonFilerTaxpayerListComponent } from './non-filer-taxpayer-list/non-filer-taxpayer-list.component';
import { NonFilerTaxpayerNoComponent } from './non-filer-taxpayer-no/non-filer-taxpayer-no.component';
import { OthersRequestComponent } from './others-request/others-request.component';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { ReassignAdminComponent } from './reassign-admin/reassign-admin.component';
import { ReassignUserComponent } from './reassign-user/reassign-user.component';
import { RegularTaxUs74Component } from './regular-tax-us74/regular-tax-us74.component';
import { ReportComponent } from './report/report.component';
import { RequestApprovalComponent } from './request-approval/request-approval.component';
import { ReturnListComponent } from './return-list/return-list.component';
import { ReturnRegisterComponent } from './return-register/return-register.component';
import { ReturnReportComponent } from './return-report/return-report.component';
import { ReturnSummaryComponent } from './return-summary/return-summary.component';
import { SearchComponent } from './search/search.component';
import { TimeExtensionApprovalStatusComponent } from './time-extension-approval-status/time-extension-approval-status.component';
import { TimeExtensionPendingListComponent } from './time-extension-pending-list/time-extension-pending-list.component';
import { TopFemaleTaxpayersByTaxPaidComponent } from './top-female-taxpayers-by-tax-paid/top-female-taxpayers-by-tax-paid.component';
import { TopTaxpayersByGrossWealthLiabilityComponent } from './top-taxpayers-by-gross-wealth-liability/top-taxpayers-by-gross-wealth-liability.component';
import { TopIndividualTaxpayersByGrossWealthComponent } from './top-individual-taxpayers-by-gross-wealth/top-individual-taxpayers-by-gross-wealth.component';
import { TopIndividualTaxpayersByNetWealthComponent } from './top-individual-taxpayers-by-net-wealth/top-individual-taxpayers-by-net-wealth.component';
import { TopMaleTaxpayersByTaxPaidComponent } from './top-male-taxpayers-by-tax-paid/top-male-taxpayers-by-tax-paid.component';
import { TopCompanyTaxpayersByTaxPaidComponent } from './top-company-taxpayers-by-tax-paid/top-company-taxpayers-by-tax-paid.component';
import { TopIndividualTaxpayersByTaxPaidComponent } from './top-individual-taxpayers-by-tax-paid/top-individual-taxpayers-by-tax-paid.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { TopSeniorCitizenTaxpayersByTaxPaidComponent } from './top-senior-citizen-taxpayers-by-tax-paid/top-senior-citizen-taxpayers-by-tax-paid.component';
import { TopTaxpayersBySurchargeComponent } from './top-taxpayers-by-surcharge/top-taxpayers-by-surcharge.component';
import { SurchargePayingTaxpayersNoComponent } from './surcharge-paying-taxpayers-no/surcharge-paying-taxpayers-no.component';
import { PaidTaxUs19AAAAANoComponent } from './paid-tax-us19-aaaaa-no/paid-tax-us19-aaaaa-no.component';
import { PaidTaxUs19AAAAAListComponent } from './paid-tax-us19-aaaaa-list/paid-tax-us19-aaaaa-list.component';
import { UploadOfflineDataComponent } from './upload-offline-data/upload-offline-data.component';
import { LedgerConfigurationComponent } from './ledger-configuration/ledger-configuration.component';
import { UserManagementConfigurationComponent } from './user-management-configuration/user-management-configuration.component';
import { ManagementConfigurationComponent } from './management-configuration/management-configuration.component';
import { AuthenticationConfigurationComponent } from './authentication-configuration/authentication-configuration.component';
import { BasicConfigurationComponent } from './basic-configuration/basic-configuration.component';
import { ChallanApprovalComponent } from './challan-approval/challan-approval.component';
import { ChallanDetailsComponent } from './challan-details/challan-details.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'access-control/parent/parent-add',
    component: ParentAddComponent,
  },
  {
    path: 'access-control/parent/parent-edit/:id',
    component: ParentEditComponent,
  },

  {
    path: 'access-control/parent/parent-list',
    component: ParentListComponent,
  },

  {
    path: 'access-control/permission/permission-add',
    component: PermissionAddComponent,
  },
  {
    path: 'access-control/permission/permission-edit/:id',
    component: PermissionEditComponent,
  },

  {
    path: 'access-control/permission/permission-list',
    component: PermissionListComponent,
  },

  {
    path: 'access-control/action/action-add',
    component: ActionAddComponent,
  },
  {
    path: 'access-control/action/action-edit/:id',
    component: ActionEditComponent,
  },

  {
    path: 'access-control/action/action-list',
    component: ActionListComponent,
  },
  {
    path: 'company-challan-request',
    component: CompanyChallanRequestComponent,
  },
  {
    path: 'company-challan-details',
    component: CompanyChallanDetailsComponent,
  },
  {
    path: 'pay-order-entry',
    component: DctPayorderEntryComponent,
  },
  {
    path: 'return-list',
    component: ReturnListComponent,
  },

  {
    path: 'approval-request',
    component: RequestApprovalComponent,
  },
  {
    path: 'approved-return',
    component: ApprovedReturnsComponent,
  },
  {
    path: 'pending-approval',
    component: PendingApprovalComponent,
  },
  {
    path: 'approved-request',
    component: ApproveRequestComponent,
  },
  {
    path: 'other-request-list',
    component: OthersRequestComponent,
  },
  {
    path: 'time-extension-pending-list',
    component: TimeExtensionPendingListComponent,
  },
  {
    path: 'time-extension-approval-status',
    component: TimeExtensionApprovalStatusComponent,
  },
  {
    path: 'return/:tin',
    component: FinalReturnViewComponent,
  },
  {
    path: 'ait-us64',
    component: AitUs64Component,
  },
  {
    path: 'regular-tax-us74',
    component: RegularTaxUs74Component,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  {
    path: 'return-register',
    component: ReturnRegisterComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'approval-request-list',
    component: ApprovalRequestListComponent,
  },
  {
    path: 'alert-list',
    component: AlertListComponent,
  },
  {
    path: 'add-admin',
    component: AddAdminComponent,
  },
  {
    path: 'add-user',
    component: AddUserComponent,
  },
  {
    path: 'reassign-admin',
    component: ReassignAdminComponent,
  },
  {
    path: 'reassign-user',
    component: ReassignUserComponent,
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'return-report',
    component: ReturnReportComponent,
  },
  {
    path: 'extension-report',
    component: ExtensionReportComponent,
  },
  {
    path: 'filing-configuration',
    component: FilingConfigurationComponent,
  },
  {
    path: 'ledger-configuration',
    component: LedgerConfigurationComponent,
  },
  {
    path: 'user-management',
    component: UserManagementConfigurationComponent,
  },
  {
    path: 'management',
    component: ManagementConfigurationComponent,
  },
  {
    path: 'authentication',
    component: AuthenticationConfigurationComponent,
  },
  {
    path: 'basic',
    component: BasicConfigurationComponent,
  },
  // {
  //   path: 'change-password',
  //   component: ChangePasswordComponent,
  // },

  {
    path: 'non-filer-taxpayer-no',
    component: NonFilerTaxpayerNoComponent,
  },
  {
    path: 'return-summary',
    component: ReturnSummaryComponent,
  },
  {
    path: 'top-individual-taxpayers-by-tax-paid',
    component: TopIndividualTaxpayersByTaxPaidComponent,
  },
  {
    path: 'top-company-taxpayers-by-tax-paid',
    component: TopCompanyTaxpayersByTaxPaidComponent,
  },
  {
    path: 'non-filer-taxpayer-list',
    component: NonFilerTaxpayerListComponent,
  },
  {
    path: 'top-individual-taxpayers-by-gross-wealth',
    component: TopIndividualTaxpayersByGrossWealthComponent,
  },
  {
    path: 'top-individual-taxpayers-by-net-wealth',
    component: TopIndividualTaxpayersByNetWealthComponent,
  },
  {
    path: 'top-taxpayers-by-gross-wealth-liability',
    component: TopTaxpayersByGrossWealthLiabilityComponent,
  },
  {
    path: 'top-female-taxpayers-by-tax-paid',
    component: TopFemaleTaxpayersByTaxPaidComponent,
  },
  {
    path: 'top-male-taxpayers-by-tax-paid',
    component: TopMaleTaxpayersByTaxPaidComponent,
  },
  {
    path: 'top-senior-citizen-taxpayers-by-tax-paid',
    component: TopSeniorCitizenTaxpayersByTaxPaidComponent,
  },
  {
    path: 'top-taxpayers-by-surcharge',
    component: TopTaxpayersBySurchargeComponent,
  },
  {
    path: 'surcharge-paying-taxpayers-no',
    component: SurchargePayingTaxpayersNoComponent,
  },
  {
    path: 'paid-tax-us19AAAAA-no',
    component: PaidTaxUs19AAAAANoComponent,
  },
  {
    path: 'paid-tax-us19AAAAA-list',
    component: PaidTaxUs19AAAAAListComponent,
  },
  {
    path: 'upload-offline-data',
    component: UploadOfflineDataComponent,
  },
  {
    path: 'challan-approval',
    component: ChallanApprovalComponent,
  },
  {
    path: 'challan-details/:win',
    component: ChallanDetailsComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
