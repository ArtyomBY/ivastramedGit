import { 
  Appointment as GlobalAppointment, 
  AppointmentType, 
  AppointmentStatus, 
  CommonStatus 
} from '../../types/medical';

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
  status: CommonStatus;
  notes: string;
  description: string;
  followUpDate?: string;
}

// Утилита для преобразования глобального типа в локальный
export function convertToLocalAppointment(
  globalAppointment: Omit<GlobalAppointment, 'id'>
): Omit<Appointment, 'id'> {
  return {
    patientId: globalAppointment.patientId || '',
    patientName: globalAppointment.patientName || '',
    doctorId: globalAppointment.doctorId,
    doctorName: globalAppointment.doctorName,
    date: globalAppointment.date,
    startTime: globalAppointment.startTime,
    endTime: globalAppointment.endTime,
    type: globalAppointment.type,
    status: globalAppointment.status as CommonStatus,
    notes: globalAppointment.notes || '',
    description: globalAppointment.description || '',
    followUpDate: globalAppointment.followUpDate
  };
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
