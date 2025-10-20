import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};