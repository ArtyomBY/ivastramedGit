import { TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';

// Базовые типы для полей формы
export interface BaseFieldProps {
  fullWidth?: boolean;
  label?: string;
}

// Типы для компонентов выбора даты
export type DatePickerFieldProps = Omit<DatePickerProps<Date>, 'renderInput'>;

// Типы для компонентов выбора времени
export interface TimePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
}

// Общие типы для форм
export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}
