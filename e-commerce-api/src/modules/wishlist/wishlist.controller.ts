import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators';
import type { AuthenticatedUser } from '../auth/interfaces';
import { AddWishlistItemDto } from './dto';
import { WishlistService } from './wishlist.service';

@ApiTags('wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOkResponse({ description: "Returns the current user's wishlist." })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.findAllForUser(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Adds a product to the current user's wishlist.",
  })
  add(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.add(user.id, dto.productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Removes a product from the current user's wishlist.",
  })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.remove(user.id, productId);
  }
}
