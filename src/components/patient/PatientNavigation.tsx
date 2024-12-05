import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  Chat as ChatIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PatientNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'medical-card',
    label: 'Медицинская карта',
    icon: <DescriptionIcon />,
  },
  {
    id: 'appointments',
    label: 'Записи на приём',
    icon: <EventNoteIcon />,
  },
  {
    id: 'chat',
    label: 'Чат с врачом',
    icon: <ChatIcon />,
  },
];

const PatientNavigation: React.FC<PatientNavigationProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <Paper sx={{ height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div">
          Навигация
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PatientNavigation;
