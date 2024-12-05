import React, { useState } from 'react';
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const ScheduleOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schedules, setSchedules] = useState([
    { id: 1, doctor: 'Доктор Смирнов', specialty: 'Кардиолог', schedule: 'Пн-Пт: 9:00-17:00' },
    { id: 2, doctor: 'Доктор Иванова', specialty: 'Терапевт', schedule: 'Вт-Сб: 10:00-18:00' },
  ]);

  const filteredSchedules = schedules.filter(schedule =>
    schedule.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Обзор расписания</Typography>
        <TextField
          label="Поиск по врачу или специальности"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Врач</TableCell>
                <TableCell>Специальность</TableCell>
                <TableCell>Расписание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.doctor}</TableCell>
                  <TableCell>{schedule.specialty}</TableCell>
                  <TableCell>{schedule.schedule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ScheduleOverview;
