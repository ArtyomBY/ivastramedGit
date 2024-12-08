import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types/auth';

const StaffManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'doctor' as UserRole,
    specialization: '',
    phone: '',
  });

  // В реальном приложении это будет загружаться с сервера
  const [staffList, setStaffList] = useState<User[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // В реальном приложении здесь будет API-запрос
      const newStaff = {
        ...formData,
        id: String(Date.now()),
      };
      setStaffList([...staffList, newStaff]);
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении сотрудника');
    }
  };

  const handleDelete = (staffId: string) => {
    setStaffList(staffList.filter(staff => staff.id !== staffId));
  };

  const handleEdit = (staff: User) => {
    setEditingStaff(staff);
    setFormData({
      email: staff.email,
      password: '',
      firstName: staff.firstName,
      lastName: staff.lastName,
      role: staff.role,
      specialization: staff.specialization || '',
      phone: staff.phone || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'doctor',
      specialization: '',
      phone: '',
    });
    setEditingStaff(null);
  };

  if (user?.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error">
          У вас нет доступа к этой странице
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Управление персоналом
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          sx={{ mb: 3 }}
        >
          Добавить сотрудника
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Специализация</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.firstName}</TableCell>
                  <TableCell>{staff.lastName}</TableCell>
                  <TableCell>
                    {staff.role === 'doctor' ? 'Врач' :
                     staff.role === 'registrar' ? 'Регистратор' :
                     'Неизвестно'}
                  </TableCell>
                  <TableCell>{staff.specialization}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(staff)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(staff.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingStaff ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Пароль"
                type="password"
                required={!editingStaff}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <TextField
                label="Имя"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                label="Фамилия"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <FormControl required>
                <InputLabel>Роль</InputLabel>
                <Select
                  value={formData.role}
                  label="Роль"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <MenuItem value="doctor">Врач</MenuItem>
                  <MenuItem value="registrar">Регистратор</MenuItem>
                </Select>
              </FormControl>
              {formData.role === 'doctor' && (
                <TextField
                  label="Специализация"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              )}
              <TextField
                label="Телефон"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingStaff ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StaffManagementPage;
