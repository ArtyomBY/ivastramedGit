import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  TextFieldProps,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { MedicalRecord } from '../../types/medical';
import { DatePickerFieldProps } from '../../types/shared';

interface MedicalRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: Partial<MedicalRecord>) => void;
  initialData?: Partial<MedicalRecord>;
}

const MedicalRecordDialog: React.FC<MedicalRecordDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    date: new Date(),
    diagnosis: [],
    treatment: '',
    notes: '',
    ...initialData,
  });

  const handleInputChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData?.id ? 'Редактировать запись' : 'Новая запись'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DatePicker
                slots={{
                  textField: (params: TextFieldProps) => <TextField {...params} fullWidth variant="outlined" label="Дата записи" />
                }}
                value={formData.date}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="diagnosis"
              label="Диагноз"
              multiline
              rows={2}
              fullWidth
              value={formData.diagnosis?.join('\n') || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  diagnosis: e.target.value.split('\n').filter(Boolean),
                }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="treatment"
              label="Лечение"
              multiline
              rows={2}
              fullWidth
              value={formData.treatment || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Примечания"
              multiline
              rows={2}
              fullWidth
              value={formData.notes || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!formData.treatment || !formData.notes}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalRecordDialog;
