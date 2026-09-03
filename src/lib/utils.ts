import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateLabel(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  const timeStr = hasTime
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  if (isToday) return timeStr ? `Today at ${timeStr}` : 'Today';
  if (isTomorrow) return timeStr ? `Tomorrow at ${timeStr}` : 'Tomorrow';

  const dayName = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  return timeStr ? `${dayName} at ${timeStr}` : dayName;
}
