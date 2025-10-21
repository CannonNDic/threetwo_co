import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './entities/cart.entity';
import { Model } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).populate('items.productId');
    return cart || { userId, items: [] };
  }

  async addItem(userId: string, productId: string, quantity: number) {
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
  }

  async removeItem(userId: string, productId: string) {
    return this.cartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
  }

  async clearCart(userId: string) {
    return this.cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
}

