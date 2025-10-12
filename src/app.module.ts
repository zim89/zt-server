import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/modules/auth';
import { CategoryModule } from '@/modules/category';
import { MarkerModule } from '@/modules/marker';
import { ProjectModule } from '@/modules/project';
import { StatisticModule } from '@/modules/statistic';
import { TaskModule } from '@/modules/task';
import { PrismaModule } from '@/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProjectModule,
    TaskModule,
    CategoryModule,
    MarkerModule,
    StatisticModule,
  ],
})
export class AppModule {}
