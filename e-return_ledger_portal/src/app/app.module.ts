import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CustomLayoutComponent } from './containers/custom-layout/custom-layout.component';
import { AppFooterComponent } from './containers/app-footer/app-footer.component';
import { ApiUrl } from './custom-services/api-url/api-url';
import { ApiUrlService } from './custom-services/api-url/api-url.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './custom-services/token-interceptor.service';
import { JwtModule } from '@auth0/angular-jwt';
import { EReturnLoginComponent } from './e-return-login/e-return-login.component';

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
    IconModule,
    IconSetModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('access_token')
      }
    })
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    CustomLayoutComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    AppFooterComponent,
    EReturnLoginComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: ApiUrl,
      useClass: ApiUrlService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    // IconSetService, AuthGuard,DatePipe
    IconSetService,DatePipe
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
