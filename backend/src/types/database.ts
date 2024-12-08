import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    password_hash: string;
    role: string;
    is_active: boolean;
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone?: string;
}

export interface DoctorRow extends RowDataPacket {
    id: number;
    user_id: number;
    specialization_id: number;
    license_number: string;
    education: string;
    experience_years: number;
    office_number: string;
    consultation_fee: number;
    is_accepting_patients: boolean;
}

export interface PatientRow extends RowDataPacket {
    id: number;
    user_id: number;
    medical_record_number: string;
    blood_type?: string;
    allergies?: string;
    chronic_diseases?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
}

export interface AppointmentRow extends RowDataPacket {
    id: number;
    patient_id: number;
    doctor_id: number;
    time_slot_id: number;
    appointment_type: string;
    status: string;
    reason_for_visit?: string;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    created_at: Date;
    created_by: number;
}

export interface TimeSlotRow extends RowDataPacket {
    id: number;
    doctor_id: number;
    date: Date;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

export interface ChatRow extends RowDataPacket {
    id: number;
    user1_id: number;
    user2_id: number;
    created_at: Date;
    last_message_at: Date;
}

export interface MessageRow extends RowDataPacket {
    id: number;
    chat_id: number;
    sender_id: number;
    content: string;
    sent_at: Date;
    read_at?: Date;
}

export interface NotificationRow extends RowDataPacket {
    id: number;
    user_id: number;
    type: string;
    title: string;
    message: string;
    related_entity_type?: string;
    related_entity_id?: number;
    created_at: Date;
    read_at?: Date;
}

export interface SpecializationRow extends RowDataPacket {
    id: number;
    name: string;
    description?: string;
    default_appointment_duration: number;
}
