import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ENV } from 'src/constants/env';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: ENV.auth.jwtRefreshTokenSecret,
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
