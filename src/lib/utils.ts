import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateLabel(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();

  // Midnight comparison
  const dStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.round((dStart.getTime() - nowStart.getTime()) / (1000 * 3600 * 24));

  // Only display time if it wasn't defaulted to midnight 00:00
  const hasExplicitTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  const timeStr = hasExplicitTime
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  if (diffDays === 0) return timeStr ? `Today at ${timeStr}` : 'Today';
  if (diffDays === 1) return timeStr ? `Tomorrow at ${timeStr}` : 'Tomorrow';
  if (diffDays === -1) return timeStr ? `Yesterday at ${timeStr}` : 'Yesterday';

  const dayName = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  return timeStr ? `${dayName} at ${timeStr}` : dayName;
}