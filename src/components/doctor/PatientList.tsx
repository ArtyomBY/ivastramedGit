import React, { useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import PatientEMRModal from './PatientEMRModal';

const PatientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([
    { id: 1, name: 'Иван Иванов', medicalRecord: 'История болезни 1' },
    { id: 2, name: 'Мария Петрова', medicalRecord: 'История болезни 2' },
    // Добавьте больше пациентов по мере необходимости
  ]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().includes(searchTerm)
  );

  const handleViewMedicalRecord = (id: number) => {
    setSelectedPatientId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Список пациентов</Typography>
        <TextField
          label="Поиск пациента"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List>
          {filteredPatients.map((patient) => (
            <ListItem key={patient.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={`${patient.name} [ID: ${patient.id}]`} secondary={patient.medicalRecord} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleViewMedicalRecord(patient.id)}
              >
                Просмотр ЭМК
              </Button>
            </ListItem>
          ))}
        </List>
        {selectedPatientId !== null && (
          <PatientEMRModal
            open={isModalOpen}
            onClose={handleCloseModal}
            patientId={selectedPatientId}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PatientList;
