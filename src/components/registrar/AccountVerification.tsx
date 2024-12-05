import React, { useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const AccountVerification: React.FC = () => {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Иван Иванов', verified: false, documents: {} },
    { id: 2, name: 'Мария Петрова', verified: true, documents: { passport: '1234 567890' } },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().includes(searchTerm)
  );

  const handleVerifyAccount = (id: number) => {
    setPatients(patients.map(patient => patient.id === id ? { ...patient, verified: true } : patient));
    setOpenDialog(false);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Верификация аккаунта</Typography>
        <TextField
          label="Введите имя или ID пациента"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List>
          {filteredPatients.map((patient) => (
            <ListItem key={patient.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={`ID: ${patient.id} - ${patient.name}`} secondary={patient.verified ? 'Верифицирован' : 'Не верифицирован'} />
              <Button variant="contained" color="primary" onClick={() => { setSelectedPatient(patient); setOpenDialog(true); }}>
                {patient.verified ? 'Просмотр' : 'Верифицировать'}
              </Button>
            </ListItem>
          ))}
        </List>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Верификация аккаунта</DialogTitle>
          <DialogContent>
            {selectedPatient && !selectedPatient.verified && (
              <TextField
                label="Паспорт"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setSelectedPatient({ ...selectedPatient, documents: { passport: e.target.value } })}
              />
            )}
            {selectedPatient && selectedPatient.verified && (
              <Typography>Документы: {selectedPatient.documents.passport}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Отмена
            </Button>
            {!selectedPatient?.verified && (
              <Button onClick={() => handleVerifyAccount(selectedPatient.id)} color="primary">
                Верифицировать
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AccountVerification;
