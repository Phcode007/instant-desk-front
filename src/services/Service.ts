import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import type User from '../models/User';
import type { UserRole } from '../models/UserRole';


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 45000, 
});

export const AUTH_UNAUTHORIZED_EVENT = 'instant-desk:unauthorized';
export const AUTH_FORBIDDEN_EVENT = 'instant-desk:forbidden';

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().usuario?.token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      } else if (error.response?.status === 403) {
        window.dispatchEvent(
          new CustomEvent(AUTH_FORBIDDEN_EVENT, {
            detail: { message: 'Você não tem permissão para realizar esta ação.' },
          }),
        );
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const { message } = data;
      if (typeof message === 'string') return message;
      if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
        return message.join(', ');
      }
    }
    if (error.response?.status === 403) {
      return 'Você não tem permissão para realizar esta ação.';
    }
    if (error.response?.status === 401) {
      return 'Sua sessão expirou. Entre novamente.';
    }
  }
  return fallback;
}

export const cadastrarUsuario = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.post<T>(url, dados);
  setDados(resposta.data);
};

export const login = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.post<T>(url, dados);
  setDados(resposta.data);
};

export const buscar = async <T>(
  url: string,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.get<T>(url);
  setDados(resposta.data);
};

export const enviar = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.post<T>(url, dados);
  setDados(resposta.data);
};

export const atualizar = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.put<T>(url, dados);
  setDados(resposta.data);
};

export async function listarUsuarios(): Promise<User[]> {
  const resposta = await api.get<User[]>('/users/all');
  return resposta.data;
}

export async function buscarUsuario(id: number): Promise<User> {
  const resposta = await api.get<User>(`/users/${id}`);
  return resposta.data;
}

export async function alterarPerfilUsuario(id: number, role: UserRole): Promise<User> {
  const resposta = await api.put<User>(`/users/${id}/role`, { role });
  return resposta.data;
}
