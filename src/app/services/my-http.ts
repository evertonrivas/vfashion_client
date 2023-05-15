import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from "@angular/common/http";
import * as configData from 'src/assets/config.json';

export enum ContentType {
    text = 0,
    json = 1,
    form = 2
}

export class MyHttp {
    sys_config:any = (configData as any).default;
    constructor(protected http:HttpClient){

    }

    protected getHeader(useJson:boolean = false):HttpHeaders{
        let cType = (useJson)?"application/json":"text/plain";
        return new HttpHeaders({
            "Authorization": localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'),
            "Content-Type": cType
          });
    }

    protected getHeaderPost(cType:ContentType = ContentType.form):HttpHeaders{
        let content_type = '';
        switch (cType){
            case ContentType.json:{
                content_type = 'application/json'; break;
            }
            case ContentType.text:{
                content_type = 'text/plain'; break;
            }
            case ContentType.form:{
                content_type = 'multipart/form-data';break;
            }
        }
        return new HttpHeaders({
            "Authorization": localStorage.getItem('token_type')+" "+localStorage.getItem('token_access')
          });
    }

    protected getListAll(defaultOrder:boolean = true,orderBy:string=''):HttpParams{
        let param = new HttpParams().set('list_all',true);
        if(!defaultOrder){
            param = param.set('order_by',orderBy);
        }
        return param;
    }
}
