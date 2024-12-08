import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const NotificationsPanel: React.FC = () => {
  const [templates, setTemplates] = useState([
    { id: 1, title: 'Напоминание', description: 'Напоминание о приеме' },
    { id: 2, title: 'Рекомендация', description: 'Рекомендация по лечению' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Напоминание', patientId: 1, description: 'Напоминание о приеме 20.10.2023' },
    { id: 2, title: 'Рекомендация', patientId: 2, description: 'Рекомендация по лечению' },
  ]);

  const [newNotification, setNewNotification] = useState<{ title: string; patientId: number; description: string }>({ title: '', patientId: 0, description: '' });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [editNotification, setEditNotification] = useState<{ id: number; title: string; patientId: number; description: string } | null>(null);

  const handleOpenEditDialog = (notification: { id: number; title: string; patientId: number; description: string }) => {
    setEditNotification(notification);
  };

  const handleCloseEditDialog = () => {
    setEditNotification(null);
  };

  const handleSaveEdit = () => {
    if (editNotification) {
      setNotifications(notifications.map(notification => 
        notification.id === editNotification.id ? editNotification : notification
      ));
      handleCloseEditDialog();
    }
  };

  const handleAddNotification = () => {
    setNotifications([...notifications, { id: Date.now(), ...newNotification }]);
    setNewNotification({ title: '', patientId: 0, description: '' });
  };

  const handleCreateTemplate = () => {
    setTemplates([...templates, { id: Date.now(), title: newNotification.title, description: newNotification.description }]);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Уведомления</Typography>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={`${notification.title} [ID: ${notification.patientId}]: ${notification.description}`} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenEditDialog(notification)}
              >
                <Edit />
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <Delete />
              </Button>
            </ListItem>
          ))}
        </List>
        <TextField
          label="Название уведомления"
          variant="outlined"
          fullWidth
          value={newNotification.title}
          onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="ID пациента"
          variant="outlined"
          fullWidth
          value={newNotification.patientId}
          onChange={(e) => setNewNotification({ ...newNotification, patientId: Number(e.target.value) })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Описание уведомления"
          variant="outlined"
          fullWidth
          value={newNotification.description}
          onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value as string)}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>Выберите шаблон</MenuItem>
          {templates.map((template) => (
            <MenuItem key={template.id} value={template.title}>{template.title}</MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNotification}
          sx={{ mb: 2, mr: 2 }}
        >
          Добавить уведомление
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCreateTemplate}
        >
          Создать шаблон
        </Button>
      </CardContent>
      <Dialog open={Boolean(editNotification)} onClose={handleCloseEditDialog}>
        <DialogTitle>Редактировать уведомление</DialogTitle>
        <DialogContent>
          <TextField
            label="Название уведомления"
            variant="outlined"
            fullWidth
            value={editNotification?.title || ''}
            onChange={(e) => setEditNotification({ ...editNotification!, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="ID пациента"
            variant="outlined"
            fullWidth
            value={editNotification?.patientId || 0}
            onChange={(e) => setEditNotification({ ...editNotification!, patientId: Number(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Описание уведомления"
            variant="outlined"
            fullWidth
            value={editNotification?.description || ''}
            onChange={(e) => setEditNotification({ ...editNotification!, description: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default NotificationsPanel;
