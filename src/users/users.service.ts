import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<{ statusCode: number; message: string }> {
    try {
      // Check if username already exists
      const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create new user with hashed password
      await new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      }).save();

      // Return only status and message
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    }
    catch (error) {
      throw error;
    }
  }

  // Find a user by username
  async findByUsername(username: string): Promise<User | null> {
    try {
      if (!username) {
        throw new NotFoundException('Username must be provided');
      }

      return this.userModel.findOne({ username }).exec();
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Get a single user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update a user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  // Remove a user by ID
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
