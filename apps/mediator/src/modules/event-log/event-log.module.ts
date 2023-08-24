import { Module } from '@nestjs/common';
import { EventLogService } from './event-log.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventLogService],
  exports: [EventLogService],
})
export class EventLogModule {}
