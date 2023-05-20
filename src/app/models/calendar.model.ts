import { Collection } from "./collection.model"

export interface Months{
    position: number,
    weeks: number[]
}

export interface Calendar{
    year: number,
    months: Months[]
}

export interface CalendarOptions{
    search:string,
    milestone:boolean
}

export interface EventTypeOptions{
    orderBy:string | null,
    orderDir:'ASC' | 'DESC',
    pagSize:number | null,
    search:string | null,
    page:number
    list_all: boolean
}

export interface CalendarEventType{
    id: number,
    name:string | null,
    hex_color:string,
    has_budget:boolean,
    use_collection:boolean,
    is_milestone:boolean
}

export interface CalendarEvent{
    id:number,
    name:string,
    start_week:number,
    end_week:number,
    type: CalendarEventType,
    year:number,
    budget_value:number | null,
    collection: Collection
}

export interface CalendarEventData{
    id:number,
    name:string,
    date_start:string,
    date_end:string,
    id_event_type: number,
    id_collection:number | null,
    budget_value:number | null
}