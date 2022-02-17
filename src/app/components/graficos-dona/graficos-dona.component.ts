import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-graficos-dona',
  templateUrl: './graficos-dona.component.html',
  styles: [],
})
export class GraficosDonaComponent implements OnInit {
  @Input() chartLabels: string[] = [];

  @Input() data: number[] = [];

  chartData!: ChartData<'doughnut'>;

  chartType: ChartType = 'doughnut';

  constructor() {}

  ngOnInit(): void {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [{ data: this.data }],
    };
  }
}
