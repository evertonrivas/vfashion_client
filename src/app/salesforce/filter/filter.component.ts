import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FilterService } from 'src/app/services/filter.service';
import { ProductCategory, ProductCollection, B2bBrand, ProductType,ProductModel, Size, Color, Filter } from 'src/app/services/filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() filteredEvent = new EventEmitter<Filter>();

  faFilter = faFilter;
  myfilter:Filter = {
    brand : [],
    categories : [],
    collections: [],
    types: [],
    colors: [],
    sizes: [],
    model: [],
    query: ''
  };
  itCategoryData:ProductCategory[] = [];
  itTypeData:ProductType[] = [];
  itCollectionData:ProductCollection[] = [];
  itBrandData:B2bBrand[] = [];
  itColorData:Color[] = [];
  itModelData:ProductModel[] = [];
  itSizeData:Size[] = [];

  selectedCategory   = new Array();
  selectedType       = new Array();
  selectedCollection = new Array();
  selectedBrand      = new Array();
  selectedColors     = new Array();
  selectedSizes      = new Array();
  selectedModel      = new Array();

  constructor(config:NgSelectConfig,
    private svcFilter:FilterService,
    private route:Router){
    config.notFoundText = 'Nada para selecionar!';
    config.placeholder = 'Selecione um ou mais itens...';
  }

  ngOnInit():void{

    this.svcFilter.listBrand().subscribe({
      next: data => {
        this.itBrandData = data;
      }
    });

    this.svcFilter.listCollection().subscribe({
      next: data => {
        this.itCollectionData = data;
      }
    });

    this.svcFilter.listCategory().subscribe({
      next: data =>{
        this.itCategoryData = data;
      }
    });

    this.svcFilter.listType().subscribe({
      next: data => {
        this.itTypeData = data;
      }
    });

    this.svcFilter.listModel().subscribe({
      next: data => {
        this.itModelData = data;
      }
    });

    this.svcFilter.listSize().subscribe({
      next: data => {
        this.itSizeData = data;
      }
    });

    this.svcFilter.listColor().subscribe({
      next: data => {
        this.itColorData = data;
      }
    });
  }

  setFilter():void{
    this.myfilter.brand       = this.selectedBrand;
    this.myfilter.categories  = this.selectedCategory;
    this.myfilter.types       = this.selectedType;
    this.myfilter.collections = this.selectedCollection;
    this.myfilter.model       = this.selectedModel;
    this.myfilter.colors      = this.selectedColors;
    this.myfilter.sizes       = this.selectedSizes;

    this.route.navigate(["/salesforce/gallery"]).finally(() =>{
      this.filteredEvent.emit();
      this.svcFilter.announceFilter(this.myfilter);
    });
  }
}
