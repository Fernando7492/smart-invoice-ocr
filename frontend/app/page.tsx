'use client';

import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import UploadZone from '@/components/features/UploadZone';
import DocumentPreview from '@/components/features/DocumentPreview';
import RecentHistory from '@/components/features/RecentHistory';
import AuthForm from '@/components/features/AuthForm';
import { Invoice } from '@/types';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentDoc, setCurrentDoc] = useState<Invoice | null>(null);
  const [refreshHistoryToken, setRefreshHistoryToken] = useState(0);

  useEffect(() => {
    const initAuth = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(initAuth);
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentDoc(null);
  };

  const handleUploadSuccess = (data: Invoice): void => {
    setCurrentDoc(data);
    setRefreshHistoryToken((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Invoice OCR</h1>
          <p className="text-gray-400">Gerenciador Inteligente de Documentos</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 border border-gray-800 px-3 py-1 rounded-full">
            V. Alpha 0.3
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Novo Upload</h3>
            <UploadZone onUploadSuccess={handleUploadSuccess} />
          </section>

          <section className="flex-1 min-h-0 flex flex-col bg-gray-900/30 rounded-lg p-4 border border-gray-800 border-dashed">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              Histórico Recente
            </h3>
            <div className="flex-1 overflow-hidden">
              <RecentHistory 
                onSelectInvoice={setCurrentDoc} 
                refreshTrigger={refreshHistoryToken}
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 h-full">
          <DocumentPreview data={currentDoc} />
        </div>
      </div>
    </main>
  );
}
