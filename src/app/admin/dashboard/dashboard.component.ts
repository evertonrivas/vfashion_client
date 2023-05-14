import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EChartsOption, MarkLineComponentOption} from 'echarts';
import { EntityType } from 'src/app/models/entity.model';
import { DashboardService } from 'src/app/services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  implements OnInit{
  totalValueOrder:number = 32000000;
  totalOrder:number = 350;
  totalRepresentative:number = 0;
  totalCustomer:number = 0;
  chartRepresentative:EChartsOption = {};
  chartLastSell:EChartsOption = {};
  symbols = [
    'path://M2322 10217 c-12 -13 -36 -64 -53 -113 -41 -116 -42 -198 -5 -344 28 -113 42 -204 81 -545 14 -121 38 -282 52 -359 l27 -139 -17 -221 c-10 -121 -29 -313 -42 -426 -32 -258 -42 -492 -26 -627 20 -168 16 -391 -9 -534 -12 -68 -25 -129 -29 -136 -4 -9 -133 55 -413 203 -440 232 -475 246 -644 259 -90 7 -90 7 -163 -30 -260 -131 -285 -305 -145 -1020 49 -247 88 -405 141 -570 47 -144 121 -328 151 -373 16 -25 16 -26 -3 -18 -66 26 -76 28 -92 15 -9 -8 -28 -14 -42 -14 -41 0 -37 -31 14 -104 55 -80 93 -191 66 -191 -5 0 -12 12 -16 27 -10 40 -73 165 -95 187 -23 23 -50 15 -50 -17 0 -12 14 -66 31 -117 34 -102 34 -104 42 -695 1 -70 -7 -107 -62 -300 -75 -263 -123 -467 -156 -664 -13 -80 -32 -193 -42 -251 -32 -185 -23 -280 78 -819 110 -588 209 -948 294 -1071 14 -20 49 -50 77 -65 49 -27 53 -28 158 -21 60 4 172 20 251 37 79 16 174 32 211 36 l68 6 -20 -58 c-36 -104 -23 -128 73 -140 46 -5 57 -10 53 -22 -3 -8 -6 -26 -6 -39 0 -14 -6 -24 -15 -24 -8 0 -30 -14 -49 -30 -59 -52 -57 -120 4 -142 16 -5 38 -25 49 -44 11 -19 27 -34 36 -34 23 0 87 35 109 59 26 29 31 27 48 -18 13 -31 23 -42 49 -48 28 -8 35 -16 44 -49 17 -65 120 -236 186 -309 52 -56 198 -176 259 -212 91 -54 282 -100 371 -90 79 10 161 64 195 129 8 16 33 36 61 48 26 12 58 31 71 43 44 41 221 411 290 609 36 102 135 489 156 611 9 48 23 115 31 149 9 33 14 62 12 64 -2 3 -16 -13 -31 -34 -39 -57 -82 -94 -102 -90 -30 5 -43 47 -70 230 -36 247 -70 365 -129 442 -27 36 -102 92 -111 84 -3 -3 6 -23 21 -43 14 -21 25 -46 25 -56 0 -24 21 -69 32 -69 17 0 7 -58 -17 -90 -14 -19 -25 -38 -25 -42 0 -4 -9 -17 -19 -27 -14 -14 -21 -41 -26 -96 -4 -43 -11 -73 -16 -68 -5 5 -4 35 1 68 21 130 3 485 -26 514 -3 3 -19 -10 -35 -29 -20 -23 -29 -29 -29 -18 0 10 -8 21 -17 27 -17 9 -18 45 -21 504 l-3 495 56 203 c101 366 165 672 165 788 0 26 38 235 84 464 l84 417 65 117 c35 65 79 147 96 182 l32 63 -80 80 c-69 68 -85 79 -110 76 -18 -1 -37 4 -50 16 -15 14 -29 17 -52 12 -17 -3 -40 -1 -51 5 -15 8 -24 7 -38 -6 -14 -13 -19 -13 -22 -3 -11 30 17 60 86 92 73 34 129 50 320 86 116 22 173 46 194 79 43 73 114 297 152 485 l22 108 -28 29 c-26 28 -29 28 -52 13 -22 -15 -25 -14 -44 6 -11 11 -25 19 -31 17 -6 -2 -33 -42 -61 -89 -48 -82 -54 -87 -111 -112 -112 -48 -143 -55 -355 -76 -161 -17 -255 -21 -393 -18 -173 4 -187 6 -279 36 -54 18 -100 36 -102 41 -3 5 -8 64 -12 132 -5 103 -3 141 14 224 36 177 45 257 44 421 -1 277 -69 833 -148 1204 -54 258 -56 268 -49 375 3 61 6 133 5 160 -7 424 4 641 41 810 10 49 19 108 19 130 0 59 -26 126 -65 172 -60 70 -229 143 -332 143 -28 0 -46 -7 -61 -23z m-450 -3936 c112 -52 200 -78 305 -91 48 -6 89 -13 91 -15 2 -2 -3 -79 -12 -172 -21 -220 -36 -485 -36 -653 0 -74 -3 -166 -7 -203 l-6 -68 -19 28 c-30 44 -37 67 -58 197 -31 194 -52 259 -201 630 -143 355 -155 386 -147 386 3 0 43 -18 90 -39z m1119 -303 c61 -41 64 -46 90 -120 30 -88 68 -145 118 -179 31 -22 47 -24 173 -27 l138 -4 9 -36 c49 -183 50 -197 20 -280 -38 -106 -49 -150 -64 -254 -23 -166 -134 -464 -281 -759 -89 -180 -150 -326 -174 -420 -12 -44 -30 -162 -41 -262 -20 -186 -47 -409 -75 -620 -8 -64 -18 -176 -22 -248 l-7 -131 -73 53 c-64 46 -85 71 -164 189 -50 74 -104 150 -119 167 -62 71 -89 262 -52 355 9 23 73 110 143 193 69 83 164 206 211 273 46 67 107 155 135 195 81 117 125 254 143 448 29 303 1 554 -129 1189 -33 162 -60 301 -60 308 0 20 15 14 81 -30z'
  ];
  bodyMax = 30000000;

  constructor(private svc:DashboardService){

  }

  ngOnInit(): void {
    this.svc.countEntity(EntityType.C).subscribe((data) =>{ this.totalCustomer = data; });
    this.svc.countEntity(EntityType.R).subscribe((data) =>{ this.totalRepresentative = data; });

    const meuBodyMax = this.bodyMax; 

    this.chartLastSell = {
      tooltip: {
        valueFormatter: (value) => formatCurrency(parseFloat(value.toString()),"pt","R$")
      },
      legend: {
        data:['Última Coleção'],
       },
      xAxis: {
        data: ['a'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        max: this.bodyMax,
        offset: 20,
        splitLine: { show: false },
        axisLabel:{ show: false }
      },
      grid: {
        top: 'center',
        height: 230
      },
      markLine: {
        z: -100
      },
      series: [
        {
          name: 'Última Coleção',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: this.bodyMax,
          color:'#e685b5',
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            offset: [0, -20],
            formatter: function (param: any) {
              return ((param.value / meuBodyMax) * 100).toFixed(0) + '%';
            },
            fontSize: 18,
            fontFamily: 'Arial'
          },
          data: [
            {
              value: 25000000,
              symbol: this.symbols[0]
            }
          ],
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
              miterLimit: 0
            },
            data: [
              {
                type: 'max',
                label: {
                  show: false
                }
              }
            ]
          },
          z: 10
        },
        {
          name: 'full',
          type: 'pictorialBar',
          barWidth: '40%',
          symbolBoundingData: this.bodyMax,
          animationDuration: 0,
          tooltip:{
            show: false
          },
          itemStyle: {
            color: '#ccc'
          },
          data: [
            {
              value: 1,
              symbol: this.symbols[0]
            }
          ]
        }
      ]
    }



    //colocar dentro do subscribe
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
        data:['José','Paulo','Vieira','Constantino','Makoto & Makoto']
      },
      series:[{
        name: 'Última Coleção',
        type: 'bar',
        data:[10000, 25000, 15000, 12000, 18000],
        markLine:{
          data:[{ 
            name: 'supermeta', symbol: 'none', xAxis: 30000, 
            label:{
              formatter: (item) => 'Super \n'+formatCurrency(parseFloat(item.value.toString()),"pt","R$")
            },
            lineStyle:{
              color: '#ffc107',
              type: 'dotted',
              join: 'round'
            }
          },{
            name: 'meta', symbol: 'none', xAxis: 25000,
            label:{
              formatter: (item) => 'Meta \n'+ formatCurrency(parseFloat(item.value.toString()),"pt","R$")
            },
            lineStyle:{
              color: '#198754',
              type: 'dotted',
              join: 'round'
            }
          }],
          symbol: 'circle'
        }
      }]
    }
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
