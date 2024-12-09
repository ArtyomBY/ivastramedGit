export type UserRole = 'doctor' | 'patient' | 'admin' | 'registrar';

// Базовый интерфейс для всех пользователей
interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: UserRole;
  phone: string;
  verified?: boolean;
  avatarUrl?: string;
}

// Интерфейс для пациента
export interface Patient extends BaseUser {
  role: 'patient';
  passport: string;
  oms: string;
  address: string;
  birthDate: string;
  gender: string;
  medicalRecordNumber?: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// Интерфейс для врача
export interface Doctor extends BaseUser {
  role: 'doctor';
  specialization: string;
  education?: string;
  experience?: string;
  schedule?: string;
}

// Интерфейс для администратора
export interface Admin extends BaseUser {
  role: 'admin';
}

// Интерфейс для регистратора
export interface Registrar extends BaseUser {
  role: 'registrar';
}

// Объединенный тип для всех пользователей
export type User = Patient | Doctor | Admin | Registrar;

// Расширенный интерфейс для хранения пользователя с паролем
export interface UserWithPassword extends BaseUser {
  password: string;
}

export type NotificationType = 
  | 'appointmentReminder'
  | 'appointmentChange'
  | 'labResults'
  | 'scheduleChange'
  | 'systemNotification';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
  relatedEntityId?: string;
}

export interface ScheduleAccessLevel {
  view: boolean;
  editOwn: boolean;
  editOthers: boolean;
  makeAppointments: boolean;
}

export const roleAccessLevels: Record<UserRole, ScheduleAccessLevel> = {
  doctor: {
    view: true,
    editOwn: true,
    editOthers: false,
    makeAppointments: true,
  },
  patient: {
    view: true,
    editOwn: false,
    editOthers: false,
    makeAppointments: true,
  },
  admin: {
    view: true,
    editOwn: true,
    editOthers: true,
    makeAppointments: true,
  },
  registrar: {
    view: true,
    editOwn: false,
    editOthers: true,
    makeAppointments: true,
  },
};
