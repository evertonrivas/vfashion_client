import { Subscription } from "rxjs";
import { Checkbox } from "../models/checkbox.model";
import { Paginate } from "../models/paginate.model";
import * as Papa from 'papaparse';

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
    isCollapsedMassive:boolean = false;
    isCollapsedFilter:boolean = false;
    offcanvas:any;
    modal:any;
    totalToChange:number = 0;
    msgMassive:string = "";
    searchTerm:string = "";

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

    collapseMassive():void{
        this.isCollapsedMassive = !this.isCollapsedMassive;
        let el:HTMLElement|null = document.getElementById("massiveFilterPanel");
        if(el!=null){
            if(el.className=="collapse show"){
                this.isCollapsedFilter = false;
            }
        }
    }

    collapseFilter():void{
        this.isCollapsedFilter = !this.isCollapsedFilter;
        let el:HTMLElement|null = document.getElementById("massiveFilterPanel");
        if(el!=null){
            if(el.className=="collapse show"){
                this.isCollapsedMassive = false;
            }
        }
    }

    exportFile(data:any, type:string = "J"):void{
        const link = document.createElement("a");

        if (type=="C"){
            const string = JSON.stringify(data);
            const json = JSON.parse(string);
            const csvString = Papa.unparse(json,{delimiter:';'});
            const blob = new Blob([csvString],{type: 'application/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            
            link.href  = url;
            link.download = "data.csv";
        }
        else{
            let theJSON = JSON.stringify(data);
            const blob = new Blob([theJSON],{type: 'application/json;charset=utf-8'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.download = 'data.json';
        }

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }
}
