import { Component,OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastRenewComponent } from '../toast-renew/toast-renew.component';

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


  constructor(private auth:SecurityService,
    private myRoute:Router,
    private toastr:ToastrService){

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    this.checkLogged();
    this.idTimer = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos

    this.myRoute.navigate(['/admin/dashboard'],{queryParams: {module: 'admin'}});
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
          if(diffTime<=300000){//5 minutos
            
            if(localStorage.getItem("message_renew")=="1"){
              this.toastr.show(
                'Gostaria de renovar sua sessão por mais 1 hora?',
                "Renovação de Sessão",{
                  toastComponent:ToastRenewComponent,
                  toastClass: 'toastrenew',
                  timeOut: 5000,
                  extendedTimeOut: 2000,
                  closeButton:true,
                  progressBar:true,
                  progressAnimation: 'increasing'
              });
            }
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
