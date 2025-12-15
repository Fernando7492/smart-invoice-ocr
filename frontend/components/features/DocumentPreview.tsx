import { FileText, CheckCircle } from 'lucide-react';
import { Invoice } from '@/types';
import Chat from './Chat';

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
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
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

      <div className="flex-1 overflow-auto bg-black rounded-md p-4 border border-gray-800 mb-4 max-h-50">
        <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Texto Extraído</h3>
        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
          {data.extractedText}
        </pre>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assistente IA</h3>
        <Chat key={data.id} invoiceId={data.id} />
      </div>
    </div>
  );
}