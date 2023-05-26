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
  idTimer = 0;

  constructor(private auth:SecurityService, 
    private myRoute:Router){
    this.company_logo = this.sys_config.company.logo_mini;
  }
  ngOnInit(): void {
    this.checkLogged();
    this.idTimer = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos
    this.myRoute.navigate(["/calendar/chart"]);
    //this.myRoute.navigate(["/calendar/dashboard"]);
  }

  checkLogged():void{
    this.authSub = this.auth.checkLogged().subscribe({
      next: data => {
        if (data==false){
          document.location.href="/";
        }else{
          let dt_token = Date.parse( String(localStorage.getItem('token_expire')) );
          let now = Date.now();
          const diffTime = Math.abs(dt_token - now);
          if(diffTime<=60000){
            //colocar aqui o alerta de que o tempo esta acabando
          }
        }
      },
      error:() =>{
        document.location.href="/";
      }
    });
  }

  logout():void{
    this.authSub = this.auth.logoff().subscribe(()=>{
      document.location.href='/';
    });
  }

}
