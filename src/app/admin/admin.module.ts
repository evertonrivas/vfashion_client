import { NgModule } from '@angular/core';
import { CommonModule,DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import * as sys_config from 'src/assets/config.json';
import { UsersComponent } from './users/users.component';
import { EntitiesComponent } from './entities/entities.component';
import { ConfigComponent } from './config/config.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxColorsModule } from 'ngx-colors';
import { SharedModule } from '../shared/shared.module';

registerLocaleData(ptBr)

@NgModule({
    declarations: [
        AdminComponent,
        UsersComponent,
        EntitiesComponent,
        ConfigComponent,
        ProfileComponent
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: ((sys_config as any).default).locale.language
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useValue: ((sys_config as any).default).locale.currency_code
        }, {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: {
                dateFormat: ((sys_config as any).default).locale.date_format,
                timezone: ((sys_config as any).default).locale.timezone
            }
        }
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxColorsModule,
        SharedModule
    ]
})
export class AdminModule { }
