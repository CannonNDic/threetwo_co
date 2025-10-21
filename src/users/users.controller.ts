import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // user create
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // user find all
  @Get('findAll')
  findAll() {
    return this.usersService.findAll();
  }


}
