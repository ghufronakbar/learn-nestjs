import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infrastucutre/config/database/prisma/prisma.service';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { SendMessageDto } from './dto/send-message';
import { FilterParams } from 'src/common/interfaces/filter.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRoomChat(userId: string) {
    const roomChat = await this.prisma.roomChat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const roomChatResponse = roomChat.map((roomChat) => {
      return {
        id: roomChat.id,
        users: roomChat.users,
        createdAt: roomChat.createdAt,
        updatedAt: roomChat.updatedAt,
        lastMessage: roomChat.messages[0] || null,
      };
    });

    return roomChatResponse;
  }

  async getDetailRoomChat(roomChatId: string, userId: string) {
    const roomChat = await this.prisma.roomChat.findUnique({
      where: {
        id: roomChatId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    if (!roomChat) {
      throw new NotFoundException('Room chat not found');
    }
    if (!roomChat.users.some((user) => user.id === userId)) {
      throw new ForbiddenException('User not found in room chat');
    }

    return roomChat;
  }

  async createRoomChat(payload: CreateRoomChatDto, userId: string) {
    const uniqueUsers = new Set(payload.users);
    if (uniqueUsers.size === 0) {
      throw new BadRequestException('Must have at least two members');
    }
    if (!uniqueUsers.has(userId)) {
      uniqueUsers.add(userId);
    }
    const checkUsers = await this.prisma.user.count({
      where: {
        id: {
          in: Array.from(uniqueUsers),
        },
      },
    });

    if (checkUsers !== Array.from(uniqueUsers).length) {
      throw new NotFoundException('One or more users not found');
    }

    const roomChat = await this.prisma.roomChat.create({
      data: {
        users: {
          connect: Array.from(uniqueUsers).map((userId) => ({ id: userId })),
        },
      },
    });

    return roomChat;
  }

  async sendChat(payload: SendMessageDto, userId: string) {
    const [roomChat, user] = await Promise.all([
      this.prisma.roomChat.findUnique({
        where: {
          id: payload.roomChatId,
        },
        select: {
          users: {
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
    ]);

    if (!roomChat) {
      throw new NotFoundException('Room chat not found');
    }
    if (!roomChat.users.some((user) => user.id === userId)) {
      throw new ForbiddenException('User not found in room chat');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const message = await this.prisma.message.create({
      data: {
        roomChat: {
          connect: {
            id: payload.roomChatId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        content: payload.content,
        type: payload.type,
      },
    });

    return message;
  }
}
