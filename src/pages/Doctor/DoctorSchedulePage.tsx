import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppointmentScheduler from '../../components/doctor/AppointmentScheduler';
import { AppointmentsList } from '../../components/schedule/AppointmentsList';
import AppointmentFilters from '../../components/schedule/AppointmentFilters';
import { useAppointments } from '../../hooks/useAppointments';
import { useAppointmentReminders } from '../../hooks/useAppointmentReminders';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationService } from '../../services/notificationService';
import { Appointment } from '../../types/medical';

const ViewToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

type ViewMode = 'month' | 'week' | 'day';

interface FilterValues {
  search: string;
  status: string;
  type: string;
  date: Date | null;
}

const initialFilters: FilterValues = {
  search: '',
  status: '',
  type: '',
  date: null,
};

export const DoctorSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const { appointments, loading } = useAppointments();
  const { addNotification } = useNotifications() as { addNotification: (notification: any) => void };
  
  // Включаем проверку напоминаний
  useAppointmentReminders(appointments);

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: ViewMode) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleFilterChange = (name: keyof FilterValues, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleAppointmentChange = (appointment: Appointment, changeType: 'created' | 'updated' | 'cancelled') => {
    // Создаем уведомление об изменении приёма
    const notification = NotificationService.createAppointmentChangeNotification(appointment, changeType);
    addNotification(notification);
    
    // Здесь будет логика обновления приёма
  };

  const todayStats = {
    total: appointments.filter(apt => 
      new Date(apt.startTime).toDateString() === new Date().toDateString()
    ).length,
    completed: appointments.filter(apt => 
      new Date(apt.startTime).toDateString() === new Date().toDateString() && 
      apt.status === 'Завершен'
    ).length,
    upcoming: appointments.filter(apt => 
      new Date(apt.startTime).toDateString() === new Date().toDateString() && 
      apt.status === 'Запланирован'
    ).length,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Расписание приёмов
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewToggle
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
          >
            <ToggleButton value="month" aria-label="month view">
              <Tooltip title="Месяц">
                <CalendarMonthIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="week" aria-label="week view">
              <Tooltip title="Неделя">
                <ViewWeekIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="day" aria-label="day view">
              <Tooltip title="День">
                <ViewDayIcon />
              </Tooltip>
            </ToggleButton>
          </ViewToggle>
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <Tooltip title="Фильтры">
              <FilterListIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Сегодня
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Всего: ${todayStats.total}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Завершено: ${todayStats.completed}`} 
                  color="success" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Предстоит: ${todayStats.upcoming}`} 
                  color="info" 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {showFilters && (
        <Box sx={{ mb: 3 }}>
          <AppointmentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 300px)' }}>
            <AppointmentScheduler viewMode={viewMode} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 300px)', overflow: 'auto' }}>
            <AppointmentsList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
