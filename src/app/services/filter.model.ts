export interface Filter{
    brand: string[],
    model: string[],
    categories: string[],
    types: string[],
    collections: string[],
    colors: string[],
    sizes: string[],
    query:string
  }

export interface B2bBrand{
    id: number,
    name: string|null,
    date_created: string,
    date_updated: string|null
}

export interface ProductCollection{
    id: number,
    name: string,
    table_prices: string[]|null
}

export interface ProductCategory{
    id: number,
    name: string|null,
    id_parent: number|null,
    date_created: string,
    date_updated: string|null
}

export interface ProductType{
    id:number,
    name:string
}

export interface ProductModel{
    id: number,
    name: string
}

export interface Size{
    id: number,
    size_name:string,
    size:string
}

export interface Color{
    id: number,
    hexcode:string,
    name:string,
    color:string
}
