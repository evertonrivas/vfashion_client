import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage, provideImgixLoader } from '@angular/common';

import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import * as configData from '../assets/config.json';

import { NgxEchartsModule } from 'ngx-echarts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { SelectorComponent } from './selector/selector.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from './shared/shared.module';
import { CardComponent } from './dashboard/card/card.component';
import { ProfileComponent } from './profile/profile.component';
import { ToastRenewComponent } from './toast-renew/toast-renew.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SelectorComponent,
    DashboardComponent,
    ProfileComponent,
    CardComponent,
    ToastRenewComponent
  ],
  imports: [
    BrowserModule,
    NgOptimizedImage,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates:true,
      positionClass: 'toast-bottom-right',
      timeOut: 2000
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    SharedModule
  ],
  providers: [{
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: ((configData as any).default).recaptcha.siteKey
  },
  provideImgixLoader('https://b2b.labellamafia.com.br/img/produtos/galeria/')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
