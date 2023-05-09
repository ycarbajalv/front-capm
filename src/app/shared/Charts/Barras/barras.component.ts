import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-barras',
  templateUrl: './barras.component.html',
  styleUrls: ['./barras.component.scss']
})
export class BarrasComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  constructor() { }

  @Input() ResultadoTarea1=0;
  @Input() ResultadoTarea2=0;
  @Input() ResultadoTarea3=0;
  @Input() ResultadoTarea4=0;

  public barChartOptions: ChartConfiguration['options'] = {};
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DatalabelsPlugin];
  public barChartData: ChartData<'bar'> = {
    labels: [ 'H1', 'H2', 'H3', 'H4'],
    datasets: [
      { data: [ 0, 0, 0, 0],
        label: 'Puntaje',
        backgroundColor: '#00C356',
        hoverBackgroundColor:[
          '#00C356',
        ],
        hoverBorderColor:[
          '#00C356',
        ],
        borderColor:[
          '#00C356',
        ]
      }
    ]
  };
  ngOnChanges(changes: SimpleChanges): void {
    if(this.ResultadoTarea1!=0 ||
      this.ResultadoTarea2!=0 ||
      this.ResultadoTarea3!=0 ||
      this.ResultadoTarea4!=0 ){
      this.ValoresChart()
    }
    if(this.ResultadoTarea1==0 &&
      this.ResultadoTarea2==0 &&
      this.ResultadoTarea3==0 &&
      this.ResultadoTarea4==0){
      this.ValoresChartInicio()
    }
  }
  ngOnInit(): void {

  }
  ValoresChart(){
    //Opciones
    this.barChartOptions={
      responsive: true,
      scales: {
        x: {},
        y: {
          min: 0
        }
      },
      plugins: {
        legend: {
          display: true,
        },

      }
    }
    //Datos
    this.barChartData={
      labels: [ '0A1', '0A2', '0A3', '0A4'],
      datasets: [
        { data: [ this.ResultadoTarea1,
          this.ResultadoTarea2,
          this.ResultadoTarea3,
          this.ResultadoTarea4],
          label: 'Puntaje (%)',
          backgroundColor: '#00C356',
          hoverBackgroundColor:[
            '#00C356',
          ],
          hoverBorderColor:[
            '#00C356',
          ],
          borderColor:[
            '#00C356',
          ]}
      ]
    }
  }

  ValoresChartInicio(){
    //Opciones
    this.barChartOptions={
      responsive: true,
      scales: {
        x: {},
        y: {
          min: 0
        }
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'end'
        }
      }
    }
    //Datos
    this.barChartData={
      labels: [ '0A', '0A', 'OA', 'OA'],
      datasets: [
        { data: [ 0, 0, 0, 0],
          label: 'Puntaje',
          backgroundColor: '#00C356',
          hoverBackgroundColor:[
            '#00C356',
          ],
          hoverBorderColor:[
            '#00C356',
          ],
          borderColor:[
            '#00C356',
          ]}
      ]
    }
  }

}
