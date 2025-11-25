import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  OperatorFunction,
  catchError,
  map,
  of,
  shareReplay,
  startWith,
  switchMap
} from 'rxjs';
import {
  DEFAULT_QUERY_STATE,
  ProductDetailViewModel,
  ProductListViewModel,
  ProductModel,
  ProductQueryState
} from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly querySubject = new BehaviorSubject<ProductQueryState>(DEFAULT_QUERY_STATE);

  readonly query$ = this.querySubject.asObservable();
  readonly categories$: Observable<string[]>;
  readonly listViewModel$: Observable<ProductListViewModel>;

  constructor(private readonly productRepository: ProductRepository) {
    this.categories$ = this.productRepository.getCategories().pipe(shareReplay(1));
    this.listViewModel$ = this.query$.pipe(
      switchMap((query) =>
        this.productRepository.getProducts(query).pipe(
          map((response) => ({
            ...response,
            loading: false,
            error: null
          })),
          catchError((error) =>
            of({
              items: [],
              total: 0,
              query,
              loading: false,
              error: error?.message ?? 'Something went wrong while loading products.'
            })
          ),
          map((viewModel) => ({
            ...viewModel,
            loading: false
          })),
          startWithLoading(query)
        )
      ),
      shareReplay(1)
    );
  }

  setQuery(partial: Partial<ProductQueryState>): void {
    const nextQuery = {
      ...this.querySubject.value,
      ...partial
    };
    this.querySubject.next(nextQuery);
  }

  updateFilters(partial: Partial<ProductQueryState>): void {
    this.setQuery({
      ...partial,
      pageIndex: 0
    });
  }

  updatePagination(pageIndex: number, pageSize: number): void {
    this.setQuery({
      pageIndex,
      pageSize
    });
  }

  toggleSort(field: ProductQueryState['sortField']): void {
    const current = this.querySubject.value;
    const nextDirection =
      current.sortField === field && current.sortDirection === 'asc' ? 'desc' : 'asc';
    this.setQuery({
      sortField: field,
      sortDirection: nextDirection,
      pageIndex: 0
    });
  }

  getProductDetail(id: number): Observable<ProductDetailViewModel> {
    return this.productRepository.getProductDetailView(id);
  }

  get querySnapshot(): ProductQueryState {
    return this.querySubject.value;
  }
}

function startWithLoading(
  query: ProductQueryState
): OperatorFunction<ProductListViewModel, ProductListViewModel> {
  const initialState: ProductListViewModel = {
    items: [] as ProductModel[],
    total: 0,
    query,
    loading: true,
    error: null
  };
  return (source) => source.pipe(startWith(initialState));
}

