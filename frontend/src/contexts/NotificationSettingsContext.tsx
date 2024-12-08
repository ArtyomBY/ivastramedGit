import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface NotificationSettings {
  soundEnabled: boolean;
  emailEnabled: boolean;
  reminderIntervals: number[]; // minutes before appointment
  notificationTypes: {
    appointmentReminder: boolean;
    statusChange: boolean;
    cancelation: boolean;
  };
}

interface NotificationSettingsContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  emailEnabled: false,
  reminderIntervals: [1440, 120, 30], // 24 hours, 2 hours, 30 minutes
  notificationTypes: {
    appointmentReminder: true,
    statusChange: true,
    cancelation: true,
  },
};

const NotificationSettingsContext = createContext<NotificationSettingsContextType | null>(null);

export const useNotificationSettings = () => {
  const context = useContext(NotificationSettingsContext);
  if (!context) {
    throw new Error('useNotificationSettings must be used within a NotificationSettingsProvider');
  }
  return context;
};

export const NotificationSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Load settings from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`notification_settings_${user.id}`);
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Error parsing notification settings:', error);
          setSettings(defaultSettings);
        }
      }
    }
  }, [user]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notification_settings_${user.id}`, JSON.stringify(settings));
    }
  }, [settings, user]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
      notificationTypes: {
        ...prevSettings.notificationTypes,
        ...(newSettings.notificationTypes || {}),
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <NotificationSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
};

export default NotificationSettingsContext;
