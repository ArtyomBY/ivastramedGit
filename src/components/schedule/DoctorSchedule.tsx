import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { format, addMinutes } from 'date-fns';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { ru } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import { useAppointments } from '../../contexts/AppointmentsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Doctor, Appointment, Visit } from '../../types/medical';
import AppointmentDialog, { AppointmentDialogProps } from '../../components/appointments/AppointmentDialog';

const localizer = dateFnsLocalizer({
  format,
  parse: (value: string) => new Date(value),
  startOfWeek: () => 1,
  getDay: (date: Date) => date.getDay(),
  locales: { ru },
});

interface DoctorScheduleProps {
  doctor: Doctor;
}

const DoctorSchedule: React.FC<DoctorScheduleProps> = ({ doctor }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Partial<Appointment> | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { appointments, addAppointment, updateAppointment } = useAppointments();
  const { user } = useAuth();

  const handleEventClick = (event: any) => {
    const appointment = appointments.find(a => a.id === event.id);
    if (appointment) {
      setSelectedAppointment({
        id: appointment.id,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        type: appointment.type,
        notes: appointment.notes,
        doctorName: appointment.doctorName,
        patientName: appointment.patientName
      });
      setIsDialogOpen(true);
    }
  };

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    if (user?.role === 'patient' || user?.role === 'registrar') {
      setSelectedAppointment({
        date: format(slotInfo.start, 'yyyy-MM-dd'),
        startTime: format(slotInfo.start, 'HH:mm'),
        endTime: format(slotInfo.end, 'HH:mm'),
        doctorId: doctor.id,
        patientId: user.role === 'patient' ? user.id : undefined,
      });
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(undefined);
  };

  const handleAppointmentSave = (data: Partial<Appointment | Visit>) => {
    const appointmentData = data as Partial<Appointment>;
    if (appointmentData.type && appointmentData.status) {
      const newAppointment: Appointment = {
        id: appointmentData.id || String(Date.now()),
        patientId: appointmentData.patientId || '',
        patientName: appointmentData.patientName || '',
        doctorId: doctor.id,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        date: appointmentData.date || format(new Date(), 'yyyy-MM-dd'),
        startTime: appointmentData.startTime || format(new Date(), 'HH:mm'),
        endTime: appointmentData.endTime || format(addMinutes(new Date(), 30), 'HH:mm'),
        type: appointmentData.type,
        status: appointmentData.status,
        notes: appointmentData.notes || '',
        description: appointmentData.description || '',
      };
      if (appointmentData.id) {
        updateAppointment(appointmentData.id, newAppointment);
      } else {
        addAppointment(newAppointment);
      }
      handleDialogClose();
    }
  };

  const getEventStyle = (event: any) => {
    const status = event.resource.status;
    switch (status) {
      case 'Запланирован':
        return 'appointment-scheduled';
      case 'Завершен':
        return 'appointment-completed';
      case 'Отменен':
        return 'appointment-cancelled';
      default:
        return '';
    }
  };

  const filteredEvents = appointments
    .filter(appointment => appointment.doctorId === doctor.id)
    .filter(appointment => statusFilter === 'all' || appointment.status === statusFilter)
    .map(appointment => ({
      id: appointment.id,
      title: `${appointment.type} - ${appointment.patientName || appointment.patientId}`,
      start: new Date(appointment.date + 'T' + appointment.startTime),
      end: new Date(appointment.date + 'T' + appointment.endTime),
      resource: appointment,
    }));

  return (
    <Paper sx={{ p: 3, height: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Расписание - {doctor.firstName} {doctor.lastName}
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус записи</InputLabel>
          <Select<string>
            value={statusFilter}
            label="Статус записи"
            onChange={(e: SelectChangeEvent<string>) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Все записи</MenuItem>
            <MenuItem value="Запланирован">Запланированные</MenuItem>
            <MenuItem value="Завершен">Завершенные</MenuItem>
            <MenuItem value="Отменен">Отмененные</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ height: 'calc(100% - 60px)' }}>
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSlotSelect}
          selectable={user?.role === 'patient' || user?.role === 'registrar'}
          defaultView="week"
          views={['month', 'week', 'day']}
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          messages={{
            week: 'Неделя',
            day: 'День',
            month: 'Месяц',
            previous: 'Назад',
            next: 'Вперед',
            today: 'Сегодня',
            agenda: 'Список'
          }}
          eventPropGetter={(event) => ({
            className: getEventStyle(event)
          })}
        />
      </Box>
      {isDialogOpen && (
        <AppointmentDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onSave={handleAppointmentSave}
          initialData={selectedAppointment as Partial<Appointment>}
          doctor={doctor}
          mode="appointment"
          loading={false}
        />
      )}
    </Paper>
  );
};

export default DoctorSchedule;
