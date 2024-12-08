import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #00c6ff, #0072ff, #00ff7f)',
        color: '#fff'
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Добро пожаловать в Ивастрамед
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Пожалуйста, войдите в систему или зарегистрируйтесь для доступа к функциям.
      </Typography>
      <Box>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            backgroundColor: '#0072ff',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#005bb5',
            },
          }}
        >
          Войти в систему
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
