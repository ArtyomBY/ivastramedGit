import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { useAppointments } from '../../hooks/useAppointments';
import { Appointment } from '../../types/medical';

moment.locale('ru');
const localizer = momentLocalizer(moment);

interface AppointmentSchedulerProps {
  viewMode?: 'month' | 'week' | 'day';
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ viewMode = 'week' }) => {
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { appointments, loading } = useAppointments();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

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
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const formatTimeRange = (startTime: string | Date, endTime: string | Date) => {
    const start = typeof startTime === 'string' 
      ? startTime 
      : moment(startTime).format('HH:mm');
    const end = typeof endTime === 'string' 
      ? endTime 
      : moment(endTime).format('HH:mm');
  
    return `${start} - ${end}`;
  };

  const calendarEvents = appointments.map(appointment => {
    const startDate = moment(`${appointment.date} ${appointment.startTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const endDate = moment(`${appointment.date} ${appointment.endTime}`, 'YYYY-MM-DD HH:mm').toDate();
    
    return {
      ...appointment,
      title: `${appointment.patientName} - ${appointment.type}`,
      start: startDate,
      end: endDate,
    };
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Загрузка расписания...</Typography>
      </Box>
    );
  }

  return (
    <div style={{ height: '100%', minHeight: '600px', width: '100%' }}>
      <Card sx={{ height: '100%', width: '100%' }}>
        <CardContent sx={{ height: '100%', width: '100%', '&:last-child': { pb: 0 } }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100% - 16px)', width: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setIsDialogOpen(true);
            }}
            defaultView={viewMode}
            views={['month', 'week', 'day']}
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
              showMore: (total) => `+${total} ещё`,
            }}
            popup
            selectable
          />
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Детали приёма</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6">Пациент: {selectedEvent.patientName}</Typography>
              <Typography>
                Время: {formatTimeRange(selectedEvent.startTime, selectedEvent.endTime)}
              </Typography>
              <Typography>Тип: {selectedEvent.type}</Typography>
              <Typography>Статус: {selectedEvent.status}</Typography>
              <Typography>Описание: {selectedEvent.description}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
