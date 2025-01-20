import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { BackgroundDefaultLayoutComponent } from './containers/background-default-layout/background-default-layout.component';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from "./views/login/login.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignupGeneratePasswordComponent } from "./signup-generate-password/signup-generate-password.component";
import { ProceedToFormTextComponent } from "./proceed-to-form-text/proceed-to-form-text.component";
import { NonNidChecklistFormComponent } from "./non-nid-checklist-form/non-nid-checklist-form.component";
import { NonNidHolderSubmissionCompleteComponent } from "./non-nid-holder-submission-complete/non-nid-holder-submission-complete.component";
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { AuthGuard } from './auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ELedgerLoginComponent } from './e-ledger-login/e-ledger-login.component';
import { AChallanPaymentCheckComponent } from './a-challan-payment-check/a-challan-payment-check.component';
import { ETaxServiceContentComponent } from './e-tax-service-content/e-tax-service-content.component';
import { GuidelineComponent } from './guideline/guideline.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ETdsComponent } from './e-tds/e-tds.component';
import { ETaxPaymentComponent } from './e-tax-payment/e-tax-payment.component';
import { FAQComponent } from './faq/faq.component';
import { ELedgerComponent } from './e-ledger/e-ledger.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'auth',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
  {
    path: "landing-page",
    component: LandingPageComponent,
    data: {
      title: "Landing Page",
    },
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: "eLedger-login",
    component: ELedgerLoginComponent,
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },
  {
    path: "payment-success/:tin",
    component: PaymentSuccessComponent,
    data: {
      title: "Payment Status",
    },
  },
  {
    path: "achallan-payment-check",
    component: AChallanPaymentCheckComponent,
    data: {
      title: "aChallan Payment check",
    },
  },
  {
    path: "e-tax-service-content",
    component: ETaxServiceContentComponent,
  },
  {
    path: "e-tds",
    component: ETdsComponent,
  },
  {
    path: "e-tax-payment",
    component: ETaxPaymentComponent,
  },
  {
    path: "eLedger",
    component: ELedgerComponent,
  },
  // {
  //   path: "guideline",
  //   component: GuidelineComponent,
  // },
  // {
  //   path: "contact-us",
  //   component: ContactUsComponent,
  // },
  {
    path: "faq",
    component: FAQComponent,
  },
  {
    path: '',
    component: BackgroundDefaultLayoutComponent,
    data: {
      title: 'Auth'
    },
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      // {
      //   path: 'base',
      //   loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      // },
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      // },
      // {
      //   path: 'icons',
      //   loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      // },
      // {
      //   path: 'theme',
      //   loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      // },
      {
        path: 'user-panel',
        canActivate: [AuthGuard],
        loadChildren: () => import('./user-pannel/user-pannel.module').then(m => m.UserPannelModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes , {
    preloadingStrategy: PreloadAllModules
}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
