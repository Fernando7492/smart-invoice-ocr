'use client';

import { useState, ChangeEvent } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';
import { uploadInvoice } from '@/services/api';
import { Invoice } from '@/types';

interface UploadZoneProps {
  onUploadSuccess: (data: Invoice) => void;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const data = await uploadInvoice(file);
      onUploadSuccess(data);
    } catch (err) {
      setError('Falha no processamento do arquivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
          )}
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Clique para enviar</span> ou arraste
          </p>
          <p className="text-xs text-gray-500">PDF, PNG, JPG</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}