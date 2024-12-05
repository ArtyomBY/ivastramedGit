export interface Appointment {
  id: string;
  type: string;
  status: 'Запланирован' | 'Подтвержден' | 'Отменен' | 'Завершен';
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export type AppointmentsByDate = Record<string, Appointment[]>;
