import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../(auth)/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { User } from 'src/common/decorators/user-decorator';
import { DecodedPayloadDto } from '../(auth)/token/dto/decoded-payload.dto';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { SendMessageDto } from './dto/send-message';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('room')
  @ResponseMessage('Success get all room chat')
  async getAllRoomChat(@User() user: DecodedPayloadDto) {
    return this.chatService.getAllRoomChat(user.id);
  }

  @Get('room/:roomChatId')
  @ResponseMessage('Success get detail room chat')
  async getDetailRoomChat(
    @User() user: DecodedPayloadDto,
    @Param('roomChatId') roomChatId: string,
  ) {
    return this.chatService.getDetailRoomChat(roomChatId, user.id);
  }

  @Post('room')
  @ResponseMessage('Success create room chat')
  async createRoomChat(
    @User() user: DecodedPayloadDto,
    @Body() payload: CreateRoomChatDto,
  ) {
    return this.chatService.createRoomChat(payload, user.id);
  }

  @Post('message')
  @ResponseMessage('Success send message')
  async sendMessage(
    @User() user: DecodedPayloadDto,
    @Body() payload: SendMessageDto,
  ) {
    return this.chatService.sendChat(payload, user.id);
  }
}
