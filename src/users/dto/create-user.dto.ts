import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly _id?: string;

  @IsString()
  readonly username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly role?: string;
}
