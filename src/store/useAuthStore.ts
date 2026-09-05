import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type UsuarioLogin from '../models/UsuarioLogin';

interface AuthState {
  usuario: UsuarioLogin | null;
  login: (dados: UsuarioLogin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      login: (dados) => set({ usuario: dados }),
      logout: () => set({ usuario: null }),
    }),
    { name: 'instant-desk-auth' },
  ),
);