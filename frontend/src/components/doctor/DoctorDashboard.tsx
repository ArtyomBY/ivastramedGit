import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const DoctorDashboard: React.FC = () => {
  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Today's Schedule
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View and manage your schedule for today.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Patient Records
              </Typography>
              <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                View Records
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Notifications
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Manage your notification settings and view patient alerts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard;
