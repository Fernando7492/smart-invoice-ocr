import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
  }

  async ask(context: string, question: string): Promise<string> {
    const prompt = `Contexto:\n${context}\n\nPergunta: ${question}\n\nResponda com base no contexto.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      return 'Erro ao processar IA: ' + error;
    }
  }

  async extractData(text: string): Promise<string> {
    const prompt = `Extraia em JSON puro: estabelecimento, data, total (numero), cnpj. Texto: ${text}`;
    try {
      const result = await this.model.generateContent(prompt);
      const textResponse = result.response.text();
      return textResponse.replace(/```json|```/g, '').trim();
    } catch {
      return '{}';
    }
  }
}
