import { Controller, Get } from '@nestjs/common';
import { IdentityWalletService } from './identity-wallet.service';

@Controller('.well-known/did.json')
export class IdentityWalletController {
  constructor(private identityWalletService: IdentityWalletService) {}

  @Get()
  async getDidDocument() {
    return this.identityWalletService.getDidDocument();
  }
}
