import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PriceValue = string | number | null | undefined;

export function formatPrice(value: PriceValue): string | null {
  if (value === null || value === undefined || value === "") return null;
  const normalized = typeof value === "string" ? value.trim().replace(",", ".") : value;
  if (normalized === "") return null;
  const price = typeof normalized === "number" ? normalized : Number(normalized);
  if (!Number.isFinite(price) || price < 0) return null;
  return price.toLocaleString("ka-GE", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
