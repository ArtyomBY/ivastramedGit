import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const RegistrarDashboard: React.FC = () => {
  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Registrar Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Schedule Management
              </Typography>
              <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Manage Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Patient Registration
              </Typography>
              <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Register Patient
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Appointment Processing
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Process and manage patient appointments efficiently.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegistrarDashboard;
