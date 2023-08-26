import { Module } from '@nestjs/common';
import { EventLogModule } from '../event-log/event-log.module';
import { OneWayPublicService } from './one-way-public.service';

@Module({
  imports: [EventLogModule],
  providers: [OneWayPublicService],
  exports: [OneWayPublicService]
})
export class OneWayPublicModule {}
