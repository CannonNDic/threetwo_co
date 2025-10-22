import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      // check product is exist
      const existingProduct = await this.productModel.findOne({ name: createProductDto.name });
      if (existingProduct) {
        throw new Error('Product already exists');
      }

      const createdProduct = new this.productModel(createProductDto);
      await createdProduct.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product added successfully',
      };

    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async findAll(options?: { name?: string; page?: number; limit?: number; filter?: any, minPrice?: number; maxPrice?: number }) {

    try {
      const page = options?.page && options.page > 0 ? options.page : 1;
      const limit = options?.limit && options.limit > 0 ? options.limit : 10;
      const filter = options?.filter || {};

      // Add name search to filter if provided
      if (options?.name) {
        filter.name = { $regex: options.name, $options: 'i' };
      }
      if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
        filter.price = {};
        if (options.minPrice !== undefined) {
          filter.price.$gte = options.minPrice;
        }
        if (options.maxPrice !== undefined) {
          filter.price.$lte = options.maxPrice;
        }
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.productModel.find(filter).skip(skip).limit(limit).exec(),
        this.productModel.countDocuments(filter).exec(),
      ]);

      return {
        statusCode: HttpStatus.OK,
        data: products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      if (!(id)) {
        throw new Error('Invalid product ID');
      }
      // if id is valid, proceed to update
      if (id && !Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }

      // check updateProductDto is not empty and is it only contains 'id' field
      const updateKeys = Object.keys(updateProductDto);
      if (updateKeys.length === 0 || (updateKeys.length === 1 && updateKeys[0] === 'id')) {
        throw new Error('No valid fields to update');
      }
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateProductDto,
        { new: true }
      ).exec();

      if (!updatedProduct) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async remove(id: string) {
    try {
      if (!(id)) {
        throw new Error('Invalid product ID');
      }
      await this.productModel.findByIdAndDelete({ _id: new Types.ObjectId(id) }).exec();
      return {
        statusCode: HttpStatus.OK,
        message: 'Product removed successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}
