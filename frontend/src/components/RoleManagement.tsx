import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';

const RoleManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'Doctor' },
    { id: 2, name: 'Jane Smith', role: 'Registrar' },
  ]);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newRole, setNewRole] = useState('Doctor');
  const [nameSearchTerm, setNameSearchTerm] = useState('');

  const filteredUsersByName = users.filter(user =>
    user.name.toLowerCase().includes(nameSearchTerm.toLowerCase())
  );

  const handleRoleChange = (id: number) => {
    setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Управление ролями</Typography>
        <TextField
          label="Поиск по ФИО"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={nameSearchTerm}
          onChange={(e) => setNameSearchTerm(e.target.value)}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Пользователь</InputLabel>
          <Select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            {filteredUsersByName.map(user => (
              <MenuItem key={user.id} value={user.id}>{user.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Роль</InputLabel>
          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as string)}
          >
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="Registrar">Registrar</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Patient">Patient</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => selectedUser !== null && handleRoleChange(selectedUser)}
        >
          Изменить роль
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
