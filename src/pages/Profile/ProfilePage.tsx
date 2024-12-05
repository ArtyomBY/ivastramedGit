import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Divider,
  Avatar,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/auth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    passport: user?.passport || '',
    oms: user?.oms || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || '',
    role: user?.role || '' as UserRole,
    verified: user?.verified || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(formData);
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении профиля');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">Необходимо войти в систему</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                  Профиль пользователя
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{ ml: 'auto' }}
                >
                  Назад
                </Button>
              </Box>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={user.avatarUrl || ''}
                  alt="User Avatar"
                  sx={{ width: 100, height: 100, mb: 1 }}
                />
                <Typography variant="subtitle1" color="text.secondary">
                  Аватарка
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  ID аккаунта
                </Typography>
                <Typography variant="body1">{user.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  ФИО
                </Typography>
                <Typography variant="body1">{`${user.lastName} ${user.firstName} ${user.middleName}`}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Роль
                </Typography>
                <Typography variant="body1">
                  {user.role === 'admin' && 'Администратор'}
                  {user.role === 'doctor' && 'Врач'}
                  {user.role === 'patient' && 'Пациент'}
                  {user.role === 'registrar' && 'Регистратор'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Статус верификации
                </Typography>
                <Typography variant="body1" sx={{ color: user.verified ? 'green' : 'red' }}>
                  {user.verified ? 'Верифицирован' : 'Не верифицирован'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Телефон
                </Typography>
                <Typography variant="body1">{user.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Паспорт
                </Typography>
                <Typography variant="body1">{user.passport}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Полис ОМС
                </Typography>
                <Typography variant="body1">{user.oms}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Адрес
                </Typography>
                <Typography variant="body1">{user.address}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Дата рождения
                </Typography>
                <Typography variant="body1">{user.birthDate}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Пол
                </Typography>
                <Typography variant="body1">{user.gender}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
