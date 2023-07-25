import { Module } from '@nestjs/common';
import { IdentityWalletController } from './identity-wallet.controller';
import { IdentityWalletService } from './identity-wallet.service';

@Module({
  controllers: [IdentityWalletController],
  providers: [IdentityWalletService],
  exports: [IdentityWalletService],
})
export class IdentityWalletModule {}
