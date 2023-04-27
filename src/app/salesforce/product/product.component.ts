import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartColor, CartContent, CartItem, CartSize } from 'src/app/services/order.model';
import { Grid, Product, ProductStock, ProductStockSizes, SubTotal } from 'src/app/services/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  selectedProduct:Product;
  sizeKeys:string[] = []; //chaves para montar os tamanhos de forma dinamica
  selectedProductStock:ProductStock[] = [];
  subTotal:SubTotal = {};
  grid:Grid = {};
  getStockSub:Subscription = new Subscription;

  constructor(
    private sProd:ProductsService,
    private sOrder:OrderService,
    private aRoute:ActivatedRoute,
    private msg:ToastrService,
    private route:Router
  ){
    this.selectedProduct = {
      id:0,
      id_category:0,
      prodCode: "",
      barCode: null,
      refCode: "",
      name: "",
      description: null,
      observation: null,
      ncm:null,
      price: "",
      measure_unit: "UN",
      structure: "S",
      date_created: "",
      date_updated: "",
      images: []
    };
  }

  ngOnInit(): void {
    let id:number = 0;

    this.aRoute.queryParamMap.forEach((param) =>{
      id = parseInt(String(param.get("id_product")));

      this.sProd.get(id).subscribe((product:Product) =>{
        this.selectedProduct = product;

        //comeca a montar o grid que farah o bind dos valores
        if (this.grid[this.selectedProduct.id]==undefined){
          this.grid[this.selectedProduct.id] = {};
          this.subTotal[this.selectedProduct.id] ={};
        }

        //busca os dados de estoque dos produtos
        this.getStockSub = this.sProd.get_stock(id).subscribe({
          next: data => {
            
            this.selectedProductStock = data;

            this.selectedProductStock.forEach((color) => {

              //monta o segundo nivel do grid que farah o bind dos valores
              if(this.grid[this.selectedProduct.id][color.color_code]==undefined){
                this.grid[this.selectedProduct.id][color.color_code] = {}
                this.subTotal[this.selectedProduct.id][color.color_code] = 0;
              }

              //monta o terceiro nivel do grid que farah o bind dos valores
              color.sizes.forEach((size) => {
                if (this.grid[this.selectedProduct.id][color.color_code][size.size_code]==undefined){
                  this.grid[this.selectedProduct.id][color.color_code][size.size_code] = 0;
                }

                //obtem apenas os tamanhos do produto para configurar
                if (this.sizeKeys.find(function(valor){
                  return size.size_name===valor;
                })===undefined){
                  this.sizeKeys.push(size.size_name);
                }

              });
            });
          },complete:() =>{
            let inCart:CartContent;
            //carrega os dados do carrinho do produto selecionado para exibir na tela
            this.sOrder.getItemData(this.selectedProduct).subscribe({
              next: data =>{
                inCart = data;
              },complete:() =>{
                inCart.colors.forEach((c:CartColor) =>{
                  c.sizes.forEach((s:CartSize) =>{
                    if (s.quantity > 0){
                      //console.log(s.quantity);
                      this.grid[this.selectedProduct.id][c.code][s.name] = s.quantity;
                      this.subTotal[this.selectedProduct.id][c.code] += s.quantity;
                    } 
                  });
                })
              }
            });
          }
        });

      });

    });
  }

  changeAndSum():void{
    //realiza nova leitura dos estoques a cada alteracao do produto para garantir que
    //nao haverah furo por causa de outra compra
    this.getStockSub = this.sProd.get_stock(this.selectedProduct.id).subscribe({
      next: data => {
        this.selectedProductStock = data;
      }
    });
    
    Object.keys(this.grid[this.selectedProduct.id]).forEach((cor) =>{
      let valor:number = 0;
      Object.keys(this.grid[this.selectedProduct.id][cor]).forEach((size) =>{
        if (this.tryAdd(cor,size,this.grid[this.selectedProduct.id][cor][size])){
          valor += this.grid[this.selectedProduct.id][cor][size];
        }else{
          //coloca o valor maximo na soma
          valor += this.getMaxValue(cor,size);
          this.grid[this.selectedProduct.id][cor][size] = this.getMaxValue(cor,size);
        }
      });
      this.subTotal[this.selectedProduct.id][cor] = valor;
    });
  }

  tryAdd(color:string,size:string,value:number):boolean{
    let retorno:boolean = false;
    this.selectedProductStock.forEach((colors:ProductStock) =>{
      if(colors.color_code==color){
        colors.sizes.forEach((sz:ProductStockSizes) =>{
          if(sz.size_code == size){
            if (sz.size_value >= value){
              retorno = true;
            }
          }
        });
      }
    });
    return retorno;
  }

  getMaxValue(color:string,size:string):number{
    let valor:number = 0;
    this.selectedProductStock.forEach((colors:ProductStock) =>{
      if(colors.color_code==color){
        colors.sizes.forEach((sz) =>{
          if(sz.size_code == size){
            valor = sz.size_value;
          }
        });
      }
    });
    return valor;
  }

  addToPreOrder(){
    let itens:CartItem[] = [];
    Object.keys(this.grid[this.selectedProduct.id]).forEach((kcolor) =>{
      Object.keys(this.grid[this.selectedProduct.id][kcolor]).forEach((ksize) =>{
        if(this.grid[this.selectedProduct.id][kcolor][ksize]>0){
          //monta o objeto que serah adicionado ao carrinho
          let item:CartItem = {
            id_customer:parseInt(String(localStorage.getItem('id_profile'))),
            id_product:this.selectedProduct.id,
            color: kcolor,
            size: ksize,
            quantity: this.grid[this.selectedProduct.id][kcolor][ksize],
            price: this.selectedProduct.price
          }

          itens.push(item);
        }
      });
    });

    this.sOrder.addToCart(itens).subscribe({
      next: result =>{
        if (result==true){
          this.sOrder.annouceProduct();
          this.msg.success('Produto atualizado com sucesso!').onHidden.subscribe(() =>{
            this.route.navigate(['/shopkeeper/checkout']);
          });
        }else{
          this.msg.error('Ocorreu uma falha ao atualizar os dados do produto!');
        }
      }
    });
  }
}
