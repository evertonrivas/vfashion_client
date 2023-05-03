import { Paginate } from "./paginate.model"

export interface User {
    id:number,
    username:string,
    password: string | null,
    type:string,
    date_created: string,
    date_updated: string,
    active: boolean
}

export interface UserOptions{
    orderBy:string | null,
    orderDir:'ASC' | 'DESC',
    pagSize:number | null,
    search:string | null,
    page:number
}

export interface UserResponse{
    pagination: Paginate
    data: User[]
}