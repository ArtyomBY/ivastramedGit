import api from './api';
import { User, UserRole } from '../types/auth';
import { AxiosError } from 'axios';

interface RegisterData {
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
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

interface ApiErrorResponse {
  message: string;
}

const AuthService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/api/auth/register', data);
      // При регистрации не сохраняем токен и пользователя
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.message || 'Ошибка при регистрации');
      }
      throw new Error('Ошибка при регистрации');
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<{ user: User }>('/api/users/profile', userData);
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.message || 'Ошибка при обновлении профиля');
      }
      throw new Error('Ошибка при обновлении профиля');
    }
  },

  async refreshUserData(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>('/api/users/profile');
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.message || 'Ошибка при получении данных пользователя');
      }
      throw new Error('Ошибка при получении данных пользователя');
    }
  }
};

export default AuthService;
