import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}
  async create(createInvoiceDto: CreateInvoiceDto) {
    return await this.prisma.invoice.create({
      data: {
        fileName: createInvoiceDto.fileName,
        filePath: createInvoiceDto.filePath,
      },
    });
  }

  findAll() {
    return `This action returns all invoices`;
  }

  findOne(id: string) {
    return `This action returns a #${id} invoice`;
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: string) {
    return `This action removes a #${id} invoice`;
  }
}
