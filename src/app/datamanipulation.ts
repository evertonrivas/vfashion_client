import { Subscription, filter } from "rxjs";
import { Checkbox } from "./models/checkbox.model";
import { Paginate } from "./models/paginate.model";
import * as Papa from 'papaparse';

export interface Response{
    pagination: Paginate,
    data: any
}

export enum FileType {
    JSON = 0,
    CSV = 1,
    STR = 2
}

export class DataManipulation{
    response:Response;
    options:any;
    masterChecked:boolean = false;
    hasSend:boolean = false;
    hasSendDelete:boolean = false;
    isEdit:boolean = false;
    registryChecked:Checkbox = {};
    serviceSub:Subscription[] = [];
    isCollapsedMassive:boolean = false;
    isCollapsedFilter:boolean = false;
    offcanvas:any;
    modal:any;
    totalChecked:number = 0;
    message:string = "";
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

        for(let i=0;i<10;i++){
            if (this.serviceSub[i]==undefined)
                this.serviceSub.push(new Subscription);
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

    /**
     * 
     * @param data 
     * @param type J = JSON, C = JSON to CSV, S = String IN CSV Format
     */
    exportFile(data:any, type:FileType = FileType.JSON):void{
        const link = document.createElement("a");

        if (type==FileType.CSV){
            const string = JSON.stringify(data);
            const json = JSON.parse(string);
            const csvString = Papa.unparse(json,{delimiter:';'});
            const blob = new Blob([csvString],{type: 'application/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            
            link.href  = url;
            link.download = "data.csv";
        }
        else if(type==FileType.JSON){
            let theJSON = JSON.stringify(data);
            const blob = new Blob([theJSON],{type: 'application/json;charset=utf-8'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.download = 'data.json';
        }else if(type==FileType.STR){
            const blob = new Blob([data],{type: 'application/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.download = "data.csv";
        }

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }
}
