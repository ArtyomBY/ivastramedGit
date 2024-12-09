import { User, Patient, Doctor, Admin, Registrar } from '../types/auth';

export const isPatient = (user: User | null): user is Patient => {
  return user?.role === 'patient';
};

export const isDoctor = (user: User | null): user is Doctor => {
  return user?.role === 'doctor';
};

export const isAdmin = (user: User | null): user is Admin => {
  return user?.role === 'admin';
};

export const isRegistrar = (user: User | null): user is Registrar => {
  return user?.role === 'registrar';
};
