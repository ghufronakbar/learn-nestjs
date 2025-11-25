import { Module } from '@nestjs/common';
import { AnimeModule } from 'src/core/anime/anime.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    }),
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 1 hour
    }),
    AnimeModule,
  ],
})
export class AppModule {}
