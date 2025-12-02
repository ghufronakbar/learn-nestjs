# API DOCS

## REST API
```
https://documenter.getpostman.com/view/18970943/2sB3dK1CjA
```

## WebSocket (Socket.IO)

### Connection

- **URL**: `http://<host>:<port>` (e.g., `http://localhost:8989`)
- **Authentication**: JWT Token required in Handshake Headers.
  - **Key**: `Authorization`
  - **Value**: `Bearer <your_access_token>`

### Client Events (Emit from Client)

#### 1. Join Room
Used to join a specific chat room channel.

- **Event Name**: `joinRoom`
- **Payload**: `roomChatId` (string) - The UUID of the chat room.
- **Ack/Response**:
  ```json
  {
    "event": "joinedRoom",
    "data": "room-id-uuid"
  }
  ```

#### 2. Leave Room
Used to leave a specific chat room channel.

- **Event Name**: `leaveRoom`
- **Payload**: `roomChatId` (string)
- **Ack/Response**:
  ```json
  {
    "event": "leftRoom",
    "data": "room-id-uuid"
  }
  ```

### Server Events (Listen on Client)

#### 1. New Message
Triggered when a new message is successfully sent via the HTTP API (`POST /chat/message`).

- **Event Name**: `newMessage`
- **Data Structure**:
  ```json
  {
    "id": "message-uuid",
    "content": "Message content",
    "type": "TEXT" || "IMAGE",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "roomChatId": "room-uuid",
    "user": {
      "id": "user-uuid",
      "name": "User Name",
      "email": "user@example.com",
      "avatar": "http://..." || null
    }
  }
  ```

### Usage Flow

1.  **Connect**: Client establishes WebSocket connection with valid JWT.
2.  **Join**: Client emits `joinRoom` with the target `roomChatId`.
3.  **Send Message**: Client sends a message via REST API endpoint `POST /chat/message`.
4.  **Receive Update**: Server saves the message and emits `newMessage` event via WebSocket to connected clients.
