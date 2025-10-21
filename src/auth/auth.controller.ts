import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // login route
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
   return this.authService.mainLoginUser(body.username, body.password);
  }

  // logout route not add because client token delete is sufficient
}
