import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    middleName: '',
    passport: '',
    oms: '',
    address: '',
    birthDate: '',
    gender: '',
    role: 'patient' as UserRole,
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.middleName || !formData.phone || !formData.passport || !formData.oms || !formData.address || !formData.birthDate || !formData.gender) {
      setError('Заполните все поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при регистрации');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Регистрация
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/login')}
              sx={{ ml: 'auto' }}
            >
              Назад
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <TextField
              label="Подтверждение пароля"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <TextField
              label="Имя"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextField
              label="Фамилия"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <TextField
              label="Отчество"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <TextField
              label="Паспорт"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.passport}
              onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
            />
            <TextField
              label="ОМС"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.oms}
              onChange={(e) => setFormData({ ...formData, oms: e.target.value })}
            />
            <TextField
              label="Адрес"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <TextField
              label="Дата рождения"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
            <TextField
              label="Пол"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            />
            <TextField
              label="Телефон"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Зарегистрироваться
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
