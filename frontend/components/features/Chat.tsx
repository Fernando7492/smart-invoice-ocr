'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askQuestion, getMessages } from '@/services/api';
import { Message } from '@/types';

interface ChatProps {
  invoiceId: string;
}

export default function Chat({ invoiceId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadHistory = async (): Promise<void> => {
      try {
        const history = await getMessages(invoiceId);
        setMessages(history);
      } catch (error) {
        console.error(error);
      }
    };

    void loadHistory();
  }, [invoiceId]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Foco automático no input quando o loading termina
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isLoading]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    
    const tempUserMessage: Message = {
      id: Date.now().toString(), // ID temporário
      role: 'user',
      text: userText,
      createdAt: new Date().toISOString(),
      invoiceId
    };
    
    setMessages(prev => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const answer = await askQuestion(invoiceId, userText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: answer,
        createdAt: new Date().toISOString(),
        invoiceId
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: 'error-id',
        role: 'ai',
        text: 'Erro ao conectar com a inteligência.',
        createdAt: new Date().toISOString(),
        invoiceId
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-t border-gray-800 mt-4 pt-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 max-h-75 custom-scrollbar">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-10">
            Faça perguntas sobre o documento (ex: &quot;Qual o valor total?&quot;, &quot;Qual o CNPJ?&quot;)
          </p>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}
            
            <div className={`p-3 rounded-lg text-sm max-w-[85%] overflow-hidden prose prose-invert leading-relaxed break-words ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white prose-p:text-white' 
                : 'bg-gray-800 text-gray-200'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({children}) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                  li: ({children}) => <li>{children}</li>,
                  strong: ({children}) => <strong className="font-bold text-inherit">{children}</strong>,
                  a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>,
                  code: ({children}) => <code className="bg-black/30 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex items-center gap-1 h-10 mt-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo sobre a nota..."
          disabled={isLoading}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-md transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}