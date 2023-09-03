import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthenticationService } from './authentication.service';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';

@Module({
  imports: [PrismaModule, IdentityWalletModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
