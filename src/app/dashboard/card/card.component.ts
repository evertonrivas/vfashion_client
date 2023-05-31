import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() isMoney:boolean      = false;
  @Input() isNumber:boolean     = false;
  @Input() isText:boolean       = false;
  @Input() icon:string|null     = null;
  @Input() title:string|null    = null;
  @Input() subtitle:string|null = null;
  @Input() text:string|null     = null;
  @Input() value:number         = 0;

  constructor(){

  }
}
