import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/infrastucutre/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { TokenService } from '../(auth)/token/token.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, ChatGateway, TokenService],
})
export class ChatModule { }
