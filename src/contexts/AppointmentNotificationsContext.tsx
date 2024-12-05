import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, isBefore, isAfter, addMinutes, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppointments } from './AppointmentsContext';
import { useAuth } from './AuthContext';
import { useNotificationSettings } from './NotificationSettingsContext';
import { Appointment } from '../components/schedule/types';
import notificationSound from '../assets/notification';

interface AppointmentNotification {
  id: string;
  appointmentId: string;
  message: string;
  notificationTime: string;
  type: 'appointmentReminder' | 'statusChange' | 'cancelation';
  shown: boolean;
  read: boolean;
}

interface AppointmentNotificationsContextType {
  notifications: AppointmentNotification[];
  unreadCount: number;
  recentNotifications: AppointmentNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const AppointmentNotificationsContext = createContext<AppointmentNotificationsContextType | null>(null);

export const useAppointmentNotifications = () => {
  const context = useContext(AppointmentNotificationsContext);
  if (!context) {
    throw new Error('useAppointmentNotifications must be used within an AppointmentNotificationsProvider');
  }
  return context;
};

export const AppointmentNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppointmentNotification[]>([]);
  const { appointments } = useAppointments();
  const { user } = useAuth();
  const { settings } = useNotificationSettings();
  const [audio] = useState(new Audio(notificationSound));

  const addNotification = useCallback((
    appointment: Appointment,
    type: AppointmentNotification['type'],
    message: string
  ) => {
    if (!settings.notificationTypes[type]) {
      return;
    }

    const notification: AppointmentNotification = {
      id: uuidv4(),
      appointmentId: appointment.id,
      message,
      notificationTime: new Date().toISOString(),
      type,
      shown: false,
      read: false,
    };

    setNotifications(prev => {
      const newNotifications = [...prev, notification];
      // Keep only last 7 days of notifications
      return newNotifications.filter(n => 
        isAfter(new Date(n.notificationTime), subDays(new Date(), 7))
      );
    });

    // Play sound if enabled
    if (settings.soundEnabled) {
      audio.play().catch(console.error);
    }

    // Send email if enabled
    if (settings.emailEnabled) {
      // TODO: Implement email sending
      console.log('Email notification would be sent:', message);
    }
  }, [settings, audio]);

  // Check for upcoming appointments and create notifications
  useEffect(() => {
    if (!user || !appointments) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      
      appointments.forEach(appointment => {
        const appointmentTime = new Date(appointment.date + 'T' + appointment.startTime);

        // Check each reminder interval
        settings.reminderIntervals.forEach(minutes => {
          const reminderTime = subDays(appointmentTime, minutes);
          const isTimeToNotify = isAfter(now, reminderTime) && 
                                isBefore(now, addMinutes(reminderTime, 1));

          if (isTimeToNotify) {
            const message = `Напоминание: прием ${format(appointmentTime, 'dd MMMM в HH:mm', { locale: ru })}`;
            addNotification(appointment, 'appointmentReminder', message);
          }
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [user, appointments, settings.reminderIntervals, addNotification]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications
    .slice()
    .sort((a, b) => new Date(b.notificationTime).getTime() - new Date(a.notificationTime).getTime())
    .slice(0, 10);

  return (
    <AppointmentNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        recentNotifications,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppointmentNotificationsContext.Provider>
  );
};

export default AppointmentNotificationsContext;
