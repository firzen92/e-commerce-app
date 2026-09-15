import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto';
import { PaginatedResult } from '../../common/interfaces';
import { ProductsService } from '../products';
import { CreateOrderDto } from './dto';
import { ORDERS_REPOSITORY } from './interfaces';
import type {
  Order,
  OrderLineItem,
  OrdersRepository,
  OrderWithProducts,
} from './interfaces';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
  ) {}

  async findAllForUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<OrderWithProducts>> {
    const result = await this.ordersRepository.findAllForUser(
      userId,
      pagination,
    );

    return { ...result, data: await this.withProducts(result.data) };
  }

  async findByIdForUser(
    id: string,
    userId: string,
  ): Promise<OrderWithProducts | null> {
    const order = await this.ordersRepository.findByIdForUser(id, userId);
    if (!order) {
      return null;
    }

    const [enriched] = await this.withProducts([order]);
    return enriched;
  }

  /** Batches one product lookup across every line item of every order, rather than a lookup per order. */
  private async withProducts(orders: Order[]): Promise<OrderWithProducts[]> {
    if (orders.length === 0) {
      return [];
    }

    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          order.line_items.map((item) => item.product_id),
        ),
      ),
    ];
    const products = await this.productsService.findByIds(productIds);
    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    return orders.map((order) => ({
      ...order,
      line_items: order.line_items.map((item) => ({
        ...item,
        product: productById.get(item.product_id) ?? null,
      })),
    }));
  }

  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    // Merge duplicate lines for the same product so a client can't inflate the order by
    // repeating a product id across multiple entries.
    const quantityByProductId = new Map<string, number>();
    for (const item of dto.items) {
      quantityByProductId.set(
        item.productId,
        (quantityByProductId.get(item.productId) ?? 0) + item.quantity,
      );
    }

    const products = await this.productsService.findByIds([
      ...quantityByProductId.keys(),
    ]);
    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    // Prices and stock always come from the current product record, never the client, so a
    // tampered request body can't buy at an arbitrary price or oversell inventory.
    const lineItems: OrderLineItem[] = [...quantityByProductId.entries()].map(
      ([productId, quantity]) => {
        const product = productById.get(productId);
        if (!product) {
          throw new NotFoundException(`Product ${productId} not found.`);
        }

        if (
          !product.in_stock ||
          (product.quantity != null && product.quantity < quantity)
        ) {
          throw new UnprocessableEntityException(
            `${product.name} does not have enough stock available.`,
          );
        }

        return {
          product_id: product.id,
          quantity,
          unit_price_amount: product.price_amount,
          unit_price_currency: product.price_currency,
        };
      },
    );

    const totalCurrency = lineItems[0].unit_price_currency;
    if (lineItems.some((item) => item.unit_price_currency !== totalCurrency)) {
      throw new UnprocessableEntityException(
        'Cannot combine multiple currencies in a single order.',
      );
    }

    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.unit_price_amount * item.quantity,
      0,
    );

    return this.ordersRepository.create(userId, {
      lineItems,
      totalAmount,
      totalCurrency,
    });
  }
}
