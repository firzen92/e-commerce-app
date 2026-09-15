import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedUser } from '../auth/interfaces';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: jest.Mocked<
    Pick<OrdersService, 'findAllForUser' | 'findByIdForUser' | 'createOrder'>
  >;

  const user: AuthenticatedUser = {
    id: 'user-1',
    email: 'shopper@example.com',
    role: 'authenticated',
  };

  beforeEach(async () => {
    ordersService = {
      findAllForUser: jest.fn(),
      findByIdForUser: jest.fn(),
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    controller = module.get(OrdersController);
  });

  it('returns the current user orders, scoped by their id', async () => {
    const query = { page: 1, limit: 20 };
    ordersService.findAllForUser.mockResolvedValue({
      data: [],
      page: 1,
      limit: 20,
      total: 0,
    });

    await controller.findAll(user, query);

    expect(ordersService.findAllForUser).toHaveBeenCalledWith('user-1', query);
  });

  it('returns a single order belonging to the current user', async () => {
    ordersService.findByIdForUser.mockResolvedValue(null);

    await controller.findOne(user, 'order-1');

    expect(ordersService.findByIdForUser).toHaveBeenCalledWith(
      'order-1',
      'user-1',
    );
  });

  it('creates an order for the current user', async () => {
    const dto = { items: [{ productId: 'product-1', quantity: 1 }] };

    await controller.create(user, dto);

    expect(ordersService.createOrder).toHaveBeenCalledWith('user-1', dto);
  });
});
