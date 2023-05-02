import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators,FormBuilder, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartContent, CartColor,CartSize, PaymentCondition } from 'src/app/services/order.model';
import { OrderService } from 'src/app/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var window:any;

interface Checkbox{
  [index:number]:boolean
}


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy{
  //formulario do checkout
  frmCheckout:FormGroup;
  submitted:boolean = false; //verifica se o formulario foi enviado
  //lista de condicoes de pagamento
  itPaymentData:PaymentCondition[] = [];
  //condicao de pagamento selecionada
  mySelectedPayment: PaymentCondition = {
    id: 0,
    installments: 0,
    name:"",
    received_days: 0
  }
  //armazena o contteudo do carrinho de compras
  myCart:CartContent[] = [];
  //monta na tela os tamanhos dos produtos
  sizeKeys:string[] = [];
  //totalizadores
  myTotalItens:number;
  myTotalPayment:number;

  //controlam os checkboxes da exclusoes
  productChecked:Checkbox = {};  
  masterChecked:boolean = false;

  //controla os subscribes
  subOrder:Subscription = new Subscription;

  //modal de exclusao
  modalDelete:any;
  msgDelete:string = '';
  idToDelete:number = 0;

  constructor(private sOrder:OrderService, private fb:FormBuilder,
    private tostr:ToastrService,
    private router:Router){
    this.frmCheckout = this.fb.group({
      slPayment: [null,Validators.required]
    });
    this.myTotalItens = this.myTotalPayment = 0;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.frmCheckout.controls;
  }

  onSubmit():boolean{
    this.submitted = true;
    if (this.frmCheckout.invalid){
      return false;
    }
    this.sOrder.finishOrder(
        this.mySelectedPayment.id,
        this.myTotalPayment,
        this.mySelectedPayment.installments,
        (this.myTotalPayment/this.mySelectedPayment.installments),
        this.myTotalItens
      ).subscribe({
      next: data =>{
        if (data > 0){
          this.tostr.success('Seu pedido Nº <strong>'+data.toString()+'</strong> foi realizado com sucesso!',undefined,{
            enableHtml:true
          }).onHidden.subscribe(()=>{
            this.sOrder.annouceProduct();
            this.router.navigate(['/salesforce/gallery']);
          });
        }else{
          this.tostr.error('Ocorreu um erro ao realizar o pedido, por favor entre em contato com o Suporte!');
        }
      }
    });
    return true;
  }

  ngOnInit(): void {

    this.modalDelete = new window.bootstrap.Modal(
      document.getElementById('modal_delete')
    )

    this.sOrder.listPayment().subscribe({
      next: data =>{
        this.itPaymentData = data;
      }
    });

    this.getItens();
  }

  getItens():void{
    this.subOrder = this.sOrder.listMyItens().subscribe({
      next: data =>{
        this.myCart = data;

        let priceByProduct = 0;
        this.myCart.forEach((ct:CartContent) =>{
          priceByProduct += parseFloat(ct.price_un);

          //define os checkbox
          if (this.productChecked[ct.id_product]==undefined){
            this.productChecked[ct.id_product] = false;
          }

          ct.colors.forEach((cor:CartColor) =>{
            cor.sizes.forEach((size:CartSize) =>{
              this.myTotalItens += size.quantity;
              if (this.sizeKeys.find(function(v){
                return size.name==v
              })==undefined){
                this.sizeKeys.push(size.name);
              }
            });
          });
        });
        this.myTotalPayment = priceByProduct * this.myTotalItens;
      }
    });
  }

  ngOnDestroy(): void {
    this.subOrder.unsubscribe();
  }

  sumByColor(sizes:CartSize[]){
    let total = 0;
    sizes.forEach((sz:CartSize) =>{
      total += sz.quantity;
    });

    return total;
  }

  setPayment():void{
    this.itPaymentData.forEach((pay:PaymentCondition) =>{
      if (pay.id == parseInt(String(this.frmCheckout.controls['slPayment'].value)) ){
        this.mySelectedPayment = pay;
      }
    });
  }

  checkUncheckAll():void{
    Object.keys(this.productChecked).forEach((v,idx) => {
      this.productChecked[Number(v)] = this.masterChecked;
    });
  }

  openModal():void{
    let existChecked:number = 0;
    Object.keys(this.productChecked).forEach((k)=>{
      if (this.productChecked[parseInt(k)]==true){
        existChecked++;
      }
    });
    if (existChecked==1){
      this.msgDelete = 'Deseja realmente excluir o produto marcado?';
    }else{
      this.msgDelete = 'Deseja realmente excluir todos os produtos marcados?';
    }
    if (existChecked > 0 ){
      this.modalDelete.show();
    }
    else{
      this.tostr.error('Selecione ao menos um produto para excluir!',undefined,{
        positionClass:'toast-bottom-left'
      });
    }
  }

  tryDelete(id:number):void{
    this.idToDelete = id;
    this.msgDelete = 'Deseja realmente excluir este produto?';
    this.modalDelete.show();
  }

  executeDelete():void{

    //antes de tudo fecha o modal
    this.modalDelete.hide();

    let existChecked:number = 0;
    let idsToDelete:number[] = [];
    Object.keys(this.productChecked).forEach((k)=>{
      if (this.productChecked[parseInt(k)]==true){
        existChecked++;
        idsToDelete.push(parseInt(k));
      }
    });

    if(existChecked>0){
      //executa exclusao em massa
      this.sOrder.delete(idsToDelete).subscribe({
        next: data => {
          if(data){
            this.getItens();
            this.tostr.success('Registros excluídos com sucesso!');
          }else{
            this.tostr.error('Ocorreu um erro ao realizar a exclusão!');
          }          
        }
      });
    }else{
      //executa exclusao simples
      this.sOrder.delete([this.idToDelete]).subscribe({
        next: data => {
          if(data){
            this.getItens();
            this.tostr.success('Registro excluído com sucesso!');
          }else{
            this.tostr.error('Ocorreu um erro ao realizar a exclusão!');
          }
        }
      });
    }
  }
}
