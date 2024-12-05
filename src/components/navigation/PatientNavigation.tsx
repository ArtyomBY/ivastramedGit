import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper, ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const NavItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const PatientNavigation = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Записаться на приём',
      icon: <EventIcon />,
      path: '/patient/appointments/new',
    },
    {
      text: 'Мои записи',
      icon: <HistoryIcon />,
      path: '/patient/appointments',
    },
    {
      text: 'Медицинская карта',
      icon: <LocalHospitalIcon />,
      path: '/patient/medical-records',
    },
    {
      text: 'Уведомления',
      icon: <NotificationsIcon />,
      path: '/patient/notifications',
    },
    {
      text: 'Настройки',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  return (
    <NavContainer elevation={0}>
      <List>
        {menuItems.map((item) => (
          <NavItem
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </NavItem>
        ))}
      </List>
    </NavContainer>
  );
};
