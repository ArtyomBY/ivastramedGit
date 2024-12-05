import { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationService } from '../services/notificationService';
import { Appointment } from '../types/medical';

export const useAppointmentReminders = (appointments: Appointment[]) => {
  const { addNotification } = useNotifications();
  const checkInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Очищаем предыдущий интервал при изменении списка приёмов
    if (checkInterval.current) {
      clearInterval(checkInterval.current);
    }

    // Функция проверки напоминаний
    const checkReminders = () => {
      const now = new Date();
      
      appointments.forEach(appointment => {
        const notification = NotificationService.checkAppointmentReminders(appointment, now);
        if (notification) {
          addNotification(notification);
        }
      });
    };

    // Запускаем первую проверку
    checkReminders();

    // Устанавливаем интервал проверки каждую минуту
    checkInterval.current = setInterval(checkReminders, 60000);

    // Очищаем интервал при размонтировании
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [appointments, addNotification]);
};
