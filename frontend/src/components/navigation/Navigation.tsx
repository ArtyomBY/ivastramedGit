import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DoctorNavigation } from './DoctorNavigation';
import { PatientNavigation } from './PatientNavigation';
import { ReceptionistNavigation } from './ReceptionistNavigation';
import { AdminNavigation } from './AdminNavigation';
import { Box } from '@mui/material';

export const Navigation = () => {
  const { user } = useAuth();

  if (!user) return null;

  const navigationComponents = {
    doctor: DoctorNavigation,
    patient: PatientNavigation,
    receptionist: ReceptionistNavigation,
    admin: AdminNavigation,
    registrar: AdminNavigation, // Using AdminNavigation as a placeholder
  };

  const NavigationComponent = navigationComponents[user.role];

  return (
    <Box sx={{ width: 280, flexShrink: 0 }}>
      <NavigationComponent />
    </Box>
  );
};
