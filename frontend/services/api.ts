import axios from 'axios';
import { Invoice } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const uploadInvoice = async (file: File): Promise<Invoice> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post<Invoice>('/invoices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};

export const askQuestion = async (id: string, question: string): Promise<string> => {
  const { data } = await api.post<{ answer: string }>(`/invoices/${id}/chat`, { question });
  return data.answer;
};

export default api;