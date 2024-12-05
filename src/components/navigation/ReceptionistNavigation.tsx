import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper, ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
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

export const ReceptionistNavigation = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Панель управления',
      icon: <DashboardIcon />,
      path: '/receptionist/dashboard',
    },
    {
      text: 'Расписание',
      icon: <CalendarMonthIcon />,
      path: '/receptionist/schedule',
    },
    {
      text: 'Пациенты',
      icon: <PeopleIcon />,
      path: '/receptionist/patients',
    },
    {
      text: 'Регистрация',
      icon: <PersonAddIcon />,
      path: '/receptionist/registration',
    },
    {
      text: 'Уведомления',
      icon: <NotificationsIcon />,
      path: '/receptionist/notifications',
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
