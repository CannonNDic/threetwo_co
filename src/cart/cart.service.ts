import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './entities/cart.entity';
import { Model, Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).populate('items.productId');
    return cart || { userId, items: [] };
  }

  async addItem(userId: string, productId: string, quantity: number) {
    try {

      if (!quantity || quantity <= 0) throw new BadRequestException('Quantity must be greater than zero');
      if (!productId) throw new BadRequestException('Invalid product ID');
      if (!Types.ObjectId.isValid(productId)) throw new BadRequestException('Invalid product ID');
      if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user ID');

      const product = await this.productModel.findById(productId);
      if (!product) throw new NotFoundException('Product not found');
      if (product.stockQuantity < quantity)
        throw new BadRequestException('Not enough stock');

      const cart = await this.cartModel.findOneAndUpdate(
        { userId, 'items.productId': { $ne: productId } },
        { $push: { items: { productId, quantity } } },
        { upsert: true, new: true }
      );

      // If product already exists in cart, increment its quantity
      if (!cart) {
        return await this.cartModel.findOneAndUpdate(
          { userId, 'items.productId': productId },
          { $inc: { 'items.$.quantity': quantity } },
          { new: true }
        );
      }

      return cart;
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async removeItem(userId: string, productId: string) {

    try {
      //find the cart
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException('No items found');
      }
      return this.cartModel.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }


  }

  async clearCart(userId: string) {
    try {
      //find the cart
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      return this.cartModel.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true }
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }

  }
}

