import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ProductSalesPoint } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-sales-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './product-sales-chart.component.html',
  styleUrls: ['./product-sales-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSalesChartComponent implements OnChanges {
  @Input() series: ProductSalesPoint[] = [];

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'var(--text-primary)' },
        grid: { color: 'rgba(255,255,255,0.08)' }
      },
      x: {
        ticks: { color: 'var(--text-primary)' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']) {
      this.chartData = {
        labels: this.series.map((point) => point.month),
        datasets: [
          {
            data: this.series.map((point) => point.value),
            label: 'Monthly Sales',
            fill: true,
            tension: 0.4,
            borderColor: '#5c6ac4',
            backgroundColor: 'rgba(92,106,196,0.2)',
            pointRadius: 5,
            pointBackgroundColor: '#5c6ac4'
          }
        ]
      };
    }
  }
}

