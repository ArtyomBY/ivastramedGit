import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppointments } from '../../hooks/useAppointments';
import { Appointment } from '../../types/medical';
import { Box, Typography } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'ru': ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DoctorCalendarProps {
  viewMode: 'month' | 'week' | 'day';
}

export const DoctorCalendar: React.FC<DoctorCalendarProps> = ({ viewMode }) => {
  const { appointments, loading } = useAppointments();

  const eventStyleGetter = (event: Appointment) => {
    let backgroundColor = '#3174ad';
    let borderColor = '#265985';

    switch (event.status) {
      case 'Завершен':
        backgroundColor = '#4caf50';
        borderColor = '#388e3c';
        break;
      case 'Отменен':
        backgroundColor = '#f44336';
        borderColor = '#d32f2f';
        break;
      case 'Запланирован':
        backgroundColor = '#2196f3';
        borderColor = '#1976d2';
        break;
      default:
        backgroundColor = '#ff9800';
        borderColor = '#f57c00';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '4px',
        color: '#fff',
        display: 'block',
        padding: '2px 5px',
      },
    };
  };

  const calendarEvents = appointments.map(appointment => ({
    ...appointment,
    title: `${appointment.patientName} - ${appointment.type}`,
    start: new Date(appointment.startTime),
    end: new Date(appointment.endTime),
  }));

  const views = {
    month: true,
    week: true,
    day: true,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Загрузка расписания...</Typography>
      </Box>
    );
  }

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%' }}
      eventPropGetter={eventStyleGetter}
      view={viewMode}
      views={views}
      messages={{
        next: "Вперед",
        previous: "Назад",
        today: "Сегодня",
        month: "Месяц",
        week: "Неделя",
        day: "День",
        agenda: "Список",
        date: "Дата",
        time: "Время",
        event: "Событие",
        noEventsInRange: "Нет приёмов в выбранном периоде",
      }}
      popup
      selectable
      culture="ru"
    />
  );
};
