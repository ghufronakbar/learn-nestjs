import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { PrismaModule } from 'src/infrastucutre/prisma/prisma.module';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TokenModule, PrismaModule, BcryptModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule { }
