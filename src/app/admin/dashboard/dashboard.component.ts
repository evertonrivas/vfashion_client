import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EChartsOption} from 'echarts';


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
  options:EChartsOption = {
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
      data:[10000, 25000, 15000, 12000, 18000]
    }]
  }

  constructor(){

  }

  ngOnInit(): void {
    
  }

}
