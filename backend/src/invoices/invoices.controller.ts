import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoicesService } from './invoices.service';
import { AiService } from '../ai.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Message } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('invoices')
@UseGuards(AuthGuard('jwt'))
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
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    return this.invoicesService.create(
      {
        fileName: file.filename,
        filePath: file.path,
      },
      req.user.userId,
    );
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.invoicesService.findAll(req.user.userId);
  }

  @Post(':id/chat')
  async chat(
    @Param('id') id: string,
    @Body('question') question: string,
    @Req() req: RequestWithUser,
  ): Promise<{ answer: string }> {
    const invoice = await this.invoicesService.findOne(id, req.user.userId);

    if (!invoice) {
      throw new BadRequestException('Nota fiscal não encontrada');
    }

    await this.invoicesService.saveMessage(id, question, 'user');

    const answer = await this.aiService.ask(
      invoice.extractedText ?? '',
      question,
    );

    await this.invoicesService.saveMessage(id, answer, 'ai');

    return { answer };
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Message[]> {
    const invoice = await this.invoicesService.findOne(id, req.user.userId);

    if (!invoice) {
      throw new BadRequestException('Nota fiscal não encontrada');
    }

    return await this.invoicesService.findMessages(id);
  }
}
