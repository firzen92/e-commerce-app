import { Category } from '../../models';
import { CategoryApiModel } from './category-api.model';

export function mapCategoryApiModelToCategory(apiModel: CategoryApiModel): Category {
  return {
    id: apiModel.id,
    slug: apiModel.slug,
    name: apiModel.name,
    description: apiModel.description ?? undefined,
    imageUrl: apiModel.image_url,
  };
}
