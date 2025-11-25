export interface ProductApiResponse {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductDto {
  id: number;
  availabilityStatus: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews: ReviewDto[];
}

export interface ReviewDto {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export type SortField = 'title' | 'price' | 'rating';
export type SortDirection = 'asc' | 'desc';

export interface ProductQueryState {
  search: string;
  category: string;
  pageIndex: number;
  pageSize: number;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface PaginatedProducts {
  items: ProductModel[];
  total: number;
  query: ProductQueryState;
}

export interface ProductSalesPoint {
  month: string;
  value: number;
}

export interface ProductDetailViewModel {
  product: ProductModel;
  sales: ProductSalesPoint[];
  totalRevenue: number;
  averageRevenue: number;
}

export interface ProductListViewModel extends PaginatedProducts {
  loading: boolean;
  error?: string | null;
}

export const DEFAULT_QUERY_STATE: ProductQueryState = {
  search: '',
  category: 'all',
  pageIndex: 0,
  pageSize: 10,
  sortField: 'title',
  sortDirection: 'asc',
};

export class ProductModel {
  constructor(private readonly dto: ProductDto) {}

  get id(): number {
    return this.dto.id;
  }

  get availabilityStatus(): string {
    return this.dto.availabilityStatus;
  }

  get name(): string {
    return this.dto.title;
  }

  get category(): string {
    return this.dto.category;
  }

  get price(): number {
    return this.dto.price;
  }

  get description(): string {
    return this.dto.description;
  }

  get thumbnail(): string {
    return this.dto.thumbnail;
  }

  get rating(): number {
    return this.dto.rating;
  }

  get stock(): number {
    return this.dto.stock;
  }

  get brand(): string {
    return this.dto.brand;
  }

  get images(): string[] {
    return this.dto.images;
  }

  get discountPercentage(): number {
    return this.dto.discountPercentage;
  }

  get reviews(): ReviewDto[] {
    return this.dto.reviews;
  }

  toDto(): ProductDto {
    return this.dto;
  }
}
