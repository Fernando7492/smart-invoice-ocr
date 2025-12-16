import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from './ocr.service';
import { Invoice, Message } from '@prisma/client';


@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    userId: string,
  ): Promise<Invoice> {
    const invoice = await this.prisma.invoice.create({
      data: {
        ...createInvoiceDto,
        userId,
      },
    });

    this.ocrService
      .processInvoice(invoice.id, invoice.filePath)
      .then((text) => {
        return this.prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            extractedText: text,
            status: 'PROCESSED',
          },
        });
      })
      .catch(() => {
        return this.prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'ERROR' },
        });
      });

    return invoice;
  }

  async findAll(userId: string): Promise<Invoice[]> {
    return await this.prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Invoice | null> {
    return await this.prisma.invoice.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    userId: string,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, userId);

    if (!invoice) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    return await this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  async remove(id: string, userId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, userId);

    if (!invoice) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    return await this.prisma.invoice.delete({
      where: { id },
    });
  }

  async saveMessage(
    invoiceId: string,
    text: string,
    role: 'user' | 'ai',
  ): Promise<Message> {
    return await this.prisma.message.create({
      data: {
        invoiceId,
        text,
        role,
      },
    });
  }

  async findMessages(invoiceId: string): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: { invoiceId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
