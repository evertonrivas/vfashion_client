import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as configData from 'src/assets/config.json';
import { Profile } from 'src/app/services/profile.model';

export interface ISysAuth{
  token_access: string,
  token_type: string,
  level_access: string,
  id_user:number,
  id_profile: number,
  token_expire: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sys_config:any = (configData as any).default;
  constructor(private http:HttpClient) { }

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

  loadProfile():Observable<Profile>{
    var header = new HttpHeaders();
    header = header.append("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'))
    
    var url = this.sys_config.backend_cmm+"/legal-entities/"+localStorage.getItem("id_user");
    return this.http.get<Profile>(url,{headers: header});
  }

  saveProfile(profile:Profile):Observable<boolean>{
      var header = new HttpHeaders();
      header = header.append("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'))
    var frmData = new FormData();
    frmData.append("name",profile.name);
    frmData.append("instagram",profile.instagram);
    frmData.append("taxvat", profile.taxvat);
    frmData.append("state_region",profile.state_region);
    frmData.append("city",profile.city);
    frmData.append("postal_code",profile.postal_code);
    frmData.append("neighborhood",profile.neighborhood);
    frmData.append("phone",profile.phone);
    frmData.append("email",profile.email);
    
    return this.http.post<boolean>(this.sys_config.backend_cmm+"/legal-entities/"+profile.id,frmData,{
      headers:header
    });
  }
}
