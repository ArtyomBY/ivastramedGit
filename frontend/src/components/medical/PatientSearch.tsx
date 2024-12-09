import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
} from '@mui/material';
import { Patient } from '../../types/auth';

interface PatientSearchProps {
  onPatientSelect: (patientId: string) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onPatientSelect }) => {
  // В реальном приложении это будет загружаться с сервера
  const patients: Patient[] = [
    {
      id: '3',
      firstName: 'Мария',
      lastName: 'Иванова',
      middleName: 'Петровна',
      email: 'patient@test.com',
      role: 'patient',
      phone: '+7 (999) 123-45-67',
      passport: '1234 567890',
      oms: '1234567890123456',
      address: 'г. Москва, ул. Примерная, д. 1',
      birthDate: '1990-01-01',
      gender: 'female'
    },
    // Добавьте больше пациентов для демонстрации
  ];

  const handlePatientChange = (event: any, value: Patient | null) => {
    if (value) {
      onPatientSelect(value.id);
    }
  };

  return (
    <Autocomplete
      options={patients}
      getOptionLabel={(option) => `${option.lastName} ${option.firstName}`}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Поиск пациента"
          variant="outlined"
          fullWidth
        />
      )}
      onChange={handlePatientChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};

export default PatientSearch;
