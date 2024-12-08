import React from 'react';
import { Typography, Card, CardContent, TextField, Button } from '@mui/material';

const Settings: React.FC = () => {
  const handleServerConfigSave = () => {
    // Логика сохранения конфигурации сервера
  };

  return (
    <div>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">Настройки сервера</Typography>
          <TextField
            label="Адрес сервера"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Порт сервера"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Максимальное количество подключений"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleServerConfigSave}
          >
            Сохранить настройки
          </Button>
        </CardContent>
      </Card>
      {/* Здесь будет функционал настроек */}
    </div>
  );
};

export default Settings;
