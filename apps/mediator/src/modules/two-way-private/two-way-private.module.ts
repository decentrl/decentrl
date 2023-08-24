import { Module } from '@nestjs/common';
import { EventLogModule } from '../event-log/event-log.module';
import { TwoWayPrivateService } from './two-way-private.service';

@Module({
  imports: [EventLogModule],
  providers: [TwoWayPrivateService],
  exports: [TwoWayPrivateService]
})
export class TwoWayPrivateModule {}
