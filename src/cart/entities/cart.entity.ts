import { Types } from 'mongoose';

export class CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export class Cart {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: CartItem[];
}