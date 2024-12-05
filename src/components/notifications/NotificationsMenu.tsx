import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppointmentNotifications } from '../../contexts/AppointmentNotificationsContext';
import { useNavigate } from 'react-router-dom';

const NotificationsMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { unreadCount, recentNotifications, markNotificationAsRead } = useAppointmentNotifications();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleViewHistory = () => {
    handleClose();
    navigate('/notifications/history');
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 2 }}
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
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Уведомления</Typography>
        </Box>
        <Divider />
        {recentNotifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              Нет новых уведомлений
            </Typography>
          </MenuItem>
        ) : (
          <>
            {recentNotifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': {
                    backgroundColor: notification.read ? 'action.hover' : 'action.selected',
                  },
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={format(new Date(notification.notificationTime), 'dd MMMM, HH:mm', { locale: ru })}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: notification.read ? 'text.primary' : 'primary',
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                  }}
                />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleViewHistory}>
              <Typography variant="body2" color="primary">
                Показать все уведомления
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
