import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('cart/')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('my')
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  async addToCart(@Request() req, @Body() body) {
    return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
  }

  @Post('remove/:productId')
  async removeItem(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Post('clear')
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
