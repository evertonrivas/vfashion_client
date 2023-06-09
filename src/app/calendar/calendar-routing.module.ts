import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { GanttComponent } from './gantt/gantt.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BudgetComponent } from './budget/budget.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [{ 
  path: '', 
  component: CalendarComponent,
  children:[{
    path: 'chart',
    component: GanttComponent
  },{
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'budget',
    component: BudgetComponent
  },{
    path: 'profile',
    component: ProfileComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
