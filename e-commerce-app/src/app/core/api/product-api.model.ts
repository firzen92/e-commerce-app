export interface ProductImageApiModel {
  url: string;
  alt: string;
}

export interface ProductApiModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_amount: number;
  price_currency: string;
  compare_at_price_amount: number | null;
  category_id: string;
  images: ProductImageApiModel[];
  rating_average: number | null;
  rating_count: number | null;
  in_stock: boolean;
  quantity: number | null;
  tags: string[] | null;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedApiResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
