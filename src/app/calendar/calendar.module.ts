import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { GanttComponent } from './gantt/gantt.component';
import { EventComponent } from './event/event.component';
import { AngularSplitModule } from 'angular-split';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxColorsModule } from 'ngx-colors';
import { MilestoneComponent } from './milestone/milestone.component';


@NgModule({
  declarations: [
    CalendarComponent,
    GanttComponent,
    EventComponent,
    MilestoneComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    AngularSplitModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskPipe, 
    NgxMaskDirective,
    NgxColorsModule
  ],
  providers:[
    provideNgxMask()
  ]
})
export class CalendarModule { }
