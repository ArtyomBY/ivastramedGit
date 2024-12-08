import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

const SickLeavesPage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Больничные листы
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {/* Здесь будет список больничных */}
            <Typography>Список больничных листов</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default SickLeavesPage;
