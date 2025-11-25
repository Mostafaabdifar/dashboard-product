import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import {
  DEFAULT_QUERY_STATE,
  PaginatedProducts,
  ProductDetailViewModel,
  ProductModel,
  ProductQueryState,
  ProductSalesPoint,
  SortDirection,
  SortField
} from '../models/product.model';

const API_BASE_URL = 'https://dummyjson.com';
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  constructor(private readonly http: HttpClient) {}

  getProducts(query: ProductQueryState = DEFAULT_QUERY_STATE): Observable<PaginatedProducts> {
    const skip = query.pageIndex * query.pageSize;
    let params = new HttpParams().set('limit', query.pageSize).set('skip', skip);

    const trimmedSearch = query.search.trim();
    const hasSearch = trimmedSearch.length > 0;
    let endpoint = `${API_BASE_URL}/products`;

    if (hasSearch) {
      endpoint = `${API_BASE_URL}/products/search`;
      params = params.set('q', trimmedSearch);
    }

    if (query.category && query.category !== 'all') {
      endpoint = `${API_BASE_URL}/products/category/${encodeURIComponent(query.category)}`;
    }

    return this.http.get<any>(endpoint, { params }).pipe(
      map((response) => {
        const items = (response.products ?? []).map((dto: any) => new ProductModel(dto));
        return {
          items: this.sortItems(items, query.sortField, query.sortDirection),
          total: response.total ?? items.length,
          query
        };
      })
    );
  }

  getProduct(id: number): Observable<ProductModel> {
    return this.http
      .get<any>(`${API_BASE_URL}/products/${id}`)
      .pipe(map((dto) => new ProductModel(dto)));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[] | Array<{ name?: string; slug?: string }>>(`${API_BASE_URL}/products/categories`).pipe(
      map((categories) =>
        (categories as Array<string | { name?: string; slug?: string }>).map((category) => {
          if (typeof category === 'string') {
            return category;
          }
          return category.name ?? category.slug ?? '';
        }).filter((value) => !!value)
      )
    );
  }

  getProductDetailView(id: number): Observable<ProductDetailViewModel> {
    return this.getProduct(id).pipe(
      map((product) => ({
        product,
        sales: this.buildSalesSeries(product.id),
        totalRevenue: this.estimateTotalRevenue(product),
        averageRevenue: this.estimateAverageRevenue(product)
      }))
    );
  }

  private buildSalesSeries(productId: number): ProductSalesPoint[] {
    const seed = productId * 31;
    return MONTH_LABELS.map((month, index) => {
      const noise = ((seed + index * 7) % 13) * 12;
      return {
        month,
        value: Math.round(400 + index * 35 + noise)
      };
    });
  }

  private estimateTotalRevenue(product: ProductModel): number {
    return this.buildSalesSeries(product.id).reduce((sum, point) => sum + point.value, 0) * product.price;
  }

  private estimateAverageRevenue(product: ProductModel): number {
    return this.estimateTotalRevenue(product) / MONTH_LABELS.length;
  }

  private sortItems(items: ProductModel[], field: SortField, direction: SortDirection): ProductModel[] {
    return [...items].sort((a, b) => {
      const left = this.resolveSortValue(a, field);
      const right = this.resolveSortValue(b, field);
      const compare =
        typeof left === 'string' && typeof right === 'string'
          ? left.localeCompare(right)
          : Number(left) - Number(right);
      return direction === 'asc' ? compare : -compare;
    });
  }

  private resolveSortValue(product: ProductModel, field: SortField): string | number {
    switch (field) {
      case 'price':
        return product.price;
      case 'rating':
        return product.rating;
      default:
        return product.name;
    }
  }
}

