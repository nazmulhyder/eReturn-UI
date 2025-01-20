import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "../login/login.component";
import { DummyComponent } from "./dummy-compo/dummy.component";
import { SignUpComponent } from "../../sign-up/sign-up.component";
import { SignInComponent } from "../../sign-in/sign-in.component";
import { SignupSuccessComponent } from "../../signup-success/signup-success.component";
import { SignupGeneratePasswordComponent } from "../../signup-generate-password/signup-generate-password.component";
import { ProceedToFormTextComponent } from "../../proceed-to-form-text/proceed-to-form-text.component";
import { NonNidChecklistFormComponent } from "../../non-nid-checklist-form/non-nid-checklist-form.component";
import { NonNidHolderSubmissionCompleteComponent } from "../../non-nid-holder-submission-complete/non-nid-holder-submission-complete.component";
import { ForgetPassRegisteredMobileComponent } from "../../forget-pass-registered-mobile/forget-pass-registered-mobile.component";
import { ForgetPassOtpSubmitComponent } from "../../forget-pass-otp-submit/forget-pass-otp-submit.component";
import { ForgetPassOtpSuccessGeneratePassComponent } from "../../forget-pass-otp-success-generate-pass/forget-pass-otp-success-generate-pass.component";
import { GenerateTokenComponent } from "../../generate-token/generate-token.component";
import { GuidelineComponent } from "../../guideline/guideline.component";
import { ContactUsComponent } from "../../contact-us/contact-us.component";
const routes: Routes = [
  {
    path: "",
    data: {
      title: "Auth",
    },
    children: [
      {
        path: "sign-in",
        component: SignInComponent,
      },
      {
        path: "sign-up",
        component: SignUpComponent,
      },
      {
        path: "generate-pass",
        component: SignupGeneratePasswordComponent,
      },
      {
        path: "forget-pass-mobile",
        component: ForgetPassRegisteredMobileComponent,
      },
      {
        path: "forget-pass-mobile-otp",
        component: ForgetPassOtpSubmitComponent,
      },
      {
        path: "forget-pass-otp-success-generate-pass",
        component: ForgetPassOtpSuccessGeneratePassComponent,
      },
      {
        path: "generate-token",
        component: GenerateTokenComponent,
      },
      {
        path: "signup-success",
        component: SignupSuccessComponent,
      },
      {
        path: "proceed-to-form",
        component: ProceedToFormTextComponent,
      },
      {
        path: "no-nid-checklist",
        component: NonNidChecklistFormComponent,
      },
      {
        path: "no-nid-holder-submission",
        component: NonNidHolderSubmissionCompleteComponent,
      },
      {
        path: "guideline",
        component: GuidelineComponent,
      },
      {
        path: "contact-us",
        component: ContactUsComponent,
      },
      {
        path: "",
        redirectTo: "sign-in",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
