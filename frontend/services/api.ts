import axios from 'axios';
import { Invoice, Message } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, pass: string): Promise<string> => {
  const { data } = await api.post<{ access_token: string }>('/auth/login', {
    email,
    password: pass,
  });
  return data.access_token;
};

export const register = async (email: string, pass: string): Promise<void> => {
  await api.post('/auth/register', {
    email,
    pass,
  });
};

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

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await api.get<Invoice[]>('/invoices');
  return data;
};

export const askQuestion = async (id: string, question: string): Promise<string> => {
  const { data } = await api.post<{ answer: string }>(`/invoices/${id}/chat`, { question });
  return data.answer;
};

export const getMessages = async (id: string): Promise<Message[]> => {
  const { data } = await api.get<Message[]>(`/invoices/${id}/messages`);
  return data;
};

export default api;
