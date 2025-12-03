import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { PrismaService } from 'src/infrastucutre/prisma/prisma.service';

@Module({
  controllers: [AnimeController],
  providers: [AnimeService, PrismaService],
})
export class AnimeModule { }
