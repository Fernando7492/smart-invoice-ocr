import { FileText, CheckCircle } from 'lucide-react';
import { Invoice } from '@/types';

interface DocumentPreviewProps {
  data: Invoice | null;
}

export default function DocumentPreview({ data }: DocumentPreviewProps) {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 border border-gray-800 rounded-lg bg-gray-900/50">
        <FileText className="w-16 h-16 mb-4 opacity-20" />
        <p>Nenhum documento selecionado</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {data.fileName}
          </h2>
          <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" /> {data.status}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-black rounded-md p-4 border border-gray-800">
        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
          {data.extractedText}
        </pre>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <p className="text-sm text-gray-500">
          IA Chat Placeholder
        </p>
      </div>
    </div>
  );
}