import { IsNotEmpty, IsString } from 'class-validator';
export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;
}
