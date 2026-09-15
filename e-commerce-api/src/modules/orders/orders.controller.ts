import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators';
import type { AuthenticatedUser } from '../auth/interfaces';
import { CreateOrderDto, OrderQueryDto } from './dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOkResponse({
    description: "Returns a paginated list of the current user's orders.",
  })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: OrderQueryDto,
  ) {
    return this.ordersService.findAllForUser(user.id, query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns a single order belonging to the current user.',
  })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.ordersService.findByIdForUser(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description:
      'Creates an order for the current user from the given product/quantity lines. Prices and stock are taken from the current product records, not the request body.',
  })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }
}
