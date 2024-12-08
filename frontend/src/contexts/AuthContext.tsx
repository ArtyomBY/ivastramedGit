import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserWithPassword } from '../types/auth';

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
    role: UserRole;
    specialization?: string;
    phone?: string;
  }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Временное хранилище пользователей для демонстрации
const DEMO_USERS: UserWithPassword[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'testpassword',
    firstName: 'Администратор',
    lastName: 'Иванов',
    middleName: 'Иванович',
    phone: '+7 123 456 78 90',
    passport: '1234 567890',
    oms: '1234567890',
    address: 'Москва, ул. Ленина, д. 1',
    birthDate: '01.01.1990',
    gender: 'Мужской',
    verified: false,
    role: 'admin',
  },
  {
    id: '2',
    email: 'doctor@example.com',
    password: 'testpassword',
    firstName: 'Доктор',
    lastName: 'Петров',
    middleName: 'Петрович',
    phone: '+7 987 654 32 10',
    passport: '9876 543210',
    oms: '0987654321',
    address: 'Санкт-Петербург, ул. Пушкина, д. 2',
    birthDate: '02.02.1980',
    gender: 'Мужской',
    verified: false,
    role: 'doctor',
  },
  {
    id: '3',
    email: 'patient@example.com',
    password: 'testpassword',
    firstName: 'Пациент',
    lastName: 'Сидоров',
    middleName: 'Сидорович',
    phone: '+7 555 666 77 88',
    passport: '5555 666777',
    oms: '5555666777',
    address: 'Новосибирск, ул. Чехова, д. 3',
    birthDate: '03.03.1995',
    gender: 'Женский',
    verified: false,
    role: 'patient',
  },
  {
    id: '4',
    email: 'registrar@example.com',
    password: 'testpassword',
    firstName: 'Регистратор',
    lastName: 'Новиков',
    middleName: 'Новикович',
    phone: '+7 111 222 33 44',
    passport: '1111 222233',
    oms: '1111222233',
    address: 'Екатеринбург, ул. Ленина, д. 4',
    birthDate: '04.04.1985',
    gender: 'Мужской',
    verified: false,
    role: 'registrar',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Имитация запроса к API
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Неверный email или пароль');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    specialization?: string;
    phone?: string;
  }) => {
    // Проверка на существующего пользователя
    if (DEMO_USERS.some(u => u.email === userData.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Создание нового пользователя
    const newUser: UserWithPassword = {
      id: String(DEMO_USERS.length + 1),
      ...userData,
    };

    DEMO_USERS.push(newUser);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // Обновляем пользователя в демо-хранилище
    const userIndex = DEMO_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      DEMO_USERS[userIndex] = { ...DEMO_USERS[userIndex], ...userData, password: DEMO_USERS[userIndex].password };
    }

    // Сохраняем обновленные данные в localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      logout, 
      register, 
      updateProfile 
    }}>
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
