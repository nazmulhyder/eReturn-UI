import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassMobileComponent } from '../../forgot-pass-mobile/forgot-pass-mobile.component';
import { ForgotPassOtpSubmitComponent } from '../../forgot-pass-otp-submit/forgot-pass-otp-submit.component';
import { ForgotResetPassComponent } from '../../forgot-reset-pass/forgot-reset-pass.component';
import { SignInComponent } from '../../sign-in/sign-in.component';

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
        path: "forgot-pass-number",
        component: ForgotPassMobileComponent,
      },
      {
        path: "otp-submit",
        component: ForgotPassOtpSubmitComponent,
      },
      {
        path: "forgot-reset-password",
        component: ForgotResetPassComponent,
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
  exports: [RouterModule]
})
export class AuthRoutingModule { }
