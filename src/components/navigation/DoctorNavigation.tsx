import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper, ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
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

export const DoctorNavigation = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Расписание приёмов',
      icon: <EventNoteIcon />,
      path: '/doctor/schedule',
    },
    {
      text: 'Мои пациенты',
      icon: <PeopleIcon />,
      path: '/doctor/patients',
    },
    {
      text: 'Медицинские записи',
      icon: <AssignmentIcon />,
      path: '/doctor/records',
    },
    {
      text: 'Уведомления',
      icon: <NotificationsIcon />,
      path: '/doctor/notifications',
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
