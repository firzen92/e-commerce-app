import { ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedUser } from '../auth/interfaces';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let reviewsService: jest.Mocked<
    Pick<ReviewsService, 'findAllForProduct' | 'upsert' | 'remove'>
  >;

  const user: AuthenticatedUser = {
    id: 'user-1',
    email: 'shopper@example.com',
    role: 'authenticated',
  };

  beforeEach(async () => {
    reviewsService = {
      findAllForProduct: jest.fn(),
      upsert: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: reviewsService }],
    }).compile();

    controller = module.get(ReviewsController);
  });

  it('returns every review for the product', async () => {
    reviewsService.findAllForProduct.mockResolvedValue([]);

    await controller.findAll('product-1');

    expect(reviewsService.findAllForProduct).toHaveBeenCalledWith('product-1');
  });

  it('creates or updates the current user review for the product', async () => {
    await controller.upsert(user, 'product-1', {
      rating: 4,
      comment: 'Solid.',
    });

    expect(reviewsService.upsert).toHaveBeenCalledWith(
      'user-1',
      'product-1',
      4,
      'Solid.',
    );
  });

  it('defaults the comment to null when omitted', async () => {
    await controller.upsert(user, 'product-1', { rating: 4 });

    expect(reviewsService.upsert).toHaveBeenCalledWith(
      'user-1',
      'product-1',
      4,
      null,
    );
  });

  it('removes the current user review for the product', async () => {
    await controller.remove(user, 'product-1');

    expect(reviewsService.remove).toHaveBeenCalledWith('user-1', 'product-1');
  });

  it('rejects a malformed product id before it reaches the database', async () => {
    const pipe = new ParseUUIDPipe();

    await expect(
      pipe.transform('not-a-uuid', { type: 'param', data: 'productId' }),
    ).rejects.toThrow();
    await expect(
      pipe.transform('3f6c1c9e-7a1b-4c8e-9d2a-5b6f7e8a9b0c', {
        type: 'param',
        data: 'productId',
      }),
    ).resolves.toBe('3f6c1c9e-7a1b-4c8e-9d2a-5b6f7e8a9b0c');
  });
});
