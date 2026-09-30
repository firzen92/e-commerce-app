import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../products/interfaces';
import { ProductsService } from '../products';
import { REVIEWS_REPOSITORY, Review, ReviewsRepository } from './interfaces';
import { ReviewsService } from './reviews.service';

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

function buildReview(overrides: Partial<Review> = {}): Review {
  return {
    id: 'review-1',
    productId: 'product-1',
    userId: 'user-1',
    rating: 5,
    comment: 'Great product.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewsRepository: jest.Mocked<ReviewsRepository>;
  let productsService: jest.Mocked<Pick<ProductsService, 'findByIds'>>;

  beforeEach(async () => {
    reviewsRepository = {
      findAllForProduct: jest.fn(),
      upsert: jest.fn(),
      remove: jest.fn(),
    };
    productsService = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: REVIEWS_REPOSITORY, useValue: reviewsRepository },
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();

    service = module.get(ReviewsService);
  });

  describe('findAllForProduct', () => {
    it('delegates to the repository', async () => {
      reviewsRepository.findAllForProduct.mockResolvedValue([buildReview()]);

      const result = await service.findAllForProduct('product-1');

      expect(result).toEqual([buildReview()]);
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(reviewsRepository.findAllForProduct).toHaveBeenCalledWith(
        'product-1',
      );
    });
  });

  describe('upsert', () => {
    it('throws NotFoundException without writing when the product does not exist', async () => {
      productsService.findByIds.mockResolvedValue([]);

      await expect(
        service.upsert('user-1', 'missing-product', 5, null),
      ).rejects.toThrow(NotFoundException);
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(reviewsRepository.upsert).not.toHaveBeenCalled();
    });

    it('creates or updates the review when the product exists', async () => {
      productsService.findByIds.mockResolvedValue([buildProduct()]);
      reviewsRepository.upsert.mockResolvedValue(buildReview());

      const result = await service.upsert(
        'user-1',
        'product-1',
        5,
        'Great product.',
      );

      expect(result).toEqual(buildReview());
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(reviewsRepository.upsert).toHaveBeenCalledWith(
        'user-1',
        'product-1',
        5,
        'Great product.',
      );
    });
  });

  describe('remove', () => {
    it('delegates to the repository', async () => {
      await service.remove('user-1', 'product-1');

      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(reviewsRepository.remove).toHaveBeenCalledWith(
        'user-1',
        'product-1',
      );
    });
  });
});
