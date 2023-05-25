import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { CartColor, CartContent, CartSize } from 'src/app/models/order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent  implements OnInit{
  content:CartContent[] = [];
  myTotal:number = 0;
  myItens:number = 0;
  constructor(private sOrder:OrderService){
    this.sOrder.productAnnouced$.subscribe(() =>{
      this.getMyItens();
    });
  }

  ngOnInit(): void {
    this.getMyItens();
  }

  getMyItens(){
    this.myItens = 0;
    this.myTotal = 0;
    this.sOrder.listMyItens().subscribe({
      next: data =>{
        this.content = data;
        //soma o montante do pedido
        this.content.forEach((ct:CartContent) =>{
          this.myTotal += parseFloat(ct.total_price);

          ct.colors.forEach((cor:CartColor) =>{
            cor.sizes.forEach((size:CartSize) =>{
              this.myItens += size.quantity;
            })
          });
        });
      }
    });
  }

}
