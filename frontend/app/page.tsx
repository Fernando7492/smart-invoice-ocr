'use client';

import { useState } from 'react';
import UploadZone from '@/components/features/UploadZone';
import DocumentPreview from '@/components/features/DocumentPreview';
import { Invoice } from '@/types';

export default function Home() {
  const [currentDoc, setCurrentDoc] = useState<Invoice | null>(null);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Invoice OCR</h1>
          <p className="text-gray-400">Gerenciador Inteligente de Documentos</p>
        </div>
        <div className="text-sm text-gray-500 border border-gray-800 px-3 py-1 rounded-full">
          V. Alpha 0.2
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Novo Upload</h3>
            <UploadZone onUploadSuccess={setCurrentDoc} />
          </section>

          <section className="flex-1 bg-gray-900/30 rounded-lg p-4 border border-gray-800 border-dashed">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Histórico Recente</h3>
            <p className="text-xs text-gray-600">Em breve...</p>
          </section>
        </div>

        <div className="lg:col-span-8 h-full">
          <DocumentPreview data={currentDoc} />
        </div>
      </div>
    </main>
  );
}