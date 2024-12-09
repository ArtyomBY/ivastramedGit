import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Patient, Doctor, Admin, Registrar } from '../types/auth';
import AuthService from '../services/auth.service';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    passport: string;
    oms: string;
    address: string;
    birthDate: string;
    gender: string;
    role: UserRole;
    bloodType?: string;
    allergies?: string;
    chronicDiseases?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }) => Promise<string>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface ApiErrorResponse {
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());

  useEffect(() => {
    if (user) {
      // При монтировании компонента обновляем данные пользователя с сервера
      const refreshUser = async () => {
        try {
          const updatedUser = await AuthService.refreshUserData();
          setUser(updatedUser);
        } catch (error) {
          console.error('Ошибка при обновлении данных пользователя:', error);
        }
      };
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      setUser(response.user);
      // После входа сразу получаем актуальные данные с сервера
      const updatedUser = await AuthService.refreshUserData();
      setUser(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Неверный email или пароль');
      }
      throw new Error('Произошла ошибка при входе');
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    passport: string;
    oms: string;
    address: string;
    birthDate: string;
    gender: string;
    role: UserRole;
    bloodType?: string;
    allergies?: string;
    chronicDiseases?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }) => {
    try {
      const response = await AuthService.register(userData);
      return response.message;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.message || 'Ошибка при регистрации');
      }
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Ошибка при обновлении профиля');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
