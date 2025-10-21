import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class User extends Document {

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' }) // default role if not provided
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
