import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public } from '../auth/decorators';
import type { AuthenticatedUser } from '../auth/interfaces';
import { UpsertReviewDto } from './dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get()
  @ApiOkResponse({ description: 'Returns every review for the product.' })
  findAll(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.reviewsService.findAllForProduct(productId);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      "Creates or updates the current user's review for the product (one review per user per product).",
  })
  upsert(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpsertReviewDto,
  ) {
    return this.reviewsService.upsert(
      user.id,
      productId,
      dto.rating,
      dto.comment ?? null,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Deletes the current user's review for the product.",
  })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.reviewsService.remove(user.id, productId);
  }
}
