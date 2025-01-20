import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { SignUpComponent } from '../../sign-up/sign-up.component';
import { SignupSuccessComponent } from '../../signup-success/signup-success.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SignupSuccessComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule.forRoot(),
  ]
})
export class AuthModule { }
