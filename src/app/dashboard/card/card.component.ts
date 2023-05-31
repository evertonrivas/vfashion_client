import { Component,Input } from '@angular/core';

export enum FormatType{
  MONEY  = 0,
  NUMBER = 1,
  TEXT   = 2,
  HTML   = 3
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() dataType:FormatType = FormatType.TEXT;
  @Input() icon:string|null     = null;
  @Input() title:string|null    = null;
  @Input() subtitle:string|null = null;
  @Input() text:string|null     = null;
  @Input() value:number         = 0;

  constructor(){

  }
}
