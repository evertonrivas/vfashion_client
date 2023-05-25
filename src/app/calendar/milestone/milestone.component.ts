import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.scss']
})
export class MilestoneComponent {
  @Input() ComponentColor:string = "";
  @Input() ComponentSize:number = 0;
  @Input() EventName:string = "";
  @Input() DateStart:string = "";
}
