import { useAuthContext } from '@/hooks/auth/useAuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/home' 
}) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  
  if (isAuthenticated) {
    // If user is authenticated and tries to access login page, redirect to intended page
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
