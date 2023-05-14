import { Component,OnInit } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { Subscription } from 'rxjs';
import * as configData from 'src/assets/config.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit{
  authSub:Subscription = new Subscription;
  company_logo:string = '';
  sys_config:any = (configData as any).default;

  constructor(private auth:SecurityService, 
    private myRoute:Router){
    this.company_logo = this.sys_config.company.logo_mini;
  }
  ngOnInit(): void {
    this.myRoute.navigate(["/calendar/chart"]);
  }

  logout():void{
    this.authSub = this.auth.logoff().subscribe(()=>{
      document.location.href='/';
    });
  }

  onSubmit():void{

  }
}
