import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma';

import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';

@Module({
  imports: [PrismaModule],
  controllers: [MarkerController],
  providers: [MarkerService],
  exports: [MarkerService],
})
export class MarkerModule {}
