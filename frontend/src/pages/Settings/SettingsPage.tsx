import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { isPatient, isDoctor } from '../../utils/typeGuards';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface SettingsFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  passport?: string;
  oms?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  specialization?: string;
  education?: string;
  experience?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<SettingsFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: '',
    emailNotifications: false,
    smsNotifications: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        phone: user.phone || '',
        email: user.email || '',
        ...(isPatient(user) ? {
          passport: user.passport,
          oms: user.oms,
          address: user.address,
          birthDate: user.birthDate || '', 
          gender: user.gender,
        } : {}),
        ...(isDoctor(user) ? {
          specialization: user.specialization,
          education: user.education,
          experience: user.experience,
        } : {})
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Обновление профиля в базе данных
      await updateProfile(formData);

      // Локальное обновление данных пользователя
      setFormData({ ...formData });

      setSuccess('Профиль успешно обновлен');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении профиля');
    }
  };

  const handleDeleteAccount = async () => {
    // Implement delete account logic here
  };

  if (!user) {
    return (
      <Container>
        <Typography>Пожалуйста, войдите в систему</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Настройки профиля
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Назад
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Имя"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Фамилия"
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Отчество"
                fullWidth
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Телефон"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            {isPatient(user) && (
              <> 
                <Grid item xs={12}>
                  <TextField
                    label="Паспорт"
                    fullWidth
                    value={formData.passport}
                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Полис ОМС"
                    fullWidth
                    value={formData.oms}
                    onChange={(e) => setFormData({ ...formData, oms: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Адрес"
                    fullWidth
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Дата рождения"
                    type="date"
                    fullWidth
                    value={formData.birthDate ? new Date(formData.birthDate).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Пол"
                    fullWidth
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                </Grid>
              </>
            )}
            {isDoctor(user) && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Специализация"
                    fullWidth
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Образование"
                    fullWidth
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Опыт работы"
                    fullWidth
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Изменение пароля</Typography>
              <TextField
                label="Текущий пароль"
                type="password"
                fullWidth
                margin="normal"
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
              <TextField
                label="Новый пароль"
                type="password"
                fullWidth
                margin="normal"
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <TextField
                label="Подтверждение нового пароля"
                type="password"
                fullWidth
                margin="normal"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Уведомления</Typography>
              <FormControlLabel
                control={<Checkbox checked={formData.emailNotifications} onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })} />}
                label="Получать уведомления по электронной почте"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.smsNotifications} onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })} />}
                label="Получать уведомления по SMS"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
              >
                Удалить аккаунт
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Обновить профиль
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
