export interface Entity {
}
import { Paginate } from "./paginate.model"

export interface Entity {
    id:number | undefined,
    username:string,
    type:string,
    active: boolean
    password: string | undefined,
    date_created: string | undefined,
    date_updated: string | undefined,
}

export interface EntityOptions{
    orderBy:string | null,
    orderDir:'ASC' | 'DESC',
    pagSize:number | null,
    search:string | null,
    page:number
    export: boolean
}

export interface EntityResponse{
    pagination: Paginate
    data: Entity[]
}