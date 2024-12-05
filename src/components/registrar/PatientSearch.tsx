import React, { useState } from 'react';
import { Typography, Card, CardContent, TextField, List, ListItem, ListItemText, Button } from '@mui/material';

const PatientSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([
    { id: 1, name: 'Иван Иванов', medicalRecord: 'ЭМК Иванова' },
    { id: 2, name: 'Мария Петрова', medicalRecord: 'ЭМК Петровой' },
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().includes(searchTerm)
  );

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Поиск пациента</Typography>
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
              <ListItemText primary={`ID: ${patient.id} - ${patient.name}`} secondary={patient.medicalRecord} />
              <Button variant="contained" color="primary">Просмотр ЭМК</Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PatientSearch;
