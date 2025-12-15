export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  fileName: string;
  filePath: string;
  extractedText: string | null;
  status: 'PENDING' | 'PROCESSED' | 'ERROR';
  createdAt: string;
  messages?: Message[];
}