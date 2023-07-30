import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';
import { RegisterService } from './register.service';

@Module({
  imports: [PrismaModule, IdentityWalletModule],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
