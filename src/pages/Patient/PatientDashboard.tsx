import React, { useState } from 'react';
import { Container, Grid, Typography, Box, Paper } from '@mui/material';
import MedicalCard from '../../components/patient/MedicalCard';
import AppointmentCalendar from '../../components/patient/AppointmentCalendar';
import AppointmentBooking from '../../components/patient/AppointmentBooking';
import ChatContainer from '../../components/chat/ChatContainer';
import NavigationBar from '../../components/NavigationBar';
import PatientNavigation from '../../components/patient/PatientNavigation';

// Моковые данные
const mockPatientData = {
  firstName: 'Иван',
  lastName: 'Иванов',
  middleName: 'Иванович',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  passport: '4444 555666',
  oms: '1234567890123456',
  address: 'г. Москва, ул. Примерная, д. 1, кв. 1',
  birthDate: '01.01.1990',
  gender: 'Мужской',
};

const mockMedicalRecords = [
  {
    id: '1',
    date: '2023-06-15',
    doctor: 'Петров П.П.',
    specialization: 'Терапевт',
    diagnosis: 'ОРВИ',
    recommendations: 'Постельный режим, обильное питье',
  },
];

const mockResearchResults = [
  {
    id: '1',
    date: '2023-06-10',
    type: 'Общий анализ крови',
    doctor: 'Сидорова А.А.',
    result: 'В пределах нормы',
    files: ['blood_test_results.pdf'],
  },
];

const mockDocuments = [
  {
    id: '1',
    title: 'Справка для бассейна',
    date: '2023-06-01',
    type: 'Справка',
    url: '/documents/pool_certificate.pdf',
  },
];

const mockAppointments = [
  {
    id: '1',
    specialization: 'Терапевт',
    doctor: 'Петров П.П.',
    date: '2023-07-20',
    time: '10:00',
  },
];

// Моковые данные для чата
const mockDoctors = [
  {
    id: '1',
    firstName: 'Петр',
    lastName: 'Петров',
    middleName: 'Петрович',
    specialization: 'Терапевт',
    lastVisit: '2023-06-15',
    unreadMessages: 2,
  },
  {
    id: '2',
    firstName: 'Анна',
    lastName: 'Сидорова',
    middleName: 'Александровна',
    specialization: 'Кардиолог',
    lastVisit: '2023-06-10',
    unreadMessages: 0,
  },
];

const mockMessages = {
  '1': [
    {
      id: '1',
      senderId: '1',
      text: 'Здравствуйте! Как вы себя чувствуете после последнего приема?',
      timestamp: '2023-06-16T10:00:00',
    },
    {
      id: '2',
      senderId: 'current_user',
      text: 'Здравствуйте! Намного лучше, спасибо. Температура спала.',
      timestamp: '2023-06-16T10:05:00',
    },
  ],
  '2': [
    {
      id: '3',
      senderId: '2',
      text: 'Добрый день! Напоминаю о необходимости сдать анализы.',
      timestamp: '2023-06-11T15:30:00',
    },
  ],
};

const PatientDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState('medical-card');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDeleteAppointment = (appointment: any) => {
    console.log('Deleting appointment:', appointment);
  };

  const handleSendMessage = (doctorId: string, text: string, attachments?: File[]) => {
    console.log('Sending message to doctor:', doctorId, text, attachments);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'medical-card':
        return (
          <MedicalCard
            patientData={mockPatientData}
            medicalRecords={mockMedicalRecords}
            researchResults={mockResearchResults}
            documents={mockDocuments}
          />
        );
      case 'appointments':
        return (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Календарь записей
              </Typography>
              <AppointmentCalendar
                appointments={mockAppointments}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onDeleteAppointment={handleDeleteAppointment}
              />
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Запись на приём
              </Typography>
              <AppointmentBooking />
            </Paper>
          </>
        );
      case 'chat':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Чат с врачом
            </Typography>
            <ChatContainer
              currentUserId="current_user"
              doctors={mockDoctors}
              messages={mockMessages}
              onSendMessage={handleSendMessage}
            />
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Личный кабинет
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <PatientNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              {renderSection()}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default PatientDashboard;
