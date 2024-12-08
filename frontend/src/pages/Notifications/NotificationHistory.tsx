import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAppointmentNotifications } from '../../contexts/AppointmentNotificationsContext';

const NotificationHistory: React.FC = () => {
  const { notifications, clearAllNotifications } = useAppointmentNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'appointmentReminder':
        return 'Напоминание';
      case 'statusChange':
        return 'Изменение статуса';
      case 'cancelation':
        return 'Отмена';
      default:
        return type;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'appointmentReminder':
        return 'primary';
      case 'statusChange':
        return 'info';
      case 'cancelation':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(notification => 
        typeFilter === 'all' || notification.type === typeFilter
      )
      .filter(notification =>
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => 
        new Date(b.notificationTime).getTime() - new Date(a.notificationTime).getTime()
      );
  }, [notifications, typeFilter, searchQuery]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            История уведомлений
          </Typography>
          <Button
            startIcon={<DeleteIcon />}
            onClick={clearAllNotifications}
            color="error"
            variant="outlined"
          >
            Очистить историю
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="notification-type-filter-label">Тип уведомления</InputLabel>
            <Select
              labelId="notification-type-filter-label"
              value={typeFilter}
              label="Тип уведомления"
              onChange={handleTypeFilterChange}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="appointmentReminder">Напоминания</MenuItem>
              <MenuItem value="statusChange">Изменения статуса</MenuItem>
              <MenuItem value="cancelation">Отмены</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <List>
          {filteredNotifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="Нет уведомлений"
                secondary="В выбранном периоде нет уведомлений, соответствующих заданным критериям"
              />
            </ListItem>
          ) : (
            filteredNotifications.map((notification) => (
              <ListItem
                key={notification.id}
                divider
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        component="span"
                        variant="body1"
                        color={notification.read ? 'text.primary' : 'primary'}
                      >
                        {notification.message}
                      </Typography>
                      <Chip
                        label={getNotificationTypeLabel(notification.type)}
                        size="small"
                        color={getNotificationTypeColor(notification.type) as any}
                      />
                    </Box>
                  }
                  secondary={format(
                    new Date(notification.notificationTime),
                    'dd MMMM yyyy, HH:mm',
                    { locale: ru }
                  )}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default NotificationHistory;
