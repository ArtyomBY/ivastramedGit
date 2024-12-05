import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Patient } from '../../types/medical';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onPatientSelect: (patientId: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  onPatientSelect,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onPatientSelect(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Пациент</InputLabel>
      <Select
        value={selectedPatientId || ''}
        label="Пациент"
        onChange={handleChange}
      >
        {patients.map((patient) => (
          <MenuItem key={patient.id} value={patient.id}>
            {patient.lastName} {patient.firstName} {patient.middleName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PatientSelector;
