import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppointments } from '../../hooks/useAppointments';
import { Appointment } from '../../types/medical';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'scheduled':
      return 'primary';
    case 'inProgress':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Завершен';
    case 'cancelled':
      return 'Отменен';
    case 'scheduled':
      return 'Запланирован';
    case 'inProgress':
      return 'В процессе';
    default:
      return status;
  }
};

export const AppointmentsList = () => {
  const { appointments, loading } = useAppointments();

  const todayAppointments = appointments.filter(
    apt => new Date(apt.startTime).toDateString() === new Date().toDateString()
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  if (loading) {
    return <Typography>Загрузка приёмов...</Typography>;
  }

  if (todayAppointments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography color="textSecondary">
          На сегодня приёмов нет
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Приёмы на сегодня
      </Typography>
      <List>
        {todayAppointments.map((appointment) => (
          <ListItem
            key={appointment.id}
            sx={{
              mb: 1,
              borderRadius: 1,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            secondaryAction={
              <Box>
                <Tooltip title="Редактировать">
                  <IconButton edge="end" aria-label="edit" size="small" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Отметить как завершенный">
                  <IconButton edge="end" aria-label="complete" size="small" sx={{ mr: 1 }}>
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Отменить">
                  <IconButton edge="end" aria-label="delete" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" component="span">
                    {appointment.patientName}
                  </Typography>
                  <Chip
                    label={getStatusText(appointment.status)}
                    color={getStatusColor(appointment.status) as any}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(appointment.startTime), 'HH:mm', { locale: ru })} -{' '}
                    {format(new Date(appointment.endTime), 'HH:mm', { locale: ru })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(appointment.endTime), 'HH:mm', { locale: ru })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {appointment.type}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};
