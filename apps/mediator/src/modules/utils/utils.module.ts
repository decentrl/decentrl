import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [IdentityWalletModule, IdentityModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
