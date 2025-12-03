import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ENV } from 'src/constants/env';

import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('PrismaService onModuleInit');
    await this.$connect()
      .then(() => {
        console.log('PrismaService connected');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  constructor() {
    const pool = new Pool({ connectionString: ENV.databaseUrl });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
}
