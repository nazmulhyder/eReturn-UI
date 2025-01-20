import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

import { AppComponent } from "./app.component";

// Import containers
import { DefaultLayoutComponent } from "./containers";

import { BackgroundDefaultLayoutComponent } from "./containers/background-default-layout/background-default-layout.component";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts";
import { AppHeaderComponent } from "./containers/app-header/app-header.component";
import { AppFooterComponent } from "./containers/app-footer/app-footer.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TreeviewModule } from 'ngx-treeview';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiUrl } from "./custom-services/api-url/api-url";
import { ApiUrlService } from "./custom-services/api-url/api-url.service";
import { ToastrModule } from "ngx-toastr";
import { ModelHelperService } from "./service/model-helper.service";
import { BasicInformationDTO } from "./model/dto/basic-information-dto";
import { DatePipe } from '@angular/common';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { AuthGuard } from "./auth.guard";
import { TokenInterceptorService } from "./service/token-interceptor.service";
import { NgxPrintModule } from "ngx-print";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JwtModule } from "@auth0/angular-jwt";
import { ELedgerLoginComponent } from './e-ledger-login/e-ledger-login.component';
import { QRCodeModule } from "angularx-qrcode";
import { AChallanPaymentCheckComponent } from './a-challan-payment-check/a-challan-payment-check.component';
import { ETaxServiceContentComponent } from './e-tax-service-content/e-tax-service-content.component';
import { GuidelineComponent } from './guideline/guideline.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ETdsComponent } from './e-tds/e-tds.component';
import { ETaxPaymentComponent } from './e-tax-payment/e-tax-payment.component';
import { FAQComponent } from "./faq/faq.component";
import { ELedgerComponent } from './e-ledger/e-ledger.component';


export function jwtTokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    BsDatepickerModule.forRoot(),
    TreeviewModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    NgxPrintModule,
    QRCodeModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter:  () => localStorage.getItem('token')
    //   }
    // })
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter
      }
    })
  ],
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    BackgroundDefaultLayoutComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    RegisterComponent,
    AppHeaderComponent,
    AppFooterComponent,
    PaymentSuccessComponent,
    LandingPageComponent,
    ELedgerLoginComponent,
    AChallanPaymentCheckComponent,
    ETaxServiceContentComponent,
    ETdsComponent,
    ETaxPaymentComponent,
    // GuidelineComponent,
    // ContactUsComponent,
    FAQComponent,
    ELedgerComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: ApiUrl,
      useClass: ApiUrlService,
    },
    {
      provide: BasicInformationDTO,
      useClass: ModelHelperService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },

    DatePipe, AuthGuard
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
// export class AppModule {
//   //Inject any Service here which needs to be Constructed at App Startup
//   constructor(authUtils: AuthUtilService){}
// }

