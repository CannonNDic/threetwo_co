import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';


@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class Product extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description?: string;

  @Prop()
  createdBy?: Types.ObjectId;

  @Prop()
  stockQuantity?: number;

  @Prop()
  categoryId?: number;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
