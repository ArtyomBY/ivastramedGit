import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: '',
    passport: '',
    oms: '',
    address: '',
    birthDate: '',
    gender: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.middleName || !formData.phone || !formData.email || !formData.passport || !formData.oms || !formData.address || !formData.birthDate || !formData.gender) {
      alert('Все поля личной информации должны быть заполнены.');
      return;
    }

    const updatedData = {
      ...formData,
      verified: false,
    };

    try {
      await updateProfile(updatedData);
      alert('Информация успешно обновлена.');
    } catch (error) {
      alert('Ошибка при обновлении информации.');
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        phone: user.phone || '',
        email: user.email || '',
        passport: user.passport || '',
        oms: user.oms || '',
        address: user.address || '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h2" gutterBottom>
          Настройки
        </Typography>
        <IconButton onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Личная информация
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={avatarPreview || user?.avatarUrl || ''}
            alt="User Avatar"
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Typography variant="subtitle1" color="text.secondary">
            Аватарка
          </Typography>
          <Button variant="outlined" component="label">
            Загрузить аватарку
            <input type="file" hidden onChange={handleAvatarChange} />
          </Button>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Имя" name="firstName" value={formData.firstName} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Фамилия" name="lastName" value={formData.lastName} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Отчество" name="middleName" value={formData.middleName} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Телефон" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Электронная почта" name="email" value={formData.email} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Паспорт" name="passport" value={formData.passport} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="ОМС" name="oms" value={formData.oms} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Адрес" name="address" value={formData.address} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Дата рождения" name="birthDate" value={formData.birthDate} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Пол" name="gender" value={formData.gender} onChange={handleChange} variant="outlined" sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Сохранить изменения
          </Button>
        </form>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Уведомления
        </Typography>
        <FormControlLabel control={<Switch />} label="Напоминания о приеме" sx={{ mb: 1 }} />
        <FormControlLabel control={<Switch />} label="Обновления медицинских записей" sx={{ mb: 1 }} />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Безопасность
        </Typography>
        <Button variant="outlined" sx={{ mb: 2 }}>Изменить пароль</Button>
        <FormControlLabel control={<Switch />} label="Двухфакторная аутентификация" />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Язык и регион
        </Typography>
        <Select fullWidth variant="outlined" sx={{ mb: 2 }} defaultValue="ru">
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Интеграции
        </Typography>
        <Button variant="outlined">Подключить Google Calendar</Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Конфиденциальность
        </Typography>
        <Button variant="outlined">Управление разрешениями</Button>
      </Box>
    </Container>
  );
};

export default SettingsPage;
