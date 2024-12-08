import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Doctor' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Registrar' },
  ]);

  const handleAddUser = () => {
    // Логика добавления пользователя
  };

  const handleEditUser = (id: number) => {
    // Логика редактирования пользователя
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Управление пользователями</Typography>
        <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mb: 2 }}>
          Добавить пользователя
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditUser(user.id)}
                      sx={{ mr: 1 }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
