import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { PrismaService } from 'src/infrastucutre/config/database/prisma/prisma.service';
import { FilterParams } from 'src/common/interfaces/filter.interface';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AnimeService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string) {
    const normalizeTitle = decodeURIComponent(title);
    return normalizeTitle.toLowerCase().replace(/\s+/g, '-');
  }

  async create(createAnimeDto: CreateAnimeDto) {
    const slug = this.generateSlug(createAnimeDto.title);
    const checkAnime = await this.prisma.anime.findUnique({
      where: {
        slug,
      },
    });
    if (checkAnime) {
      throw new ConflictException('Anime already exists');
    }
    return await this.prisma.anime.create({
      data: { ...createAnimeDto, slug },
    });
  }

  private generateWhereClause(queryParams?: Partial<FilterParams>) {
    const whereClause: Prisma.AnimeWhereInput = {};
    if (queryParams?.search) {
      whereClause.title = {
        contains: queryParams.search,
        mode: 'insensitive',
      };
      whereClause.slug = {
        contains: queryParams.search,
        mode: 'insensitive',
      };
    }
    return whereClause;
  }

  private countAll(queryParams?: Partial<FilterParams>) {
    return this.prisma.anime.count({
      where: this.generateWhereClause(queryParams),
    });
  }

  async findAll(queryParams?: Partial<FilterParams>) {
    const [data, total] = await Promise.all([
      this.prisma.anime.findMany({
        skip: queryParams?.skip,
        take: queryParams?.limit,
        orderBy: queryParams?.sortBy
          ? {
              [queryParams?.sortBy]: queryParams?.sort,
            }
          : undefined,
        where: this.generateWhereClause(queryParams),
      }),
      this.countAll(queryParams),
    ]);
    return {
      data,
      total,
      params: queryParams,
    };
  }

  async findOne(id: string) {
    const anime = await this.prisma.anime.findUnique({
      where: {
        id,
      },
    });
    if (!anime) {
      throw new NotFoundException('Anime not found');
    }
    return anime;
  }

  async update(id: string, updateAnimeDto: UpdateAnimeDto) {
    const anime = await this.prisma.anime.findUnique({
      where: {
        id,
      },
    });
    if (!anime) {
      throw new NotFoundException('Anime not found');
    }
    return await this.prisma.anime.update({
      where: {
        id,
      },
      data: updateAnimeDto,
    });
  }

  async remove(id: string) {
    const anime = await this.prisma.anime.findUnique({
      where: {
        id,
      },
    });
    if (!anime) {
      throw new NotFoundException('Anime not found');
    }
    return await this.prisma.anime.delete({
      where: {
        id,
      },
    });
  }
}
