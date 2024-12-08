import React, { createContext, useContext, useState } from 'react';
import { Doctor } from '../types/users';

interface DoctorsContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (doctorId: string) => void;
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

export const DoctorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan.petrov@example.com',
      role: 'doctor',
      specialization: 'Терапевт',
      category: 'Высшая категория',
    },
    {
      id: '2',
      firstName: 'Анна',
      lastName: 'Сидорова',
      email: 'anna.sidorova@example.com',
      role: 'doctor',
      specialization: 'Кардиолог',
      category: 'Первая категория',
    },
  ]);

  const addDoctor = (doctor: Doctor) => {
    setDoctors([...doctors, doctor]);
  };

  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(doctor => 
      doctor.id === updatedDoctor.id ? updatedDoctor : doctor
    ));
  };

  const deleteDoctor = (doctorId: string) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
  };

  return (
    <DoctorsContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor }}>
      {children}
    </DoctorsContext.Provider>
  );
};

export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (context === undefined) {
    throw new Error('useDoctors must be used within a DoctorsProvider');
  }
  return context;
};
