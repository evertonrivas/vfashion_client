import { Subscription } from "rxjs";
import { Checkbox } from "../models/checkbox.model";
import { Paginate } from "../models/paginate.model";

interface Response{
    pagination: Paginate,
    data: any
}

export class DataManipulation{
    response:Response;
    options:any;
    masterChecked:boolean = false;
    hasSend:boolean = false;
    isEdit:boolean = false;
    registryChecked:Checkbox = {};
    serviceSub:Subscription = new Subscription;
    isCollpasedMassive:boolean = false;
    offcanvas:any;
    dialog:any;
    totalToChange:number = 0;

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
        //funcao necessaria para formatar as paginas da paginacao
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

    setPaginationSize(size:number):void{
        this.options.pagSize = size;
    }

    checkUncheckAll():void{
        Object.keys(this.registryChecked).forEach((v) =>{
          this.registryChecked[Number(v)] = this.masterChecked;
        });
    }

    collpaseMassive():void{
        this.isCollpasedMassive = !this.isCollpasedMassive;
    }

    exportCSV():void{
        this.options.export = true
    }

    exportJSON():void{
        this.options.export = true
    }
}
