import { Component, OnInit, OnDestroy, AfterViewInit,ViewEncapsulation,ElementRef, ViewChild } from '@angular/core';
import { DataManipulation } from 'src/app/datamanipulation';
import { Calendar, CalendarEvent, CalendarOptions } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { IMyDateModel,IAngularMyDpOptions } from 'trade-datepicker/public-api';

declare var window:any;

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent extends DataManipulation implements OnInit, OnDestroy,AfterViewInit{
  @ViewChild('scrollOne') scrollOne!:ElementRef;
  @ViewChild('scrollTwo') scrollTwo!:ElementRef;
  currentScroll:string = "";

  selectedDate:IMyDateModel ={
    isRange: true,
    dateRange:{
      beginDate:{
        day: 1,
        month: 1,
        year: new Date().getFullYear()
      },
      endDate:{
        day: 1,
        month: 1,
        year: new Date().getFullYear()+1
      }
    }
  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    holidayDates: [],
    firstDayOfWeek: "su",
    
  };

  //Tratamento do Modal
  moduleToOpenName:string = "Evento";
  moduleToOpen:string = "event";
  milestoneToEdit:CalendarEvent | null = null;
  eventToEdit:CalendarEvent | null = null;

  override options:CalendarOptions = {
    search: "is:start ||is:end ",
    milestone:false
  };
  totalWeeks:number[][] = [];
  eventsCalendar:CalendarEvent[] = [];
  milestones:CalendarEvent[] = [];
  totalEventsDisplay:number = 0;

  constructor(private svc:CalendarService){
    super()
  }

  updateVerticalScroll(event:any):void{
    if (this.currentScroll === 'scrollTwo') {
      this.scrollOne.nativeElement.scrollTop = event.target.scrollTop;
    } else if (this.currentScroll === 'scrollOne') {
      this.scrollTwo.nativeElement.scrollTop = event.target.scrollTop;
    }
  }

  updateCurrentElement(element: 'scrollOne' | 'scrollTwo') {
    this.currentScroll = element;
  }

  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
    this.serviceSub[2].unsubscribe();
  }

  ngAfterViewInit(): void {
    const tooltiplist = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltiplist.forEach((tooltipTriggerEl) =>{
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.modal = new window.bootstrap.Modal(
      document.getElementById("modal_massive")
    );

    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById("offcanvas_edit")
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData():void{

    this.totalWeeks = [];
    this.response.data = null;
    this.eventsCalendar = [];
    this.registryChecked = [];
    this.milestones = [];

    //realiza carga das informacoes do calendario (datas)
    this.serviceSub[0] = this.svc.calendarLoad(this.options).subscribe({
      next: (data) =>{
        this.response.data = data;
        this.response.data.forEach((cal:Calendar) => {
          if(this.totalWeeks[cal.year]==undefined){
            this.totalWeeks[cal.year] = [];
          }
          cal.months.forEach((w) =>{
            w.weeks.forEach((n) =>{
              this.totalWeeks[cal.year].push(n);
            });
          });
        });
      }
    });

    //realiza carga dos eventos (exceto Marcos)
    this.options.milestone = false;
    this.serviceSub[1] = this.svc.calendarEventLoad(this.options).subscribe({
      next: (data) =>{
        this.eventsCalendar = data;
        this.totalEventsDisplay = (this.eventsCalendar.length+1)
        this.eventsCalendar.forEach((evt:CalendarEvent)=>{
          if (this.registryChecked[(evt.id as number)]==undefined){
            this.registryChecked[(evt.id as number)] = false;
            evt.children.forEach((c) =>{
              if(this.registryChecked[(c.id as number)]==undefined){
                this.registryChecked[(c.id as number)] = false;
              }
            });
          }
        });
      }
    });

    //realiza carga dos milestones (Exceto eventos longos)
    this.options.milestone = true;
    this.serviceSub[2] = this.svc.calendarEventLoad(this.options).subscribe({
      next: (data) =>{
        this.milestones = data;
      }
    });
  }

  getMonthName(month:number):string{
    let dt = new Date()
    dt.setMonth(month-1);
    return dt.toLocaleString([],{ month:'short' }).replace(".","");
  }

  exportCSV():void{
    let data = "";
    this.exportFile(data,"C");
  }

  exportJSON():void{
    let data = "";
    this.exportFile(data,"J");
  }

  onNewEvent():void{
    this.moduleToOpenName = 'Evento';
    this.moduleToOpen = 'event';
    this.offcanvas.show();
  }

  onEditEvent(evt:CalendarEvent):void{
    this.eventToEdit = evt;
    this.moduleToOpenName = 'Evento';
    this.moduleToOpen = 'event';
    this.offcanvas.show();
  }

  onNewMilestone():void{
    this.moduleToOpenName = 'Marco';
    this.moduleToOpen = 'milestone';
    this.offcanvas.show();
  }

  onEditMilestone(mile:CalendarEvent):void{
    this.milestoneToEdit = mile;
    this.moduleToOpenName = 'Marco';
    this.moduleToOpen = 'milestone';
    this.offcanvas.show();
  }

  toggleSize(eventsLength:number,childrenLength:number):void{
    if (this.totalEventsDisplay==eventsLength)
      this.totalEventsDisplay += eventsLength+childrenLength;
    else{
      this.totalEventsDisplay = eventsLength;
    }
  }

  onCloseModal(needClose:boolean):void{
    if (needClose){
      this.offcanvas.hide();
      this.loadData();
    }
  }

  onDateChanged(event: IMyDateModel):void{
    this.selectedDate = event;
    let dtStart = event.dateRange?.beginDate?.year+"-"+event.dateRange?.beginDate?.month+"-"+event.dateRange?.beginDate?.day;
    let dtEnd = event.dateRange?.endDate?.year+"-"+event.dateRange?.endDate?.month+"-"+event.dateRange?.endDate?.day;
    this.options.search = "is:start "+dtStart+"||is:end "+dtEnd;
    this.loadData();
  }

  formatEventDate(date:string):string{
    let d = date.split("-");
    return d[2]+"/"+d[1];
  }
}
