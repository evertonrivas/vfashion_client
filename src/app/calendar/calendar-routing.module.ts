import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [{ 
  path: '', 
  component: CalendarComponent,
  children:[{
    path: 'chart',
    component: ChartComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
