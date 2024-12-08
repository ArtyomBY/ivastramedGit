import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications } from '../../contexts/NotificationContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const formatDateTime = (date: Date) => {
  return format(date, 'dd.MM.yyyy HH:mm');
};

const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={`${unreadCount} непрочитанных уведомлений`}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Уведомления</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Прочитать все
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">Нет уведомлений</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              sx={{
                backgroundColor: notification.read ? 'inherit' : 'action.hover',
                display: 'block',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {formatDateTime(notification.date)}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
