import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Module({
  imports: [],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
