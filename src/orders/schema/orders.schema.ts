import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product' },
      quantity: { type: Number },
      price: { type: Number },
    },
  ])
  items: { productId: Types.ObjectId; quantity: number; price: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
}

export const OrderSchema = SchemaFactory.createForClass(Order);
