import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from '../login/login.component';

// Components Routing
import { AuthRoutingModule } from './auth-routing.module';
import {DummyComponent} from "./dummy-compo/dummy.component";
import {SignUpComponent} from "../../sign-up/sign-up.component";
import {SignupGeneratePasswordComponent} from "../../signup-generate-password/signup-generate-password.component";
import {ProceedToFormTextComponent} from "../../proceed-to-form-text/proceed-to-form-text.component";
import {NonNidChecklistFormComponent} from "../../non-nid-checklist-form/non-nid-checklist-form.component";
import {NonNidHolderSubmissionCompleteComponent} from "../../non-nid-holder-submission-complete/non-nid-holder-submission-complete.component";
import { SignInComponent } from '../../sign-in/sign-in.component';
import { SignupSuccessComponent } from "../../signup-success/signup-success.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ForgetPassRegisteredMobileComponent } from '../../forget-pass-registered-mobile/forget-pass-registered-mobile.component';
import { ForgetPassOtpSubmitComponent } from '../../forget-pass-otp-submit/forget-pass-otp-submit.component';
import { ForgetPassOtpSuccessGeneratePassComponent } from '../../forget-pass-otp-success-generate-pass/forget-pass-otp-success-generate-pass.component';
import { GenerateTokenComponent } from '../../generate-token/generate-token.component';
import {CountdownModule } from 'ngx-countdown';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GuidelineComponent } from '../../guideline/guideline.component';
import { ContactUsComponent } from '../../contact-us/contact-us.component';

@NgModule({
  declarations: [
    DummyComponent,
    SignUpComponent,
    SignupGeneratePasswordComponent,
    SignupSuccessComponent,
    ProceedToFormTextComponent,
    NonNidChecklistFormComponent,
    NonNidHolderSubmissionCompleteComponent,
    SignInComponent,
    ForgetPassRegisteredMobileComponent,
    ForgetPassOtpSubmitComponent,
    ForgetPassOtpSuccessGeneratePassComponent,
    GenerateTokenComponent,
    GuidelineComponent,
    ContactUsComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule.forRoot(),
    CountdownModule,
    NgxUiLoaderModule,
    ModalModule.forRoot(),
  ]
})
export class AuthModule { }
