import { NgModule } from '@angular/core';
import { CommonModule,DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import * as sys_config from 'src/assets/config.json';
import { UsersComponent } from './users/users.component';
import { EntitiesComponent } from './entities/entities.component';
import { ConfigComponent } from './config/config.component';
import { CnpjCpfPipe } from '../pipes/cnpj-cpf.pipe';
import { EntityTypePipe } from '../pipes/entity-type.pipe';
import { UserTypePipe } from '../pipes/user-type.pipe';
import { NameCutPipe } from '../pipes/name-cut.pipe';
import { ProfileComponent } from './profile/profile.component';

registerLocaleData(ptBr)

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsersComponent,
    EntitiesComponent,
    ConfigComponent,
    CnpjCpfPipe,
    EntityTypePipe,
    UserTypePipe,
    NameCutPipe,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  exports:[
    CnpjCpfPipe,
    EntityTypePipe,
    UserTypePipe,
    NameCutPipe
  ],
  providers:[
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
export class AdminModule { }
