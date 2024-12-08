export type UserRole = 'doctor' | 'patient' | 'admin' | 'registrar';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: UserRole;
  specialization?: string;
  phone?: string;
  passport?: string;
  oms?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  verified?: boolean;
  avatarUrl?: string;
}

// Расширенный интерфейс для хранения пользователя с паролем
export interface UserWithPassword extends User {
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
  admin: {
    view: true,
    editOwn: true,
    editOthers: true,
    makeAppointments: true,
  },
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
  registrar: {
    view: true,
    editOwn: false,
    editOthers: false,
    makeAppointments: true,
  },
};
