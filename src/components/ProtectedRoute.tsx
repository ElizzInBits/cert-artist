import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('Usuário não autenticado, mostrando tela de login');
    return <Login />;
  }

  console.log('Usuário autenticado, mostrando conteúdo');
  return <>{children}</>;
};