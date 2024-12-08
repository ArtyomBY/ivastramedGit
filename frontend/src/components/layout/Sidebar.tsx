import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, user }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Расписание',
      icon: <ScheduleIcon />,
      path: '/schedule',
    },
    {
      text: 'Медицинские записи',
      icon: <MedicalServicesIcon />,
      path: '/medical-records',
    },
    {
      text: 'Профиль',
      icon: <PersonIcon />,
      path: '/profile',
    },
    ...(user?.role === 'admin' ? [
      {
        text: 'Управление персоналом',
        icon: <SupervisorAccountIcon />,
        path: '/staff-management',
      }
    ] : []),
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
