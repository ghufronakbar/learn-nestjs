import { ArrayUnique, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class InviteUserToRoomChatDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayUnique()
  users: string[];
}
