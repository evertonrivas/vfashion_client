import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentType, MyHttp } from './my-http';

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
    return this.http.put<boolean>(this.sys_config.backend_cmm+"/users/auth",frmData,{
      headers: this.getHeaderPost(ContentType.form)
    });
  }

  renewSession():Observable<any>{
    return this.http.get<any>(this.sys_config.backend_cmm+'/users/auth',{
      headers: this.getHeader(),
      params: new HttpParams().set("id",localStorage.getItem("id_user") as string)
    });
  }

  logoff():Observable<any>{
    return this.http.post<any>(this.sys_config.backend_cmm+"/users/logout/"+localStorage.getItem("id_user"),null);
  }
}
