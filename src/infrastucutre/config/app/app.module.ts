import { Module } from '@nestjs/common';
import { AnimeModule } from 'src/core/anime/anime.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    }),
    AnimeModule,
  ],
})
export class AppModule {}
