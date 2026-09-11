import { Money } from './money.model';

export interface ProductImage {
  readonly url: string;
  readonly alt: string;
}

export interface ProductRating {
  readonly average: number;
  readonly count: number;
}

export interface ProductInventory {
  readonly inStock: boolean;
  readonly quantity?: number;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly price: Money;
  readonly compareAtPrice?: Money;
  readonly categoryId: string;
  readonly images: readonly ProductImage[];
  readonly rating?: ProductRating;
  readonly inventory: ProductInventory;
  readonly tags?: readonly string[];
  readonly isFeatured?: boolean;
  readonly isNew?: boolean;
  readonly createdAt: string;
}
