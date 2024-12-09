import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../contexts/AuthContext';
import { Patient } from '../../types/auth';
import { isPatient } from '../../utils/typeGuards';
import api from '../../services/api';

interface DiseaseHistory {
  id: number;
  diagnosis: string;
  startDate: string;
  endDate?: string;
  symptoms: string;
  treatment: string;
  status: 'active' | 'resolved' | 'chronic';
  doctorName: string;
}

interface ExaminationResult {
  id: number;
  examinationType: string;
  examinationDate: string;
  result: string;
  doctorName: string;
  attachments?: string;
}

interface MedicalDocument {
  id: number;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  documentPath: string;
}

interface MedicalCardData {
  diseaseHistory: DiseaseHistory[];
  examinationResults: ExaminationResult[];
  documents: MedicalDocument[];
}

interface MedicalCardProps {
  patientData: Patient;
  medicalRecords: MedicalCardData[];
  researchResults: ExaminationResult[];
  documents: MedicalDocument[];
}

const MedicalCard: React.FC<MedicalCardProps> = ({ patientData, medicalRecords, researchResults, documents }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<string | false>('personalInfo');
  const [selectedDocument, setSelectedDocument] = useState<MedicalDocument | null>(null);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);

  useEffect(() => {
    if (isPatient(user)) {
      // fetchMedicalData();
    }
  }, [user]);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDocumentClick = (document: MedicalDocument) => {
    setSelectedDocument(document);
    setIsDocumentDialogOpen(true);
  };

  if (!isPatient(user)) {
    return <Typography>Доступ запрещен</Typography>;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Accordion
        expanded={expanded === 'personalInfo'}
        onChange={handleAccordionChange('personalInfo')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Личные данные</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="ФИО"
                secondary={`${patientData.lastName} ${patientData.firstName} ${patientData.middleName}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Дата рождения" secondary={patientData.birthDate} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Пол" secondary={patientData.gender} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Телефон" secondary={patientData.phone} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Email" secondary={patientData.email} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Паспорт" secondary={patientData.passport} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Полис ОМС" secondary={patientData.oms} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Адрес" secondary={patientData.address} />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'diseaseHistory'}
        onChange={handleAccordionChange('diseaseHistory')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">История болезней</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {medicalRecords[0].diseaseHistory.map((disease) => (
              <ListItem key={disease.id}>
                <ListItemText
                  primary={disease.diagnosis}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Период: {formatDate(disease.startDate)} - {disease.endDate ? formatDate(disease.endDate) : 'по настоящее время'}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Симптомы: {disease.symptoms}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Лечение: {disease.treatment}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Статус: {disease.status}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Врач: {disease.doctorName}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'examinations'}
        onChange={handleAccordionChange('examinations')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Результаты исследований</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {researchResults.map((examination) => (
              <ListItem key={examination.id}>
                <ListItemText
                  primary={examination.examinationType}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Дата: {formatDate(examination.examinationDate)}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Результат: {examination.result}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Врач: {examination.doctorName}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'documents'}
        onChange={handleAccordionChange('documents')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Документы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {documents.map((document) => (
              <ListItem
                key={document.id}
                button
                onClick={() => handleDocumentClick(document)}
              >
                <ListItemText
                  primary={document.documentType}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Номер: {document.documentNumber}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Дата выдачи: {formatDate(document.issueDate)}
                      </Typography>
                      <Typography component="span" variant="body2">
                        Кем выдан: {document.issuingAuthority}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Dialog
        open={isDocumentDialogOpen}
        onClose={() => setIsDocumentDialogOpen(false)}
      >
        <DialogTitle>Просмотр документа</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <>
              <Typography variant="h6">{selectedDocument.documentType}</Typography>
              <Typography>Номер: {selectedDocument.documentNumber}</Typography>
              <Typography>Дата выдачи: {formatDate(selectedDocument.issueDate)}</Typography>
              <Typography>Кем выдан: {selectedDocument.issuingAuthority}</Typography>
              {/* Здесь можно добавить предпросмотр документа */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDocumentDialogOpen(false)}>Закрыть</Button>
          {selectedDocument && (
            <Button
              onClick={() => window.open(selectedDocument.documentPath)}
              color="primary"
            >
              Скачать
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalCard;
