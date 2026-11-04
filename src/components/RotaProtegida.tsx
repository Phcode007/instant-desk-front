import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { ReactNode } from 'react';
import type { UserRole } from '../models/UserRole';
import { getRoleHome, isUserRole } from '../utils/auth';

interface RotaProtegidaProps {
  children: ReactNode;
  roles?: UserRole[];
}

function RotaProtegida({ children, roles }: RotaProtegidaProps) {
  const { usuario } = useAuthStore();

  if (!usuario?.token || !isUserRole(usuario.role)) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(usuario.role)) {
    return <Navigate to={getRoleHome(usuario.role)} replace />;
  }

  return <>{children}</>;
}

export default RotaProtegida;