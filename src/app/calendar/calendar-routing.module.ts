import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { GanttComponent } from './gantt/gantt.component';

const routes: Routes = [{ 
  path: '', 
  component: CalendarComponent,
  children:[{
    path: 'chart',
    component: GanttComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
