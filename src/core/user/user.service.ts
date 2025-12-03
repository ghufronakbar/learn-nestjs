import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilterParams } from 'src/common/interfaces/filter.interface';
import { PrismaService } from 'src/infrastucutre/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  private generateWhereClause(queryParams?: Partial<FilterParams>) {
    const whereClause: Prisma.UserWhereInput = {};
    if (queryParams?.search) {
      whereClause.OR = [
        { name: { contains: queryParams.search } },
        { email: { contains: queryParams.search } },
      ];
    }
    return whereClause;
  }

  async getAllUser(queryParams?: Partial<FilterParams>) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: queryParams?.skip,
        take: queryParams?.limit,
        orderBy: queryParams?.sortBy
          ? {
            [queryParams?.sortBy]: queryParams?.sort,
          }
          : undefined,
        where: this.generateWhereClause(queryParams),
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      }),
      this.prisma.user.count({
        where: this.generateWhereClause(queryParams),
      }),
    ]);
    return {
      data: users,
      total,
      params: queryParams,
    };
  }
}
