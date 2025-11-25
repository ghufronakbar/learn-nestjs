import { Genre } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateAnimeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  synopsis: string;

  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];
}
