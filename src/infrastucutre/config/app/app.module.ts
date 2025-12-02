import { Module } from '@nestjs/common';
import { AnimeModule } from 'src/core/anime/anime.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/core/(auth)/auth/auth.module';
import { UserModule } from 'src/core/user/user.module';
import { ChatModule } from 'src/core/chat/chat.module';
import { TokenModule } from 'src/core/(auth)/token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    }),
    AnimeModule,
    AuthModule,
    UserModule,
    ChatModule,
  ],
})
export class AppModule { }
