import { Component,ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from 'src/app/services/filter.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { GalleryOptions, ResponseProduct, Product, ProductStock,SubTotal,Grid, ProductStockSizes } from 'src/app/models/product.model';
import { Paginate } from 'src/app/models/paginate.model';
import { CartColor, CartContent, CartItem, CartSize } from 'src/app/models/order.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnDestroy, OnInit{
  //subscriptions
  filterSub:Subscription     = new Subscription;
  getGallerySub:Subscription = new Subscription;
  getStockSub:Subscription   = new Subscription;
  setOrderSub:Subscription   = new Subscription;
  hasSended:boolean = false;

  //stock
  subTotal:SubTotal = {};
  grid:Grid = {};
  sizeKeys:string[] = []; //chaves para montar os tamanhos de forma dinamica
  selectedProductStock:ProductStock[] = [];

  //mobile
  selectedItem:boolean = false; //serve para verificar se foi checkado no modo mobile
  mobileQuery: MediaQueryList;
  private _mobileQueryListener:() => void;
  
  selectedProduct:Product;
  options:GalleryOptions;
  
  pagination: Paginate = {
    registers: 0,
    page:0,
    per_page:0,
    pages:0,
    has_next:false
  }

  response: ResponseProduct = {
    data:[],
    pagination:this.pagination
  };

  constructor(private sFilter:FilterService, 
    private sProd: ProductsService,
    private sOrder:OrderService,
    private msg:ToastrService,
    media:MediaMatcher,changeDetectorRef:ChangeDetectorRef){
      this.mobileQuery = media.matchMedia('(max-width:600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addEventListener('change',this._mobileQueryListener);

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

      this.options = {
        brand: "",
        collection: "",
        category: "",
        model: "",
        type: "",
        color: "",
        size: "",
        search: '',
        orderBy: 'name',
        orderDir: 'ASC',
        page: 1,
        pagSize: 20
      }
  }

  get numbers(): number[]{
    //funcao necessaria para formatar as pagianas da paginacao
    const limit = this.response.pagination.pages;
    let retorno = Array.from({length: limit}, (_,i) => i+1);
    return retorno;
  }

  ngOnInit(): void {
    //escuta o filtro
    this.filterSub = this.sFilter.filterAnnouced$.subscribe(
      filtros =>{
        this.options.brand      = filtros.brand.join(',');
        this.options.collection = filtros.collections.join(',');
        this.options.category   = filtros.categories.join(',');
        this.options.model = filtros.model.join(',');
        this.options.type  = filtros.types.join(',');
        this.options.color = filtros.colors.join(',');
        this.options.size  = filtros.sizes.join(',');
        this.options.search= filtros.query;
        
        //realiza busca apos executado o filtro
        this.getGallery();
      }
    );

    //realiza a primeira busca
    this.getGallery();
  }

  getGallery():void{
    this.getGallerySub = this.sProd.list(this.options).subscribe({
      next: data => {
        this.response = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.addEventListener('change',this._mobileQueryListener);
    this.filterSub.unsubscribe();
    this.getGallerySub.unsubscribe();
    this.getStockSub.unsubscribe();
  }

  prepareToOrder(product:Product):void{
    //define o produto selecionado e tambem busca as informacoes de grade/estoque
    this.selectedProduct = product;

    //comeca a montar o grid que farah o bind dos valores
    if (this.grid[this.selectedProduct.id]==undefined){
      this.grid[this.selectedProduct.id] = {};
      this.subTotal[this.selectedProduct.id] ={};
    }

    //busca os dados de estoque dos produtos
    this.getStockSub = this.sProd.get_stock(product.id).subscribe({
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
                if(s.quantity > 0){
                  this.grid[this.selectedProduct.id][c.code][s.name] = s.quantity;
                  this.subTotal[this.selectedProduct.id][c.code] += s.quantity;
                }
              });
            })
          }
        });
      }
    });
  }

  addToOrderMobile(id:number):void{
    if (this.selectedItem){
      console.log('adicionado produto: '+id.toString());
    }else{ 
      console.log('removido o produto '+ id.toString()); 
    }
  }

  addToPreOrder(){
    if(!this.hasSended){
      this.hasSended = true;

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
            this.msg.success('Produto adicionado com sucesso ao pedido!');
            this.hasSended = false;
          }else{
            this.msg.error('Ocorreu uma falha ao adicionar o produto ao pedido!');
            this.hasSended = false;
          }
        }
      });
    }
  }

  next(){
    this.options.page++;
    this.getGallery();
  }

  prev(){
    this.options.page--;
    this.getGallery();
  }

  to(page:number){
    this.options.page = page;
    this.getGallery();
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
}
