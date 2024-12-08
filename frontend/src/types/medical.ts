export type TestStatus = 'Назначен' | 'В работе' | 'Выполнен' | 'Отменён';
export type VisitStatus = 'Назначен' | 'В процессе' | 'Завершен' | 'Отменен';
export type RecordStatus = 'Активный' | 'Завершен' | 'Отменен';
export type TestType = 'Анализ крови' | 'Анализ мочи' | 'УЗИ' | 'Рентген' | 'МРТ' | 'КТ' | 'ЭКГ' | 'Другое';
export type LabTestStatus = 'Назначен' | 'В процессе' | 'Завершен' | 'Отменен';

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  diagnosis: string[];
  treatment: string;
  notes?: string;
  description?: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  doctorId: string;
  name: string;
  description: string;
  status: LabTestStatus;
  orderedDate: Date;
  completedDate?: Date;
  results?: string;
  notes?: string;
}

export type AppointmentType = 
  | 'Первичный приём' 
  | 'Повторный приём' 
  | 'Экстренный приём' 
  | 'Процедура' 
  | 'Осмотр' 
  | 'Консультация' 
  | 'Диагностика';

export type VisitType = 
  | 'Осмотр' 
  | 'Процедура' 
  | 'Консультация' 
  | 'Диагностика';

export type CommonStatus = 
  | 'Запланирован' 
  | 'Подтвержден' 
  | 'Отменен' 
  | 'Завершен' 
  | 'Назначен' 
  | 'В процессе';

export type AppointmentStatus = CommonStatus;

export interface AppointmentFormData {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  diagnosis?: string[];
  treatment?: string;
  notes?: string;
  description?: string;
  followUpDate?: string;
}

export interface BaseAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  followUpDate?: string;
}

export interface Appointment extends BaseAppointment {
  type: AppointmentType;
  status: AppointmentStatus;
  diagnosis?: string[];
  treatment?: string;
  notes?: string;
  description?: string;
}

export interface Visit extends BaseAppointment {
  type: VisitType;
  status: CommonStatus;
  diagnosis?: string[];
  treatment?: string;
  notes?: string;
  description?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  specialization: string;
  phone?: string;
  email: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  code: string;
  name: string;
  description?: string;
  date: Date;
  doctorId: string;
  status: RecordStatus;
}

export interface MedicalFile {
  id: string;
  patientId: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
  size: number;
  doctorId: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  date: Date;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  date: Date;
  notes?: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  records: MedicalRecord[];
  labTests: LabTest[];
  visits: Visit[];
  diagnoses: Diagnosis[];
  vitalSigns: VitalSigns[];
  files: MedicalFile[];
  prescriptions: Prescription[];
}
