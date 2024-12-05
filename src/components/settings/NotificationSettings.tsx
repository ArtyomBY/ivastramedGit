import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Chip,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { useNotificationSettings } from '../../contexts/NotificationSettingsContext';

const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useNotificationSettings();

  const handleSoundToggle = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleEmailToggle = () => {
    updateSettings({ emailEnabled: !settings.emailEnabled });
  };

  const handleNotificationTypeToggle = (type: keyof typeof settings.notificationTypes) => {
    updateSettings({
      notificationTypes: {
        ...settings.notificationTypes,
        [type]: !settings.notificationTypes[type],
      },
    });
  };

  const formatInterval = (minutes: number): string => {
    if (minutes >= 1440) {
      return `${minutes / 1440} дней`;
    }
    if (minutes >= 60) {
      return `${minutes / 60} часов`;
    }
    return `${minutes} минут`;
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Настройки уведомлений
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Способы уведомлений
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.soundEnabled}
                  onChange={handleSoundToggle}
                  color="primary"
                />
              }
              label="Звуковые уведомления"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailEnabled}
                  onChange={handleEmailToggle}
                  color="primary"
                />
              }
              label="Email уведомления"
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Типы уведомлений
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationTypes.appointmentReminder}
                  onChange={() => handleNotificationTypeToggle('appointmentReminder')}
                  color="primary"
                />
              }
              label="Напоминания о приёмах"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationTypes.statusChange}
                  onChange={() => handleNotificationTypeToggle('statusChange')}
                  color="primary"
                />
              }
              label="Изменения статуса приёма"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationTypes.cancelation}
                  onChange={() => handleNotificationTypeToggle('cancelation')}
                  color="primary"
                />
              }
              label="Отмена приёма"
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Интервалы напоминаний
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {settings.reminderIntervals.map((interval) => (
              <Chip
                key={interval}
                label={`За ${formatInterval(interval)}`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startIcon={<ResetIcon />}
          onClick={resetSettings}
          variant="outlined"
          color="secondary"
        >
          Сбросить настройки
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationSettings;
