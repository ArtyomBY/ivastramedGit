import React from 'react';
import { Container, Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель управления
      </Typography>
      <Typography variant="body1">
        Здесь будет отображаться информация о пользователе и доступные функции.
      </Typography>
    </Container>
  );
};

export default DashboardPage;
