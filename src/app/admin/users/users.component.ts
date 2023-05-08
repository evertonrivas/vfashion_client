import { Component,AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { DataManipulation } from '../datamanipulation';
import { User, UserOptions } from 'src/app/models/user.model';
import { ProfileService } from 'src/app/services/profile.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, ValidationErrors } from '@angular/forms';

declare var window:any;

export function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { 'passwordMismatch': true }
    : null;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends DataManipulation implements AfterViewInit, OnInit, OnDestroy{
  override options:UserOptions ={
    page:1,
    pagSize: 25,
    orderBy: null,
    orderDir: 'ASC',
    search: null,
    export: false
  };
  massiveType:string = "";
  massiveStatus:string = "";

  frmUser:FormGroup = new FormGroup({
    txtUsername: new FormControl('',Validators.required),
    txtPassword: new FormControl('',Validators.required),
    txtCPassword: new FormControl('',[Validators.required,confirmPasswordValidator]),
    slType: new FormControl('',Validators.required)
  });

  constructor(private svc:ProfileService,private toastr:ToastrService){
    super();
  }

  ngOnDestroy(): void {
    this.serviceSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData():void{
    this.serviceSub = this.svc.userList(this.options).subscribe({
      next: data => {
        this.response = data;
        (this.response.data as User[]).forEach((usr) =>{
          if (this.registryChecked[(usr.id as number)]==undefined){
            this.registryChecked[(usr.id as number)] = false;
          }
        })
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
      case 'C': retorno = 'Usuário do Sistema'; break;
      case 'V': retorno = 'Vendedor'; break;
    }

    return retorno;
  }

  ngAfterViewInit(): void {
    const tooltiplist = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltiplist.forEach((tooltipTriggerEl) =>{
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });

    let el = document.getElementById("offcanvasEdit")
    this.offcanvas = new window.bootstrap.Offcanvas(el);
  }

  override setPaginationSize(size:number):void{
    super.setPaginationSize(size);
    this.loadData();
  }

  override next(): void {
    super.next();
    this.loadData();
  }

  override prev(): void {
    super.prev();
    this.loadData();
  }

  override to(page: number): void {
    super.to(page);
    this.loadData();
  }

  exportCSV(all:boolean = false): void {
    if(all){
      this.serviceSub = this.svc.userList({
        export: true,
        orderBy: "id",
        orderDir: 'ASC',
        page: 0,
        pagSize: 0,
        search: ""
      }).subscribe((data) =>{
        this.exportFile(data,"C");
      });
    }else{
      this.serviceSub = this.svc.userList(this.options).subscribe((data) =>{
        this.exportFile(data.data,"C");
      });
    }
  }

  exportJSON(all:boolean = false): void {
    if(all){
      this.serviceSub = this.svc.userList({
        export: true,
        orderBy: "id",
        orderDir: 'ASC',
        page: 0,
        pagSize: 0,
        search: ""
      }).subscribe((data)=>{
        this.exportFile(data,"J");
      });
    }else{
      this.serviceSub = this.svc.userList(this.options).subscribe((data)=>{
        this.exportFile(data.data,"J");
      });
    }
    
  }

  onSubmit():boolean{
    this.hasSend = true;

    if (this.frmUser.invalid){
      return false;
    }
    if(this.hasSend){
      let usr:User[] = [{
        username: this.frmUser.controls["txtUsername"].value,
        password: this.frmUser.controls["txtPassword"].value,
        type: this.frmUser.controls["slType"].value,
        id: undefined,
        active: true,
        date_created: undefined,
        date_updated: undefined
      }];
      this.save(usr);
    }
    
    return true;
  }

  save(usrs:User[]):void{
    this.serviceSub = this.svc.userSave(usrs).subscribe({
      next: data =>{
        if (data)
          this.toastr.success("Usuário(s) salvo(s) com sucesso!");
        else
          this.toastr.error("Ocorreu um problema ao salvar o(s) usuário(s)!");
      }
    });
    if (this.isEdit){
      this.frmUser.controls["txtPassword"].addValidators(Validators.required);
      this.frmUser.controls["txtCPassword"].addValidators(Validators.required);
      this.frmUser.controls["txtPassword"].updateValueAndValidity();
    this.frmUser.controls["txtCPassword"].updateValueAndValidity();
    }
    this.isEdit = false;
    this.hasSend = false;
    this.offcanvas.hide();
    this.loadData();
  }

  onNew(){
    this.frmUser.controls['txtUsername'].setValue('');
    this.frmUser.controls['txtPassword'].setValue('');
    this.frmUser.controls['txtCPassword'].setValue('');
    this.frmUser.controls['slType'].setValue('');

    this.offcanvas.show();
  }

  onEdit(usr:User){

    this.isEdit = true;
    
    this.frmUser.controls["txtPassword"].removeValidators(Validators.required);
    this.frmUser.controls["txtCPassword"].removeValidators([Validators.required,confirmPasswordValidator]);
    this.frmUser.controls["txtPassword"].updateValueAndValidity();
    this.frmUser.controls["txtCPassword"].updateValueAndValidity();

    this.frmUser.controls["txtUsername"].setValue(usr.username);
    this.frmUser.controls["slType"].setValue(usr.type);

    this.offcanvas.show();
  }

  onChangeMassive():void{
    let usrs:User[] = [];
    Object.keys(this.registryChecked).forEach((v,idx) =>{
      if (this.registryChecked[parseInt(v)]==true){
        (this.response.data as User[]).forEach((usr) =>{
          if (usr.id!=undefined && usr.id == parseInt(v)){

            let status = (this.massiveStatus!="")?((this.massiveStatus=="2")?false:true):usr.active;

            let u:User = {
              id : usr.id,
              active: status,
              type: (this.massiveType!="")?this.massiveType:usr.type,
              date_created:undefined,
              date_updated:undefined,
              password:undefined,
              username:""
            }
            usrs.push(u);
          }
        });
        this.totalToChange++;
      }
    });

    if (this.totalToChange > 0){
      this.serviceSub = this.svc.userMassive(usrs).subscribe((data)=>{
        if(data){
          this.toastr.success("Usuário(s) atualizado(s) com sucesso!");
          this.totalToChange = 0;
          this.loadData();
        }else{
          this.toastr.error("Ocorreu um problema ao tentar alterar o(s) usuário(s)!");
          this.totalToChange = 0;
        }
      });
    }else{
      // aqui exibe o modal
      this.toastr.warning("Selecione ao menos um usuário para executar a ação!");
    }
  }

  onSearch():void{
    this.loadData();
  }
}
