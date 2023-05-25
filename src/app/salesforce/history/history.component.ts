import { Component, OnInit } from '@angular/core';
import { OrderHistory,PaginativeHistory, HistoryOptions } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

declare var window:any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{
  myHistory:PaginativeHistory = {
    pagination: {
      has_next:false,
      page: 0,
      pages: 0,
      per_page: 0,
      registers:0
    },
    data: []
  };
  options:HistoryOptions = {
    orderBy:"id",
    orderDir:'ASC',
    pagSize:25,
    page:1
  }
  selectedTrack:string|null;
  showIntegration:boolean;
  constructor(private sOrder:OrderService){
    this.showIntegration = false;
    this.selectedTrack = "";
  }
  modalTrack:any;

  get numbers(): number[]{
    //funcao necessaria para formatar as pagianas da paginacao
    const limit = this.myHistory.pagination.pages;
    let retorno = Array.from({length: limit}, (_,i) => i+1);
    return retorno;
  }

  ngOnInit(): void {
    this.modalTrack = new window.bootstrap.Modal(
      document.getElementById('modal_shipping')
    );

    this.getHistory();
  }

  getHistory():void{
    this.sOrder.listMyOrders(this.options).subscribe({
      next: data => {
        this.myHistory = data;
        this.myHistory.data.forEach((d:OrderHistory) =>{
          if(d.integration_number!=null){
            this.showIntegration = true;
          }
        });
      }
    });
  }

  next(){
    this.options.page++;
    this.getHistory();
  }

  prev(){
    this.options.page--;
    this.getHistory();
  }

  to(page:number){
    this.options.page = page;
    this.getHistory();
  }

  showTrack(id_order:number):void{
    this.myHistory.data.forEach((d:OrderHistory) =>{
      if (d.id_order==id_order){
        this.selectedTrack = d.track_code;
        this.modalTrack.show();
        return
      }
    });
  }
}
