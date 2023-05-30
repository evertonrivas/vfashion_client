import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ConfigComponent } from './config/config.component';
import { EntitiesComponent } from './entities/entities.component';
import { ProfileComponent } from '../profile/profile.component';

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
  },{
    path: 'profile',
    component: ProfileComponent
  }] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
