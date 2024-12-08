import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const formatOptions = { locale: ru };

export const formatDate = (date: Date | string | number): string => {
  const parsedDate = new Date(date);
  return format(parsedDate, 'dd.MM.yyyy');
};

export const formatTime = (date: Date | string | number): string => {
  const parsedDate = new Date(date);
  return format(parsedDate, 'HH:mm');
};

export const formatDateTime = (date: Date | string | number): string => {
  const parsedDate = new Date(date);
  return format(parsedDate, 'dd.MM.yyyy HH:mm');
};
