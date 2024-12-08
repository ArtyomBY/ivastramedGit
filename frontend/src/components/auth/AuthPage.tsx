import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const AuthPage: React.FC = () => {
  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to IvaStrameds
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default AuthPage;
