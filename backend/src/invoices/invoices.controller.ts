import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoicesService } from './invoices.service';
import { AiService } from '../ai.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    return this.invoicesService.create({
      fileName: file.filename,
      filePath: file.path,
    });
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Post(':id/chat')
  async chat(@Param('id') id: string, @Body('question') question: string) {
    const invoice = await this.invoicesService.findOne(id);

    if (!invoice) {
      throw new BadRequestException('Nota fiscal não encontrada');
    }

    const answer = await this.aiService.ask(
      invoice.extractedText ?? '',
      question,
    );

    return { answer };
  }
}
