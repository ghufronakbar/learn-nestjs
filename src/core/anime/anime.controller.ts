import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { QueryParams } from 'src/common/decorators/query-params.decorator';
import { FilterParams } from 'src/common/interfaces/filter.interface';
import { AuthGuard } from '../(auth)/auth/auth.guard';

@Controller('anime')
@UseGuards(AuthGuard)
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  @ResponseMessage('Anime created successfully')
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Get()
  @ResponseMessage('List of all anime fetched successfully')
  findAll(@QueryParams(['title']) queryParams: FilterParams) {
    return this.animeService.findAll(queryParams);
  }

  @Get(':id')
  @ResponseMessage('Anime fetched successfully')
  findOne(@Param('id') id: string) {
    return this.animeService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Anime updated successfully')
  update(@Param('id') id: string, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete(':id')
  @ResponseMessage('Anime deleted successfully')
  remove(@Param('id') id: string) {
    return this.animeService.remove(id);
  }
}
