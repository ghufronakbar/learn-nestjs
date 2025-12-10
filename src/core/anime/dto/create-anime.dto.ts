import { Genre } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

export class CreateAnimeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  synopsis: string;

  // --- Tambahan field cover ---
  @IsOptional()           // 1. Mengizinkan value null atau undefined (skip validasi jika kosong)
  @IsString()             // 2. Memastikan tipe data string (jika tidak null)
  @IsUrl({}, { message: 'Cover must be a valid URL address' }) // 3. Memastikan format URL valid (http/https)
  cover?: string;         // Gunakan '?' untuk menandakan optional di TypeScript

  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];
}