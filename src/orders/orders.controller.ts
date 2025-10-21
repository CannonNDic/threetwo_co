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

  @UseGuards(AdminGuard)
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
}

