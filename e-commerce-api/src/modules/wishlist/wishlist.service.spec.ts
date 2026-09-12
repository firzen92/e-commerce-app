import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../products/interfaces';
import { ProductsService } from '../products';
import { WISHLIST_REPOSITORY, WishlistRepository } from './interfaces';
import { WishlistService } from './wishlist.service';

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'product-1',
    slug: 'product-1',
    name: 'Product 1',
    description: 'A product.',
    price_amount: 10,
    price_currency: 'USD',
    compare_at_price_amount: null,
    category_id: 'category-1',
    images: [],
    rating_average: null,
    rating_count: null,
    in_stock: true,
    quantity: null,
    tags: null,
    is_featured: false,
    is_new: false,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('WishlistService', () => {
  let service: WishlistService;
  let wishlistRepository: jest.Mocked<WishlistRepository>;
  let productsService: jest.Mocked<Pick<ProductsService, 'findByIds'>>;

  beforeEach(async () => {
    wishlistRepository = {
      findAllForUser: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
    };
    productsService = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: WISHLIST_REPOSITORY, useValue: wishlistRepository },
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();

    service = module.get(WishlistService);
  });

  describe('findAllForUser', () => {
    it('returns an empty array without querying products when the wishlist is empty', async () => {
      wishlistRepository.findAllForUser.mockResolvedValue([]);

      const result = await service.findAllForUser('user-1');

      expect(result).toEqual([]);
      expect(productsService.findByIds).not.toHaveBeenCalled();
    });

    it('pairs each wishlist entry with its product, preserving order', async () => {
      wishlistRepository.findAllForUser.mockResolvedValue([
        { productId: 'product-2', createdAt: '2026-01-02T00:00:00.000Z' },
        { productId: 'product-1', createdAt: '2026-01-01T00:00:00.000Z' },
      ]);
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1' }),
        buildProduct({ id: 'product-2' }),
      ]);

      const result = await service.findAllForUser('user-1');

      expect(productsService.findByIds).toHaveBeenCalledWith([
        'product-2',
        'product-1',
      ]);
      expect(result.map((item) => item.product.id)).toEqual([
        'product-2',
        'product-1',
      ]);
      expect(result[0].addedAt).toBe('2026-01-02T00:00:00.000Z');
    });

    it('drops entries whose product no longer exists', async () => {
      wishlistRepository.findAllForUser.mockResolvedValue([
        { productId: 'product-1', createdAt: '2026-01-01T00:00:00.000Z' },
        { productId: 'deleted-product', createdAt: '2026-01-01T00:00:00.000Z' },
      ]);
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1' }),
      ]);

      const result = await service.findAllForUser('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].product.id).toBe('product-1');
    });
  });

  describe('add', () => {
    it('throws NotFoundException without writing when the product does not exist', async () => {
      productsService.findByIds.mockResolvedValue([]);

      await expect(service.add('user-1', 'missing-product')).rejects.toThrow(
        NotFoundException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(wishlistRepository.add).not.toHaveBeenCalled();
    });

    it('adds the product when it exists', async () => {
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1' }),
      ]);

      await service.add('user-1', 'product-1');

      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(wishlistRepository.add).toHaveBeenCalledWith(
        'user-1',
        'product-1',
      );
    });
  });

  describe('remove', () => {
    it('delegates to the repository', async () => {
      await service.remove('user-1', 'product-1');

      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(wishlistRepository.remove).toHaveBeenCalledWith(
        'user-1',
        'product-1',
      );
    });
  });
});
