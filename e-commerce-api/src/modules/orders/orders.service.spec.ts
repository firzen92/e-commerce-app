import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../products/interfaces';
import { ProductsService } from '../products';
import { CreateOrderDto } from './dto';
import { ORDERS_REPOSITORY, Order, OrdersRepository } from './interfaces';
import { OrdersService } from './orders.service';

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

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: jest.Mocked<OrdersRepository>;
  let productsService: jest.Mocked<Pick<ProductsService, 'findByIds'>>;

  beforeEach(async () => {
    ordersRepository = {
      findAllForUser: jest.fn(),
      findByIdForUser: jest.fn(),
      create: jest.fn(),
    };
    productsService = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: ORDERS_REPOSITORY, useValue: ordersRepository },
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  describe('createOrder', () => {
    const dto: CreateOrderDto = {
      items: [
        { productId: 'product-1', quantity: 2 },
        { productId: 'product-1', quantity: 1 },
      ],
    };

    it('merges duplicate product lines and prices from the current product record', async () => {
      productsService.findByIds.mockResolvedValue([
        buildProduct({
          id: 'product-1',
          price_amount: 10,
          price_currency: 'USD',
        }),
      ]);
      ordersRepository.create.mockResolvedValue({
        id: 'order-1',
        user_id: 'user-1',
        status: 'pending',
        line_items: [
          {
            product_id: 'product-1',
            quantity: 3,
            unit_price_amount: 10,
            unit_price_currency: 'USD',
          },
        ],
        total_amount: 30,
        total_currency: 'USD',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      });

      await service.createOrder('user-1', dto);

      expect(productsService.findByIds).toHaveBeenCalledWith(['product-1']);
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(ordersRepository.create).toHaveBeenCalledWith('user-1', {
        lineItems: [
          {
            product_id: 'product-1',
            quantity: 3,
            unit_price_amount: 10,
            unit_price_currency: 'USD',
          },
        ],
        totalAmount: 30,
        totalCurrency: 'USD',
      });
    });

    it('throws NotFoundException without writing when a product no longer exists', async () => {
      productsService.findByIds.mockResolvedValue([]);

      await expect(service.createOrder('user-1', dto)).rejects.toThrow(
        NotFoundException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(ordersRepository.create).not.toHaveBeenCalled();
    });

    it('throws UnprocessableEntityException when the product is out of stock', async () => {
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1', in_stock: false }),
      ]);

      await expect(service.createOrder('user-1', dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(ordersRepository.create).not.toHaveBeenCalled();
    });

    it('throws UnprocessableEntityException when the requested quantity exceeds tracked stock', async () => {
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1', quantity: 2 }),
      ]);

      await expect(service.createOrder('user-1', dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  function buildOrder(overrides: Partial<Order> = {}): Order {
    return {
      id: 'order-1',
      user_id: 'user-1',
      status: 'pending' as const,
      line_items: [
        {
          product_id: 'product-1',
          quantity: 2,
          unit_price_amount: 10,
          unit_price_currency: 'USD',
        },
      ],
      total_amount: 20,
      total_currency: 'USD',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      ...overrides,
    };
  }

  describe('findAllForUser', () => {
    it('enriches each returned order with its current product records', async () => {
      const pagination = { page: 1, limit: 20 };
      ordersRepository.findAllForUser.mockResolvedValue({
        data: [buildOrder()],
        page: 1,
        limit: 20,
        total: 1,
      });
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1' }),
      ]);

      const result = await service.findAllForUser('user-1', pagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(ordersRepository.findAllForUser).toHaveBeenCalledWith(
        'user-1',
        pagination,
      );
      expect(productsService.findByIds).toHaveBeenCalledWith(['product-1']);
      expect(result.data[0].line_items[0].product?.id).toBe('product-1');
    });

    it('sets product to null when a line item references a deleted product', async () => {
      ordersRepository.findAllForUser.mockResolvedValue({
        data: [buildOrder()],
        page: 1,
        limit: 20,
        total: 1,
      });
      productsService.findByIds.mockResolvedValue([]);

      const result = await service.findAllForUser('user-1', {
        page: 1,
        limit: 20,
      });

      expect(result.data[0].line_items[0].product).toBeNull();
    });

    it('does not query products for an empty order list', async () => {
      ordersRepository.findAllForUser.mockResolvedValue({
        data: [],
        page: 1,
        limit: 20,
        total: 0,
      });

      await service.findAllForUser('user-1', { page: 1, limit: 20 });

      expect(productsService.findByIds).not.toHaveBeenCalled();
    });
  });

  describe('findByIdForUser', () => {
    it('returns null without querying products when the order does not exist', async () => {
      ordersRepository.findByIdForUser.mockResolvedValue(null);

      const result = await service.findByIdForUser('order-1', 'user-1');

      expect(result).toBeNull();
      expect(productsService.findByIds).not.toHaveBeenCalled();
    });

    it('enriches the order with its current product records', async () => {
      ordersRepository.findByIdForUser.mockResolvedValue(buildOrder());
      productsService.findByIds.mockResolvedValue([
        buildProduct({ id: 'product-1' }),
      ]);

      const result = await service.findByIdForUser('order-1', 'user-1');

      // eslint-disable-next-line @typescript-eslint/unbound-method -- jest.Mocked mock function reference, not a real bound method
      expect(ordersRepository.findByIdForUser).toHaveBeenCalledWith(
        'order-1',
        'user-1',
      );
      expect(result?.line_items[0].product?.id).toBe('product-1');
    });
  });
});
