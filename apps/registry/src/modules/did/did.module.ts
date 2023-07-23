import { Module } from '@nestjs/common';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DidService } from './did.service';
import { DidController } from './did.controller';

@Module({
  imports: [IdentityWalletModule, PrismaModule],
  providers: [DidService],
  controllers: [DidController],
})
export class DidModule {}
