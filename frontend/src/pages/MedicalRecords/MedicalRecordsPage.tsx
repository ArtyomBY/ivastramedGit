import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMedical } from '../../contexts/MedicalContext';
import LabTestList from '../../components/medical/LabTestList';
import VisitList from '../../components/medical/VisitList';
import AppointmentDialog from '../../components/appointments/AppointmentDialog';
import LabTestDialog from '../../components/medical/LabTestDialog';
import PatientSelector from '../../components/patients/PatientSelector';
import { Visit, LabTest, Appointment, VisitType, VisitStatus } from '../../types/medical';
import { User } from '../../types/auth';
import { Patient } from '../../types/auth';
import { isPatient } from '../../utils/typeGuards';
import { format, addMinutes } from 'date-fns';

const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    patients,
    visits,
    labTests,
    addVisit,
    addLabTest,
    deleteVisit,
    deleteLabTest,
  } = useMedical();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<Patient | null>(null);
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [isLabTestDialogOpen, setIsLabTestDialogOpen] = useState(false);

  useEffect(() => {
    if (isPatient(user)) {
      setSelectedPatientProfile(user);
    }
  }, [user]);

  const filteredVisits = visits.filter(
    (visit) => visit.patientId === selectedPatientId
  );

  const filteredLabTests = labTests.filter(
    (test) => test.patientId === selectedPatientId
  );

  const handleAddVisit = (visitData: Partial<Visit | Appointment>) => {
    const visit = visitData as Partial<Visit>;
    if (visit.type && visit.status && user && selectedPatientId) {
      const newVisit: Visit = {
        id: String(Date.now()),
        patientId: selectedPatientId,
        patientName: selectedPatientProfile?.firstName || '',
        doctorId: user.id,
        doctorName: `${user.firstName} ${user.lastName}`,
        date: visit.date || format(new Date(), 'yyyy-MM-dd'),
        startTime: visit.startTime || format(new Date(), 'HH:mm'),
        endTime: visit.endTime || format(addMinutes(new Date(), 30), 'HH:mm'),
        type: visit.type as VisitType,
        status: visit.status as VisitStatus,
        notes: visit.notes || '',
        description: visit.description || '',
        diagnosis: visit.diagnosis || [],
        treatment: visit.treatment || '',
      };
      addVisit(newVisit);
      setIsVisitDialogOpen(false);
    }
  };

  const handleAddLabTest = (labTestData: Partial<LabTest>) => {
    if (user?.id && selectedPatientId) {
      addLabTest({
        ...labTestData,
        patientId: selectedPatientId,
        doctorId: user.id,
      } as LabTest);
    }
    setIsLabTestDialogOpen(false);
  };

  const handleDeleteVisit = (id: string) => {
    deleteVisit(id);
  };

  const handleDeleteLabTest = (id: string) => {
    deleteLabTest(id);
  };

  const handleVisitDialogOpen = () => {
    setIsVisitDialogOpen(true);
  };

  const handleLabTestDialogOpen = () => {
    setIsLabTestDialogOpen(true);
  };

  if (!user) {
    return (
      <Container>
        <Typography>Пожалуйста, войдите в систему</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Профиль пациента</Typography>
            {selectedPatientProfile && (
              <Box>
                <Typography>ID: {selectedPatientProfile.id}</Typography>
                <Typography>Email: {selectedPatientProfile.email}</Typography>
                <Typography>Имя: {selectedPatientProfile.firstName}</Typography>
                <Typography>Фамилия: {selectedPatientProfile.lastName}</Typography>
                <Typography>Телефон: {selectedPatientProfile.phone}</Typography>
                <Typography>Паспорт: {selectedPatientProfile.passport}</Typography>
                <Typography>Полис ОМС: {selectedPatientProfile.oms}</Typography>
                <Typography>Адрес: {selectedPatientProfile.address}</Typography>
                <Typography>Дата рождения: {selectedPatientProfile.birthDate}</Typography>
                <Typography>Пол: {selectedPatientProfile.gender}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <PatientSelector
              patients={patients}
              selectedPatientId={selectedPatientId}
              onPatientSelect={setSelectedPatientId}
            />
          </Box>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Визиты</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVisitDialogOpen}
            disabled={!selectedPatientId}
          >
            Добавить визит
          </Button>
        </Box>
        <VisitList 
          visits={filteredVisits} 
          onDelete={(id) => handleDeleteVisit(id)} 
        />
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Анализы и обследования</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLabTestDialogOpen}
            disabled={!selectedPatientId}
          >
            Назначить анализ
          </Button>
        </Box>
        <LabTestList 
          labTests={filteredLabTests} 
          onDelete={(id) => handleDeleteLabTest(id)} 
        />
      </Paper>

      {selectedPatientId && user?.id && (
        <>
          <AppointmentDialog
            open={isVisitDialogOpen}
            onClose={() => setIsVisitDialogOpen(false)}
            onSave={handleAddVisit}
            patientId={selectedPatientId}
            doctorId={user.id}
            mode="visit"
          />
          <LabTestDialog
            open={isLabTestDialogOpen}
            onClose={() => setIsLabTestDialogOpen(false)}
            onSave={handleAddLabTest}
            patientId={selectedPatientId}
            doctorId={user.id}
          />
        </>
      )}
    </Container>
  );
};

export default MedicalRecordsPage;
