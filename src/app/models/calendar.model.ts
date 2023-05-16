export interface Months{
    position: string,
    weeks: number[]
}

export interface Calendar{
    year: number,
    months: Months[]
}

export interface CalendarOptions{
    search:string
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
    name:string,
    hex_color:string,
    has_budget:boolean
}