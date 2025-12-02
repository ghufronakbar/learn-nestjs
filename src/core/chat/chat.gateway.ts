import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TokenService } from '../(auth)/token/token.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(private readonly jwtService: TokenService) { }

  // 1. Handle saat User Konek (Mirip AuthGuard tapi buat Socket)
  async handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (!token) {
      this.logger.error('No token provided');
      client.disconnect();
      return;
    }

    try {
      // Verifikasi token manual karena Guard HTTP tidak jalan di sini
      const payload = await this.jwtService.verifyAccessToken(token);

      // Simpan user data di socket object agar bisa dipakai nanti
      client.data.user = payload;

      this.logger.log(`User connected: ${payload.id}`);
    } catch (e) {
      this.logger.error('Invalid token');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // 2. Event saat User masuk ke Room Chat tertentu
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomChatId: string,
  ) {
    // Client bergabung ke "channel" socket spesifik berdasarkan ID Room
    client.join(roomChatId);
    this.logger.log(`User ${client.data.user?.id} joined room ${roomChatId}`);
    return { event: 'joinedRoom', data: roomChatId };
  }

  // 3. Event saat User keluar Room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomChatId: string,
  ) {
    client.leave(roomChatId);
    return { event: 'leftRoom', data: roomChatId };
  }

  // Helper function ambil token dari Header
  private extractToken(client: Socket): string | undefined {
    const [type, token] = client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}