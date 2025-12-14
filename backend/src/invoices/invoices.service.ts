import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from './ocr.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const text = await this.ocrService.extractText(createInvoiceDto.filePath);

    return this.prisma.invoice.create({
      data: {
        fileName: createInvoiceDto.fileName,
        filePath: createInvoiceDto.filePath,
        extractedText: text,
        status: 'PROCESSED',
      },
    });
  }

  findAll() {
    return this.prisma.invoice.findMany();
  }

  findOne(id: string) {
    return this.prisma.invoice.findUnique({ where: { id } });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  remove(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }
}
