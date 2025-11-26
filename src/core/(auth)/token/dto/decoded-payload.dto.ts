import { IsEmail, IsString } from 'class-validator';

export class DecodedPayloadDto {
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;
}
