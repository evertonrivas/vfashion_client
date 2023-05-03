import { Component,AfterViewInit } from '@angular/core';
import { Pagination } from '../pagination';

declare var window:any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends Pagination implements AfterViewInit{
  masterChecked:boolean = false;
  pageSize:number = 25;
  win:any;
  users:[] = [];

  constructor(){
    super();
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
  }
}
