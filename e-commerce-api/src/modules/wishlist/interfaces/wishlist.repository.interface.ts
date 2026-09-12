export const WISHLIST_REPOSITORY = Symbol('WISHLIST_REPOSITORY');

export interface WishlistEntry {
  productId: string;
  createdAt: string;
}

export interface WishlistRepository {
  findAllForUser(userId: string): Promise<WishlistEntry[]>;
  add(userId: string, productId: string): Promise<void>;
  remove(userId: string, productId: string): Promise<void>;
}
