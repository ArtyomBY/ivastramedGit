import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextFieldProps,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { LabTest, LabTestStatus } from '../../types/medical';

const labTestStatuses: LabTestStatus[] = [
  'Назначен',
  'В процессе',
  'Завершен',
  'Отменен',
];

export interface LabTestDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (labTest: Partial<LabTest>) => void;
  patientId: string;
  doctorId: string;
  initialData?: Partial<LabTest>;
}

const LabTestDialog: React.FC<LabTestDialogProps> = ({
  open,
  onClose,
  onSave,
  patientId,
  doctorId,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<LabTest>>({
    status: initialData?.status || 'Назначен',
    orderedDate: initialData?.orderedDate || new Date(),
    completedDate: initialData?.completedDate,
    name: initialData?.name || '',
    description: initialData?.description || '',
    results: initialData?.results || '',
    notes: initialData?.notes || '',
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (event: SelectChangeEvent<LabTestStatus>) => {
    const value = event.target.value as LabTestStatus;
    setFormData((prev) => ({
      ...prev,
      status: value,
      completedDate: value === 'Завершен' ? new Date() : undefined,
    }));
  };

  const handleDateChange = (field: keyof Pick<LabTest, 'orderedDate' | 'completedDate'>) => (
    date: Date | null
  ) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      patientId,
      doctorId,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData?.id ? 'Редактировать анализ' : 'Новый анализ'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Название"
              fullWidth
              value={formData.name || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Описание"
              multiline
              rows={3}
              fullWidth
              value={formData.description || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={formData.status || 'Назначен'}
                onChange={handleStatusChange}
                label="Статус"
              >
                {labTestStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DatePicker
                slots={{
                  textField: (params: TextFieldProps) => <TextField {...params} fullWidth variant="outlined" label="Дата назначения" />
                }}
                value={formData.orderedDate}
                onChange={handleDateChange('orderedDate')}
              />
            </LocalizationProvider>
          </Grid>
          {formData.status === 'Завершен' && (
            <>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DatePicker
                    slots={{
                      textField: (params: TextFieldProps) => <TextField {...params} fullWidth variant="outlined" label="Дата выполнения" />
                    }}
                    value={formData.completedDate}
                    onChange={handleDateChange('completedDate')}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="results"
                  label="Результаты"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.results || ''}
                  onChange={handleInputChange}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Примечания"
              multiline
              rows={2}
              fullWidth
              value={formData.notes || ''}
              onChange={handleInputChange}
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
          disabled={!formData.name || !formData.orderedDate}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabTestDialog;
