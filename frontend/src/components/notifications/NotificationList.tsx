import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Paper,
  Box,
  Tooltip,
} from '@mui/material';
import {
  NotificationsNone as AppointmentIcon,
  Assessment as LabResultsIcon,
  Event as ScheduleIcon,
  Info as SystemIcon,
  Close as CloseIcon,
  DoneAll as MarkReadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Notification, NotificationType } from '../../types/auth';
import { useNotifications } from '../../contexts/NotificationContext';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'appointmentReminder':
    case 'appointmentChange':
      return <AppointmentIcon color="primary" />;
    case 'labResults':
      return <LabResultsIcon color="info" />;
    case 'scheduleChange':
      return <ScheduleIcon color="warning" />;
    case 'systemNotification':
      return <SystemIcon color="action" />;
    default:
      return <SystemIcon />;
  }
};

interface NotificationListProps {
  maxHeight?: number | string;
}

export const NotificationList: React.FC<NotificationListProps> = ({ maxHeight = 400 }) => {
  const { notifications, markAsRead, removeNotification, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <Box p={2} textAlign="center">
        <Typography color="textSecondary">
          Нет новых уведомлений
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <Box display="flex" justifyContent="flex-end" p={1}>
        <Tooltip title="Отметить все как прочитанные">
          <IconButton onClick={markAllAsRead} size="small">
            <MarkReadIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{ maxHeight, overflow: 'auto' }}>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              bgcolor: notification.read ? 'transparent' : 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="удалить"
                onClick={() => removeNotification(notification.id)}
              >
                <CloseIcon />
              </IconButton>
            }
          >
            <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
            <ListItemText
              primary={notification.title}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    sx={{ display: 'block' }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                  >
                    {format(notification.date, 'PPp', { locale: ru })}
                  </Typography>
                </>
              }
              onClick={() => !notification.read && markAsRead(notification.id)}
              sx={{ cursor: 'pointer' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
