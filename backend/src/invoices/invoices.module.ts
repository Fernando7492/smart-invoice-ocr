import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from './ocr.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, OcrService],
})
export class InvoicesModule {}
