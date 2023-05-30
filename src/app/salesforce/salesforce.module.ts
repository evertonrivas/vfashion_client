import { NgModule } from '@angular/core';
import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData  } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import * as sys_config from 'src/assets/config.json';
registerLocaleData(ptBr)

import { SalesforceRoutingModule } from './salesforce-routing.module';
import { SalesforceComponent } from './salesforce.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FilterComponent } from './filter/filter.component';
import { HelpComponent } from './help/help.component';

import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CartComponent } from './cart/cart.component';
import { ReturnComponent } from './return/return.component';
import { HistoryComponent } from './history/history.component';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { CatalogComponent } from './catalog/catalog.component';


@NgModule({
  declarations: [
    SalesforceComponent,
    GalleryComponent,
    FilterComponent,
    HelpComponent,
    CartComponent,
    ReturnComponent,
    HistoryComponent,
    SuggestionComponent,
    CheckoutComponent,
    ProductComponent,
    CatalogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SalesforceRoutingModule,
    NgxMaskPipe,
    NgxMaskDirective,
  ],
  providers:[
    provideNgxMask(),
    {
      provide: LOCALE_ID,
      useValue: ((sys_config as any).default).locale.language
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: ((sys_config as any).default).locale.currency_code
    },{
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: ((sys_config as any).default).locale.date_format,
        timezone: ((sys_config as any).default).locale.timezone
      }
    }
  ]
})
export class SalesforceModule { }
