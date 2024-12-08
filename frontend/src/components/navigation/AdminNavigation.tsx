import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper, ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BackupIcon from '@mui/icons-material/Backup';
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

export const AdminNavigation = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Панель управления',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      text: 'Пользователи',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      text: 'Безопасность',
      icon: <SecurityIcon />,
      path: '/admin/security',
    },
    {
      text: 'Аналитика',
      icon: <AnalyticsIcon />,
      path: '/admin/analytics',
    },
    {
      text: 'Резервное копирование',
      icon: <BackupIcon />,
      path: '/admin/backup',
    },
    {
      text: 'Настройки системы',
      icon: <SettingsIcon />,
      path: '/admin/settings',
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
