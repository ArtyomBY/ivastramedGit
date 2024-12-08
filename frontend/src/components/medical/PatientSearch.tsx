import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
} from '@mui/material';
import { User } from '../../types/auth';

interface PatientSearchProps {
  onPatientSelect: (patientId: string) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onPatientSelect }) => {
  // В реальном приложении это будет загружаться с сервера
  const patients: User[] = [
    {
      id: '3',
      firstName: 'Мария',
      lastName: 'Иванова',
      email: 'patient@test.com',
      role: 'patient',
    },
    // Добавьте больше пациентов для демонстрации
  ];

  const handlePatientChange = (event: any, value: User | null) => {
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
