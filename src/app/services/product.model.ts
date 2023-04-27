export interface Image{
    id:number,
    img_url:string
}

export interface Paginate{
    registers: number,
    page:number,
    per_page:number,
    pages:number,
    has_next:boolean
}

export interface Product{
    id: number,
    id_category: number,
    prodCode:string,
    barCode:string|null,
    refCode:string,
    name:string,
    description:string|null,
    observation:string|null,
    ncm:string|null,
    price: string,
    measure_unit:string,
    structure:string,
    date_created:string,
    date_updated:string|null,
    images: Image[]
}

export interface ResponsePaginativeProduct{
    paginate: Paginate,
    data: Product[]
}

export interface GalleryOptions{
    orderBy:string,
    orderDir:'ASC' | 'DESC',
    search:string,
    brand: string,
    collection: string,
    category: string,
    model: string,
    type: string,
    color: string,
    size: string,
    pagSize:number,
    page:number
}


export interface ProductStockSizes{
    size_code: string,
    size_name: string,
    size_value: number
}

export interface ProductStock{
    color_name: string,
    color_hexa: string,
    color_code:string,
    sizes : ProductStockSizes[]
}

export interface Grid{
    [key:number]: {
        [key:string]:{
            [key:string]: number
        }
    }
}

export interface SubTotal{
    [key:number]: {
        [key:string]:number
    }
}