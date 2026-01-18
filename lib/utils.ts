import { clsx, type ClassValue } from "clsx";
import { Time } from "lightweight-charts";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
  }).format(value);
}

// Преобразование данных OHLC из формата Coingecko в формат lightweight-charts
export function convertOHLCData(data: OHLCData[]) {
  return data
    .map((d) => ({
      time: d[0] as Time, // Преобразование метки времени в тип Time
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }))
    .filter(
      (item, index, arr) => index === 0 || item.time !== arr[index - 1].time,
    );
}

// Форматирование процентного изменения с одной десятичной точкой и знаком процента
export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined) {
    return "0.0%";
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}

export const buildPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] => {
  const MAX_VISIBLE_PAGES = 5;

  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
};
