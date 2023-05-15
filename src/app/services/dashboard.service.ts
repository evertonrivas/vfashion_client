import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as configData from 'src/assets/config.json';
import { Observable } from 'rxjs';
import { EntityType } from '../models/entity.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends MyHttp{
  constructor(http:HttpClient) {
    super(http);
   }

   countEntity(type:EntityType):Observable<number>{
    return this.http.get<number>(this.sys_config.backend_cmm+'/legal-entities/count',{
      headers: this.getHeader(),
      params: new HttpParams().set("type",type.toString())
    });
   }

   countOrder():Observable<number>{
    return this.http.get<number>(this.sys_config.backend_b2b+'/orders/count',{
      headers: this.getHeader()
    });
   }

   valueOrder():Observable<number>{
    return this.http.get<number>(this.sys_config.backend_b2b+'',{
      headers: this.getHeader()
    });
   }

   valueOrderByRepresentative():Observable<any>{
    return this.http.get<any>(this.sys_config.backend_b2b+'',{
      headers: this.getHeader()
    })
   }

}
