import { Component,ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { Subscription } from 'rxjs';
import { FilterService } from '../services/filter.service';
import { Filter } from 'src/app/models/filter.model';
import { OrderService } from '../services/order.service';
import * as configData from 'src/assets/config.json';
import { ToastrService } from 'ngx-toastr';
import { ToastRenewComponent } from '../toast-renew/toast-renew.component';

@Component({
  selector: 'app-salesforce',
  templateUrl: './salesforce.component.html',
  styleUrls: ['./salesforce.component.scss']
})
export class SalesforceComponent implements OnDestroy, OnInit{
  sys_config:any = (configData as any).default;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener:() => void;
  protected txtSearch:string = "";
  private idTimer = 0;
  authSub:Subscription = new Subscription;
  totalInCart:number = 0;
  // faInstagram = faInstagram;
  // faFacebook = faFacebook;
  // faLinkedin = faLinkedin;
  company_logo:string;
  userType:string | null = null;

  constructor(changeDetectorRef:ChangeDetectorRef, 
    media: MediaMatcher, private myRoute:Router,
    private sOrder:OrderService, 
    private auth:SecurityService, private sFilter:FilterService,
    private toastr:ToastrService){
    this.mobileQuery = media.matchMedia('(max-width:600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change',this._mobileQueryListener);

    this.company_logo = this.sys_config.company.logo_mini;

    this.sOrder.productAnnouced$.subscribe({
      next: ()=> {
        this.countOnCart();
      }
    });
  }

  ngOnDestroy():void{
    this.mobileQuery.addEventListener('change',this._mobileQueryListener);
    if (this.idTimer){
      this.auth.logoff();
      clearInterval(this.idTimer);
    }
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    this.checkLogged();
    this.idTimer = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos
    this.userType = localStorage.getItem("level_access");
    if (localStorage.getItem("level_access")=="R"){
      this.myRoute.navigate(["/salesforce/representative"]);
    }else{
      this.myRoute.navigate(["/salesforce/gallery"]);
    }
    
    this.countOnCart();
  }

  countOnCart():void{
    //aqui so realiza a contagem de itens
    this.sOrder.countMyItens().subscribe({
      next: data =>{
        this.totalInCart = data;
      }
    });
  }

  onSubmit():void{
    let opt:Filter = {
      brand: [],
      model: [],
      categories: [],
      types: [],
      collections: [],
      colors: [],
      sizes: [],
      query: this.txtSearch
    }
    this.sFilter.announceFilter(opt);
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

  doFilter(){
    //serve apenas para fechar o offcanvas
    let closeCanvas = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement;
    closeCanvas.click();
  }
}
