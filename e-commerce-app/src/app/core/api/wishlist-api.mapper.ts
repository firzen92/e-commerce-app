import { WishlistItem } from '../../models';
import { mapProductApiModelToProduct } from './product-api.mapper';
import { WishlistItemApiModel } from './wishlist-api.model';

export function mapWishlistItemApiModelToWishlistItem(apiModel: WishlistItemApiModel): WishlistItem {
  return {
    product: mapProductApiModelToProduct(apiModel.product),
    addedAt: apiModel.addedAt
  };
}
