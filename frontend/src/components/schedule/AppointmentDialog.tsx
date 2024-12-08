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
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ru } from 'date-fns/locale';
import { format, parse, addMinutes, isAfter, isBefore, isEqual } from 'date-fns';
import { Appointment, Doctor } from '../../types/medical';
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

interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => void;
  initialData?: Partial<Appointment>;
  doctor: Doctor;
  loading?: boolean;
}

const APPOINTMENT_DURATIONS = [
  { value: 15, label: '15 минут' },
  { value: 30, label: '30 минут' },
  { value: 45, label: '45 минут' },
  { value: 60, label: '1 час' },
  { value: 90, label: '1.5 часа' },
];

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  doctor,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: format(new Date(), 'HH:mm'),
    endTime: format(addMinutes(new Date(), 30), 'HH:mm'),
    status: 'Запланирован',
    notes: '',
    description: '',
    type: 'Первичный приём',
    doctorId: doctor.id,
    doctorName: `${doctor.firstName} ${doctor.lastName}`,
  });

  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  // В реальном приложении загружать с сервера
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      firstName: 'Анна',
      lastName: 'Сидорова',
      middleName: 'Петровна',
      birthDate: new Date('1990-05-15'),
      gender: 'female',
      phone: '+7 (999) 123-45-67',
      email: 'anna@example.com',
    },
    {
      id: '2',
      firstName: 'Петр',
      lastName: 'Иванов',
      middleName: 'Сергеевич',
      birthDate: new Date('1985-08-22'),
      gender: 'male',
      phone: '+7 (999) 765-43-21',
      email: 'petr@example.com',
    },
    {
      id: '3',
      firstName: 'Мария',
      lastName: 'Козлова',
      middleName: 'Александровна',
      birthDate: new Date('1995-03-10'),
      gender: 'female',
      phone: '+7 (999) 111-22-33',
      email: 'maria@example.com',
    },
  ]);

  const { addNotification } = useNotifications();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
        startTime: initialData.startTime || format(new Date(), 'HH:mm'),
        endTime: initialData.endTime || format(addMinutes(new Date(), 30), 'HH:mm'),
      });

      // Вычисляем продолжительность
      if (initialData.startTime && initialData.endTime) {
        const start = parse(initialData.startTime, 'HH:mm', new Date());
        const end = parse(initialData.endTime, 'HH:mm', new Date());
        const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        setDuration(diffInMinutes);
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Выберите дату приёма';
    }

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

    if (!formData.patientName) {
      newErrors.patientName = 'Введите имя пациента';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd'),
      }));
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: '' }));
      }
    }
  };

  const handleStartTimeChange = (time: Date | null) => {
    if (time) {
      const newStartTime = format(time, 'HH:mm');
      const start = parse(newStartTime, 'HH:mm', new Date());
      const newEndTime = format(addMinutes(start, duration), 'HH:mm');
      
      setFormData((prev) => ({
        ...prev,
        startTime: newStartTime,
        endTime: newEndTime,
      }));

      if (errors.startTime) {
        setErrors((prev) => ({ ...prev, startTime: '' }));
      }
    }
  };

  const handleDurationChange = (event: SelectChangeEvent<number>) => {
    const newDuration = Number(event.target.value);
    setDuration(newDuration);

    if (formData.startTime) {
      const start = parse(formData.startTime, 'HH:mm', new Date());
      const newEndTime = format(addMinutes(start, newDuration), 'HH:mm');
      
      setFormData((prev) => ({
        ...prev,
        endTime: newEndTime,
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const startTime = new Date(formData.date!);
      const [startHours, startMinutes] = formData.startTime!.split(':').map(Number);
      startTime.setHours(startHours, startMinutes);

      const endTime = new Date(formData.date!);
      const [endHours, endMinutes] = formData.endTime!.split(':').map(Number);
      endTime.setHours(endHours, endMinutes);

      const appointmentData = {
        ...formData,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      await onSave(appointmentData);

      // Создаем уведомление о создании или изменении приёма
      const notification = NotificationService.createAppointmentChangeNotification(
        appointmentData as Appointment,
        initialData ? 'updated' : 'created'
      );
      addNotification(notification);

      onClose();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Произошла ошибка при сохранении приёма'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2
      }}>
        <Typography variant="h6">
          {initialData?.id ? 'Редактировать прием' : 'Новый прием'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Информация о враче */}
          <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary.contrastText">
              Врач: {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography variant="body2" color="primary.contrastText">
              Специализация: {doctor.specialization}
            </Typography>
          </Box>

          {/* Дата и время */}
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <TimePicker
                label="Время начала"
                value={formData.startTime ? parse(formData.startTime, 'HH:mm', new Date()) : null}
                onChange={handleStartTimeChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startTime,
                    helperText: errors.startTime,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel>Длительность</InputLabel>
              <Select
                value={duration}
                onChange={handleDurationChange}
                label="Длительность"
                startAdornment={<AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />}
              >
                {APPOINTMENT_DURATIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Тип приёма */}
          <FormControl fullWidth>
            <InputLabel>Тип приема</InputLabel>
            <Select
              name="type"
              value={formData.type || 'Первичный приём'}
              onChange={handleSelectChange}
              label="Тип приема"
            >
              <MenuItem value="Первичный приём">Первичный приём</MenuItem>
              <MenuItem value="Повторный приём">Повторный приём</MenuItem>
              <MenuItem value="Консультация">Консультация</MenuItem>
            </Select>
          </FormControl>

          {/* Пациент */}
          <Autocomplete
            options={patients}
            getOptionLabel={(option: Patient | string) => {
              if (typeof option === 'string') {
                return option;
              }
              return `${option.firstName} ${option.lastName}`;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="patientName"
                label="Пациент"
                error={!!errors.patientName}
                helperText={errors.patientName}
                onChange={handleInputChange}
                value={formData.patientName || ''}
              />
            )}
            freeSolo
            onChange={(_, value: Patient | string | null) => {
              if (!value) {
                setFormData(prev => ({ ...prev, patientName: '', patientId: undefined }));
              } else if (typeof value === 'string') {
                setFormData(prev => ({ ...prev, patientName: value, patientId: undefined }));
              } else {
                setFormData(prev => ({ 
                  ...prev, 
                  patientName: `${value.firstName} ${value.lastName}`,
                  patientId: value.id
                }));
              }
            }}
            value={formData.patientName || null}
          />

          {/* Описание и заметки */}
          <TextField
            name="description"
            label="Описание"
            fullWidth
            multiline
            rows={2}
            value={formData.description || ''}
            onChange={handleInputChange}
          />

          <TextField
            name="notes"
            label="Заметки"
            fullWidth
            multiline
            rows={2}
            value={formData.notes || ''}
            onChange={handleInputChange}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || isSaving}
          startIcon={loading || isSaving ? <CircularProgress size={20} /> : undefined}
        >
          {(loading || isSaving) ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;
