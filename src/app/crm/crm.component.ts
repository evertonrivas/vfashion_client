import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '../services/security.service';
import { ToastRenewComponent } from '../toast-renew/toast-renew.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements OnInit{
  authSub:Subscription = new Subscription;
  idTimer = 0;
  constructor(private auth:SecurityService, 
    private myRoute:Router,
    private toastr:ToastrService){
  }

  ngOnInit(): void {
    this.checkLogged();
    this.idTimer = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos
    // this.myRoute.navigate(["/calendar/chart"]);
    this.myRoute.navigate(["/crm/dashboard"],{
      queryParams:{module:'crm'}
    });
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
}
