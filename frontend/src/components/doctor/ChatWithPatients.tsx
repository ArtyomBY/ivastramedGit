import React, { useState } from 'react';
import { Typography, Card, CardContent, TextField, Button, List, ListItem, ListItemText, ListItemButton, Avatar, Grid } from '@mui/material';

const ChatWithPatients: React.FC = () => {
  const [patients] = useState([
    { id: 1, name: 'Иван Иванов Иванович', avatar: '/path/to/avatar1.jpg' },
    { id: 2, name: 'Мария Петрова Петровна', avatar: '/path/to/avatar2.jpg' },
  ]);

  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Пациент', text: 'Здравствуйте, доктор!', patientId: 1 },
    { id: 2, sender: 'Доктор', text: 'Здравствуйте! Как я могу помочь?', patientId: 1 },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (selectedPatient !== null) {
      setMessages([...messages, { id: Date.now(), sender: 'Доктор', text: newMessage, patientId: selectedPatient }]);
      setNewMessage('');
    }
  };

  const handleSelectPatient = (id: number) => {
    setSelectedPatient(id);
  };

  const filteredMessages = messages.filter(message => message.patientId === selectedPatient);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Чат с пациентами</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <List>
              {patients.map((patient) => (
                <ListItemButton key={patient.id} onClick={() => handleSelectPatient(patient.id)}>
                  <Avatar src={patient.avatar} sx={{ mr: 2 }} />
                  <ListItemText primary={patient.name} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={8}>
            {selectedPatient !== null ? (
              <>
                <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                  {filteredMessages.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText primary={`${message.sender}: ${message.text}`} />
                    </ListItem>
                  ))}
                </List>
                <TextField
                  label="Ваше сообщение"
                  variant="outlined"
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  sx={{ mr: 2 }}
                >
                  Отправить
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                >
                  Отправить файл
                </Button>
              </>
            ) : (
              <Typography variant="body1">Выберите пациента для начала чата</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ChatWithPatients;
