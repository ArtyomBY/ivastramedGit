import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import NavigationBar from '../../components/NavigationBar';
import PatientList from '../../components/doctor/PatientList';
import AppointmentScheduler from '../../components/doctor/AppointmentScheduler';
import NotificationsPanel from '../../components/doctor/NotificationsPanel';
import PrescriptionManager from '../../components/doctor/PrescriptionManager';
import ChatWithPatients from '../../components/doctor/ChatWithPatients';
import MedicalRecords from '../../components/MedicalRecords';

const DoctorDashboard: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <Container sx={{ mt: 12 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель доктора
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <PatientList />
          </Grid>
          <Grid item xs={12} md={6}>
            <AppointmentScheduler />
          </Grid>
          <Grid item xs={12} md={6}>
            <NotificationsPanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <PrescriptionManager />
          </Grid>
          <Grid item xs={12} md={12}>
            <ChatWithPatients />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DoctorDashboard;
