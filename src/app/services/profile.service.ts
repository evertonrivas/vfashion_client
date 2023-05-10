import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { User,UserOptions,UserResponse } from '../models/user.model';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as configData from 'src/assets/config.json';
import { Entity, EntityOptions, EntityResponse } from '../models/entity.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends MyHttp {
  sys_config:any = (configData as any).default;

  constructor(http:HttpClient) {
    super(http);
  }

  profileGet():Observable<Profile>{
    var url = this.sys_config.backend_cmm+"/legal-entities/"+localStorage.getItem("id_user");
    return this.http.get<Profile>(url,{
      headers: this.getHeader()});
  }

  profileSave(profile:Profile):Observable<boolean>{
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
      headers:this.getHeader()
    });
  }

  profileList(options:EntityOptions):Observable<EntityResponse>{
    let params:HttpParams = new HttpParams().set("page",options.page);
    if (options.pagSize!=undefined){
      params = params.set("pageSize",options.pagSize as number);
    }
    if (options.search!=undefined){
      params = params.set("query",options.search as string);
    }
    if(options.orderBy!=undefined){
      params = params.set("order_by",options.orderBy as string).set("order_dir",options.orderDir);
    }else{
      params = params.set("order_dir",options.orderDir);
    }
      params = params.set("list_all",options.list_all);
    var url = this.sys_config.backend_cmm+"/legal-entities/";
    return this.http.get<UserResponse>(url,{
      headers: this.getHeader(),
      params: params
    });
  }

  profileMassive(entities:Entity[]):Observable<boolean>{
    var url = this.sys_config.backend_cmm+"/legal=entities/massive-change";
    return this.http.post<boolean>(url,entities,{
      headers:this.getHeader(true)
    });
  }

  userList(options:UserOptions):Observable<UserResponse>{
    let params:HttpParams = new HttpParams().set("page",options.page);
    if (options.pagSize!=undefined){
      params = params.set("pageSize",options.pagSize as number);
    }
    if (options.search!=undefined){
      params = params.set("query",options.search as string);
    }
    if(options.orderBy!=undefined){
      params = params.set("order_by",options.orderBy as string).set("order_dir",options.orderDir);
    }else{
      params = params.set("order_dir",options.orderDir);
    }
    params = params.set("list_all",options.list_all);
    var url = this.sys_config.backend_cmm+"/users/";
    return this.http.get<UserResponse>(url,{
      headers: this.getHeader(),
      params: params
    });
  }

  userSave(users:User[]):Observable<boolean>{
    var url = this.sys_config.backend_cmm+"/users/";
    return this.http.post<boolean>(url,users,{
      headers:this.getHeader(true)
    });
  }

  userUpdate(user:User):Observable<boolean>{
    var url = this.sys_config.backend_cmm+"/users/"+user.id?.toString();
    let frmData = new FormData();
    frmData.set("username",user.username);
    frmData.set("password",String(user.password));
    frmData.set("active",String(user.active));
    frmData.set("type",user.type);
    return this.http.post<boolean>(url,frmData,{
      headers:this.getHeaderPost()
    });
  }

  userMassive(users:User[]):Observable<boolean>{
    var url = this.sys_config.backend_cmm+"/users/massive-change";
    return this.http.post<boolean>(url,users,{
      headers:this.getHeader(true)
    });
  }
}
