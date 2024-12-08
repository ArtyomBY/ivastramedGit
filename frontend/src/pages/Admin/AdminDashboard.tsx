import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import NavigationBar from '../../components/NavigationBar';
import UserManagement from '../../components/UserManagement';
import RoleManagement from '../../components/RoleManagement';
import Reports from '../../components/Reports';
import Settings from '../../components/Settings';

const AdminDashboard: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <Container sx={{ mt: 12 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель администратора
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <UserManagement />
          </Grid>
          <Grid item xs={12} md={6}>
            <RoleManagement />
          </Grid>
          <Grid item xs={12} md={6}>
            <Reports />
          </Grid>
          <Grid item xs={12} md={6}>
            <Settings />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
