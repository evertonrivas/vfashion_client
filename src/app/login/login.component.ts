import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, ISysAuth } from '../services/auth.service';
import { Router } from '@angular/router';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import * as configData from 'src/assets/config.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  sys_config:any = (configData as any).default;
  token: string|undefined;
  loading = false;
  app_token:ISysAuth = {
    token_access: "",
    token_type: "",
    token_expire: "",
    level_access:"",
    id_user:0,
    id_profile: 0
  };
  faRightToBracket = faRightToBracket;
  company_logo:string;

  frmLogin = new FormGroup({
    txtUsername : new FormControl('',Validators.required),
    txtPassword : new FormControl('',Validators.required),
    chkRemember: new FormControl()
  });

  constructor(private authService: AuthService, 
    private route:Router, 
    private recaptchaV3Service: ReCaptchaV3Service,
    private tostr:ToastrService){
    this.company_logo = this.sys_config.company.logo_home;
  }

  onSubmit(){
    this.loading = true;

    let uname:string = this.frmLogin.controls.txtUsername.value as string;
    let passwd:string = this.frmLogin.controls.txtPassword.value as string;

    let checkbox: boolean |null = this.frmLogin.controls.chkRemember.value;

    if (checkbox){
      localStorage.setItem('username',this.frmLogin.controls.txtUsername.value as string);
      localStorage.setItem('password',this.frmLogin.controls.txtPassword.value as string);
    }else{
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }

    this.recaptchaV3Service.execute('importantAction').subscribe((token:string) =>{
      this.authService.tryAuth(
        uname, 
        passwd
      ).subscribe({
        next: data => {
          var num:number = data as number;
          var msg:string = "Login ou senha inválidos!";
          if (num==0 || num==-1){
            if (num==-1){ msg = "Usuário inexistente ou inativo!"; }
            this.tostr.error(msg);
          }else{
            this.app_token.token_access = data.token_access;
            this.app_token.token_type   = data.token_type;
            this.app_token.level_access = data.level_access;
            this.app_token.id_user      = data.id_user;
            this.app_token.id_profile   = data.id_profile;
            this.app_token.token_expire = data.token_expire
          }
        },
        complete: () => {
          //salva as informacoes do token para verificacao
          localStorage.setItem('token_access',this.app_token.token_access);
          localStorage.setItem('token_type',this.app_token.token_type);
          localStorage.setItem('id_user',String(this.app_token.id_user));
          localStorage.setItem('id_profile',String(this.app_token.id_profile));
          localStorage.setItem('token_expire',this.app_token.token_expire);
          localStorage.setItem("level_access",String(this.app_token.level_access));
          switch(this.app_token.level_access){
            case "A": this.route.navigate(["/selector"]); break;
            case "L": this.route.navigate(["/salesforce"]); break;
            case "R": this.route.navigate(["/selector"]); break;
          }
          //this.loading = false;
        },
        error: (err: Error) => {
          this.tostr.error('Login ou senha inválidos').onHidden.subscribe({
            next: data =>{
              this.frmLogin.reset();
            }
          });
          this.loading = false;
        }
      });
    });
  }

  ngOnInit(): void {
    this.frmLogin.controls.txtUsername.setValue(localStorage.getItem("username") as string);
    this.frmLogin.controls.txtPassword.setValue(localStorage.getItem("password") as string);
    if(localStorage.getItem('username')!=null){
      this.frmLogin.controls.chkRemember.setValue(true);
    }

    let id = parseInt(String(sessionStorage.getItem("id_user")));
    if (id > 0){
      this.authService.logoff();
    }
  }
}
