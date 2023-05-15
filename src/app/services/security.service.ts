import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as configData from 'src/assets/config.json';
import { MyHttp } from './my-http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService extends MyHttp{
  constructor(http:HttpClient) { 
    super(http)
  }

  tryAuth(_username:string,_password:string): Observable<any>{
    var frmData = new FormData();
    frmData.append("username",_username);
    frmData.append("password",_password);
    return this.http.post<any>(this.sys_config.backend_cmm+"/users/auth",frmData);
  }

  checkLogged():Observable<boolean>{
    var frmData = new FormData();
    frmData.append("token",localStorage.getItem('token_access') as string);
    return this.http.post<boolean>(this.sys_config.backend_cmm+"/users/auth-check",frmData);
  }

  logoff():Observable<any>{
    return this.http.post<any>(this.sys_config.backend_cmm+"/users/logout/"+localStorage.getItem("id_user"),null);
  }
}
