import { Module } from '@nestjs/common';
import { AnimeModule } from 'src/core/anime/anime.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/core/(auth)/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    }),
    AnimeModule,
    AuthModule,
  ],
})
export class AppModule {}
