import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { ReactNode } from 'react';

function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario } = useAuthStore();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default RotaProtegida;