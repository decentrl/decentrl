import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateDidDto, UpdateDidDto } from './did.dto';
import { DidService } from './did.service';

@Controller()
export class DidController {
  constructor(private didService: DidService) {}

  @Post()
  async createDid(@Body() body: CreateDidDto) {
    return this.didService.createDid(body.encryptedDidDocument);
  }

  @Put()
  async updateDid(@Body() body: UpdateDidDto) {
    return this.didService.updateDid(body.encryptedDidDocument);
  }

  @Get(':did/did.json')
  async getDidDocumentJson(@Param('did') did: string) {
    return this.didService.getDidDocument(did);
  }

  @Get(':did')
  async getDidDocument(@Param('did') did: string) {
    return this.didService.getDidDocument(did);
  }

  @Get(':did/signature')
  async getDidDocumentSignature(@Param('did') did: string) {
    return this.didService.getDidDocumentSignature(did);
  }
}
