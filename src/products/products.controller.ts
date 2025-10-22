import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Types } from 'mongoose';
import { AdminGuard } from 'src/guards/admin.guards';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(AdminGuard)
  @Post('create')
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    const user = req.user; // comes from JWT
    return this.productsService.create({
      ...createProductDto,
      createdBy: new Types.ObjectId(String(user.userId)),
    });
  }

  @Get('list')
  async findAll(
    @Req() req,
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
    @Query('stockQuantity') stockQuantity?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    const user = req.user;
    // Build filter object
    const filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (stockQuantity !== undefined) filter.stockQuantity = stockQuantity;

    return this.productsService.findAll({
      name,
      page,
      limit,
      filter,
      minPrice,
      maxPrice
    });
  }

  @UseGuards(AdminGuard)
  @Post('delete')
  async remove(@Body('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(AdminGuard)
  @Post('update')
  async update(@Body('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
}
