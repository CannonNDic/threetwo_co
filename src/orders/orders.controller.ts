import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { OrderService } from './orders.service';
import { AdminGuard } from 'src/guards/admin.guards';

@UseGuards(AuthGuard('jwt'))
@Controller('orders/')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  async placeOrder(@Request() req) {
    return this.orderService.placeOrder(req.user.userId);
  }

  @Get('my')
  async getUserOrders(@Request() req) {
    return this.orderService.getUserOrders(req.user.userId);
  }

    @Get('history')
  async getOrderHistory(@Request() req) {
    const user = req.user;
    const orders = await this.orderService.findByUser(user.userId);
    return { user: user.username, orders };
  }

  @UseGuards(AdminGuard)
  @Get('all')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
}

