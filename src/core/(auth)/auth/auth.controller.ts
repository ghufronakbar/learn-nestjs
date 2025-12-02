import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { User } from 'src/common/decorators/user-decorator';
import { DecodedPayloadDto } from '../token/dto/decoded-payload.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() payload: RegisterAuthDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginAuthDto) {
    return this.authService.login(payload);
  }

  @Post('refresh-token')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshToken(payload);
  }

  @UseGuards(AuthGuard)
  @Get('session')
  async getSession(@User() user: DecodedPayloadDto) {
    return user;
  }
}
