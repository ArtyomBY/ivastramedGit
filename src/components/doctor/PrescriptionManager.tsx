import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const PrescriptionManager: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, template: 'Антибиотик 500мг 2 раза в день' },
    { id: 2, template: 'Витамин C 1000мг ежедневно' },
  ]);

  const [newTemplate, setNewTemplate] = useState('');
  const [editPrescription, setEditPrescription] = useState<{ id: number; template: string } | null>(null);

  const handleAddTemplate = () => {
    // Логика добавления нового шаблона рецепта
    setPrescriptions([...prescriptions, { id: Date.now(), template: newTemplate }]);
    setNewTemplate('');
  };

  const handleOpenEditDialog = (prescription: { id: number; template: string }) => {
    setEditPrescription(prescription);
  };

  const handleCloseEditDialog = () => {
    setEditPrescription(null);
  };

  const handleSaveEdit = () => {
    if (editPrescription) {
      setPrescriptions(prescriptions.map(prescription => 
        prescription.id === editPrescription.id ? editPrescription : prescription
      ));
      handleCloseEditDialog();
    }
  };

  const handleDeletePrescription = (id: number) => {
    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Управление рецептами</Typography>
        <List>
          {prescriptions.map((prescription) => (
            <ListItem key={prescription.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={prescription.template} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenEditDialog(prescription)}
              >
                <Edit />
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeletePrescription(prescription.id)}
              >
                <Delete />
              </Button>
            </ListItem>
          ))}
        </List>
        <TextField
          label="Новый шаблон рецепта"
          variant="outlined"
          fullWidth
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTemplate}
        >
          Добавить шаблон
        </Button>
      </CardContent>
      <Dialog open={Boolean(editPrescription)} onClose={handleCloseEditDialog}>
        <DialogTitle>Редактировать рецепт</DialogTitle>
        <DialogContent>
          <TextField
            label="Шаблон рецепта"
            variant="outlined"
            fullWidth
            value={editPrescription?.template || ''}
            onChange={(e) => setEditPrescription({ ...editPrescription!, template: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PrescriptionManager;
