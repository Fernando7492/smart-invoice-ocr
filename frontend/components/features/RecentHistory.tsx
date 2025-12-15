"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getInvoices } from "@/services/api";
import { Invoice } from "@/types";

interface RecentHistoryProps {
  onSelectInvoice: (invoice: Invoice) => void;
  refreshTrigger: number;
}

export default function RecentHistory({
  onSelectInvoice,
  refreshTrigger,
}: RecentHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = useCallback(async (): Promise<void> => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [refreshTrigger, loadInvoices]);

  useEffect(() => {
    const hasPending = invoices.some((inv) => inv.status === "PENDING");

    if (hasPending) {
      const pollingId = setTimeout(() => {
        loadInvoices();
      }, 3000);

      return () => clearTimeout(pollingId);
    }
  }, [invoices, loadInvoices]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROCESSED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "ERROR":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Carregando histórico...
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Nenhum documento encontrado.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full pr-2 custom-scrollbar">
      {invoices.map((invoice) => (
        <button
          key={invoice.id}
          onClick={() => onSelectInvoice(invoice)}
          className="w-full text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-200 truncate max-w-45">
              {invoice.fileName}
            </span>
            {getStatusIcon(invoice.status)}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatDate(invoice.createdAt)}
          </div>
        </button>
      ))}
    </div>
  );
}
