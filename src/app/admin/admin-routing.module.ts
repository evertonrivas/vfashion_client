import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ConfigComponent } from './config/config.component';
import { EntitiesComponent } from './entities/entities.component';

const routes: Routes = [{ 
  path: '', 
  component: AdminComponent,
  children:[{
    path: 'dashboard',
    component: DashboardComponent
  },{
    path: 'users',
    component: UsersComponent
  },{
    path: 'config',
    component: ConfigComponent
  },{
    path: 'entities',
    component: EntitiesComponent
  }] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
