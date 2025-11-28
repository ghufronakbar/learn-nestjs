import { ArrayUnique, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomChatDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayUnique()
  users: string[];
}
