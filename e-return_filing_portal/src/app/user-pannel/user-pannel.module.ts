import {NgModule} from "@angular/core";
import {AssessmentComponent} from "./assessment/assessment.component";
import {UserPannelRoutingModule} from "./user-pannel-routing.module";
import {UserPannelComponent} from "./user-pannel.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {QuestionariesComponent} from "./questionaries/questionaries.component";
import {HeadsOfIncomeComponent} from "./heads-of-income/heads-of-income.component";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {CommonModule} from "@angular/common";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {ReportComponent} from "./report/report.component";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import { HousePropertyComponent } from './house-property/house-property.component';
import { InterestOnSecuritiesComponent } from './interest-on-securities/interest-on-securities.component';
import { AgricultureComponent } from './agriculture/agriculture.component';
import { BusinessProfessionComponent } from './business-profession/business-profession.component';
import { CapitalGainComponent } from './capital-gain/capital-gain.component';
import { TempHeadsOfIncomeComponent } from './temp-heads-of-income/temp-heads-of-income.component';
import { TaxpayerProfileComponent } from './taxpayer-profile/taxpayer-profile.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LSelect2Module } from 'ngx-select2';
import { FirmEtcComponent } from './firm-etc/firm-etc.component';
import { AssetsAndLiabilitiesComponent } from './assets-and-liabilities/assets-and-liabilities.component';
import { IncomeFromOtherSourcesComponent } from './income-from-other-sources/income-from-other-sources.component';
import { RebateComponent } from './rebate/rebate.component';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';
import { ReturnViewComponent } from './return-view/return-view.component'
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { TaxAndPaymentComponent } from './tax-and-payment/tax-and-payment.component'
import { TreeviewModule } from 'ngx-treeview';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { FinalReturnViewComponent } from './final-return-view/final-return-view.component';
import { ReturnView941Component } from './final-return-view/return-view941/return-view941.component';
import { ReturnView922Component } from './final-return-view/return-view922/return-view922.component';
import { ReturnView903Component } from './final-return-view/return-view903/return-view903.component';
import { ReturnView884Component } from './final-return-view/return-view884/return-view884.component';
import { ReturnView865Component } from './final-return-view/return-view865/return-view865.component';
import { ReturnView846Component } from './final-return-view/return-view846/return-view846.component';
import { ReturnViewIT10BB20167Component } from './final-return-view/return-view-it10-bb20167/return-view-it10-bb20167.component';
import { Acknowledgement941Component } from './final-return-view/acknowledgement941/acknowledgement941.component';
import { IncomeTaxCertificateComponent } from './income-tax-certificate/income-tax-certificate.component';
import { AckReceiptComponent } from './ack-receipt/ack-receipt.component';
import { SingleReturnViewComponent } from './final-return-view/single-return-view/single-return-view.component';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PostSubReturnViewComponent } from './post-sub-return-view/post-sub-return-view.component';
import { PostReturnView941Component } from './post-sub-return-view/post-return-view941/post-return-view941.component';
import { PostReturnView922Component } from './post-sub-return-view/post-return-view922/post-return-view922.component';
import { PostReturnView903Component } from './post-sub-return-view/post-return-view903/post-return-view903.component';
import { PostReturnView884Component } from './post-sub-return-view/post-return-view884/post-return-view884.component';
import { PostReturnView865Component } from './post-sub-return-view/post-return-view865/post-return-view865.component';
import { PostReturnView846Component } from './post-sub-return-view/post-return-view846/post-return-view846.component';
import { PostReturnViewIt10Bb20167Component } from './post-sub-return-view/post-return-view-it10-bb20167/post-return-view-it10-bb20167.component';
import { PostAcknowledgement941Component } from './post-sub-return-view/post-acknowledgement941/post-acknowledgement941.component';
import { PostSingleReturnViewComponent } from './post-sub-return-view/post-single-return-view/post-single-return-view.component';
import { PaymentUiComponent } from './payment-ui/payment-ui.component';
import { TaxExemptedIncomeComponent } from './tax-exempted-income/tax-exempted-income.component';
import { GetRefundComponent } from './get-refund/get-refund.component';
import { OfflineSubmissionComponent } from './offline-submission/offline-submission.component';
import { OfflineAcknowledgement941Component } from "./offline-submission/offline-acknowledgement941/offline-acknowledgement941.component";
import { OfflineReturnViewIT10BB20167Component } from "./offline-submission/offline-return-view-it10-bb20167/offline-return-view-it10-bb20167.component";
import { OfflineReturnView846Component } from "./offline-submission/offline-return-view846/offline-return-view846.component";
import { OfflineReturnView865Component } from "./offline-submission/offline-return-view865/offline-return-view865.component";
import { OfflineReturnView884Component } from "./offline-submission/offline-return-view884/offline-return-view884.component";
import { OfflineReturnView903Component } from "./offline-submission/offline-return-view903/offline-return-view903.component";
import { OfflineReturnView922Component } from "./offline-submission/offline-return-view922/offline-return-view922.component";
import { OfflineReturnView941Component } from "./offline-submission/offline-return-view941/offline-return-view941.component";
import { OfflineSingleReturnViewComponent } from "./offline-submission/offline-single-return-view/offline-single-return-view.component";
import { TimeExtensionComponent } from "../time-extension/time-extension.component";
import { NgxPrintModule } from "ngx-print";
import { TimeExtensionPrintComponent } from "../time-extension-print/time-extension-print.component";
import { TimeExtensionApplicantCopyComponent } from "../time-extension-print/time-extension-applicant-copy/time-extension-applicant-copy.component";
import { TimeExtensionOfficeCopyComponent } from "../time-extension-print/time-extension-office-copy/time-extension-office-copy.component";
import { InitialQueryTaxpayerComponent } from './initial-query-taxpayer/initial-query-taxpayer.component';
import { TaxPayerThanksGivingComponent } from './tax-payer-thanks-giving/tax-payer-thanks-giving.component';
import { QRCodeModule } from "angularx-qrcode";
import { ThanksGivingOfflineComponent } from './thanks-giving-offline/thanks-giving-offline.component';
import { ChallanHistoryComponent } from './challan-history/challan-history.component';
import { TimeExtensionReceiptComponent } from "../time-extension-receipt/time-extension-receipt.component";
import { TinCertificateComponent } from './tin-certificate/tin-certificate.component';


@NgModule({
  imports: [
    UserPannelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    CommonModule,
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    LSelect2Module,
    CollapseModule.forRoot(),
    TreeviewModule.forRoot(),
    NgxUiLoaderModule,
    NgxPrintModule,
    QRCodeModule
    // DropdownTreeviewSelectModule,
  ],
  declarations: [
    AssessmentComponent,
    UserPannelComponent,
    QuestionariesComponent,
    HeadsOfIncomeComponent,
    ReportComponent,
    HousePropertyComponent,
    InterestOnSecuritiesComponent,
    AgricultureComponent,
    BusinessProfessionComponent,
    CapitalGainComponent,
    TempHeadsOfIncomeComponent,
    TempHeadsOfIncomeComponent,
    TaxpayerProfileComponent,
    FirmEtcComponent,
    AssetsAndLiabilitiesComponent,
    IncomeFromOtherSourcesComponent,
    RebateComponent,
    AdditionalInformationComponent,
    ReturnViewComponent,
    ExpenditureComponent,
    TaxAndPaymentComponent,
    FinalReturnViewComponent,
    ReturnView941Component,
    ReturnView922Component,
    ReturnView903Component,
    ReturnView884Component,
    ReturnView865Component,
    ReturnView846Component,
    ReturnViewIT10BB20167Component,
    Acknowledgement941Component,
    IncomeTaxCertificateComponent,
    AckReceiptComponent,
    SingleReturnViewComponent,
    HomeComponent,
    ChangePasswordComponent,
    PostSubReturnViewComponent,
    PostReturnView941Component,
    PostReturnView922Component,
    PostReturnView903Component,
    PostReturnView884Component,
    PostReturnView865Component,
    PostReturnView846Component,
    PostReturnViewIt10Bb20167Component,
    PostAcknowledgement941Component,
    PostSingleReturnViewComponent,
    PaymentUiComponent,
    TaxExemptedIncomeComponent,
    GetRefundComponent,
    OfflineSubmissionComponent,
    OfflineAcknowledgement941Component,
    OfflineReturnViewIT10BB20167Component,
    OfflineReturnView846Component,
    OfflineReturnView865Component,
    OfflineReturnView884Component,
    OfflineReturnView903Component,
    OfflineReturnView922Component,
    OfflineReturnView941Component,
    OfflineSingleReturnViewComponent,
    TimeExtensionComponent,
    TimeExtensionPrintComponent,
    TimeExtensionApplicantCopyComponent,
    TimeExtensionOfficeCopyComponent,
    InitialQueryTaxpayerComponent,
    TaxPayerThanksGivingComponent,
    ThanksGivingOfflineComponent,
    ChallanHistoryComponent,
    TimeExtensionReceiptComponent,
    TinCertificateComponent
  ],
})
export class UserPannelModule {}
