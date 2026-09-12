import { Product } from './product.model';

export interface WishlistItem {
  readonly product: Product;
  readonly addedAt: string;
}
