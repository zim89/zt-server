import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/modules/auth';
import { ProjectModule } from '@/modules/project';
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
  ],
})
export class AppModule {}
