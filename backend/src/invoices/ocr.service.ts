import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class OcrService {
  async extractText(filePath: string): Promise<string> {
    const isPdf = filePath.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return this.processImage(filePath);
    }

    try {
      console.log('[OCR] Tentando extração direta (rápida)...');
      const text = await this.processPdfDirectly(filePath);

      if (text.trim().length > 50) {
        return text;
      }
    } catch (e) {
      console.log('[OCR] Falha na extração direta:' + e);
    }

    console.log('[OCR] Iniciando modo pesado (Rasterização + OCR)...');
    return this.processPdfWithOcr(filePath);
  }

  private async processPdfDirectly(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = (await pdfParse(dataBuffer)) as { text: string };
    return data.text;
  }

  private async processPdfWithOcr(filePath: string): Promise<string> {
    const outputDir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    const outputPathPrefix = path.join(outputDir, baseName);

    try {
      await execAsync(
        `pdftoppm -png -r 300 "${filePath}" "${outputPathPrefix}"`,
      );
    } catch (error) {
      throw new Error(`Erro ao converter PDF com pdftoppm: ${error}`);
    }

    const files = fs
      .readdirSync(outputDir)
      .filter((file) => file.startsWith(baseName) && file.endsWith('.png'))
      .map((file) => path.join(outputDir, file));

    let fullText = '';

    for (const imagePath of files) {
      const imageBuffer = fs.readFileSync(imagePath);
      const { data } = await Tesseract.recognize(imageBuffer, 'por');
      fullText += data.text + '\n\n';

      fs.unlinkSync(imagePath);
    }

    return fullText;
  }

  private async processImage(filePath: string): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath);
    const { data } = await Tesseract.recognize(fileBuffer, 'por');
    return data.text;
  }
}
