import { addMinutes, isBefore, isWithinInterval, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Appointment } from '../types/medical';
import { Notification, NotificationType } from '../types/auth';

export class NotificationService {
  private static REMINDER_INTERVALS = [
    { minutes: 60, message: 'через час' },
    { minutes: 30, message: 'через 30 минут' },
    { minutes: 15, message: 'через 15 минут' },
    { minutes: 5, message: 'через 5 минут' },
  ];

  static checkAppointmentReminders(
    appointment: Appointment,
    now: Date = new Date()
  ): Notification | null {
    // Проверяем только предстоящие приёмы
    if (isBefore(appointment.startTime, now)) {
      return null;
    }

    // Проверяем каждый интервал напоминания
    for (const interval of this.REMINDER_INTERVALS) {
      const reminderTime = addMinutes(appointment.startTime, -interval.minutes);
      
      // Если текущее время попадает в минутный интервал для напоминания
      if (isWithinInterval(now, {
        start: addMinutes(reminderTime, -1),
        end: addMinutes(reminderTime, 1)
      })) {
        return {
          id: `reminder-${appointment.id}-${interval.minutes}`,
          type: 'appointmentReminder' as NotificationType,
          title: 'Напоминание о приёме',
          message: `Приём ${interval.message} в ${format(new Date(appointment.startTime), 'HH:mm', { locale: ru })}`,
          date: now,
          read: false,
          relatedEntityId: appointment.id,
          actionUrl: `/schedule/appointment/${appointment.id}`
        };
      }
    }

    return null;
  }

  static createAppointmentChangeNotification(
    appointment: Appointment,
    changeType: 'created' | 'updated' | 'cancelled'
  ): Notification {
    const messages = {
      created: 'Создан новый приём',
      updated: 'Изменено время приёма',
      cancelled: 'Приём отменён'
    };

    const titles = {
      created: 'Новый приём',
      updated: 'Изменение приёма',
      cancelled: 'Отмена приёма'
    };

    return {
      id: `appointment-${changeType}-${appointment.id}-${Date.now()}`,
      type: 'appointmentChange',
      title: titles[changeType],
      message: `${messages[changeType]} на ${format(new Date(appointment.startTime), 'd MMMM в HH:mm', { locale: ru })}`,
      date: new Date(),
      read: false,
      relatedEntityId: appointment.id,
      actionUrl: `/schedule/appointment/${appointment.id}`
    };
  }

  static createScheduleChangeNotification(
    doctorId: string,
    date: Date,
    changeType: 'workday' | 'dayoff' | 'vacation'
  ): Notification {
    const messages = {
      workday: 'Добавлен рабочий день',
      dayoff: 'Добавлен выходной день',
      vacation: 'Добавлен отпуск'
    };

    return {
      id: `schedule-${changeType}-${doctorId}-${Date.now()}`,
      type: 'scheduleChange',
      title: 'Изменение расписания',
      message: `${messages[changeType]} на ${format(date, 'd MMMM yyyy', { locale: ru })}`,
      date: new Date(),
      read: false,
      relatedEntityId: doctorId,
      actionUrl: `/schedule/doctor/${doctorId}`
    };
  }
}
