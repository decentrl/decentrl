import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';

@Module({
  imports: [IdentityWalletModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
