import { useState, useEffect } from 'react';
import { Appointment } from '../types/medical';
import moment from 'moment';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Имитация загрузки данных
    const fetchAppointments = () => {
      try {
        // Тестовые данные
        const today = moment().format('YYYY-MM-DD');
        const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
        
        const testAppointments: Appointment[] = [
          {
            id: '1',
            patientId: 'p1',
            doctorId: 'd1',
            patientName: 'Иванов Иван',
            doctorName: 'Петров Петр',
            date: today,
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
            date: today,
            startTime: '11:00',
            endTime: '12:00',
            type: 'Повторный приём',
            status: 'Завершен',
            description: 'Проверка результатов анализов',
            notes: '',
          },
          {
            id: '3',
            patientId: 'p3',
            doctorId: 'd1',
            patientName: 'Козлов Дмитрий',
            doctorName: 'Петров Петр',
            date: tomorrow,
            startTime: '14:00',
            endTime: '15:00',
            type: 'Процедура',
            status: 'Отменен',
            description: 'Плановый осмотр',
            notes: '',
          },
        ];

        setAppointments(testAppointments);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке приемов');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Math.random().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updatedData: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id
          ? { ...appointment, ...updatedData }
          : appointment
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
