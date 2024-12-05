import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

interface PatientData {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  passport: string;
  oms: string;
  address: string;
  birthDate: string;
  gender: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  specialization: string;
  diagnosis: string;
  recommendations: string;
}

interface ResearchResult {
  id: string;
  date: string;
  type: string;
  doctor: string;
  result: string;
  files?: string[];
}

interface Document {
  id: string;
  title: string;
  date: string;
  type: string;
  url: string;
}

interface MedicalCardProps {
  patientData: PatientData;
  medicalRecords: MedicalRecord[];
  researchResults: ResearchResult[];
  documents: Document[];
}

const MedicalCard: React.FC<MedicalCardProps> = ({
  patientData,
  medicalRecords,
  researchResults,
  documents,
}) => {
  const [selectedItem, setSelectedItem] = useState<MedicalRecord | ResearchResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState<string>('personal');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  const handleViewDetails = (item: MedicalRecord | ResearchResult) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDownload = (document: Document) => {
    console.log('Downloading:', document);
  };

  const personalDataFields = [
    { label: 'Фамилия', value: patientData.lastName },
    { label: 'Имя', value: patientData.firstName },
    { label: 'Отчество', value: patientData.middleName },
    { label: 'Телефон', value: patientData.phone },
    { label: 'Email', value: patientData.email },
    { label: 'Паспорт', value: patientData.passport },
    { label: 'Полис ОМС', value: patientData.oms },
    { label: 'Адрес', value: patientData.address },
    { label: 'Дата рождения', value: patientData.birthDate },
    { label: 'Пол', value: patientData.gender },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Электронная медицинская карта (ЭМК)
      </Typography>
      
      <Accordion 
        expanded={expanded === 'personal'} 
        onChange={handleAccordionChange('personal')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Личные данные</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {personalDataFields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {field.label}
                  </Typography>
                  <Typography variant="body1">{field.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'history'} 
        onChange={handleAccordionChange('history')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">История болезней</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Специализация</TableCell>
                  <TableCell>Врач</TableCell>
                  <TableCell>Диагноз</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{moment(record.date).format('DD.MM.YYYY')}</TableCell>
                    <TableCell>{record.specialization}</TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(record)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'research'} 
        onChange={handleAccordionChange('research')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Результаты исследований</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Тип исследования</TableCell>
                  <TableCell>Врач</TableCell>
                  <TableCell>Результат</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {researchResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{moment(result.date).format('DD.MM.YYYY')}</TableCell>
                    <TableCell>{result.type}</TableCell>
                    <TableCell>{result.doctor}</TableCell>
                    <TableCell>{result.result}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(result)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'documents'} 
        onChange={handleAccordionChange('documents')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Документы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {documents.map((document) => (
              <Grid item xs={12} sm={6} md={4} key={document.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {document.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {moment(document.date).format('DD.MM.YYYY')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {document.type}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(document)}
                      >
                        <FileDownloadIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {'diagnosis' in (selectedItem || {})
            ? 'Детали приема'
            : 'Результаты исследования'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && 'diagnosis' in selectedItem ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Дата: {moment(selectedItem.date).format('DD.MM.YYYY')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Врач: {selectedItem.doctor}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Специализация: {selectedItem.specialization}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Диагноз: {selectedItem.diagnosis}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Рекомендации: {selectedItem.recommendations}
              </Typography>
            </Box>
          ) : selectedItem ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Дата: {moment(selectedItem.date).format('DD.MM.YYYY')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Тип исследования: {selectedItem.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Врач: {selectedItem.doctor}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Результат: {selectedItem.result}
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalCard;
