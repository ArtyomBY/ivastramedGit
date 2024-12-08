import React from 'react';
import { usePatients } from '../../contexts/PatientsContext';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

interface Patient {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
}

const MedicalRecord: React.FC = () => {
  const { patients } = usePatients();
  const patient = patients.find(p => p.id === '1'); // Example patient ID

  return (
    <Card style={{ maxWidth: 600, margin: '20px auto', padding: '20px' }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          Medical Record
        </Typography>
        {!patient ? (
          <CircularProgress />
        ) : (
          <div>
            <Typography variant="body1" component="p">
              <strong>Name:</strong> {patient.firstName} {patient.middleName} {patient.lastName}
            </Typography>
            <Typography variant="body1" component="p">
              <strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toDateString()}
            </Typography>
            <Typography variant="body1" component="p">
              <strong>Gender:</strong> {patient.gender}
            </Typography>
            <Typography variant="body1" component="p">
              <strong>Phone:</strong> {patient.phone}
            </Typography>
            <Typography variant="body1" component="p">
              <strong>Email:</strong> {patient.email}
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalRecord;
