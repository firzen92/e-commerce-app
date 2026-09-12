import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedUser } from '../auth/interfaces';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

describe('WishlistController', () => {
  let controller: WishlistController;
  let wishlistService: jest.Mocked<
    Pick<WishlistService, 'findAllForUser' | 'add' | 'remove'>
  >;

  const user: AuthenticatedUser = {
    id: 'user-1',
    email: 'shopper@example.com',
    role: 'authenticated',
  };

  beforeEach(async () => {
    wishlistService = {
      findAllForUser: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [{ provide: WishlistService, useValue: wishlistService }],
    }).compile();

    controller = module.get(WishlistController);
  });

  it('returns the current user wishlist, scoped by their id', async () => {
    wishlistService.findAllForUser.mockResolvedValue([]);

    await controller.findAll(user);

    expect(wishlistService.findAllForUser).toHaveBeenCalledWith('user-1');
  });

  it('adds a product to the current user wishlist', async () => {
    await controller.add(user, { productId: 'product-1' });

    expect(wishlistService.add).toHaveBeenCalledWith('user-1', 'product-1');
  });

  it('removes a product from the current user wishlist', async () => {
    await controller.remove(user, 'product-1');

    expect(wishlistService.remove).toHaveBeenCalledWith('user-1', 'product-1');
  });
});
