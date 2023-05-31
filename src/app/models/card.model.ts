import { FormatType } from "../dashboard/card/card.component";

export interface Card {
    dataType:FormatType,
    icon:string|null,
    title:string|null,
    subtitle:string|null,
    text:string|null
    value:number
}
