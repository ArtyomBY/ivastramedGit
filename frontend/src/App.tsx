import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import AuthPage from './components/auth/AuthPage';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/Patient/PatientDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegistrarDashboard from './pages/Registrar/RegistrarDashboard';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <AuthProvider>
            <AppointmentProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
                <Route path="/dashboard/*" element={<ProtectedRoute element={<DashboardRouter />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
              </Routes>
            </AppointmentProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'registrar':
      return <RegistrarDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default App;
