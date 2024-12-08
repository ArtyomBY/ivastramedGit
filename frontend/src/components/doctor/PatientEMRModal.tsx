import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Tabs, Tab, TextField, List, ListItem, ListItemText } from '@mui/material';

interface PatientEMRModalProps {
  open: boolean;
  onClose: () => void;
  patientId: number;
}

const PatientEMRModal: React.FC<PatientEMRModalProps> = ({ open, onClose, patientId }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const testVisits = [
    { id: 1, date: '2023-10-01', description: 'Консультация терапевта' },
    { id: 2, date: '2023-10-15', description: 'Плановый осмотр' },
  ];

  const testResearchResults = [
    { id: 1, date: '2023-09-20', description: 'Анализ крови - в норме' },
    { id: 2, date: '2023-09-25', description: 'УЗИ брюшной полости - без патологий' },
  ];

  const testDocuments = [
    { id: 1, title: 'Справка о здоровье', date: '2023-08-10' },
    { id: 2, title: 'Рецепт на лекарства', date: '2023-08-15' },
  ];

  const handleAddRecord = (type: string) => {
    console.log(`Добавление новой записи в раздел: ${type}`);
  };

  const handleEditRecord = (id: number, type: string) => {
    console.log(`Редактирование записи с ID: ${id} в разделе: ${type}`);
  };

  const handleDeleteRecord = (id: number, type: string) => {
    console.log(`Удаление записи с ID: ${id} в разделе: ${type}`);
  };

  const handleOpenRecord = (id: number, type: string) => {
    console.log(`Открытие записи с ID: ${id} в разделе: ${type}`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 800, bgcolor: 'background.paper', p: 4, mx: 'auto', mt: '10%' }}>
        <Typography variant="h6" gutterBottom>
          Электронная медицинская карта пациента [ID: {patientId}]
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="EMR Tabs">
          <Tab label="Основная информация" />
          <Tab label="История посещений" />
          <Tab label="Результаты исследований" />
          <Tab label="Документы" />
        </Tabs>
        {activeTab === 0 && (
          <Box>
            <Typography variant="body1">Основная информация</Typography>
            {/* Добавить логику для отображения основной информации о пациенте */}
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            <Typography variant="body1">История посещений</Typography>
            <Button variant="contained" color="primary" onClick={() => handleAddRecord('История посещений')} sx={{ mb: 2 }}>
              Добавить новую запись
            </Button>
            <List>
              {testVisits.map((visit) => (
                <ListItem key={visit.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={visit.date} secondary={visit.description} />
                  <Button variant="outlined" color="success" onClick={() => handleOpenRecord(visit.id, 'История посещений')} sx={{ mr: 1 }}>
                    Открыть
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => handleEditRecord(visit.id, 'История посещений')} sx={{ mr: 1 }}>
                    Редактировать
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteRecord(visit.id, 'История посещений')}>
                    Удалить
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <Typography variant="body1">Результаты исследований</Typography>
            <Button variant="contained" color="primary" onClick={() => handleAddRecord('Результаты исследований')} sx={{ mb: 2 }}>
              Добавить новую запись
            </Button>
            <List>
              {testResearchResults.map((result) => (
                <ListItem key={result.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={result.date} secondary={result.description} />
                  <Button variant="outlined" color="success" onClick={() => handleOpenRecord(result.id, 'Результаты исследований')} sx={{ mr: 1 }}>
                    Открыть
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => handleEditRecord(result.id, 'Результаты исследований')} sx={{ mr: 1 }}>
                    Редактировать
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteRecord(result.id, 'Результаты исследований')}>
                    Удалить
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {activeTab === 3 && (
          <Box>
            <Typography variant="body1">Документы</Typography>
            <Button variant="contained" color="primary" onClick={() => handleAddRecord('Документы')} sx={{ mb: 2 }}>
              Добавить новый документ
            </Button>
            <List>
              {testDocuments.map((doc) => (
                <ListItem key={doc.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={doc.title} secondary={doc.date} />
                  <Button variant="outlined" color="success" onClick={() => handleOpenRecord(doc.id, 'Документы')} sx={{ mr: 1 }}>
                    Открыть
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => handleEditRecord(doc.id, 'Документы')} sx={{ mr: 1 }}>
                    Редактировать
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteRecord(doc.id, 'Документы')}>
                    Удалить
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Button variant="contained" color="secondary" onClick={onClose} sx={{ mt: 2 }}>
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};

export default PatientEMRModal;
