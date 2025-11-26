import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { PrismaService } from 'src/infrastucutre/config/database/prisma/prisma.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(payload: LoginAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatch = await this.bcryptService.comparePassword(
      payload.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({
        id: user.id,
        email: user.email,
      }),
      this.tokenService.generateRefreshToken({
        id: user.id,
        email: user.email,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(payload: RegisterAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.bcryptService.hashPassword(
      payload.password,
    );

    const newUser = await this.prismaService.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
      },
    });

    const accessToken = this.tokenService.generateAccessToken({
      id: newUser.id,
      email: newUser.email,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      id: newUser.id,
      email: newUser.email,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  async refreshToken(payload: RefreshTokenDto) {
    const verifyRefreshToken = await this.tokenService.verifyRefreshToken(
      payload.refreshToken,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        id: verifyRefreshToken.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken: payload.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
