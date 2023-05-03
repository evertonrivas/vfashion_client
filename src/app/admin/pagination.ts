import { Paginate } from "../models/paginate.model";

interface Response{
    pagination: Paginate,
    data: any
}

export class Pagination {
    response:Response;
    options:any;

    constructor(){
        this.response = {
            pagination : {
                page : 0,
                has_next : false,
                pages : 0,
                per_page : 0,
                registers: 0
            },
            data : undefined
        }
    }

    get numbers(): number[]{
        //funcao necessaria para formatar as pagianas da paginacao
        const limit = this.response.pagination.pages;
        let retorno = Array.from({length: limit}, (_,i) => i+1);
        return retorno;
    }

    next(){
        this.options.page++;
    }

    prev(){
        this.options.page--;
    }

    to(page:number){
        this.options.page = page;
    }
}
