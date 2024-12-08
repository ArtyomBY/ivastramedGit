import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

const LaboratoryPage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Лабораторные исследования
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {/* Здесь будет список исследований */}
            <Typography>Список исследований</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default LaboratoryPage;
