import React, { useState, useEffect, useCallback } from 'react';
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
import { 
  Appointment, 
  Visit, 
  AppointmentFormData, 
  AppointmentType, 
  VisitType, 
  AppointmentStatus, 
  VisitStatus, 
  Doctor, 
  Patient, 
  CommonStatus
} from '../../types/medical';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationService } from '../../services/notificationService';

// Определение типов вне компонента для предотвращения дублирования
const MEDICAL_ENTITY_TYPES = [
  'Первичный приём', 
  'Повторный приём', 
  'Экстренный приём', 
  'Процедура', 
  'Осмотр', 
  'Консультация', 
  'Диагностика'
] as const;

type MedicalEntityType = typeof MEDICAL_ENTITY_TYPES[number];

// Расширенный интерфейс формы с необязательными полями
interface ExtendedAppointmentFormData {
  id?: string;
  patientId: string | undefined;
  patientName: string | undefined;
  doctorId: string | undefined;
  doctorName: string | undefined;
  date: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  type?: AppointmentType | VisitType;
  status?: AppointmentStatus | VisitStatus;
  diagnosis?: string[];
  treatment?: string;
  notes?: string;
  description?: string;
}

// Функция для безопасного преобразования типов
const convertToVisit = (data: Partial<Appointment | Visit>): Visit => {
  // Преобразуем статус к общему типу
  const convertStatus = (status?: AppointmentStatus | VisitStatus): CommonStatus => {
    const validStatuses: CommonStatus[] = [
      'Запланирован', 'Подтвержден', 'Отменен', 'Завершен', 
      'Назначен', 'В процессе'
    ];
    
    return validStatuses.includes(status as CommonStatus) 
      ? status as CommonStatus 
      : 'Назначен';
  };

  const baseVisit: Visit = {
    id: data.id || '',
    patientId: data.patientId || '',
    patientName: data.patientName || '',
    doctorId: data.doctorId || '',
    doctorName: data.doctorName || '',
    date: data.date || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    type: (data.type as VisitType) || 'Осмотр',
    status: convertStatus(data.status),
    diagnosis: Array.isArray(data.diagnosis) ? data.diagnosis : [],
    treatment: data.treatment || '',
    notes: data.notes || '', // Обязательное строковое поле
    description: data.description || '', // Обязательное строковое поле
    followUpDate: data.followUpDate
  };

  return baseVisit;
};

const convertToAppointment = (data: Partial<Appointment | Visit>): Appointment => {
  // Преобразуем статус к AppointmentStatus
  const convertStatus = (status?: AppointmentStatus | VisitStatus): AppointmentStatus => {
    const appointmentStatusMap: Record<string, AppointmentStatus> = {
      'Назначен': 'Запланирован',
      'В процессе': 'Подтвержден',
      'Завершен': 'Завершен',
      'Отменен': 'Отменен'
    };
    
    return appointmentStatusMap[status as string] || 'Запланирован';
  };

  const baseAppointment: Appointment = {
    id: data.id || '',
    patientId: data.patientId || '',
    patientName: data.patientName || '',
    doctorId: data.doctorId || '',
    doctorName: data.doctorName || '',
    date: data.date || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    type: (data.type as AppointmentType) || 'Первичный приём',
    status: convertStatus(data.status),
    diagnosis: Array.isArray(data.diagnosis) ? data.diagnosis : [],
    treatment: data.treatment || '',
    notes: data.notes || '', 
    description: data.description || '', 
  };

  return baseAppointment;
};

// Функция для определения типа сущности
const determineMedicalEntityType = (
  type?: string
): { 
  isAppointment: boolean, 
  isVisit: boolean, 
  processedType: MedicalEntityType 
} => {
  const appointmentTypes: MedicalEntityType[] = [
    'Первичный приём', 
    'Повторный приём', 
    'Экстренный приём', 
    'Процедура', 
    'Осмотр', 
    'Консультация', 
    'Диагностика'
  ];

  const visitTypes: MedicalEntityType[] = [
    'Осмотр', 
    'Процедура', 
    'Консультация', 
    'Диагностика'
  ];

  if (!type) {
    return {
      isAppointment: true,
      isVisit: false,
      processedType: 'Первичный приём'
    };
  }

  const processedType = type as MedicalEntityType;

  return {
    isAppointment: appointmentTypes.includes(processedType),
    isVisit: visitTypes.includes(processedType),
    processedType
  };
};

const APPOINTMENT_TYPES: AppointmentType[] = [
  'Первичный приём', 
  'Повторный приём', 
  'Экстренный приём', 
  'Процедура'
];

const VISIT_TYPES: VisitType[] = [
  'Осмотр', 
  'Процедура', 
  'Консультация', 
  'Диагностика'
];

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

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  doctor,
  patientId: initialPatientId,
  doctorId: initialDoctorId,
  mode = 'appointment',
  loading = false
}) => {
  // Инициализация состояния с учетом необязательных полей
  const [formData, setFormData] = useState<ExtendedAppointmentFormData>({
    patientId: initialPatientId || undefined,
    patientName: undefined,
    doctorId: initialDoctorId || (doctor?.id),
    doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : undefined,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: format(new Date(), 'HH:mm'),
    endTime: format(addMinutes(new Date(), 30), 'HH:mm'),
    type: mode === 'appointment' ? 'Первичный приём' : 'Осмотр',
    status: mode === 'appointment' ? 'Запланирован' : 'Назначен',
    diagnosis: [],
    treatment: '',
    notes: '',
    description: '',
  });

  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      const safeFormatDate = (value: unknown): string => {
        if (value instanceof Date) {
          return format(value, 'HH:mm');
        }
        if (typeof value === 'string') {
          return value;
        }
        return '';
      };

      const initialFormData = {
        ...initialData,
        startTime: safeFormatDate(initialData.startTime),
        endTime: safeFormatDate(initialData.endTime),
      };

      setFormData(prev => ({
        ...prev,
        type: initialFormData.type,
        status: initialFormData.status,
        diagnosis: initialFormData.diagnosis || [],
        treatment: initialFormData.treatment || '',
        notes: initialFormData.notes || '',
        description: initialFormData.description || '',
      }));
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

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Преобразуем данные формы с учетом необязательных полей
      const formProcessableData: ExtendedAppointmentFormData = {
        ...formData,
        patientId: initialPatientId || formData.patientId,
        doctorId: initialDoctorId || formData.doctorId,
        doctorName: doctor 
          ? `${doctor.firstName} ${doctor.lastName}` 
          : formData.doctorName,
      };

      // Обработка данных
      const processedData = processFormData(formProcessableData, doctor);

      // Определяем, является ли данный тип Appointment или Visit
      const { isAppointment, isVisit } = determineMedicalEntityType(processedData.type);

      // Создаем уведомление о создании или изменении приёма
      const processedEntity = isVisit 
        ? convertToVisit(processedData) 
        : convertToAppointment(processedData);

      // Приведение типа для совместимости с onSave
      const compatibleEntity = isVisit 
        ? { ...processedEntity, status: processedEntity.status as AppointmentStatus }
        : processedEntity;

      const notification = NotificationService.createAppointmentChangeNotification(
        compatibleEntity,
        processedData.id ? 'updated' : 'created'
      );
      addNotification(notification);

      // Вызываем onSave с обработанными данными
      await onSave(compatibleEntity);
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Произошла ошибка при сохранении приёма'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Функция обработки данных
  const processFormData = (
    formData: ExtendedAppointmentFormData, 
    doctor?: Doctor
  ): Partial<Appointment | Visit> => {
    // Базовые преобразования времени
    const processTime = (time: string | Date | undefined): string => {
      if (!time) return format(new Date(), 'HH:mm');
      return typeof time === 'string' 
        ? time 
        : format(time, 'HH:mm');
    };

    // Определение типа данных
    const { 
      isAppointment, 
      isVisit, 
      processedType 
    } = determineMedicalEntityType(formData.type);

    // Общие поля для Appointment и Visit
    const baseData = {
      id: formData.id || String(Date.now()),
      patientId: formData.patientId || '',
      patientName: formData.patientName || '',
      doctorId: formData.doctorId || (doctor?.id || ''),
      doctorName: formData.doctorName || (doctor ? `${doctor.firstName} ${doctor.lastName}` : ''),
      date: formData.date || format(new Date(), 'yyyy-MM-dd'),
      startTime: processTime(formData.startTime),
      endTime: processTime(formData.endTime),
      notes: formData.notes || '',
      description: formData.description || '',
      diagnosis: formData.diagnosis || [],
      treatment: formData.treatment || '',
    };

    // Определение типа и статуса
    if (isAppointment) {
      return {
        ...baseData,
        type: processedType as AppointmentType,
        status: (formData.status || 'Запланирован') as AppointmentStatus,
      } as Partial<Appointment>;
    }

    if (isVisit) {
      return {
        ...baseData,
        type: processedType as VisitType,
        status: (formData.status || 'Назначен') as VisitStatus,
      } as Partial<Visit>;
    }

    // Fallback к Appointment
    return {
      ...baseData,
      type: 'Первичный приём' as AppointmentType,
      status: 'Запланирован' as AppointmentStatus,
    } as Partial<Appointment>;
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
          disabled={loading || isSaving}
        >
          {loading || isSaving ? (
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
