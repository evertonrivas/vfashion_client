import { Component,OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit,OnDestroy{
  company_logo:string = "";
  totalAlert:number = 0;
  authSub:Subscription = new Subscription;
  icone = "arrow_circle_right";
  protected txtSearch:string = "";
  idTimer = 0;
  showMenu:boolean = false;


  constructor(private auth:SecurityService,private myRoute:Router){

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    this.checkLogged();
    this.idTimer = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos

    this.myRoute.navigate(['/admin/dashboard']);
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
      }
    });
  }

  logout():void{
    this.authSub = this.auth.logoff().subscribe(()=>{
      document.location.href='/';
    });
  }

  toggleMenu():void{
    this.showMenu = !this.showMenu;
    this.icone = (this.icone=="arrow_circle_right")?"arrow_circle_left":"arrow_circle_right";
  }

  hideMenu():void{
    this.showMenu = false;
    this.icone = "arrow_circle_right";
  }

  onNavigate(event:Event,to:string):void{
    let links = document.querySelectorAll('.nav_link');
    links.forEach(l =>{
      l.classList.remove('active');
      console.log('passou e removeu os ativos');
    });

    //(event.target).classList.add('active')

    let object = event.target as HTMLElement;
    
    object.classList.add('active');
  }
}
