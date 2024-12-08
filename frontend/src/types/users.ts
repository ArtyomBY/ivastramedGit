export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  category?: string;
  experience?: number;
  education?: string;
  schedule?: {
    workDays: string[];
    workHours: {
      start: string;
      end: string;
    };
  };
}

export interface Patient extends User {
  role: 'patient';
  birthDate: Date;
  gender: 'Мужской' | 'Женский';
  phone: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface Receptionist extends User {
  role: 'receptionist';
  department?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions?: string[];
}
