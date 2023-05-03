export class Pagination {
    response:any;
    options:any;
    get numbers(): number[]{
        //funcao necessaria para formatar as pagianas da paginacao
        const limit = this.response.paginate.pages;
        let retorno = Array.from({length: limit}, (_,i) => i+1);
        return retorno;
    }

    next(){

    }

    prev(){

    }

    to(page:number){

    }
}
