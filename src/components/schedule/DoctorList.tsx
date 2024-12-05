import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import { Doctor } from '../../types/users';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface DoctorListProps {
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, onDoctorSelect }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Список врачей
      </Typography>
      <List>
        {doctors.map((doctor) => (
          <ListItem key={doctor.id}>
            <ListItemText
              primary={`${doctor.firstName} ${doctor.lastName}`}
              secondary={`${doctor.specialization}${doctor.category ? `, ${doctor.category}` : ''}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onDoctorSelect(doctor)}>
                <CalendarTodayIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DoctorList;
