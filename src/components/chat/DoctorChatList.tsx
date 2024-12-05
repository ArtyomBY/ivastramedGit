import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  specialization: string;
  lastVisit: string;
  unreadMessages: number;
}

interface DoctorChatListProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  selectedDoctorId?: string | null;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const DoctorChatList: React.FC<DoctorChatListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
}) => {
  return (
    <Paper sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" gutterBottom>
          Чат с доктором
        </Typography>
      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {doctors.map((doctor) => (
          <ListItem
            key={doctor.id}
            alignItems="flex-start"
            onClick={() => onSelectDoctor(doctor)}
            sx={{
              cursor: 'pointer',
              bgcolor: selectedDoctorId === doctor.id ? 'action.selected' : 'inherit',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar>
                  {doctor.firstName.charAt(0)}
                  {doctor.lastName.charAt(0)}
                </Avatar>
              </StyledBadge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography component="span">
                    {`${doctor.lastName} ${doctor.firstName.charAt(0)}.${doctor.middleName.charAt(0)}.`}
                  </Typography>
                  {doctor.unreadMessages > 0 && (
                    <Badge
                      badgeContent={doctor.unreadMessages}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    display="block"
                  >
                    {doctor.specialization}
                  </Typography>
                  <Typography component="span" variant="caption" color="text.secondary">
                    Последний визит: {moment(doctor.lastVisit).format('DD.MM.YYYY')}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DoctorChatList;
