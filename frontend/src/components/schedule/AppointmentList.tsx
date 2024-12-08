import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Appointment } from './types';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentsContext';

interface AppointmentListProps {
  date: Date;
  patientId?: string;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ date, patientId }) => {
  const { user } = useAuth();
  const { appointments, deleteAppointment } = useAppointments();

  const filteredAppointments = appointments.filter(appointment => {
    const sameDate = isSameDay(new Date(appointment.date), date);
    const samePatient = !patientId || appointment.patientId === patientId;
    return sameDate && samePatient;
  });

  const canEdit = user?.role === 'doctor' || user?.role === 'registrar' || user?.role === 'admin';

  return (
    <List>
      {filteredAppointments.map((appointment) => (
        <ListItem
          key={appointment.id}
          secondaryAction={
            canEdit && (
              <Box>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteAppointment(appointment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
          }
        >
          <ListItemText
            primary={
              <Typography variant="subtitle1">
                {format(new Date(appointment.date), 'HH:mm')} - {appointment.patientName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                Врач: {appointment.doctorName}
              </Typography>
            }
          />
        </ListItem>
      ))}
      {filteredAppointments.length === 0 && (
        <ListItem>
          <ListItemText
            primary={
              <Typography color="text.secondary">
                Нет записей на этот день
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );
};

export default AppointmentList;
