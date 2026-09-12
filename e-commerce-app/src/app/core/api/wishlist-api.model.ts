import { ProductApiModel } from './product-api.model';

export interface WishlistItemApiModel {
  product: ProductApiModel;
  addedAt: string;
}
