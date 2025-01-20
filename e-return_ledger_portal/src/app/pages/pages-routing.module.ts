import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceTaxAitComponent } from './AIT/advance-tax-ait/advance-tax-ait.component';
import { PaidCarOwnershipComponent } from './AIT/paid-car-ownership/paid-car-ownership.component';
import { RegularTaxComponent } from './AIT/regular-tax/regular-tax.component';
import { ChallanDetailsUploadComponent } from './challan-details-upload/challan-details-upload.component';
import { ChallanEntryComponent } from './challan-entry/challan-entry.component';
import { ChallanListComponent } from './challan-list/challan-list.component';
import { CompanyChallanDetailsComponent } from './company-challan-details/company-challan-details.component';
import { CompanyChallanRequestComponent } from './company-challan-request/company-challan-request.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DctPayorderEntryComponent } from './dct-payorder-entry/dct-payorder-entry.component';
import { DctPayorderVerificationComponent } from './dct-payorder-verification/dct-payorder-verification.component';
import { HomeComponent } from './home/home.component';
import { MakeClaimMessageComponent } from './make-claim-message/make-claim-message.component';
import { RegularPaymentComponent } from './regular-payment/regular-payment.component';
import { BankComponent } from './source-tax/bank/bank.component';
import { CompanyTdsComponent } from './source-tax/company-tds/company-tds.component';
import { OthersComponent } from './source-tax/others/others.component';
import { SavingCertificateComponent } from './source-tax/saving-certificate/saving-certificate.component';
import { TdsOnSalaryComponent } from './source-tax/tds-on-salary/tds-on-salary.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  //
  {
    path: 'challan-entry',
    component: ChallanEntryComponent,
  },
  {
    path: 'challan-list',
    component: ChallanListComponent,
  },
  {
    path: 'challan-details-upload/:entryRef',
    component: ChallanDetailsUploadComponent,
  },
  //
  {
    path: 'source-tax/bank',
    component: BankComponent,
  },
  {
    path: 'source-tax/saving-certificate',
    component: SavingCertificateComponent,
  },
  {
    path: 'source-tax/tds-on-salary',
    component: TdsOnSalaryComponent,
  },
  {
    path: 'source-tax/others',
    component: OthersComponent,
  },
  {
    path: 'source-tax/company-tds',
    component: CompanyTdsComponent,
  },
  {
    path: 'AIT/paid-car-ownership',
    component: PaidCarOwnershipComponent,
  },
  {
    path: 'AIT/advance-tax-ait',
    component: AdvanceTaxAitComponent,
  },
  {
    path: 'AIT/regular-tax-ait',
    component: RegularTaxComponent,
  },
  {
    path: 'regular-payment',
    component: RegularPaymentComponent,
  },
  //
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
    path: 'pay-order-verification',
    component: DctPayorderVerificationComponent,
  },
  //
  
  {
    path: 'make-claim-message',
    component: MakeClaimMessageComponent,
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
