import { Module } from '@nestjs/common';
import { EventLogModule } from '../event-log/event-log.module';
import { RegisterModule } from '../register/register.module';
import { CommunicationContractService } from './communication-contract.service';

@Module({
  imports: [EventLogModule, RegisterModule],
  providers: [CommunicationContractService],
  exports: [CommunicationContractService],
})
export class CommunicationContractModule {}
