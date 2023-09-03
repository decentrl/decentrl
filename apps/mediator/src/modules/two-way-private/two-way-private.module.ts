import { Module } from '@nestjs/common';
import { EventLogModule } from '../event-log/event-log.module';
import { TwoWayPrivateService } from './two-way-private.service';
import { CommunicationContractModule } from '../communication-contract/communication-contract.module';

@Module({
  imports: [EventLogModule, CommunicationContractModule],
  providers: [TwoWayPrivateService],
  exports: [TwoWayPrivateService],
})
export class TwoWayPrivateModule {}
