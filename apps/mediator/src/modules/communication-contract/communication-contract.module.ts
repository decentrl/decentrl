import { Module } from '@nestjs/common';
import { EventLogModule } from '../event-log/event-log.module';
import { CommunicationContractService } from './communication-contract.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';

@Module({
  imports: [PrismaModule, EventLogModule, IdentityWalletModule],
  providers: [CommunicationContractService],
  exports: [CommunicationContractService],
})
export class CommunicationContractModule {}
