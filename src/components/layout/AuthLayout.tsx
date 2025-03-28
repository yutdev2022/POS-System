import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '@/lib/store';
import { Layout } from './Layout';

interface AuthLayoutProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'cashier';
}

export function AuthLayout({ children, requiredRole }: AuthLayoutProps) {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If a specific role is required and user doesn't have it, redirect to dashboard
    if (requiredRole && currentUser.role !== requiredRole) {
      navigate('/');
    }
  }, [currentUser, navigate, requiredRole]);

  // If no user or doesn't meet role requirement, don't render anything
  if (!currentUser || (requiredRole && currentUser.role !== requiredRole)) {
    return null;
  }

  return <Layout>{children}</Layout>;
}