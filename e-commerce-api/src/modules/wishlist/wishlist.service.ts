import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products';
import { WISHLIST_REPOSITORY } from './interfaces';
import type { WishlistItem, WishlistRepository } from './interfaces';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepository: WishlistRepository,
    private readonly productsService: ProductsService,
  ) {}

  async findAllForUser(userId: string): Promise<WishlistItem[]> {
    const entries = await this.wishlistRepository.findAllForUser(userId);
    if (entries.length === 0) {
      return [];
    }

    const products = await this.productsService.findByIds(
      entries.map((entry) => entry.productId),
    );
    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    return entries
      .map((entry) => {
        const product = productById.get(entry.productId);
        return product ? { product, addedAt: entry.createdAt } : null;
      })
      .filter((item): item is WishlistItem => item !== null);
  }

  async add(userId: string, productId: string): Promise<void> {
    const product = await this.productsService.findByIds([productId]);
    if (product.length === 0) {
      throw new NotFoundException('Product not found.');
    }

    await this.wishlistRepository.add(userId, productId);
  }

  remove(userId: string, productId: string): Promise<void> {
    return this.wishlistRepository.remove(userId, productId);
  }
}
