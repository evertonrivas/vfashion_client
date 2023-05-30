import { Component,Input,OnInit,OnDestroy,Output,EventEmitter,OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataManipulation } from 'src/app/datamanipulation';
import { CalendarEvent, CalendarEventData, CalendarEventType, EventTypeOptions } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { IAngularMyDpOptions, IMyDateModel } from 'trade-datepicker';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent extends DataManipulation implements OnInit,OnDestroy,OnChanges{
  @Input() selectedEvent:CalendarEvent | null = null;
  @Input() selectedPeriod:IMyDateModel | null = null;
  @Output() CloseModal = new EventEmitter<boolean>;

  selectedEventType:CalendarEventType;
  showEventTypeCollection:boolean = false;
  showEventTypeBudget:boolean = false;
  eventTypes:CalendarEventType[] = [];

  //trabalho com children
  showParentEvents:boolean = false;
  exsistentEvents:CalendarEvent[] = []
  selectedParentEventId:number = 0;

  myDpOptStart: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    holidayDates: [],
    firstDayOfWeek: "su"
  };

  myDpOptEnd:IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:'dd/mm/yyyy',
    holidayDates: [],
    firstDayOfWeek: 'su'
  }
  selectedDateStart:IMyDateModel | null = null;
  selectedDateEnd:IMyDateModel | null = null;

  frmEvent:FormGroup = new FormGroup({
    slEventType: new FormControl('',Validators.required),
    slEventCollection: new FormControl(''),
    txtEventName: new FormControl('',Validators.required),
    dtEventStart: new FormControl('',Validators.required),
    dtEventEnd: new FormControl('',Validators.required),
    txtEventBudget: new FormControl(''),
    slEventParent: new FormControl('')
  });

  constructor(private svc:CalendarService,
    private toastr:ToastrService){
    super();

    this.selectedEventType = {
      id: 0,
      name: "",
      has_budget: false,
      hex_color: "",
      is_milestone: false,
      use_collection: false,
      children: [],
    }
  }

  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
  }

  ngOnChanges():void{
    if (this.selectedEvent!=null){
      this.selectedEventType.id = this.selectedEvent.type.id;
      if(this.selectedEvent.id_parent!=null){
        this.selectedParentEventId = this.selectedEvent.id_parent as number;
        //colocar aqui a carga de eventos existentes e tambem o evento selecionado
        let parentEventType:CalendarEventType = {
          id: 0,
          name: null,
          is_milestone: false,
          use_collection: false,
          has_budget: false,
          hex_color:"",
          children: []
        };

        this.eventTypes.find((evt) =>{
          evt.children.find((v) =>{
            if (v.id==this.selectedEventType.id){
              parentEventType = evt;
            }
            return v;
          });
        });

        
        let dt_start = this.selectedPeriod?.dateRange?.beginDate?.year+'-'+this.selectedPeriod?.dateRange?.beginDate?.month+'-'+this.selectedPeriod?.dateRange?.beginDate?.day;
        let dt_end   = this.selectedPeriod?.dateRange?.endDate?.year+'-'+this.selectedPeriod?.dateRange?.endDate?.month+'-'+this.selectedPeriod?.dateRange?.endDate?.day;
        this.svc.calendarEventLoad({
          milestone:false,
          search: 'is:start '+dt_start+'||is:end '+dt_end+'||is:event-type '+parentEventType.id.toString()
        }).subscribe({
          next: (data) =>{
            this.exsistentEvents = data;
          },
          complete:() =>{
            this.showParentEvents = true;
            this.frmEvent.controls["slEventParent"].setValue(this.selectedEvent?.id_parent);
          }
        });
      }
      this.selectedDateStart = {
        isRange: false,
        singleDate:{
          date:{
            day: parseInt(this.selectedEvent.start_date.substring(8,10)),
            month: parseInt(this.selectedEvent.start_date.substring(5,7)),
            year: parseInt(this.selectedEvent.start_date.substring(0,4))
          }
        }
      }

      this.selectedDateEnd = {
        isRange: false,
        singleDate:{
          date:{
            day: parseInt(this.selectedEvent.end_date.substring(8,10)),
            month: parseInt(this.selectedEvent.end_date.substring(5,7)),
            year: parseInt(this.selectedEvent.end_date.substring(0,4))
          }
        }
      }

      if (this.selectedEvent.budget_value!=null){
        this.showEventTypeBudget = true;
        this.frmEvent.controls["txtEventBudget"].setValue(this.selectedEvent.budget_value);
      }

      this.frmEvent.controls["txtEventName"].setValue(this.selectedEvent.name);
    }
  }

  ngOnInit(): void {
    let opt:EventTypeOptions = {
      list_all: true,
      orderBy: "name",
      orderDir: 'ASC',
      page: 0,
      pagSize: null,
      search: null
    }

    //realiza carga dos tipos de eventos
    this.serviceSub[0] = this.svc.eventTypeList(opt).subscribe({
      next: (data) =>{
        this.eventTypes = data;
      }
    });
  }

  onSubmit():boolean{
    this.hasSend = true;
    if (this.frmEvent.invalid){
      return false;
    }
    let dstart = this.selectedDateStart?.singleDate?.date?.year+"-"+this.selectedDateStart?.singleDate?.date?.month+"-"+this.selectedDateStart?.singleDate?.date?.day;
    let dend   = this.selectedDateEnd?.singleDate?.date?.year+"-"+this.selectedDateEnd?.singleDate?.date?.month+"-"+this.selectedDateEnd?.singleDate?.date?.day;
    let event:CalendarEventData = {
      id: (this.selectedEvent?.id as number) >0 ? (this.selectedEvent?.id as number): 0,
      id_parent: this.showParentEvents? this.frmEvent.controls["slEventParent"].value: null,
      name: this.frmEvent.controls["txtEventName"].value,
      date_start: dstart,
      date_end: dend,
      budget_value: this.showEventTypeBudget ? this.frmEvent.controls["txtEventBudget"].value: null,
      id_event_type: this.frmEvent.controls["slEventType"].value,
      id_collection: this.showEventTypeCollection? this.frmEvent.controls["slEventCollection"].value: null,
      year: this.selectedDateStart?.singleDate?.date?.year as number
    };

    this.serviceSub[1] = this.svc.calendarEventSave(event).subscribe({
      next: (data) =>{
        if (data){
          this.toastr.success("Evento salvo com sucesso!");
          this.frmEvent.reset();
          this.frmEvent.controls["slEventType"].setValue('');
          this.hasSend = false;
        }
      },
      complete: () =>{
        this.hasSend = false;
        this.showEventTypeBudget = this.showEventTypeCollection = this.showParentEvents = false;
        this.frmEvent.reset();
        this.frmEvent.controls["slEventType"].setValue('');
        this.exsistentEvents = [];
        this.selectedEvent = null;
        this.CloseModal.emit(true);
      }
    });

    return true
  }

  onChangeType():void{
    this.showEventTypeBudget = this.showEventTypeCollection = this.showParentEvents = false;
    this.frmEvent.controls['slEventParent'].removeValidators(Validators.required);
    this.frmEvent.controls['txtEventBudget'].removeValidators(Validators.required);
    let parentEventType:CalendarEventType = {
      id: 0,
      name: null,
      is_milestone: false,
      use_collection: false,
      has_budget: false,
      hex_color:"",
      children: []
    };

    //busca em tipos de eventos
    let selected = this.eventTypes.find((v) =>{
      return v.id==this.selectedEventType.id
    });

    //busca em tipos de eventos filhos
    if (selected==undefined){
      this.eventTypes.find((evt) =>{
        selected = evt.children.find((v) =>{
          if (v.id==this.selectedEventType.id){
            parentEventType = evt;
          }
          return v;
        });
      });
    }
  
    if ( selected!==undefined){
      this.showEventTypeCollection = selected.use_collection;
      this.showEventTypeBudget = selected.has_budget;

      if (parseInt(parentEventType.id.toString()) > 0){
        this.showParentEvents = true;
        this.frmEvent.controls['slEventParent'].addValidators(Validators.required);
        this.frmEvent.controls['txtEventBudget'].addValidators(Validators.required);
        //realizar aqui a carga de dados dos eventos conforme o tipo do evento pai
        let dt_start = this.selectedPeriod?.dateRange?.beginDate?.year+'-'+this.selectedPeriod?.dateRange?.beginDate?.month+'-'+this.selectedPeriod?.dateRange?.beginDate?.day;
        let dt_end   = this.selectedPeriod?.dateRange?.endDate?.year+'-'+this.selectedPeriod?.dateRange?.endDate?.month+'-'+this.selectedPeriod?.dateRange?.endDate?.day;
        this.svc.calendarEventLoad({
          milestone:false,
          search: 'is:start '+dt_start+'||is:end '+dt_end+'||is:event-type '+parentEventType.id.toString()
        }).subscribe({
          next: (data) =>{
            this.exsistentEvents = data;
          }
        });
      }
    }
  }

  closeForm():void{
    this.frmEvent.reset();
    this.frmEvent.controls["slEventType"].setValue('');
    this.exsistentEvents = [];
    this.showEventTypeBudget = this.showEventTypeCollection = this.showParentEvents = false;
    this.CloseModal.emit(true);
  }

  onDateStartChanged(event:IMyDateModel){
    this.selectedDateStart = event;
  }

  onDateEndChanged(event:IMyDateModel){
    this.selectedDateEnd = event;
  }

  setPeriod():void{
    //selectedParentEvent
    let copyStart = JSON.parse(JSON.stringify(this.myDpOptStart));
    let copyEnd   = JSON.parse(JSON.stringify(this.myDpOptEnd));
    let choicedEvent:CalendarEvent | undefined = this.exsistentEvents.find((v) => { return v.id==this.selectedParentEventId });
    copyStart.disableUntil ={
      day:  parseInt(String(choicedEvent?.start_date).substring(8,10)),
      month: parseInt(String(choicedEvent?.start_date).substring(5,7)),
      year: parseInt(String(choicedEvent?.start_date).substring(0,4))
    }
    copyStart.disableSince = {
      day:  parseInt(String(choicedEvent?.end_date).substring(8,10)),
      month: parseInt(String(choicedEvent?.end_date).substring(5,7)),
      year: parseInt(String(choicedEvent?.end_date).substring(0,4))
    }

    copyEnd.disableUntil ={
      day:  parseInt(String(choicedEvent?.start_date).substring(8,10)),
      month: parseInt(String(choicedEvent?.start_date).substring(5,7)),
      year: parseInt(String(choicedEvent?.start_date).substring(0,4))
    }
    copyEnd.disableSince = {
      day:  parseInt(String(choicedEvent?.end_date).substring(8,10)),
      month: parseInt(String(choicedEvent?.end_date).substring(5,7)),
      year: parseInt(String(choicedEvent?.end_date).substring(0,4))
    }

    this.selectedDateStart = {
      isRange: false,
      singleDate: {
        date:{
          day:  parseInt(String(choicedEvent?.start_date).substring(8,10)),
          month: parseInt(String(choicedEvent?.start_date).substring(5,7)),
          year: parseInt(String(choicedEvent?.start_date).substring(0,4))
        }
      }
    }

    this.selectedDateEnd = {
      isRange: false,
      singleDate:{
        date:{
          day:  parseInt(String(choicedEvent?.end_date).substring(8,10)),
          month: parseInt(String(choicedEvent?.end_date).substring(5,7)),
          year: parseInt(String(choicedEvent?.end_date).substring(0,4))
        }
      }
    }

    this.myDpOptStart = copyStart;
    this.myDpOptEnd = copyEnd;
  }
}