import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  productId!: string;

  @ApiProperty({ minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  items!: CreateOrderItemDto[];
}
