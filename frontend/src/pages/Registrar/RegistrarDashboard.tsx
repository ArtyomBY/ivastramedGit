import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import NavigationBar from '../../components/NavigationBar';
import AppointmentManagement from '../../components/registrar/AppointmentManagement';
import AccountVerification from '../../components/registrar/AccountVerification';
import ScheduleOverview from '../../components/registrar/ScheduleOverview';
import NotificationCenter from '../../components/registrar/NotificationCenter';
import PatientSearch from '../../components/registrar/PatientSearch';

const RegistrarDashboard: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <Container sx={{ mt: 12 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель регистратора
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AppointmentManagement />
          </Grid>
          <Grid item xs={12} md={6}>
            <AccountVerification />
          </Grid>
          <Grid item xs={12} md={6}>
            <ScheduleOverview />
          </Grid>
          <Grid item xs={12} md={6}>
            <NotificationCenter />
          </Grid>
          <Grid item xs={12} md={6}>
            <PatientSearch />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default RegistrarDashboard;
