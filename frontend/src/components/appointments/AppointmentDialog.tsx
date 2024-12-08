import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Autocomplete,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ru } from 'date-fns/locale';
import { format, parse, addMinutes, isAfter, isBefore, isEqual } from 'date-fns';
import { Appointment, Doctor, Visit, AppointmentType, VisitType, AppointmentStatus, VisitStatus, BaseAppointment } from '../../types/medical';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationService } from '../../services/notificationService';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Date;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

const APPOINTMENT_TYPES: AppointmentType[] = ['Первичный приём', 'Повторный приём', 'Экстренный приём', 'Процедура'];
const VISIT_TYPES: VisitType[] = ['Осмотр', 'Процедура', 'Консультация', 'Диагностика'];
const APPOINTMENT_DURATIONS = [
  { value: 15, label: '15 минут' },
  { value: 30, label: '30 минут' },
  { value: 45, label: '45 минут' },
  { value: 60, label: '1 час' },
];

const VISIT_STATUSES = ['Назначен', 'Завершен', 'Отменен'];

export interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Appointment | Visit>) => void;
  initialData?: Partial<Appointment | Visit>;
  doctor?: Doctor;
  patientId?: string;
  doctorId?: string;
  mode?: 'appointment' | 'visit';
  loading?: boolean;
}

interface AppointmentFormData extends Partial<BaseAppointment> {
  startTime?: string;
  endTime?: string;
  type?: AppointmentType | VisitType;
  status?: AppointmentStatus | VisitStatus;
  diagnosis?: string[];
  treatment?: string;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  doctor,
  patientId,
  doctorId,
  mode = 'appointment',
  loading = false,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: mode === 'appointment' ? APPOINTMENT_TYPES[0] : VISIT_TYPES[0],
    status: mode === 'appointment' ? 'Запланирован' : 'Назначен',
    diagnosis: [],
    treatment: '',
    notes: '',
    description: '',
    ...initialData,
  });

  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (
    event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when field is edited
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleTimeChange = (time: Date | null, field: 'startTime' | 'endTime') => {
    if (time) {
      setFormData((prev) => ({
        ...prev,
        [field]: format(time, 'HH:mm'),
      }));
    }
  };

  const handleDurationChange = (event: SelectChangeEvent<number>) => {
    const newDuration = event.target.value as number;
    setDuration(newDuration);

    if (formData.startTime) {
      const startTime = parse(formData.startTime, 'HH:mm', new Date());
      const endTime = addMinutes(startTime, newDuration);
      setFormData((prev) => ({
        ...prev,
        endTime: format(endTime, 'HH:mm'),
      }));
    }
  };

  const handleAddDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setFormData((prev) => ({
        ...prev,
        diagnosis: [...(Array.isArray(prev.diagnosis) ? prev.diagnosis : []), newDiagnosis.trim()],
      }));
      setNewDiagnosis('');
    }
  };

  const handleRemoveDiagnosis = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      diagnosis: Array.isArray(prev.diagnosis) 
        ? prev.diagnosis.filter((_, i) => i !== index)
        : [],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Выберите дату';
    }

    if (!formData.type) {
      newErrors.type = 'Выберите тип приёма';
    }

    if (mode === 'appointment') {
      if (!formData.startTime) {
        newErrors.startTime = 'Выберите время начала';
      }

      if (!formData.endTime) {
        newErrors.endTime = 'Выберите время окончания';
      }

      if (formData.startTime && formData.endTime) {
        const start = parse(formData.startTime, 'HH:mm', new Date());
        const end = parse(formData.endTime, 'HH:mm', new Date());

        if (isAfter(start, end) || isEqual(start, end)) {
          newErrors.endTime = 'Время окончания должно быть позже времени начала';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const appointmentData = {
        ...formData,
        patientId,
        doctorId,
        doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : undefined,
      };

      if (mode === 'appointment') {
        onSave(appointmentData as Partial<Appointment>);
      } else {
        onSave(appointmentData as Partial<Visit>);
      }
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '50vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {initialData ? 'Редактировать' : 'Новый'} {mode === 'appointment' ? 'приём' : 'визит'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <DatePicker
                  label="Дата"
                  value={formData.date ? parse(formData.date, 'yyyy-MM-dd', new Date()) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {mode === 'appointment' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Длительность</InputLabel>
                    <Select
                      value={duration}
                      onChange={handleDurationChange}
                      label="Длительность"
                    >
                      {APPOINTMENT_DURATIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Время начала"
                      value={formData.startTime ? parse(formData.startTime, 'HH:mm', new Date()) : null}
                      onChange={(newValue) => handleTimeChange(newValue, 'startTime')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startTime,
                          helperText: errors.startTime,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Время окончания"
                      value={formData.endTime ? parse(formData.endTime, 'HH:mm', new Date()) : null}
                      onChange={(newValue) => handleTimeChange(newValue, 'endTime')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endTime,
                          helperText: errors.endTime,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Тип</InputLabel>
                <Select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  label="Тип"
                  error={!!errors.type}
                >
                  {(mode === 'appointment' ? APPOINTMENT_TYPES : VISIT_TYPES).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  label="Статус"
                >
                  {(mode === 'appointment' 
                    ? ['Запланирован', 'Завершен', 'Отменен'] 
                    : VISIT_STATUSES
                  ).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  label="Диагноз"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDiagnosis();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddDiagnosis}
                  disabled={!newDiagnosis.trim()}
                >
                  Добавить
                </Button>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.isArray(formData.diagnosis) && formData.diagnosis.map((diagnosis, index) => (
                  <Chip
                    key={index}
                    label={diagnosis}
                    onDelete={() => handleRemoveDiagnosis(index)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="treatment"
                label="Лечение"
                multiline
                rows={2}
                value={formData.treatment || ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Примечания"
                multiline
                rows={2}
                value={formData.notes || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            initialData ? 'Сохранить' : 'Создать'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;
