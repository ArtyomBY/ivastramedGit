import React, { useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Напоминание о визите', description: 'Пациент Иван Иванов записан на прием 20.10.2023 в 10:00' },
    { id: 2, title: 'Изменение расписания', description: 'Врач Доктор Смирнов изменил расписание на 21.10.2023' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: '', description: '' });

  const handleAddNotification = () => {
    setNotifications([...notifications, { id: Date.now(), ...newNotification }]);
    setNewNotification({ title: '', description: '' });
    setOpenDialog(false);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Центр уведомлений</Typography>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={notification.title} secondary={notification.description} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Добавить уведомление
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Добавить уведомление</DialogTitle>
          <DialogContent>
            <TextField
              label="Заголовок"
              variant="outlined"
              fullWidth
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Описание"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newNotification.description}
              onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Отмена
            </Button>
            <Button onClick={handleAddNotification} color="primary">
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
