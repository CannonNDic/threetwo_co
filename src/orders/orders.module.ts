import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { CartService } from 'src/cart/cart.service';
import { Order } from './entities/order.entity';
import { OrderSchema } from './schema/orders.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartSchema } from 'src/cart/schema/cart.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';


@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema }
  ]), MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrdersModule { }
