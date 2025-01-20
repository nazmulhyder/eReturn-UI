import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EReturnLoginComponent } from '../../e-return-login/e-return-login.component';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { SignUpComponent } from '../../sign-up/sign-up.component';
import { SignupSuccessComponent } from '../../signup-success/signup-success.component';

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
        path: "signup-success",
        component: SignupSuccessComponent,
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
