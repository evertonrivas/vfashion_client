import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Calendar, CalendarEventType, CalendarOptions, EventTypeOptions } from '../models/calendar.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  calendarLoad(options:CalendarOptions):Observable<Calendar[]>{
    return this.http.get<Calendar[]>(this.sys_config.backend_scm+'/calendar/',{
      headers: this.getHeader(),
      params: new HttpParams().set("query",options.search)
    });
  }

  eventTypeSave(event:CalendarEventType):Observable<boolean>{
    let data;
    if (event.id!=0){
      data = {
        id: event.id,
        name: event.name,
        hex_color: event.hex_color,
        has_budget: event.has_budget
      }
    }else{
      data = {
        name: event.name,
        hex_color: event.hex_color,
        has_budget: event.has_budget
      }
    }
    return this.http.post<boolean>(this.sys_config.backend_scm+'/event-type',data,{
      headers: this.getHeader(true)
    });
  }

  eventTypeList(options:EventTypeOptions):Observable<CalendarEventType[]>{
    let myParams:HttpParams = new HttpParams().set("page",options.page);
    if (options.pagSize!=undefined){
      myParams = myParams.set("pageSize",options.pagSize as number);
    }
    if (options.search!=undefined){
      myParams = myParams.set("query",options.search as string);
    }
    if(options.orderBy!=undefined){
      myParams = myParams.set("order_by",options.orderBy as string).set("order_dir",options.orderDir);
    }else{
      myParams = myParams.set("order_dir",options.orderDir);
    }
    myParams = myParams.set("list_all",options.list_all);
    return this.http.get<CalendarEventType[]>(this.sys_config.backend_scm+'/event-type',{
      headers: this.getHeader(),
      params: myParams
    });
  }

}
