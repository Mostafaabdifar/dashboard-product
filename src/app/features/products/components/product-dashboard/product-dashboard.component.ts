import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ProductListViewModel,
  ProductModel,
  ProductQueryState,
  SortField,
} from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { PageEvent } from '@angular/material/paginator';
import { SharedModule } from '../../../../shared/shared.module';

const DEFAULT_FORM_VALUE: Pick<
  ProductQueryState,
  'search' | 'category' | 'sortField' | 'sortDirection'
> = {
  search: '',
  category: 'all',
  sortField: 'title',
  sortDirection: 'asc',
};

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDashboardComponent implements OnInit {
  readonly vm$: Observable<ProductListViewModel>;
  readonly categories$: Observable<string[]>;
  readonly displayedColumns = [
    'title',
    'category',
    'price',
    'rating',
    'stock',
    'actions',
  ];
  readonly filtersForm: FormGroup;

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {
    this.filtersForm = this.fb.group(DEFAULT_FORM_VALUE);
    this.vm$ = this.productService.listViewModel$;
    this.categories$ = this.productService.categories$;
    this.filtersForm.patchValue(this.productService.querySnapshot, {
      emitEvent: false,
    });
  }

  ngOnInit(): void {
    this.filtersForm.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe((formValue) => {
        const nextFilters: Partial<ProductQueryState> = {
          search: formValue.search ?? '',
          category: formValue.category ?? 'all',
          sortField: formValue.sortField ?? 'title',
          sortDirection: formValue.sortDirection ?? 'asc',
        };
        this.productService.updateFilters(nextFilters);
      });
  }

  private syncSort(field: SortField): void {
    this.productService.toggleSort(field);

    this.filtersForm.patchValue(
      {
        sortField: this.productService.querySnapshot.sortField,
        sortDirection: this.productService.querySnapshot.sortDirection,
      },
      { emitEvent: false }
    );
  }

  onPageChange(event: PageEvent): void {
    this.productService.updatePagination(event.pageIndex, event.pageSize);
  }

  onSort(field: SortField): void {
    this.syncSort(field);
  }

  onToggleSortDirection(): void {
    const field = this.productService.querySnapshot.sortField as SortField;
    this.syncSort(field);
  }

  resetFilters(): void {
    this.filtersForm.reset(DEFAULT_FORM_VALUE);
  }

  trackByProductId(_index: number, item: ProductModel): number {
    return item.id;
  }
}
