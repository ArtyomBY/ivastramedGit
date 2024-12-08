import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import UserManagement from './UserManagement';
import StatisticsAnalysis from './StatisticsAnalysis';
import SystemSettings from './SystemSettings';

const AdminDashboard: React.FC = () => {
  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                User Management
              </Typography>
              <UserManagement />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Statistics Analysis
              </Typography>
              <StatisticsAnalysis />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                System Settings
              </Typography>
              <SystemSettings />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
