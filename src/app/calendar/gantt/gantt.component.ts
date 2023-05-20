import { Component, OnInit, OnDestroy, AfterViewInit,ViewEncapsulation,ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataManipulation } from 'src/app/datamanipulation';
import { Calendar, CalendarEvent, CalendarEventData, CalendarEventType, CalendarOptions, EventTypeOptions } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { ToastrService } from 'ngx-toastr';

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

  override options:CalendarOptions = {
    search: "is:start ,is:end ",
    milestone:false
  };
  totalWeeks:number[][] = [];
  eventsCalendar:CalendarEvent[] = [];
  eventType:CalendarEventType[] = [];
  selectedEventType:CalendarEventType;
  showEventTypeBudget:boolean = false;
  showEventTypeCollection:boolean = false;
  milestones:CalendarEvent[] = [];

  frmCal:FormGroup = new FormGroup({
    slType: new FormControl('',Validators.required),
    slCollection: new FormControl(''),
    txtName: new FormControl('',Validators.required),    
    dtInicio: new FormControl('',Validators.required),
    dtFim: new FormControl('',Validators.required),
    txtBudget: new FormControl('')
  });

  constructor(private svc:CalendarService,
    private toastr:ToastrService){
    super()
    this.selectedEventType = {
      id: 0,
      name: "",
      has_budget: false,
      hex_color: "",
      use_collection: false,
      is_milestone:false
    }
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
    this.serviceSub[3].unsubscribe();
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

  ngOnInit(): void {
    this.loadData();
  }

  loadData():void{

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

    //realiza carga dos eventos que nao sao marcos do calendario
    this.options.milestone = false;
    this.serviceSub[1] = this.svc.calendarEventLoad(this.options).subscribe({
      next: (data) =>{
        this.eventsCalendar = data;
        this.eventsCalendar.forEach((evt:CalendarEvent)=>{
          if (this.registryChecked[(evt.id as number)]==undefined){
            this.registryChecked[(evt.id as number)] = false;
          }
        });
        //console.log(this.registryChecked);
      }
    });

    //realiza carga dos milestones que sao marcos do calendario
    this.options.milestone = true;
    this.serviceSub[1] = this.svc.calendarEventLoad(this.options).subscribe({
      next: (data) =>{
        this.milestones = data;
      }
    });



    let opt:EventTypeOptions = {
      list_all: true,
      orderBy: "name",
      orderDir: 'ASC',
      page: 0,
      pagSize: null,
      search: null
    }

    //realiza carga dos tipos de eventos
    this.serviceSub[3] = this.svc.eventTypeList(opt).subscribe({
      next: (data) =>{
        this.eventType = data;
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

  onSubmit():boolean{
    this.hasSend = true;
    if (this.frmCal.invalid){
      console.log("retornou aqui")
      this.hasSend = false;
      return false;
    }
    let event:CalendarEventData = {
      id: 0,
      name: this.frmCal.controls["txtName"].value,
      date_start: this.frmCal.controls["dtInicio"].value,
      date_end: this.frmCal.controls["dtFim"].value,
      budget_value: this.frmCal.controls["txtBudget"].value,
      id_event_type: this.frmCal.controls["slType"].value,
      id_collection: this.frmCal.controls["slCollection"].value
    };

    this.serviceSub[5] = this.svc.calendarEventSave(event).subscribe({
      next: (data) =>{
        if (data){
          this.toastr.success("Evento salvo com sucesso!");
          this.loadData();
          this.frmCal.controls["txtName"].setValue("");
          this.frmCal.controls["dtInicio"].setValue("");
          this.frmCal.controls["dtFim"].setValue("");
          this.frmCal.controls["txtBudget"].setValue("");
          this.frmCal.controls["slType"].setValue("");
          this.frmCal.controls["slCollection"].setValue("");
          this.offcanvas.hide();
          this.hasSend = false;
        }
      }
    });

    return true
  }

  onNew():void{
    this.showEventTypeBudget = this.showEventTypeCollection = false;
    this.frmCal.controls['slType'].setValue('');
    this.frmCal.controls['slCollection'].setValue('');
    this.frmCal.controls['txtName'].setValue('');
    this.offcanvas.show();
  }

  onChangeType():void{
    let selected = this.eventType.find((v) =>{
      return v.id==this.selectedEventType.id
    });
    
    if ( selected!==undefined){
      this.showEventTypeCollection = selected.use_collection;
      this.showEventTypeBudget = selected.has_budget;
    }else{
      this.showEventTypeBudget = this.showEventTypeCollection = false;
    }
  }
}
