import React, { useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'Иван Иванов', date: '2023-10-20', time: '10:00', doctor: 'Доктор Смирнов' },
    { id: 2, patientName: 'Мария Петрова', date: '2023-10-21', time: '14:00', doctor: 'Доктор Иванова' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patientName: '', date: '', time: '', doctor: '' });

  const handleAddAppointment = () => {
    setAppointments([...appointments, { id: Date.now(), ...newAppointment }]);
    setNewAppointment({ patientName: '', date: '', time: '', doctor: '' });
    setOpenDialog(false);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Управление записями</Typography>
        <List>
          {appointments.map((appointment) => (
            <ListItem key={appointment.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={`${appointment.patientName} - ${appointment.date} ${appointment.time}`} secondary={`Врач: ${appointment.doctor}`} />
              <Button variant="contained" color="primary">Редактировать</Button>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Добавить запись
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Добавить запись</DialogTitle>
          <DialogContent>
            <TextField
              label="Имя пациента"
              variant="outlined"
              fullWidth
              value={newAppointment.patientName}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Дата"
              type="date"
              variant="outlined"
              fullWidth
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Время"
              type="time"
              variant="outlined"
              fullWidth
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Врач"
              variant="outlined"
              fullWidth
              value={newAppointment.doctor}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Отмена
            </Button>
            <Button onClick={handleAddAppointment} color="primary">
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AppointmentManagement;
