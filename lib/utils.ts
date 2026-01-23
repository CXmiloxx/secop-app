import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


export type FilePreviewMeta = {
  type: "pdf" | "doc" | "xls" | "image" | "other";
  label: string;
  color: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const calculatePercentage = (
  part: number,
  total: number,
  decimals: number = 1
): number => {
  if (!total || isNaN(part) || isNaN(total) || total === 0) return 0
  return Number(((part / total) * 100).toFixed(decimals))
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function formatShortDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export const getFilePreviewMeta = (path: string): FilePreviewMeta => {
  const lower = path.toLowerCase();

  const isPdf = lower.endsWith(".pdf");
  const isDoc = lower.endsWith(".doc") || lower.endsWith(".docx");
  const isXls = lower.endsWith(".xls") || lower.endsWith(".xlsx");
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(lower);

  if (isPdf) {
    return { type: "pdf", label: "PDF", color: "text-red-600" };
  }

  if (isDoc) {
    return { type: "doc", label: "Word", color: "text-blue-600" };
  }

  if (isXls) {
    return { type: "xls", label: "Excel", color: "text-green-700" };
  }

  if (isImage) {
    return { type: "image", label: "Imagen", color: "" };
  }

  return { type: "other", label: "Archivo", color: "text-gray-500" };
};

