import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { parseDto } from 'src/common/utils/parse-dto';
import { ENV } from 'src/constants/env';
import { DecodedPayloadDto } from './dto/decoded-payload.dto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) { }

  generateAccessToken(payload: object) {
    if (!ENV.auth.jwtSecret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined',
      );
    }
    return this.jwtService.sign(payload, {
      expiresIn: ENV.auth
        .jwtAccessTokenExpiresIn as JwtSignOptions['expiresIn'],
    });
  }

  generateRefreshToken(payload: object) {
    if (!ENV.auth.jwtSecret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined',
      );
    }
    return this.jwtService.sign(payload, {
      expiresIn: ENV.auth
        .jwtRefreshTokenExpiresIn as JwtSignOptions['expiresIn'],
    });
  }

  async verifyAccessToken(token: string) {
    try {
      if (!ENV.auth.jwtSecret) {
        throw new InternalServerErrorException(
          'JWT_SECRET is not defined',
        );
      }
      const decodedPayload = this.jwtService.verify(token, {
        secret: ENV.auth.jwtSecret,
      });
      return await parseDto(DecodedPayloadDto, decodedPayload);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      if (!ENV.auth.jwtSecret) {
        throw new InternalServerErrorException(
          'JWT_SECRET is not defined',
        );
      }
      const decodedPayload = this.jwtService.verify(token, {
        secret: ENV.auth.jwtSecret,
      });
      return await parseDto(DecodedPayloadDto, decodedPayload);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
