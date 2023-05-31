import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Toast,ToastrService,ToastPackage } from 'ngx-toastr';
import { SecurityService } from '../services/security.service';

@Component({
  selector: 'app-toast-renew',
  templateUrl: './toast-renew.component.html',
  styleUrls: ['./toast-renew.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        opacity: 0,
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 1,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
  preserveWhitespaces: false
})
export class ToastRenewComponent extends Toast{
  // constructor is only necessary when not using AoT
  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage,
    private svc:SecurityService,
    private toastr:ToastrService
  ) {
    super(toastrService, toastPackage);
  }

  renewSession():void{
    this.svc.renewSession().subscribe({
      next: (data) =>{
        if((data as boolean) !== false){
          localStorage.setItem('token_expire',data as string);
          this.toastr.success("Sessão renovada com sucesso!");
        }else{
          this.toastr.error("Não foi possível renovar a sessão");
        }
      }
    });
  }

  dontRenew():void{
    localStorage.setItem("message_renew","0");
  }
}
