import { Component,AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { DataManipulation } from 'src/app/datamanipulation';
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
  override options:UserOptions = {
    page:1,
    pagSize: 25,
    orderBy: null,
    orderDir: 'ASC',
    search: null,
    list_all: false
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
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
    this.serviceSub[2].unsubscribe();
    this.serviceSub[3].unsubscribe();
    this.serviceSub[4].unsubscribe();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData():void{
    this.serviceSub[0] = this.svc.userList(this.options).subscribe({
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

  ngAfterViewInit(): void {
    const tooltiplist = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltiplist.forEach((tooltipTriggerEl) =>{
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById("offcanvasEdit")
    );

    this.modal = new window.bootstrap.Modal(
      document.getElementById("modal_massive")
    );
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
      this.serviceSub[1] = this.svc.userList({
        list_all: true,
        orderBy: "id",
        orderDir: 'ASC',
        page: 0,
        pagSize: 0,
        search: ""
      }).subscribe((data) =>{
        this.exportFile(data,"C");
      });
    }else{
      this.serviceSub[1] = this.svc.userList(this.options).subscribe((data) =>{
        this.exportFile(data.data,"C");
      });
    }
  }

  exportJSON(all:boolean = false): void {
    if(all){
      this.serviceSub[2] = this.svc.userList({
        list_all: true,
        orderBy: "id",
        orderDir: 'ASC',
        page: 0,
        pagSize: 0,
        search: ""
      }).subscribe((data)=>{
        this.exportFile(data,"J");
      });
    }else{
      this.serviceSub[2] = this.svc.userList(this.options).subscribe((data)=>{
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
    this.serviceSub[3] = this.svc.userSave(usrs).subscribe({
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
    Object.keys(this.registryChecked).forEach((v) =>{
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
      }
    });

    this.serviceSub[4] = this.svc.userMassive(usrs).subscribe((data)=>{
      if(data){
        this.toastr.success("Usuário(s) atualizado(s) com sucesso!");
        this.totalChecked = 0;
        this.loadData();
        this.modal.hide();
      }else{
        this.toastr.error("Ocorreu um problema ao tentar alterar o(s) usuário(s)!");
        this.totalChecked = 0;
        this.modal.hide();
      }
    });
  }

  onExecuteMassive():void{
    Object.keys(this.registryChecked).forEach((k)=>{
      if (this.registryChecked[parseInt(k)]==true){
        this.totalChecked++;
      }
    });
    if (this.totalChecked==1){
      this.message = 'Deseja realmente executar ação no registro selecionado?';
    }else{
      this.message = 'Deseja realmente executar ação massiva em todos os registros selecionados?';
    }
    if (this.totalChecked > 0 ){
      this.modal.show();
    }
    else{
      this.toastr.warning('Selecione ao menos um registro para alterar!');
    }
  }

  onExecuteFilter():void{
    //limpa a busca antes de executar
    this.options.search = "";
    this.searchTerm = "";
    let search_status:string = "";
    let search_type:string = "";

    if(this.massiveStatus!=""){
      search_status = "is:active "+this.massiveStatus;
    }
    if(this.massiveType!=""){
      search_type = "is:type "+this.massiveType;
    }

    if (search_status!="" && search_type!=""){
      this.options.search = [search_status,search_type].join(",");
    }else{
      this.options.search = (search_status!="")?search_status:search_type;
    }
    this.loadData();
  }

  onSearch():void{
    this.options.search = "is:query "+this.searchTerm;
    this.loadData();
  }

  onDeleteMassive():void{

  }
}
