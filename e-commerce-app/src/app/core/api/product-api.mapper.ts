import { CurrencyCode } from '../../models/money.model';
import { Product } from '../../models';
import { ProductApiModel } from './product-api.model';

export function mapProductApiModelToProduct(apiModel: ProductApiModel): Product {
  return {
    id: apiModel.id,
    slug: apiModel.slug,
    name: apiModel.name,
    description: apiModel.description,
    price: {
      amount: apiModel.price_amount,
      currency: apiModel.price_currency as CurrencyCode,
    },
    compareAtPrice:
      apiModel.compare_at_price_amount != null
        ? { amount: apiModel.compare_at_price_amount, currency: apiModel.price_currency as CurrencyCode }
        : undefined,
    categoryId: apiModel.category_id,
    images: apiModel.images,
    rating:
      apiModel.rating_average != null && apiModel.rating_count != null
        ? { average: apiModel.rating_average, count: apiModel.rating_count }
        : undefined,
    inventory: {
      inStock: apiModel.in_stock,
      quantity: apiModel.quantity ?? undefined,
    },
    tags: apiModel.tags ?? undefined,
    isFeatured: apiModel.is_featured,
    isNew: apiModel.is_new,
    createdAt: apiModel.created_at,
  };
}
