import { AppointmentType, AppointmentStatus } from '../../types/medical';

export const APPOINTMENT_DURATION = 30; // длительность приёма в минутах

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  description: string;
}

export type { AppointmentType, AppointmentStatus };

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  status: string;
  orderedDate: Date;
  completedDate?: Date;
  results?: string;
  doctorId: string;
  doctorName: string;
}

export interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  type: string;
  symptoms: string[];
  diagnosis?: string;
  prescription?: string;
  followUpDate?: Date;
}

export interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => Promise<void>;
  appointment?: Appointment;
  mode: 'create' | 'edit';
  selectedDate: Date;
}

export interface AppointmentListProps {
  date: Date;
}

export interface FilterValues {
  search: string;
  status: AppointmentStatus | '';
  type: string | '';
}
