import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../components/hooks/config';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  checkMaintenanceMode: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const checkMaintenanceMode = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping maintenance check');
        return;
      }
      const auth = token.startsWith('Token ') ? token : `Token ${token}`;
      const response = await axios.get(`${API_BASE_URL}/admin/settings/`, {
        headers: { Authorization: auth }
      });
      setIsMaintenanceMode(response.data.maintenanceMode);
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
    }
  };

  useEffect(() => {
    checkMaintenanceMode();
    // Check maintenance mode every 5 minutes
    const interval = setInterval(checkMaintenanceMode, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, checkMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
} 