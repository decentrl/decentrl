import { IsString } from "class-validator";

export class CreateDidDto {
  @IsString()
  encryptedDidDocument: string;
}

export class UpdateDidDto extends CreateDidDto {}
