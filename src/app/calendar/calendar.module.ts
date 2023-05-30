import { NgModule } from '@angular/core';
import { CommonModule,DATE_PIPE_DEFAULT_OPTIONS,registerLocaleData } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { GanttComponent } from './gantt/gantt.component';
import { EventComponent } from './event/event.component';
import { AngularSplitModule } from 'angular-split';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxColorsModule } from 'ngx-colors';
import { MilestoneComponent } from './milestone/milestone.component';
import { EventFormComponent } from './event-form/event-form.component';
import { MilestoneFormComponent } from './milestone-form/milestone-form.component';
import { AngularMyDatePickerModule } from 'trade-datepicker';
import { SharedModule } from '../shared/shared.module';
import { BudgetComponent } from './budget/budget.component';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import * as sys_config from 'src/assets/config.json';

registerLocaleData(ptBr)

@NgModule({
  declarations: [
    CalendarComponent,
    GanttComponent,
    EventComponent,
    MilestoneComponent,
    EventFormComponent,
    MilestoneFormComponent,
    BudgetComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    AngularSplitModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskPipe, 
    NgxMaskDirective,
    NgxColorsModule,
    AngularMyDatePickerModule,
    SharedModule
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
    }, {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: {
            dateFormat: ((sys_config as any).default).locale.date_format,
            timezone: ((sys_config as any).default).locale.timezone
        }
    }
  ]
})
export class CalendarModule { }
