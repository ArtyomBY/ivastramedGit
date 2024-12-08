import React from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

interface Appointment {
  id: string;
  specialization: string;
  doctor: string;
  date: string;
  time: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  selectedDate,
  onDateChange,
  onDeleteAppointment,
}) => {
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      onDateChange(value);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (appointment) =>
        moment(appointment.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
    );
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Календарь записей
      </Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ mt: 2 }}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="ru"
            tileClassName={({ date }) =>
              appointments.some(
                (appointment) =>
                  moment(appointment.date).format('YYYY-MM-DD') ===
                  moment(date).format('YYYY-MM-DD')
              )
                ? 'highlighted-date'
                : ''
            }
          />
          <style>{`
            .highlighted-date {
              background-color: #e3f2fd;
              color: #1976d2;
              font-weight: bold;
            }
            .highlighted-date:hover {
              background-color: #bbdefb;
            }
          `}</style>
        </Box>
        <Box sx={{ flex: 1 }}>
          {selectedDate && (
            <>
              <Typography variant="h6" gutterBottom>
                Записи на {moment(selectedDate).format('DD MMMM YYYY')}
              </Typography>
              <List>
                {getAppointmentsForDate(selectedDate).map((appointment) => (
                  <ListItem
                    key={appointment.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDeleteAppointment(appointment)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${appointment.specialization} - ${appointment.doctor}`}
                      secondary={`${appointment.time}`}
                    />
                  </ListItem>
                ))}
                {getAppointmentsForDate(selectedDate).length === 0 && (
                  <ListItem>
                    <ListItemText primary="Нет записей на выбранную дату" />
                  </ListItem>
                )}
              </List>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentCalendar;
