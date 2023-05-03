import { Component,AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Pagination } from '../pagination';
import { UserOptions } from 'src/app/models/user.model';
import { ProfileService } from 'src/app/services/profile.service';
import { Subscription } from 'rxjs';

declare var window:any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends Pagination implements AfterViewInit, OnInit, OnDestroy{
  masterChecked:boolean = false;
  pageSize:number = 25;
  win:any;
  usrSub:Subscription = new Subscription;
  override options:UserOptions ={
    page:1,
    pagSize: this.pageSize,
    orderBy: null,
    orderDir: 'ASC',
    search: null
  };

  constructor(private svc:ProfileService){
    super();
  }

  ngOnDestroy(): void {
    this.usrSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData():void{
    this.usrSub = this.svc.listUsers(this.options).subscribe({
      next: data => {
        this.response = data;
      },
      complete: () =>{
        this.options.pagSize = this.response.pagination.per_page;
        this.options.page    = this.response.pagination.page;
      }
    });
  }

  getType(type:string):string{
    let retorno:string = '';
    switch(type){
      case 'A': retorno = 'Administrador'; break;
      case 'L': retorno = 'Lojista'; break;
      case 'R': retorno = 'Representante'; break;
      case 'V': retorno = 'Vendedor'; break;
      case 'C': retorno = 'Usuário do Sistema'; break;
    }
    /**A = Administrador, L = Lojista, R = Representante, V = Vendedor, C = Company User */

    return retorno;
  }

  ngAfterViewInit(): void {
    const tooltiplist = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltiplist.forEach((tooltipTriggerEl) =>{
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  checkUncheckAll():void{

  }

  setPaginationSize(size:number):void{
    this.pageSize = size;
    this.options.pagSize = size;
  }
}
