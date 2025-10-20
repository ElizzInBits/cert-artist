import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AUTH_CONFIG } from '@/config/auth';
import { verifyPassword } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há sessão ativa
    const session = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    const timestamp = sessionStorage.getItem(`${AUTH_CONFIG.SESSION_KEY}_timestamp`);
    
    if (session === 'authenticated' && timestamp) {
      const sessionTime = parseInt(timestamp);
      const now = Date.now();
      
      // Verificar se a sessão não expirou
      if (now - sessionTime < AUTH_CONFIG.SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        // Sessão expirada, limpar
        sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        sessionStorage.removeItem(`${AUTH_CONFIG.SESSION_KEY}_timestamp`);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const isValid = await verifyPassword(username, password);
      
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, 'authenticated');
        sessionStorage.setItem(`${AUTH_CONFIG.SESSION_KEY}_timestamp`, Date.now().toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    sessionStorage.removeItem(`${AUTH_CONFIG.SESSION_KEY}_timestamp`);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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