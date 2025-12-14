import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai.service';
import { OcrService } from './ocr.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, AiService, OcrService],
})
export class InvoicesModule {}
