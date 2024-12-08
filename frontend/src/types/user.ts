export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: UserRole;
  specialization?: string;
  category?: string;
}
