import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ru } from 'date-fns/locale';

interface FilterValues {
  search: string;
  status: string;
  type: string;
  date: Date | null;
}

interface AppointmentFiltersProps {
  filters: FilterValues;
  onFilterChange: (name: keyof FilterValues, value: any) => void;
  onClearFilters: () => void;
}

const APPOINTMENT_STATUSES = [
  { value: 'Запланирован', label: 'Запланирован' },
  { value: 'Завершен', label: 'Завершен' },
  { value: 'Отменен', label: 'Отменен' },
];

const APPOINTMENT_TYPES = [
  { value: 'Первичный приём', label: 'Первичный приём' },
  { value: 'Повторный приём', label: 'Повторный приём' },
  { value: 'Консультация', label: 'Консультация' },
];

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('search', event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    onFilterChange('status', event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    onFilterChange('type', event.target.value);
  };

  const handleDateChange = (date: Date | null) => {
    onFilterChange('date', date);
  };

  const hasActiveFilters = filters.search || filters.status || filters.type || filters.date;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Фильтры</Typography>
        {hasActiveFilters && (
          <Tooltip title="Очистить все фильтры">
            <IconButton onClick={onClearFilters} size="small">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Поиск по имени пациента"
          value={filters.search}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={filters.status}
            label="Статус"
            onChange={handleStatusChange}
          >
            <MenuItem value="">Все статусы</MenuItem>
            {APPOINTMENT_STATUSES.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Тип приёма</InputLabel>
          <Select
            value={filters.type}
            label="Тип приёма"
            onChange={handleTypeChange}
          >
            <MenuItem value="">Все типы</MenuItem>
            {APPOINTMENT_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <DatePicker
            label="Дата приёма"
            value={filters.date}
            onChange={handleDateChange}
            slotProps={{ textField: { size: 'small' } }}
            format="dd.MM.yyyy"
          />
        </LocalizationProvider>
      </Box>
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.search && (
            <Chip
              label={`Поиск: ${filters.search}`}
              onDelete={() => onFilterChange('search', '')}
              size="small"
            />
          )}
          {filters.status && (
            <Chip
              label={`Статус: ${APPOINTMENT_STATUSES.find(s => s.value === filters.status)?.label}`}
              onDelete={() => onFilterChange('status', '')}
              size="small"
            />
          )}
          {filters.type && (
            <Chip
              label={`Тип: ${APPOINTMENT_TYPES.find(t => t.value === filters.type)?.label}`}
              onDelete={() => onFilterChange('type', '')}
              size="small"
            />
          )}
          {filters.date && (
            <Chip
              label={`Дата: ${filters.date.toLocaleDateString('ru')}`}
              onDelete={() => onFilterChange('date', null)}
              size="small"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AppointmentFilters;
