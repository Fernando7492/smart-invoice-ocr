export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  createdAt: string;
  invoiceId: string;
}

export interface Invoice {
  id: string;
  fileName: string;
  filePath: string;
  extractedText: string | null;
  status: 'PENDING' | 'PROCESSED' | 'ERROR';
  createdAt: string;
  userId: string;
  messages?: Message[];
}