import React, { createContext, useContext, useState, useCallback } from 'react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  phone?: string;
  email?: string;
}

interface PatientsContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      firstName: 'Анна',
      lastName: 'Иванова',
      middleName: 'Сергеевна',
      dateOfBirth: new Date(1990, 5, 15),
      gender: 'female',
      phone: '+7 (999) 123-45-67',
      email: 'anna@example.com',
    },
    {
      id: '2',
      firstName: 'Сергей',
      lastName: 'Смирнов',
      middleName: 'Александрович',
      dateOfBirth: new Date(1985, 8, 23),
      gender: 'male',
      phone: '+7 (999) 987-65-43',
      email: 'sergey@example.com',
    },
  ]);

  const addPatient = useCallback((patient: Omit<Patient, 'id'>) => {
    const newPatient = {
      ...patient,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPatients(prev => [...prev, newPatient]);
  }, []);

  const updatePatient = useCallback((id: string, patient: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...patient } : p))
    );
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <PatientsContext.Provider value={{ patients, addPatient, updatePatient, deletePatient }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};
