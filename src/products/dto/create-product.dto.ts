import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  createdBy?: Types.ObjectId;

  @IsNumber()
  stockQuantity?: number;

  @IsNumber()
  categoryId?: number;
}
