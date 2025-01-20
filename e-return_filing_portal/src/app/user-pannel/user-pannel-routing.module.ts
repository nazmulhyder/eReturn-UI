import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssessmentComponent } from "./assessment/assessment.component";
import { QuestionariesComponent } from "./questionaries/questionaries.component";
import { HeadsOfIncomeComponent } from "./heads-of-income/heads-of-income.component";
import { ReportComponent } from "./report/report.component";
import { HousePropertyComponent } from "./house-property/house-property.component";
import { InterestOnSecuritiesComponent } from "./interest-on-securities/interest-on-securities.component";
import { AgricultureComponent } from "./agriculture/agriculture.component";
import { TempHeadsOfIncomeComponent } from "./temp-heads-of-income/temp-heads-of-income.component";
import { TaxpayerProfileComponent } from "./taxpayer-profile/taxpayer-profile.component";
import { FirmEtcComponent } from "./firm-etc/firm-etc.component";
import { BusinessProfessionComponent } from "./business-profession/business-profession.component";
import { CapitalGainComponent } from "./capital-gain/capital-gain.component";
import { AssetsAndLiabilitiesComponent } from "./assets-and-liabilities/assets-and-liabilities.component";
import { IncomeFromOtherSourcesComponent } from "./income-from-other-sources/income-from-other-sources.component";
import { RebateComponent } from "./rebate/rebate.component";
import { AdditionalInformationComponent } from "./additional-information/additional-information.component";
import { ReturnViewComponent } from "./return-view/return-view.component";
import { ExpenditureComponent } from "./expenditure/expenditure.component";
import { TaxAndPaymentComponent } from "./tax-and-payment/tax-and-payment.component";
import { FinalReturnViewComponent } from "./final-return-view/final-return-view.component";
import { IncomeTaxCertificateComponent } from "./income-tax-certificate/income-tax-certificate.component";
import { AckReceiptComponent } from "./ack-receipt/ack-receipt.component";
import { HomeComponent } from "./home/home.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { PostSubReturnViewComponent } from "./post-sub-return-view/post-sub-return-view.component";
import { PaymentUiComponent } from "./payment-ui/payment-ui.component";
import { TaxExemptedIncomeComponent } from "./tax-exempted-income/tax-exempted-income.component";
import { GetRefundComponent } from "./get-refund/get-refund.component";
import { OfflineSubmissionComponent } from "./offline-submission/offline-submission.component";
import { TimeExtensionComponent } from "../time-extension/time-extension.component";
import { TimeExtensionPrintComponent } from "../time-extension-print/time-extension-print.component";
import { InitialQueryTaxpayerComponent } from "./initial-query-taxpayer/initial-query-taxpayer.component";
import { TaxPayerThanksGivingComponent } from "./tax-payer-thanks-giving/tax-payer-thanks-giving.component";
import { ThanksGivingOfflineComponent } from "./thanks-giving-offline/thanks-giving-offline.component";
import { ChallanHistoryComponent } from "./challan-history/challan-history.component";
import { TimeExtensionReceiptComponent } from "../time-extension-receipt/time-extension-receipt.component";
import { TinCertificateComponent } from "./tin-certificate/tin-certificate.component";

const routes: Routes = [
  {
    path: "taxpayer-profile",
    component: TaxpayerProfileComponent,
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
  },
  {
    path: "return-view",
    component: ReturnViewComponent,
  },
  {
    path: "assessment",
    component: AssessmentComponent,
  },
  {
    path: "additional-information",
    component: AdditionalInformationComponent,
  },
  {
    path: "questionaries",
    component: QuestionariesComponent,
  },
  {
    path: "heads-of-income",
    component: HeadsOfIncomeComponent,
  },
  {
    path: "interest-on-securities",
    component: InterestOnSecuritiesComponent,
  },
  {
    path: "report",
    component: ReportComponent,
  },
  {
    path: "house-property",
    component: HousePropertyComponent,
  },
  {
    path: "agriculture",
    component: AgricultureComponent,
  },
  {
    path: "firm-etc",
    component: FirmEtcComponent,
  },
  {
    path: "business-or-profession",
    component: BusinessProfessionComponent,
  },
  {
    path: "capital-gain",
    component: CapitalGainComponent,
  },
  {
    path: "assets-and-liabilities",
    component: AssetsAndLiabilitiesComponent,
  },
  {
    path: "income-from-other-sources",
    component: IncomeFromOtherSourcesComponent,
  },

  {
    path: "tax-exempted-income",
    component: TaxExemptedIncomeComponent,
  },

  {
    path: "rebate",
    component: RebateComponent,
  },
  {
    path: "expenditure",
    component: ExpenditureComponent,
  },
  {
    path: 'tax-and-payment',
    component: TaxAndPaymentComponent,
  },
  {
    path: 'final-return-view',
    component: FinalReturnViewComponent,
  },
  {
    path: 'post-sub-return-view',
    component: PostSubReturnViewComponent,
  },
  {
    path: 'offline-submission',
    component: OfflineSubmissionComponent,
  },
  {
    path: 'income-tax-certificate',
    component: IncomeTaxCertificateComponent,
  },
  {
    path: 'ack-receipt',
    component: AckReceiptComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'payment',
    component: PaymentUiComponent,
  },
  {
    path: 'get-refund',
    component: GetRefundComponent,
  },
  // {
  //   path: 'basic-query-taxpayer',
  //   component: InitialQueryTaxpayerComponent,
  // },
  {
    path: 'time-extension',
    component: TimeExtensionComponent,
  },
  {
    path: 'time-extension-print-view',
    component: TimeExtensionPrintComponent,
  },
  {
    path: 'thanks-giving',
    component: TaxPayerThanksGivingComponent,
  },
  {
    path: 'thanks-giving-offline',
    component: ThanksGivingOfflineComponent,
  },
  {
    path: 'challan-history',
    component: ChallanHistoryComponent,
  },  
  {
    path: 'tin-certificate',
    component: TinCertificateComponent,
  },
  {
    path: 'time-extension-receipt',
    component: TimeExtensionReceiptComponent,
  },
  {
    path: '',
    redirectTo: 'assessment',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPannelRoutingModule {}
