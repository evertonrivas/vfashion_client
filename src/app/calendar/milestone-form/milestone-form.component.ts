import { Component, OnDestroy, OnInit,Input,Output,EventEmitter,OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataManipulation } from 'src/app/datamanipulation';
import { CalendarEvent, CalendarEventData, CalendarEventType, EventTypeOptions } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { IAngularMyDpOptions, IMyDateModel } from 'trade-datepicker/public-api';

@Component({
  selector: 'app-milestone-form',
  templateUrl: './milestone-form.component.html',
  styleUrls: ['./milestone-form.component.scss']
})
export class MilestoneFormComponent extends DataManipulation implements OnInit, OnDestroy,OnChanges{
  @Input() selectedEvent:CalendarEvent | null = null;
  @Output() CloseModal = new EventEmitter<boolean>;
  eventTypes:CalendarEventType[] = [];
  selectedEventType:CalendarEventType;

  frmMilestone:FormGroup = new FormGroup({
    slMilestoneType : new FormControl('',Validators.required),
    txtMilestoneName: new FormControl('',Validators.required),
    dtMilestoneStart: new FormControl('',Validators.required)
  });

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    holidayDates: [],
    firstDayOfWeek: "su",
    
  };
  selectedDate:IMyDateModel | null = null;

  constructor(private svc:CalendarService,
    private toastr:ToastrService){
    super()

    this.selectedEventType = {
      id: "",
      name: "",
      has_budget: false,
      hex_color: "",
      is_milestone: false,
      use_collection: false,
      children: [],
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedEvent!=null){
      this.selectedEventType.id = this.selectedEvent.type.id;
    }
    this.frmMilestone.controls["txtMilestoneName"].setValue(this.selectedEvent?.name);
    let data = this.selectedEvent?.start_date;
    if (data!=undefined){
      this.selectedDate = {
        isRange:false,
        singleDate:{
          date:{
            day: parseInt(String(data).slice(0,2)),
            month: parseInt(String(data).slice(3,5)),
            year: parseInt(String(data).slice(6,10)),
          }
        }
      }
    }    
  }

  onSubmit():boolean{
    this.hasSend = true;
    if (this.frmMilestone.invalid){
      return false;
    }

    let event:CalendarEventData ={
      id: this.selectedEvent?.id as number,
      name: this.frmMilestone.controls["txtMilestoneName"].value,
      date_start: this.frmMilestone.controls["dtMilestoneStart"].value,
      date_end: this.frmMilestone.controls["dtMilestoneStart"].value,
      budget_value: null,
      id_event_type: this.frmMilestone.controls["slMilestoneType"].value,
      id_collection: null
    }

    this.serviceSub[1] = this.svc.calendarEventSave(event).subscribe({
      next: (data) =>{
        if(data){
          this.toastr.success("Marco salvo com sucesso!");
          this.frmMilestone.reset();
          this.selectedEventType = {
            id: "",
            name: "",
            has_budget: false,
            hex_color: "",
            is_milestone: false,
            use_collection: false,
            children: [],
          };
          this.hasSend = false;
        }
      },
      complete: () => {
        this.CloseModal.emit(true);
      },
    });
    return true;
  }

  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
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

  closeForm():void{
    this.frmMilestone.reset();
    this.hasSend = false;
    this.selectedEventType = {
      id: "",
      name: "",
      has_budget: false,
      hex_color: "",
      is_milestone: false,
      use_collection: false,
      children: [],
    };
    this.CloseModal.emit(true);
  }

  onDateChanged(event:IMyDateModel){
    this.selectedDate = event;
  }
}
