import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // import ConfigModule here
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
const expiresIn = (configService.get<string>('JWT_EXPIRES_IN') || '1h') as SignOptions['expiresIn'];

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in .env file');
        }

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
