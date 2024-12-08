import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  styled,
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Appointment } from '../../types/medical';

interface AppointmentListProps {
  appointments: Appointment[];
  showPatientInfo?: boolean;
  showActions?: boolean;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
  filterDate?: Date;
  filterPatientId?: string;
}

interface AppointmentDetailsProps {
  appointment: Appointment;
  showPatientInfo: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'завершен':
      return 'success';
    case 'cancelled':
    case 'отменен':
      return 'error';
    case 'scheduled':
    case 'запланирован':
      return 'primary';
    case 'inprogress':
    case 'в процессе':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'завершен':
      return 'Завершен';
    case 'cancelled':
    case 'отменен':
      return 'Отменен';
    case 'scheduled':
    case 'запланирован':
      return 'Запланирован';
    case 'inprogress':
    case 'в процессе':
      return 'В процессе';
    default:
      return status;
  }
};

const DetailsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment, showPatientInfo }) => {
  const details = [];
  
  if (showPatientInfo) {
    details.push(
      <Typography key="patient" variant="body2" component="div" sx={{ mb: 1 }}>
        {`Пациент: ${appointment.patientName}`}
      </Typography>
    );
  }
  
  details.push(
    <Typography key="time" variant="body2" component="div" sx={{ mb: 1 }}>
      {`${format(new Date(appointment.startTime), 'HH:mm', { locale: ru })} - ${format(new Date(appointment.endTime), 'HH:mm', { locale: ru })}`}
    </Typography>
  );
  
  details.push(
    <Typography key="type" variant="body2" component="div" sx={{ mb: 1 }}>
      {appointment.type}
    </Typography>
  );
  
  if ('diagnosis' in appointment && Array.isArray(appointment.diagnosis) && appointment.diagnosis.length > 0) {
    details.push(
      <Typography key="diagnosis" variant="body2" component="div" sx={{ mb: 1 }}>
        {`Диагноз: ${appointment.diagnosis.join(', ')}`}
      </Typography>
    );
  }
  
  if ('treatment' in appointment && appointment.treatment) {
    details.push(
      <Typography key="treatment" variant="body2" component="div" sx={{ mb: 1 }}>
        {`Лечение: ${appointment.treatment}`}
      </Typography>
    );
  }
  
  // Remove margin bottom from last element
  if (details.length > 0) {
    const lastElement = details[details.length - 1];
    details[details.length - 1] = React.cloneElement(lastElement, {
      ...lastElement.props,
      sx: { ...lastElement.props.sx, mb: 0 }
    });
  }
  
  return <>{details}</>;
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  showPatientInfo = true,
  showActions = true,
  onEdit,
  onDelete,
  filterDate,
  filterPatientId,
}) => {
  const filteredAppointments = appointments.filter(appointment => {
    let include = true;

    if (filterDate) {
      const appointmentDate = new Date(appointment.date);
      include = include && (
        appointmentDate.getFullYear() === filterDate.getFullYear() &&
        appointmentDate.getMonth() === filterDate.getMonth() &&
        appointmentDate.getDate() === filterDate.getDate()
      );
    }

    if (filterPatientId) {
      include = include && appointment.patientId === filterPatientId;
    }

    return include;
  });

  return (
    <List>
      {filteredAppointments.map((appointment) => (
        <React.Fragment key={appointment.id}>
          <ListItem
            secondaryAction={
              showActions && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onEdit && (
                    <Tooltip title="Редактировать">
                      <IconButton edge="end" onClick={() => onEdit(appointment)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="Удалить">
                      <IconButton edge="end" onClick={() => onDelete(appointment.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )
            }
          >
            {showPatientInfo && (
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
            )}
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">
                    {format(new Date(appointment.date), 'PPP', { locale: ru })}
                  </Typography>
                  <Chip
                    size="small"
                    label={getStatusText(appointment.status)}
                    color={getStatusColor(appointment.status) as any}
                  />
                </Box>
              }
              secondary={<AppointmentDetails appointment={appointment} showPatientInfo={showPatientInfo} />}
            />
          </ListItem>
        </React.Fragment>
      ))}
      {filteredAppointments.length === 0 && (
        <ListItem>
          <ListItemText
            primary={
              <Typography color="text.secondary" align="center">
                Нет записей
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );
};

export default AppointmentList;
