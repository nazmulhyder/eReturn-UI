import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChallanEntryComponent } from './challan-entry/challan-entry.component';
import { ChallanDetailsUploadComponent } from './challan-details-upload/challan-details-upload.component';
import { ChallanListComponent } from './challan-list/challan-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TdsOnSalaryComponent } from './source-tax/tds-on-salary/tds-on-salary.component';
import { BankComponent } from './source-tax/bank/bank.component';
import { SavingCertificateComponent } from './source-tax/saving-certificate/saving-certificate.component';
import { PaidCarOwnershipComponent } from './AIT/paid-car-ownership/paid-car-ownership.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import { AdvanceTaxAitComponent } from './AIT/advance-tax-ait/advance-tax-ait.component';
import { OthersComponent } from './source-tax/others/others.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RegularTaxComponent } from './AIT/regular-tax/regular-tax.component';
import { CompanyChallanRequestComponent } from './company-challan-request/company-challan-request.component';
import { CompanyChallanDetailsComponent } from './company-challan-details/company-challan-details.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DctPayorderEntryComponent } from './dct-payorder-entry/dct-payorder-entry.component';
import { DctPayorderVerificationComponent } from './dct-payorder-verification/dct-payorder-verification.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { RegularPaymentComponent } from './regular-payment/regular-payment.component';
import { MakeClaimMessageComponent } from './make-claim-message/make-claim-message.component';
import { CompanyTdsComponent } from './source-tax/company-tds/company-tds.component';


@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ChallanEntryComponent,
    ChallanDetailsUploadComponent,
    ChallanListComponent,
    DashboardComponent,
    TdsOnSalaryComponent,
    BankComponent,
    SavingCertificateComponent,
    PaidCarOwnershipComponent,
    AdvanceTaxAitComponent,
    OthersComponent,
    RegularTaxComponent,
    CompanyChallanRequestComponent,
    CompanyChallanDetailsComponent,
    DctPayorderEntryComponent,
    DctPayorderVerificationComponent,
    RegularPaymentComponent,
    MakeClaimMessageComponent,
    CompanyTdsComponent,
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
  ]
})
export class PagesModule { }
