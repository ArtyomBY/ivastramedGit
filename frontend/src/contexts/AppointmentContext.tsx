import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import moment from 'moment';
import { Appointment } from '../types/medical';

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Здесь будет API запрос к бэкенду
        // Пока используем моковые данные
        const mockAppointments: Appointment[] = [
          {
            id: '1',
            patientId: 'p1',
            doctorId: 'd1',
            patientName: 'Иванов Иван',
            doctorName: 'Петров Петр',
            date: moment().format('YYYY-MM-DD'),
            startTime: '09:00',
            endTime: '10:00',
            type: 'Первичный приём',
            status: 'Запланирован',
            description: 'Консультация терапевта',
            notes: '',
          },
          {
            id: '2',
            patientId: 'p2',
            doctorId: 'd1',
            patientName: 'Сидорова Анна',
            doctorName: 'Петров Петр',
            date: moment().add(1, 'days').format('YYYY-MM-DD'),
            startTime: '11:00',
            endTime: '12:00',
            type: 'Повторный приём',
            status: 'Подтвержден',
            description: 'Проверка результатов анализов',
            notes: '',
          },
        ];

        setAppointments(mockAppointments);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке записей');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updatedFields: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, ...updatedFields } : appointment
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
