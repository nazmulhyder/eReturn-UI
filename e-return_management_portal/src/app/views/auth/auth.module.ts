import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { CountdownModule } from 'ngx-countdown';
import { ForgotPassOtpSubmitComponent } from '../../forgot-pass-otp-submit/forgot-pass-otp-submit.component';
import { ForgotPassMobileComponent } from '../../forgot-pass-mobile/forgot-pass-mobile.component';
import { ForgotResetPassComponent } from '../../forgot-reset-pass/forgot-reset-pass.component';


@NgModule({
  declarations: [
    SignInComponent,
    ForgotPassMobileComponent,
    ForgotPassOtpSubmitComponent,
    ForgotResetPassComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule.forRoot(),
    CountdownModule
  ]
})
export class AuthModule { }
