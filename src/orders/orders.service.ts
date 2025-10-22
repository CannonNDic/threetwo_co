import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async placeOrder(userId: string) {
    // Use lean() for type safety and performance
    const cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId')
      .exec();

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      // item.productId may be populated or just an ObjectId
      const productId = item.productId._id ? item.productId._id : item.productId;
      const product = await this.productModel.findById(productId);

      if (!product || product.stockQuantity < item.quantity) {
        throw new BadRequestException(`Product ${product?.name || productId} is out of stock`);
      }

      product.stockQuantity -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    const order = await this.orderModel.create({
      userId,
      items: orderItems,
      totalPrice,
    });

    // Clear the cart after placing the order
    await this.cartModel.findOneAndUpdate({ userId }, { items: [] });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.orderModel.find({ userId }).populate('items.productId').exec();
  }

  async getAllOrders() {
    return this.orderModel.find().populate('userId').populate('items.productId').exec();
  }

  async findByUser(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('items.productId', 'name price') // show product details
      .sort({ createdAt: -1 })
      .exec();
  }
}