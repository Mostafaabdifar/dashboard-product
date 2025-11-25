import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailViewModel } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import {
  Observable,
  catchError,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap
} from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { ProductSalesChartComponent } from '../product-sales-chart/product-sales-chart.component';

interface DetailViewState {
  data?: ProductDetailViewModel;
  loading: boolean;
  error?: string | null;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule, ProductSalesChartComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  readonly vm$: Observable<DetailViewState>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService
  ) {
    this.vm$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      filter((id) => !Number.isNaN(id)),
      switchMap((id) =>
        this.productService.getProductDetail(id).pipe(
          map((data) => ({ data, loading: false, error: null })),
          startWith({ loading: true } as DetailViewState),
          catchError((error) =>
            of({ loading: false, error: error?.message ?? 'Failed to load product.' })
          )
        )
      ),
      shareReplay(1)
    );
  }

  navigateBack(): void {
    this.router.navigate(['/products']);
  }
}

