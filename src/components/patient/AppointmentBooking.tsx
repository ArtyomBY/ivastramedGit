import React, { useState } from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Chip,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment/locale/ru';
import { AccessTime, Event, Person } from '@mui/icons-material';

moment.locale('ru');

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo?: string;
  experience: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    specialty: 'Кардиология',
    experience: '15 лет',
  },
  {
    id: '2',
    name: 'Петрова Мария Сергеевна',
    specialty: 'Неврология',
    experience: '10 лет',
  },
  {
    id: '3',
    name: 'Сидоров Петр Александрович',
    specialty: 'Терапия',
    experience: '20 лет',
  },
];

const specialties = ['Кардиология', 'Неврология', 'Терапия', 'Хирургия', 'Офтальмология'];

const AppointmentBooking: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const start = moment().set({ hour: 9, minute: 0 });
    const end = moment().set({ hour: 18, minute: 0 });

    while (start.isBefore(end)) {
      slots.push({
        time: start.format('HH:mm'),
        available: Math.random() > 0.3, // Имитация доступности слотов
      });
      start.add(30, 'minutes');
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedSpecialty('');
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return !!selectedSpecialty;
      case 1:
        return !!selectedDoctor;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedTime;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Специальность</InputLabel>
              <Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                label="Специальность"
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {mockDoctors
              .filter((doctor) => !selectedSpecialty || doctor.specialty === selectedSpecialty)
              .map((doctor) => (
                <Grid item xs={12} key={doctor.id}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: selectedDoctor?.id === doctor.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar sx={{ width: 56, height: 56 }}>{doctor.name[0]}</Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">{doctor.name}</Typography>
                        <Typography color="textSecondary">{doctor.specialty}</Typography>
                        <Typography variant="body2">Стаж: {doctor.experience}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Выберите дату"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                disablePast
                format="DD.MM.YYYY"
              />
            </LocalizationProvider>
          </Box>
        );

      case 3:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {timeSlots.map((slot) => (
              <Grid item xs={4} sm={3} key={slot.time}>
                <Chip
                  label={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  color={selectedTime === slot.time ? 'primary' : 'default'}
                  sx={{ width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        );

      case 4:
        return (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Подтверждение записи
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person />
                    <Typography>Врач: {selectedDoctor?.name}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Event />
                    <Typography>Дата: {selectedDate?.format('DD.MM.YYYY')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime />
                    <Typography>Время: {selectedTime}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const steps = [
    'Выбор специальности',
    'Выбор врача',
    'Выбор даты',
    'Выбор времени',
    'Подтверждение',
  ];

  const handleSubmit = () => {
    // Здесь будет логика отправки данных на сервер
    console.log({
      specialty: selectedSpecialty,
      doctor: selectedDoctor,
      date: selectedDate?.format('YYYY-MM-DD'),
      time: selectedTime,
    });
    alert('Запись успешно создана!');
    handleReset();
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Запись успешно создана!
            </Typography>
            <Button onClick={handleReset} variant="contained" sx={{ mt: 2 }}>
              Записаться еще раз
            </Button>
          </Box>
        ) : (
          <>
            {renderStepContent()}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Назад
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isStepComplete()}
                  >
                    Подтвердить запись
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepComplete()}
                  >
                    Далее
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentBooking;
