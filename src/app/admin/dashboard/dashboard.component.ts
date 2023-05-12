import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EChartsOption} from 'echarts';
import { EntityType } from 'src/app/models/entity.model';
import { DashboardService } from 'src/app/services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  implements OnInit{
  totalValueOrder:number = 0;
  totalOrder:number = 0;
  totalRepresentative:number = 0;
  totalCustomer:number = 0;
  chartRepresentative:EChartsOption = {
    tooltip:{
      trigger: 'axis',
      axisPointer:{
        type: 'shadow'
      },
      valueFormatter: (value) => formatCurrency(parseFloat(value.toString()),"pt","R$")
    },
    legend:{},
    grid:{
      left:'3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      tooltip:{
        formatter: function(params: { value: any; }){
          console.log(params.value);
        }
      }
    },
    xAxis:{
      type: 'value',
      boundaryGap: [0,0.01]
    },
    yAxis:{
      type: 'category',
      data:['José','Paulo','Vieira','Constantino','Makoto & Makoto']
    },
    series:[{
      name: 'Última Coleção',
      type: 'bar',
      data:[10000, 25000, 15000, 12000, 18000],
      markLine:{
        data:[{ type: 'average', name: 'Média'}]
      }
    }]
  }

  constructor(private svc:DashboardService){

  }

  ngOnInit(): void {
    this.svc.countEntity(EntityType.C).subscribe((data) =>{ this.totalCustomer = data; });
    this.svc.countEntity(EntityType.R).subscribe((data) =>{ this.totalRepresentative = data; });
    /*this.svc.countOrder().subscribe((data) => { this.totalOrder = data; });
    this.svc.valueOrder().subscribe((data) => { this.totalOrder = data; });
    this.svc.valueOrderByRepresentative().subscribe({
      next: response =>{
        this.chartRepresentative = {
          tooltip:{
            trigger: 'axis',
            axisPointer:{
              type: 'shadow'
            },
            valueFormatter: (value) => formatCurrency(parseFloat(value.toString()),"pt","R$")
          },
          legend:{},
          grid:{
            left:'3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            tooltip:{
              formatter: function(params: { value: any; }){
                console.log(params.value);
              }
            }
          },
          xAxis:{
            type: 'value',
            boundaryGap: [0,0.01]
          },
          yAxis:{
            type: 'category',
            data: response.representatives
          },
          series:[{
            name: 'Última Coleção',
            type: 'bar',
            data: response.values,
            markLine:{
              data:[{ type: 'average', name: 'Média'}]
            }
          }]
        }
      }
    });*/
  }

}
