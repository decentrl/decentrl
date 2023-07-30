import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
